/**
 * Parses height string into centimeters
 * Supports "180", "180cm", "5 FT 10 IN", "5FT 10IN"
 */
export function parseHeightToCm(heightStr: string): number | null {
    const cleanStr = heightStr.toUpperCase().replace(/\s+/g, ' ');
    
    // Handle FT/IN format: 5 FT 10 IN
    if (cleanStr.includes('FT')) {
        const ftMatch = cleanStr.match(/(\d+)\s*FT/);
        const inMatch = cleanStr.match(/(\d+)\s*IN/);
        
        const feet = ftMatch ? parseInt(ftMatch[1], 10) : 0;
        const inches = inMatch ? parseInt(inMatch[1], 10) : 0;
        
        if (feet > 0 || inches > 0) {
            return (feet * 30.48) + (inches * 2.54);
        }
    }
    
    // Handle CM format
    const cmMatch = cleanStr.match(/(\d+\.?\d*)\s*(CM|)/);
    if (cmMatch && cmMatch[1]) {
        return parseFloat(cmMatch[1]);
    }
    
    return null;
}

/**
 * Parses weight string into kilograms
 * Supports "85", "85kg", "16 ST", "16ST 5LB", "150 LB"
 */
export function parseWeightToKg(weightStr: string): number | null {
    const cleanStr = weightStr.toUpperCase().replace(/\s+/g, ' ');
    
    // Handle Stone (ST) and Pound (LB) format: 16 ST 5 LB or 16 ST
    if (cleanStr.includes('ST')) {
        const stMatch = cleanStr.match(/(\d+)\s*ST/);
        const lbMatch = cleanStr.match(/(\d+)\s*LB/);
        
        const stones = stMatch ? parseInt(stMatch[1], 10) : 0;
        const pounds = lbMatch ? parseInt(lbMatch[1], 10) : 0;
        
        if (stones > 0 || pounds > 0) {
            // 1 stone = 6.35029 kg, 1 pound = 0.453592 kg
            return (stones * 6.35029) + (pounds * 0.453592);
        }
    }
    
    // Handle standalone Pounds (LB)
    if (cleanStr.includes('LB')) {
        const lbMatch = cleanStr.match(/(\d+\.?\d*)\s*LB/);
        if (lbMatch && lbMatch[1]) {
            return parseFloat(lbMatch[1]) * 0.453592;
        }
    }
    
    // Handle KG format
    const kgMatch = cleanStr.match(/(\d+\.?\d*)\s*(KG|)/);
    if (kgMatch && kgMatch[1]) {
        return parseFloat(kgMatch[1]);
    }
    
    return null;
}
