'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Ear, Settings, MapPin } from 'lucide-react';
import { useAppStore } from '@/utils/store';

export default function Home() {
    const { state, isLoaded, fetchBuildings } = useAppStore();

    useEffect(() => {
        fetchBuildings();
    }, []);

    if (!isLoaded && state.buildings.length === 0) return <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">Yükleniyor...</div>;

    return (
        <main className="min-h-screen bg-neutral-900 text-white p-6 pb-20">
            <div className="max-w-md mx-auto space-y-8">
                <div className="text-center space-y-4 pt-8">
                    <h1 className="text-4xl font-bold tracking-tight">Sesli Asistan</h1>
                    <p className="text-neutral-400">İç mekan navigasyon sistemi</p>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold border-b border-neutral-700 pb-2">Mekanlar</h2>

                    {state.buildings.map(building => (
                        <div key={building.id} className="bg-neutral-800 rounded-2xl overflow-hidden">
                            <div className="p-4 bg-neutral-700 font-bold text-lg flex items-center gap-2">
                                <MapPin className="w-5 h-5" /> {building.name}
                            </div>
                            <div className="divide-y divide-neutral-700">
                                {building.floors.map(floor => (
                                    <Link
                                        key={floor.id}
                                        href={`/play/${building.id}/${floor.id}`}
                                        className="block p-4 hover:bg-neutral-600 transition-colors flex items-center justify-between group"
                                    >
                                        <span>{floor.name}</span>
                                        <Ear className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}

                    {state.buildings.length === 0 && (
                        <p className="text-neutral-500 text-center">Henüz bina eklenmemiş.</p>
                    )}
                </div>

                <div className="fixed bottom-6 left-0 right-0 px-6">
                    <Link
                        href="/admin"
                        className="flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 p-4 rounded-xl transition-all w-full max-w-md mx-auto border border-zinc-700"
                    >
                        <span className="font-bold mr-2">Yönetici Paneli</span>
                        <Settings className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </main>
    );
}
