import MainContent from '../components/MainContent';
import { getAllLots } from '@/lib/features/repositories/lots';

export default async function Home() {
  const initialLots = await getAllLots();
  return <MainContent initialLots={initialLots} />;
}
