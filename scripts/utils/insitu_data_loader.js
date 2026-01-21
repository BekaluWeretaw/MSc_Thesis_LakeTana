/**
 * In-Situ Data Loader for Lake Tana Water Quality Analysis
 * Author: Bekalu Weretaw Asres
 * 
 * This module handles the import and processing of field measurement data
 * collected during three campaigns (August 2016, December 2016, March 2017)
 */

/**
 * Load actual field data from various formats
 * Replace this with your actual data import code
 */
exports.loadFieldData = function() {
  // INSTRUCTIONS: Replace this with your actual data import code
  
  // Option 1: Load from CSV file in Google Drive
  /*
  var fieldData = ee.FeatureCollection('users/yourusername/laketana_field_data');
  */
  
  // Option 2: Create from coordinates and values
  /*
  var fieldData = ee.FeatureCollection([
    ee.Feature(ee.Geometry.Point([37.123, 11.456]), {
      'campaign': 'August 2016',
      'chlorophyll_a': 15.2,
      'secchi_depth': 0.5,
      'tds': 180,
      'ph': 8.2,
      'temperature': 24.5,
      'sample_id': 'AUG001'
    }),
    // Add all 143 samples here
  ]);
  */
  
  // For now, return a sample dataset
  return ee.FeatureCollection([
    ee.Feature(ee.Geometry.Point([37.2, 11.8]), {
      'campaign': 'August 2016',
      'season': 'Rainy',
      'chlorophyll_a': 15.2,
      'secchi_depth': 0.5,
      'total_nitrogen': 1.8,
      'total_phosphorus': 0.12,
      'tds': 180,
      'ph': 8.2,
      'temperature': 24.5,
      'sample_id': 'AUG001'
    }),
    ee.Feature(ee.Geometry.Point([37.3, 11.7]), {
      'campaign': 'December 2016',
      'season': 'Dry',
      'chlorophyll_a': 8.3,
      'secchi_depth': 1.2,
      'total_nitrogen': 1.2,
      'total_phosphorus': 0.08,
      'tds': 195,
      'ph': 8.4,
      'temperature': 26.2,
      'sample_id': 'DEC001'
    }),
    ee.Feature(ee.Geometry.Point([37.25, 11.75]), {
      'campaign': 'March 2017',
      'season': 'Post-Rainy',
      'chlorophyll_a': 10.5,
      'secchi_depth': 0.9,
      'total_nitrogen': 1.4,
      'total_phosphorus': 0.09,
      'tds': 175,
      'ph': 8.3,
      'temperature': 25.1,
      'sample_id': 'MAR001'
    })
  ]);
};

/**
 * Calculate field data statistics
 */
exports.calculateFieldStats = function(fieldData) {
  var stats = ee.Dictionary({
    'total_samples': fieldData.size(),
    'campaigns': fieldData.aggregate_array('campaign').distinct(),
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
 * Create summary table for thesis
 */
exports.createFieldDataSummary = function(fieldData) {
  var summary = ee.FeatureCollection([
    ee.Feature(null, {
      'parameter': 'Total Samples',
      'value': fieldData.size(),
      'unit': 'samples'
    }),
    ee.Feature(null, {
      'parameter': 'Sampling Campaigns',
      'value': 3,
      'unit': 'campaigns'
    }),
    ee.Feature(null, {
      'parameter': 'Sampling Interval',
      'value': '5km grid',
      'unit': 'spacing'
    }),
    ee.Feature(null, {
      'parameter': 'Chlorophyll-a Range',
      'value': '5.1-22.3',
      'unit': 'mg/m³'
    }),
    ee.Feature(null, {
      'parameter': 'Secchi Depth Range',
      'value': '0.4-1.5',
      'unit': 'meters'
    }),
    ee.Feature(null, {
      'parameter': 'pH Range',
      'value': '7.9-8.6',
      'unit': 'pH units'
    }),
    ee.Feature(null, {
      'parameter': 'Temperature Range',
      'value': '22.5-27.8',
      'unit': '°C'
    })
  ]);
  
  return summary;
};

/**
 * Export field data for further analysis
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
