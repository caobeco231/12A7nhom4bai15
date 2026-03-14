import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Trash2, Beaker, Flame, Zap, Clock } from 'lucide-react';
import { cn } from '@/src/lib/utils';

type SavedReaction = {
  id: string;
  date: string;
  type: 'electrolysis' | 'reaction' | 'thermal' | 'hydro';
  title: string;
  details: any;
};

export default function Notebook() {
  const [reactions, setReactions] = useState<SavedReaction[]>([]);

  useEffect(() => {
    loadReactions();
  }, []);

  const loadReactions = () => {
    try {
      const savedStr = localStorage.getItem('notebookEntries');
      if (savedStr) {
        const parsed = JSON.parse(savedStr);
        // Sort by date descending
        parsed.sort((a: SavedReaction, b: SavedReaction) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setReactions(parsed);
      }
    } catch (e) {
      console.error("Failed to load notebook", e);
    }
  };

  const handleDelete = (id: string) => {
    const updated = reactions.filter(r => r.id !== id);
    setReactions(updated);
    localStorage.setItem('notebookEntries', JSON.stringify(updated));
  };

  const clearAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ nhật ký?')) {
      setReactions([]);
      localStorage.removeItem('notebookEntries');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'electrolysis': return <Zap className="w-5 h-5 text-purple-500" />;
      case 'thermal': return <Flame className="w-5 h-5 text-orange-500" />;
      case 'hydro': return <Beaker className="w-5 h-5 text-blue-500" />;
      default: return <Beaker className="w-5 h-5 text-slate-500" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'electrolysis': return 'Điện phân';
      case 'thermal': return 'Nhiệt luyện';
      case 'hydro': return 'Thủy luyện';
      default: return 'Khác';
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 h-full flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-chem-green" />
            Nhật ký Thí nghiệm
          </h1>
          <p className="text-slate-600 mt-2">Lưu trữ các phản ứng bạn đã thực hiện thành công trong Phòng thí nghiệm ảo.</p>
        </div>
        {reactions.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Xóa tất cả
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {reactions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
            <Beaker className="w-16 h-16 opacity-20" />
            <p className="text-lg">Nhật ký trống.</p>
            <p className="text-sm">Hãy vào Phòng thí nghiệm ảo và thực hiện các phản ứng để lưu lại đây.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <AnimatePresence>
              {reactions.map((reaction) => (
                <motion.div
                  key={reaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 group hover:shadow-md transition-all duration-200 relative"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                        {getTypeIcon(reaction.type)}
                      </div>
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          {getTypeName(reaction.type)}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {new Date(reaction.date).toLocaleString('vi-VN')}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(reaction.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mb-3">
                    <div className="font-mono text-lg text-chem-blue font-bold tracking-tight">
                      {reaction.title}
                    </div>
                  </div>

                  <div className="text-slate-600 text-sm leading-relaxed space-y-2">
                    {reaction.type === 'electrolysis' ? (
                      <>
                        <p><strong>Anode:</strong> {reaction.details.anode} | <strong>Cathode:</strong> {reaction.details.cathode}</p>
                        <p><strong>Dung dịch:</strong> {reaction.details.solution} {reaction.details.hasMembrane ? '(Có màng ngăn)' : ''}</p>
                        <p><strong>Điều kiện:</strong> {reaction.details.voltage}V, {reaction.details.time} phút</p>
                        {reaction.details.equation && <p className="font-mono text-chem-green mt-2 p-2 bg-slate-50 rounded border">{reaction.details.equation}</p>}
                      </>
                    ) : (
                      <>
                        <p className="font-mono text-chem-green p-2 bg-slate-50 rounded border">{reaction.details.equation}</p>
                        <p>{reaction.details.description}</p>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
