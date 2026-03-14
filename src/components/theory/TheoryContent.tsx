import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ores, extractionMethods, glossary, comparisonData } from '@/src/data/chemistryData';
import { PlayCircle, CheckCircle2, BookOpen, ExternalLink, HelpCircle } from 'lucide-react';

export default function TheoryContent() {
  const [progress, setProgress] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [showGlossary, setShowGlossary] = useState(false);

  const sections = ['intro', 'natural-state', 'extraction', 'recycling', 'comparison'];

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setProgress(Math.min(100, Math.max(0, progress)));

      // Simple intersection logic for checklist
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight / 2 && !completedSections.includes(id)) {
            setCompletedSections(prev => [...prev, id]);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [completedSections]);

  return (
    <div className="relative max-w-5xl mx-auto py-8 px-4 flex gap-8">
      {/* Progress Bar */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-slate-200 z-50">
        <div 
          className="h-full bg-chem-blue transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-16 pb-24">
        {/* Intro */}
        <motion.section
          id="intro"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 pt-8"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-chem-blue/10 text-chem-blue font-medium text-sm mb-4">
            Chương 5: Đại cương kim loại
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Tách Kim Loại và <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-chem-green to-chem-blue">
              Tái Chế Kim Loại
            </span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Hiểu về trạng thái tự nhiên của các kim loại và quặng phổ biến; giải thích các phương pháp tách kim loại; trình bày sự cần thiết và thực hành tái chế các kim loại phổ biến như Sắt (Fe), Nhôm (Al), Đồng (Cu).
          </p>
        </motion.section>

        {/* Natural State */}
        <motion.section
          id="natural-state"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-chem-gold/20 text-chem-gold flex items-center justify-center text-xl">1</span>
            Trạng thái tự nhiên của kim loại
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">Tồn tại dưới dạng hợp chất</h3>
              <p className="text-slate-600">
                Trong vỏ Trái Đất, đa số kim loại tồn tại dưới dạng <span className="font-semibold text-chem-blue cursor-help border-b border-dashed border-chem-blue" title="Hợp chất của oxy với một nguyên tố khác">Oxide</span> hoặc muối, thường là hợp chất trong <span className="font-semibold text-chem-blue cursor-help border-b border-dashed border-chem-blue" title="Khoáng vật chứa kim loại có giá trị kinh tế">quặng (Ore)</span>.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-medium text-slate-700">Ví dụ:</span> Quặng Bauxite chứa Al₂O₃, quặng Hematite chứa Fe₂O₃.
              </div>
            </div>
            <div className="glass-panel p-6 space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">Tồn tại dưới dạng đơn chất</h3>
              <p className="text-slate-600">
                Các kim loại có độ hoạt động hóa học rất yếu như Vàng (Au), Bạc (Ag), Bạch kim (Pt) thường tồn tại ở dạng đơn chất tự do trong tự nhiên.
              </p>
            </div>
          </div>

          <div className="glass-panel overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-100">
              <h3 className="text-xl font-semibold text-slate-800">Bảng các quặng phổ biến</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-sm uppercase tracking-wider">
                    <th className="p-4 font-medium">Kim loại</th>
                    <th className="p-4 font-medium">Tên quặng</th>
                    <th className="p-4 font-medium">Thành phần chính</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ores.map((ore, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-medium text-slate-800">{ore.metal}</td>
                      <td className="p-4 text-slate-600">{ore.name}</td>
                      <td className="p-4 font-mono text-chem-blue">{ore.formula}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* Extraction Methods */}
        <motion.section
          id="extraction"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-chem-blue/20 text-chem-blue flex items-center justify-center text-xl">2</span>
            Phương pháp tách kim loại
          </h2>
          
          <div className="grid gap-6">
            {extractionMethods.map((method, idx) => (
              <div key={idx} className={`glass-panel p-6 border-l-4 ${method.color.split(' ')[2]}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <h3 className="text-xl font-bold text-slate-800">{method.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${method.color.split(' ')[0]} ${method.color.split(' ')[1]}`}>
                    Áp dụng: {method.metals}
                  </span>
                </div>
                <p className="text-slate-600 mb-4">{method.desc}</p>
                <div className="bg-slate-50 p-4 rounded-xl font-mono text-slate-800 border border-slate-100 flex items-center gap-3">
                  <span className="text-slate-400 text-sm">PT:</span>
                  {method.equation}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Comparison Tool */}
        <motion.section
          id="comparison"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-chem-blue" />
            Bảng so sánh các phương pháp
          </h2>
          
          <div className="glass-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-800 text-sm">
                    <th className="p-4 font-bold border-b border-slate-200">Tiêu chí</th>
                    <th className="p-4 font-bold border-b border-slate-200 text-purple-700">Điện phân</th>
                    <th className="p-4 font-bold border-b border-slate-200 text-orange-700">Nhiệt luyện</th>
                    <th className="p-4 font-bold border-b border-slate-200 text-blue-700">Thủy luyện</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-medium text-slate-800 bg-slate-50/30">{row.criteria}</td>
                      <td className="p-4 text-slate-600">{row.electrolysis}</td>
                      <td className="p-4 text-slate-600">{row.thermal}</td>
                      <td className="p-4 text-slate-600">{row.hydro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* Video & Animation */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <PlayCircle className="w-6 h-6 text-chem-red" />
            Video minh họa
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-panel p-4 aspect-video flex items-center justify-center bg-slate-900 relative overflow-hidden group">
              <img src="https://picsum.photos/seed/metallurgy/800/450" alt="Metallurgy" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" referrerPolicy="no-referrer" />
              <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:scale-110 transition-transform cursor-pointer z-10" />
              <span className="absolute bottom-4 left-4 text-white font-medium z-10">Quy trình luyện gang (Lò cao)</span>
            </div>
            <div className="glass-panel p-4 aspect-video flex items-center justify-center bg-slate-900 relative overflow-hidden group">
              <img src="https://picsum.photos/seed/electrolysis/800/450" alt="Electrolysis" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" referrerPolicy="no-referrer" />
              <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:scale-110 transition-transform cursor-pointer z-10" />
              <span className="absolute bottom-4 left-4 text-white font-medium z-10">Điện phân nóng chảy Nhôm</span>
            </div>
          </div>
        </motion.section>

        {/* Recycling */}
        <motion.section
          id="recycling"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-chem-green/20 text-chem-green flex items-center justify-center text-xl">3</span>
            Tái chế kim loại (Metal Recycling)
          </h2>
          
          <div className="glass-panel p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
            <h3 className="text-xl font-semibold text-green-800 mb-6">Quy trình tái chế cơ bản</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-green-200"></div>
              <div className="space-y-6 relative">
                {[
                  { title: 'Thu gom và phân loại', desc: 'Thu gom phế liệu và phân loại theo từng loại kim loại.' },
                  { title: 'Nghiền và nén chặt', desc: 'Làm giảm thể tích phế liệu để dễ dàng vận chuyển và xử lý.' },
                  { title: 'Nung chảy và tinh luyện', desc: 'Nung chảy phế liệu trong lò lớn và loại bỏ tạp chất.' },
                  { title: 'Tạo vật liệu mới', desc: 'Đúc kim loại lỏng thành phôi hoặc sản phẩm mới.' }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-6 items-start">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold shrink-0 z-10 shadow-md">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">{step.title}</h4>
                      <p className="text-slate-600 mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* References */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4 pt-8 border-t border-slate-200"
        >
          <h3 className="text-xl font-bold text-slate-800">Tài liệu tham khảo & Mở rộng</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center gap-2 text-chem-blue hover:underline">
                <ExternalLink className="w-4 h-4" /> Ứng dụng của Nhôm trong công nghiệp hàng không
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 text-chem-blue hover:underline">
                <ExternalLink className="w-4 h-4" /> Tác động môi trường của việc khai thác quặng
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 text-chem-blue hover:underline">
                <ExternalLink className="w-4 h-4" /> Công nghệ luyện kim hiện đại
              </a>
            </li>
          </ul>
        </motion.section>
      </div>

      {/* Right Sidebar: Progress & Glossary */}
      <div className="hidden lg:block w-64 shrink-0 space-y-6 sticky top-24 h-fit">
        {/* Progress Tracker */}
        <div className="glass-panel p-5">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-chem-green" /> Tiến độ học tập
          </h3>
          <div className="space-y-3">
            {sections.map((id, idx) => (
              <div key={id} className="flex items-center gap-3 text-sm">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${completedSections.includes(id) ? 'bg-chem-green border-chem-green text-white' : 'border-slate-300 text-transparent'}`}>
                  ✓
                </div>
                <span className={completedSections.includes(id) ? 'text-slate-800 font-medium' : 'text-slate-500'}>
                  {idx === 0 ? 'Giới thiệu' : idx === 1 ? 'Trạng thái tự nhiên' : idx === 2 ? 'Phương pháp tách' : idx === 3 ? 'Tái chế' : 'So sánh'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-500 mb-1">Hoàn thành</div>
            <div className="text-2xl font-bold text-chem-blue">{Math.round((completedSections.length / sections.length) * 100)}%</div>
          </div>
        </div>

        {/* Glossary Toggle */}
        <div className="glass-panel p-5">
          <button 
            onClick={() => setShowGlossary(!showGlossary)}
            className="w-full flex items-center justify-between font-bold text-slate-800"
          >
            <span className="flex items-center gap-2"><HelpCircle className="w-5 h-5 text-purple-500" /> Từ điển thuật ngữ</span>
            <span>{showGlossary ? '−' : '+'}</span>
          </button>
          
          {showGlossary && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2"
            >
              {glossary.map((item, idx) => (
                <div key={idx} className="text-sm">
                  <div className="font-bold text-chem-blue">{item.term}</div>
                  <div className="text-slate-600 mt-1">{item.def}</div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
