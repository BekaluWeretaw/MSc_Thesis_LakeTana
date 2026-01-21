/**
 * Water Quality Indices Calculation Utilities
 * For MSc Thesis: Lake Tana Water Quality Analysis
 * Author: Bekalu Weretaw Asres
 * Date: 2020
 */

/**
 * Calculate Turbidity Index from MODIS red band
 * Empirical model: Turbidity (NTU) = a * Red + b
 * Based on field calibration data
 */
exports.calculateTurbidity = function(redBand, coefficient, intercept) {
  coefficient = coefficient || 0.85;
  intercept = intercept || 15.6;
  return redBand.multiply(coefficient).add(intercept);
};

/**
 * Calculate Chlorophyll-a Index
 * Based on Gitelson et al. (1993) model
 */
exports.calculateChlorophyll = function(redBand, nirBand, coefficient, intercept) {
  coefficient = coefficient || 23.4;
  intercept = intercept || 1.8;
  return nirBand.divide(redBand).multiply(coefficient).add(intercept);
};

/**
 * Calculate Modified Water Index for inland waters
 */
exports.calculateWaterIndex = function(redBand, nirBand) {
  return redBand.subtract(nirBand).divide(redBand.add(nirBand));
};

/**
 * Calculate Suspended Solids Index
 */
exports.calculateSuspendedSolids = function(redBand, nirBand, coefficient, intercept) {
  coefficient = coefficient || 0.67;
  intercept = intercept || 12.3;
  return redBand.add(nirBand).multiply(coefficient).add(intercept);
};

/**
 * Calculate all water quality indices at once
 */
exports.calculateAllIndices = function(redBand, nirBand, prefix) {
  prefix = prefix || 'WQ_';
  return {
    turbidity: exports.calculateTurbidity(redBand).rename(prefix + 'Turbidity'),
    chlorophyll: exports.calculateChlorophyll(redBand, nirBand).rename(prefix + 'Chlorophyll'),
    waterIndex: exports.calculateWaterIndex(redBand, nirBand).rename(prefix + 'WaterIndex'),
    suspendedSolids: exports.calculateSuspendedSolids(redBand, nirBand).rename(prefix + 'SuspendedSolids')
  };
};
