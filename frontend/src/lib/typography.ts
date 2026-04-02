export const F_SIZE = {
    xl: '2.5rem', // Display/Hero Titles
    lg: '1.5rem', // Card Headers / Sub-headers
    md: '1rem', // Standard Body / Secondary text (16px)
    sm: '0.875rem', // Tiny text / Eyebrows / Footnotes (14px)
};

// ─── Premium Color Palette (6 colors only) ─────────────────────────────────
export const BRAND = {
    // Primary colors
    primary: '#322D29', // Main text & dark elements
    primaryDark: '#72383D', // Headings, accents, CTAs
    
    // Secondary colors
    secondary: '#AC9C8D', // Subheadings, secondary text
    tertiary: '#D1C7BD', // Light surfaces, dividers
    
    // Neutral colors
    quaternary: '#D9D9D9', // Borders, placeholders
    light: '#EFE9E1', // Very light backgrounds, accents
    white: '#FFFFFF', // Pure white
    
    // Semantic aliases for common use
    text: '#322D29',
    textMuted: '#AC9C8D',
    background: '#FFFFFF',
    border: '#D9D9D9',
    accent: '#72383D',
};

export const FONTS = {
    main: "'Poppins', sans-serif",
    accent: "'Caveat', cursive",
};

// ─── Predefined Typography Styles ──────────────────────────────────────────
export const TYPOGRAPHY = {
    // Main Poppins Styles
    displayXL: {
        fontFamily: FONTS.main,
        fontSize: F_SIZE.xl,
        fontWeight: 900,
    },
    headingLG: {
        fontFamily: FONTS.main,
        fontSize: F_SIZE.lg,
        fontWeight: 900,
    },
    headingMD: {
        fontFamily: FONTS.main,
        fontSize: F_SIZE.md,
        fontWeight: 700,
    },
    bodyMD: {
        fontFamily: FONTS.main,
        fontSize: F_SIZE.md,
        fontWeight: 400,
    },
    bodySM: {
        fontFamily: FONTS.main,
        fontSize: F_SIZE.sm,
        fontWeight: 500,
    },
    eyebrow: {
        fontFamily: FONTS.main,
        fontSize: F_SIZE.sm,
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
    },
    // Accent (Caveat) Styles
    accentLG: {
        fontFamily: FONTS.accent,
        fontSize: F_SIZE.lg,
        fontStyle: 'italic',
    },
    accentMD: {
        fontFamily: FONTS.accent,
        fontSize: F_SIZE.md,
    },
};

