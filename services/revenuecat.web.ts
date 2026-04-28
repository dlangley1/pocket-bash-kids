export function initRevenueCat(): void {}

export async function checkSubscription(): Promise<boolean> {
  return false;
}

export async function getOfferings(): Promise<any[]> {
  return [];
}

export async function purchasePackage(_pkg: any): Promise<boolean> {
  return false;
}

export async function restorePurchases(): Promise<boolean> {
  return false;
}
