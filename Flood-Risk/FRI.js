function Normalization(value) {
    const tune = 1.2;
    return value / tune;
}

class FloodRisk {
    constructor(Intensity, Duration, ImperviousSurface, SoilSaturation, UrbanDrainage) {
        this.Intensity = Intensity; // Intensity of rainfall in mm/hr
        this.Duration = Duration; // Duration of rainfall in hours
        this.ImperviousSurface = ImperviousSurface; // Percentage of impervious surface in the area
        this.SoilSaturation = SoilSaturation; // Soil saturation level in percentage
        this.UrbanDrainage = UrbanDrainage; // Condition of urban drainage system (e.g., 'Good', 'Fair', 'Poor')
    }

    calculateRisk() {
        const FRI = this.Intensity * this.Duration * this.ImperviousSurface * this.SoilSaturation * this.UrbanDrainage;
        return Normalization(FRI);
    }
}

function FRILevel(value) {
    if (value >= 0 && value <= 0.2) { return { level: 'Low Risk', value: value }; }
    else if (value > 0.2 && value <= 0.4) { return { level: 'Moderate Risk', value: value }; }
    else if (value > 0.4 && value <= 0.6) { return { level: 'High Risk', value: value }; }
    else if (value > 0.6 && value <= 1.0) { return { level: 'Severe Risk', value: value }; }
    else { console.error('Invalid FRI value. It should be between 0 and 1.'); return null; }
}

function LogFRI(object) {console.log(`Flood Risk: [${object.level}] [${object.value * 100} %]`);}

export { FloodRisk, FRILevel, LogFRI };