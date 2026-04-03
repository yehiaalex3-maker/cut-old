import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';
import supabase from './lib/supabase';
import { handleGoogleRedirect } from './lib/googleAuth';
import Sidebar from './components/Sidebar';
import ProjectsPage from './pages/ProjectsPage';
import UnitsPage from './pages/UnitsPage';
import CutListPage from './pages/CutListPage';
import SettingsPage from './pages/SettingsPage';
import CostPage from './pages/CostPage';
import ExportPage from './pages/ExportPage';
import BoardsPage from './pages/BoardsPage';
import AccessoriesPage from './pages/AccessoriesPage';
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPage';
import type { Project } from './types';

handleGoogleRedirect();

interface UserProfile {
  id: string;
  role: string;
  full_name: string;
  is_active: boolean;
}

function HomeLayout({ userProfile }: { userProfile: UserProfile | null }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <div className="app-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        userProfile={userProfile}
      />
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <ProjectsPage onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </main>
    </div>
  );
}

function AdminLayout({ userProfile }: { userProfile: UserProfile | null }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <div className="app-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        userProfile={userProfile}
      />
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <AdminPage onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </main>
    </div>
  );
}

function ProjectLayoutWithUser({ component: Component, userProfile }: { component: React.ComponentType<any>; userProfile: UserProfile | null }) {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetch('/api/projects')
        .then(r => r.json())
        .then((projects: Project[]) => {
          const p = projects.find(p => p.id === Number(projectId));
          setProject(p || null);
        });
    }
  }, [projectId]);

  return (
    <div className="app-layout">
      <Sidebar
        projectId={Number(projectId)}
        projectName={project?.name}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        userProfile={userProfile}
      />
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <Component
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          projectName={project?.name || ''}
        />
      </main>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
      else setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
      else { setUserProfile(null); setAuthLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase.from('users_profile').select('*').eq('id', userId).single();
      if (data) setUserProfile(data);
      else {
        // Auto-create profile if missing (first time Google login)
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const newProfile = { id: user.id, email: user.email || '', full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'مستخدم', role: 'user', is_active: true };
          await supabase.from('users_profile').insert(newProfile);
          setUserProfile(newProfile as UserProfile);
        }
      }
    } finally {
      setAuthLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f5f6fa' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
          <p style={{ color: '#9ca3af', fontFamily: 'Cairo, sans-serif' }}>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <BrowserRouter><AuthPage onAuth={() => {}} /></BrowserRouter>;
  }

  if (userProfile && !userProfile.is_active) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Cairo, sans-serif', background: '#f5f6fa' }}>
        <div style={{ background: '#fff', padding: '40px', borderRadius: '14px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '12px' }}>الحساب موقوف</h2>
          <p style={{ color: '#6b7280' }}>تم تعليق حسابك. تواصل مع المدير للمزيد.</p>
          <button onClick={() => supabase.auth.signOut()} style={{ marginTop: '20px', padding: '10px 24px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Cairo, sans-serif' }}>
            تسجيل الخروج
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = userProfile?.role === 'admin';

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLayout userProfile={userProfile} />} />
        <Route path="/admin" element={isAdmin ? <AdminLayout userProfile={userProfile} /> : <Navigate to="/" />} />
        <Route path="/project/:projectId/units" element={<ProjectLayoutWithUser component={UnitsPage} userProfile={userProfile} />} />
        <Route path="/project/:projectId/cutlist" element={<ProjectLayoutWithUser component={CutListPage} userProfile={userProfile} />} />
        <Route path="/project/:projectId/settings" element={<ProjectLayoutWithUser component={SettingsPage} userProfile={userProfile} />} />
        <Route path="/project/:projectId/boards" element={<ProjectLayoutWithUser component={BoardsPage} userProfile={userProfile} />} />
        <Route path="/project/:projectId/accessories" element={<ProjectLayoutWithUser component={AccessoriesPage} userProfile={userProfile} />} />
        <Route path="/project/:projectId/cost" element={<ProjectLayoutWithUser component={CostPage} userProfile={userProfile} />} />
        <Route path="/project/:projectId/export" element={<ProjectLayoutWithUser component={ExportPage} userProfile={userProfile} />} />
      </Routes>
    </BrowserRouter>
  );
}
