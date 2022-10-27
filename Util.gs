//#region Utility Functions
/**
 * Returns the content of an HTML file
 * @param {string} filename - name of HTML file to retreive
 * @return {string} HTML content from request file
 */
function include(filename) {
  return HtmlService
    .createHtmlOutputFromFile(filename)
    .getContent();
}

function getSheetByName(sheetsID, sheetName) {
  // Load from Sheets
  const spreadsheet = SpreadsheetApp.openById(sheetsID);
  const sheets = spreadsheet.getSheets();
  const sheet = sheets.find(s => {
    return s.getName() == sheetName;
  });

  // Done
  return { spreadsheet, sheet };
}

function getConfig(sheetName) {
  const sheetID = spreadsheets[sheetName];

  if (sheetID) {
    var config = {
      id: sheetID,
      sheetName
    };

    // Check for cached Sheet
    var cached = scriptProperties.getProperty(sheetName + "-config");
    var rawData;

    const updateCache = () => {
      // Get sheet
      const { spreadsheet, sheet } = getSheetByName(sheetID, 'dsConfig');

      if (sheet) {
        // Get data from sheet
        rawData = spreadsheet
          .setActiveSheet(sheet)
          .getDataRange()
          .getValues();

        // Update cache
        scriptProperties.setProperty(sheetName + "-config", JSON.stringify(rawData));
      }
      return rawData
    }

    if (cached != null) {
      rawData = JSON.parse(cached);
      updateCache();
    } else {
      rawData = updateCache();
    }
    // Key:value pairs
    config.primaryColor   = (rawData) ? rawData[4][1] : "";
    config.secondaryColor = (rawData) ? rawData[5][1] : "";
    config.variableRow    = (rawData && !isNaN(rawData[ 6][1])) ? rawData[ 6][1] : 1;
    config.displayRow     = (rawData && !isNaN(rawData[ 7][1])) ? rawData[ 7][1] : 2;
    config.typeRow        = (rawData && !isNaN(rawData[ 8][1])) ? rawData[ 8][1] : 3;
    config.labelRow       = (rawData && !isNaN(rawData[ 9][1])) ? rawData[ 9][1] : 4;
    config.firstDataRow   = (rawData && !isNaN(rawData[10][1])) ? rawData[10][1] : 5;

    // Routes
    config.routes = {};
    for (var r = 4; r < rawData.length; r++) {
      const page = rawData[r][4];
      if (page !== "") {
        config.routes[page] = {
          sheet: rawData[r][5],
          type: rawData[r][6],
          template: rawData[r][7]
        }
      }
    }
    
    return config;
  } else return false
}
/**
 * Gets data from a Google Sheets sheet
 * @param {object} config - A spreadsheet definition (sheets.?)
 * @param {string} tabTitle - the string title of the requested sheet
 * @param {boolean} [asObject=false] - Should the return object have it's content formatted as named objects instead of an array 
 */
function getData(config, tabTitle, asObject) {
  // Set up variables
  if (typeof config.firstDataRow == 'undefined') config.firstDataRow = 5;
  if (typeof config.variableRow == 'undefined') config.variableRow = config.firstDataRow - 1;
  if (typeof config.labelRow == 'undefined') config.labelRow = config.firstDataRow - 2;
  if (typeof config.typeRow == 'undefined') config.typeRow = config.firstDataRow - 3;
  if (typeof config.displayRow == 'undefined') config.displayRow = config.firstDataRow - 4;

  // Check for cached Sheet
  var cache = CacheService.getScriptCache();
  // cache.remove(config.sheetName + "-" + tabTitle);
  var cached = cache.get(config.sheetName + "-" + tabTitle);
  var rawData;

  if (cached != null) {
    rawData = JSON.parse(cached);
  } else {
    // Get data from sheet
    const { spreadsheet, sheet } = getSheetByName(config.id, tabTitle)
    
    if (!sheet) return "No matching sheet found";

    rawData = spreadsheet
      .setActiveSheet(sheet)
      .getDataRange()
      .getValues();

    // Update cache
    cache.put(config.sheetName + "-" + tabTitle, JSON.stringify(rawData), cacheTimeout);
  }

  //// Transpose
  return ((typeof asObject == "boolean" && asObject == true) ? transposeToObject : transposeToArray)(rawData,config);
}
//#endregion
