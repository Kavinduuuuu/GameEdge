import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../../api/client';
import DataTable from '../common/DataTable';

export default function UserManagement() {
  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: () => apiGet('/users') });
  const cols = [{key: 'name', label: 'Name'}, {key: 'email', label: 'Email'}, {key: 'role', label: 'Role'}];
  return <DataTable columns={cols} data={users} />;
}
