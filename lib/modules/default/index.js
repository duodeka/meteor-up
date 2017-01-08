'use strict';

require('babel-polyfill');
require('source-map-support/register');

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deploy = deploy;
exports.help = help;
exports.init = init;
exports.logs = logs;
exports.reconfig = reconfig;
exports.restart = restart;
exports.setup = setup;
exports.start = start;
exports.stop = stop;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _meteor = require('../meteor/');

var meteor = _interopRequireWildcard(_meteor);

var _mongo = require('../mongo/');

var mongo = _interopRequireWildcard(_mongo);

var _docker = require('../docker/');

var docker = _interopRequireWildcard(_docker);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('mup:module:default');

_shelljs2.default.config.silent = true;

function deploy(api) {
  log('exec => mup deploy');
  return meteor.deploy(api);
}

function help(api) {
  log('exec => mup help');
}
function init() /* api */{
  log('exec => mup init');

  // TODO check if mup.js or settings.json files exists
  var mupJs = _path2.default.resolve(__dirname, 'template/mup.js.sample');
  var settinsJson = _path2.default.resolve(__dirname, 'template/settings.json');
  var mupJsDst = _path2.default.resolve(process.cwd(), 'mup.js');
  var settingsJsonDst = _path2.default.resolve(process.cwd(), 'settings.json');

  _shelljs2.default.cp(mupJs, mupJsDst);
  _shelljs2.default.cp(settinsJson, settingsJsonDst);
}

function logs(api) {
  log('exec => mup logs');
  return meteor.logs(api);
}

function reconfig(api) {
  log('exec => mup reconfig');
  return meteor.envconfig(api).then(function () {
    return meteor.start(api);
  });
}

function restart(api) {
  log('exec => mup restart');
  return meteor.stop(api).then(function () {
    return meteor.start(api);
  });
}

function setup(api) {
  log('exec => mup setup');
  var config = api.getConfig();
  return docker.setup(api).then(function () {
    if (config.mongo) {
      return Promise.all([meteor.setup(api), mongo.setup(api)]).then(function () {
        return mongo.start(api);
      });
    }
    return meteor.setup(api);
  });
}

function start(api) {
  log('exec => mup start');
  return meteor.start(api);
}

function stop(api) {
  log('exec => mup stop');
  return meteor.stop(api);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImRlcGxveSIsImhlbHAiLCJpbml0IiwibG9ncyIsInJlY29uZmlnIiwicmVzdGFydCIsInNldHVwIiwic3RhcnQiLCJzdG9wIiwibWV0ZW9yIiwibW9uZ28iLCJkb2NrZXIiLCJsb2ciLCJjb25maWciLCJzaWxlbnQiLCJhcGkiLCJtdXBKcyIsInJlc29sdmUiLCJfX2Rpcm5hbWUiLCJzZXR0aW5zSnNvbiIsIm11cEpzRHN0IiwicHJvY2VzcyIsImN3ZCIsInNldHRpbmdzSnNvbkRzdCIsImNwIiwiZW52Y29uZmlnIiwidGhlbiIsImdldENvbmZpZyIsIlByb21pc2UiLCJhbGwiXSwibWFwcGluZ3MiOiI7Ozs7O1FBVWdCQSxNLEdBQUFBLE07UUFLQUMsSSxHQUFBQSxJO1FBR0FDLEksR0FBQUEsSTtRQWFBQyxJLEdBQUFBLEk7UUFLQUMsUSxHQUFBQSxRO1FBTUFDLE8sR0FBQUEsTztRQU1BQyxLLEdBQUFBLEs7UUFnQkFDLEssR0FBQUEsSztRQUtBQyxJLEdBQUFBLEk7O0FBckVoQjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7SUFBWUMsTTs7QUFDWjs7SUFBWUMsSzs7QUFDWjs7SUFBWUMsTTs7Ozs7O0FBQ1osSUFBTUMsTUFBTSxxQkFBTSxvQkFBTixDQUFaOztBQUVBLGtCQUFHQyxNQUFILENBQVVDLE1BQVYsR0FBbUIsSUFBbkI7O0FBRU8sU0FBU2QsTUFBVCxDQUFnQmUsR0FBaEIsRUFBcUI7QUFDMUJILE1BQUksb0JBQUo7QUFDQSxTQUFPSCxPQUFPVCxNQUFQLENBQWNlLEdBQWQsQ0FBUDtBQUNEOztBQUVNLFNBQVNkLElBQVQsQ0FBY2MsR0FBZCxFQUFtQjtBQUN4QkgsTUFBSSxrQkFBSjtBQUNEO0FBQ00sU0FBU1YsSUFBVCxHQUFjLFNBQVc7QUFDOUJVLE1BQUksa0JBQUo7O0FBRUE7QUFDQSxNQUFNSSxRQUFRLGVBQUtDLE9BQUwsQ0FBYUMsU0FBYixFQUF3Qix3QkFBeEIsQ0FBZDtBQUNBLE1BQU1DLGNBQWMsZUFBS0YsT0FBTCxDQUFhQyxTQUFiLEVBQXdCLHdCQUF4QixDQUFwQjtBQUNBLE1BQU1FLFdBQVcsZUFBS0gsT0FBTCxDQUFhSSxRQUFRQyxHQUFSLEVBQWIsRUFBNEIsUUFBNUIsQ0FBakI7QUFDQSxNQUFNQyxrQkFBa0IsZUFBS04sT0FBTCxDQUFhSSxRQUFRQyxHQUFSLEVBQWIsRUFBNEIsZUFBNUIsQ0FBeEI7O0FBRUEsb0JBQUdFLEVBQUgsQ0FBTVIsS0FBTixFQUFhSSxRQUFiO0FBQ0Esb0JBQUdJLEVBQUgsQ0FBTUwsV0FBTixFQUFtQkksZUFBbkI7QUFDRDs7QUFFTSxTQUFTcEIsSUFBVCxDQUFjWSxHQUFkLEVBQW1CO0FBQ3hCSCxNQUFJLGtCQUFKO0FBQ0EsU0FBT0gsT0FBT04sSUFBUCxDQUFZWSxHQUFaLENBQVA7QUFDRDs7QUFFTSxTQUFTWCxRQUFULENBQWtCVyxHQUFsQixFQUF1QjtBQUM1QkgsTUFBSSxzQkFBSjtBQUNBLFNBQU9ILE9BQU9nQixTQUFQLENBQWlCVixHQUFqQixFQUNKVyxJQURJLENBQ0M7QUFBQSxXQUFNakIsT0FBT0YsS0FBUCxDQUFhUSxHQUFiLENBQU47QUFBQSxHQURELENBQVA7QUFFRDs7QUFFTSxTQUFTVixPQUFULENBQWlCVSxHQUFqQixFQUFzQjtBQUMzQkgsTUFBSSxxQkFBSjtBQUNBLFNBQU9ILE9BQU9ELElBQVAsQ0FBWU8sR0FBWixFQUNKVyxJQURJLENBQ0M7QUFBQSxXQUFNakIsT0FBT0YsS0FBUCxDQUFhUSxHQUFiLENBQU47QUFBQSxHQURELENBQVA7QUFFRDs7QUFFTSxTQUFTVCxLQUFULENBQWVTLEdBQWYsRUFBb0I7QUFDekJILE1BQUksbUJBQUo7QUFDQSxNQUFNQyxTQUFTRSxJQUFJWSxTQUFKLEVBQWY7QUFDQSxTQUFPaEIsT0FBT0wsS0FBUCxDQUFhUyxHQUFiLEVBQ0pXLElBREksQ0FDQyxZQUFNO0FBQ1YsUUFBSWIsT0FBT0gsS0FBWCxFQUFrQjtBQUNoQixhQUFPa0IsUUFBUUMsR0FBUixDQUFZLENBQ2pCcEIsT0FBT0gsS0FBUCxDQUFhUyxHQUFiLENBRGlCLEVBRWpCTCxNQUFNSixLQUFOLENBQVlTLEdBQVosQ0FGaUIsQ0FBWixFQUlKVyxJQUpJLENBSUM7QUFBQSxlQUFPaEIsTUFBTUgsS0FBTixDQUFZUSxHQUFaLENBQVA7QUFBQSxPQUpELENBQVA7QUFLRDtBQUNELFdBQU9OLE9BQU9ILEtBQVAsQ0FBYVMsR0FBYixDQUFQO0FBQ0QsR0FWSSxDQUFQO0FBV0Q7O0FBRU0sU0FBU1IsS0FBVCxDQUFlUSxHQUFmLEVBQW9CO0FBQ3pCSCxNQUFJLG1CQUFKO0FBQ0EsU0FBT0gsT0FBT0YsS0FBUCxDQUFhUSxHQUFiLENBQVA7QUFDRDs7QUFFTSxTQUFTUCxJQUFULENBQWNPLEdBQWQsRUFBbUI7QUFDeEJILE1BQUksa0JBQUo7QUFDQSxTQUFPSCxPQUFPRCxJQUFQLENBQVlPLEdBQVosQ0FBUDtBQUNEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlUm9vdCI6IkM6L3dhbXA2NC93d3cvbWV0ZW9yLXVwL3NyYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xyXG5pbXBvcnQgc2ggZnJvbSAnc2hlbGxqcyc7XHJcbmltcG9ydCAqIGFzIG1ldGVvciBmcm9tICcuLi9tZXRlb3IvJztcclxuaW1wb3J0ICogYXMgbW9uZ28gZnJvbSAnLi4vbW9uZ28vJztcclxuaW1wb3J0ICogYXMgZG9ja2VyIGZyb20gJy4uL2RvY2tlci8nO1xyXG5jb25zdCBsb2cgPSBkZWJ1ZygnbXVwOm1vZHVsZTpkZWZhdWx0Jyk7XHJcblxyXG5zaC5jb25maWcuc2lsZW50ID0gdHJ1ZTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkZXBsb3koYXBpKSB7XHJcbiAgbG9nKCdleGVjID0+IG11cCBkZXBsb3knKTtcclxuICByZXR1cm4gbWV0ZW9yLmRlcGxveShhcGkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaGVscChhcGkpIHtcclxuICBsb2coJ2V4ZWMgPT4gbXVwIGhlbHAnKTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgvKiBhcGkgKi8pIHtcclxuICBsb2coJ2V4ZWMgPT4gbXVwIGluaXQnKTtcclxuXHJcbiAgLy8gVE9ETyBjaGVjayBpZiBtdXAuanMgb3Igc2V0dGluZ3MuanNvbiBmaWxlcyBleGlzdHNcclxuICBjb25zdCBtdXBKcyA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICd0ZW1wbGF0ZS9tdXAuanMuc2FtcGxlJyk7XHJcbiAgY29uc3Qgc2V0dGluc0pzb24gPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAndGVtcGxhdGUvc2V0dGluZ3MuanNvbicpO1xyXG4gIGNvbnN0IG11cEpzRHN0ID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICdtdXAuanMnKTtcclxuICBjb25zdCBzZXR0aW5nc0pzb25Ec3QgPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJ3NldHRpbmdzLmpzb24nKTtcclxuXHJcbiAgc2guY3AobXVwSnMsIG11cEpzRHN0KTtcclxuICBzaC5jcChzZXR0aW5zSnNvbiwgc2V0dGluZ3NKc29uRHN0KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvZ3MoYXBpKSB7XHJcbiAgbG9nKCdleGVjID0+IG11cCBsb2dzJyk7XHJcbiAgcmV0dXJuIG1ldGVvci5sb2dzKGFwaSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWNvbmZpZyhhcGkpIHtcclxuICBsb2coJ2V4ZWMgPT4gbXVwIHJlY29uZmlnJyk7XHJcbiAgcmV0dXJuIG1ldGVvci5lbnZjb25maWcoYXBpKVxyXG4gICAgLnRoZW4oKCkgPT4gbWV0ZW9yLnN0YXJ0KGFwaSkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVzdGFydChhcGkpIHtcclxuICBsb2coJ2V4ZWMgPT4gbXVwIHJlc3RhcnQnKTtcclxuICByZXR1cm4gbWV0ZW9yLnN0b3AoYXBpKVxyXG4gICAgLnRoZW4oKCkgPT4gbWV0ZW9yLnN0YXJ0KGFwaSkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0dXAoYXBpKSB7XHJcbiAgbG9nKCdleGVjID0+IG11cCBzZXR1cCcpO1xyXG4gIGNvbnN0IGNvbmZpZyA9IGFwaS5nZXRDb25maWcoKTtcclxuICByZXR1cm4gZG9ja2VyLnNldHVwKGFwaSlcclxuICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgaWYgKGNvbmZpZy5tb25nbykge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgICBtZXRlb3Iuc2V0dXAoYXBpKSxcclxuICAgICAgICAgIG1vbmdvLnNldHVwKGFwaSlcclxuICAgICAgICBdKVxyXG4gICAgICAgICAgLnRoZW4oKCkgPT4gKG1vbmdvLnN0YXJ0KGFwaSkpKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbWV0ZW9yLnNldHVwKGFwaSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0KGFwaSkge1xyXG4gIGxvZygnZXhlYyA9PiBtdXAgc3RhcnQnKTtcclxuICByZXR1cm4gbWV0ZW9yLnN0YXJ0KGFwaSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzdG9wKGFwaSkge1xyXG4gIGxvZygnZXhlYyA9PiBtdXAgc3RvcCcpO1xyXG4gIHJldHVybiBtZXRlb3Iuc3RvcChhcGkpO1xyXG59XHJcbiJdfQ==