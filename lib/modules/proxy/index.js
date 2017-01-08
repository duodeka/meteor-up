'use strict';

require('babel-polyfill');
require('source-map-support/register');

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.help = help;
exports.setup = setup;

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('mup:module:proxy');

function help() /* api */{
  log('exec => mup proxy help');
}

function setup() /* api */{
  log('exec => mup proxy setup');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImhlbHAiLCJzZXR1cCIsImxvZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFHZ0JBLEksR0FBQUEsSTtRQUlBQyxLLEdBQUFBLEs7O0FBUGhCOzs7Ozs7QUFDQSxJQUFNQyxNQUFNLHFCQUFNLGtCQUFOLENBQVo7O0FBRU8sU0FBU0YsSUFBVCxHQUFlLFNBQVc7QUFDL0JFLE1BQUksd0JBQUo7QUFDRDs7QUFFTSxTQUFTRCxLQUFULEdBQWdCLFNBQVc7QUFDaENDLE1BQUkseUJBQUo7QUFDRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZVJvb3QiOiJDOi93YW1wNjQvd3d3L21ldGVvci11cC9zcmMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xyXG5jb25zdCBsb2cgPSBkZWJ1ZygnbXVwOm1vZHVsZTpwcm94eScpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGhlbHAgKC8qIGFwaSAqLykge1xyXG4gIGxvZygnZXhlYyA9PiBtdXAgcHJveHkgaGVscCcpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0dXAgKC8qIGFwaSAqLykge1xyXG4gIGxvZygnZXhlYyA9PiBtdXAgcHJveHkgc2V0dXAnKTtcclxufVxyXG4iXX0=