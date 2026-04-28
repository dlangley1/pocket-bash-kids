import { Platform } from 'react-native';

const ENTITLEMENT_ID = 'premium';
let initialized = false;

const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

let Purchases: any = null;
if (isNative) {
  Purchases = require('react-native-purchases').default;
}

export function initRevenueCat(): void {
  if (!isNative || !Purchases) return;
  const APPLE_KEY = process.env.EXPO_PUBLIC_REVENUECAT_APPLE_KEY || '';
  const GOOGLE_KEY = process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY || '';
  const key = Platform.OS === 'ios' ? APPLE_KEY : GOOGLE_KEY;
  if (key.startsWith('placeholder')) {
    console.log('[RevenueCat] Placeholder key detected — skipping init');
    return;
  }
  try {
    Purchases.configure({ apiKey: key });
    initialized = true;
  } catch (e) {
    console.warn('[RevenueCat] Init error:', e);
  }
}

export async function checkSubscription(): Promise<boolean> {
  if (!isNative || !initialized) return false;
  try {
    const info = await Purchases.getCustomerInfo();
    return typeof info.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
  } catch (e) {
    console.warn('[RevenueCat] checkSubscription error:', e);
    return false;
  }
}

export async function getOfferings(): Promise<any[]> {
  if (!isNative || !initialized) return [];
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current?.availablePackages || [];
  } catch (e) {
    console.warn('[RevenueCat] getOfferings error:', e);
    return [];
  }
}

export async function purchasePackage(pkg: any): Promise<boolean> {
  if (!isNative || !initialized) return false;
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
  } catch (e: any) {
    if (!e.userCancelled) console.warn('[RevenueCat] purchase error:', e);
    return false;
  }
}

export async function restorePurchases(): Promise<boolean> {
  if (!isNative || !initialized) return false;
  try {
    const info = await Purchases.restorePurchases();
    return typeof info.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
  } catch (e) {
    console.warn('[RevenueCat] restore error:', e);
    return false;
  }
}
