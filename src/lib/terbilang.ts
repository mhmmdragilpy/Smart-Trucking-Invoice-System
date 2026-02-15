// ============================================================
// Terbilang — Konversi Angka ke Teks Bahasa Indonesia
// Contoh: 10010000 → "sepuluh juta sepuluh ribu rupiah"
// ============================================================

const SATUAN = [
    '',
    'satu',
    'dua',
    'tiga',
    'empat',
    'lima',
    'enam',
    'tujuh',
    'delapan',
    'sembilan',
    'sepuluh',
    'sebelas',
];

/**
 * Convert a number (0–999,999,999,999) to Indonesian text.
 * Internal recursive helper.
 */
function convertToWords(n: number): string {
    if (n < 0) return 'minus ' + convertToWords(Math.abs(n));
    if (n === 0) return 'nol';

    if (n < 12) {
        return SATUAN[n];
    }

    if (n < 20) {
        return SATUAN[n - 10] + ' belas';
    }

    if (n < 100) {
        const tens = Math.floor(n / 10);
        const remainder = n % 10;
        return SATUAN[tens] + ' puluh' + (remainder > 0 ? ' ' + SATUAN[remainder] : '');
    }

    if (n < 200) {
        const remainder = n % 100;
        return 'seratus' + (remainder > 0 ? ' ' + convertToWords(remainder) : '');
    }

    if (n < 1000) {
        const hundreds = Math.floor(n / 100);
        const remainder = n % 100;
        return SATUAN[hundreds] + ' ratus' + (remainder > 0 ? ' ' + convertToWords(remainder) : '');
    }

    if (n < 2000) {
        const remainder = n % 1000;
        return 'seribu' + (remainder > 0 ? ' ' + convertToWords(remainder) : '');
    }

    if (n < 1000000) {
        const thousands = Math.floor(n / 1000);
        const remainder = n % 1000;
        return convertToWords(thousands) + ' ribu' + (remainder > 0 ? ' ' + convertToWords(remainder) : '');
    }

    if (n < 1000000000) {
        const millions = Math.floor(n / 1000000);
        const remainder = n % 1000000;
        return convertToWords(millions) + ' juta' + (remainder > 0 ? ' ' + convertToWords(remainder) : '');
    }

    if (n < 1000000000000) {
        const billions = Math.floor(n / 1000000000);
        const remainder = n % 1000000000;
        return convertToWords(billions) + ' miliar' + (remainder > 0 ? ' ' + convertToWords(remainder) : '');
    }

    return n.toString();
}

/**
 * Convert amount to Indonesian Terbilang with "rupiah" suffix.
 * Example: terbilang(10010000) → "sepuluh juta sepuluh ribu rupiah"
 */
export function terbilang(amount: number): string {
    if (amount === 0) return 'nol rupiah';

    const words = convertToWords(Math.abs(Math.floor(amount)));
    const prefix = amount < 0 ? 'minus ' : '';

    return prefix + words + ' rupiah';
}

/**
 * Capitalize first letter of terbilang result.
 */
export function terbilangCapitalized(amount: number): string {
    const result = terbilang(amount);
    return result.charAt(0).toUpperCase() + result.slice(1);
}
