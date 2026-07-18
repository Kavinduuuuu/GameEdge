import UserManagement from '../components/users/UserManagement';

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
      </div>
      <UserManagement />
    </div>
  );
}
