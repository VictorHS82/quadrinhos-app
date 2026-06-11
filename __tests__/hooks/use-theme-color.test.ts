import { renderHook } from '@testing-library/react-native';
import { useThemeColor } from '../../hooks/use-theme-color';
import { useColorScheme } from '../../hooks/use-color-scheme';

jest.mock('../../hooks/use-color-scheme');

const mockUseColorScheme = useColorScheme as jest.MockedFunction<typeof useColorScheme>;

describe('useThemeColor', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the light color from props when theme is light', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() =>
      useThemeColor({ light: '#custom-light', dark: '#custom-dark' }, 'text'),
    );

    expect(result.current).toBe('#custom-light');
  });

  it('should return the dark color from props when theme is dark', () => {
    mockUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() =>
      useThemeColor({ light: '#custom-light', dark: '#custom-dark' }, 'text'),
    );

    expect(result.current).toBe('#custom-dark');
  });

  it('should fall back to Colors.light when no prop color and theme is light', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() => useThemeColor({}, 'text'));

    expect(result.current).toBe('#11181C'); // Colors.light.text
  });

  it('should fall back to Colors.dark when no prop color and theme is dark', () => {
    mockUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() => useThemeColor({}, 'text'));

    expect(result.current).toBe('#ECEDEE'); // Colors.dark.text
  });

  it('should default to light theme when useColorScheme returns null', () => {
    mockUseColorScheme.mockReturnValue(null);

    const { result } = renderHook(() => useThemeColor({}, 'background'));

    expect(result.current).toBe('#fff'); // Colors.light.background
  });

  it('should return correct tint color for each theme', () => {
    mockUseColorScheme.mockReturnValue('light');
    const { result: lightResult } = renderHook(() => useThemeColor({}, 'tint'));
    expect(lightResult.current).toBe('#0a7ea4');

    mockUseColorScheme.mockReturnValue('dark');
    const { result: darkResult } = renderHook(() => useThemeColor({}, 'tint'));
    expect(darkResult.current).toBe('#fff');
  });
});
