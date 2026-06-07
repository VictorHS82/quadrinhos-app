import { Alert } from 'react-native';

export function showError(message: string): void {
  Alert.alert('Erro', message);
}

export function showSuccess(message: string): void {
  Alert.alert('Sucesso', message);
}

export function confirmDelete(
  title: string,
  onConfirm: () => void | Promise<void>,
): void {
  Alert.alert(
    'Confirmar exclusão',
    `Tem certeza que deseja deletar "${title}"?`,
    [
      { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
      {
        text: 'Deletar',
        onPress: onConfirm,
        style: 'destructive',
      },
    ],
  );
}
