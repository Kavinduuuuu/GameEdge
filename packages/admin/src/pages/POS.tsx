import POSDashboard from '../components/pos/POSDashboard';

export default function POSPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Point of Sale</h1>
      </div>
      <POSDashboard />
    </div>
  );
}
