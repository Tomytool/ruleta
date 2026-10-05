import React, { useState, useEffect } from 'react';
import RouletteWheel from './components/RouletteWheel';
import ConfigPanel from './components/ConfigPanel';
import WinnerModal from './components/WinnerModal';
import HistoryPanel from './components/HistoryPanel';
import { PRESETS } from './utils/presets';
import {
  Sparkles,
  Maximize2,
  Minimize2,
  Dices,
  SlidersHorizontal,
  History,
  X,
  Sun,
  Moon,
  Menu
} from 'lucide-react';

export default function App() {
  // Estado del Tema (Dark / Light)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('ruleta_theme');
    return saved ? saved : 'dark';
  });

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ruleta_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((item, idx) => ({
            id: item.id || `item_${idx}_${Date.now()}`,
            text: String(item.text ?? ''),
            color: item.color || '#95C92C'
          }));
        }
      }
    } catch (e) {
      console.warn('Error cargando ruleta_items:', e);
    }
    return PRESETS[0].items.map((item, idx) => ({
      id: item.id || `preset_${idx}`,
      text: String(item.text),
      color: item.color
    }));
  });

  const [duration, setDuration] = useState(() => {
    const saved = localStorage.getItem('ruleta_duration');
    return saved ? Number(saved) : 5;
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('ruleta_sound');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [removeOnWin, setRemoveOnWin] = useState(() => {
    const saved = localStorage.getItem('ruleta_remove_on_win');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('ruleta_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Control del Menú Lateral Desplegable
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSidebarView, setActiveSidebarView] = useState('config'); // 'config' | 'history'

  // Control del Menú Hamburguesa para Móviles (320px+)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Aplicar tema en el elemento HTML raíz
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ruleta_theme', theme);
  }, [theme]);

  // Guardar configuraciones en LocalStorage
  useEffect(() => {
    localStorage.setItem('ruleta_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('ruleta_duration', duration.toString());
  }, [duration]);

  useEffect(() => {
    localStorage.setItem('ruleta_sound', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('ruleta_remove_on_win', JSON.stringify(removeOnWin));
  }, [removeOnWin]);

  useEffect(() => {
    localStorage.setItem('ruleta_history', JSON.stringify(history));
  }, [history]);

  // Al finalizar el giro
  const handleSpinEnd = (winningItem) => {
    if (!winningItem) return;
    setIsSpinning(false);
    setWinner(winningItem);
    setIsWinnerModalOpen(true);

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setHistory((prev) => [
      {
        id: winningItem.id,
        text: String(winningItem.text),
        color: winningItem.color,
        time: timeString
      },
      ...prev
    ]);

    if (removeOnWin) {
      setItems((prevItems) => prevItems.filter((it) => it.id !== winningItem.id));
    }
  };

  // Girar de nuevo desde el modal
  const handleSpinAgain = () => {
    setIsWinnerModalOpen(false);
    setWinner(null);
  };

  // Eliminar ganador manualmente desde el modal
  const handleRemoveWinnerManually = () => {
    if (winner) {
      setItems((prevItems) => prevItems.filter((it) => it.id !== winner.id));
    }
    setIsWinnerModalOpen(false);
    setWinner(null);
  };

  // Pantalla Completa
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  const isLight = theme === 'light';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-slate-800 selection:text-white relative overflow-x-hidden transition-colors duration-300 ${
        isLight
          ? 'bg-slate-100 text-slate-900'
          : 'bg-[#090D16] text-slate-100'
      }`}
    >
      {/* Fondo Neón / Glow decorativo sutil */}
      <div
        className={`absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
          isLight ? 'bg-slate-300/30' : 'bg-slate-800/20'
        }`}
      />
      <div
        className={`absolute bottom-0 right-1/3 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
          isLight ? 'bg-slate-300/30' : 'bg-slate-800/20'
        }`}
      />

      {/* Header Principal */}
      <header
        className={`sticky top-0 z-30 px-3 py-3 sm:px-8 flex items-center justify-between border-b backdrop-blur-xl shadow-md transition-colors duration-300 ${
          isLight
            ? 'bg-white/90 border-slate-200 text-slate-900 shadow-slate-200/50'
            : 'bg-slate-950/90 border-slate-800/80 text-white'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shadow-md shrink-0 ${
            isLight ? 'bg-slate-900 text-white' : 'bg-white text-slate-950'
          }`}>
            <Dices className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-black tracking-tight uppercase truncate">
              RULETA ALEATORIA
            </h1>
            <p className={`text-[10px] sm:text-[11px] font-medium truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              100% Configurable • {items.length} opciones
            </p>
          </div>
        </div>

        {/* 💻 BOTONES DESKTOP / TABLET (>= 640px / sm) */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* SELECTOR DE TEMA (MODO OSCURO / MODO CLARO) */}
          <div className={`flex items-center p-1 rounded-2xl border transition-colors ${
            isLight ? 'bg-slate-200/90 border-slate-300' : 'bg-slate-900 border-slate-800'
          }`}>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                theme === 'dark'
                  ? 'bg-white text-slate-950 shadow-md'
                  : isLight ? 'text-slate-700 hover:text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="Modo Oscuro"
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Oscuro</span>
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                theme === 'light'
                  ? 'bg-slate-900 text-white shadow-md'
                  : isLight ? 'text-slate-700 hover:text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="Modo Claro"
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Claro</span>
            </button>
          </div>

          {/* Botón Abrir Historial */}
          <button
            onClick={() => {
              setActiveSidebarView('history');
              setIsSidebarOpen(true);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 border ${
              isLight
                ? 'bg-slate-200 hover:bg-slate-300 border-slate-300 text-slate-900'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
            }`}
            title="Ver historial de sorteos"
          >
            <History className="w-4 h-4" />
            <span>Historial</span>
            {history.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                isLight ? 'bg-slate-900 text-white' : 'bg-white text-slate-950'
              }`}>
                {history.length}
              </span>
            )}
          </button>

          {/* Botón Abrir Menú Lateral de Configuración */}
          <button
            onClick={() => {
              setActiveSidebarView('config');
              setIsSidebarOpen(true);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 border ${
              isLight
                ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
                : 'bg-white hover:bg-slate-100 text-slate-950 border-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Configurar</span>
          </button>

          {/* Botón Pantalla Completa */}
          <button
            onClick={toggleFullscreen}
            className={`p-2.5 rounded-xl transition-all shadow-md border ${
              isLight
                ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-900'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-white'
            }`}
            title={isFullscreen ? 'Salir de Pantalla Completa' : 'Pantalla Completa'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* 📱 BOTÓN MÓVIL HAMBURGUESA (< 640px / 320px+) */}
        <div className="flex sm:hidden items-center gap-1.5">
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className={`p-2.5 rounded-xl border font-bold transition-all shadow-md active:scale-95 ${
              isLight
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-950 border-white'
            }`}
            title="Abrir menú de opciones"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* 📱 MENÚ MÓVIL DESPLEGABLE DE CABECERA (< 640px / 320px+) */}
      {isMobileNavOpen && (
        <div className={`sm:hidden sticky top-[57px] z-20 border-b p-3 space-y-2 animate-scale-up shadow-xl transition-colors ${
          isLight
            ? 'bg-white/95 border-slate-200 text-slate-900'
            : 'bg-slate-950/95 border-slate-800 text-white'
        }`}>
          <div className="grid grid-cols-2 gap-2">
            {/* Botón Configurar */}
            <button
              onClick={() => {
                setActiveSidebarView('config');
                setIsSidebarOpen(true);
                setIsMobileNavOpen(false);
              }}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-xl font-black text-xs border shadow-sm ${
                isLight
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-950 border-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Configurar</span>
            </button>

            {/* Botón Historial */}
            <button
              onClick={() => {
                setActiveSidebarView('history');
                setIsSidebarOpen(true);
                setIsMobileNavOpen(false);
              }}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-xl font-bold text-xs border ${
                isLight
                  ? 'bg-slate-100 text-slate-900 border-slate-300'
                  : 'bg-slate-900 text-white border-slate-800'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Historial ({history.length})</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/20">
            {/* Selector de Tema Móvil */}
            <div className={`flex flex-1 items-center p-1 rounded-xl border ${
              isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-900 border-slate-800'
            }`}>
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  theme === 'dark'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : isLight ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Oscuro</span>
              </button>

              <button
                onClick={() => setTheme('light')}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  theme === 'light'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : isLight ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Claro</span>
              </button>
            </div>

            {/* Pantalla Completa Móvil */}
            <button
              onClick={() => {
                toggleFullscreen();
                setIsMobileNavOpen(false);
              }}
              className={`p-2.5 rounded-xl border text-xs font-bold ${
                isLight
                  ? 'bg-slate-100 border-slate-300 text-slate-900'
                  : 'bg-slate-900 border-slate-800 text-white'
              }`}
              title="Pantalla Completa"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Área Principal de la Ruleta (Totalmente Centrada) */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 relative max-w-6xl w-full mx-auto">
        <div className="w-full flex flex-col items-center justify-center">
          <RouletteWheel
            items={items}
            isSpinning={isSpinning}
            duration={duration}
            soundEnabled={soundEnabled}
            onSpinStart={() => setIsSpinning(true)}
            onSpinEnd={handleSpinEnd}
          />
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`border-t py-3 text-center text-[11px] sm:text-xs transition-colors duration-300 ${
          isLight
            ? 'bg-white/80 border-slate-200 text-slate-600'
            : 'bg-slate-950/80 border-slate-900 text-slate-400'
        }`}
      >
        Ruleta Aleatoria Configurable • Modo {theme === 'dark' ? 'Oscuro' : 'Claro'}
      </footer>

      {/* MENÚ LATERAL DESPLEGABLE (DRAWER SIDEBAR) */}
      {/* Superposición Oscura de Fondo (Backdrop Blur) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Panel Lateral Deslizable */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[440px] max-w-full shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex-1 p-3 sm:p-6 overflow-hidden flex flex-col">
          {activeSidebarView === 'config' ? (
            <ConfigPanel
              items={items}
              setItems={setItems}
              duration={duration}
              setDuration={setDuration}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
              removeOnWin={removeOnWin}
              setRemoveOnWin={setRemoveOnWin}
              theme={theme}
              setTheme={setTheme}
              onClose={() => setIsSidebarOpen(false)}
            />
          ) : (
            <div className={`flex flex-col h-full border rounded-3xl p-4 sm:p-5 backdrop-blur-2xl ${
              isLight ? 'bg-white/95 border-slate-200 text-slate-900' : 'bg-slate-900/95 border-slate-800 text-white'
            }`}>
              <div className={`flex items-center justify-between pb-3 mb-4 border-b ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}>
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  <h3 className="text-base font-black uppercase">
                    Historial de Sorteos
                  </h3>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className={`p-2 rounded-xl ${
                    isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <HistoryPanel
                  history={history}
                  onClearHistory={() => setHistory([])}
                  theme={theme}
                />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Modal de Ganador con Confeti */}
      <WinnerModal
        winner={winner}
        isOpen={isWinnerModalOpen}
        onClose={() => setIsWinnerModalOpen(false)}
        onSpinAgain={handleSpinAgain}
        onRemoveWinner={handleRemoveWinnerManually}
        theme={theme}
      />
    </div>
  );
}
