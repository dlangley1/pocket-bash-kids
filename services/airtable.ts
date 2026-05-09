const TOKEN = process.env.EXPO_PUBLIC_AIRTABLE_TOKEN;
const BASE_ID = process.env.EXPO_PUBLIC_AIRTABLE_BASE_ID;
const TABLE = 'Customer Database';
const VIEW = 'Kids Party Guide';

export interface Business {
  id: string;
  name: string;
  category: string;       // primary display category (first value)
  categories: string[];   // all selected categories for filtering
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  instagram: string;
  address: string;
  description: string;
  packages: string;
  status: 'Premium' | 'Featured' | 'Free';
  primaryImage: string;
  additionalImages: string[];
  listingUrl: string;
  specialOffer: string;
  specialOfferDetails: string;
  area: string;
  ageGroups: string[];
}

function mapRecord(record: any): Business {
  const f = record.fields;
  const addr1 = f['Address Line 1'] || '';
  const addr2 = f['Address Line 2'] || '';
  const address = addr1 && addr2 ? `${addr1}, ${addr2}` : addr1 || addr2;

  const additionalImages: string[] = [];
  if (Array.isArray(f['Additional Images'])) {
    for (const att of f['Additional Images']) {
      if (att?.url) additionalImages.push(att.url);
    }
  }

  return {
    id: record.id,
    name: f['Business Name'] || '',
    category: Array.isArray(f['Party Category']) ? (f['Party Category']?.[0] || '') : (f['Party Category'] || ''),
    categories: Array.isArray(f['Party Category']) ? f['Party Category'] : (f['Party Category'] ? [f['Party Category']] : []),
    phone: f['Business Contact Number'] || '',
    whatsapp: f['WhatsApp Number'] || '',
    email: f['Email'] || f['Email Address'] || '',
    website: f['Website'] || '',
    instagram: f['Instagram Handle'] || '',
    address,
    description: f['Business Description'] || '',
    packages: f['Party Packages'] || '',
    status: (Array.isArray(f['Type of Listing']) ? (f['Type of Listing']?.[0] || 'Free') : (f['Type of Listing'] || 'Free')) as Business['status'],
    primaryImage: Array.isArray(f['Primary Image']) ? (f['Primary Image']?.[0]?.url || '') : (f['Primary Image'] || ''),
    additionalImages,
    listingUrl: '',
    specialOffer: f['Special Offer'] || '',
    specialOfferDetails: f['Special Offer Details'] || '',
    area: f['Area / Location'] || '',
    ageGroups: (Array.isArray(f['Age Group']) ? f['Age Group'] : (f['Age Group'] ? [f['Age Group']] : [])).map((ag: string) => ag.trim().replace(/\u2013/g, '-').replace(/\s+/g, ' ')),
  };
}

export async function fetchAllBusinesses(): Promise<Business[]> {
  const results: Business[] = [];
  let offset: string | undefined;

  do {
    const params = new URLSearchParams({
      view: VIEW,
      pageSize: '100',
    });
    if (offset) params.set('offset', offset);

    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}?${params}`,
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );

    if (!res.ok) throw new Error(`Airtable error: ${res.status}`);
    const data = await res.json();
    results.push(...data.records.map(mapRecord));
    offset = data.offset;
  } while (offset);

  // Deduplicate by business name, keeping the highest-tier entry
  const seen = new Map<string, Business>();
  const order = { Premium: 0, Featured: 1, Free: 2 };
  for (const b of results) {
    const key = b.name.trim().toLowerCase();
    const existing = seen.get(key);
    if (!existing || (order[b.status] ?? 2) < (order[existing.status] ?? 2)) {
      seen.set(key, b);
    }
  }
  return sortBusinesses(Array.from(seen.values()));
}

export function sortBusinesses(businesses: Business[]): Business[] {
  const order = { Premium: 0, Featured: 1, Free: 2 };
  return [...businesses].sort((a, b) => (order[a.status] ?? 2) - (order[b.status] ?? 2));
}
