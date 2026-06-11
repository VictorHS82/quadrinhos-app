import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { quadrinhoService } from '../services/QuadrinhoService';
import { AppColors } from '../constants/colors';
import { sharedStyles } from '../styles/shared';
import { confirmDelete, showError, showSuccess } from '../utils/alerts';
import { useQuadrinho } from '../hooks/use-quadrinho';
import { StatusView } from '../components/loading-view';

export default function DetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { quadrinho, loading } = useQuadrinho(id);

  const handleDelete = () => {
    if (!quadrinho) return;

    confirmDelete(quadrinho.titulo, async () => {
      try {
        await quadrinhoService.deleteQuadrinho(quadrinho.id);
        showSuccess('Quadrinho deletado com sucesso');
        router.push('/');
      } catch {
        showError('Não foi possível deletar o quadrinho');
      }
    });
  };

  const handleEdit = () => {
    if (quadrinho) {
      router.push(`/edit/${quadrinho.id}`);
    }
  };

  if (loading) {
    return (
      <View style={sharedStyles.container}>
        <StatusView message="Carregando..." />
      </View>
    );
  }

  if (!quadrinho) {
    return (
      <View style={sharedStyles.container}>
        <StatusView message="Quadrinho não encontrado" type="error" />
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
    <ScrollView style={sharedStyles.container}>
      <View style={sharedStyles.header}>
        <Text style={sharedStyles.headerTitle}>Detalhes do Quadrinho</Text>
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
            style={[sharedStyles.button, sharedStyles.editButton, styles.actionButton]}
            onPress={handleEdit}
          >
            <Text style={[sharedStyles.buttonText, styles.actionButtonText]}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[sharedStyles.button, sharedStyles.deleteButton, styles.actionButton]}
            onPress={handleDelete}
          >
            <Text style={[sharedStyles.buttonText, styles.actionButtonText]}>Deletar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[sharedStyles.button, sharedStyles.cancelButton, styles.actionButton]}
            onPress={() => router.back()}
          >
            <Text style={[sharedStyles.buttonText, styles.actionButtonText]}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: AppColors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.primary,
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
    color: AppColors.textPrimary,
    width: '40%',
  },
  value: {
    fontSize: 14,
    color: AppColors.textSecondary,
    width: '60%',
    flexWrap: 'wrap',
  },
  description: {
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 16,
  },
  actionButton: {
    flex: 1,
    paddingHorizontal: 8,
  },
  actionButtonText: {
    fontSize: 14,
  },
});
