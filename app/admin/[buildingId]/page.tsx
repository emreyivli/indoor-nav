'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/utils/store';
import { ArrowLeft, Plus, Trash2, QrCode, X } from 'lucide-react';
import Link from 'next/link';
import QRCode from 'react-qr-code';

export default function BuildingEditPage({ params }: { params: Promise<{ buildingId: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { state, updateBuilding, isLoaded } = useAppStore();
    const [newFloorName, setNewFloorName] = useState('');
    const [showQrFor, setShowQrFor] = useState<string | null>(null);

    if (!isLoaded) return <div className="p-8">Yükleniyor...</div>;

    const building = state.buildings.find(b => b.id === resolvedParams.buildingId);
    if (!building) return <div className="p-8">Bina bulunamadı.</div>;

    const handleAddFloor = () => {
        if (!newFloorName.trim()) return;

        const newFloor = {
            id: `floor-${Date.now()}`,
            name: newFloorName,
            level: building.floors.length,
            introMessage: `${building.name} ${newFloorName} katına hoş geldiniz.`,
            zones: Array(4).fill(null).map((_, i) => ({
                id: `zone-${Date.now()}-${i}`,
                label: `Bölge ${i + 1}`,
                description: 'Bu bölge henüz tanımlanmadı.',
                type: 'other' as const,
                color: ['bg-orange-500', 'bg-blue-600', 'bg-emerald-500', 'bg-pink-500'][i]
            }))
        };

        updateBuilding({
            ...building,
            floors: [...building.floors, newFloor]
        });
        setNewFloorName('');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto space-y-6">
                <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-black">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Geri Dön
                </button>

                <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                    <h1 className="text-2xl font-bold">{building.name} Düzenle</h1>
                    <div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900">Bina Adı</label>
                            <input
                                type="text"
                                value={building.name}
                                onChange={(e) => updateBuilding({ ...building, name: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-gray-900 bg-white"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
                    <h2 className="text-xl font-semibold">Katlar</h2>

                    <div className="space-y-3">
                        {building.floors.map((floor, idx) => (
                            <div key={floor.id} className="flex items-center justify-between p-4 bg-white rounded-lg border shadow-sm">
                                <div>
                                    <div className="font-bold text-gray-900">{floor.name}</div>
                                    <div className="text-sm text-gray-500">{floor.zones.length} Bölge Tanımlı</div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowQrFor(floor.id)}
                                            className="p-2 text-neutral-600 hover:bg-neutral-100 rounded"
                                            title="QR Kod Oluştur"
                                        >
                                            <QrCode className="w-5 h-5" />
                                        </button>
                                        <Link
                                            href={`/admin/${building.id}/${floor.id}`}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                                        >
                                            Bölgeleri Düzenle
                                        </Link>
                                        <button
                                            onClick={() => {
                                                if (confirm('Katı silmek istediğinize emin misiniz?')) {
                                                    deleteFloor(building.id, floor.id);
                                                }
                                            }}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t flex gap-4">
                        <input
                            type="text"
                            placeholder="Yeni Kat Adı (Örn: 2. Kat)"
                            value={newFloorName}
                            onChange={(e) => setNewFloorName(e.target.value)}
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-gray-900 bg-white"
                        />
                        <button
                            onClick={handleAddFloor}
                            disabled={!newFloorName}
                            className="px-6 py-2 bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Kat Ekle
                        </button>
                    </div>
                </div>
            </div>

            {/* QR Code Modal */}
            {showQrFor && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full relative">
                        <button
                            onClick={() => setShowQrFor(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h3 className="text-xl font-bold mb-6 text-center text-black">
                            {building.floors.find(f => f.id === showQrFor)?.name} QR Kodu
                        </h3>

                        <div className="flex justify-center bg-white p-2">
                            <QRCode
                                value={`${window.location.origin}/play/${building.id}/${showQrFor}`}
                                size={200}
                            />
                        </div>

                        <p className="text-center mt-6 text-sm text-gray-500 break-all">
                            {`${window.location.origin}/play/${building.id}/${showQrFor}`}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
