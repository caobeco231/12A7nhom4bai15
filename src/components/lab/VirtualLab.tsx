import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, Flame, Zap, Play, Square, RotateCcw, Info, FlaskConical, TestTubes, Container, Settings, X, CheckCircle, AlertTriangle, Download, Camera, FileText, FastForward, Pause } from 'lucide-react';
import { labReactions } from '@/src/data/chemistryData';
import { cn } from '@/src/lib/utils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

type LabMode = 'electrolysis' | 'thermal' | 'hydro' | 'free';

export default function VirtualLab() {
  const [mode, setMode] = useState<LabMode>('free');
  const [selectedReactants, setSelectedReactants] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentReaction, setCurrentReaction] = useState<any | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const labRef = useRef<HTMLDivElement>(null);

  const [electroSettings, setElectroSettings] = useState({
    anode: 'Graphite',
    cathode: 'Graphite',
    voltage: 12,
    time: 30,
    hasMembrane: false,
    temperature: 25,
    solution: 'CuSO4',
    speed: 1,
    isPaused: false
  });
  const [showElectroSettings, setShowElectroSettings] = useState(false);

  // Inventory Data
  const inventory = {
    metals: ['K', 'Ba', 'Ca', 'Na', 'Mg', 'Al', 'Zn', 'Fe', 'Ni', 'Sn', 'Pb', 'Cu', 'Ag', 'Pt', 'Au'],
    solutions: ['HCl', 'H2SO4', 'HNO3', 'CuSO4', 'AgNO3', 'NaCl', 'H2O', 'NaOH', 'KOH', 'BaCl2', 'Na2CO3'],
    solids: ['CuO', 'Fe2O3', 'ZnO', 'C', 'CO', 'Al2O3', 'CaCO3', 'MnO2'],
    indicators: ['Quỳ tím', 'Phenolphtalein'],
    equipment: [
      { id: 'beaker', name: 'Cốc thủy tinh', icon: Beaker },
      { id: 'test_tube', name: 'Ống nghiệm', icon: TestTubes },
      { id: 'flask', name: 'Bình tam giác', icon: FlaskConical },
      { id: 'furnace', name: 'Lò nung', icon: Flame },
      { id: 'crucible', name: 'Chén nung', icon: Container },
      { id: 'electrolytic_cell', name: 'Bình điện phân', icon: Zap },
    ]
  };

  const chemicalColors: Record<string, string> = {
    'CuSO4': '#3b82f6', // blue
    'Cu': '#b87333', // copper red
    'CuO': '#000000', // black
    'Fe2O3': '#8B0000', // dark red
    'Fe': '#71797E', // grey
    'Ag': '#C0C0C0', // silver
    'Au': '#FFD700', // gold
    'Quỳ tím': '#800080', // purple
    'Phenolphtalein': '#ffffff', // colorless
    'NaCl': '#ffffff',
    'H2O': '#ffffff',
    'HCl': '#ffffff',
    'H2SO4': '#ffffff',
    'HNO3': '#ffffff',
    'NaOH': '#ffffff',
    'KOH': '#ffffff',
    'BaCl2': '#ffffff',
    'Na2CO3': '#ffffff',
    'AgNO3': '#ffffff',
    'K': '#C0C0C0',
    'Ba': '#C0C0C0',
    'Ca': '#C0C0C0',
    'Na': '#C0C0C0',
    'Mg': '#C0C0C0',
    'Al': '#C0C0C0',
    'Zn': '#C0C0C0',
    'Ni': '#C0C0C0',
    'Sn': '#C0C0C0',
    'Pb': '#C0C0C0',
    'Pt': '#C0C0C0',
    'ZnO': '#ffffff',
    'C': '#000000',
    'CO': '#ffffff',
    'Al2O3': '#ffffff',
    'CaCO3': '#ffffff',
    'MnO2': '#000000',
  };

  const getChemicalColor = (item: string) => {
    return chemicalColors[item] || '#ffffff';
  };

  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleSelectReactant = (item: string) => {
    if (isRunning) return;
    if (selectedReactants.includes(item)) {
      setSelectedReactants(prev => prev.filter(r => r !== item));
    } else if (selectedReactants.length < 2) {
      setSelectedReactants(prev => [...prev, item]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isRunning) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (isRunning) return;
    
    const itemType = e.dataTransfer.getData('type');
    const item = e.dataTransfer.getData('text/plain');
    if (!item) return;

    if (itemType === 'equipment') {
      setEquipment(item);
      addLog(`Đã chọn thiết bị: ${inventory.equipment.find(eq => eq.id === item)?.name}`);
      return;
    }

    if (!equipment) {
      addLog('Vui lòng chọn thiết bị trước khi thêm hóa chất.');
      return;
    }

    if (!selectedReactants.includes(item)) {
      if (selectedReactants.length < 2) {
        setSelectedReactants(prev => [...prev, item]);
        addLog(`Đã thêm ${item} vào thiết bị.`);
      } else {
        addLog('Chỉ có thể chọn tối đa 2 hóa chất.');
      }
    }
  };

  const handleRun = () => {
    if (!equipment) {
      addLog('Vui lòng chọn thiết bị.');
      return;
    }

    if (equipment === 'electrolytic_cell') {
      const compatibility = checkCompatibility(electroSettings);
      
      if (!compatibility.valid) {
        addLog(`LỖI: ${compatibility.message}`);
        setShowElectroSettings(true);
        return;
      }

      setIsRunning(true);
      setElectroSettings(prev => ({ ...prev, isPaused: false }));
      
      addLog(`Bắt đầu điện phân ${electroSettings.solution} với Anode ${electroSettings.anode} và Cathode ${electroSettings.cathode}.`);
      
      setCurrentReaction({
        id: `electro_${Date.now()}`,
        type: 'electrolysis',
        equation: compatibility.equation,
        desc: compatibility.message,
        products: ['Sản phẩm điện phân']
      });

      setTimeout(() => {
        addLog(`Hoàn thành điện phân!`);
        setIsRunning(false);
        
        // Save to Notebook
        try {
          const savedStr = localStorage.getItem('notebookEntries');
          const saved = savedStr ? JSON.parse(savedStr) : [];
          saved.unshift({
            id: `electro_${Date.now()}`,
            date: new Date().toISOString(),
            type: 'electrolysis',
            title: `Điện phân ${electroSettings.solution}`,
            details: {
              anode: electroSettings.anode,
              cathode: electroSettings.cathode,
              solution: electroSettings.solution,
              voltage: electroSettings.voltage,
              time: electroSettings.time,
              hasMembrane: electroSettings.hasMembrane,
              equation: compatibility.equation
            }
          });
          localStorage.setItem('notebookEntries', JSON.stringify(saved));
          addLog('Đã lưu phản ứng vào Nhật ký.');
        } catch (e) {
          console.error("Failed to save to notebook", e);
        }
      }, 10000 / electroSettings.speed);
      return;
    }

    if (selectedReactants.length === 0) {
      addLog('Vui lòng chọn ít nhất 1 hóa chất.');
      return;
    }

    setIsRunning(true);
    
    // Find matching reaction
    const match = labReactions.find(r => 
      r.equipment === equipment &&
      r.reactants.every(reactant => selectedReactants.includes(reactant)) &&
      selectedReactants.every(reactant => r.reactants.includes(reactant))
    );

    if (match) {
      setCurrentReaction(match);
      addLog(`Bắt đầu phản ứng: ${match.equation}`);
      setTimeout(() => {
        addLog(`Hoàn thành! Sản phẩm: ${match.products.join(', ')}`);
        setIsRunning(false);
        
        // Save to Notebook
        try {
          const savedStr = localStorage.getItem('notebookEntries');
          const saved = savedStr ? JSON.parse(savedStr) : [];
          if (!saved.some((s: any) => s.id === match.id)) {
            saved.unshift({
              id: match.id,
              date: new Date().toISOString(),
              type: 'reaction',
              title: match.equation,
              details: {
                equation: match.equation,
                description: match.desc,
                reactants: match.reactants,
                equipment: match.equipment
              }
            });
            localStorage.setItem('notebookEntries', JSON.stringify(saved));
            addLog('Đã lưu phản ứng vào Nhật ký.');
          }
        } catch (e) {
          console.error("Failed to save to notebook", e);
        }
      }, 4000); // Simulate 4s reaction time
    } else {
      setCurrentReaction(null);
      addLog('Không có phản ứng xảy ra với các chất và điều kiện này.');
      setTimeout(() => setIsRunning(false), 2000);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentReaction(null);
    setSelectedReactants([]);
    setEquipment(null);
    addLog('Đã làm sạch thiết bị.');
  };

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));
  };

  const handleExportPDF = async () => {
    if (!labRef.current) return;
    try {
      addLog('Đang tạo báo cáo PDF...');
      const canvas = await html2canvas(labRef.current, {
        backgroundColor: '#0f172a', // slate-900
        scale: 2,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Bao_Cao_Thi_Nghiem_${new Date().getTime()}.pdf`);
      addLog('Đã xuất báo cáo PDF thành công.');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      addLog('Lỗi khi xuất PDF.');
    }
  };

  const handleScreenshot = async () => {
    if (!labRef.current) return;
    try {
      addLog('Đang chụp màn hình...');
      const canvas = await html2canvas(labRef.current, {
        backgroundColor: '#0f172a',
      });
      const link = document.createElement('a');
      link.download = `Chup_Man_Hinh_Lab_${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      addLog('Đã lưu ảnh chụp màn hình.');
    } catch (error) {
      console.error('Error taking screenshot:', error);
      addLog('Lỗi khi chụp màn hình.');
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-slate-900 text-slate-200 overflow-hidden" ref={labRef}>
      {/* Left Panel: Inventory */}
      <div className="w-full md:w-80 bg-slate-800 border-r border-slate-700 flex flex-col h-full">
        <div className="p-4 border-b border-slate-700 bg-slate-800/50">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Beaker className="w-5 h-5 text-chem-blue" /> Kho hóa chất
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          
          {/* Equipment Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Thiết bị</h3>
            <div className="grid grid-cols-3 gap-2">
              {inventory.equipment.map(eq => (
                <button
                  key={eq.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('type', 'equipment');
                    e.dataTransfer.setData('text/plain', eq.id);
                  }}
                  onClick={() => !isRunning && setEquipment(eq.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 cursor-grab active:cursor-grabbing",
                    equipment === eq.id 
                      ? "bg-chem-blue/20 border-chem-blue text-chem-blue" 
                      : "bg-slate-700/50 border-slate-600 text-slate-400 hover:bg-slate-700"
                  )}
                >
                  <eq.icon className="w-6 h-6 mb-2" />
                  <span className="text-[10px] text-center leading-tight">{eq.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chemicals Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Kim loại & Rắn</h3>
            <div className="flex flex-wrap gap-2">
              {[...inventory.metals, ...inventory.solids].map(item => (
                <button
                  key={item}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', item)}
                  onClick={() => handleSelectReactant(item)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-mono border transition-all duration-200 cursor-grab active:cursor-grabbing",
                    selectedReactants.includes(item)
                      ? "bg-chem-gold/20 border-chem-gold text-chem-gold"
                      : "bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700"
                  )}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getChemicalColor(item) }} />
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Dung dịch</h3>
            <div className="flex flex-wrap gap-2">
              {inventory.solutions.map(item => (
                <button
                  key={item}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', item)}
                  onClick={() => handleSelectReactant(item)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-mono border transition-all duration-200 cursor-grab active:cursor-grabbing",
                    selectedReactants.includes(item)
                      ? "bg-chem-green/20 border-chem-green text-chem-green"
                      : "bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700"
                  )}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getChemicalColor(item) }} />
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Chất chỉ thị</h3>
            <div className="flex flex-wrap gap-2">
              {inventory.indicators.map(item => (
                <button
                  key={item}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', item)}
                  onClick={() => handleSelectReactant(item)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-mono border transition-all duration-200 cursor-grab active:cursor-grabbing",
                    selectedReactants.includes(item)
                      ? "bg-purple-500/20 border-purple-500 text-purple-400"
                      : "bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700"
                  )}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getChemicalColor(item) }} />
                  {item}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Center Panel: Workbench */}
      <div className="flex-1 flex flex-col relative bg-slate-950">
        {/* Top Bar */}
        <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-400">Chế độ:</span>
            <select 
              value={mode} 
              onChange={(e) => setMode(e.target.value as LabMode)}
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:ring-chem-blue focus:border-chem-blue"
            >
              <option value="free">Tự do (Free Mode)</option>
              <option value="electrolysis">Điện phân</option>
              <option value="thermal">Nhiệt luyện</option>
              <option value="hydro">Thủy luyện</option>
            </select>

            {/* Dynamic Conditions Panel based on Mode */}
            {mode === 'thermal' && (
              <div className="flex items-center gap-2 ml-4 border-l border-slate-700 pl-4">
                <span className="text-sm text-slate-400">Nhiệt độ:</span>
                <input 
                  type="range" 
                  min="20" 
                  max="1000" 
                  step="10"
                  value={electroSettings.temperature}
                  onChange={(e) => setElectroSettings(prev => ({ ...prev, temperature: parseInt(e.target.value) }))}
                  className="w-24 accent-orange-500"
                />
                <span className="text-sm font-mono text-orange-400 w-12">{electroSettings.temperature}°C</span>
              </div>
            )}
            {mode === 'electrolysis' && (
              <div className="flex items-center gap-2 ml-4 border-l border-slate-700 pl-4">
                <button 
                  onClick={() => setShowElectroSettings(true)}
                  className="flex items-center gap-2 text-sm text-chem-blue hover:text-blue-400 transition-colors"
                >
                  <Settings className="w-4 h-4" /> Cài đặt điện cực & dòng điện
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleExportPDF}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              title="Xuất PDF"
            >
              <Download className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:block">Xuất PDF</span>
            </button>
            <button 
              onClick={handleReset}
              disabled={isRunning}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
              title="Làm lại"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button 
              onClick={isRunning ? () => setIsRunning(false) : handleRun}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                isRunning 
                  ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" 
                  : "bg-chem-green text-white hover:bg-emerald-600 shadow-lg shadow-chem-green/20"
              )}
            >
              {isRunning ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              {isRunning ? 'Dừng' : 'Chạy thí nghiệm'}
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

          {/* Workbench Setup */}
          <div 
            className={cn(
              "relative z-10 flex flex-col items-center justify-center w-full max-w-2xl aspect-video bg-slate-800/40 rounded-3xl border backdrop-blur-sm shadow-2xl transition-colors duration-300",
              isDraggingOver ? "border-chem-blue bg-slate-800/60" : "border-slate-700/50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            
            {!equipment ? (
              <div className="text-center text-slate-500 flex flex-col items-center gap-4">
                <Beaker className="w-16 h-16 opacity-20" />
                <p>Kéo thả hóa chất vào đây sau khi chọn thiết bị</p>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Equipment Visuals */}
                {equipment === 'beaker' && <BeakerVisual isRunning={isRunning} reaction={currentReaction} reactants={selectedReactants} />}
                {equipment === 'test_tube' && <TestTubeVisual isRunning={isRunning} reaction={currentReaction} reactants={selectedReactants} />}
                {equipment === 'flask' && <FlaskVisual isRunning={isRunning} reaction={currentReaction} reactants={selectedReactants} />}
                {equipment === 'furnace' && <FurnaceVisual isRunning={isRunning} reaction={currentReaction} reactants={selectedReactants} />}
                {equipment === 'crucible' && <CrucibleVisual isRunning={isRunning} reaction={currentReaction} reactants={selectedReactants} />}
                {equipment === 'electrolytic_cell' && <ElectrolysisVisual isRunning={isRunning} reaction={currentReaction} reactants={selectedReactants} settings={electroSettings} onOpenSettings={() => setShowElectroSettings(true)} />}
              </div>
            )}

            {/* Selected Reactants Overlay */}
            {selectedReactants.length > 0 && equipment !== 'electrolytic_cell' && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-700 backdrop-blur-md">
                {selectedReactants.map(r => (
                  <span key={r} className="font-mono text-sm text-chem-gold font-bold">{r}</span>
                ))}
              </div>
            )}

            {/* Electrolysis Controls */}
            {equipment === 'electrolytic_cell' && isRunning && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/90 px-6 py-3 rounded-2xl border border-slate-700 backdrop-blur-md shadow-2xl">
                <button 
                  onClick={() => setElectroSettings(prev => ({ ...prev, isPaused: !prev.isPaused }))}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white transition-colors"
                  title={electroSettings.isPaused ? "Tiếp tục" : "Tạm dừng"}
                >
                  {electroSettings.isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
                </button>
                
                <div className="flex items-center gap-2 border-l border-slate-700 pl-4">
                  <span className="text-xs text-slate-400 font-medium">Tốc độ:</span>
                  {[0.5, 1, 2, 4].map(s => (
                    <button
                      key={s}
                      onClick={() => setElectroSettings(prev => ({ ...prev, speed: s }))}
                      className={cn(
                        "px-2 py-1 rounded text-xs font-bold transition-colors",
                        electroSettings.speed === s ? "bg-chem-blue text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      )}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Panel: Logs & Info */}
        <div className="h-48 border-t border-slate-800 bg-slate-900 flex">
          <div className="flex-1 p-4 border-r border-slate-800 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                <Info className="w-4 h-4" /> Thông tin phản ứng
              </h3>
              {equipment === 'electrolytic_cell' && (
                <div className="flex gap-2">
                  <button onClick={handleScreenshot} className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 transition-colors"><Camera className="w-3 h-3"/> Chụp</button>
                </div>
              )}
            </div>
            {currentReaction ? (
              <div className="flex-1 bg-slate-800/50 rounded-xl p-4 border border-slate-700 overflow-y-auto">
                <div className="font-mono text-lg text-chem-green mb-2">{currentReaction.equation}</div>
                <p className="text-slate-300 text-sm">{currentReaction.desc}</p>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-600 text-sm italic">
                Chưa có phản ứng nào diễn ra.
              </div>
            )}
          </div>
          <div className="w-1/3 p-4 flex flex-col">
            <h3 className="text-sm font-semibold text-slate-400 mb-2">Nhật ký (Logs)</h3>
            <div className="flex-1 bg-black/50 rounded-xl p-3 border border-slate-800 overflow-y-auto font-mono text-xs space-y-2">
              {logs.map((log, i) => (
                <div key={i} className={i === 0 ? "text-slate-200" : "text-slate-500"}>{log}</div>
              ))}
              {logs.length === 0 && <div className="text-slate-600">Sẵn sàng...</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const checkCompatibility = (settings: any) => {
  const { anode, cathode, solution } = settings;
  const activeMetals = ['Magnesium', 'Aluminum', 'Zinc', 'Iron'];
  
  if (solution === 'CuSO4' && activeMetals.includes(cathode)) {
    return {
      valid: false,
      message: `Cathode ${cathode} có thể tan trong dung dịch CuSO₄ do hoạt động mạnh hơn Cu.`,
      type: 'warning',
      equation: 'Cảnh báo: Phản ứng phụ xảy ra trước điện phân.'
    };
  }
  
  if (solution === 'AgNO3' && [...activeMetals, 'Copper'].includes(cathode)) {
    return {
      valid: false,
      message: `Cathode ${cathode} có thể tan trong dung dịch AgNO₃ do hoạt động mạnh hơn Ag.`,
      type: 'warning',
      equation: 'Cảnh báo: Phản ứng phụ xảy ra trước điện phân.'
    };
  }

  if (anode === 'Copper' && solution === 'CuSO4') {
    return {
      valid: true,
      message: 'Cấu hình hợp lệ. Sẽ xảy ra hiện tượng dương cực tan.',
      equation: 'Anode: Cu → Cu²⁺ + 2e⁻ | Cathode: Cu²⁺ + 2e⁻ → Cu',
      type: 'success'
    };
  }

  return {
    valid: true,
    message: 'Cấu hình hợp lệ.',
    equation: 'Phản ứng phụ thuộc vào dung dịch và điện cực.',
    type: 'success'
  };
};

function ElectrolysisSettingsPanel({ settings, setSettings, onClose }: any) {
  const anodes = [
    { id: 'Graphite', name: 'Graphite (C)', color: 'bg-slate-800', type: 'Trơ' },
    { id: 'Platinum', name: 'Platinum (Pt)', color: 'bg-slate-300', type: 'Trơ' },
    { id: 'Copper', name: 'Copper (Cu)', color: 'bg-orange-600', type: 'Hoạt động' },
    { id: 'Iron', name: 'Iron (Fe)', color: 'bg-slate-500', type: 'Hoạt động' },
    { id: 'Nickel', name: 'Nickel (Ni)', color: 'bg-slate-400', type: 'Hoạt động' },
    { id: 'Silver', name: 'Silver (Ag)', color: 'bg-gray-200', type: 'Hoạt động' },
    { id: 'Gold', name: 'Gold (Au)', color: 'bg-yellow-500', type: 'Trơ' },
  ];

  const cathodes = [
    { id: 'Graphite', name: 'Graphite (C)', color: 'bg-slate-800' },
    { id: 'Platinum', name: 'Platinum (Pt)', color: 'bg-slate-300' },
    { id: 'Copper', name: 'Copper (Cu)', color: 'bg-orange-600' },
    { id: 'Iron', name: 'Iron (Fe)', color: 'bg-slate-500' },
    { id: 'Zinc', name: 'Zinc (Zn)', color: 'bg-teal-600' },
    { id: 'Magnesium', name: 'Magnesium (Mg)', color: 'bg-slate-200' },
    { id: 'Aluminum', name: 'Aluminum (Al)', color: 'bg-slate-300' },
    { id: 'Nickel', name: 'Nickel (Ni)', color: 'bg-slate-400' },
  ];

  const solutions = [
    'H2O+H2SO4', 'NaCl (aq)', 'NaCl (molten)', 'CuSO4', 'AgNO3', 'HCl', 'Pb(NO3)2'
  ];

  const compatibility = checkCompatibility(settings);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="absolute top-0 right-0 bottom-0 w-96 bg-slate-800 border-l border-slate-700 z-50 shadow-2xl flex flex-col"
    >
      <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-chem-blue" /> Cài đặt Điện cực
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {/* Compatibility Alert */}
        <div className={cn("p-3 rounded-lg border text-sm", compatibility.type === 'success' ? "bg-green-900/30 border-green-700 text-green-300" : "bg-yellow-900/30 border-yellow-700 text-yellow-300")}>
          <div className="flex items-start gap-2">
            {compatibility.type === 'success' ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />}
            <div>
              <p className="font-bold">{compatibility.message}</p>
              {compatibility.equation && <p className="font-mono text-xs mt-1 opacity-80">{compatibility.equation}</p>}
            </div>
          </div>
        </div>

        {/* Anode */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Anode (+) Cực dương</label>
          <select 
            value={settings.anode}
            onChange={(e) => setSettings({...settings, anode: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm focus:border-chem-blue outline-none"
          >
            {anodes.map(a => <option key={a.id} value={a.id}>{a.name} - {a.type}</option>)}
          </select>
        </div>

        {/* Cathode */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Cathode (-) Cực âm</label>
          <select 
            value={settings.cathode}
            onChange={(e) => setSettings({...settings, cathode: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm focus:border-chem-blue outline-none"
          >
            {cathodes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Solution */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Dung dịch điện phân</label>
          <select 
            value={settings.solution}
            onChange={(e) => setSettings({...settings, solution: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm focus:border-chem-blue outline-none"
          >
            {solutions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Conditions */}
        <div className="space-y-4 pt-4 border-t border-slate-700">
          <h4 className="text-sm font-semibold text-slate-300">Điều kiện</h4>
          
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Điện áp (V)</span>
              <span>{settings.voltage}V</span>
            </div>
            <input type="range" min="0" max="30" value={settings.voltage} onChange={(e) => setSettings({...settings, voltage: Number(e.target.value)})} className="w-full accent-chem-blue" />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Thời gian (phút)</span>
              <span>{settings.time} min</span>
            </div>
            <input type="range" min="1" max="60" value={settings.time} onChange={(e) => setSettings({...settings, time: Number(e.target.value)})} className="w-full accent-chem-blue" />
          </div>

          {settings.solution === 'NaCl (aq)' && (
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input type="checkbox" checked={settings.hasMembrane} onChange={(e) => setSettings({...settings, hasMembrane: e.target.checked})} className="rounded bg-slate-900 border-slate-700 text-chem-blue focus:ring-chem-blue" />
              Có màng ngăn xốp
            </label>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// --- Visual Components for Equipment ---

function BeakerVisual({ isRunning, reaction, reactants }: any) {
  const hasLiquid = reactants.some((r: string) => ['HCl', 'H2SO4', 'HNO3', 'CuSO4', 'AgNO3', 'NaCl', 'H2O', 'NaOH', 'KOH', 'BaCl2', 'Na2CO3'].includes(r));
  
  // Determine color based on reactants and indicators
  const getLiquidColor = () => {
    let isAcid = reactants.includes('HCl') || reactants.includes('H2SO4') || reactants.includes('HNO3');
    let isBase = reactants.includes('NaOH') || reactants.includes('KOH') || reactants.includes('Na2CO3');
    let hasQuyTim = reactants.includes('Quỳ tím');
    let hasPhenol = reactants.includes('Phenolphtalein');

    if (hasQuyTim) {
      if (isAcid) return 'rgba(239, 68, 68, 0.6)'; // Red
      if (isBase) return 'rgba(59, 130, 246, 0.6)'; // Blue
      return 'rgba(168, 85, 247, 0.6)'; // Purple
    }
    if (hasPhenol) {
      if (isBase) return 'rgba(236, 72, 153, 0.6)'; // Pink
      return 'rgba(255, 255, 255, 0.1)'; // Colorless
    }

    if (reactants.includes('CuSO4')) return 'rgba(59, 130, 246, 0.6)'; // Blue
    
    // Default liquid color
    return 'rgba(165, 243, 252, 0.2)'; // cyan-200/20
  };

  const liquidColor = getLiquidColor();
  
  return (
    <div className="relative w-48 h-64 flex flex-col items-center justify-end">
      {/* Beaker Glass */}
      <div className="absolute inset-0 border-4 border-t-0 border-white/20 rounded-b-3xl backdrop-blur-sm bg-white/5 z-20"></div>
      
      {/* Liquid */}
      <AnimatePresence>
        {hasLiquid && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '60%' }}
            className="absolute bottom-1 w-[calc(100%-8px)] rounded-b-[20px] z-10 transition-colors duration-1000"
            style={{ backgroundColor: isRunning && reaction?.animation.includes('green') ? 'rgba(34, 197, 94, 0.4)' : liquidColor }}
          >
            {/* Surface */}
            <div className="absolute top-0 w-full h-4 -mt-2 bg-white/20 rounded-[50%]"></div>
            
            {/* Bubbles Animation */}
            {isRunning && reaction?.animation.includes('bubbles') && (
              <div className="absolute inset-0 overflow-hidden rounded-b-[20px]">
                {[...Array(15)].map((_, i) => (
                  <div 
                    key={i} 
                    className="bubble w-2 h-2" 
                    style={{ 
                      left: `${Math.random() * 100}%`, 
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random()}s`
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* Fire on liquid surface */}
            {isRunning && reaction?.animation.includes('fire') && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-12 h-16 bg-gradient-to-t from-orange-500 to-transparent blur-md opacity-80 animate-pulse"></div>
            )}
            {isRunning && reaction?.animation.includes('purple_fire') && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-12 h-16 bg-gradient-to-t from-purple-500 to-transparent blur-md opacity-80 animate-pulse"></div>
            )}
            
            {/* Precipitate */}
            {isRunning && reaction?.animation.includes('precipitate') && (
              <div className={cn(
                "absolute bottom-0 w-full h-8 blur-sm",
                reaction.animation.includes('white') ? "bg-white/60" :
                reaction.animation.includes('blue') ? "bg-blue-600/60" :
                reaction.animation.includes('silver') ? "bg-slate-300/80" : "bg-slate-500/60"
              )}></div>
            )}
            
            {/* Gas */}
            {isRunning && reaction?.animation.includes('brown_gas') && (
              <div className="absolute -top-20 left-0 w-full h-32 bg-orange-800/30 blur-xl animate-pulse"></div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Solid Reactant */}
      {reactants.some((r: string) => ['K', 'Ba', 'Ca', 'Na', 'Mg', 'Al', 'Zn', 'Fe', 'Ni', 'Sn', 'Pb', 'Cu', 'Ag', 'Pt', 'Au', 'CuO', 'Fe2O3', 'ZnO', 'C', 'Al2O3', 'CaCO3', 'MnO2'].includes(r)) && (
        <div className="absolute bottom-2 w-16 h-4 bg-slate-500 rounded-full z-15 blur-[1px]"></div>
      )}
    </div>
  );
}

function TestTubeVisual({ isRunning, reaction, reactants }: any) {
  const hasLiquid = reactants.some((r: string) => ['HCl', 'H2SO4', 'HNO3', 'CuSO4', 'AgNO3', 'NaCl', 'H2O', 'NaOH', 'KOH', 'BaCl2', 'Na2CO3'].includes(r));
  
  const getLiquidColor = () => {
    let isAcid = reactants.includes('HCl') || reactants.includes('H2SO4') || reactants.includes('HNO3');
    let isBase = reactants.includes('NaOH') || reactants.includes('KOH') || reactants.includes('Na2CO3');
    let hasQuyTim = reactants.includes('Quỳ tím');
    let hasPhenol = reactants.includes('Phenolphtalein');

    if (hasQuyTim) {
      if (isAcid) return 'rgba(239, 68, 68, 0.6)';
      if (isBase) return 'rgba(59, 130, 246, 0.6)';
      return 'rgba(168, 85, 247, 0.6)';
    }
    if (hasPhenol) {
      if (isBase) return 'rgba(236, 72, 153, 0.6)';
      return 'rgba(255, 255, 255, 0.1)';
    }
    if (reactants.includes('CuSO4')) return 'rgba(59, 130, 246, 0.6)';
    return 'rgba(165, 243, 252, 0.2)';
  };

  const liquidColor = getLiquidColor();
  
  return (
    <div className="relative w-16 h-64 flex flex-col items-center justify-end">
      {/* Test Tube Glass */}
      <div className="absolute inset-0 border-4 border-t-0 border-white/20 rounded-b-full backdrop-blur-sm bg-white/5 z-20"></div>
      
      {/* Liquid */}
      <AnimatePresence>
        {hasLiquid && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '50%' }}
            className="absolute bottom-1 w-[calc(100%-8px)] rounded-b-full z-10 transition-colors duration-1000"
            style={{ backgroundColor: isRunning && reaction?.animation.includes('green') ? 'rgba(34, 197, 94, 0.4)' : liquidColor }}
          >
            {/* Surface */}
            <div className="absolute top-0 w-full h-2 -mt-1 bg-white/20 rounded-[50%]"></div>
            
            {/* Bubbles Animation */}
            {isRunning && reaction?.animation.includes('bubbles') && (
              <div className="absolute inset-0 overflow-hidden rounded-b-full">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i} 
                    className="bubble w-1.5 h-1.5" 
                    style={{ 
                      left: `${Math.random() * 100}%`, 
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random()}s`
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* Precipitate */}
            {isRunning && reaction?.animation.includes('precipitate') && (
              <div className={cn(
                "absolute bottom-0 w-full h-6 blur-sm rounded-b-full",
                reaction.animation.includes('white') ? "bg-white/60" : "bg-slate-500/60"
              )}></div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Solid Reactant */}
      {reactants.some((r: string) => ['K', 'Ba', 'Ca', 'Na', 'Mg', 'Al', 'Zn', 'Fe', 'Ni', 'Sn', 'Pb', 'Cu', 'Ag', 'Pt', 'Au', 'CuO', 'Fe2O3', 'ZnO', 'C', 'Al2O3', 'CaCO3', 'MnO2'].includes(r)) && (
        <div className="absolute bottom-2 w-8 h-3 bg-slate-500 rounded-full z-15 blur-[1px]"></div>
      )}
    </div>
  );
}

function FlaskVisual({ isRunning, reaction, reactants }: any) {
  const hasLiquid = reactants.some((r: string) => ['HCl', 'H2SO4', 'HNO3', 'CuSO4', 'AgNO3', 'NaCl', 'H2O', 'NaOH', 'KOH', 'BaCl2', 'Na2CO3'].includes(r));
  
  const getLiquidColor = () => {
    let isAcid = reactants.includes('HCl') || reactants.includes('H2SO4') || reactants.includes('HNO3');
    let isBase = reactants.includes('NaOH') || reactants.includes('KOH') || reactants.includes('Na2CO3');
    let hasQuyTim = reactants.includes('Quỳ tím');
    let hasPhenol = reactants.includes('Phenolphtalein');

    if (hasQuyTim) {
      if (isAcid) return 'rgba(239, 68, 68, 0.6)';
      if (isBase) return 'rgba(59, 130, 246, 0.6)';
      return 'rgba(168, 85, 247, 0.6)';
    }
    if (hasPhenol) {
      if (isBase) return 'rgba(236, 72, 153, 0.6)';
      return 'rgba(255, 255, 255, 0.1)';
    }
    if (reactants.includes('CuSO4')) return 'rgba(59, 130, 246, 0.6)';
    return 'rgba(165, 243, 252, 0.2)';
  };

  const liquidColor = getLiquidColor();
  
  return (
    <div className="relative w-48 h-64 flex flex-col items-center justify-end">
      {/* Flask Glass (Simplified with CSS) */}
      <div className="absolute bottom-0 w-48 h-40 border-4 border-t-0 border-white/20 rounded-b-[40px] rounded-t-[20px] backdrop-blur-sm bg-white/5 z-20"></div>
      <div className="absolute top-0 w-16 h-28 border-4 border-b-0 border-white/20 rounded-t-lg backdrop-blur-sm bg-white/5 z-20"></div>
      
      {/* Liquid */}
      <AnimatePresence>
        {hasLiquid && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '35%' }}
            className="absolute bottom-1 w-[calc(100%-8px)] rounded-b-[36px] z-10 transition-colors duration-1000"
            style={{ backgroundColor: isRunning && reaction?.animation.includes('green') ? 'rgba(34, 197, 94, 0.4)' : liquidColor }}
          >
            {/* Surface */}
            <div className="absolute top-0 w-full h-4 -mt-2 bg-white/20 rounded-[50%]"></div>
            
            {/* Bubbles Animation */}
            {isRunning && reaction?.animation.includes('bubbles') && (
              <div className="absolute inset-0 overflow-hidden rounded-b-[36px]">
                {[...Array(15)].map((_, i) => (
                  <div 
                    key={i} 
                    className="bubble w-2 h-2" 
                    style={{ 
                      left: `${Math.random() * 100}%`, 
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random()}s`
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Solid Reactant */}
      {reactants.some((r: string) => ['K', 'Ba', 'Ca', 'Na', 'Mg', 'Al', 'Zn', 'Fe', 'Ni', 'Sn', 'Pb', 'Cu', 'Ag', 'Pt', 'Au', 'CuO', 'Fe2O3', 'ZnO', 'C', 'Al2O3', 'CaCO3', 'MnO2'].includes(r)) && (
        <div className="absolute bottom-2 w-20 h-4 bg-slate-500 rounded-full z-15 blur-[1px]"></div>
      )}
    </div>
  );
}

function CrucibleVisual({ isRunning, reaction, reactants }: any) {
  return (
    <div className="relative w-32 h-24 flex flex-col items-center justify-end">
      {/* Crucible Body */}
      <div className="absolute inset-0 bg-slate-700 rounded-b-3xl border-2 border-slate-600 shadow-xl z-10"></div>
      
      {/* Solid Reactant */}
      {reactants.length > 0 && (
        <div className="absolute bottom-2 w-20 h-6 bg-slate-800 rounded-full z-15 blur-[2px]"></div>
      )}
      
      {/* Reaction Animation */}
      {isRunning && reaction?.animation.includes('sparks') && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-32 z-20">
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-400 via-orange-500 to-transparent blur-lg opacity-90 animate-pulse"></div>
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-1 h-1 bg-white rounded-full animate-ping" 
              style={{ 
                left: `${Math.random() * 100}%`, 
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random()}s`,
                animationDuration: `${0.5 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FurnaceVisual({ isRunning, reaction }: any) {
  return (
    <div className="relative w-64 h-64 flex flex-col items-center justify-end">
      {/* Furnace Body */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-700 to-slate-900 rounded-t-full border-4 border-slate-600 shadow-2xl overflow-hidden z-10">
        {/* Fire/Heat */}
        <AnimatePresence>
          {isRunning && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-0 w-full h-3/4 bg-gradient-to-t from-orange-600 via-yellow-500 to-transparent blur-xl opacity-80"
            />
          )}
        </AnimatePresence>
        
        {/* Crucible */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-24 h-16 bg-slate-800 rounded-b-2xl border-2 border-slate-600 z-20 flex items-center justify-center">
          {isRunning && reaction?.animation.includes('red') && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="w-16 h-4 bg-red-500 rounded-full blur-sm"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ElectrolysisVisual({ isRunning, reaction, reactants, settings, onOpenSettings }: any) {
  const getElectrodeColor = (id: string) => {
    const colors: Record<string, string> = {
      'Graphite': 'bg-slate-800',
      'Platinum': 'bg-slate-300',
      'Copper': 'bg-orange-600',
      'Iron': 'bg-slate-500',
      'Nickel': 'bg-slate-400',
      'Silver': 'bg-gray-200',
      'Gold': 'bg-yellow-500',
      'Zinc': 'bg-teal-600',
      'Magnesium': 'bg-slate-200',
      'Aluminum': 'bg-slate-300',
    };
    return colors[id] || 'bg-slate-800';
  };

  const getSolutionColor = (id: string) => {
    const colors: Record<string, string> = {
      'H2O+H2SO4': 'rgba(6, 182, 212, 0.2)', // cyan-500/20
      'NaCl (aq)': 'rgba(165, 243, 252, 0.2)', // cyan-200/20
      'NaCl (molten)': 'rgba(249, 115, 22, 0.6)', // orange-500/60
      'CuSO4': 'rgba(37, 99, 235, 0.5)', // blue-600/50
      'AgNO3': 'rgba(203, 213, 225, 0.3)', // slate-300/30
      'HCl': 'rgba(207, 250, 254, 0.2)', // cyan-100/20
      'Pb(NO3)2': 'rgba(226, 232, 240, 0.3)', // slate-200/30
    };
    
    let baseColor = colors[id] || 'rgba(6, 182, 212, 0.2)';
    
    let isAcid = id === 'HCl' || id === 'H2O+H2SO4';
    let isBase = false; // Add base solutions if needed
    let hasQuyTim = reactants.includes('Quỳ tím');
    let hasPhenol = reactants.includes('Phenolphtalein');

    if (hasQuyTim) {
      if (isAcid) return 'rgba(239, 68, 68, 0.6)';
      if (isBase) return 'rgba(59, 130, 246, 0.6)';
      return 'rgba(168, 85, 247, 0.6)';
    }
    if (hasPhenol) {
      if (isBase) return 'rgba(236, 72, 153, 0.6)';
      return 'rgba(255, 255, 255, 0.1)';
    }
    
    return baseColor;
  };

  const hasBubbles = (solution: string, electrode: 'anode' | 'cathode') => {
    if (solution === 'H2O+H2SO4') return true;
    if (solution === 'NaCl (aq)') return true;
    if (solution === 'HCl') return true;
    if (electrode === 'anode' && ['CuSO4', 'AgNO3', 'Pb(NO3)2'].includes(solution)) return true; // O2 bubbles
    return false;
  };

  const hasPlating = (solution: string) => {
    return ['CuSO4', 'AgNO3', 'Pb(NO3)2'].includes(solution);
  };

  const getPlatingColor = (solution: string) => {
    if (solution === 'CuSO4') return 'bg-orange-600/80';
    if (solution === 'AgNO3') return 'bg-gray-300/90';
    if (solution === 'Pb(NO3)2') return 'bg-slate-400/90';
    return '';
  };

  const anodeColor = getElectrodeColor(settings?.anode || 'Graphite');
  const cathodeColor = getElectrodeColor(settings?.cathode || 'Graphite');
  const solutionColor = getSolutionColor(settings?.solution || 'CuSO4');

  return (
    <div className="relative w-80 h-80 flex flex-col items-center justify-end">
      {/* Settings Button */}
      <button onClick={onOpenSettings} className="absolute -top-4 -right-4 p-2 bg-slate-700 rounded-full text-white hover:bg-slate-600 z-50 shadow-lg transition-transform hover:scale-110">
        <Settings className="w-5 h-5" />
      </button>

      {/* Cell Body */}
      <div className="absolute inset-0 border-4 border-t-0 border-white/20 rounded-b-3xl backdrop-blur-sm bg-white/5 z-20 pointer-events-none"></div>
      
      {/* Liquid */}
      <div 
        className="absolute bottom-1 w-[calc(100%-8px)] h-[70%] rounded-b-[20px] z-10 transition-colors duration-1000"
        style={{ backgroundColor: solutionColor }}
      >
        <div className="absolute top-0 w-full h-4 -mt-2 bg-white/20 rounded-[50%]"></div>
        
        {/* Membrane */}
        {settings?.hasMembrane && (
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-white/30 border-x border-white/50 border-dashed"></div>
        )}

        {/* Ions Animation */}
        {isRunning && !settings?.isPaused && (
          <div className="absolute inset-0 overflow-hidden">
            {/* Cations moving to Cathode (Right) */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`cat${i}`}
                initial={{ x: '30%', y: '50%', opacity: 0 }}
                animate={{ x: '70%', y: '50%', opacity: 1 }}
                transition={{ duration: 2 / (settings?.speed || 1), repeat: Infinity, delay: i * 0.4 }}
                className="absolute w-4 h-4 rounded-full bg-blue-400/50 flex items-center justify-center text-[8px] font-bold text-white"
              >
                +
              </motion.div>
            ))}
            {/* Anions moving to Anode (Left) */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`ani${i}`}
                initial={{ x: '70%', y: '60%', opacity: 0 }}
                animate={{ x: '30%', y: '60%', opacity: 1 }}
                transition={{ duration: 2 / (settings?.speed || 1), repeat: Infinity, delay: i * 0.4 }}
                className="absolute w-4 h-4 rounded-full bg-red-400/50 flex items-center justify-center text-[8px] font-bold text-white"
              >
                -
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Electrodes */}
      {/* Anode (Left) */}
      <div 
        className={cn("absolute top-8 left-16 w-6 h-48 border border-slate-600 rounded-sm z-15 transition-colors cursor-pointer hover:ring-2 hover:ring-white/50 group", anodeColor)}
        onClick={onOpenSettings}
        title="Nhấn để thay đổi điện cực"
      >
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-300">Anode (+)</div>
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-xs font-bold text-red-400 bg-slate-900/80 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          Đổi điện cực
        </div>
        {/* Anode Bubbles */}
        {isRunning && !settings?.isPaused && hasBubbles(settings?.solution, 'anode') && (
          <div className="absolute inset-0 overflow-visible">
            {[...Array(10)].map((_, i) => (
              <div key={`a${i}`} className="bubble w-2 h-2" style={{ left: '-10px', bottom: `${Math.random() * 100}%`, animationDelay: `${Math.random()}s`, animationDuration: `${(1 + Math.random()) / (settings?.speed || 1)}s` }} />
            ))}
          </div>
        )}
      </div>
      
      {/* Cathode (Right) */}
      <div 
        className={cn("absolute top-8 right-16 w-6 h-48 border border-slate-600 rounded-sm z-15 transition-colors cursor-pointer hover:ring-2 hover:ring-white/50 group", cathodeColor)}
        onClick={onOpenSettings}
        title="Nhấn để thay đổi điện cực"
      >
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-300">Cathode (-)</div>
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-400 bg-slate-900/80 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          Đổi điện cực
        </div>
        {/* Cathode Bubbles */}
        {isRunning && !settings?.isPaused && hasBubbles(settings?.solution, 'cathode') && (
          <div className="absolute inset-0 overflow-visible">
            {[...Array(15)].map((_, i) => (
              <div key={`c${i}`} className="bubble w-2 h-2" style={{ right: '-10px', bottom: `${Math.random() * 100}%`, animationDelay: `${Math.random()}s`, animationDuration: `${(1 + Math.random()) / (settings?.speed || 1)}s` }} />
            ))}
          </div>
        )}
        {/* Plating Effect */}
        {isRunning && !settings?.isPaused && hasPlating(settings?.solution) && (
          <motion.div 
            initial={{ opacity: 0, width: '100%', height: '100%' }}
            animate={{ opacity: 1, width: '120%', height: '105%', left: '-10%', bottom: '-2.5%' }}
            transition={{ duration: 10 / (settings?.speed || 1) }}
            className={cn("absolute bottom-0 rounded-sm z-20", getPlatingColor(settings?.solution))}
          />
        )}
      </div>

      {/* Wires */}
      <div className="absolute top-0 left-20 w-[calc(50%-20px)] h-1 bg-red-500 -translate-y-full">
        {/* Electron flow Anode -> Battery */}
        {isRunning && !settings?.isPaused && (
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              animate={{ x: ['100%', '0%'] }} 
              transition={{ duration: 1 / (settings?.speed || 1), repeat: Infinity, ease: "linear" }}
              className="w-2 h-2 bg-blue-300 rounded-full shadow-[0_0_5px_#93c5fd] -mt-0.5"
            />
          </div>
        )}
      </div>
      <div className="absolute top-0 right-20 w-[calc(50%-20px)] h-1 bg-black -translate-y-full">
        {/* Electron flow Battery -> Cathode */}
        {isRunning && !settings?.isPaused && (
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              animate={{ x: ['0%', '100%'] }} 
              transition={{ duration: 1 / (settings?.speed || 1), repeat: Infinity, ease: "linear" }}
              className="w-2 h-2 bg-blue-300 rounded-full shadow-[0_0_5px_#93c5fd] -mt-0.5"
            />
          </div>
        )}
      </div>
      
      {/* Power Source */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-12 bg-slate-800 border-2 border-slate-600 rounded-lg z-30 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <span className={cn("text-sm font-bold", isRunning && !settings?.isPaused ? "text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]" : "text-slate-500")}>DC {settings?.voltage || 12}V</span>
        {isRunning && !settings?.isPaused && <span className="text-[10px] text-green-300">{((settings?.voltage || 12) / 5).toFixed(1)}A</span>}
      </div>
    </div>
  );
}
