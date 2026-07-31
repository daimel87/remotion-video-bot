/**
 * Font loading for remotion-scenes.
 *
 * Uses a system font stack instead of fetching Inter from Google Fonts at
 * render time -- keeps renders working offline / behind restrictive
 * proxies, with no visible difference for these UI-style demo scenes.
 */

export const font =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Arial, sans-serif';
