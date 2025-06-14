
class FloodRisk {
    #ImperviousSurfacelist = [0.2, 0.5, 1];
    #SoilSaturationlist = [0.2, 0.5, 1];
    #UrbanDrainagelist = [1, 0.8, 0.5, 0.2];
    constructor(args = {}, normalizers = {}) {
        this.Intensity = args.intensity; // mm/day
        this.Duration = args.duration; // days
        this.ImperviousSurface = this.#ImperviousSurfacelist[args.imperviousSurface];
        this.SoilSaturation = this.#SoilSaturationlist[args.soilSaturation];
        this.UrbanDrainage = this.#UrbanDrainagelist[args.urbanDrainage];
        console.log(this.#ImperviousSurfacelist[0]);
        console.log(`test: ${this.ImperviousSurface}`);
        console.log(`test1: ${args.imperviousSurface}`)

        // Normalizer fallback values
        this.maxIntensity = normalizers.maxIntensity || 200;
        this.maxDuration = normalizers.maxDuration || 20;
        this.normalizationFactor = normalizers.factor || 1.2;

        // Normalized values
        this.R = this.Intensity / this.maxIntensity;
        this.D = this.Duration / this.maxDuration;
        this.I = this.ImperviousSurface;
        this.S = this.SoilSaturation;
        this.U = this.UrbanDrainage;

        this.friRaw = (this.R * this.D * this.I * this.S * this.U);
        this.fri = this.friRaw / this.normalizationFactor;
    }

    getFRI() {
        return this.fri;
    }

    getPercent() {
        return Math.min(this.fri * 100, 100);
    }
}


function FRILevel(value) {
    if (value >= 0 && value <= 10) {
        return {
            index: 0,
            level: 'Low Risk',
            value: value,
            suggestion: '✅ No action needed. Monitor weather updates casually.'
        };
    }

    else if (value > 10 && value <= 30) {
        return {
            index: 1,
            level: 'Moderate Risk',
            value: value,
            suggestion: '⚠️ Stay alert. Clean drainage nearby and follow local advisories.'
        };
    }

    else if (value > 30 && value <= 60) { 
        return { 
            index: 2, 
            level: 'High Risk',
            value: value,
            suggestion: '🚨 Prepare for potential flooding. Secure valuables and stay informed.'
        }; 
    }

    else if (value > 60 && value <= 100) { 
        return { 
            index: 3,
            level: 'Severe Risk',
            value: value,
            suggestion: '🆘 Immediate action required. Evacuate if advised, avoid flood-prone areas.'
        };
    }

    else { 
        return { 
            index: 4,
            level: 'Severe Risk',
            value: '100',
            suggestion: '🆘 Immediate action required. Evacuate if advised, avoid flood-prone areas.'
        };
    }
}

function LogFRI(object) { console.log(`Flood Risk: [${object.level}] [${object.value}]`); }

export { FloodRisk, FRILevel, LogFRI };