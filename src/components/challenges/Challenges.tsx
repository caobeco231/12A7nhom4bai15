import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Trophy, ArrowRight, RefreshCcw } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const challengesData = [
  {
    id: 1,
    title: 'Tách Đồng từ Đồng(II) Sunfat',
    description: 'Bạn có một dung dịch CuSO₄. Hãy chọn phương pháp và hóa chất phù hợp để thu được kim loại Đồng (Cu).',
    options: [
      { id: 'a', text: 'Nhiệt luyện với Cacbon (C)', correct: false },
      { id: 'b', text: 'Thủy luyện dùng Sắt (Fe)', correct: true },
      { id: 'c', text: 'Điện phân nóng chảy', correct: false },
      { id: 'd', text: 'Cho tác dụng với nước (H₂O)', correct: false }
    ],
    explanation: 'Sắt (Fe) hoạt động hóa học mạnh hơn Đồng (Cu) nên có thể đẩy Cu ra khỏi dung dịch muối CuSO₄ (Phương pháp thủy luyện).'
  },
  {
    id: 2,
    title: 'Sản xuất Nhôm công nghiệp',
    description: 'Để sản xuất Nhôm từ quặng Bauxite (Al₂O₃), người ta sử dụng phương pháp nào?',
    options: [
      { id: 'a', text: 'Nhiệt luyện với khí CO', correct: false },
      { id: 'b', text: 'Thủy luyện', correct: false },
      { id: 'c', text: 'Điện phân dung dịch', correct: false },
      { id: 'd', text: 'Điện phân nóng chảy', correct: true }
    ],
    explanation: 'Nhôm là kim loại hoạt động mạnh, oxit của nó rất bền nên chỉ có thể điều chế bằng cách điện phân nóng chảy Al₂O₃ (có mặt criolit).'
  },
  {
    id: 3,
    title: 'Luyện gang từ quặng Hematite',
    description: 'Trong lò cao, phản ứng chính để khử Fe₂O₃ thành Fe là gì?',
    options: [
      { id: 'a', text: 'Fe₂O₃ + 3H₂ → 2Fe + 3H₂O', correct: false },
      { id: 'b', text: 'Fe₂O₃ + 3CO → 2Fe + 3CO₂', correct: true },
      { id: 'c', text: '2Fe₂O₃ → 4Fe + 3O₂', correct: false },
      { id: 'd', text: 'Fe₂O₃ + 2Al → 2Fe + Al₂O₃', correct: false }
    ],
    explanation: 'Trong công nghiệp luyện kim (luyện gang), khí CO được dùng làm chất khử để khử oxit sắt ở nhiệt độ cao.'
  }
];

export default function Challenges() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const challenge = challengesData[currentChallenge];

  const handleSelect = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
    setIsAnswered(true);

    const isCorrect = challenge.options.find(o => o.id === optionId)?.correct;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentChallenge < challengesData.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentChallenge(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 h-full flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-chem-gold" />
            Thử thách Tách kim loại
          </h1>
          <p className="text-slate-600 mt-2">Vận dụng kiến thức để giải quyết các tình huống thực tế.</p>
        </div>
        {!isFinished && (
          <div className="text-right">
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Tiến độ</div>
            <div className="text-2xl font-bold text-chem-blue">{currentChallenge + 1} / {challengesData.length}</div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center relative">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key={currentChallenge}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8"
            >
              <h2 className="text-xl font-bold text-slate-800 mb-2">Thử thách {challenge.id}: {challenge.title}</h2>
              <p className="text-slate-600 mb-8 text-lg">{challenge.description}</p>

              <div className="space-y-3">
                {challenge.options.map((option) => {
                  const isSelected = selectedOption === option.id;
                  const showCorrect = isAnswered && option.correct;
                  const showWrong = isAnswered && isSelected && !option.correct;

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(option.id)}
                      disabled={isAnswered}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group",
                        !isAnswered && "hover:border-chem-blue hover:bg-blue-50 border-slate-200 bg-white",
                        isSelected && !isAnswered && "border-chem-blue bg-blue-50",
                        showCorrect && "border-emerald-500 bg-emerald-50 text-emerald-900",
                        showWrong && "border-red-500 bg-red-50 text-red-900",
                        isAnswered && !isSelected && !option.correct && "border-slate-200 bg-slate-50 opacity-50"
                      )}
                    >
                      <span className="text-lg">{option.text}</span>
                      {showCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                      {showWrong && <XCircle className="w-6 h-6 text-red-500" />}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 overflow-hidden"
                  >
                    <div className={cn(
                      "p-4 rounded-xl border",
                      challenge.options.find(o => o.id === selectedOption)?.correct
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-orange-50 border-orange-200 text-orange-800"
                    )}>
                      <p className="font-medium mb-1">
                        {challenge.options.find(o => o.id === selectedOption)?.correct ? '🎉 Chính xác!' : '💡 Chưa chính xác.'}
                      </p>
                      <p>{challenge.explanation}</p>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-6 py-3 bg-chem-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                      >
                        {currentChallenge < challengesData.length - 1 ? 'Thử thách tiếp theo' : 'Xem kết quả'}
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center max-w-lg mx-auto w-full"
            >
              <div className="w-24 h-24 bg-chem-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-chem-gold" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Hoàn thành!</h2>
              <p className="text-slate-600 mb-8">Bạn đã vượt qua các thử thách tách kim loại.</p>
              
              <div className="text-6xl font-bold text-chem-blue mb-8">
                {score} <span className="text-2xl text-slate-400">/ {challengesData.length}</span>
              </div>

              <p className="text-lg text-slate-700 mb-8">
                {score === challengesData.length 
                  ? 'Xuất sắc! Bạn đã nắm vững các phương pháp tách kim loại.' 
                  : 'Tốt lắm! Hãy ôn tập thêm phần lý thuyết để đạt điểm tối đa nhé.'}
              </p>

              <button
                onClick={handleRestart}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
              >
                <RefreshCcw className="w-5 h-5" />
                Thử lại
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
