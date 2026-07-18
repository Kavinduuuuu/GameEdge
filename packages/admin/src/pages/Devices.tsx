import DeviceList from '../components/devices/DeviceList';

export default function DevicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Device Management</h1>
      </div>
      <DeviceList />
    </div>
  );
}
