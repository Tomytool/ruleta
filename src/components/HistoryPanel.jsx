import React from 'react';
import { History, Trash2, Copy, Trophy } from 'lucide-react';

export default function HistoryPanel({ history = [], onClearHistory = () => {}, theme = 'dark' }) {
  const isLight = theme === 'light';

  const handleCopyHistory = () => {
    if (history.length === 0) return;
    const text = history
      .map((h, i) => `${i + 1}. ${h.text} (${h.time})`)
      .join('\n');
    navigator.clipboard.writeText(text);
    alert('Historial copiado al portapapeles');
  };

  return (
    <div className={`border rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-xl flex flex-col ${
      isLight ? 'bg-white/95 border-slate-200' : 'bg-slate-900/80 border-slate-800'
    }`}>
      <div className={`flex items-center justify-between pb-3 border-b mb-3 ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#4CB6C2]" />
          <h3 className={`text-sm font-bold uppercase tracking-wider ${
            isLight ? 'text-slate-900' : 'text-slate-200'
          }`}>
            Historial de Sorteos
          </h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#4CB6C2]/20 text-[#4CB6C2] border border-[#4CB6C2]/40">
          {history.length}
        </span>
      </div>

      {history.length === 0 ? (
        <div className="py-6 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
          <Trophy className="w-6 h-6 opacity-30" />
          <span>Aún no hay ganadores en esta sesión.</span>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto space-y-2 max-h-[260px] pr-1 custom-scrollbar">
            {history.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                  isLight
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-slate-950/60 border-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                    isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {history.length - idx}
                  </span>
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color || '#95C92C' }}
                  />
                  <span className={`font-semibold truncate ${
                    isLight ? 'text-slate-900' : 'text-slate-200'
                  }`}>
                    {item.text}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono ml-2 shrink-0">
                  {item.time}
                </span>
              </div>
            ))}
          </div>

          <div className={`flex items-center justify-end gap-2 pt-3 mt-2 border-t ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}>
            <button
              onClick={handleCopyHistory}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all ${
                isLight
                  ? 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
                  : 'text-slate-400 hover:text-indigo-300 bg-slate-800/60 hover:bg-slate-800'
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar</span>
            </button>
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 px-3 py-1.5 rounded-lg transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
