import { useState, useEffect } from 'react';
import { BrainCircuit, FileText, Highlighter, Lightbulb, PenTool, ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { quizQuestions, flashcards } from '@/src/data/chemistryData';

export default function LearningToolbar() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [isHighlighting, setIsHighlighting] = useState(false);

  const tools = [
    { id: 'quiz', icon: BrainCircuit, label: 'Quiz kiểm tra', color: 'text-purple-500' },
    { id: 'flashcard', icon: Lightbulb, label: 'Flashcard', color: 'text-yellow-500' },
    { id: 'mindmap', icon: FileText, label: 'Sơ đồ tư duy', color: 'text-blue-500' },
    { id: 'notes', icon: PenTool, label: 'Ghi chú', color: 'text-green-500' },
    { id: 'highlight', icon: Highlighter, label: 'Đánh dấu', color: 'text-red-500' },
  ];

  const handleToolClick = (toolId: string) => {
    if (toolId === 'highlight') {
      setIsHighlighting(!isHighlighting);
      if (!isHighlighting) {
        document.body.classList.add('cursor-text');
        alert('Chế độ đánh dấu đã bật. Bôi đen văn bản để đánh dấu.');
      } else {
        document.body.classList.remove('cursor-text');
      }
      return;
    }
    setActiveTool(activeTool === toolId ? null : toolId);
  };

  useEffect(() => {
    if (!isHighlighting) return;
    
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.className = 'bg-yellow-200/50 rounded px-1';
        try {
          range.surroundContents(span);
        } catch (e) {
          console.log('Cannot highlight across multiple nodes easily');
        }
        selection.removeAllRanges();
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [isHighlighting]);

  return (
    <>
      <div className="fixed right-4 top-1/4 z-50 flex flex-col gap-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = (tool.id === 'highlight' && isHighlighting) || activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
              className={`group relative p-3 bg-white/90 backdrop-blur-md border shadow-lg rounded-full hover:scale-110 transition-transform duration-200 ${isActive ? 'border-chem-blue scale-110' : 'border-slate-200'}`}
              title={tool.label}
            >
              <Icon className={`w-6 h-6 ${tool.color}`} />
              <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {tool.label}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {activeTool === 'quiz' && <QuizModal onClose={() => setActiveTool(null)} />}
        {activeTool === 'notes' && <NotesModal onClose={() => setActiveTool(null)} />}
        {activeTool === 'flashcard' && <FlashcardModal onClose={() => setActiveTool(null)} />}
        {activeTool === 'mindmap' && <MindmapModal onClose={() => setActiveTool(null)} />}
      </AnimatePresence>
    </>
  );
}

function FlashcardModal({ onClose }: { onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState([...flashcards].sort(() => Math.random() - 0.5));

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCards([...cards].sort(() => Math.random() - 0.5));
      setCurrentIndex(0);
    }, 150);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-yellow-50">
          <h3 className="font-bold text-yellow-800 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" /> Flashcards
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        
        <div className="p-8 flex flex-col items-center">
          <div className="text-sm text-slate-500 mb-4">
            Thẻ {currentIndex + 1} / {cards.length}
          </div>
          
          <div 
            className="relative w-full h-64 cursor-pointer perspective-1000"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              className="w-full h-full relative preserve-3d"
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-yellow-100 to-orange-50 rounded-2xl border border-yellow-200 shadow-md flex items-center justify-center p-6 text-center">
                <h4 className="text-2xl font-bold text-slate-800">{cards[currentIndex].front}</h4>
              </div>
              
              {/* Back */}
              <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-md flex items-center justify-center p-6 text-center [transform:rotateY(180deg)]">
                <p className="text-lg text-slate-700">{cards[currentIndex].back}</p>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-4 mt-8">
            <button onClick={handlePrev} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={handleShuffle} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600" title="Trộn thẻ">
              <RefreshCw className="w-5 h-5" />
            </button>
            <button onClick={handleNext} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MindmapModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-blue-50">
          <h3 className="font-bold text-blue-800 flex items-center gap-2">
            <FileText className="w-5 h-5" /> Sơ đồ tư duy tổng quan
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <div className="flex-1 p-6 overflow-auto bg-slate-50 flex items-center justify-center">
          {/* Simple CSS-based mindmap representation */}
          <div className="flex flex-col items-center gap-8">
            <div className="px-6 py-3 bg-chem-blue text-white font-bold rounded-xl shadow-lg text-xl">
              Đại cương Kim Loại
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 relative">
              {/* Connecting lines */}
              <div className="absolute top-[-2rem] left-[10%] right-[10%] h-8 border-t-2 border-l-2 border-r-2 border-slate-300 rounded-t-xl z-0"></div>
              <div className="absolute top-[-2rem] left-1/2 w-0.5 h-8 bg-slate-300 z-0"></div>

              <div className="flex flex-col items-center gap-4 z-10">
                <div className="px-4 py-2 bg-white border-2 border-chem-gold text-slate-800 font-bold rounded-lg shadow-md">
                  Trạng thái tự nhiên
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-md shadow-sm">Đơn chất (Au, Ag)</span>
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-md shadow-sm">Hợp chất (Quặng)</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 z-10">
                <div className="px-4 py-2 bg-white border-2 border-chem-green text-slate-800 font-bold rounded-lg shadow-md">
                  Phương pháp tách
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-md shadow-sm">Điện phân (Na, Mg, Al)</span>
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-md shadow-sm">Nhiệt luyện (Zn, Fe, Cu)</span>
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-md shadow-sm">Thủy luyện (Cu, Ag, Au)</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 z-10">
                <div className="px-4 py-2 bg-white border-2 border-purple-400 text-slate-800 font-bold rounded-lg shadow-md">
                  Tái chế kim loại
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-md shadow-sm">Thu gom & Phân loại</span>
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-md shadow-sm">Nung chảy & Tinh luyện</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function QuizModal({ onClose }: { onClose: () => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);

  const handleAnswer = (index: number) => {
    setSelectedAns(index);
    if (index === quizQuestions[currentQ].ans) {
      setScore(s => s + 1);
    }
    setTimeout(() => {
      if (currentQ < quizQuestions.length - 1) {
        setCurrentQ(c => c + 1);
        setSelectedAns(null);
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-purple-50 to-blue-50">
          <h3 className="text-xl font-bold text-slate-800">Quiz Kiểm Tra Nhanh</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <div className="p-6">
          {showResult ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🏆</div>
              <h4 className="text-2xl font-bold text-slate-800 mb-2">Hoàn thành!</h4>
              <p className="text-lg text-slate-600">Bạn đạt {score}/{quizQuestions.length} điểm.</p>
              <button onClick={onClose} className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Đóng</button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-sm text-slate-500 mb-4">
                <span>Câu {currentQ + 1}/{quizQuestions.length}</span>
                <span>Điểm: {score}</span>
              </div>
              <h4 className="text-lg font-medium text-slate-800 mb-6">{quizQuestions[currentQ].q}</h4>
              <div className="space-y-3">
                {quizQuestions[currentQ].options.map((opt, idx) => {
                  let btnClass = "w-full text-left p-4 rounded-xl border transition-all duration-200 ";
                  if (selectedAns === null) {
                    btnClass += "border-slate-200 hover:border-purple-400 hover:bg-purple-50";
                  } else if (idx === quizQuestions[currentQ].ans) {
                    btnClass += "border-green-500 bg-green-50 text-green-700";
                  } else if (idx === selectedAns) {
                    btnClass += "border-red-500 bg-red-50 text-red-700";
                  } else {
                    btnClass += "border-slate-200 opacity-50";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedAns !== null}
                      onClick={() => handleAnswer(idx)}
                      className={btnClass}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {selectedAns !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm"
                >
                  <strong>Giải thích:</strong> {quizQuestions[currentQ].exp}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function NotesModal({ onClose }: { onClose: () => void }) {
  const [note, setNote] = useState(() => localStorage.getItem('chem_notes') || '');

  const handleSave = () => {
    localStorage.setItem('chem_notes', note);
    alert('Đã lưu ghi chú!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 right-20 z-[60] w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
    >
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-green-50">
        <h3 className="font-bold text-green-800 flex items-center gap-2">
          <PenTool className="w-4 h-4" /> Ghi chú cá nhân
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
      </div>
      <div className="p-4">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Nhập ghi chú của bạn tại đây..."
          className="w-full h-48 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
            Lưu (Local)
          </button>
        </div>
      </div>
    </motion.div>
  );
}

