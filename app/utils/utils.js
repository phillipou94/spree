// Packaged utility functions.
//
// These methods abstract out the basic mechanism
// of creating server responses with some content
// (error code, message, etc.).
//
var utils = (function() {

  var _utils = {};

  /*
    Send a 200 OK with success:true in the request body to the
    response argument provided.
    The caller of this function should return after calling
  */
  _utils.sendErrorResponse = function(res, errorCode, error) {
    res.status(errorCode).json({
      success: false,
      message: error
    }).end();
  };

  /*
    Send an error code with success:false and error message
    as provided in the arguments to the response argument provided.
    The caller of this function should return after calling
  */
  _utils.sendSuccessResponse = function(res, body) {
    res.status(200).json({
      success: true,
      body: body,
    }).end();
  };

  _utils.sendStepResponse = function(res, body) {
    res.status(201).json({
      success: true,
      additionalSteps:true,
      body: body,
    }).end();
  };

  Object.freeze(_utils);
  return _utils;

})();

module.exports = utils;
