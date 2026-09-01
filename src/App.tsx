import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppRouter } from './router';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
};

export default App;
