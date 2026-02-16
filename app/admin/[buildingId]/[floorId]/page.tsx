'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/utils/store';
import { Zone } from '@/types';
import { ArrowLeft, Save } from 'lucide-react';

export default function FloorEditPage({ params }: { params: Promise<{ buildingId: string; floorId: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { state, updateFloor, isLoaded } = useAppStore();

    if (!isLoaded) return <div className="p-8">Yükleniyor...</div>;

    const building = state.buildings.find(b => b.id === resolvedParams.buildingId);
    const floor = building?.floors.find(f => f.id === resolvedParams.floorId);

    if (!building || !floor) return <div className="p-8">Kat bulunamadı.</div>;

    const handleUpdateZone = (index: number, field: keyof Zone, value: string) => {
        // Create copy of zones
        const newZones = [...floor.zones];

        // Ensure zone exists at index
        if (!newZones[index]) {
            newZones[index] = {
                id: `zone-${Date.now()}-${index}`,
                label: '',
                description: '',
                type: 'other',
                color: ['bg-orange-500', 'bg-blue-600', 'bg-emerald-500', 'bg-pink-500'][index] || 'bg-gray-500'
            };
        }

        // Update field
        newZones[index] = { ...newZones[index], [field]: value };

        // Update floor directly
        updateFloor(building.id, { ...floor, zones: newZones });
    };

    const handleUpdateIntro = (value: string) => {
        updateFloor(building.id, { ...floor, introMessage: value });
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8 pb-32">
            <div className="max-w-5xl mx-auto space-y-6">
                <header className="flex items-center justify-between">
                    <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-black">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Geri Dön
                    </button>
                    <h1 className="text-2xl font-bold">{floor.name} Düzenleniyor</h1>
                </header>

                {/* Intro Message Configuration */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="text-lg font-semibold mb-2">Giriş Mesajı</h3>
                    <p className="text-sm text-gray-500 mb-2">Kat açıldığında otomatik okunacak mesaj.</p>
                    <textarea
                        value={floor.introMessage}
                        onChange={(e) => handleUpdateIntro(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                        rows={2}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[0, 1, 2, 3].map((index) => {
                        const zone = floor.zones[index] || { label: '', description: '', color: '' };
                        const defaultColor = ['bg-orange-500', 'bg-blue-600', 'bg-emerald-500', 'bg-pink-500'][index];

                        return (
                            <div key={index} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <div className={`h-2 ${zone.color || defaultColor} w-full`} />
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-gray-700">Bölge {index + 1}</h3>
                                        <span className={`text-xs px-2 py-1 rounded text-white ${zone.color || defaultColor}`}>
                                            {zone.color || defaultColor}
                                        </span>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Başlık (Örn: Kantin)</label>
                                        <input
                                            type="text"
                                            value={zone.label}
                                            onChange={(e) => handleUpdateZone(index, 'label', e.target.value)}
                                            placeholder="Ekranda görünecek isim"
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sesli Talimat</label>
                                        <textarea
                                            value={zone.description}
                                            onChange={(e) => handleUpdateZone(index, 'description', e.target.value)}
                                            placeholder="Tıklayınca okunacak yönlendirme metni..."
                                            rows={3}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
