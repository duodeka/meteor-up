'use strict';

require('babel-polyfill');
require('source-map-support/register');

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dump = dump;
exports.help = help;
exports.logs = logs;
exports.setup = setup;
exports.start = start;
exports.stop = stop;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _nodemiral = require('nodemiral');

var _nodemiral2 = _interopRequireDefault(_nodemiral);

var _utils = require('../utils');

var _docker = require('../docker/');

var docker = _interopRequireWildcard(_docker);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('mup:module:mongo');

function dump() /* api */{
  log('exec => mup mongo dump');
}

function help() /* api */{
  log('exec => mup mongo help');
}

function logs(api) {
  log('exec => mup mongo logs');

  var args = api.getArgs();
  var sessions = api.getSessions(['mongo']);
  return (0, _utils.getDockerLogs)('mongodb', sessions, args);
}

function setup(api) {
  log('exec => mup mongo setup');

  var mongoSessions = api.getSessions(['mongo']);
  var meteorSessions = api.getSessions(['meteor']);

  if (meteorSessions.length !== 1) {
    console.log('To use mup inbuilt mongodb setup, you should have only one meteor app server. To have more app servers, use an external mongodb setup');
    return;
  } else if (mongoSessions[0]._host !== meteorSessions[0]._host) {
    console.log('To use mup inbuilt mongodb setup, you should have both meteor app and mongodb on the same server');
    return;
  }

  var list = _nodemiral2.default.taskList('Setup Mongo');

  list.executeScript('setup environment', {
    script: _path2.default.resolve(__dirname, 'assets/mongo-setup.sh')
  });

  list.copy('copying mongodb.conf', {
    src: _path2.default.resolve(__dirname, 'assets/mongodb.conf'),
    dest: '/opt/mongodb/mongodb.conf'
  });

  var sessions = api.getSessions(['mongo']);

  return (0, _utils.runTaskList)(list, sessions);
}

function start(api) {
  log('exec => mup mongo start');

  var mongoSessions = api.getSessions(['mongo']);
  var meteorSessions = api.getSessions(['meteor']);

  if (meteorSessions.length !== 1 || mongoSessions[0]._host !== meteorSessions[0]._host) {
    log('Skipping mongodb start. Incompatible config');
    return;
  }

  var list = _nodemiral2.default.taskList('Start Mongo');

  list.executeScript('start mongo', {
    script: _path2.default.resolve(__dirname, 'assets/mongo-start.sh')
  });

  var sessions = api.getSessions(['mongo']);
  return (0, _utils.runTaskList)(list, sessions);
}

function stop(api) {
  log('exec => mup mongo stop');
  var list = _nodemiral2.default.taskList('Stop Mongo');

  list.executeScript('stop mongo', {
    script: _path2.default.resolve(__dirname, 'assets/mongo-stop.sh')
  });

  var sessions = api.getSessions(['mongo']);
  return (0, _utils.runTaskList)(list, sessions);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImR1bXAiLCJoZWxwIiwibG9ncyIsInNldHVwIiwic3RhcnQiLCJzdG9wIiwiZG9ja2VyIiwibG9nIiwiYXBpIiwiYXJncyIsImdldEFyZ3MiLCJzZXNzaW9ucyIsImdldFNlc3Npb25zIiwibW9uZ29TZXNzaW9ucyIsIm1ldGVvclNlc3Npb25zIiwibGVuZ3RoIiwiY29uc29sZSIsIl9ob3N0IiwibGlzdCIsInRhc2tMaXN0IiwiZXhlY3V0ZVNjcmlwdCIsInNjcmlwdCIsInJlc29sdmUiLCJfX2Rpcm5hbWUiLCJjb3B5Iiwic3JjIiwiZGVzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFPZ0JBLEksR0FBQUEsSTtRQUlBQyxJLEdBQUFBLEk7UUFJQUMsSSxHQUFBQSxJO1FBUUFDLEssR0FBQUEsSztRQThCQUMsSyxHQUFBQSxLO1FBcUJBQyxJLEdBQUFBLEk7O0FBMUVoQjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7SUFBWUMsTTs7Ozs7O0FBQ1osSUFBTUMsTUFBTSxxQkFBTSxrQkFBTixDQUFaOztBQUVPLFNBQVNQLElBQVQsR0FBYyxTQUFXO0FBQzlCTyxNQUFJLHdCQUFKO0FBQ0Q7O0FBRU0sU0FBU04sSUFBVCxHQUFjLFNBQVc7QUFDOUJNLE1BQUksd0JBQUo7QUFDRDs7QUFFTSxTQUFTTCxJQUFULENBQWNNLEdBQWQsRUFBbUI7QUFDeEJELE1BQUksd0JBQUo7O0FBRUEsTUFBTUUsT0FBT0QsSUFBSUUsT0FBSixFQUFiO0FBQ0EsTUFBTUMsV0FBV0gsSUFBSUksV0FBSixDQUFnQixDQUFFLE9BQUYsQ0FBaEIsQ0FBakI7QUFDQSxTQUFPLDBCQUFjLFNBQWQsRUFBeUJELFFBQXpCLEVBQW1DRixJQUFuQyxDQUFQO0FBQ0Q7O0FBRU0sU0FBU04sS0FBVCxDQUFlSyxHQUFmLEVBQW9CO0FBQ3pCRCxNQUFJLHlCQUFKOztBQUVBLE1BQU1NLGdCQUFnQkwsSUFBSUksV0FBSixDQUFnQixDQUFFLE9BQUYsQ0FBaEIsQ0FBdEI7QUFDQSxNQUFNRSxpQkFBaUJOLElBQUlJLFdBQUosQ0FBZ0IsQ0FBRSxRQUFGLENBQWhCLENBQXZCOztBQUVBLE1BQUtFLGVBQWVDLE1BQWYsS0FBMEIsQ0FBL0IsRUFBa0M7QUFDaENDLFlBQVFULEdBQVIsQ0FBWSx1SUFBWjtBQUNBO0FBQ0QsR0FIRCxNQUdPLElBQUtNLGNBQWMsQ0FBZCxFQUFpQkksS0FBakIsS0FBMkJILGVBQWUsQ0FBZixFQUFrQkcsS0FBbEQsRUFBMEQ7QUFDL0RELFlBQVFULEdBQVIsQ0FBWSxrR0FBWjtBQUNBO0FBQ0Q7O0FBRUQsTUFBTVcsT0FBTyxvQkFBVUMsUUFBVixDQUFtQixhQUFuQixDQUFiOztBQUVBRCxPQUFLRSxhQUFMLENBQW1CLG1CQUFuQixFQUF3QztBQUN0Q0MsWUFBUSxlQUFLQyxPQUFMLENBQWFDLFNBQWIsRUFBd0IsdUJBQXhCO0FBRDhCLEdBQXhDOztBQUlBTCxPQUFLTSxJQUFMLENBQVUsc0JBQVYsRUFBa0M7QUFDaENDLFNBQUssZUFBS0gsT0FBTCxDQUFhQyxTQUFiLEVBQXdCLHFCQUF4QixDQUQyQjtBQUVoQ0csVUFBTTtBQUYwQixHQUFsQzs7QUFLQSxNQUFNZixXQUFXSCxJQUFJSSxXQUFKLENBQWdCLENBQUUsT0FBRixDQUFoQixDQUFqQjs7QUFFQSxTQUFPLHdCQUFZTSxJQUFaLEVBQWtCUCxRQUFsQixDQUFQO0FBQ0Q7O0FBRU0sU0FBU1AsS0FBVCxDQUFlSSxHQUFmLEVBQW9CO0FBQ3pCRCxNQUFJLHlCQUFKOztBQUVBLE1BQU1NLGdCQUFnQkwsSUFBSUksV0FBSixDQUFnQixDQUFFLE9BQUYsQ0FBaEIsQ0FBdEI7QUFDQSxNQUFNRSxpQkFBaUJOLElBQUlJLFdBQUosQ0FBZ0IsQ0FBRSxRQUFGLENBQWhCLENBQXZCOztBQUVBLE1BQUtFLGVBQWVDLE1BQWYsS0FBMEIsQ0FBMUIsSUFBK0JGLGNBQWMsQ0FBZCxFQUFpQkksS0FBakIsS0FBMkJILGVBQWUsQ0FBZixFQUFrQkcsS0FBakYsRUFBd0Y7QUFDdEZWLFFBQUksNkNBQUo7QUFDQTtBQUNEOztBQUVELE1BQU1XLE9BQU8sb0JBQVVDLFFBQVYsQ0FBbUIsYUFBbkIsQ0FBYjs7QUFFQUQsT0FBS0UsYUFBTCxDQUFtQixhQUFuQixFQUFrQztBQUNoQ0MsWUFBUSxlQUFLQyxPQUFMLENBQWFDLFNBQWIsRUFBd0IsdUJBQXhCO0FBRHdCLEdBQWxDOztBQUlBLE1BQU1aLFdBQVdILElBQUlJLFdBQUosQ0FBZ0IsQ0FBRSxPQUFGLENBQWhCLENBQWpCO0FBQ0EsU0FBTyx3QkFBWU0sSUFBWixFQUFrQlAsUUFBbEIsQ0FBUDtBQUNEOztBQUVNLFNBQVNOLElBQVQsQ0FBY0csR0FBZCxFQUFtQjtBQUN4QkQsTUFBSSx3QkFBSjtBQUNBLE1BQU1XLE9BQU8sb0JBQVVDLFFBQVYsQ0FBbUIsWUFBbkIsQ0FBYjs7QUFFQUQsT0FBS0UsYUFBTCxDQUFtQixZQUFuQixFQUFpQztBQUMvQkMsWUFBUSxlQUFLQyxPQUFMLENBQWFDLFNBQWIsRUFBd0Isc0JBQXhCO0FBRHVCLEdBQWpDOztBQUlBLE1BQU1aLFdBQVdILElBQUlJLFdBQUosQ0FBZ0IsQ0FBRSxPQUFGLENBQWhCLENBQWpCO0FBQ0EsU0FBTyx3QkFBWU0sSUFBWixFQUFrQlAsUUFBbEIsQ0FBUDtBQUNEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlUm9vdCI6IkM6L3dhbXA2NC93d3cvbWV0ZW9yLXVwL3NyYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xyXG5pbXBvcnQgbm9kZW1pcmFsIGZyb20gJ25vZGVtaXJhbCc7XHJcbmltcG9ydCB7cnVuVGFza0xpc3QsIGdldERvY2tlckxvZ3N9IGZyb20gJy4uL3V0aWxzJztcclxuaW1wb3J0ICogYXMgZG9ja2VyIGZyb20gJy4uL2RvY2tlci8nO1xyXG5jb25zdCBsb2cgPSBkZWJ1ZygnbXVwOm1vZHVsZTptb25nbycpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGR1bXAoLyogYXBpICovKSB7XHJcbiAgbG9nKCdleGVjID0+IG11cCBtb25nbyBkdW1wJyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBoZWxwKC8qIGFwaSAqLykge1xyXG4gIGxvZygnZXhlYyA9PiBtdXAgbW9uZ28gaGVscCcpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbG9ncyhhcGkpIHtcclxuICBsb2coJ2V4ZWMgPT4gbXVwIG1vbmdvIGxvZ3MnKTtcclxuXHJcbiAgY29uc3QgYXJncyA9IGFwaS5nZXRBcmdzKCk7XHJcbiAgY29uc3Qgc2Vzc2lvbnMgPSBhcGkuZ2V0U2Vzc2lvbnMoWyAnbW9uZ28nIF0pO1xyXG4gIHJldHVybiBnZXREb2NrZXJMb2dzKCdtb25nb2RiJywgc2Vzc2lvbnMsIGFyZ3MpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0dXAoYXBpKSB7XHJcbiAgbG9nKCdleGVjID0+IG11cCBtb25nbyBzZXR1cCcpO1xyXG5cclxuICBjb25zdCBtb25nb1Nlc3Npb25zID0gYXBpLmdldFNlc3Npb25zKFsgJ21vbmdvJyBdKTtcclxuICBjb25zdCBtZXRlb3JTZXNzaW9ucyA9IGFwaS5nZXRTZXNzaW9ucyhbICdtZXRlb3InIF0pO1xyXG5cclxuICBpZiAoIG1ldGVvclNlc3Npb25zLmxlbmd0aCAhPT0gMSkge1xyXG4gICAgY29uc29sZS5sb2coJ1RvIHVzZSBtdXAgaW5idWlsdCBtb25nb2RiIHNldHVwLCB5b3Ugc2hvdWxkIGhhdmUgb25seSBvbmUgbWV0ZW9yIGFwcCBzZXJ2ZXIuIFRvIGhhdmUgbW9yZSBhcHAgc2VydmVycywgdXNlIGFuIGV4dGVybmFsIG1vbmdvZGIgc2V0dXAnKTtcclxuICAgIHJldHVybjtcclxuICB9IGVsc2UgaWYgKCBtb25nb1Nlc3Npb25zWzBdLl9ob3N0ICE9PSBtZXRlb3JTZXNzaW9uc1swXS5faG9zdCApIHtcclxuICAgIGNvbnNvbGUubG9nKCdUbyB1c2UgbXVwIGluYnVpbHQgbW9uZ29kYiBzZXR1cCwgeW91IHNob3VsZCBoYXZlIGJvdGggbWV0ZW9yIGFwcCBhbmQgbW9uZ29kYiBvbiB0aGUgc2FtZSBzZXJ2ZXInKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGNvbnN0IGxpc3QgPSBub2RlbWlyYWwudGFza0xpc3QoJ1NldHVwIE1vbmdvJyk7XHJcblxyXG4gIGxpc3QuZXhlY3V0ZVNjcmlwdCgnc2V0dXAgZW52aXJvbm1lbnQnLCB7XHJcbiAgICBzY3JpcHQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdhc3NldHMvbW9uZ28tc2V0dXAuc2gnKVxyXG4gIH0pO1xyXG5cclxuICBsaXN0LmNvcHkoJ2NvcHlpbmcgbW9uZ29kYi5jb25mJywge1xyXG4gICAgc3JjOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnYXNzZXRzL21vbmdvZGIuY29uZicpLFxyXG4gICAgZGVzdDogJy9vcHQvbW9uZ29kYi9tb25nb2RiLmNvbmYnXHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHNlc3Npb25zID0gYXBpLmdldFNlc3Npb25zKFsgJ21vbmdvJyBdKTtcclxuXHJcbiAgcmV0dXJuIHJ1blRhc2tMaXN0KGxpc3QsIHNlc3Npb25zKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0KGFwaSkge1xyXG4gIGxvZygnZXhlYyA9PiBtdXAgbW9uZ28gc3RhcnQnKTtcclxuXHJcbiAgY29uc3QgbW9uZ29TZXNzaW9ucyA9IGFwaS5nZXRTZXNzaW9ucyhbICdtb25nbycgXSk7XHJcbiAgY29uc3QgbWV0ZW9yU2Vzc2lvbnMgPSBhcGkuZ2V0U2Vzc2lvbnMoWyAnbWV0ZW9yJyBdKTtcclxuXHJcbiAgaWYgKCBtZXRlb3JTZXNzaW9ucy5sZW5ndGggIT09IDEgfHwgbW9uZ29TZXNzaW9uc1swXS5faG9zdCAhPT0gbWV0ZW9yU2Vzc2lvbnNbMF0uX2hvc3QpIHtcclxuICAgIGxvZygnU2tpcHBpbmcgbW9uZ29kYiBzdGFydC4gSW5jb21wYXRpYmxlIGNvbmZpZycpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgbGlzdCA9IG5vZGVtaXJhbC50YXNrTGlzdCgnU3RhcnQgTW9uZ28nKTtcclxuXHJcbiAgbGlzdC5leGVjdXRlU2NyaXB0KCdzdGFydCBtb25nbycsIHtcclxuICAgIHNjcmlwdDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2Fzc2V0cy9tb25nby1zdGFydC5zaCcpXHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHNlc3Npb25zID0gYXBpLmdldFNlc3Npb25zKFsgJ21vbmdvJyBdKTtcclxuICByZXR1cm4gcnVuVGFza0xpc3QobGlzdCwgc2Vzc2lvbnMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RvcChhcGkpIHtcclxuICBsb2coJ2V4ZWMgPT4gbXVwIG1vbmdvIHN0b3AnKTtcclxuICBjb25zdCBsaXN0ID0gbm9kZW1pcmFsLnRhc2tMaXN0KCdTdG9wIE1vbmdvJyk7XHJcblxyXG4gIGxpc3QuZXhlY3V0ZVNjcmlwdCgnc3RvcCBtb25nbycsIHtcclxuICAgIHNjcmlwdDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2Fzc2V0cy9tb25nby1zdG9wLnNoJylcclxuICB9KTtcclxuXHJcbiAgY29uc3Qgc2Vzc2lvbnMgPSBhcGkuZ2V0U2Vzc2lvbnMoWyAnbW9uZ28nIF0pO1xyXG4gIHJldHVybiBydW5UYXNrTGlzdChsaXN0LCBzZXNzaW9ucyk7XHJcbn1cclxuIl19