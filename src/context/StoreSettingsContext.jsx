import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const StoreSettingsContext = createContext();

export const useStoreSettings = () => useContext(StoreSettingsContext);

// Default values — shown if nothing is saved in the database yet
const DEFAULTS = {
  storeName: 'Pothowar Electric',
  whatsapp: '+92 3348700655',
  phone: '051-5530360',
  email: 'info@pothowarelectric.pk',
  address: 'Iqbal Road Cometti Chowk Near Shirin Bakery, Rawalpindi, Pakistan',
};

export const StoreSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

      if (!error && data && data.length > 0) {
        const mapped = {};
        data.forEach(row => { mapped[row.key] = row.value; });
        setSettings({ ...DEFAULTS, ...mapped });
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  return (
    <StoreSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </StoreSettingsContext.Provider>
  );
};
