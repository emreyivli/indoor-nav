'use client';

import { Zone } from '@/types';
import { speak } from '@/utils/tts';

interface QuadrantGridProps {
    zones: Zone[];
}

export default function QuadrantGrid({ zones }: QuadrantGridProps) {
    const handleZoneClick = (zone: Zone) => {
        console.log('Quadrant clicked:', zone);
        const text = `${zone.label}. ${zone.description}`;
        console.log('Speaking:', text);
        speak(text);
    };

    // Filter out null/undefined items first (sanitization)
    const validZones = (zones || []).filter(z => z && typeof z === 'object');

    // Fill up to 4 items
    const gridZones = [...validZones];
    while (gridZones.length < 4) {
        gridZones.push({
            id: `empty-${gridZones.length}`,
            label: 'Boş',
            description: 'Bu alanda bir şey yok.',
            type: 'other',
            color: 'bg-neutral-800'
        });
    }

    // Take only top 4
    const displayZones = gridZones.slice(0, 4);

    return (
        <div className="h-[calc(100vh-64px)] w-full grid grid-cols-2 grid-rows-2">
            {displayZones.map((zone, index) => (
                <button
                    key={zone.id || `fallback-${index}`}
                    onClick={() => handleZoneClick(zone)}
                    className={`${zone.color || 'bg-gray-800'} text-white flex flex-col items-center justify-center p-4 active:opacity-90 transition-opacity border-none outline-none focus:ring-4 focus:ring-white`}
                    aria-label={`${zone.label}. Tıklayınca detaylı bilgi verir.`}
                >
                    <span className="text-6xl font-bold mb-4 opacity-50">{index + 1}</span>
                    <span className="text-3xl sm:text-4xl font-bold text-center drop-shadow-md break-words max-w-full">{zone.label || 'İsimsiz'}</span>
                </button>
            ))}
        </div>
    );
}
