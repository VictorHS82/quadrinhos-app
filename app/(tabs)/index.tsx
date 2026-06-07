import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import HomeScreen from '@/screens/HomeScreen';
import { initializeDatabase } from '@/database/db';
import { getErrorMessage } from '@/services/error-utils';

export default function Home() {
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  const initDb = async () => {
    try {
      setDbError(null);
      await initializeDatabase();
      setDbReady(true);
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('Erro ao inicializar banco de dados:', error);
      setDbError(message);
      Alert.alert(
        'Erro de Inicialização',
        `Não foi possível inicializar o banco de dados: ${message}`
      );
    }
  };

  useEffect(() => {
    initDb();
  }, []);

  if (dbError) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Erro ao inicializar</Text>
        <Text style={styles.message}>
          Não foi possível inicializar o banco de dados.
        </Text>
        {__DEV__ && <Text style={styles.details}>{dbError}</Text>}
        <TouchableOpacity style={styles.button} onPress={initDb}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!dbReady) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Inicializando...</Text>
      </View>
    );
  }

  return <HomeScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  details: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#6200ee',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});
