import React, { useState } from 'react';
import { PRESETS, PALETTES, BRAND_PALETTE } from '../utils/presets';
import {
  Plus,
  Trash2,
  Shuffle,
  Volume2,
  VolumeX,
  UserCheck,
  UserX,
  Clock,
  Sparkles,
  FileText,
  List,
  Hash,
  ArrowRight,
  Layers,
  RotateCcw,
  X,
  SlidersHorizontal,
  ChevronDown,
  Check,
  Sun,
  Moon,
  Palette
} from 'lucide-react';

export default function ConfigPanel({
  items,
  setItems,
  duration,
  setDuration,
  soundEnabled,
  setSoundEnabled,
  removeOnWin,
  setRemoveOnWin,
  theme = 'dark',
  setTheme = () => {},
  onClose
}) {
  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'range' | 'presets' | 'bulk' | 'settings'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [newItemText, setNewItemText] = useState('');
  const [bulkText, setBulkText] = useState('');

  // Estado para Rango Numérico
  const [startNum, setStartNum] = useState(1);
  const [endNum, setEndNum] = useState(20);
  const [stepNum, setStepNum] = useState(1);

  const isLight = theme === 'light';

  // Definición de Secciones con íconos y descripciones claras
  const SECTIONS = [
    {
      id: 'items',
      label: `Lista de Opciones (${items.length})`,
      desc: 'Ver, editar o eliminar elementos actuales',
      icon: List
    },
    {
      id: 'range',
      label: 'Rango Numérico Correlativo',
      desc: 'Generar secuencia automática de números',
      icon: Hash
    },
    {
      id: 'presets',
      label: 'Presets Predefinidos',
      desc: 'Plantillas rápidas de números y nombres',
      icon: Sparkles
    },
    {
      id: 'bulk',
      label: 'Carga Masiva',
      desc: 'Pegar lista de opciones por líneas o comas',
      icon: FileText
    },
    {
      id: 'settings',
      label: 'Ajustes de Giro, Sonido y Tema',
      desc: 'Duración, audio, modo claro/oscuro y reglas',
      icon: Clock
    }
  ];

  const currentSection = SECTIONS.find((s) => s.id === activeTab) || SECTIONS[0];
  const CurrentIcon = currentSection.icon;

  // Generar color aleatorio de la paleta por defecto
  const getRandomColor = (index) => {
    return BRAND_PALETTE[index % BRAND_PALETTE.length];
  };

  // Agregar un solo ítem
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
      text: newItemText.trim(),
      color: getRandomColor(items.length)
    };

    setItems([...items, newItem]);
    setNewItemText('');
  };

  // Generar Rango Numérico Correlativo
  const handleGenerateRange = (replace = false) => {
    const start = parseInt(startNum, 10);
    const end = parseInt(endNum, 10);
    const step = Math.max(1, parseInt(stepNum, 10) || 1);

    if (isNaN(start) || isNaN(end)) {
      alert('Por favor, ingresa números inicial y final válidos.');
      return;
    }

    if (start > end) {
      alert('El número inicial debe ser menor o igual al número final.');
      return;
    }

    const generated = [];
    let count = 0;
    const maxItems = 250;

    for (let num = start; num <= end; num += step) {
      if (count >= maxItems) {
        alert(`Se generaron hasta ${maxItems} elementos para garantizar un rendimiento óptimo.`);
        break;
      }
      generated.push({
        id: `range_${num}_${Date.now()}_${count}`,
        text: String(num),
        color: getRandomColor((replace ? 0 : items.length) + count)
      });
      count++;
    }

    if (generated.length === 0) {
      alert('No se generaron números en el rango especificado.');
      return;
    }

    if (replace) {
      setItems(generated);
    } else {
      setItems([...items, ...generated]);
    }

    setActiveTab('items');
  };

  // Carga masiva por salto de línea o coma
  const handleBulkAdd = () => {
    if (!bulkText.trim()) return;

    const lines = bulkText
      .split(/[\n,]+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const newItems = lines.map((text, idx) => ({
      id: Date.now().toString() + idx + Math.random().toString(36).substr(2, 4),
      text,
      color: getRandomColor(items.length + idx)
    }));

    setItems([...items, ...newItems]);
    setBulkText('');
    setActiveTab('items');
  };

  // Actualizar ítem específico (texto o color)
  const handleUpdateItem = (id, key, value) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  };

  // Eliminar un ítem
  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Mezclar orden de los ítems
  const handleShuffle = () => {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setItems(shuffled);
  };

  // Cargar preset
  const handleLoadPreset = (preset) => {
    const loaded = preset.items.map((item, idx) => ({
      id: Date.now().toString() + idx,
      text: String(item.text),
      color: item.color || getRandomColor(idx)
    }));
    setItems(loaded);
  };

  // Limpiar todos los ítems
  const handleClearAll = () => {
    if (window.confirm('¿Deseas borrar todos los elementos de la ruleta?')) {
      setItems([]);
    }
  };

  return (
    <div
      className={`border rounded-3xl p-5 backdrop-blur-2xl shadow-2xl flex flex-col h-full overflow-hidden relative transition-colors duration-300 ${
        isLight
          ? 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/60'
          : 'bg-slate-900/95 border-slate-800 text-slate-100'
      }`}
    >
      {/* Encabezado del Panel Lateral con botón de Cierre */}
      <div className={`flex items-center justify-between pb-4 mb-4 border-b shrink-0 ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isLight ? 'bg-slate-900 text-white' : 'bg-white text-slate-950'
          }`}>
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`text-base font-black tracking-tight uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Configuración
            </h3>
            <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Personaliza tu ruleta
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all ${
              isLight
                ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
            title="Cerrar panel"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* MENÚ DESPLEGABLE (DROPDOWN SELECTOR DE SECCIONES) */}
      <div className="relative mb-5 shrink-0 z-20">
        <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
          isLight ? 'text-slate-500' : 'text-slate-400'
        }`}>
          Sección Activa
        </label>

        {/* Botón Principal del Desplegable */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-full flex items-center justify-between gap-3 border rounded-2xl px-4 py-3 text-left transition-all shadow-md focus:outline-none ${
            isLight
              ? 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-900'
              : 'bg-slate-950/80 hover:bg-slate-800/80 border-slate-700/80 text-slate-100'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              isLight ? 'bg-slate-900 text-white' : 'bg-white text-slate-950'
            }`}>
              <CurrentIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-bold truncate ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {currentSection.label}
              </p>
              <p className={`text-[11px] truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {currentSection.desc}
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            } ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>

        {/* Lista Flotante de Opciones del Desplegable */}
        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className={`absolute top-full left-0 right-0 mt-2 z-40 border rounded-2xl shadow-2xl p-1.5 space-y-1 animate-scale-up ${
              isLight
                ? 'bg-white border-slate-200'
                : 'bg-slate-950 border-slate-800'
            }`}>
              {SECTIONS.map((sec) => {
                const SecIcon = sec.icon;
                const isSelected = sec.id === activeTab;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(sec.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left ${
                      isSelected
                        ? isLight
                          ? 'bg-slate-900 text-white font-bold'
                          : 'bg-white text-slate-950 font-black shadow-md'
                        : isLight
                        ? 'hover:bg-slate-100 text-slate-700'
                        : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <SecIcon
                        className="w-4 h-4 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">
                          {sec.label}
                        </p>
                        <p className="text-[10px] opacity-80 truncate">
                          {sec.desc}
                        </p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* CONTENIDO 1: Lista de Ítems */}
      {activeTab === 'items' && (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Formulario para Agregar 1 Ítem */}
          <form onSubmit={handleAddItem} className="flex gap-2 mb-4 shrink-0">
            <input
              type="text"
              placeholder="Agregar opción (nombre o número)..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              className={`flex-1 border rounded-xl px-4 py-2.5 text-sm transition-all focus:outline-none ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  : 'bg-slate-950/80 border-slate-700/70 text-slate-100 placeholder-slate-500'
              }`}
            />
            <button
              type="submit"
              className={`px-4 py-2.5 rounded-xl font-black text-sm flex items-center gap-1.5 transition-all shadow-md active:scale-95 shrink-0 ${
                isLight
                  ? 'bg-slate-900 hover:bg-slate-800 text-white'
                  : 'bg-white hover:bg-slate-100 text-slate-950'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Agregar</span>
            </button>
          </form>

          {/* Acciones de Lista (Mezclar / Limpiar) */}
          {items.length > 0 && (
            <div className={`flex items-center justify-between gap-2 mb-3 pb-2 border-b shrink-0 ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}>
              <span className={`text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Total: <strong>{items.length}</strong> elementos
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShuffle}
                  className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${
                    isLight
                      ? 'text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200'
                      : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700'
                  }`}
                  title="Mezclar orden aleatoriamente"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Mezclar</span>
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 px-2.5 py-1 rounded-lg transition-all"
                  title="Borrar todos los elementos"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Vaciar</span>
                </button>
              </div>
            </div>
          )}

          {/* Lista Scrolleable de Elementos */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
            {items.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm flex flex-col items-center justify-center gap-2">
                <List className="w-8 h-8 opacity-40" />
                <p>No hay elementos en la ruleta.</p>
                <p className="text-xs text-slate-400">
                  Agrega nombres, números o usa el Rango Numérico.
                </p>
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-2 border p-2 rounded-xl transition-all group ${
                    isLight
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      : 'bg-slate-950/50 hover:bg-slate-800/40 border-slate-800/80'
                  }`}
                >
                  {/* Selector de Color */}
                  <input
                    type="color"
                    value={item.color || '#95C92C'}
                    onChange={(e) =>
                      handleUpdateItem(item.id, 'color', e.target.value)
                    }
                    className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0 overflow-hidden shrink-0"
                    title="Cambiar color del sector"
                  />

                  {/* Edición de Texto */}
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) =>
                      handleUpdateItem(item.id, 'text', e.target.value)
                    }
                    className={`flex-1 bg-transparent border-0 text-sm font-semibold focus:outline-none focus:px-2 focus:rounded-md transition-all ${
                      isLight ? 'text-slate-900 focus:bg-white' : 'text-slate-200 focus:bg-slate-900/80'
                    }`}
                  />

                  {/* Botón Eliminar */}
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg opacity-80 group-hover:opacity-100 transition-all shrink-0"
                    title="Eliminar opción"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* CONTENIDO: Rango Numérico Correlativo */}
      {activeTab === 'range' && (
        <div className="flex-1 flex flex-col space-y-4 overflow-y-auto pr-1 custom-scrollbar">
          <div className={`border p-4 rounded-2xl space-y-3 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
          }`}>
            <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Hash className="w-4 h-4" />
              Generador de Números Correlativos
            </h4>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Genera automáticamente números desde un valor inicial hasta un valor final.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Número Inicial
                </label>
                <input
                  type="number"
                  value={startNum}
                  onChange={(e) => setStartNum(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-slate-900 border-slate-700/80 text-slate-100'
                  }`}
                  placeholder="1"
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Número Final
                </label>
                <input
                  type="number"
                  value={endNum}
                  onChange={(e) => setEndNum(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-slate-900 border-slate-700/80 text-slate-100'
                  }`}
                  placeholder="50"
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Incremento / Paso (Opcional)
              </label>
              <input
                type="number"
                min="1"
                value={stepNum}
                onChange={(e) => setStepNum(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-900'
                    : 'bg-slate-900 border-slate-700/80 text-slate-100'
                }`}
                placeholder="1 (de 1 en 1)"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            {/* BOTÓN FONDOS SÓLIDOS SINO DEGRADADOS */}
            <button
              onClick={() => handleGenerateRange(true)}
              className={`w-full font-black py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 ${
                isLight
                  ? 'bg-slate-900 hover:bg-slate-800 text-white'
                  : 'bg-white hover:bg-slate-100 text-slate-950'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Generar y Reemplazar Ruleta</span>
            </button>

            <button
              onClick={() => handleGenerateRange(false)}
              className={`w-full font-semibold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 border ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Añadir a los Elementos Existentes</span>
            </button>
          </div>
        </div>
      )}

      {/* CONTENIDO: Presets */}
      {activeTab === 'presets' && (
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Selecciona una plantilla predefinida para cargarla al instante:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleLoadPreset(preset)}
                className={`flex flex-col items-start p-3 border rounded-xl transition-all text-left group ${
                  isLight
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800'
                }`}
              >
                <span className={`font-bold text-sm ${
                  isLight ? 'text-slate-900' : 'text-slate-100'
                }`}>
                  {preset.name}
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  {preset.items.length} elementos
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CONTENIDO: Carga Masiva */}
      {activeTab === 'bulk' && (
        <div className="flex flex-col flex-1 space-y-3 min-h-0">
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Pega o escribe múltiples opciones separadas por salto de línea o coma:
          </p>
          <textarea
            rows={6}
            placeholder="Ejemplo:&#10;Juan&#10;María&#10;Carlos&#10;Pedro"
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            className={`w-full flex-1 border rounded-xl p-3 text-sm focus:outline-none custom-scrollbar resize-none ${
              isLight
                ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                : 'bg-slate-950/80 border-slate-700/70 text-slate-100 placeholder-slate-600'
            }`}
          />
          {/* BOTÓN CON FONDO SÓLIDO */}
          <button
            onClick={handleBulkAdd}
            disabled={!bulkText.trim()}
            className={`w-full font-black py-3 rounded-xl text-sm transition-all shadow-md shrink-0 disabled:opacity-50 ${
              isLight
                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                : 'bg-white hover:bg-slate-100 text-slate-950'
            }`}
          >
            Añadir Lista de Opciones
          </button>
        </div>
      )}

      {/* CONTENIDO: Ajustes (Modo Claro/Oscuro, Audio, Duración) */}
      {activeTab === 'settings' && (
        <div className="flex-1 space-y-5 overflow-y-auto pr-1 custom-scrollbar">
          {/* SECTOR DE SELECCIÓN DE TEMA (MODO OSCURO VS MODO CLARO) */}
          <div className={`border p-4 rounded-2xl space-y-3 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/50 border-slate-800'
          }`}>
            <label className={`block text-xs font-bold uppercase tracking-wider ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            }`}>
              Tema de la Interfaz
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-xs transition-all border ${
                  theme === 'dark'
                    ? 'bg-white text-slate-950 border-white shadow-lg'
                    : isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Modo Oscuro</span>
              </button>

              <button
                onClick={() => setTheme('light')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-xs transition-all border ${
                  theme === 'light'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Modo Claro</span>
              </button>
            </div>
          </div>

          {/* Ajuste de Duración */}
          <div className={`border p-4 rounded-2xl space-y-2 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/50 border-slate-800'
          }`}>
            <label className="flex items-center justify-between text-sm font-semibold">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Duración del Giro
              </span>
              <span className="font-bold">{duration} seg</span>
            </label>
            <input
              type="range"
              min="3"
              max="12"
              step="1"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-slate-800 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>Rápido (3s)</span>
              <span>Normal (5s)</span>
              <span>Espectacular (12s)</span>
            </div>
          </div>

          {/* Interruptor de Efectos de Sonido */}
          <div className={`border p-4 rounded-2xl flex items-center justify-between ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/50 border-slate-800'
          }`}>
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
              <div>
                <p className="text-sm font-semibold">
                  Efectos de Audio Realista
                </p>
                <p className="text-xs text-slate-400">
                  Sonido tick al girar y música al ganar
                </p>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Interruptor de Remover Ganador Automáticamente */}
          <div className={`border p-4 rounded-2xl flex items-center justify-between ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/50 border-slate-800'
          }`}>
            <div className="flex items-center gap-3">
              {removeOnWin ? (
                <UserX className="w-5 h-5 text-amber-500" />
              ) : (
                <UserCheck className="w-5 h-5 text-slate-400" />
              )}
              <div>
                <p className="text-sm font-semibold">
                  Remover Ganador al Salir
                </p>
                <p className="text-xs text-slate-400">
                  Elimina automáticamente el ítem sorteado
                </p>
              </div>
            </div>
            <button
              onClick={() => setRemoveOnWin(!removeOnWin)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                removeOnWin ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  removeOnWin ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
