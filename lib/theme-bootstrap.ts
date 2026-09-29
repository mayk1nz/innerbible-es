// Runs in <head> before anything paints: applies the member's dark mode from the saved
// app state, so a dark-mode user never sees a flash of parchment. The sales pages
// (quiz, upsells) always stay light.

export const FUNNEL_PATHS = ['/', '/quiz', '/resumen-en-audio', '/resumen-en-audio-oferta', '/palabras-del-senor', '/palabras-del-senor-oferta', '/institucional']

export function themeBootstrap(storageKey: string): string {
  return `try{var p=location.pathname;if(${JSON.stringify(FUNNEL_PATHS)}.indexOf(p)<0){var s=JSON.parse(localStorage.getItem(${JSON.stringify(storageKey)})||'{}');if(s.theme==='dark')document.documentElement.setAttribute('data-theme','dark')}}catch(e){}`
}
