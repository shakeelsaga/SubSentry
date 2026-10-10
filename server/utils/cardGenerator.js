/**
 * Generates Luhn-valid virtual debit card numbers, CVVs, and expiry dates.
 */

/**
 * Generate a Luhn-valid 16-digit card number.
 * Uses prefix 4539 (Visa-like) for realism.
 */
export function generateCardNumber() {
    const prefix = '4539';
    let number = prefix;

    // Generate 11 random digits (prefix 4 + 11 random + 1 check = 16)
    for (let i = 0; i < 11; i++) {
        number += Math.floor(Math.random() * 10).toString();
    }

    // Calculate Luhn check digit
    const checkDigit = calculateLuhnCheckDigit(number);
    return number + checkDigit;
}

/**
 * Calculate the Luhn check digit for a partial card number.
 */
function calculateLuhnCheckDigit(partialNumber) {
    const digits = partialNumber.split('').map(Number).reverse();
    let sum = 0;

    for (let i = 0; i < digits.length; i++) {
        let d = digits[i];
        if (i % 2 === 0) {
            d *= 2;
            if (d > 9) d -= 9;
        }
        sum += d;
    }

    return ((10 - (sum % 10)) % 10).toString();
}

/**
 * Validate a card number using the Luhn algorithm.
 */
export function validateLuhn(cardNumber) {
    const digits = cardNumber.split('').map(Number).reverse();
    let sum = 0;

    for (let i = 0; i < digits.length; i++) {
        let d = digits[i];
        if (i % 2 === 1) {
            d *= 2;
            if (d > 9) d -= 9;
        }
        sum += d;
    }

    return sum % 10 === 0;
}

/**
 * Generate a 3-digit CVV.
 */
export function generateCVV() {
    return Math.floor(100 + Math.random() * 900).toString();
}

/**
 * Generate an expiry date 1-3 years from now.
 * Returns { month, year }.
 */
export function generateExpiry() {
    const now = new Date();
    const yearsAhead = 1 + Math.floor(Math.random() * 3);
    const month = 1 + Math.floor(Math.random() * 12);
    const year = now.getFullYear() + yearsAhead;
    return { month, year };
}

/**
 * Generate a full virtual card object.
 */
export function generateVirtualCard() {
    const { month, year } = generateExpiry();
    return {
        card_number: generateCardNumber(),
        cvv: generateCVV(),
        expiry_month: month,
        expiry_year: year,
    };
}

// Merchant category color mapping
export const CATEGORY_COLORS = {
    streaming: '#e11d48',
    software: '#6366f1',
    gaming: '#8b5cf6',
    fitness: '#10b981',
    news: '#3b82f6',
    cloud: '#06b6d4',
    food_delivery: '#f97316',
    music: '#ec4899',
    education: '#14b8a6',
    general: '#6366f1',
};

export function getCategoryColor(category) {
    return CATEGORY_COLORS[category] || CATEGORY_COLORS.general;
}
