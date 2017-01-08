'use strict';

require('babel-polyfill');
require('source-map-support/register');

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runTaskList = runTaskList;
exports.getDockerLogs = getDockerLogs;
exports.runSSHCommand = runSSHCommand;
exports.countOccurences = countOccurences;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _underscore = require('underscore');

var _ = _interopRequireWildcard(_underscore);

var _bluebird = require('bluebird');

var _ssh = require('ssh2');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function runTaskList(list, sessions, opts) {
  return new Promise(function (resolve, reject) {
    list.run(sessions, opts, function (summaryMap) {
      for (var host in summaryMap) {
        var summary = summaryMap[host];
        if (summary.error) {
          reject(summary.error);
          return;
        }
      }

      resolve();
    });
  });
}

function getDockerLogs(name, sessions, args) {
  var command = 'sudo docker ' + args.join(' ') + ' ' + name;

  var promises = _.map(sessions, function (session) {
    var host = '[' + session._host + ']';
    var options = {
      onStdout: function onStdout(data) {
        process.stdout.write(host + data);
      },
      onStderr: function onStderr(data) {
        process.stdout.write(host + data);
      }
    };
    return (0, _bluebird.promisify)(session.execute.bind(session))(command, options);
  });
  return Promise.all(promises);
}

// Maybe we should create a new npm package
// for this one. Something like 'sshelljs'.
function runSSHCommand(info, command) {
  return new Promise(function (resolve, reject) {
    var conn = new _ssh.Client();

    // TODO better if we can extract SSH agent info from original session
    var sshAgent = process.env.SSH_AUTH_SOCK;
    var ssh = {
      host: info.host,
      port: info.opts && info.opts.port || 22,
      username: info.username
    };

    if (info.pem) {
      ssh.privateKey = _fs2.default.readFileSync(_path2.default.resolve(info.pem), 'utf8');
    } else if (info.password) {
      ssh.password = info.password;
    } else if (sshAgent && _fs2.default.existsSync(sshAgent)) {
      ssh.agent = sshAgent;
    }
    conn.connect(ssh);

    conn.once('error', function (err) {
      if (err) {
        reject(err);
      }
    });

    // TODO handle error events
    conn.once('ready', function () {
      conn.exec(command, function (err, stream) {
        if (err) {
          conn.end();
          reject(err);
          return;
        }

        var output = '';

        stream.on('data', function (data) {
          output += data;
        });

        stream.once('close', function (code) {
          conn.end();
          resolve({ code: code, output: output });
        });
      });
    });
  });
}

function countOccurences(needle, haystack) {
  var regex = new RegExp(needle, 'g');
  var match = haystack.match(regex) || [];
  return match.length;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIl0sIm5hbWVzIjpbInJ1blRhc2tMaXN0IiwiZ2V0RG9ja2VyTG9ncyIsInJ1blNTSENvbW1hbmQiLCJjb3VudE9jY3VyZW5jZXMiLCJfIiwibGlzdCIsInNlc3Npb25zIiwib3B0cyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicnVuIiwiaG9zdCIsInN1bW1hcnlNYXAiLCJzdW1tYXJ5IiwiZXJyb3IiLCJuYW1lIiwiYXJncyIsImNvbW1hbmQiLCJqb2luIiwicHJvbWlzZXMiLCJtYXAiLCJzZXNzaW9uIiwiX2hvc3QiLCJvcHRpb25zIiwib25TdGRvdXQiLCJwcm9jZXNzIiwic3Rkb3V0Iiwid3JpdGUiLCJkYXRhIiwib25TdGRlcnIiLCJleGVjdXRlIiwiYmluZCIsImFsbCIsImluZm8iLCJjb25uIiwic3NoQWdlbnQiLCJlbnYiLCJTU0hfQVVUSF9TT0NLIiwic3NoIiwicG9ydCIsInVzZXJuYW1lIiwicGVtIiwicHJpdmF0ZUtleSIsInJlYWRGaWxlU3luYyIsInBhc3N3b3JkIiwiZXhpc3RzU3luYyIsImFnZW50IiwiY29ubmVjdCIsIm9uY2UiLCJlcnIiLCJleGVjIiwic3RyZWFtIiwiZW5kIiwib3V0cHV0Iiwib24iLCJjb2RlIiwibmVlZGxlIiwiaGF5c3RhY2siLCJyZWdleCIsIlJlZ0V4cCIsIm1hdGNoIiwibGVuZ3RoIl0sIm1hcHBpbmdzIjoiOzs7OztRQU1nQkEsVyxHQUFBQSxXO1FBZ0JBQyxhLEdBQUFBLGE7UUFvQkFDLGEsR0FBQUEsYTtRQW1EQUMsZSxHQUFBQSxlOztBQTdGaEI7Ozs7QUFDQTs7SUFBWUMsQzs7QUFDWjs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFTyxTQUFTSixXQUFULENBQXFCSyxJQUFyQixFQUEyQkMsUUFBM0IsRUFBcUNDLElBQXJDLEVBQTJDO0FBQ2hELFNBQU8sSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0Q0wsU0FBS00sR0FBTCxDQUFTTCxR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SUFBVjtBQUNELFNBRkQ7O0FBSUF1QixlQUFPSCxJQUFQLENBQVksT0FBWixFQUFxQixVQUFVTyxJQUFWLEVBQWdCO0FBQ25DckIsZUFBS2tCLEdBQUw7QUFDQTVDLGtCQUFRLEVBQUMrQyxVQUFELEVBQU9GLGNBQVAsRUFBUjtBQUNELFNBSEQ7QUFJRCxPQWpCRDtBQWtCRCxLQW5CRDtBQW9CRCxHQS9DTSxDQUFQO0FBZ0REOztBQUVNLFNBQVNuRCxlQUFULENBQXlCc0QsTUFBekIsRUFBaUNDLFFBQWpDLEVBQTJDO0FBQ2hELE1BQU1DLFFBQVEsSUFBSUMsTUFBSixDQUFXSCxNQUFYLEVBQW1CLEdBQW5CLENBQWQ7QUFDQSxNQUFNSSxRQUFRSCxTQUFTRyxLQUFULENBQWVGLEtBQWYsS0FBeUIsRUFBdkM7QUFDQSxTQUFPRSxNQUFNQyxNQUFiO0FBQ0QiLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiQzovd2FtcDY0L3d3dy9tZXRlb3ItdXAvc3JjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcclxuaW1wb3J0ICogYXMgXyBmcm9tICd1bmRlcnNjb3JlJztcclxuaW1wb3J0IHtwcm9taXNpZnl9IGZyb20gJ2JsdWViaXJkJztcclxuaW1wb3J0IHtDbGllbnR9IGZyb20gJ3NzaDInO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBydW5UYXNrTGlzdChsaXN0LCBzZXNzaW9ucywgb3B0cykge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICBsaXN0LnJ1bihzZXNzaW9ucywgb3B0cywgc3VtbWFyeU1hcCA9PiB7XHJcbiAgICAgIGZvciAodmFyIGhvc3QgaW4gc3VtbWFyeU1hcCkge1xyXG4gICAgICAgIGNvbnN0IHN1bW1hcnkgPSBzdW1tYXJ5TWFwW2hvc3RdO1xyXG4gICAgICAgIGlmIChzdW1tYXJ5LmVycm9yKSB7XHJcbiAgICAgICAgICByZWplY3Qoc3VtbWFyeS5lcnJvcik7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXNvbHZlKCk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldERvY2tlckxvZ3MobmFtZSwgc2Vzc2lvbnMsIGFyZ3MpIHtcclxuICBjb25zdCBjb21tYW5kID0gJ3N1ZG8gZG9ja2VyICcgKyBhcmdzLmpvaW4oJyAnKSArICcgJyArIG5hbWU7XHJcblxyXG4gIHZhciBwcm9taXNlcyA9IF8ubWFwKHNlc3Npb25zLCBzZXNzaW9uID0+IHtcclxuICAgIHZhciBob3N0ID0gJ1snICsgc2Vzc2lvbi5faG9zdCArICddJztcclxuICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICBvblN0ZG91dDogZGF0YSA9PiB7XHJcbiAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoaG9zdCArIGRhdGEpO1xyXG4gICAgICB9LFxyXG4gICAgICBvblN0ZGVycjogZGF0YSA9PiB7XHJcbiAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoaG9zdCArIGRhdGEpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHByb21pc2lmeShzZXNzaW9uLmV4ZWN1dGUuYmluZChzZXNzaW9uKSkoY29tbWFuZCwgb3B0aW9ucyk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcclxufVxyXG5cclxuLy8gTWF5YmUgd2Ugc2hvdWxkIGNyZWF0ZSBhIG5ldyBucG0gcGFja2FnZVxyXG4vLyBmb3IgdGhpcyBvbmUuIFNvbWV0aGluZyBsaWtlICdzc2hlbGxqcycuXHJcbmV4cG9ydCBmdW5jdGlvbiBydW5TU0hDb21tYW5kKGluZm8sIGNvbW1hbmQpIHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgY29uc3QgY29ubiA9IG5ldyBDbGllbnQoKTtcclxuXHJcbiAgICAvLyBUT0RPIGJldHRlciBpZiB3ZSBjYW4gZXh0cmFjdCBTU0ggYWdlbnQgaW5mbyBmcm9tIG9yaWdpbmFsIHNlc3Npb25cclxuICAgIHZhciBzc2hBZ2VudCA9IHByb2Nlc3MuZW52LlNTSF9BVVRIX1NPQ0s7XHJcbiAgICB2YXIgc3NoID0ge1xyXG4gICAgICBob3N0OiBpbmZvLmhvc3QsXHJcbiAgICAgIHBvcnQ6IChpbmZvLm9wdHMgJiYgaW5mby5vcHRzLnBvcnQgfHwgMjIpLFxyXG4gICAgICB1c2VybmFtZTogaW5mby51c2VybmFtZVxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoaW5mby5wZW0pIHtcclxuICAgICAgc3NoLnByaXZhdGVLZXkgPSBmcy5yZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKGluZm8ucGVtKSwgJ3V0ZjgnKTtcclxuICAgIH0gZWxzZSBpZiAoaW5mby5wYXNzd29yZCkge1xyXG4gICAgICBzc2gucGFzc3dvcmQgPSBpbmZvLnBhc3N3b3JkO1xyXG4gICAgfSBlbHNlIGlmIChzc2hBZ2VudCAmJiBmcy5leGlzdHNTeW5jKHNzaEFnZW50KSkge1xyXG4gICAgICBzc2guYWdlbnQgPSBzc2hBZ2VudDtcclxuICAgIH1cclxuICAgIGNvbm4uY29ubmVjdChzc2gpO1xyXG5cclxuICAgIGNvbm4ub25jZSgnZXJyb3InLCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gVE9ETyBoYW5kbGUgZXJyb3IgZXZlbnRzXHJcbiAgICBjb25uLm9uY2UoJ3JlYWR5JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBjb25uLmV4ZWMoY29tbWFuZCwgZnVuY3Rpb24gKGVyciwgc3RyZWFtKSB7XHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgY29ubi5lbmQoKTtcclxuICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG91dHB1dCA9ICcnO1xyXG5cclxuICAgICAgICBzdHJlYW0ub24oJ2RhdGEnLCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgb3V0cHV0ICs9IGRhdGE7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHN0cmVhbS5vbmNlKCdjbG9zZScsIGZ1bmN0aW9uIChjb2RlKSB7XHJcbiAgICAgICAgICBjb25uLmVuZCgpO1xyXG4gICAgICAgICAgcmVzb2x2ZSh7Y29kZSwgb3V0cHV0fSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb3VudE9jY3VyZW5jZXMobmVlZGxlLCBoYXlzdGFjaykge1xyXG4gIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChuZWVkbGUsICdnJyk7XHJcbiAgY29uc3QgbWF0Y2ggPSBoYXlzdGFjay5tYXRjaChyZWdleCkgfHwgW107XHJcbiAgcmV0dXJuIG1hdGNoLmxlbmd0aDtcclxufVxyXG4iXX0=