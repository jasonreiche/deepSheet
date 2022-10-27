/**
 * DeepSheet - Turns Google Sheets content into formatted HTML or JSON
 * @version MVP 2 pre-alpha
 * 
 * @features
 * - Cached data scheme. Data will be refreshed after it's accessed if it's after cacheTimeout
 * - Interactive tables with pagination, search, and ordering via DataTables.js for jQuery
 * - jQuery for support of DataTables.js
 *   https://datatables.net/manual/index
 *   https://datatables.net/reference/option/
 * - jQuery UI for modals
 * - Material Design Components for Web (MDC)
 *   https://material.io/develop/web/
 *   https://material.io/components?platform=web
 * 
 * @future-plans
 * - Move from GAS HTML Service Templates to using google.script.run
 *   This will allow for spinners during load, faster load, and active refresh
 *   https://developers.google.com/apps-script/guides/html/reference/run
 * - Loading Spinner
 *   https://ramblings.mcpher.com/gassnippets2/add-on-spinner/
 * - Move to MDC modal instead of jQuery UI
 *   https://material.io/components/dialogs/web
 * 
 */
//#region Variables
const cacheTimeout = 60 * 30;

const exec = "https://script.google.com/macros/s/AKfycbxrKK77WsdlYs9jkovRWYpPYzqKVSCRv3JlCiiWp6V_Y2JeMc5Vz7VLNJJJUGof1YvtjA/exec";

const spreadsheets = {
  ittData: '1AZ5_rp1HcJ8Qk394oa4Jk3FhN8HjsxKQ1zo3JSlKfpE',
};

const templates = {
  books: { asObject: true, },
  quotes: { asObject: true, },

  details: { asObject: false, },
  table: { asObject: false, },
};
//#endregion
//#region Test Functions
function test() {
  const books = getData(spreadsheets.ittData, 'Books');
  Logger.log(books);
}

function testDoGet() {
  var eventObject = 
    {
      "parameter": {
        "s": "ittData",
        "p": "people"
      },
      // "parameter": {
      //   "s": "ittData",
      //   "p": "person",
      //   "i": "Simon Sinek"
      // },
      // "parameters": {
      //   "sheet": ["ittData"]
      //   "page": ["books"],
      // }
    }
  doGet(eventObject);
}
//#endregion

var scriptProperties = PropertiesService.getScriptProperties();