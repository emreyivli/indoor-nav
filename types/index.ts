export type ZoneType = 'room' | 'navigation' | 'service' | 'other';

export interface Zone {
    id: string;
    label: string;
    description: string; // The text to be spoken
    type: ZoneType;
    color: string; // Hex code or tailwind class for the quadrant background
}

export interface Floor {
    id: string;
    level: number;
    name: string; // e.g., "Ground Floor", "1st Floor"
    introMessage: string; // Spoken when floor loads
    zones: Zone[]; // Should ideally handle 4 zones for the grid
}

export interface Building {
    id: string;
    name: string;
    floors: Floor[];
}

export interface AppState {
    buildings: Building[];
}
