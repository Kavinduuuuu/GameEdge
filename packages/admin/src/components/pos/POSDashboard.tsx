import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../../api/client';
import ProductGrid from './ProductGrid';
import Cart from './Cart';

export default function POSDashboard() {
  const { data: items = [] } = useQuery({ queryKey: ['posItems'], queryFn: () => apiGet('/pos/items') });
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2"><ProductGrid items={items} /></div>
      <div className="lg:col-span-1"><Cart /></div>
    </div>
  );
}
