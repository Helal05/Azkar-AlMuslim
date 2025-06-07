
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Removed initial theme/font-size logic from here.
// AppSettingsProvider will handle applying theme/font-size via useEffect.

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  } else {
    console.error('Root element not found!');
  }
});
