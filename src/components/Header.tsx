import { Menu, Bell, User } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuToggle: () => void;
  actions?: React.ReactNode;
}

export default function Header({ title, subtitle, onMenuToggle, actions }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-right">
        <button onClick={onMenuToggle} className="menu-btn">
          <Menu size={20} />
        </button>
        <div className="header-title">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      <div className="header-actions">
        {actions}
        <button className="icon-btn"><Bell size={18} /></button>
        <button className="icon-btn"><User size={18} /></button>
      </div>
    </header>
  );
}
