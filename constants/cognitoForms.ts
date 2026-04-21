export const VENUE_FORMS: Record<string, string> = {
  'All Ages': 'https://www.cognitoforms.com/CreativeYellowBuyAndSellSilverLakes/TinyTots13VenueEnquiryForm',
  'Tiny Tots (1-3)': 'https://www.cognitoforms.com/CreativeYellowBuyAndSellSilverLakes/TinyTots13VenueEnquiryForm',
  'Little Party Animals (3-6)': 'https://www.cognitoforms.com/CreativeYellowBuyAndSellSilverLakes/LittlePartyAnimals36VenueEnquiryForm',
  'Wild Ones (7-10)': 'https://www.cognitoforms.com/CreativeYellowBuyAndSellSilverLakes/WildOnes710VenueEnquiryForm',
  'Tweens (11-13)': 'https://www.cognitoforms.com/CreativeYellowBuyAndSellSilverLakes/Tweens1113VenueEnquiryForm',
};

export const CATEGORY_FORMS: Record<string, string> = {
  'Restaurant with Kids Play Area': 'https://www.cognitoforms.com/CreativeYellowBuyAndSellSilverLakes/RestaurantsWithKidsPlayAreasEnquiryForm',
  'Party Cakes': 'https://www.cognitoforms.com/CreativeYellowBuyAndSellSilverLakes/PartyCakesEnquiryForm',
  'Balloons': 'https://www.cognitoforms.com/CreativeYellowBuyAndSellSilverLakes/BalloonsEnquiryForm',
  'Party Entertainment': 'https://www.cognitoforms.com/CreativeYellowBuyAndSellSilverLakes/PartyEntertainmentEnquiryForm',
  'Party Supplies': 'https://www.cognitoforms.com/CreativeYellowBuyAndSellSilverLakes/PartySuppliesEnquiryForm',
  'Party Catering': 'https://www.cognitoforms.com/CreativeYellowBuyAndSellSilverLakes/PartyCateringEnquiryForm',
  'Photographers': 'https://www.cognitoforms.com/CreativeYellowBuyAndSellSilverLakes/PhotographersEnquiryForm',
  'Party Decor': 'https://www.cognitoforms.com/CreativeYellowBuyAndSellSilverLakes/PartyDecorEnquiryForm',
  'Party Coordinators': 'https://www.cognitoforms.com/CreativeYellowBuyAndSellSilverLakes/PartyCoordinatorsEnquiryForm',
  'Mobile Food Trucks': 'https://www.cognitoforms.com/CreativeYellowBuyAndSellSilverLakes/MobileFoodTrucksEnquiryForm',
  'Biscuits & Cookies': 'https://www.cognitoforms.com/CreativeYellowBuyAndSellSilverLakes/BiscuitsCookiesEnquiryForm',
};

export function getCognitoUrl(category: string, ageGroup?: string): string | null {
  if (category === 'Party Venues') {
    if (!ageGroup || ageGroup === 'Teens (13+)') return null;
    return VENUE_FORMS[ageGroup] || VENUE_FORMS['All Ages'];
  }
  if (category === 'Other' || category === 'Party Entertainment') return null;
  return CATEGORY_FORMS[category] || null;
}
