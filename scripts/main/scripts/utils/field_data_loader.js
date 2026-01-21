/**
 * Field Data Loader for Lake Tana Water Quality Analysis
 * MSc Thesis: Bekalu Weretaw Asres
 * Bahir Dar University, Institute of Technology
 * Department: Hydraulic Engineering
 * Supervisor: Fasikaw Atanaw (PhD)
 * Year: 2020
 * 
 * This module handles the 143 in-situ water samples collected during:
 * 1. August 2016 (Rainy season)
 * 2. December 2016 (Dry season)
 * 3. March 2017 (Post-rainy season)
 */

/**
 * Load field sampling data for Lake Tana
 * Replace with your actual 143 GPS coordinates and measurements
 */
exports.loadFieldData = function() {
  print('Loading field data: 143 water samples from Lake Tana');
  
  // SAMPLE DATA STRUCTURE - REPLACE WITH YOUR ACTUAL 143 SAMPLES
  var fieldData = ee.FeatureCollection([
    // August 2016 samples (Rainy season)
    ee.Feature(ee.Geometry.Point([37.2, 11.8]), {
      'campaign': 'August 2016',
      'season': 'Rainy',
      'sample_id': 'AUG_001',
      'chlorophyll_a': 15.2,     // mg/m³
      'secchi_depth': 0.5,       // meters
      'total_nitrogen': 1.8,     // mg/L
      'total_phosphorus': 0.12,  // mg/L
      'tds': 180,                // mg/L
      'ph': 8.2,                 // pH units
      'temperature': 24.5,       // °C
      'latitude': 11.8,
      'longitude': 37.2
    }),
    
    // December 2016 samples (Dry season)
    ee.Feature(ee.Geometry.Point([37.3, 11.7]), {
      'campaign': 'December 2016',
      'season': 'Dry',
      'sample_id': 'DEC_001',
      'chlorophyll_a': 8.3,
      'secchi_depth': 1.2,
      'total_nitrogen': 1.2,
      'total_phosphorus': 0.08,
      'tds': 195,
      'ph': 8.4,
      'temperature': 26.2,
      'latitude': 11.7,
      'longitude': 37.3
    }),
    
    // March 2017 samples (Post-rainy season)
    ee.Feature(ee.Geometry.Point([37.25, 11.75]), {
      'campaign': 'March 2017',
      'season': 'Post-Rainy',
      'sample_id': 'MAR_001',
      'chlorophyll_a': 10.5,
      'secchi_depth': 0.9,
      'total_nitrogen': 1.4,
      'total_phosphorus': 0.09,
      'tds': 175,
      'ph': 8.3,
      'temperature': 25.1,
      'latitude': 11.75,
      'longitude': 37.25
    })
    // ADD YOUR 140 ADDITIONAL SAMPLES HERE
    // Use your actual GPS coordinates and measurements
  ]);
  
  print('Field data loaded successfully');
  print('Total samples: ' + fieldData.size().getInfo());
  print('Campaigns: August 2016, December 2016, March 2017');
  print('Parameters: Chl-a, Secchi Depth, TN, TP, TDS, pH, Temperature\n');
  
  return fieldData;
};

/**
 * Calculate field data statistics
 */
exports.calculateFieldStats = function(fieldData) {
  var stats = ee.Dictionary({
    'total_samples': fieldData.size(),
    'campaigns': fieldData.aggregate_array('campaign').distinct().sort(),
    'chlorophyll_stats': fieldData.aggregate_stats('chlorophyll_a'),
    'secchi_stats': fieldData.aggregate_stats('secchi_depth'),
    'tds_stats': fieldData.aggregate_stats('tds'),
    'ph_stats': fieldData.aggregate_stats('ph'),
    'temperature_stats': fieldData.aggregate_stats('temperature')
  });
  
  return stats;
};

/**
 * Filter data by campaign
 */
exports.filterByCampaign = function(fieldData, campaignName) {
  return fieldData.filter(ee.Filter.eq('campaign', campaignName));
};

/**
 * Filter data by season
 */
exports.filterBySeason = function(fieldData, seasonName) {
  return fieldData.filter(ee.Filter.eq('season', seasonName));
};

/**
 * Extract satellite data at field sampling points
 */
exports.extractSatelliteAtPoints = function(satelliteImage, fieldPoints) {
  print('Extracting satellite data at ' + fieldPoints.size().getInfo() + ' field locations...');
  
  var extracted = satelliteImage.select(['sur_refl_b01', 'sur_refl_b02'])
      .reduceRegions({
        collection: fieldPoints,
        reducer: ee.Reducer.mean(),
        scale: 250
      });
  
  print('Satellite data extraction complete');
  return extracted;
};

/**
 * Create field data summary table for thesis
 */
exports.createFieldSummary = function() {
  var summary = ee.FeatureCollection([
    ee.Feature(null, {
      'parameter': 'Total Samples',
      'value': 143,
      'unit': 'water samples'
    }),
    ee.Feature(null, {
      'parameter': 'Sampling Campaigns',
      'value': 3,
      'unit': 'seasons'
    }),
    ee.Feature(null, {
      'parameter': 'Sampling Grid',
      'value': '5km interval',
      'unit': 'spacing'
    }),
    ee.Feature(null, {
      'parameter': 'Parameters Measured',
      'value': 7,
      'unit': 'water quality parameters'
    }),
    ee.Feature(null, {
      'parameter': 'GPS Registration',
      'value': 'Geo-referenced',
      'unit': 'spatial accuracy'
    }),
    ee.Feature(null, {
      'parameter': 'Sampling Period',
      'value': '2016-2017',
      'unit': 'years'
    })
  ]);
  
  return summary;
};

/**
 * Export field data for analysis
 */
exports.exportFieldData = function(fieldData, description) {
  Export.table.toDrive({
    collection: fieldData,
    description: description,
    folder: 'LakeTana_FieldData',
    fileNamePrefix: 'Field_Data_' + description,
    fileFormat: 'CSV'
  });
  
  print('Field data export prepared: ' + description);
};

// ============================================================================
// INSTRUCTIONS FOR USING YOUR ACTUAL DATA:
// ============================================================================
// 1. Replace the sample data above with your actual 143 samples
// 2. Each sample should have: latitude, longitude, and all measurements
// 3. To import from CSV:
//    a. Upload CSV to Google Drive
//    b. Use: var fieldData = ee.FeatureCollection('users/yourusername/yourfile');
// 4. To manually enter all 143 samples, add them to the array above
// ============================================================================
