import type { GlobalThemeOverrides } from 'naive-ui'

export const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#171717',
    primaryColorHover: '#2f2f2f',
    primaryColorPressed: '#0a0a0a',
    primaryColorSuppl: '#171717',
    bodyColor: '#ffffff',
    cardColor: '#ffffff',
    modalColor: '#ffffff',
    popoverColor: '#ffffff',
    tableColor: '#ffffff',
    inputColor: '#ffffff',
    actionColor: '#f5f5f5',
    textColorBase: '#171717',
    textColor1: '#171717',
    textColor2: '#525252',
    textColor3: '#8a8a8a',
    dividerColor: '#e5e5e5',
    borderColor: '#e5e5e5',
    hoverColor: 'rgba(23, 23, 23, 0.06)',
    borderRadius: '8px',
    borderRadiusSmall: '6px',
    fontSize: '14px',
    fontSizeMedium: '14px',
    heightMedium: '36px',
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif',
    fontFamilyMono: 'JetBrains Mono, Fira Code, Consolas, monospace',
  },
  Layout: {
    color: '#ffffff',
    siderColor: '#f4f4f4',
    headerColor: '#ffffff',
  },
  Menu: {
    itemTextColorActive: '#171717',
    itemTextColorActiveHover: '#171717',
    itemTextColorChildActive: '#171717',
    itemIconColorActive: '#171717',
    itemIconColorActiveHover: '#171717',
    itemColorActive: 'rgba(23, 23, 23, 0.08)',
    itemColorActiveHover: 'rgba(23, 23, 23, 0.1)',
    arrowColorActive: '#171717',
  },
  Button: {
    textColorPrimary: '#ffffff',
    colorPrimary: '#171717',
    colorHoverPrimary: '#2f2f2f',
    colorPressedPrimary: '#0a0a0a',
  },
  Input: {
    color: '#ffffff',
    colorFocus: '#ffffff',
    border: '1px solid #e5e5e5',
    borderHover: '1px solid #c7c7c7',
    borderFocus: '1px solid #a3a3a3',
    placeholderColor: '#8a8a8a',
    caretColor: '#171717',
  },
  Card: {
    color: '#ffffff',
    borderColor: '#e5e5e5',
  },
  Modal: {
    color: '#ffffff',
  },
  Tag: {
    borderRadius: '6px',
  },
}

export const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#f5f5f5',
    primaryColorHover: '#ffffff',
    primaryColorPressed: '#d4d4d4',
    primaryColorSuppl: '#f5f5f5',
    bodyColor: '#171717',
    cardColor: '#171717',
    modalColor: '#202020',
    popoverColor: '#202020',
    tableColor: '#171717',
    inputColor: '#1f1f1f',
    actionColor: '#202020',
    textColorBase: '#f5f5f5',
    textColor1: '#f5f5f5',
    textColor2: '#d4d4d4',
    textColor3: '#8a8a8a',
    dividerColor: '#333333',
    borderColor: '#333333',
    hoverColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    borderRadiusSmall: '6px',
    fontSize: '14px',
    fontSizeMedium: '14px',
    heightMedium: '36px',
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif',
    fontFamilyMono: 'JetBrains Mono, Fira Code, Consolas, monospace',
  },
  Layout: {
    color: '#171717',
    siderColor: '#202020',
    headerColor: '#171717',
  },
  Menu: {
    itemTextColorActive: '#f5f5f5',
    itemTextColorActiveHover: '#ffffff',
    itemTextColorChildActive: '#f5f5f5',
    itemIconColorActive: '#f5f5f5',
    itemIconColorActiveHover: '#ffffff',
    itemColorActive: 'rgba(255, 255, 255, 0.1)',
    itemColorActiveHover: 'rgba(255, 255, 255, 0.12)',
    arrowColorActive: '#f5f5f5',
  },
  Button: {
    textColorPrimary: '#171717',
    colorPrimary: '#f5f5f5',
    colorHoverPrimary: '#ffffff',
    colorPressedPrimary: '#d4d4d4',
  },
  Input: {
    color: '#1f1f1f',
    colorFocus: '#1f1f1f',
    border: '1px solid #333333',
    borderHover: '1px solid #525252',
    borderFocus: '1px solid #737373',
    placeholderColor: '#8a8a8a',
    caretColor: '#f5f5f5',
  },
  Card: {
    color: '#171717',
    borderColor: '#333333',
  },
  Modal: {
    color: '#202020',
  },
  Tag: {
    borderRadius: '6px',
  },
  Switch: {
    railColor: '#3a3a3a',
    railColorActive: '#66bb6a',
    loadingColor: '#e0e0e0',
    opacityDisabled: 0.4,
  },
}

export function getThemeOverrides(isDark: boolean, isComic?: boolean): GlobalThemeOverrides {
  const base = isDark ? darkThemeOverrides : lightThemeOverrides
  if (!isComic) return base
  const comicFont = "'Comic Neue', 'ZCOOL KuaiLe', 'Zen Maru Gothic', 'Gaegu', cursive, sans-serif"
  return {
    ...base,
    common: {
      ...base.common!,
      fontFamily: comicFont,
    },
  }
}
