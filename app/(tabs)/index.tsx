import { useEffect } from 'react';
import HomeScreen from '@/screens/HomeScreen';
import { initializeDatabase } from '@/database/db';

export default function Home() {
  useEffect(() => {
    initializeDatabase().catch((error) => {
      if (__DEV__) console.error('Erro ao inicializar banco de dados:', error);
    });
  }, []);

  return <HomeScreen />;
}
