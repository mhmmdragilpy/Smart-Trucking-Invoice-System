// ============================================================
// Master Price Database — Data Harga Riil per Lokasi & Size
// PT Tunggal Mandiri Logistik
// ============================================================

export interface PriceEntry {
    location: string;
    size?: '20' | '40' | 'all';
    price: number;
}

// ── Master Price Data ─────────────────────────────────────────
// ── Master Price Data ─────────────────────────────────────────
// ── Master Price Data ─────────────────────────────────────────
// ── Master Price Data ─────────────────────────────────────────
export const PRICE_DATABASE: PriceEntry[] = [
    { location: 'ACS', size: 'all', price: 1200000 },
    { location: 'ANCOL', size: 'all', price: 1400000 },
    { location: 'BALARAJA', size: 'all', price: 2200000 },
    { location: 'BANDUNG', size: 'all', price: 3700000 },
    { location: 'BANDUNG', size: 'all', price: 3800000 },
    { location: 'BANDUNG', size: 'all', price: 3900000 },
    { location: 'BATU CEPER', size: 'all', price: 1750000 },
    { location: 'BEKASI', size: 'all', price: 1600000 },
    { location: 'BEKASI', size: 'all', price: 1750000 },
    { location: 'BINTARO', size: 'all', price: 2000000 },
    { location: 'BITUNG', size: 'all', price: 2000000 },
    { location: 'CAKUNG', size: 'all', price: 1200000 },
    { location: 'CAKUNG', size: 'all', price: 1400000 },
    { location: 'CENGKARENG', size: 'all', price: 1850000 },
    { location: 'CIKANDE', size: 'all', price: 2300000 },
    { location: 'CIKARANG', size: 'all', price: 1850000 },
    { location: 'CIKARANG', size: 'all', price: 1950000 },
    { location: 'CIKUPA', size: 'all', price: 2100000 },
    { location: 'CILEDUK', size: 'all', price: 2000000 },
    { location: 'CIPONDOH', size: 'all', price: 2000000 },
    { location: 'CIREBON', size: 'all', price: 5000000 },
    { location: 'CIRUAS', size: 'all', price: 2550000 },
    { location: 'DAAN MOGOT', size: 'all', price: 1800000 },
    { location: 'DAAN MOGOT', size: 'all', price: 2000000 },
    { location: 'DADAP', size: 'all', price: 1850000 },
    { location: 'DEMAK', size: 'all', price: 8500000 },
    { location: 'HALAL', size: 'all', price: 400000 },
    { location: 'HALAL', size: 'all', price: 450000 },
    { location: 'HALAL', size: 'all', price: 500000 },
    { location: 'HARMONI', size: 'all', price: 1750000 },
    { location: 'JATAKE', size: 'all', price: 2000000 },
    { location: 'JATIUWUNG', size: 'all', price: 2000000 },
    { location: 'KALIDERES', size: 'all', price: 2000000 },
    { location: 'KALIMALANG', size: 'all', price: 1700000 },
    { location: 'KAMAL MUARA', size: 'all', price: 1750000 },
    { location: 'KARANG TENGAH', size: 'all', price: 2000000 },
    { location: 'KARAWACI', size: 'all', price: 2100000 },
    { location: 'KARAWANG', size: 'all', price: 1900000 },
    { location: 'KARAWANG', size: 'all', price: 2300000 },
    { location: 'KOSAMBI', size: 'all', price: 1850000 },
    { location: 'LEGOK', size: 'all', price: 2100000 },
    { location: 'MALANG', size: 'all', price: 15000000 },
    { location: 'MALANG', size: 'all', price: 18000000 },
    { location: 'MANGGA DUA', size: 'all', price: 1650000 },
    { location: 'MUARA BARU', size: 'all', price: 1750000 },
    { location: 'NEGLASARI', size: 'all', price: 2000000 },
    { location: 'PADALARANG', size: 'all', price: 3700000 },
    { location: 'PAJAJARAN', size: 'all', price: 2000000 },
    { location: 'PAKUAJI', size: 'all', price: 2000000 },
    { location: 'PAKUHAJI', size: 'all', price: 1900000 },
    { location: 'PAMULANG', size: 'all', price: 2000000 },
    { location: 'PARUNG PANJANG', size: 'all', price: 2100000 },
    { location: 'PASAR KAMIS', size: 'all', price: 2100000 },
    { location: 'PENJARINGAN', size: 'all', price: 1750000 },
    { location: 'PESING', size: 'all', price: 1700000 },
    { location: 'PLUIT', size: 'all', price: 1750000 },
    { location: 'PULOGADUNG', size: 'all', price: 1500000 },
    { location: 'PULOGEBANG', size: 'all', price: 1500000 },
    { location: 'SALEMBARAN', size: 'all', price: 1850000 },
    { location: 'SEMARANG', size: 'all', price: 8000000 },
    { location: 'SEMARANG', size: 'all', price: 9000000 },
    { location: 'SEPATAN', size: 'all', price: 2000000 },
    { location: 'SUNTER', size: 'all', price: 700000 },
    { location: 'SUNTER', size: 'all', price: 1200000 },
    { location: 'SUNTER', size: 'all', price: 1400000 },
    { location: 'SURABAYA', size: 'all', price: 14000000 },
    { location: 'SURABAYA', size: 'all', price: 19000000 },
    { location: 'TAMBUN', size: 'all', price: 1750000 },
    { location: 'TEGAL ALUR', size: 'all', price: 1750000 },
    { location: 'TELUK NAGA', size: 'all', price: 2000000 },
    { location: 'TIGARAKSA', size: 'all', price: 2100000 },
    { location: 'YOGYAKARTA', size: 'all', price: 8500000 },
    { location: 'YOGYAKARTA', size: 'all', price: 11000000 },
];

// ── All Available Destinations ────────────────────────────────
export const ALL_DESTINATIONS = [
    'ACS',
    'ANCOL',
    'BALARAJA',
    'BANDUNG',
    'BATU CEPER',
    'BEKASI',
    'BINTARO',
    'BITUNG',
    'CAKUNG',
    'CENGKARENG',
    'CIKANDE',
    'CIKARANG',
    'CIKUPA',
    'CILEDUK',
    'CIPONDOH',
    'CIREBON',
    'CIRUAS',
    'DAAN MOGOT',
    'DADAP',
    'DEMAK',
    'HALAL',
    'HARMONI',
    'JATAKE',
    'JATIUWUNG',
    'KALIDERES',
    'KALIMALANG',
    'KAMAL MUARA',
    'KARANG TENGAH',
    'KARAWACI',
    'KARAWANG',
    'KOSAMBI',
    'LEGOK',
    'MALANG',
    'MANGGA DUA',
    'MUARA BARU',
    'NEGLASARI',
    'PADALARANG',
    'PAJAJARAN',
    'PAKUAJI',
    'PAKUHAJI',
    'PAMULANG',
    'PARUNG PANJANG',
    'PASAR KAMIS',
    'PENJARINGAN',
    'PESING',
    'PLUIT',
    'PULOGADUNG',
    'PULOGEBANG',
    'SALEMBARAN',
    'SEMARANG',
    'SEPATAN',
    'SUNTER',
    'SURABAYA',
    'TAMBUN',
    'TEGAL ALUR',
    'TELUK NAGA',
    'TIGARAKSA',
    'YOGYAKARTA',
];

/**
 * Look up price by location and container size.
 * Returns the price if an exact match is found, otherwise undefined.
 */
export function lookupPrice(location: string, size?: string): number | undefined {
    const normalizedLocation = location.trim().toLowerCase();

    // Try exact size match first
    if (size) {
        const exactMatch = PRICE_DATABASE.find(
            (p) =>
                p.location.toLowerCase() === normalizedLocation &&
                (p.size === size || p.size === 'all')
        );
        if (exactMatch) return exactMatch.price;
    }

    // Try 'all' size match
    const allSizeMatch = PRICE_DATABASE.find(
        (p) =>
            p.location.toLowerCase() === normalizedLocation &&
            p.size === 'all'
    );
    if (allSizeMatch) return allSizeMatch.price;

    // Try first available match
    const anyMatch = PRICE_DATABASE.find(
        (p) => p.location.toLowerCase() === normalizedLocation
    );
    return anyMatch?.price;
}

/**
 * Look up ALL prices by location.
 * Returns an array of prices found for that location.
 */
export function lookupPrices(location: string, size?: string): number[] {
    const normalizedLocation = location.trim().toLowerCase();

    // Filter all matches
    const matches = PRICE_DATABASE.filter(p => {
        const locMatch = p.location.toLowerCase() === normalizedLocation;
        if (!locMatch) return false;

        // If size is specified, match strict size OR 'all'
        if (size) {
            return p.size === size || p.size === 'all';
        }
        return true;
    });

    // Return unique prices
    const prices = matches.map(p => p.price);
    return Array.from(new Set(prices));
}

/**
 * Format number as Indonesian Rupiah string.
 */
export function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Parse a Rupiah-formatted string back to number.
 */
export function parseRupiah(str: string): number {
    return Number(str.replace(/[^0-9-]/g, '')) || 0;
}
