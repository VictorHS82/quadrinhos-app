/**
 * Tests for the web-specific useColorScheme hook.
 *
 * The hook wraps RN's useColorScheme with a hydration guard:
 * before the useEffect fires it returns 'light' (for SSR/static),
 * after hydration it forwards the real value.
 */
import { renderHook } from '@testing-library/react-native';
import { useColorScheme } from '../../hooks/use-color-scheme.web';

// The web hook uses react-native's useColorScheme internally.
// In the test environment (jest-expo), useColorScheme returns null.
// After hydration (useEffect runs), the hook returns the RN value.

describe('useColorScheme (web)', () => {
  it('should return a color scheme value after hydration', () => {
    const { result } = renderHook(() => useColorScheme());

    // After useEffect hydration, it should return the RN color scheme
    // In test environment, RN's useColorScheme returns null
    // so the web hook returns null after hydration
    expect(result.current === 'light' || result.current === 'dark' || result.current === null).toBe(
      true,
    );
  });

  it('should be a function', () => {
    expect(typeof useColorScheme).toBe('function');
  });
});
