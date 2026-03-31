import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link, NavLink } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import WoredaMgmt from './pages/Users/WoredaMgmt.jsx';
import Register from './pages/Users/Register.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import Dashboard from './pages/Users/Dashboard.jsx';
import About from './pages/Users/About.jsx';
import AddPerson from './pages/Users/AddPerson.jsx';
import Students from './pages/Users/Students.jsx';
import Workers from './pages/Users/Workers.jsx';
import Reports from './pages/Users/Reports.jsx';
import Login from './pages/Users/Login.jsx';
import MyProfile from './pages/Users/MyProfile.jsx';
import UserMgmt from './pages/Users/UserMgmt.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminWoreda from './pages/admin/AdminWoreda.jsx';
import AdminPersons from './pages/admin/AdminPersons.jsx';
import AdminStudents from './pages/admin/AdminStudents.jsx';
import AdminWorkers from './pages/admin/AdminWorkers.jsx';
import AdminUnemployed from './pages/admin/AdminUnemployed.jsx';
import AdminVillage from './pages/admin/AdminVillage.jsx';
import AdminProfessions from './pages/admin/AdminProfessions.jsx';
import AdminOrganizations from './pages/admin/AdminOrganizations.jsx';
import AdminReports from './pages/admin/AdminReports.jsx';
import AdminExport from './pages/admin/AdminExport.jsx';

const ProtectedRoute = ({ children, loginPath = '/login', requireAdmin = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><div>Loading...</div></div>;
  }

  if (!user) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function Layout({ children }) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navLinkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
      isActive
        ? 'bg-stone-900 text-white'
        : 'text-stone-700 hover:bg-stone-200'
    }`;

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <nav className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 shadow-sm backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <Link to="/" className="text-lg font-bold tracking-tight text-stone-900 sm:text-xl">
                Nation Educated
              </Link>
              <span className="hidden rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-900 sm:inline-flex">
                {user.username}
              </span>
            </div>

            <div className="hidden items-center gap-2 lg:flex">
              <NavLink to="/" end className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/about" className={navLinkClass}>
                About
              </NavLink>
              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>
              {user.role === 'admin' && (
                <NavLink to="/admin/dashboard" className={navLinkClass}>
                  Admin
                </NavLink>
              )}
              <button
                onClick={() => {
                  closeMenu();
                  logout();
                }}
                className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-stone-700"
              >
                Logout
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50 lg:hidden"
            >
              {mobileMenuOpen ? 'Close' : 'Menu'}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="border-t border-stone-200 py-4 lg:hidden">
              <div className="mb-4 inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-900">
                {user.username}
              </div>
              <div className="flex flex-col gap-2">
                <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
                  Home
                </NavLink>
                <NavLink to="/about" className={navLinkClass} onClick={closeMenu}>
                  About
                </NavLink>
                <NavLink to="/profile" className={navLinkClass} onClick={closeMenu}>
                  Profile
                </NavLink>
                {user.role === 'admin' && (
                  <NavLink to="/admin/dashboard" className={navLinkClass} onClick={closeMenu}>
                    Admin
                  </NavLink>
                )}
                <button
                  onClick={() => {
                    closeMenu();
                    logout();
                  }}
                  className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-stone-700"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/about" element={
          <ProtectedRoute>
            <Layout>
              <About />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <MyProfile />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/add-person" element={
          <ProtectedRoute>
            <Layout>
              <AddPerson />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/students" element={
          <ProtectedRoute>
            <Layout>
              <Students />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/workers" element={
          <ProtectedRoute>
            <Layout>
              <Workers />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <Layout>
              <Reports />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/woredas" element={
          <ProtectedRoute>
            <Layout>
              <WoredaMgmt />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute>
            <Layout>
              <UserMgmt />
            </Layout>
          </ProtectedRoute>
        } />
        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute loginPath="/admin/login" requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="persons" element={<AdminPersons />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="workers" element={<AdminWorkers />} />
          <Route path="unemployed" element={<AdminUnemployed />} />
          <Route path="woreda" element={<AdminWoreda />} />
          <Route path="village" element={<AdminVillage />} />
          <Route path="professions" element={<AdminProfessions />} />
          <Route path="organizations" element={<AdminOrganizations />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="export" element={<AdminExport />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
