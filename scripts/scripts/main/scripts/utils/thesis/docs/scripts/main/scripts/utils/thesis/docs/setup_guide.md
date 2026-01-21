# Setup and Usage Guide

## Overview
This guide explains how to use the Google Earth Engine scripts for reproducing the MSc thesis analysis of Lake Tana water quality.

## Prerequisites

### 1. Google Earth Engine Account
- Visit: https://earthengine.google.com/
- Sign up with Google account
- Request access (free for academic/research use)
- Approval typically takes 1-2 business days

### 2. Basic Requirements
- Internet connection
- Modern web browser (Chrome, Firefox recommended)
- Basic JavaScript knowledge (helpful but not required)

## Quick Start

### Step 1: Access Google Earth Engine
1. Go to: https://code.earthengine.google.com/
2. Sign in with your approved Google account

### Step 2: Create New Script
1. Click "New" button in Scripts panel
2. Name it "LakeTana_Thesis_Analysis"

### Step 3: Copy the Main Script
1. Open `scripts/main/GEE_Thesis_Analysis.js` from this repository
2. Copy entire content
3. Paste into GEE code editor

### Step 4: Run Analysis
1. Click "Run" button (▶️)
2. Monitor console output for progress
3. Check for any error messages

### Step 5: Export Data
1. Go to "Tasks" tab after script runs
2. Click "Run" for each export task
3. Wait for completion (may take several minutes)
4. Download from Google Drive

## Detailed Analysis Steps

### 1. Seasonal Analysis
The script processes three seasons:
- August 2016 (Wet season)
- December 2016 (Transition season)
- March 2017 (Dry season)

### 2. Trend Analysis
- Annual composites for 2008-2018
- Linear trend calculation
- Statistical significance testing

### 3. Water Quality Parameters
- Turbidity (NTU)
- Chlorophyll-a (mg/m³)
- Water Index
- Suspended Solids

## Customization Options

### Change Study Area
Modify the Lake Tana boundary in the script:
```javascript
var lakeTana = ee.FeatureCollection('ft:15x-23sju_DJVi4odBMnv_esJRXHegti5vGCtkz1g')
    .filter(ee.Filter.eq('Name', 'Tana'));
