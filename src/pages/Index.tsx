
import React from 'react';
import POSLayout from '@/components/pos/POSLayout';
import { POSProvider } from '@/contexts/POSContext';

const Index = () => {
  return (
    <POSProvider>
      <POSLayout />
    </POSProvider>
  );
};

export default Index;
