import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Quadrinho, CreateQuadrinhoInput } from '../types/Quadrinho';
import { quadrinhoService } from '../services/QuadrinhoService';

export default function AddEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [editora, setEditora] = useState('');
  const [anoPublicacao, setAnoPublicacao] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    if (id) {
      loadQuadrinho(parseInt(id));
    }
  }, [id]);

  const loadQuadrinho = async (quadrinhoId: number) => {
    try {
      setLoading(true);
      const quad = await quadrinhoService.getQuadrinhoById(quadrinhoId);
      if (quad) {
        setTitulo(quad.titulo);
        setAutor(quad.autor);
        setEditora(quad.editora);
        setAnoPublicacao(quad.anoPublicacao.toString());
        setDescricao(quad.descricao || '');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar o quadrinho');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!titulo.trim() || !autor.trim() || !editora.trim() || !anoPublicacao.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const ano = parseInt(anoPublicacao);
    if (isNaN(ano) || ano < 0 || ano > new Date().getFullYear()) {
      Alert.alert('Erro', 'Ano de publicação inválido');
      return;
    }

    try {
      setLoading(true);
      if (id) {
        // Atualizar
        await quadrinhoService.updateQuadrinho(parseInt(id), {
          titulo,
          autor,
          editora,
          anoPublicacao: ano,
          descricao,
        });
        Alert.alert('Sucesso', 'Quadrinho atualizado com sucesso');
      } else {
        // Criar novo
        await quadrinhoService.createQuadrinho({
          titulo,
          autor,
          editora,
          anoPublicacao: ano,
          descricao,
        });
        Alert.alert('Sucesso', 'Quadrinho adicionado com sucesso');
      }
      router.push('/');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o quadrinho');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{id ? 'Editar Quadrinho' : 'Novo Quadrinho'}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o título"
            value={titulo}
            onChangeText={setTitulo}
            editable={!loading}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Autor *</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o autor"
            value={autor}
            onChangeText={setAutor}
            editable={!loading}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Editora *</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a editora"
            value={editora}
            onChangeText={setEditora}
            editable={!loading}
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
            editable={!loading}
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
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Salvando...' : 'Salvar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
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
  form: {
    padding: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
