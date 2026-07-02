import { useSessionStore } from './store/useSessionStore';
import { LoginScreen }     from './components/auth/LoginScreen';
import { DashboardLayout } from './components/layout/DashboardLayout';

/**
 * App — Root component. Thin orchestrator.
 * Renders <LoginScreen> when no user is authenticated,
 * otherwise renders <DashboardLayout> which contains Sidebar + active screen.
 */
function App() {
  const currentUser = useSessionStore((s) => s.currentUser);
  return currentUser ? <DashboardLayout /> : <LoginScreen />;
}

export default App;