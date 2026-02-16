import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { AppState, Building, Floor } from '@/types';

interface StoreState {
    state: AppState;
    isLoaded: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchBuildings: () => Promise<void>;
    addBuilding: (name: string) => Promise<void>;
    updateBuilding: (building: Building) => Promise<void>;
    deleteBuilding: (id: string) => Promise<void>;
    addFloor: (buildingId: string, floorName: string) => Promise<void>;
    deleteFloor: (buildingId: string, floorId: string) => Promise<void>;
    updateFloor: (buildingId: string, floor: Floor) => Promise<void>;
}

export const useAppStore = create<StoreState>((set, get) => ({
    state: { buildings: [] },
    isLoaded: false,
    isLoading: false,
    error: null,

    fetchBuildings: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('buildings')
                .select(`
                    *,
                    floors (
                        *
                    )
                `)
                .order('created_at', { ascending: true });

            if (error) throw error;

            // Map DB snake_case to frontend camelCase if needed, though usually valid JSONB stays as is.
            // We need to ensure 'intro_message' maps to 'introMessage' if we used snake_case in DB definition.

            const mappedBuildings = (data || []).map((b: any) => ({
                ...b,
                floors: (b.floors || []).map((f: any) => ({
                    ...f,
                    introMessage: f.intro_message || f.introMessage,
                    zones: typeof f.zones === 'string' ? JSON.parse(f.zones) : f.zones
                })).sort((a: any, b: any) => (a.level || 0) - (b.level || 0))
            }));

            set({ state: { buildings: mappedBuildings }, isLoaded: true });
        } catch (e: any) {
            console.error('Fetch Error:', e);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addBuilding: async (name: string) => {
        set({ isLoading: true });
        try {
            const { data, error } = await supabase
                .from('buildings')
                .insert([{ name }])
                .select()
                .single();

            if (error) throw error;

            const newBuilding: Building = { ...data, floors: [] };
            set(s => ({
                state: { buildings: [...s.state.buildings, newBuilding] }
            }));
        } catch (e: any) {
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    updateBuilding: async (updatedBuilding: Building) => {
        set({ isLoading: true });
        try {
            const { error } = await supabase
                .from('buildings')
                .update({ name: updatedBuilding.name })
                .eq('id', updatedBuilding.id);

            if (error) throw error;

            set(s => ({
                state: {
                    buildings: s.state.buildings.map(b => b.id === updatedBuilding.id ? updatedBuilding : b)
                }
            }));
        } catch (e: any) {
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteBuilding: async (id: string) => {
        set({ isLoading: true });
        try {
            const { error } = await supabase.from('buildings').delete().eq('id', id);
            if (error) throw error;

            set(s => ({
                state: { buildings: s.state.buildings.filter(b => b.id !== id) }
            }));
        } catch (e: any) {
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addFloor: async (buildingId: string, floorName: string) => {
        // Find local building to get current level count? 
        // Or just let DB handle it? We implemented 'level' in DB.
        // Let's increment level based on local state count.
        const building = get().state.buildings.find(b => b.id === buildingId);
        const level = building ? building.floors.length : 0;

        const { data, error } = await supabase
            .from('floors')
            .insert([{
                building_id: buildingId,
                name: floorName,
                level: level,
                intro_message: `${floorName} katına hoş geldiniz.`,
                zones: Array(4).fill(null).map((_, i) => ({
                    id: `zone-${Date.now()}-${i}`,
                    label: `Bölge ${i + 1}`,
                    description: 'Bu bölge henüz tanımlanmadı.',
                    type: 'other',
                    color: ['bg-orange-500', 'bg-blue-600', 'bg-emerald-500', 'bg-pink-500'][i]
                }))
            }])
            .select()
            .single();

        if (error) throw error;

        const newFloor: Floor = {
            ...data,
            introMessage: data.intro_message,
            zones: typeof data.zones === 'string' ? JSON.parse(data.zones) : data.zones
        };

        set(s => ({
            state: {
                buildings: s.state.buildings.map(b => {
                    if (b.id === buildingId) {
                        return { ...b, floors: [...b.floors, newFloor] };
                    }
                    return b;
                })
            }
        }));
    },

    deleteFloor: async (buildingId: string, floorId: string) => {
        const { error } = await supabase.from('floors').delete().eq('id', floorId);
        if (error) throw error;

        set(s => ({
            state: {
                buildings: s.state.buildings.map(b => {
                    if (b.id === buildingId) {
                        return { ...b, floors: b.floors.filter(f => f.id !== floorId) };
                    }
                    return b;
                })
            }
        }));
    },

    updateFloor: async (buildingId: string, floor: Floor) => {
        const { error } = await supabase
            .from('floors')
            .update({
                name: floor.name,
                intro_message: floor.introMessage,
                zones: floor.zones
            })
            .eq('id', floor.id);

        if (error) throw error;

        set(s => ({
            state: {
                buildings: s.state.buildings.map(b => {
                    if (b.id === buildingId) {
                        return {
                            ...b,
                            floors: b.floors.map(f => f.id === floor.id ? floor : f)
                        };
                    }
                    return b;
                })
            }
        }));
    }
}));
