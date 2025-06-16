# 🌊 FloodSense

> A simple but powerful way to estimate flood risk in Sylhet based on rainfall, soil saturation, and urbanization.

**🔗 Live Demo:** [FloodSense Web App](https://hamim-ally.github.io/FloodSense/)  
**📊 Data Source:** [Flood Data (GitHub)](https://github.com/Hamim-Ally/FloodSense/blob/main/Doc/Data.md)

<br>

## 🗺️ SYLHET FLOOD DATA SUMMARY

### 🔍 Key Flood Influencing Factors  
> 🧠 *Why it matters:* These are the local conditions that directly affect flood risk in Sylhet. Knowing them helps explain *why* flooding happens—not just *when*.

- **Rainfall Intensity & Duration**: Avg. June rainfall ~798 mm; up to 200 mm/day  
- **Rain-to-Flood Delay**: Flood peaks usually 1–5 days after heavy rain  
- **River Thresholds**: Danger level ~12.75 m, 2024 peak ~13.5 m  
- **Drainage & Infrastructure**: Urban drainage is bad, canals often blocked  
- **Topography & Soil**: Bowl-shaped Sylhet + clay/silt soil = easy flooding

<br>

## 🌍 Rainfall Intensity Scale (Global Standard)

> 💡 *What this tells you:* Is 10 mm/hr chill or chaotic? Use this to decode rainfall stats.

| **Category**           | **mm/hr**              | **Vibe**                                |
| ---------------------- | ---------------------- | ---------------------------------------- |
| 🌦️ Light rain          | 0.1 – 2.5              | Drizzle; barely anything                 |
| 🌧️ Moderate rain       | 2.6 – 7.6              | Soaking starts, roads get wet            |
| 🌩️ Heavy rain          | >7.6                   | Real downpour, flooding possible         |
| ⚠️ Very heavy rain     | >50 *(rare)*           | Bad—serious flood risk                   |
| 🚨 Extreme rain        | >100 *(extremely rare)*| Literally apocalyptic                    |

<br>

## 📆 Hourly → Daily Rainfall (For Comparison)

> 🧮 *Why this exists:* Sylhet reports rainfall in mm/day. This helps match it with global hourly scale.

| **mm/hr**   | **mm/day**           | **Label**          |
| ----------- | -------------------- | ------------------ |
| 2.5         | 60                   | Moderate           |
| 7.6         | 182                  | Heavy              |
| 50          | 1200                 | Disastrous         |
| 100         | 2400                 | Apocalyptic        |

<br>

## 🌆 Impervious Surface Levels

> 🏗️ *So what?* Concrete doesn’t absorb water—more buildings = more floods.

| **Area Type**                      | **U Value**     | **Explanation**                        |
| ---------------------------------- | --------------- | -------------------------------------- |
| 🏞 Forest/Natural land             | 0.00 – 0.10     | Soil + trees, no concrete              |
| 🧑‍🌾 Rural Villages                | 0.10 – 0.30     | Mostly soil with some structures       |
| 🏘️ Suburban (low density)         | 0.30 – 0.50     | Mixed roads, small houses              |
| 🏢 Urban (high density)            | 0.50 – 0.70     | Apartments, tight roads                |
| 🏙️ City Core                       | 0.70 – 0.90     | Malls, offices, mostly concrete        |
| 🛣️ Industrial/CBD                 | 0.90 – 1.00     | Maxed-out urbanization                 |

<br>

## 🌱 Soil Saturation Index

> 🌾 *Why care?* Wet soil can’t absorb more water → rain becomes runoff instantly.

| **Condition**                  | **S Value**     |
| ----------------------------- | --------------- |
| Dry season                    | 0.2 – 0.4       |
| Normal moisture               | 0.5 – 0.7       |
| Heavy rain recently           | 0.8 – 1.0       |

<br>

## 📐 Urban Drainage Level

> 🚽 *How blocked is it?* This U value affects how fast water gets drained out.

| **Area Type**               | **U Value**     |
| --------------------------- | --------------- |
| Forest, wetlands            | 0.0 – 0.1       |
| Rural/Agricultural          | 0.1 – 0.3       |
| Mixed peri-urban            | 0.3 – 0.6       |
| Urban neighborhood          | 0.5 – 0.7       |
| Dense city core             | 0.8 – 1.0       |

<br>

## 🌊 Flood Risk Index (FRI) Levels

> ⚠️ *What does your FRI score mean?*

| **FRI Value**  | **Risk Level**   | **Description**                      | **Action**                  |
| -------------- | ---------------- | ------------------------------------ | --------------------------- |
| 0 – 10         | Low              | Chill, dry soil                      | Normal                      |
| 10 – 30        | Moderate         | Getting risky, monitor               | Stay alert                  |
| 30 – 60        | High             | Heavy rain or bad soil               | Prep for flood              |
| 60 – 100       | Severe           | Flood is incoming                    | Emergency mode              |

<br>

## 🧠 Core Theory Behind the Flood Risk Formula

> Flooding happens when rainwater exceeds the land’s ability to absorb or drain it away. This formula is built on a few key ideas:

### 1. **Rainfall Intensity & Duration Matter**

Heavy rain over a short time or moderate rain over a long time both cause flooding differently. So, the formula looks at both how much rain and for how long it falls.

### 2. **Soil Saturation Controls Absorption**

If the soil is already soaked, it can’t soak up new rain, so water quickly turns into surface runoff, increasing flood risk.

### 3. **Urban Surfaces Block Water**

Concrete and asphalt don’t absorb water like soil. More urbanization means more runoff and higher flood chances.

### 4. **Drainage Efficiency Affects Water Flow**

Good drainage systems help remove water fast. Poor or blocked drainage means water pools and floods.

### 5. **Normalization for Scale**

Since all these factors have different units and scales, the formula normalizes them so they work together in one risk score.

> So basically, this formula models flood risk as the combined effect of how much water comes in, how much the ground and city can soak or drain it, and how long the wet conditions last.

<br>

## 🧮 The FRI Formula

> 📊 *What it does:* Turns rainfall, soil, and city structure into a flood risk number.


```FRI = ( R × D × I × S × U ) / N```

Where:  
```
R = Rainfall Intensity Index  
    (avg. daily rainfall in mm ÷ 200)

D = Rainfall Duration Index  
    (number of rainy days ÷ 20)

I = Impervious Surface Index  
    (urban impervious % ÷ 100)

S = Soil Saturation Index  
    (1 if saturated, 0.5 if moist, 0.2 if dry)

U = Urban Drainage Index  
    (1 if poor, 0.5 if average, 0.2 if good)

N = Normalization Constant  
    (tune output scale, e.g., 1.2)
```

<br>

## 🤔 Why We Use This Formula, Not Some Other One?

> 🔥 Real talk: There are plenty of flood risk formulas out there, but here’s why this one stands out for general use.

### 1. **Balances Simplicity & Accuracy**

It’s easy to calculate using commonly available data but still captures the key factors that affect flooding.

### 2. **Considers All Major Flood Drivers**

Rainfall, duration, soil saturation, urban surfaces, and drainage—this formula covers the essentials that influence flood risk in most places.

### 3. **Flexible & Adaptable**

You can tweak parameters to fit different regions or data quality without rebuilding the whole thing.

### 4. **Practical for Real-Time Use**

Designed to work with data that updates frequently, making it great for alert systems and quick risk assessment.

### 5. **Transparent & Understandable**

No black-box magic—each part of the formula has a clear meaning and can be explained easily to stakeholders or locals.

### TL;DR:

This formula is a solid middle ground—simple enough to use widely, but detailed enough to give reliable flood risk insights anywhere.

<br>

## 🧠 Sylhet 2024 Flood Example
> 📌 Walkthrough: Here’s a real-ish scenario to help you see how the FRI formula works in action. The result?<br>FRI ≈ 0.47 → High Risk.

```
R = 180 / 200 = 0.9  
D = 18 / 20 = 0.9  
I = 0.7         (70% impervious surface)  
S = 1           (saturated soils)  
U = 1           (poor drainage)  
N = 1.2  
```

```FRI = (0.9 × 0.9 × 0.7 × 1 × 1) / 1.2 ≈ 0.47```

Flood Risk Classification:  
  0.0 – 0.2  : Low Risk  
  0.2 – 0.4  : Moderate Risk  
  0.4 – 0.6  : High Risk  
  0.6 – 1.0  : Severe Risk

<br>

## 🛠️ USE CASES for this formula:
> 🚀 What can you do with this?

- Predict flood risk before it happens
- Build an alert system (e.g., FRI > 0.4 → notify users)
- Compare year-to-year flood potential
- Integrate with weather APIs & GIS tools
