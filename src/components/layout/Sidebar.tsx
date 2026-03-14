import { BookOpen, FlaskConical, Trophy, BookMarked } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ isOpen, activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: 'theory', label: 'Lý thuyết', icon: BookOpen },
    { id: 'lab', label: 'Phòng thí nghiệm ảo', icon: FlaskConical },
    { id: 'challenges', label: 'Thử thách', icon: Trophy },
    { id: 'notebook', label: 'Nhật ký thí nghiệm', icon: BookMarked },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-white/90 backdrop-blur-xl border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 pt-20",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-chem-blue/10 to-chem-green/10 text-chem-blue shadow-sm border border-chem-blue/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-chem-blue" : "text-slate-400")} />
              {item.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
