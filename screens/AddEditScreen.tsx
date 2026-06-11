import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { quadrinhoService } from '../services/QuadrinhoService';
import { AppColors } from '../constants/colors';
import { sharedStyles } from '../styles/shared';
import { showError, showSuccess } from '../utils/alerts';
import { useQuadrinho } from '../hooks/use-quadrinho';

export default function AddEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { quadrinho, loading: loadingQuadrinho } = useQuadrinho(id);
  const [saving, setSaving] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [editora, setEditora] = useState('');
  const [anoPublicacao, setAnoPublicacao] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    if (quadrinho) {
      setTitulo(quadrinho.titulo);
      setAutor(quadrinho.autor);
      setEditora(quadrinho.editora);
      setAnoPublicacao(quadrinho.anoPublicacao.toString());
      setDescricao(quadrinho.descricao || '');
    }
  }, [quadrinho]);

  const handleSave = async () => {
    const trimmedTitulo = titulo.trim();
    const trimmedAutor = autor.trim();
    const trimmedEditora = editora.trim();
    const trimmedDescricao = descricao.trim();

    if (!trimmedTitulo || !trimmedAutor || !trimmedEditora || !anoPublicacao.trim()) {
      showError('Preencha todos os campos obrigatórios');
      return;
    }

    const ano = parseInt(anoPublicacao, 10);
    if (isNaN(ano) || ano < 0 || ano > new Date().getFullYear()) {
      showError('Ano de publicação inválido');
      return;
    }

    try {
      setSaving(true);
      const input = {
        titulo: trimmedTitulo,
        autor: trimmedAutor,
        editora: trimmedEditora,
        anoPublicacao: ano,
        descricao: trimmedDescricao,
      };

      if (id) {
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId) || parsedId <= 0) {
          showError('ID do quadrinho inválido');
          return;
        }
        await quadrinhoService.updateQuadrinho(parsedId, input);
        showSuccess('Quadrinho atualizado com sucesso');
      } else {
        await quadrinhoService.createQuadrinho(input);
        showSuccess('Quadrinho adicionado com sucesso');
      }
      router.push('/');
    } catch (error) {
      showError('Não foi possível salvar o quadrinho', error);
    } finally {
      setSaving(false);
    }
  };

  const busy = loadingQuadrinho || saving;

  return (
    <ScrollView style={sharedStyles.container}>
      <View style={sharedStyles.header}>
        <Text style={sharedStyles.headerTitle}>{id ? 'Editar Quadrinho' : 'Novo Quadrinho'}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o título"
            value={titulo}
            onChangeText={setTitulo}
            editable={!busy}
            maxLength={200}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Autor *</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o autor"
            value={autor}
            onChangeText={setAutor}
            editable={!busy}
            maxLength={150}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Editora *</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a editora"
            value={editora}
            onChangeText={setEditora}
            editable={!busy}
            maxLength={150}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Ano de Publicação *</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o ano"
            value={anoPublicacao}
            onChangeText={setAnoPublicacao}
            keyboardType="number-pad"
            editable={!busy}
            maxLength={4}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Digite uma descrição"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={4}
            editable={!busy}
            maxLength={1000}
          />
        </View>

        <TouchableOpacity
          style={[sharedStyles.button, styles.primaryButton, busy && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={busy}
        >
          <Text style={[sharedStyles.buttonText, styles.primaryButtonText]}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[sharedStyles.button, sharedStyles.cancelButton, styles.primaryButton]}
          onPress={() => router.back()}
          disabled={busy}
        >
          <Text style={[sharedStyles.buttonText, styles.primaryButtonText]}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: AppColors.white,
    borderColor: AppColors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: AppColors.textPrimary,
  },
  textArea: {
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: AppColors.primary,
    marginVertical: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontSize: 16,
  },
});
