import { Platform } from 'react-native';
import Purchases, { PurchasesPackage } from 'react-native-purchases';

const APPLE_KEY = process.env.EXPO_PUBLIC_REVENUECAT_APPLE_KEY || '';
const GOOGLE_KEY = process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY || '';
const ENTITLEMENT_ID = 'premium';

let initialized = false;

export function initRevenueCat(): void {
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
  if (!initialized) return false;
  try {
    const info = await Purchases.getCustomerInfo();
    return typeof info.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
  } catch (e) {
    console.warn('[RevenueCat] checkSubscription error:', e);
    return false;
  }
}

export async function getOfferings(): Promise<PurchasesPackage[]> {
  if (!initialized) return [];
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current?.availablePackages || [];
  } catch (e) {
    console.warn('[RevenueCat] getOfferings error:', e);
    return [];
  }
}

export async function purchasePackage(pkg: PurchasesPackage): Promise<boolean> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
  } catch (e: any) {
    if (!e.userCancelled) console.warn('[RevenueCat] purchase error:', e);
    return false;
  }
}

export async function restorePurchases(): Promise<boolean> {
  if (!initialized) return false;
  try {
    const info = await Purchases.restorePurchases();
    return typeof info.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
  } catch (e) {
    console.warn('[RevenueCat] restore error:', e);
    return false;
  }
}
