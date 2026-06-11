import { Alert } from 'react-native';

/**
 * Extracts a human-readable message from an unknown error value.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Erro desconhecido';
}

export function showError(message: string, error?: unknown): void {
  const detail = error != null ? getErrorMessage(error) : null;
  const fullMessage = detail ? `${message}: ${detail}` : message;
  if (__DEV__ && error != null) console.error(message, error);
  Alert.alert('Erro', fullMessage);
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
