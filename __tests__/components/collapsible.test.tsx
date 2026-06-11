import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Collapsible } from '../../components/ui/collapsible';
import { useColorScheme } from '../../hooks/use-color-scheme';

jest.mock('../../hooks/use-color-scheme');
jest.mock('../../hooks/use-theme-color', () => ({
  useThemeColor: jest.fn(() => '#fff'),
}));
jest.mock('../../components/ui/icon-symbol', () => ({
  IconSymbol: ({ name, color }: { name: string; color: string }) => {
    const { Text } = require('react-native');
    return <Text testID="icon-symbol">{name}</Text>;
  },
}));

const mockUseColorScheme = useColorScheme as jest.MockedFunction<typeof useColorScheme>;

beforeEach(() => {
  mockUseColorScheme.mockReturnValue('light');
});

describe('Collapsible', () => {
  it('should render the title', () => {
    render(
      <Collapsible title="Section Title">
        <Text>Hidden content</Text>
      </Collapsible>,
    );

    expect(screen.getByText('Section Title')).toBeTruthy();
  });

  it('should not show children when collapsed (default)', () => {
    render(
      <Collapsible title="Section">
        <Text>Hidden content</Text>
      </Collapsible>,
    );

    expect(screen.queryByText('Hidden content')).toBeNull();
  });

  it('should show children when header is pressed', () => {
    render(
      <Collapsible title="Section">
        <Text>Revealed content</Text>
      </Collapsible>,
    );

    fireEvent.press(screen.getByText('Section'));

    expect(screen.getByText('Revealed content')).toBeTruthy();
  });

  it('should hide children when header is pressed again', () => {
    render(
      <Collapsible title="Section">
        <Text>Toggle content</Text>
      </Collapsible>,
    );

    const header = screen.getByText('Section');

    // Open
    fireEvent.press(header);
    expect(screen.getByText('Toggle content')).toBeTruthy();

    // Close
    fireEvent.press(header);
    expect(screen.queryByText('Toggle content')).toBeNull();
  });
});
