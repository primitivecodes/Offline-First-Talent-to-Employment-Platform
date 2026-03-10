import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Register, Login } from './pages/Auth';
import { LearnerDashboard } from './pages/LearnerDashboard';
import { EmployerDashboard, MentorDashboard, AdminDashboard } from './pages/Dashboards';

// ── Protected route wrapper ────────────────────────────
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={splash}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

// ── Root redirect based on role ───────────────────────
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div style={splash}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  const map = { learner: '/dashboard/learner', mentor: '/dashboard/mentor', admin: '/dashboard/admin', employer: '/dashboard/employer' };
  return <Navigate to={map[user.role] || '/login'} replace />;
};

// ── Landing page ──────────────────────────────────────
const Landing = () => (
  <div style={landingPage}>
    <div style={hero}>
      <h1 style={heroTitle}>Offline-First Talent-to-Employment Platform</h1>
      <p style={heroSub}>
        Connecting Africa's youth with skills, mentorship, and opportunity — even without internet.
      </p>
      <div style={heroBtns}>
        <a href="/register" style={btnPrimary}>Get Started</a>
        <a href="/login"    style={btnSecondary}>Log In</a>
      </div>
    </div>

    <div style={features}>
      {[
        { icon: '📚', title: 'Learn Offline', desc: 'Download courses and study without internet. Sync when you reconnect.' },
        { icon: '🧑‍🏫', title: 'Expert Mentors', desc: 'Get feedback and guidance from industry professionals.' },
        { icon: '🏆', title: 'Earn Certificates', desc: 'Build a verified portfolio that employers can trust.' },
        { icon: '💼', title: 'Find Jobs', desc: 'Connect directly with verified employers looking for your skills.' },
      ].map((f) => (
        <div key={f.title} style={featureCard}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
          <h3 style={{ color: '#1e3a5f', margin: '0 0 8px' }}>{f.title}</h3>
          <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
        </div>
      ))}
    </div>

    <div style={pricing}>
      <h2 style={{ color: '#1e3a5f', textAlign: 'center', marginBottom: 32 }}>Simple Pricing</h2>
      <div style={pricingGrid}>
        <div style={priceCard}>
          <h3 style={{ color: '#1d4ed8' }}>Learner</h3>
          <div style={price}>$10 <span style={{ fontSize: 14, color: '#64748b' }}>one-time</span></div>
          <p style={priceSub}>Paid via MTN Mobile Money when you open your first course</p>
          <ul style={priceList}>
            <li>✓ Full access to all courses</li>
            <li>✓ Offline downloads</li>
            <li>✓ Mentor support</li>
            <li>✓ Certificates & portfolio</li>
          </ul>
          <a href="/register" style={btnPrimary}>Start Learning</a>
        </div>
        <div style={{ ...priceCard, border: '2px solid #6d28d9' }}>
          <h3 style={{ color: '#6d28d9' }}>Employer</h3>
          <div style={{ ...price, color: '#6d28d9' }}>$20 <span style={{ fontSize: 14, color: '#64748b' }}>/month</span></div>
          <p style={priceSub}>MTN Mobile Money · Cancel anytime</p>
          <ul style={priceList}>
            <li>✓ Browse verified portfolios</li>
            <li>✓ View certificates</li>
            <li>✓ Contact graduates directly</li>
            <li>✓ Talent search filters</li>
          </ul>
          <a href="/register" style={{ ...btnPrimary, background: '#6d28d9' }}>Find Talent</a>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Routes>
          <Route path="/"          element={<Landing />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />

          <Route path="/dashboard/learner"  element={<ProtectedRoute roles={['learner']}><LearnerDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/mentor"   element={<ProtectedRoute roles={['mentor']}><MentorDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/admin"    element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/employer" element={<ProtectedRoute roles={['employer']}><EmployerDashboard /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

// ── Landing styles ─────────────────────────────────────
const splash      = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontFamily: 'Inter, sans-serif' };
const landingPage = { fontFamily: 'Inter, sans-serif', background: '#fff' };
const hero        = { background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)', color: '#fff', textAlign: 'center', padding: '100px 24px 80px' };
const heroTitle   = { fontSize: 40, fontWeight: 800, margin: '0 0 18px', maxWidth: 640, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.2 };
const heroSub     = { fontSize: 18, opacity: 0.85, maxWidth: 500, margin: '0 auto 36px', lineHeight: 1.6 };
const heroBtns    = { display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' };
const btnPrimary  = { padding: '14px 32px', background: '#ffd100', color: '#1a1a1a', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 15 };
const btnSecondary = { padding: '14px 32px', background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 10, fontWeight: 600, textDecoration: 'none', fontSize: 15, border: '1px solid rgba(255,255,255,0.3)' };
const features    = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, padding: '72px 48px', maxWidth: 1100, margin: '0 auto' };
const featureCard = { background: '#f8fafc', borderRadius: 14, padding: 28, textAlign: 'center' };
const pricing     = { background: '#f8fafc', padding: '72px 24px' };
const pricingGrid = { display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' };
const priceCard   = { background: '#fff', borderRadius: 16, padding: 36, width: 300, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 8 };
const price       = { fontSize: 36, fontWeight: 800, color: '#1d4ed8', margin: '8px 0' };
const priceSub    = { color: '#64748b', fontSize: 13, margin: 0, lineHeight: 1.5 };
const priceList   = { listStyle: 'none', padding: 0, margin: '12px 0', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: '#475569', flex: 1 };
