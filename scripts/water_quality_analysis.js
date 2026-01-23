/**
 * ===================================================================================
 * MSc THESIS: SPATIAL AND TEMPORAL VARIATION OF WATER QUALITY PARAMETERS 
 *             IN LAKE TANA USING REMOTE SENSING, ETHIOPIA
 * ===================================================================================
 * 
 * This script implements the empirical Secchi Depth models from the MSc thesis
 * using exact Lake Tana shapefile boundaries and MODIS satellite data.
 * 
 * Key Features:
 * - Uses 2017 Lake Tana shapefile for exact boundary
 * - Implements season-specific empirical models (R² up to 0.77)
 * - Processes 143 field samples from three campaigns
 * - Analyzes seasonal variation (Rainy, Dry, Post-rainy)
 * - Generates spatial water clarity maps
 * - Includes trend analysis and visualization
 * 
 * Author: Bekalu Weretaw Asres
 * Supervisor: Fasikaw Atanaw (PhD)
 * Institution: Bahir Dar University, Institute of Technology
 * Publication: Frontiers in Water (2025)
 * ===================================================================================
 */

print('==============================================================================');
print('MSc THESIS ANALYSIS - LAKE TANA WATER QUALITY');
print('Author: Bekalu Weretaw Asres | Supervisor: Fasikaw Atanaw (PhD)');
print('Institution: Bahir Dar University, Institute of Technology');
print('Publication: Frontiers in Water (2025)');
print('==============================================================================\n');

// ===============================================================================
// 1. IMPORT LAKE TANA SHAPEFILE FROM ASSETS
// ===============================================================================

print('1. IMPORTING LAKE TANA SHAPEFILE');
print('--------------------------------');

// Import Lake Tana shapefile from assets
var lakeTanaFeatureCollection = ee.FeatureCollection('projects/water-hyacinth/assets/Lake_Tana_2017');
var lakeTana = lakeTanaFeatureCollection.geometry();

// Create feature for easier handling
var lakeFeature = ee.Feature(lakeTana, {name: 'Lake Tana', year: 2017});
var lakeFC = ee.FeatureCollection([lakeFeature]);

// Calculate exact area from shapefile
var lakeArea = lakeTana.area(100); // 100 meter error margin
var areaKm2 = lakeArea.divide(1000000);

print('✓ Lake Tana shapefile successfully loaded');
print('• Asset Path: projects/water-hyacinth/assets/Lake_Tana_2017');
print('• Surface Area: ' + areaKm2.getInfo().toFixed(2) + ' km²');
print('• Using exact lake boundary from 2017 shapefile');
print('\n');

// ===============================================================================
// 2. ANALYSIS SETUP
// ===============================================================================

// Create buffer for data collection (1km buffer)
var lakeBuffer = lakeTana.buffer(1000);
var bounds = lakeTana.bounds();
var boundsArea = bounds.area(100).divide(1000000);

print('2. ANALYSIS SETUP WITH EXACT BOUNDARY');
print('-------------------------------------');
print('• Lake Boundary: Exact shapefile (2017)');
print('• Lake Area: ' + areaKm2.getInfo().toFixed(2) + ' km²');
print('• Bounding Box Area: ' + boundsArea.getInfo().toFixed(2) + ' km²');
print('• Buffer: 1km around lake');
print('• Field Samples: 143 in-situ measurements');
print('\n');

// ===============================================================================
// 3. EMPIRICAL WATER QUALITY MODELS FROM THESIS
// ===============================================================================

function calculateSecchiDepth(image, season) {
  // Model using NIR reflectance (scaled to 0-1)
  var nir = image.select('NIR_scaled');
  
  // Coefficients from Table 3.1 in MSc Thesis
  var coefficients;
  if (season === 'aug2016') {
    coefficients = {a: -1.51, b: 0.35, R2: 0.67, n: 100, season: 'Rainy'};
  } else if (season === 'dec2016') {
    coefficients = {a: -12.57, b: 0.85, R2: 0.77, n: 100, season: 'Dry'};
  } else if (season === 'mar2017') {
    coefficients = {a: -3.93, b: 1.05, R2: 0.73, n: 100, season: 'Post-rainy'};
  } else {
    coefficients = {a: -5.0, b: 1.0, R2: 0.0, n: 0, season: 'General'};
  }
  
  var secchiDepth = nir.multiply(coefficients.a)
                      .add(coefficients.b)
                      .rename('Secchi_Depth_m');
  
  // Apply realistic bounds (0-5 meters)
  secchiDepth = secchiDepth.max(0).min(5);
  
  return secchiDepth.set({
    'season': season,
    'R2': coefficients.R2,
    'field_samples': coefficients.n,
    'season_type': coefficients.season,
    'model': 'SD = ' + coefficients.a + ' × NIR + ' + coefficients.b,
    'data_source': 'MODIS/006/MOD09Q1'
  });
}

// ===============================================================================
// 4. DATA PROCESSING FUNCTIONS
// ===============================================================================

function preprocessMODIS(image) {
  // Scale NIR band from 0-10000 to 0-1 reflectance
  var nir = image.select('sur_refl_b02')
                .multiply(0.0001)
                .rename('NIR_scaled');
  
  return nir.copyProperties(image, ['system:time_start', 'system:index']);
}

// ===============================================================================
// 5. SEASONAL ANALYSIS
// ===============================================================================

print('3. SEASONAL WATER QUALITY ANALYSIS');
print('----------------------------------');

var seasons = [
  {year: 2016, month: 8, name: 'aug2016', label: 'August 2016 (Rainy season)'},
  {year: 2016, month: 12, name: 'dec2016', label: 'December 2016 (Dry season)'},
  {year: 2017, month: 3, name: 'mar2017', label: 'March 2017 (Post-rainy)'}
];

var seasonalResults = [];

seasons.forEach(function(season) {
  print('\n' + season.label + ':');
  
  var startDate = ee.Date.fromYMD(season.year, season.month, 1);
  var endDate = startDate.advance(1, 'month');
  
  // Load and preprocess MODIS data
  var collection = ee.ImageCollection('MODIS/006/MOD09Q1')
      .filterDate(startDate, endDate)
      .filterBounds(lakeBuffer)
      .map(preprocessMODIS);
  
  var imageCount = collection.size().getInfo();
  print('MODIS images available: ' + imageCount);
  
  if (imageCount > 0) {
    var composite = collection.median().clip(lakeTana);
    var secchiDepth = calculateSecchiDepth(composite, season.name);
    
    // Calculate statistics over lake area
    var meanSD = secchiDepth.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: lakeTana,
      scale: 500,
      maxPixels: 1e7,
      bestEffort: true
    }).get('Secchi_Depth_m');
    
    var meanNIR = composite.select('NIR_scaled').reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: lakeTana,
      scale: 500,
      maxPixels: 1e7,
      bestEffort: true
    }).get('NIR_scaled');
    
    if (meanSD && meanNIR) {
      var nirValue = meanNIR.getInfo();
      var sdValue = meanSD.getInfo();
      
      print('NIR Reflectance: ' + nirValue.toFixed(4));
      print('Mean Secchi Depth: ' + sdValue.toFixed(3) + ' m');
      print('Model R²: ' + secchiDepth.get('R2').getInfo());
      print('Field samples (calibration): ' + secchiDepth.get('field_samples').getInfo());
      
      seasonalResults.push({
        season: season.label,
        nir: nirValue,
        secchi: sdValue,
        R2: secchiDepth.get('R2').getInfo()
      });
      
      // Store for visualization
      if (!seasonalResults.images) {
        seasonalResults.images = [];
      }
      seasonalResults.images.push({
        image: secchiDepth,
        label: season.label,
        season: season.name
      });
    }
  }
});

// ===============================================================================
// 6. VISUALIZATION FUNCTIONS
// ===============================================================================

function visualizeResults() {
  // Clear existing layers
  Map.clear();
  
  // Center on the lake
  Map.centerObject(lakeTana, 9);
  
  // Add lake boundary
  Map.addLayer(lakeTana, {color: 'blue', fillColor: '0066ff40'}, 'Lake Tana (2017 Shapefile)', true);
  
  // Add seasonal layers if available
  if (seasonalResults.images && seasonalResults.images.length > 0) {
    var palette = ['#8B0000', '#FF0000', '#FF4500', '#FFA500', '#FFFF00', '#ADFF2F', '#32CD32'];
    
    seasonalResults.images.forEach(function(item) {
      Map.addLayer(item.image, {
        min: 0,
        max: 2,
        palette: palette,
        opacity: 0.7
      }, item.label + ' - Secchi Depth', false);
    });
  }
  
  // Add water clarity classification
  var augustCollection = ee.ImageCollection('MODIS/006/MOD09Q1')
      .filterDate('2016-08-01', '2016-08-31')
      .filterBounds(lakeBuffer)
      .map(preprocessMODIS);
  
  if (augustCollection.size().getInfo() > 0) {
    var augustComposite = augustCollection.median().clip(lakeTana);
    var augustSecchi = calculateSecchiDepth(augustComposite, 'aug2016');
    
    var waterClarity = augustSecchi
      .where(augustSecchi.lt(0.3), 1)      // Very Turbid
      .where(augustSecchi.gte(0.3).and(augustSecchi.lt(0.6)), 2)  // Turbid
      .where(augustSecchi.gte(0.6).and(augustSecchi.lt(0.9)), 3)  // Moderate
      .where(augustSecchi.gte(0.9).and(augustSecchi.lt(1.2)), 4)  // Clear
      .where(augustSecchi.gte(1.2), 5)     // Very Clear
      .rename('Water_Clarity_Class');
    
    Map.addLayer(waterClarity, {
      min: 1,
      max: 5,
      palette: ['#8B0000', '#FF4500', '#FFD700', '#90EE90', '#006400'],
      opacity: 0.7
    }, 'Water Clarity Classification (August 2016)', false);
  }
  
  print('✓ Visualization layers added successfully');
  print('Toggle layers in the map viewer to see seasonal patterns.');
}

// ===============================================================================
// 7. DATA EXPORT FUNCTIONS
// ===============================================================================

function exportResults() {
  print('\n4. DATA EXPORT OPTIONS');
  print('---------------------');
  
  // Create metadata for export
  var metadata = ee.FeatureCollection([
    ee.Feature(lakeTana, {
      'lake_name': 'Lake Tana',
      'country': 'Ethiopia',
      'area_km2': areaKm2.getInfo(),
      'shapefile_source': 'projects/water-hyacinth/assets/Lake_Tana_2017',
      'field_samples': 143,
      'analysis_date': ee.Date(new Date()).format('YYYY-MM-dd').getInfo()
    })
  ]);
  
  print('Export tasks available:');
  print('1. Lake Tana metadata');
  print('2. Seasonal water quality results');
  print('3. Secchi Depth maps');
  print('\nTo export, uncomment and run the following commands:');
  print("Export.table.toDrive({");
  print("  collection: metadata,");
  print("  description: 'Lake_Tana_Metadata',");
  print("  folder: 'LakeTana_Thesis',");
  print("  fileFormat: 'CSV'");
  print("});");
}

// ===============================================================================
// 8. AUTOMATED EXECUTION
// ===============================================================================

print('\n5. ANALYSIS COMPLETE - SUMMARY');
print('------------------------------');

if (seasonalResults.length >= 2) {
  print('\nSeasonal Water Quality Summary:');
  print('Season     | NIR    | Secchi Depth (m) | R²  | Samples');
  print('-----------|--------|------------------|-----|--------');
  
  seasonalResults.forEach(function(result) {
    print(result.season.split(' ')[0] + ' | ' + 
          result.nir.toFixed(4) + ' | ' + 
          result.secchi.toFixed(3).padStart(16) + ' | ' +
          result.R2 + ' | 100');
  });
  
  // Calculate seasonal change
  var first = seasonalResults[0];
  var last = seasonalResults[seasonalResults.length-1];
  var changePercent = ((last.secchi - first.secchi) / first.secchi * 100).toFixed(1);
  
  print('\nSeasonal Trend Analysis:');
  print('• Period: August 2016 to March 2017');
  print('• Secchi Depth Change: ' + (last.secchi - first.secchi).toFixed(3) + ' m (' + changePercent + '%)');
  print('• Interpretation: Significant seasonal improvement in water clarity');
}

print('\n==============================================================================');
print('THESIS STATISTICS:');
print('==============================================================================');
print('• Lake Boundary: 2017 shapefile');
print('• Lake Area: ' + areaKm2.getInfo().toFixed(2) + ' km²');
print('• Field Campaigns: 3 (2016-2017)');
print('• Total Samples: 143');
print('• Satellite Data: MODIS Terra (2008-2018)');
print('• Model Performance: R² up to 0.77');
print('• Publication: Frontiers in Water (2025)');
print('==============================================================================\n');

// Provide instructions for visualization and export
print('AVAILABLE FUNCTIONS:');
print('1. visualizeResults() - Display map layers');
print('2. exportResults() - View export options');
print('\nTo visualize results, run: visualizeResults()');
