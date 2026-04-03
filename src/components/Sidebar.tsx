import { Link, useLocation } from 'react-router-dom';
import { FolderOpen, LayoutGrid, Scissors, Settings, DollarSign, FileSpreadsheet, ChevronLeft, Layers, Package, Shield, LogOut } from 'lucide-react';
import supabase from '../lib/supabase';

interface SidebarProps {
  projectId?: number;
  projectName?: string;
  collapsed: boolean;
  onToggle: () => void;
  userProfile?: { role: string; full_name: string } | null;
}

export default function Sidebar({ projectId, projectName, collapsed, onToggle, userProfile }: SidebarProps) {
  const location = useLocation();

  const projectNavItems = projectId ? [
    { icon: LayoutGrid, label: 'تفريغ المقاسات', path: `/project/${projectId}/units` },
    { icon: Scissors, label: 'قائمة القطع', path: `/project/${projectId}/cutlist` },
    { icon: Layers, label: 'إعدادات الألواح', path: `/project/${projectId}/boards` },
    { icon: Package, label: 'أسعار الأكسسوار', path: `/project/${projectId}/accessories` },
    { icon: Settings, label: 'إعدادات التقطيع', path: `/project/${projectId}/settings` },
    { icon: DollarSign, label: 'تكلفة المشروع', path: `/project/${projectId}/cost` },
    { icon: FileSpreadsheet, label: 'تصدير Excel', path: `/project/${projectId}/export` },
  ] : [];

  const handleSignOut = () => supabase.auth.signOut();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          <div className="logo-icon">
            <Scissors size={20} />
          </div>
          {!collapsed && <span className="logo-text">MASTER Y</span>}
        </Link>
        <button onClick={onToggle} className="sidebar-toggle">
          <ChevronLeft size={16} className={collapsed ? 'rotate-180' : ''} />
        </button>
      </div>

      {!collapsed && userProfile && (
        <div className="sidebar-user">
          <div className={`user-avatar-sm ${userProfile.role === 'admin' ? 'admin' : ''}`}>
            {(userProfile.full_name || 'م')[0].toUpperCase()}
          </div>
          <div className="user-info-sm">
            <span className="user-name-sm">{userProfile.full_name}</span>
            <span className="user-role-sm">{userProfile.role === 'admin' ? 'مدير النظام' : 'مستخدم'}</span>
          </div>
        </div>
      )}

      {projectName && !collapsed && (
        <div className="sidebar-project">
          <span className="project-label">المشروع الحالي</span>
          <span className="project-name">{projectName}</span>
        </div>
      )}

      <nav className="sidebar-nav">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <FolderOpen size={18} />
          {!collapsed && <span>المشاريع</span>}
        </Link>

        {projectNavItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <item.icon size={18} />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}

        {userProfile?.role === 'admin' && (
          <>
            {!collapsed && <div className="nav-divider"><span>الإدارة</span></div>}
            <Link to="/admin" className={`nav-item admin-item ${location.pathname === '/admin' ? 'active' : ''}`}>
              <Shield size={18} />
              {!collapsed && <span>لوحة التحكم</span>}
            </Link>
          </>
        )}
      </nav>

      <div className="sidebar-bottom">
        <button onClick={handleSignOut} className={`nav-item signout-btn`}>
          <LogOut size={18} />
          {!collapsed && <span>تسجيل الخروج</span>}
        </button>
        {!collapsed && <div className="sidebar-footer"><span>© 2024 MASTER Y</span></div>}
      </div>
    </aside>
  );
}
