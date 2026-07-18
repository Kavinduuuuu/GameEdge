import { useState } from 'react';
interface Item { id: string; name: string; price: number; stock: number; category: string; }

export default function ProductGrid({ items }: { items: Item[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {items.map(item => (
        <div key={item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl hover:border-blue-500/50 transition-colors">
          <h3 className="font-bold text-white">{item.name}</h3>
          <p className="text-blue-400 font-mono">${item.price.toFixed(2)}</p>
          <div className={`text-xs ${item.stock < 5 ? 'text-amber-400' : 'text-green-400'}`}>Stock: {item.stock}</div>
        </div>
      ))}
    </div>
  );
}
