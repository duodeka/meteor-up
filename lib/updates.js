'use strict';

require('babel-polyfill');
require('source-map-support/register');

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return new Promise(function (resolve, reject) {
    var params = {
      timeout: 1000,
      package: _package2.default.name,
      auth: {}
    };

    var npm = new _silentNpmRegistryClient2.default();
    var uri = 'https://registry.npmjs.org/npm';
    npm.distTags.fetch(uri, params, function (err, res) {
      if (err) {
        resolve();
        return;
      }

      var npmVersion = res.latest;
      var local = _package2.default.version.split('.').map(function (n) {
        return Number(n);
      });
      var remote = npmVersion.split('.').map(function (n) {
        return Number(n);
      });

      var available = remote[0] > local[0] || remote[0] === local[0] && remote[1] > local[1] || remote[1] === local[1] && remote[2] > local[2];

      if (available) {
        console.log('update %s => %s', _package2.default.version, npmVersion);
      }

      resolve();
    });
  });
};

var _silentNpmRegistryClient = require('silent-npm-registry-client');

var _silentNpmRegistryClient2 = _interopRequireDefault(_silentNpmRegistryClient);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVwZGF0ZXMuanMiXSwibmFtZXMiOlsiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJwYXJhbXMiLCJ0aW1lb3V0IiwicGFja2FnZSIsIm5hbWUiLCJhdXRoIiwibnBtIiwidXJpIiwiZGlzdFRhZ3MiLCJmZXRjaCIsImVyciIsInJlcyIsIm5wbVZlcnNpb24iLCJsYXRlc3QiLCJsb2NhbCIsInZlcnNpb24iLCJzcGxpdCIsIm1hcCIsIk51bWJlciIsIm4iLCJyZW1vdGUiLCJhdmFpbGFibGUiLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7a0JBR2UsWUFBWTtBQUN6QixTQUFPLElBQUlBLE9BQUosQ0FBWSxVQUFVQyxPQUFWLEVBQW1CQyxNQUFuQixFQUEyQjtBQUM1QyxRQUFNQyxTQUFTO0FBQ2JDLGVBQVMsSUFESTtBQUViQyxlQUFTLGtCQUFJQyxJQUZBO0FBR2JDLFlBQU07QUFITyxLQUFmOztBQU1BLFFBQU1DLE1BQU0sdUNBQVo7QUFDQSxRQUFNQyxNQUFNLGdDQUFaO0FBQ0FELFFBQUlFLFFBQUosQ0FBYUMsS0FBYixDQUFtQkYsR0FBbkIsRUFBd0JOLE1BQXhCLEVBQWdDLFVBQVVTLEdBQVYsRUFBZUMsR0FBZixFQUFvQjtBQUNsRCxVQUFJRCxHQUFKLEVBQVM7QUFDUFg7QUFDQTtBQUNEOztBQUVELFVBQU1hLGFBQWFELElBQUlFLE1BQXZCO0FBQ0EsVUFBTUMsUUFBUSxrQkFBSUMsT0FBSixDQUFZQyxLQUFaLENBQWtCLEdBQWxCLEVBQXVCQyxHQUF2QixDQUEyQjtBQUFBLGVBQUtDLE9BQU9DLENBQVAsQ0FBTDtBQUFBLE9BQTNCLENBQWQ7QUFDQSxVQUFNQyxTQUFTUixXQUFXSSxLQUFYLENBQWlCLEdBQWpCLEVBQXNCQyxHQUF0QixDQUEwQjtBQUFBLGVBQUtDLE9BQU9DLENBQVAsQ0FBTDtBQUFBLE9BQTFCLENBQWY7O0FBRUEsVUFBTUUsWUFBWUQsT0FBTyxDQUFQLElBQVlOLE1BQU0sQ0FBTixDQUFaLElBQ2pCTSxPQUFPLENBQVAsTUFBY04sTUFBTSxDQUFOLENBQWQsSUFBMEJNLE9BQU8sQ0FBUCxJQUFZTixNQUFNLENBQU4sQ0FEckIsSUFFakJNLE9BQU8sQ0FBUCxNQUFjTixNQUFNLENBQU4sQ0FBZCxJQUEwQk0sT0FBTyxDQUFQLElBQVlOLE1BQU0sQ0FBTixDQUZ2Qzs7QUFJQSxVQUFJTyxTQUFKLEVBQWU7QUFDYkMsZ0JBQVFDLEdBQVIsQ0FBWSxpQkFBWixFQUErQixrQkFBSVIsT0FBbkMsRUFBNENILFVBQTVDO0FBQ0Q7O0FBRURiO0FBQ0QsS0FuQkQ7QUFvQkQsR0E3Qk0sQ0FBUDtBQThCRCxDOztBQWxDRDs7OztBQUNBIiwiZmlsZSI6InVwZGF0ZXMuanMiLCJzb3VyY2VSb290IjoiQzovd2FtcDY0L3d3dy9tZXRlb3ItdXAvc3JjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE5wbSBmcm9tICdzaWxlbnQtbnBtLXJlZ2lzdHJ5LWNsaWVudCc7XHJcbmltcG9ydCBwa2cgZnJvbSAnLi4vcGFja2FnZS5qc29uJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgY29uc3QgcGFyYW1zID0ge1xyXG4gICAgICB0aW1lb3V0OiAxMDAwLFxyXG4gICAgICBwYWNrYWdlOiBwa2cubmFtZSxcclxuICAgICAgYXV0aDoge30sXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IG5wbSA9IG5ldyBOcG0oKTtcclxuICAgIGNvbnN0IHVyaSA9ICdodHRwczovL3JlZ2lzdHJ5Lm5wbWpzLm9yZy9ucG0nO1xyXG4gICAgbnBtLmRpc3RUYWdzLmZldGNoKHVyaSwgcGFyYW1zLCBmdW5jdGlvbiAoZXJyLCByZXMpIHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IG5wbVZlcnNpb24gPSByZXMubGF0ZXN0O1xyXG4gICAgICBjb25zdCBsb2NhbCA9IHBrZy52ZXJzaW9uLnNwbGl0KCcuJykubWFwKG4gPT4gTnVtYmVyKG4pKTtcclxuICAgICAgY29uc3QgcmVtb3RlID0gbnBtVmVyc2lvbi5zcGxpdCgnLicpLm1hcChuID0+IE51bWJlcihuKSk7XHJcblxyXG4gICAgICBjb25zdCBhdmFpbGFibGUgPSByZW1vdGVbMF0gPiBsb2NhbFswXSB8fFxyXG4gICAgICAocmVtb3RlWzBdID09PSBsb2NhbFswXSAmJiByZW1vdGVbMV0gPiBsb2NhbFsxXSkgfHxcclxuICAgICAgKHJlbW90ZVsxXSA9PT0gbG9jYWxbMV0gJiYgcmVtb3RlWzJdID4gbG9jYWxbMl0pO1xyXG5cclxuICAgICAgaWYgKGF2YWlsYWJsZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCd1cGRhdGUgJXMgPT4gJXMnLCBwa2cudmVyc2lvbiwgbnBtVmVyc2lvbik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlc29sdmUoKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59XHJcbiJdfQ==