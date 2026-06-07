import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Quadrinho } from '../types/Quadrinho';
import { quadrinhoService } from '../services/QuadrinhoService';
import { AppColors } from '../constants/colors';
import { sharedStyles } from '../styles/shared';
import { confirmDelete, showError, showSuccess } from '../utils/alerts';
import { StatusView } from '../components/loading-view';

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
      console.error('Erro ao carregar quadrinhos:', error);
      showError('Não foi possível carregar os quadrinhos');
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
    confirmDelete(titulo, async () => {
      try {
        await quadrinhoService.deleteQuadrinho(id);
        showSuccess('Quadrinho deletado com sucesso');
        loadQuadrinhos();
      } catch {
        showError('Não foi possível deletar o quadrinho');
      }
    });
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
          style={[sharedStyles.button, sharedStyles.editButton, styles.cardButton]}
          onPress={() => router.push(`/edit/${item.id}`)}
        >
          <Text style={[sharedStyles.buttonText, styles.cardButtonText]}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[sharedStyles.button, sharedStyles.deleteButton, styles.cardButton]}
          onPress={() => handleDelete(item.id, item.titulo)}
        >
          <Text style={[sharedStyles.buttonText, styles.cardButtonText]}>Deletar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={sharedStyles.container}>
      <View style={[sharedStyles.header, styles.headerRow]}>
        <Text style={sharedStyles.headerTitle}>Meus Quadrinhos</Text>
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
        <StatusView message="Carregando..." />
      ) : quadrinhos.length === 0 ? (
        <StatusView
          message={searchQuery ? 'Nenhum quadrinho encontrado' : 'Nenhum quadrinho adicionado ainda'}
          type="empty"
        />
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: AppColors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: AppColors.primary,
    fontWeight: '600',
  },
  searchInput: {
    backgroundColor: AppColors.white,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderColor: AppColors.border,
    borderWidth: 1,
  },
  card: {
    backgroundColor: AppColors.white,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    padding: 12,
    shadowColor: AppColors.shadow,
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
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  cardAutor: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 2,
  },
  cardEditora: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 2,
  },
  cardAno: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  cardButtonText: {
    fontSize: 12,
  },
});
