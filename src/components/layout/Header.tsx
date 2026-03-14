import { Atom, Menu } from 'lucide-react';

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-white/70 border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={toggleSidebar} className="p-2 hover:bg-slate-100 rounded-lg md:hidden">
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-2 text-chem-blue">
            <Atom className="w-8 h-8 animate-spin-slow" />
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-chem-blue to-chem-green">
              ChemEdu
            </span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#intro" className="hover:text-chem-blue transition-colors">Giới thiệu</a>
          <a href="#natural-state" className="hover:text-chem-blue transition-colors">Trạng thái tự nhiên</a>
          <a href="#extraction" className="hover:text-chem-blue transition-colors">Tách kim loại</a>
          <a href="#recycling" className="hover:text-chem-blue transition-colors">Tái chế</a>
        </nav>
      </div>
    </header>
  );
}
