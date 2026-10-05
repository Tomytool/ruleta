import React, { useEffect, useRef, useState } from 'react';
import { soundEngine } from '../utils/sound';
import { Play, RefreshCw, Dices } from 'lucide-react';

export default function RouletteWheel({
  items = [],
  isSpinning = false,
  duration = 5, // en segundos
  soundEnabled = true,
  onSpinStart = () => {},
  onSpinEnd = () => {}
}) {
  const canvasRef = useRef(null);
  const currentAngleRef = useRef(0);
  const animationFrameRef = useRef(null);
  const lastTickSliceRef = useRef(-1);
  const [pointerBounce, setPointerBounce] = useState(false);

  // Detección de pantalla pequeña (<= 480px / 320px) para cambiar a Modo Rectangular Digital
  const [isMobileScreen, setIsMobileScreen] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth <= 480;
  });

  // Estado del Carrete Rectangular Digital
  const [reelOffset, setReelOffset] = useState(0);
  const [displayedItemIndex, setDisplayedItemIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 480);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Asegurar que soundEngine tenga el estado actual de sonido
  useEffect(() => {
    soundEngine.toggleSound(soundEnabled);
  }, [soundEnabled]);

  // DIBUJAR LA RULETA CIRCULAR (CANVAS EN ESCRITORIO / TABLETS > 480px)
  const drawWheel = (angleOffset = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(centerX, centerY) - 20;
    const innerRadius = 35;

    ctx.clearRect(0, 0, width, height);

    if (!items || items.length === 0) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = '600 16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Agrega elementos para girar', centerX, centerY);
      ctx.restore();
      return;
    }

    const total = items.length;
    const sliceAngle = (2 * Math.PI) / total;

    // Rim exterior metálico
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius + 8, 0, 2 * Math.PI);
    const rimGradient = ctx.createRadialGradient(
      centerX, centerY, outerRadius,
      centerX, centerY, outerRadius + 12
    );
    rimGradient.addColorStop(0, '#334155');
    rimGradient.addColorStop(0.5, '#0F172A');
    rimGradient.addColorStop(1, '#1E293B');
    ctx.fillStyle = rimGradient;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.restore();

    // Sectores
    items.forEach((item, index) => {
      const startAngle = angleOffset + index * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = item.color || '#3B82F6';
      ctx.fill();

      const sliceGradient = ctx.createRadialGradient(
        centerX, centerY, innerRadius,
        centerX, centerY, outerRadius
      );
      sliceGradient.addColorStop(0, 'rgba(255,255,255,0.25)');
      sliceGradient.addColorStop(0.7, 'rgba(255,255,255,0)');
      sliceGradient.addColorStop(1, 'rgba(0,0,0,0.15)');
      ctx.fillStyle = sliceGradient;
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = total > 30 ? 1 : 2;
      ctx.stroke();

      // Texto
      ctx.translate(centerX, centerY);
      const textAngle = startAngle + sliceAngle / 2;
      ctx.rotate(textAngle);

      const maxTextWidth = outerRadius - innerRadius - 20;
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 3;

      const textString = String(item?.text ?? '');
      let fontSize = Math.min(18, Math.max(8, Math.floor(220 / Math.max(total, 1))));
      if (textString.length > 12) fontSize = Math.max(8, fontSize - 3);
      ctx.font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      let displayLength = textString;
      if (ctx.measureText(displayLength).width > maxTextWidth) {
        while (ctx.measureText(displayLength + '...').width > maxTextWidth && displayLength.length > 0) {
          displayLength = displayLength.slice(0, -1);
        }
        displayLength += '...';
      }

      ctx.fillText(displayLength, outerRadius - 15, 0);
      ctx.restore();
    });

    // Pins exteriores
    items.forEach((_, index) => {
      const pinAngle = angleOffset + index * sliceAngle;
      const pinX = centerX + (outerRadius + 2) * Math.cos(pinAngle);
      const pinY = centerY + (outerRadius + 2) * Math.sin(pinAngle);

      ctx.save();
      ctx.beginPath();
      ctx.arc(pinX, pinY, total > 20 ? 2.5 : 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#F8FAFC';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    });

    // Hub Central
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    const hubGrad = ctx.createRadialGradient(
      centerX - 5, centerY - 5, 2,
      centerX, centerY, innerRadius
    );
    hubGrad.addColorStop(0, '#FFFFFF');
    hubGrad.addColorStop(0.3, '#E2E8F0');
    hubGrad.addColorStop(0.8, '#64748B');
    hubGrad.addColorStop(1, '#1E293B');
    ctx.fillStyle = hubGrad;
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, 2 * Math.PI);
    ctx.fillStyle = '#6366F1';
    ctx.fill();
    ctx.restore();
  };

  // Redibujar rueda circular cuando cambian los ítems o el tamaño
  useEffect(() => {
    if (!isMobileScreen) {
      drawWheel(currentAngleRef.current);
    }
  }, [items, isMobileScreen]);

  // MANEJO DEL GIRO (Ambos Modos: Circular y Rectangular)
  const handleSpin = () => {
    if (isSpinning || items.length === 0) return;

    onSpinStart();

    const startTime = performance.now();
    const durationMs = duration * 1000;
    const winningIndex = Math.floor(Math.random() * items.length);

    if (isMobileScreen) {
      // GIRO EN MODO RECTANGULAR DIGITAL (PANTALLA DE CARRETE)
      const totalItems = items.length;
      const totalSteps = totalItems * 10 + winningIndex; // Vueltas del carrete

      const animateReel = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);

        const currentStep = Math.floor(totalSteps * easeOut);
        const currentIdx = currentStep % totalItems;

        if (currentIdx !== lastTickSliceRef.current) {
          lastTickSliceRef.current = currentIdx;
          soundEngine.playTick(0.3 + (1 - progress) * 0.3);
          setPointerBounce(true);
          setTimeout(() => setPointerBounce(false), 50);
        }

        setDisplayedItemIndex(currentIdx);
        setReelOffset(totalSteps * easeOut);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animateReel);
        } else {
          setDisplayedItemIndex(winningIndex);
          soundEngine.playWin();
          onSpinEnd(items[winningIndex]);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animateReel);
    } else {
      // GIRO EN MODO CIRCULAR CANVAS
      const startAngle = currentAngleRef.current % (2 * Math.PI);
      const totalSlices = items.length;
      const sliceAngle = (2 * Math.PI) / totalSlices;

      const pointerAngle = 1.5 * Math.PI;
      const targetSliceCenterOffset = (winningIndex + 0.5) * sliceAngle;
      const randomOffsetInSlice = (Math.random() - 0.5) * (sliceAngle * 0.7);

      const fullSpins = 6 + Math.floor(Math.random() * 4);
      let targetAngle = startAngle + (fullSpins * 2 * Math.PI) + (pointerAngle - targetSliceCenterOffset - (startAngle % (2 * Math.PI))) + randomOffsetInSlice;
      
      while (targetAngle <= startAngle + fullSpins * 2 * Math.PI) {
        targetAngle += 2 * Math.PI;
      }

      const totalDeltaAngle = targetAngle - startAngle;

      const animateCircular = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);

        const currentAngle = startAngle + totalDeltaAngle * easeOut;
        currentAngleRef.current = currentAngle;

        const currentPointerOffset = (pointerAngle - (currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const currentSliceUnderPointer = Math.floor(currentPointerOffset / sliceAngle);

        if (currentSliceUnderPointer !== lastTickSliceRef.current) {
          lastTickSliceRef.current = currentSliceUnderPointer;
          soundEngine.playTick(0.3 + (1 - progress) * 0.3);
          setPointerBounce(true);
          setTimeout(() => setPointerBounce(false), 50);
        }

        drawWheel(currentAngle);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animateCircular);
        } else {
          soundEngine.playWin();
          onSpinEnd(items[winningIndex]);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animateCircular);
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // RENDERIZADO 1: PANTALLA RECTANGULAR DIGITAL (MÓVILES <= 480px / 320px)
  if (isMobileScreen) {
    const currentItem = items[displayedItemIndex] || items[0] || { text: 'Sin Opciones', color: '#334155' };
    const prevItem = items[(displayedItemIndex - 1 + items.length) % items.length] || currentItem;
    const nextItem = items[(displayedItemIndex + 1) % items.length] || currentItem;

    return (
      <div className="w-full flex flex-col items-center justify-center p-2 max-w-[340px]">
        {/* Marco de Pantalla Rectangular Digital */}
        <div className="relative w-full bg-slate-900 border-2 border-slate-700 rounded-3xl p-4 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Luces decorativas superiores */}
          <div className="flex justify-between items-center mb-2 px-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
              <Dices className="w-3.5 h-3.5 text-amber-400" />
              Slot Digital 320px
            </span>
            <div className="flex gap-1.5">
              <div className={`w-2 h-2 rounded-full ${isSpinning ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
              <div className="w-2 h-2 rounded-full bg-slate-600" />
            </div>
          </div>

          {/* Visor Rectangular Central del Carrete */}
          <div className="relative h-44 w-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center shadow-inner">
            {/* Puntero Indicador Central (Marco de la Opción Activa) */}
            <div
              className={`absolute inset-x-2 top-1/2 -translate-y-1/2 h-16 rounded-xl border-2 transition-transform duration-75 z-20 pointer-events-none ${
                pointerBounce ? 'scale-105 border-amber-400 shadow-amber-500/50' : 'scale-100 border-white/60 shadow-lg'
              }`}
              style={{
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)'
              }}
            >
              {/* Indicadores triangulares en los extremos */}
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-400 rotate-45" />
              <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-400 rotate-45" />
            </div>

            {/* Ítem Anterior (Desfilando arriba) */}
            <div className="opacity-30 blur-[1px] transform -translate-y-3 scale-90 py-1 text-center font-bold text-sm text-slate-300">
              {String(prevItem?.text ?? '')}
            </div>

            {/* Ítem Actual Ganador / Seleccionado (En el Centro del Visor) */}
            <div
              className="z-10 px-4 py-2.5 rounded-xl max-w-[90%] w-full text-center transition-all duration-75 flex items-center justify-center shadow-md"
              style={{
                backgroundColor: currentItem?.color || '#3B82F6',
                color: '#FFFFFF'
              }}
            >
              <span className="text-xl sm:text-2xl font-black truncate tracking-wide text-white drop-shadow-md">
                {String(currentItem?.text ?? '')}
              </span>
            </div>

            {/* Ítem Siguiente (Desfilando abajo) */}
            <div className="opacity-30 blur-[1px] transform translate-y-3 scale-90 py-1 text-center font-bold text-sm text-slate-300">
              {String(nextItem?.text ?? '')}
            </div>
          </div>

          {/* Botón Sólido de Acción "GIRAR" */}
          <button
            onClick={handleSpin}
            disabled={isSpinning || items.length === 0}
            className={`w-full mt-4 py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider
              flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                isSpinning
                  ? 'bg-amber-500 text-slate-950 animate-pulse'
                  : 'bg-white text-slate-950 hover:bg-slate-100 ring-2 ring-white/30'
              }`}
          >
            {isSpinning ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>GIRANDO...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current ml-0.5" />
                <span>GIRAR RULETA</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // RENDERIZADO 2: RULETA CIRCULAR CANVAS (DESKTOP / TABLETS > 480px)
  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Puntero Superior (Flecha Indicadora) */}
      <div
        className={`absolute top-1 z-20 transition-transform duration-75 origin-top ${
          pointerBounce ? '-translate-y-1 scale-110 rotate-3' : 'translate-y-0 scale-100 rotate-0'
        }`}
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}
      >
        <svg width="40" height="48" viewBox="0 0 40 48" fill="none">
          <path
            d="M20 44L4 10C2.5 7 4.5 3 8 3H32C35.5 3 37.5 7 36 10L20 44Z"
            fill="url(#pointer-grad)"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="pointer-grad" x1="20" y1="3" x2="20" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EF4444" />
              <stop offset="1" stopColor="#DC2626" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Contenedor del Canvas */}
      <div className="relative rounded-full shadow-2xl bg-slate-900/60 p-2 backdrop-blur-md border border-slate-700/50">
        <canvas
          ref={canvasRef}
          width={440}
          height={440}
          className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full cursor-pointer max-w-full"
          onClick={handleSpin}
        />

        {/* Botón Central "GIRAR" */}
        <button
          onClick={handleSpin}
          disabled={isSpinning || items.length === 0}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 
            w-16 h-16 sm:w-20 sm:h-20 rounded-full font-black text-xs sm:text-sm tracking-wider uppercase
            flex flex-col items-center justify-center transition-all duration-300
            shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              isSpinning
                ? 'bg-amber-500 text-slate-950 animate-pulse'
                : 'bg-white text-slate-950 hover:bg-slate-100 ring-4 ring-white/20'
            }`}
        >
          {isSpinning ? (
            <RefreshCw className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Play className="w-5 h-5 fill-current ml-0.5 mb-0.5" />
              <span>GIRAR</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
