'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/customer/me')
      .then((r) => r.json())
      .then((d) => { if (d.authenticated) setCustomer(d.customer); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch('/api/customer/login', { method: 'DELETE' });
    setCustomer(null);
  };

  return (
    <CustomerContext.Provider value={{ customer, setCustomer, loading, logout }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  return useContext(CustomerContext);
}
