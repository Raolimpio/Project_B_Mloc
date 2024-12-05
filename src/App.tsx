import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth-context';
import { HomePage } from '@/pages/home';
import { ProtectedRoute } from '@/components/auth/protected-route';
import RegisterPage from '@/pages/auth/register';
import LoginPage from '@/pages/auth/login';
import DashboardPage from '@/pages/dashboard';
import NewMachinePage from '@/pages/machines/new';
import EditMachinePage from '@/pages/machines/edit';
import MachineDetailsPage from '@/pages/machines/details';
import CategoriesPage from '@/pages/categories';
import CategoryPage from '@/pages/categories/[id]';
import WorkPhasesPage from '@/pages/phases';
import WorkPhasePage from '@/pages/phases/[id]';
import ProfilePage from '@/pages/profile';
import DiagnosticsPage from '@/pages/diagnostics';
import { LogViewer } from '@/components/debug/LogViewer';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:id" element={<CategoryPage />} />
            <Route path="/phases" element={<WorkPhasesPage />} />
            <Route path="/phases/:id" element={<WorkPhasePage />} />
            <Route path="/machines/:id" element={<MachineDetailsPage />} />
            <Route path="/diagnostics" element={<DiagnosticsPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/machines/new"
              element={
                <ProtectedRoute>
                  <NewMachinePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/machines/edit/:id"
              element={
                <ProtectedRoute>
                  <EditMachinePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
      {process.env.NODE_ENV === 'development' && <LogViewer />}
    </Router>
  );
}

export default App;