import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../../api/client';
import DataTable from '../common/DataTable';

export default function ReviewModeration() {
  const { data: reviews = [] } = useQuery({ queryKey: ['reviews'], queryFn: () => apiGet('/reviews?pending=true') });
  const cols = [{key: 'gameName', label: 'Game'}, {key: 'rating', label: 'Rating'}, {key: 'comment', label: 'Comment'}];
  return <DataTable columns={cols} data={reviews} />;
}
