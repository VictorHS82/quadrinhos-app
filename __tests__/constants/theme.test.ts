import { Colors, Fonts } from '../../constants/theme';

describe('Colors', () => {
  it('should define light theme colors', () => {
    expect(Colors.light).toBeDefined();
    expect(Colors.light.text).toBe('#11181C');
    expect(Colors.light.background).toBe('#fff');
    expect(Colors.light.tint).toBe('#0a7ea4');
    expect(Colors.light.icon).toBe('#687076');
    expect(Colors.light.tabIconDefault).toBe('#687076');
    expect(Colors.light.tabIconSelected).toBe('#0a7ea4');
  });

  it('should define dark theme colors', () => {
    expect(Colors.dark).toBeDefined();
    expect(Colors.dark.text).toBe('#ECEDEE');
    expect(Colors.dark.background).toBe('#151718');
    expect(Colors.dark.tint).toBe('#fff');
    expect(Colors.dark.icon).toBe('#9BA1A6');
    expect(Colors.dark.tabIconDefault).toBe('#9BA1A6');
    expect(Colors.dark.tabIconSelected).toBe('#fff');
  });

  it('should have the same keys in both themes', () => {
    const lightKeys = Object.keys(Colors.light).sort();
    const darkKeys = Object.keys(Colors.dark).sort();
    expect(lightKeys).toEqual(darkKeys);
  });
});

describe('Fonts', () => {
  it('should define font families', () => {
    expect(Fonts).toBeDefined();
    expect(Fonts).toHaveProperty('sans');
    expect(Fonts).toHaveProperty('serif');
    expect(Fonts).toHaveProperty('mono');
  });
});
