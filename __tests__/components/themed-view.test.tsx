import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemedView } from '../../components/themed-view';
import { useThemeColor } from '../../hooks/use-theme-color';

jest.mock('../../hooks/use-theme-color');

const mockUseThemeColor = useThemeColor as jest.MockedFunction<typeof useThemeColor>;

beforeEach(() => {
  mockUseThemeColor.mockReturnValue('#fff');
});

describe('ThemedView', () => {
  it('should render children correctly', () => {
    render(
      <ThemedView>
        <Text>Child content</Text>
      </ThemedView>,
    );

    expect(screen.getByText('Child content')).toBeTruthy();
  });

  it('should apply background color from theme', () => {
    mockUseThemeColor.mockReturnValue('#151718');

    const { toJSON } = render(
      <ThemedView testID="themed-view">
        <Text>Content</Text>
      </ThemedView>,
    );

    const tree = toJSON();
    expect(tree).not.toBeNull();
    // The root View should have the background color
    const rootStyle = (tree as { props: { style: Record<string, unknown>[] } }).props.style;
    expect(rootStyle).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: '#151718' })]),
    );
  });

  it('should pass lightColor and darkColor to useThemeColor', () => {
    render(
      <ThemedView lightColor="#eee" darkColor="#333">
        <Text>Content</Text>
      </ThemedView>,
    );

    expect(mockUseThemeColor).toHaveBeenCalledWith(
      { light: '#eee', dark: '#333' },
      'background',
    );
  });

  it('should merge additional style prop', () => {
    const { toJSON } = render(
      <ThemedView style={{ padding: 20 }}>
        <Text>Content</Text>
      </ThemedView>,
    );

    const tree = toJSON();
    const rootStyle = (tree as { props: { style: Record<string, unknown>[] } }).props.style;
    expect(rootStyle).toEqual(
      expect.arrayContaining([expect.objectContaining({ padding: 20 })]),
    );
  });
});
