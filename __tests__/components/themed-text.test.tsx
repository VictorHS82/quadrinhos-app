import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ThemedText } from '../../components/themed-text';
import { useThemeColor } from '../../hooks/use-theme-color';

jest.mock('../../hooks/use-theme-color');

const mockUseThemeColor = useThemeColor as jest.MockedFunction<typeof useThemeColor>;

beforeEach(() => {
  mockUseThemeColor.mockReturnValue('#11181C');
});

describe('ThemedText', () => {
  it('should render text with the theme color', () => {
    render(<ThemedText>Hello</ThemedText>);

    const text = screen.getByText('Hello');
    expect(text).toBeTruthy();
    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: '#11181C' })]),
    );
  });

  it('should apply default style by default', () => {
    render(<ThemedText>Default</ThemedText>);

    const text = screen.getByText('Default');
    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ fontSize: 16, lineHeight: 24 })]),
    );
  });

  it('should apply title style when type is title', () => {
    render(<ThemedText type="title">Title</ThemedText>);

    const text = screen.getByText('Title');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontSize: 32, fontWeight: 'bold', lineHeight: 32 }),
      ]),
    );
  });

  it('should apply subtitle style when type is subtitle', () => {
    render(<ThemedText type="subtitle">Subtitle</ThemedText>);

    const text = screen.getByText('Subtitle');
    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ fontSize: 20, fontWeight: 'bold' })]),
    );
  });

  it('should apply defaultSemiBold style', () => {
    render(<ThemedText type="defaultSemiBold">Semi</ThemedText>);

    const text = screen.getByText('Semi');
    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ fontWeight: '600' })]),
    );
  });

  it('should apply link style', () => {
    render(<ThemedText type="link">Link</ThemedText>);

    const text = screen.getByText('Link');
    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: '#0a7ea4' })]),
    );
  });

  it('should pass lightColor and darkColor to useThemeColor', () => {
    render(
      <ThemedText lightColor="#fff" darkColor="#000">
        Themed
      </ThemedText>,
    );

    expect(mockUseThemeColor).toHaveBeenCalledWith(
      { light: '#fff', dark: '#000' },
      'text',
    );
  });

  it('should merge additional style prop', () => {
    render(<ThemedText style={{ marginTop: 10 }}>Styled</ThemedText>);

    const text = screen.getByText('Styled');
    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ marginTop: 10 })]),
    );
  });
});
