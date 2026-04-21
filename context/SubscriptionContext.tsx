import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { checkSubscription, initRevenueCat } from '../services/revenuecat';

interface SubscriptionContextValue {
  isSubscribed: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextValue>({
  isSubscribed: false,
  loading: true,
  refresh: async () => {},
});

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const result = await checkSubscription();
      setIsSubscribed(result);
    } catch {
      setIsSubscribed(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initRevenueCat();
    refresh();
  }, []);

  return (
    <SubscriptionContext.Provider value={{ isSubscribed, loading, refresh }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
