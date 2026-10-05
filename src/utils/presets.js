// Presets predefinidos y paletas cromáticas para la ruleta

// Paleta de colores personalizada requerida:
// #95C92C (Lime Green), #B5E655 (Light Chartreuse), #4CB6C2 (Teal Cyan), #FF8F00 (Vibrant Amber), #F06000 (Deep Orange)
export const BRAND_PALETTE = ['#95C92C', '#B5E655', '#4CB6C2', '#FF8F00', '#F06000'];

export const PALETTES = [
  BRAND_PALETTE,
  ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'],
  ['#6366F1', '#A855F7', '#EC4899', '#F43F5E', '#FB923C', '#FACC15', '#4ADE80', '#38BDF8'],
  ['#0F172A', '#1E293B', '#334155', '#475569', '#64748B', '#94A3B8', '#CBD5E1', '#E2E8F0']
];

export const PRESETS = [
  {
    id: 'custom-brand',
    name: '🎨 Paleta Vibrante (5 Colores)',
    items: [
      { text: 'Opción 1', color: '#95C92C' },
      { text: 'Opción 2', color: '#B5E655' },
      { text: 'Opción 3', color: '#4CB6C2' },
      { text: 'Opción 4', color: '#FF8F00' },
      { text: 'Opción 5', color: '#F06000' }
    ]
  },
  {
    id: 'names',
    name: '👥 Nombres de Ejemplo',
    items: [
      { text: 'Ana', color: '#95C92C' },
      { text: 'Carlos', color: '#4CB6C2' },
      { text: 'María', color: '#FF8F00' },
      { text: 'Juan', color: '#F06000' },
      { text: 'Sofía', color: '#B5E655' },
      { text: 'Luis', color: '#95C92C' },
      { text: 'Laura', color: '#4CB6C2' },
      { text: 'Diego', color: '#FF8F00' }
    ]
  },
  {
    id: 'num1-10',
    name: '🔢 Números (1 al 10)',
    items: Array.from({ length: 10 }, (_, i) => ({
      text: `${i + 1}`,
      color: BRAND_PALETTE[i % BRAND_PALETTE.length]
    }))
  },
  {
    id: 'yes-no',
    name: '❓ Sí / No / Tal vez',
    items: [
      { text: '¡SÍ!', color: '#95C92C' },
      { text: 'NO', color: '#F06000' },
      { text: 'TAL VEZ', color: '#FF8F00' },
      { text: 'VOLVER A GIRAR', color: '#4CB6C2' }
    ]
  },
  {
    id: 'dice',
    name: '🎲 Dados (1 al 6)',
    items: [
      { text: '🎲 1', color: '#95C92C' },
      { text: '🎲 2', color: '#B5E655' },
      { text: '🎲 3', color: '#4CB6C2' },
      { text: '🎲 4', color: '#FF8F00' },
      { text: '🎲 5', color: '#F06000' },
      { text: '🎲 6', color: '#95C92C' }
    ]
  },
  {
    id: 'coin',
    name: '🪙 Moneda (Cara / Cruz)',
    items: [
      { text: '👑 CARA', color: '#FF8F00' },
      { text: '🦅 CRUZ', color: '#4CB6C2' }
    ]
  },
  {
    id: 'roulette-numbers',
    name: '🎰 Números de Ruleta Casino (1 al 36)',
    items: Array.from({ length: 36 }, (_, i) => {
      const num = i + 1;
      const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(num);
      return {
        text: `${num}`,
        color: isRed ? '#F06000' : '#4CB6C2'
      };
    })
  }
];
