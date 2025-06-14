## SYLHET FLOOD DATA SUMMARY

### 🔍 Key Flood Influencing Factors

##### Rainfall Intensity & Duration
- Avg. June rainfall: ~798 mm
- Daily peak rainfall: up to 200 mm
- Rainy days per June: ~15–20 days

##### Rain-to-Flood Delay
- Flood peaks typically 1–5 days after heavy rain

##### River Water Level Thresholds
- Danger level: ~12.75 m
- Peak level (2024): 13.5 m

##### Drainage & Infrastructure
- Poor urban drainage; blocked canals common
- Impervious surfaces increase runoff

##### Topography & Soil
- Bowl-shaped Sylhet basin → water accumulation
- Clay/silt soils → low absorption, easy saturation

<br>

### 🌍 Global Standard Rainfall Intensity Scale (Based on mm/hour)

| **Category**           | **Rainfall Intensity**        | **Description**                       |
| ---------------------- | ----------------------------- | ------------------------------------- |
| 🌦️ **Light rain**      | 0.1 – 2.5 mm/hr               | Barely noticeable, mild drizzle       |
| 🌧️ **Moderate rain**   | 2.6 – 7.6 mm/hr               | Steady rain, gets things wet          |
| 🌩️ **Heavy rain**      | >7.6 mm/hr                    | Soaks quickly, puddles form fast      |
| ⚠️ **Very heavy rain** | >50 mm/hr *(rare)*            | Intense rainfall, flooding likely     |
| 🚨 **Extreme rain**    | >100 mm/hr *(extremely rare)* | Catastrophic rainfall, flash flooding |

<br>

### 📆 Converted to Daily Totals (Approx):
Just so you can compare to the Sylhet rainfall numbers (150–200 mm/day):

| **Hourly Rate** | **24-hour Equivalent**    |
| --------------- | ------------------------- |
| 2.5 mm/hr       | 60 mm/day (moderate)      |
| 7.6 mm/hr       | 182 mm/day (heavy)        |
| 50 mm/hr        | 1200 mm/day (disastrous)  |
| 100 mm/hr       | 2400 mm/day (apocalyptic) |

<br>

### 🌆 Impervious Surface Levels

| **Area Type**                          | **Estimated U (Impervious Ratio)** | **Explanation**                               |
| -------------------------------------- | ---------------------------------- | --------------------------------------------- |
| 🏞 Forest / Wetlands / Natural land    | 0.00 – 0.10                        | Almost no concrete, mostly soil or vegetation |
| 🧑‍🌾 Rural Farmland / Villages        | 0.10 – 0.30                        | Mostly soil + fields, a few roads/buildings   |
| 🏘️ Suburban Residential (low density) | 0.30 – 0.50                        | Small houses + roads, some green spaces       |
| 🏢 Urban Residential (high density)   | 0.50 – 0.70                        | Apartments, paved roads, driveways            |
| 🏙️ City Core / Commercial Areas       | 0.70 – 0.90                        | Concrete jungle: malls, offices, wide roads   |
| 🛣️ Fully Built-Up (CBD, industrial)   | 0.90 – 1.00                        | Nearly 100% sealed: no green at all           |

<br>

### 🌱 Soil Saturation
| Condition                        | Use S value |
| -------------------------------- | ----------- |
| Dry season / little rain         | 0.2 – 0.4   |
| Normal rain, well-drained soil   | 0.5 – 0.7   |
| Recent heavy rain, poor drainage | 0.8 – 1.0   |

<br>

### 📐 3. Manual Estimation Urban Drainage
Use this rough scale:

| **Area Type**               | **Estimated U (Urban Level)** |
| --------------------------- | ----------------------------- |
| Forest, wetlands            | 0.0 – 0.1                     |
| Agricultural village        | 0.1 – 0.3                     |
| Mixed peri-urban            | 0.3 – 0.6                     |
| Urban neighborhood (houses) | 0.5 – 0.7                     |
| Dense city core (concrete)  | 0.8 – 1.0                     |

<br>

### 🌊 FRI Level Scale (Flood Risk Index Level)

| **FRI Value (Raw)** | **Risk Level** | **Description**                            | **Action**                    |
| ------------------- | -------------- | ------------------------------------------ | ----------------------------- |
| 0 – 10              | Low            | Rain/light, soil dry, low urbanization     | Normal conditions             |
| 10 – 30             | Moderate       | Moderate rain or soil starting to saturate | Monitor closely               |
| 30 – 60             | High           | Heavy rain, saturated soil, urban runoff   | Prepare for possible flooding |
| 60 – 100            | Severe Risk    | Catastrophic flood risk                    | Emergency response needed     |

<br>

## 🧮 Flood Risk Index (FRI) FORMULA

FRI = ( R × D × I × S × U ) / N

Where:  

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
      
<br>

## 🧠 Example: Sylhet 2024 Flood Scenario

R = 180 / 200 = 0.9  
D = 18 / 20 = 0.9  
I = 0.7         (70% impervious surface)  
S = 1           (saturated soils)  
U = 1           (poor drainage)  
N = 1.2  

FRI = (0.9 × 0.9 × 0.7 × 1 × 1) / 1.2 ≈ 0.47  

Flood Risk Classification:  
  0.0 – 0.2  : Low Risk  
  0.2 – 0.4  : Moderate Risk  
  0.4 – 0.6  : High Risk  
  0.6 – 1.0  : Severe Risk

<br>

## 🛠️ USE CASES for this formula:
- Predict flood severity days ahead of event
- Track & compare year-to-year flood risk trends
- Set early warning alerts (e.g., FRI > 0.4 triggers alert)
