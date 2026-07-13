export const PARTY_COLORS = {
    friend: { main: 0x1f5ed1, accent: 0xa7d6ff }, // Blue
    enemy: { main: 0x8c1420, accent: 0xff565a },  // Red
    business: { main: 0x007a33, accent: 0x5cd65c }, // Green (Neutral/Civilian)
    unknown: { main: 0xafaf00, accent: 0xffff00 },  // Yellow
};

export const SIDC_MAP = {
    scheme: 'S', // Warfighting
    identity: { friend: 'F', enemy: 'H', business: 'N', unknown: 'U' },
    dimension: { Air: 'A', Sea: 'S', Subsurface: 'U' },
    status: 'P',
};

export const FUNCTION_CODES: Record<string, string> = {
    Drone: 'CA----',     // UAV
    Kirov: 'SCC---',     // Cruiser
    Ticondra: 'SCC---',  // Cruiser
    Oliver: 'SFF---',    // Frigate
    Kuznetsov: 'SCV---', // Carrier
    Akula: 'SS----',     // Submarine
};