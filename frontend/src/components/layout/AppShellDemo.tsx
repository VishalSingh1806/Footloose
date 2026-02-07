import { BrowserRouter } from 'react-router-dom';
import AppShell from './AppShell';

/**
 * Demo wrapper for AppShell with Router
 * This demonstrates the complete app shell with navigation
 */
function AppShellDemo() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default AppShellDemo;
