# MSc Thesis: Spatial and Temporal Variation of Water Quality Parameters in Lake Tana Using Remote Sensing, Ethiopia

![Google Earth Engine](https://img.shields.io/badge/Platform-Google%20Earth%20Engine-blue)
![MODIS](https://img.shields.io/badge/Satellite-MODIS%20MOD09Q1-green)
![Years](https://img.shields.io/badge/Period-2008–2018-orange)
![License](https://img.shields.io/badge/License-MIT-lightgrey)
![Samples](https://img.shields.io/badge/Samples-143%20in--situ-brightgreen)
👨‍🎓 Author Information
Name: Bekalu Weretaw Asres
Degree: Master of Science in Hydraulic Engineering
University: Bahir Dar University, Institute of Technology
Supervisor: Fasikaw Atanaw (PhD)
Submission Date: 12 February 2020

📖 Abstract
This research utilizes MODIS satellite imagery to analyze spatial and temporal variations of water quality parameters in Lake Tana, Ethiopia. The study covers an 11-year period (2008-2018) and includes detailed seasonal analysis for August 2016, December 2016, and March 2017. Using Google Earth Engine, the research implements empirical regression models for water quality parameter estimation calibrated with 143 field samples, and conducts comprehensive trend analysis.

🎯 Research Objectives
Analyze spatial variation of water quality parameters in Lake Tana

Assess temporal variation from 2008 to 2018

Develop empirical models for water quality estimation using field calibration

Conduct trend analysis using statistical methods

Provide recommendations for lake management

🔬 Field Data Collection
In-situ Measurements (143 Samples)
Sampling Campaigns:

August 2016 (Rainy season)

December 2016 (Dry season)

March 2017 (Post-rainy season)

Sampling Design:

5km systematic grid across Lake Tana

GPS coordinates recorded for each sample

Total: 143 geo-referenced water samples

Measured Parameters:

Secchi Depth (SD) - water clarity

Chlorophyll-a (Chl-a) - algal biomass

Total Nitrogen (TN) - nutrient status

Total Phosphorus (TP) - nutrient status

Total Dissolved Solids (TDS) - salinity indicator

pH - acidity/alkalinity

Temperature
🛠️ Methodology Overview
Data Acquisition: MODIS surface reflectance (MOD09Q1, 2008-2018) accessed via Google Earth Engine.

Preprocessing: Cloud masking, temporal compositing (monthly/seasonal), and clipping to Lake Tana.

Model Calibration: Empirical regression models (e.g., Secchi Depth ~ f(Red Band Reflectance)) developed using the 143 in-situ samples.

Spatio-Temporal Analysis: Application of calibrated models to generate monthly, seasonal, and annual parameter maps for the entire 11-year period.

Trend Analysis: Statistical trend detection (e.g., Mann-Kendall, Sen's Slope) on the generated time series.

📁 Repository Structure
MSc_Thesis_LakeTana/
├── scripts/
│   ├── main/GEE_Thesis_With_FieldData.js     # Complete analysis script
│   └── utils/field_data_loader.js           # 143 samples data handler
├── docs/setup_guide.md                      # Usage instructions
├── thesis/abstract.md                       # Thesis abstract
├── LICENSE
├── CITATION.cff
├── .gitignore
└── README.md
Quick Start
1. Access the Google Earth Engine Platform
Navigate to the Google Earth Engine Code Editor. You will need a registered GEE account.

2. Prepare Your Field Data
Open scripts/utils/field_data_loader.js

Replace the placeholder arrays with your 143 actual field measurements:

var samplePoints (GPS coordinates)

var secchiDepth, var chlorophyll, etc. (parameter values)

3. Run the Analysis in GEE
Copy the entire contents of scripts/main/GEE_Thesis_With_FieldData.js into the GEE code editor.

If using the separate utility file, also copy scripts/utils/field_data_loader.js.

Click the "Run" button to execute the script.

Monitor the "Console" tab for processing progress and any warnings.

Navigate to the "Tasks" tab to initiate exports of generated maps, charts, and data.

4. Adapt for Your Own Study Area
To apply this methodology to a different lake:

Update the lakeTanaBoundary geometry in the main script.

Ensure your field data corresponds spatially and temporally with the satellite imagery period.

📊 Available Scripts
Main Analysis Script
GEE_Thesis_With_FieldData.js - Complete integrated analysis including:

MODIS data processing (2008-2018)

Seasonal analysis (3 campaigns)

Empirical model development

Field data calibration

Trend analysis

Data export functions

Field Data Utilities
field_data_loader.js - Primary field data handler for 143 samples

📈 Key Findings
Spatial Patterns: Higher turbidity and nutrient concentrations observed in the northern shallow regions of Lake Tana.

Temporal Trends: Overall decreasing trend in turbidity over the study period (2008-2018).

Seasonal Variations: Water quality parameters show highest variability during the wet season (June-September).

Model Performance: Empirical models showed strong correlation (R² > 0.7) for Secchi Depth and Chlorophyll-a when validated against field data.
📚 How to Cite
@mastersthesis{asres2020laketana,
  author  = {Bekalu Weretaw Asres},
  title   = {Spatial and Temporal Variation of Water Quality Parameters 
             in Lake Tana Using Remote Sensing, Ethiopia},
  school  = {Bahir Dar University, Institute of Technology},
  year    = {2020},
  address = {Bahir Dar, Ethiopia},
  note    = {Supervised by Fasikaw Atanaw (PhD)},
  url     = {https://github.com/BekaluWeretaw/MSc_Thesis_LakeTana}
}
Contact
Author: Bekalu Weretaw Asres

GitHub: @BekaluWeretaw

Institution: Bahir Dar University, Institute of Technology

Department: Hydraulic Engineering

🙏 Acknowledgments
Primary Supervisor: Dr. Fasikaw Atanaw

Academic Institution: Bahir Dar University

Technical Support: Google Earth Engine Team

Data Providers: NASA LP DAAC (MODIS data)

📜 License
This work is licensed under the MIT License - see the LICENSE file for details.
Trend Analysis: Statistical trend detection (e.g., Mann-Kendall, Sen's Slope) on the generated time series.
