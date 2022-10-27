/**
 * Tramspose raw sheet data into usable content
 * @param {array} rawData - 3d Array with all rows and cell from requested sheet
 * @param {object} reqSheet - A spreadsheet definition (sheets.?)
 * @return {object} An object with 3 parameters: labels, types, and data
 */
function transposeToArray(rawData,reqSheet) {
  return {
    labels: rawData[reqSheet.labelRow-1],
    types: rawData[reqSheet.typeRow-1].map(t=> (t == '') ? 'string' : t),
    displays: rawData[reqSheet.displayRow-1].map(t=> (t == '') ? 'list' : t),
    data: rawData.slice(reqSheet.firstDataRow-1)
  }; 
}
/**
 * Tramspose raw sheet data into usable content
 * @param {array} rawData - 3d Array with all rows and cell from requested sheet
 * @param {object} config - A spreadsheet definition (sheets.?)
 * @return {object} An object with 3 parameters: labels, types, and data
 */
function transposeToObject(rawData,config) {
  // Get field map
  const fields = rawData[config.variableRow-1];

  // Create variables for holding outputs
  const labels = {};
  const types = {};
  const displays = {};
  var data = [];

  // Transpose types
  rawData[config.typeRow-1].forEach((cell, index) => {
    types[fields[index]] = cell || 'string';
  });

  // Transpose labels
  rawData[config.labelRow-1].forEach((cell, index) => {
    labels[fields[index]] = cell;
  });

  // Transpose display
  rawData[config.displayRow-1].forEach((cell, index) => {
    displays[fields[index]] = cell;
  });

  // Transpose data
  rawData.slice(config.firstDataRow-1,rawData.length-1)
  .forEach((row, rowIndex) => {
    const rowID = rowIndex + config.firstDataRow;
    var dataRow = {
      row: rowID,
    };
    row.forEach((cell, colIndex) => {
      dataRow[fields[colIndex]] = cell;
    })
    data.push(dataRow);
  });

 return {labels,types,displays,data}; 
}