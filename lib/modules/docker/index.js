'use strict';

require('babel-polyfill');
require('source-map-support/register');

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.help = help;
exports.setup = setup;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _nodemiral = require('nodemiral');

var _nodemiral2 = _interopRequireDefault(_nodemiral);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('mup:module:docker');

function help() /* api */{
  log('exec => mup docker help');
}

function setup(api) {
  log('exec => mup docker setup');
  var list = _nodemiral2.default.taskList('Setup Docker');

  list.executeScript('setup docker', {
    script: _path2.default.resolve(__dirname, 'assets/docker-setup.sh')
  });

  var sessions = api.getSessions(['meteor', 'mongo', 'proxy']);
  var rsessions = sessions.reduce(function (prev, curr) {
    if (prev.map(function (session) {
      return session._host;
    }).indexOf(curr._host) === -1) {
      prev.push(curr);
    }
    return prev;
  }, []);
  return (0, _utils.runTaskList)(list, rsessions);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImhlbHAiLCJzZXR1cCIsImxvZyIsImFwaSIsImxpc3QiLCJ0YXNrTGlzdCIsImV4ZWN1dGVTY3JpcHQiLCJzY3JpcHQiLCJyZXNvbHZlIiwiX19kaXJuYW1lIiwic2Vzc2lvbnMiLCJnZXRTZXNzaW9ucyIsInJzZXNzaW9ucyIsInJlZHVjZSIsInByZXYiLCJjdXJyIiwibWFwIiwic2Vzc2lvbiIsIl9ob3N0IiwiaW5kZXhPZiIsInB1c2giXSwibWFwcGluZ3MiOiI7Ozs7O1FBTWdCQSxJLEdBQUFBLEk7UUFJQUMsSyxHQUFBQSxLOztBQVZoQjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBLElBQU1DLE1BQU0scUJBQU0sbUJBQU4sQ0FBWjs7QUFFTyxTQUFTRixJQUFULEdBQWMsU0FBVztBQUM5QkUsTUFBSSx5QkFBSjtBQUNEOztBQUVNLFNBQVNELEtBQVQsQ0FBZUUsR0FBZixFQUFvQjtBQUN6QkQsTUFBSSwwQkFBSjtBQUNBLE1BQU1FLE9BQU8sb0JBQVVDLFFBQVYsQ0FBbUIsY0FBbkIsQ0FBYjs7QUFFQUQsT0FBS0UsYUFBTCxDQUFtQixjQUFuQixFQUFtQztBQUNqQ0MsWUFBUSxlQUFLQyxPQUFMLENBQWFDLFNBQWIsRUFBd0Isd0JBQXhCO0FBRHlCLEdBQW5DOztBQUlBLE1BQU1DLFdBQVdQLElBQUlRLFdBQUosQ0FBZ0IsQ0FBRSxRQUFGLEVBQVksT0FBWixFQUFxQixPQUFyQixDQUFoQixDQUFqQjtBQUNBLE1BQU1DLFlBQVlGLFNBQVNHLE1BQVQsQ0FBZ0IsVUFBQ0MsSUFBRCxFQUFPQyxJQUFQLEVBQWdCO0FBQ2hELFFBQUlELEtBQUtFLEdBQUwsQ0FBUztBQUFBLGFBQVdDLFFBQVFDLEtBQW5CO0FBQUEsS0FBVCxFQUFtQ0MsT0FBbkMsQ0FBMkNKLEtBQUtHLEtBQWhELE1BQTJELENBQUMsQ0FBaEUsRUFBbUU7QUFDakVKLFdBQUtNLElBQUwsQ0FBVUwsSUFBVjtBQUNEO0FBQ0QsV0FBT0QsSUFBUDtBQUNELEdBTGlCLEVBS2YsRUFMZSxDQUFsQjtBQU1BLFNBQU8sd0JBQVlWLElBQVosRUFBa0JRLFNBQWxCLENBQVA7QUFDRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZVJvb3QiOiJDOi93YW1wNjQvd3d3L21ldGVvci11cC9zcmMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcclxuaW1wb3J0IG5vZGVtaXJhbCBmcm9tICdub2RlbWlyYWwnO1xyXG5pbXBvcnQge3J1blRhc2tMaXN0fSBmcm9tICcuLi91dGlscyc7XHJcbmNvbnN0IGxvZyA9IGRlYnVnKCdtdXA6bW9kdWxlOmRvY2tlcicpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGhlbHAoLyogYXBpICovKSB7XHJcbiAgbG9nKCdleGVjID0+IG11cCBkb2NrZXIgaGVscCcpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0dXAoYXBpKSB7XHJcbiAgbG9nKCdleGVjID0+IG11cCBkb2NrZXIgc2V0dXAnKTtcclxuICBjb25zdCBsaXN0ID0gbm9kZW1pcmFsLnRhc2tMaXN0KCdTZXR1cCBEb2NrZXInKTtcclxuXHJcbiAgbGlzdC5leGVjdXRlU2NyaXB0KCdzZXR1cCBkb2NrZXInLCB7XHJcbiAgICBzY3JpcHQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdhc3NldHMvZG9ja2VyLXNldHVwLnNoJylcclxuICB9KTtcclxuXHJcbiAgY29uc3Qgc2Vzc2lvbnMgPSBhcGkuZ2V0U2Vzc2lvbnMoWyAnbWV0ZW9yJywgJ21vbmdvJywgJ3Byb3h5JyBdKTtcclxuICBjb25zdCByc2Vzc2lvbnMgPSBzZXNzaW9ucy5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHtcclxuICAgIGlmIChwcmV2Lm1hcChzZXNzaW9uID0+IHNlc3Npb24uX2hvc3QpLmluZGV4T2YoY3Vyci5faG9zdCkgPT09IC0xKSB7XHJcbiAgICAgIHByZXYucHVzaChjdXJyKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwcmV2O1xyXG4gIH0sIFtdKTtcclxuICByZXR1cm4gcnVuVGFza0xpc3QobGlzdCwgcnNlc3Npb25zKTtcclxufVxyXG4iXX0=