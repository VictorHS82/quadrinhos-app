import { StyleSheet } from 'react-native';
import { AppColors } from '@/constants/colors';

export const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  header: {
    backgroundColor: AppColors.primary,
    padding: 20,
    paddingTop: 30,
  },
  headerTitle: {
    color: AppColors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: AppColors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: AppColors.error,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: AppColors.white,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: AppColors.editButton,
  },
  deleteButton: {
    backgroundColor: AppColors.deleteButton,
  },
  cancelButton: {
    backgroundColor: AppColors.textMuted,
  },
});
