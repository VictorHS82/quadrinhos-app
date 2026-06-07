import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Quadrinho } from '../types/Quadrinho';
import { quadrinhoService } from '../services/QuadrinhoService';
import { getErrorMessage } from '../services/error-utils';

export default function DetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [quadrinho, setQuadrinho] = useState<Quadrinho | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadQuadrinho(parseInt(id));
    }
  }, [id]);

  const loadQuadrinho = async (quadrinhoId: number) => {
    try {
      setLoading(true);
      const quad = await quadrinhoService.getQuadrinhoById(quadrinhoId);
      setQuadrinho(quad);
      if (!quad) {
        Alert.alert('Erro', 'Quadrinho não encontrado');
        router.back();
      }
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('Erro ao carregar quadrinho:', error);
      Alert.alert('Erro', `Não foi possível carregar o quadrinho: ${message}`);
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!quadrinho) return;

    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja deletar "${quadrinho.titulo}"?`,
      [
        { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
        {
          text: 'Deletar',
          onPress: async () => {
            try {
              await quadrinhoService.deleteQuadrinho(quadrinho.id);
              Alert.alert('Sucesso', 'Quadrinho deletado com sucesso');
              router.push('/');
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

  const handleEdit = () => {
    if (quadrinho) {
      router.push(`/edit/${quadrinho.id}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </View>
    );
  }

  if (!quadrinho) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Quadrinho não encontrado</Text>
        </View>
      </View>
    );
  }

  const dataCriacao = new Date(quadrinho.dataCriacao).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Detalhes do Quadrinho</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Título:</Text>
            <Text style={styles.value}>{quadrinho.titulo}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Autor:</Text>
            <Text style={styles.value}>{quadrinho.autor}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Editora:</Text>
            <Text style={styles.value}>{quadrinho.editora}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Ano de Publicação:</Text>
            <Text style={styles.value}>{quadrinho.anoPublicacao}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Data de Criação:</Text>
            <Text style={styles.value}>{dataCriacao}</Text>
          </View>
        </View>

        {quadrinho.descricao && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.description}>{quadrinho.descricao}</Text>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={handleEdit}
          >
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={styles.buttonText}>Deletar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: '40%',
  },
  value: {
    fontSize: 14,
    color: '#666',
    width: '60%',
    flexWrap: 'wrap',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
  },
  backButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
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
  errorText: {
    fontSize: 16,
    color: '#f00',
  },
});
