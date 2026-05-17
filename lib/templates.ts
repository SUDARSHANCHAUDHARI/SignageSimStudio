import type { RoomTemplate } from './types'

export const ROOM_TEMPLATES: RoomTemplate[] = [
  {
    id: 'retail-store',
    name: 'Retail Store',
    description: 'High-street shop wall — warm wood tones and retail lighting.',
    bgClasses: 'bg-gradient-to-b from-amber-900 to-amber-700',
    wallClasses: 'bg-amber-800',
    accentColor: '#d97706',
  },
  {
    id: 'restaurant-menu-board',
    name: 'Restaurant Menu Board',
    description: 'Dark kitchen aesthetic — ideal for menu board readability testing.',
    bgClasses: 'bg-gray-900',
    wallClasses: 'bg-gray-800',
    accentColor: '#f59e0b',
  },
  {
    id: 'office-lobby',
    name: 'Office Lobby',
    description: 'Clean corporate reception — white walls under cool lighting.',
    bgClasses: 'bg-gradient-to-b from-slate-200 to-slate-100',
    wallClasses: 'bg-white',
    accentColor: '#3b82f6',
  },
  {
    id: 'conference-booth',
    name: 'Conference Booth',
    description: 'Dark exhibition hall — high-contrast booth display.',
    bgClasses: 'bg-gray-950',
    wallClasses: 'bg-gray-900',
    accentColor: '#6366f1',
  },
  {
    id: 'airport-gate',
    name: 'Airport Gate',
    description: 'Terminal environment — slate walls with blue-grey tones.',
    bgClasses: 'bg-gradient-to-b from-slate-700 to-slate-600',
    wallClasses: 'bg-slate-700',
    accentColor: '#38bdf8',
  },
  {
    id: 'hospital-waiting-area',
    name: 'Hospital Waiting Area',
    description: 'Clinical environment — bright white walls and calming greens.',
    bgClasses: 'bg-gradient-to-b from-green-50 to-white',
    wallClasses: 'bg-white',
    accentColor: '#22c55e',
  },
  {
    id: 'school-hallway',
    name: 'School Hallway',
    description: 'Institutional corridor — warm yellow tones and natural light.',
    bgClasses: 'bg-gradient-to-b from-yellow-50 to-yellow-100',
    wallClasses: 'bg-yellow-50',
    accentColor: '#eab308',
  },
  {
    id: 'gym-reception',
    name: 'Gym Reception',
    description: 'Energetic dark theme — bold displays for high impact.',
    bgClasses: 'bg-gray-900',
    wallClasses: 'bg-gray-800',
    accentColor: '#f97316',
  },
  {
    id: 'hotel-lobby',
    name: 'Hotel Lobby',
    description: 'Elegant hospitality setting — warm amber tones.',
    bgClasses: 'bg-gradient-to-b from-amber-50 to-amber-100',
    wallClasses: 'bg-amber-50',
    accentColor: '#b45309',
  },
  {
    id: 'outdoor-storefront',
    name: 'Outdoor Storefront',
    description: 'Bright exterior wall — tests readability in daylight conditions.',
    bgClasses: 'bg-gradient-to-b from-sky-300 to-sky-200',
    wallClasses: 'bg-gray-100',
    accentColor: '#0284c7',
  },
]

export function getTemplate(id: string): RoomTemplate | undefined {
  return ROOM_TEMPLATES.find((t) => t.id === id)
}
