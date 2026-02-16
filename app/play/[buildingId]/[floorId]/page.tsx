'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/utils/store';
import { speak } from '@/utils/tts';
import QuadrantGrid from '@/components/QuadrantGrid';
import { Home, ArrowUp, ArrowDown, Ear } from 'lucide-react';

export default function FloorPage({ params }: { params: Promise<{ buildingId: string; floorId: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { isLoaded, getBuilding } = useAppStore();
    const [hasStarted, setHasStarted] = useState(false);

    const building = getBuilding(resolvedParams.buildingId);
    const floor = building?.floors.find(f => f.id === resolvedParams.floorId);

    useEffect(() => {
        if (hasStarted && floor) {
            speak(floor.introMessage);
        }
    }, [hasStarted, floor]);

    if (!isLoaded) return <div className="h-screen bg-black text-white flex items-center justify-center">Yükleniyor...</div>;
    if (!building || !floor) return <div className="h-screen bg-black text-white flex items-center justify-center">Kat bulunamadı.</div>;

    if (!hasStarted) {
        return (
            <div
                onClick={() => setHasStarted(true)}
                className="h-screen w-full bg-indigo-900 text-white flex flex-col items-center justify-center p-8 text-center cursor-pointer"
                role="button"
                aria-label="Navigasyonu başlatmak için ekrana dokunun"
            >
                <Ear className="w-24 h-24 mb-6 animate-pulse" />
                <h1 className="text-4xl font-bold mb-4">{floor.name}</h1>
                <p className="text-2xl opacity-80">Başlamak için ekrana dokunun</p>
            </div>
        );
    }

    // Find next and prev floors for simple navigation controls (optional but helpful)
    const currentFloorIndex = building.floors.findIndex(f => f.id === floor.id);
    const nextFloor = building.floors[currentFloorIndex + 1];
    const prevFloor = building.floors[currentFloorIndex - 1];

    return (
        <div className="min-h-screen bg-black flex flex-col">
            {/* Top Header Bar */}
            <div className="h-16 bg-neutral-900 flex items-center justify-between px-4 text-white">
                <button onClick={() => router.push('/')} className="p-2"><Home /></button>
                <div className="font-bold text-lg">{building.name} - {floor.name}</div>
                <div className="flex gap-2">
                    {prevFloor && (
                        <button
                            onClick={() => router.push(`/play/${building.id}/${prevFloor.id}`)}
                            className="p-2 bg-neutral-700 rounded text-sm font-bold"
                            aria-label="Alt Kat"
                        >
                            <ArrowDown className="w-5 h-5" />
                        </button>
                    )}
                    {nextFloor && (
                        <button
                            onClick={() => router.push(`/play/${building.id}/${nextFloor.id}`)}
                            className="p-2 bg-neutral-700 rounded text-sm font-bold"
                            aria-label="Üst Kat"
                        >
                            <ArrowUp className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            <QuadrantGrid zones={floor.zones} />
        </div>
    );
}
