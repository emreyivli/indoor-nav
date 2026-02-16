'use client';

import { useAppStore } from '@/utils/store';
import Link from 'next/link';
import { Plus, Edit, MapPin } from 'lucide-react';

export default function AdminPage() {
    const { state, isLoaded } = useAppStore();

    if (!isLoaded) return <div className="p-8">Yükleniyor...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Yönetici Paneli</h1>
                    <Link href="/" className="text-gray-600 hover:text-black">Ana Sayfaya Dön</Link>
                </header>

                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-700">Binalar</h2>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                            <Plus className="w-4 h-4" /> Yeni Bina
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {state.buildings.map(building => (
                            <div key={building.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{building.name}</h3>
                                        <p className="text-gray-500 text-sm">ID: {building.id}</p>
                                    </div>
                                    <Link
                                        href={`/admin/${building.id}`}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </Link>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Katlar</h4>
                                    {building.floors.map(floor => (
                                        <div key={floor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                                            <div className="flex items-center gap-3">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium text-gray-700">{floor.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400">{floor.zones.length} Bölge</span>
                                                <Link
                                                    href={`/play/${building.id}/${floor.id}`}
                                                    className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded hover:bg-emerald-200"
                                                    target="_blank"
                                                >
                                                    Önizle
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 text-sm font-medium transition-colors">
                                        + Kat Ekle
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
