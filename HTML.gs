/**
 * https://developers.google.com/apps-script/reference/html/html-output
 * doGet() CAN NOT be async.  Return must be an HTML Object, not a Promise
 */
function doGet(request) {
  const pageName = request.parameter.page || request.parameter.p;
  if (pageName !== 'undefined') {
    const sheetName = request.parameter.sheet || request.parameter.s;
    const outputName = request.parameter.output || request.parameter.o;
    const item = request.parameter.item || request.parameter.i;
    if (typeof pageName !== 'undefined' && typeof sheetName !== 'undefined') {
      const config = getConfig(sheetName);
      const route = {
        ...config.routes[pageName],
        page: pageName,
        sheets: sheetName
      }
      // delete config.routes;
      const asObject = route && templates[route.template] && templates[route.template].asObject || false;
      const collection = getData(config, route.sheet, asObject);
      
      if (typeof collection == 'undefined') {
        return ContentService.createTextOutput("No matching sheet found.");
      }
      if (typeof item != "undefined") {
        collection.data = collection.data.find(row => row[0] == item);
        if (collection.data == undefined) {
          return ContentService.createTextOutput("No matching row found.");  
        }
      }

      // Output
      if (outputName && outputName.toLowerCase() == 'json') {
        return ContentService.createTextOutput(JSON.stringify(collection));
      } else if (route) {
        // Output as HTML (Default)
        var template = Object.assign(
          HtmlService.createTemplateFromFile(route.template),
          config, collection, { title: route.sheet, route, exec }
        );
        return template
          // https://developers.google.com/apps-script/reference/html/html-template#evaluate()
          .evaluate()
          // https://developers.google.com/apps-script/reference/html/html-output#setXFrameOptionsMode(XFrameOptionsMode)
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      } else return ContentService.createTextOutput("No matching route found.");
    } else return ContentService.createTextOutput("No matching page found.");
  } else return ContentService.createTextOutput("Invalid request.");
}