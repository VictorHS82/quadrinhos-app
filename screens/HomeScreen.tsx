import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Quadrinho } from '../types/Quadrinho';
import { quadrinhoService } from '../services/QuadrinhoService';
import { getErrorMessage } from '../services/error-utils';

export default function HomeScreen() {
  const [quadrinhos, setQuadrinhos] = useState<Quadrinho[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const loadQuadrinhos = useCallback(async () => {
    try {
      setLoading(true);
      if (searchQuery.trim()) {
        const results = await quadrinhoService.searchQuadrinhos(searchQuery);
        setQuadrinhos(results);
      } else {
        const data = await quadrinhoService.getAllQuadrinhos();
        setQuadrinhos(data);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('Erro ao carregar quadrinhos:', error);
      Alert.alert('Erro', `Não foi possível carregar os quadrinhos: ${message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery]);

  useFocusEffect(
    useCallback(() => {
      loadQuadrinhos();
    }, [loadQuadrinhos])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadQuadrinhos();
  };

  const handleDelete = (id: number, titulo: string) => {
    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja deletar "${titulo}"?`,
      [
        { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
        {
          text: 'Deletar',
          onPress: async () => {
            try {
              await quadrinhoService.deleteQuadrinho(id);
              Alert.alert('Sucesso', 'Quadrinho deletado com sucesso');
              loadQuadrinhos();
            } catch (error) {
              const message = getErrorMessage(error);
              console.error('Erro ao deletar quadrinho:', error);
              Alert.alert('Erro', `Não foi possível deletar o quadrinho: ${message}`);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Quadrinho }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/detail/${item.id}`)}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
        <Text style={styles.cardAutor}>Autor: {item.autor}</Text>
        <Text style={styles.cardEditora}>Editora: {item.editora}</Text>
        <Text style={styles.cardAno}>Ano: {item.anoPublicacao}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => router.push(`/edit/${item.id}`)}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDelete(item.id, item.titulo)}
        >
          <Text style={styles.buttonText}>Deletar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Quadrinhos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add')}
        >
          <Text style={styles.addButtonText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por título, autor ou editora..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : quadrinhos.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>
            {searchQuery ? 'Nenhum quadrinho encontrado' : 'Nenhum quadrinho adicionado ainda'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={quadrinhos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6200ee',
    padding: 20,
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#6200ee',
    fontWeight: '600',
  },
  searchInput: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardContent: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardAutor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  cardEditora: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  cardAno: {
    fontSize: 14,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
