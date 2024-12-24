import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/auth-context';
import { ThemeProvider } from './contexts/theme-context';
import { NotificationProvider } from './contexts/NotificationContext';
import { HomePage } from './pages/home';
import { ProtectedRoute } from './components/auth/protected-route';
import RegisterPage from './pages/auth/register';
import LoginPage from './pages/auth/login';
import DashboardPage from './pages/dashboard';
import NewMachinePage from './pages/machines/new';
import EditMachinePage from './pages/machines/edit';
import MachineDetailsPage from './pages/machines/details';
import CategoryPage from './pages/categories/[id]';
import CategoriesPage from './pages/categories';
import ProfilePage from './pages/profile';
import { PageTransition } from './components/layout/page-transition';
import { MainLayout } from './components/layout/main-layout';
import { ToastContainer } from './components/ui/toast';
import { useToast } from './hooks/use-toast';

function AppRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Rotas Públicas */}
        <Route path="/" element={<MainLayout><PageTransition><HomePage /></PageTransition></MainLayout>} />
        <Route path="/register" element={<MainLayout><PageTransition><RegisterPage /></PageTransition></MainLayout>} />
        <Route path="/login" element={<MainLayout><PageTransition><LoginPage /></PageTransition></MainLayout>} />
        <Route path="/categories" element={<MainLayout><PageTransition><CategoriesPage /></PageTransition></MainLayout>} />
        <Route path="/categories/:id" element={<MainLayout><PageTransition><CategoryPage /></PageTransition></MainLayout>} />
        <Route path="/machines/:id" element={<MainLayout><PageTransition><MachineDetailsPage /></PageTransition></MainLayout>} />
        
        {/* Rotas Protegidas */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout><PageTransition><ProfilePage /></PageTransition></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout><PageTransition><DashboardPage /></PageTransition></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/machines/new"
          element={
            <ProtectedRoute>
              <MainLayout><PageTransition><NewMachinePage /></PageTransition></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/machines/edit/:id"
          element={
            <ProtectedRoute>
              <MainLayout><PageTransition><EditMachinePage /></PageTransition></MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const { toasts } = useToast();
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen">
              <AppRoutes />
              <ToastContainer toasts={toasts} />
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
