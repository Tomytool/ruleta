import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, X, RotateCcw, Trash2 } from 'lucide-react';

export default function WinnerModal({
  winner,
  isOpen,
  onClose,
  onSpinAgain,
  onRemoveWinner,
  theme = 'dark'
}) {
  const isLight = theme === 'light';

  useEffect(() => {
    if (isOpen && winner) {
      // Disparar confeti con dos ráfagas laterales y una central
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 40 * (timeLeft / duration);

        confetti({
          particleCount,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#95C92C', '#B5E655', '#4CB6C2', '#FF8F00', '#F06000']
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen, winner]);

  if (!isOpen || !winner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className={`relative w-full max-w-md border rounded-3xl p-6 sm:p-8 shadow-2xl text-center transform transition-all animate-scale-up ${
        isLight
          ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300/60'
          : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        {/* Botón de Cierre Superior */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
            isLight ? 'text-slate-500 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ícono de Trofeo Animado */}
        <div className="relative inline-flex items-center justify-center mb-4">
          <div className="absolute inset-0 bg-[#FF8F00]/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-amber-400 p-0.5 shadow-lg flex items-center justify-center">
            <div className={`w-full h-full rounded-full flex items-center justify-center ${
              isLight ? 'bg-white' : 'bg-slate-950'
            }`}>
              <Trophy className="w-10 h-10 text-amber-500 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Título de Celebración */}
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold tracking-widest text-amber-500 uppercase mb-1">
          <Sparkles className="w-4 h-4" />
          <span>¡Tenemos un Ganador!</span>
          <Sparkles className="w-4 h-4" />
        </div>

        {/* Tarjeta del Resultado Ganador */}
        <div
          className="my-5 p-5 rounded-2xl border shadow-xl backdrop-blur-md transition-all flex flex-col items-center justify-center"
          style={{
            backgroundColor: winner.color ? `${winner.color}35` : 'rgba(99, 102, 241, 0.2)',
            borderColor: winner.color || '#95C92C'
          }}
        >
          <span
            className={`text-2xl sm:text-3xl font-black tracking-wide break-words max-w-full ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            {winner.text}
          </span>
        </div>

        {/* Botones de Acción con Fondos Sólidos Sin Degradados */}
        <div className="flex flex-col gap-2.5 mt-6">
          <button
            onClick={onSpinAgain}
            className={`w-full font-black py-3.5 px-6 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 ${
              isLight
                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                : 'bg-white hover:bg-slate-100 text-slate-950'
            }`}
          >
            <RotateCcw className="w-5 h-5" />
            <span>Girar de Nuevo</span>
          </button>

          <button
            onClick={onRemoveWinner}
            className={`w-full border font-semibold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all text-xs ${
              isLight
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                : 'bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-200 border-slate-700'
            }`}
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span>Eliminar Ganador y Continuar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
