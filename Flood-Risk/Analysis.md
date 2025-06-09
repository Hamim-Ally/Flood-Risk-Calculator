+--------------------------------------------------------------------------------------+
|                              SYLHET FLOOD DATA SUMMARY                               |
+--------------------------------------------------------------------------------------+

🔍 Key Flood Influencing Factors

  • Rainfall Intensity & Duration
      - Avg. June rainfall: ~798 mm
      - Daily peak rainfall: up to 200 mm
      - Rainy days per June: ~15–20 days

  • Rain-to-Flood Delay
      - Flood peaks typically 1–5 days after heavy rain

  • River Water Level Thresholds
      - Danger level: ~12.75 m
      - Peak level (2024): 13.5 m

  • Drainage & Infrastructure
      - Poor urban drainage; blocked canals common
      - Impervious surfaces increase runoff

  • Topography & Soil
      - Bowl-shaped Sylhet basin → water accumulation
      - Clay/silt soils → low absorption, easy saturation


----------------------------------------------------------------------------------------

🧮 Flood Risk Index (FRI) FORMULA

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

----------------------------------------------------------------------------------------

🧠 Example: Sylhet 2024 Flood Scenario

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

----------------------------------------------------------------------------------------

🛠️ USE CASES for this formula:

  • Predict flood severity days ahead of event
  • Track & compare year-to-year flood risk trends
  • Set early warning alerts (e.g., FRI > 0.4 triggers alert)

----------------------------------------------------------------------------------------

💡 Next steps? Hit me up if you want:

  • JavaScript or Python real-time calculator code
  • A sick graph plotting yearly flood risk trends
  • Flood alert system logic for game dev or simulation

----------------------------------------------------------------------------------------
