

(function (context) {
  var Logger = {};

  Logger.log = function(tag, string) {

    console.log(tag + ": " + string);

  };


  if (typeof module === 'object' && module.exports) {
    module.exports = exports = Logger;
  } else if (typeof define === 'function' && define.amd) {
    // AMD support
    define(function () {
      return Logger;
    });
  } else if (typeof context === 'object') {
    // If no AMD and we are in the browser, attach to window
    context.log = Logger.log;
  }
})(this.window);
