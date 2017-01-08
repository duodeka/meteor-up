'use strict';

require('babel-polyfill');
require('source-map-support/register');

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nodemiral = require('nodemiral');

var _nodemiral2 = _interopRequireDefault(_nodemiral);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MupAPI = function () {
  function MupAPI(base, args, configPath, settingsPath) {
    _classCallCheck(this, MupAPI);

    this.base = base;
    this.args = args;
    this.config = null;
    this.settings = null;
    this.sessions = null;
    this.configPath = configPath;
    this.settingsPath = settingsPath;
  }

  _createClass(MupAPI, [{
    key: 'getArgs',
    value: function getArgs() {
      return this.args;
    }
  }, {
    key: 'getBasePath',
    value: function getBasePath() {
      return this.base;
    }
  }, {
    key: 'getConfig',
    value: function getConfig() {
      if (!this.config) {
        var filePath = void 0;
        if (this.configPath) {
          filePath = _path2.default.resolve(this.configPath);
          this.base = _path2.default.dirname(this.configPath);
        } else {
          filePath = _path2.default.join(this.base, 'mup.js');
        }
        try {
          this.config = require(filePath);
        } catch (e) {
          if (e.code == 'MODULE_NOT_FOUND') {
            console.error('\'mup.js\' file not found. Run \'mup init\' first.');
          } else {
            console.error(e);
          }
          process.exit(1);
        }
      }

      return this.config;
    }
  }, {
    key: 'getSettings',
    value: function getSettings() {
      if (!this.settings) {
        var filePath = void 0;
        if (this.settingsPath) {
          filePath = _path2.default.resolve(this.settingsPath);
        } else {
          filePath = _path2.default.join(this.base, 'settings.json');
        }
        this.settings = require(filePath);
      }

      return this.settings;
    }
  }, {
    key: 'getSessions',
    value: function getSessions() {
      var modules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var sessions = this._pickSessions(modules);
      return Object.keys(sessions).map(function (name) {
        return sessions[name];
      });
    }
  }, {
    key: 'withSessions',
    value: function withSessions() {
      var modules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var api = Object.create(this);
      api.sessions = this._pickSessions(modules);
      return api;
    }
  }, {
    key: '_pickSessions',
    value: function _pickSessions() {
      var _this = this;

      var modules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (!this.sessions) {
        this._loadSessions();
      }

      var sessions = {};

      modules.forEach(function (moduleName) {
        var moduleConfig = _this.config[moduleName];
        if (!moduleConfig) {
          return;
        }

        for (var name in moduleConfig.servers) {
          if (!moduleConfig.servers.hasOwnProperty(name)) {
            continue;
          }

          if (_this.sessions[name]) {
            sessions[name] = _this.sessions[name];
          }
        }
      });

      return sessions;
    }
  }, {
    key: '_loadSessions',
    value: function _loadSessions() {
      var config = this.getConfig();
      this.sessions = {};

      // `mup.servers` contains login information for servers
      // Use this information to create nodemiral sessions.
      for (var name in config.servers) {
        if (!config.servers.hasOwnProperty(name)) {
          continue;
        }

        var info = config.servers[name];
        var auth = { username: info.username };
        var opts = { ssh: {} };

        var sshAgent = process.env.SSH_AUTH_SOCK;

        if (info.opts) {
          opts.ssh = info.opts;
        }

        if (info.pem) {
          auth.pem = _fs2.default.readFileSync(_path2.default.resolve(info.pem), 'utf8');
        } else if (info.password) {
          auth.password = info.password;
        } else if (sshAgent && _fs2.default.existsSync(sshAgent)) {
          opts.ssh.agent = sshAgent;
        } else {
          console.error('error: server %s doesn\'t have password, ssh-agent or pem', name);
          process.exit(1);
        }

        var session = _nodemiral2.default.session(info.host, auth, opts);
        this.sessions[name] = session;
      }
    }
  }]);

  return MupAPI;
}();

exports.default = MupAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm11cC1hcGkuanMiXSwibmFtZXMiOlsiTXVwQVBJIiwiYmFzZSIsImFyZ3MiLCJjb25maWdQYXRoIiwic2V0dGluZ3NQYXRoIiwiY29uZmlnIiwic2V0dGluZ3MiLCJzZXNzaW9ucyIsImZpbGVQYXRoIiwicmVzb2x2ZSIsImRpcm5hbWUiLCJqb2luIiwicmVxdWlyZSIsImUiLCJjb2RlIiwiY29uc29sZSIsImVycm9yIiwicHJvY2VzcyIsImV4aXQiLCJtb2R1bGVzIiwiX3BpY2tTZXNzaW9ucyIsIk9iamVjdCIsImtleXMiLCJtYXAiLCJuYW1lIiwiYXBpIiwiY3JlYXRlIiwiX2xvYWRTZXNzaW9ucyIsImZvckVhY2giLCJtb2R1bGVDb25maWciLCJtb2R1bGVOYW1lIiwic2VydmVycyIsImhhc093blByb3BlcnR5IiwiZ2V0Q29uZmlnIiwiaW5mbyIsImF1dGgiLCJ1c2VybmFtZSIsIm9wdHMiLCJzc2giLCJzc2hBZ2VudCIsImVudiIsIlNTSF9BVVRIX1NPQ0siLCJwZW0iLCJyZWFkRmlsZVN5bmMiLCJwYXNzd29yZCIsImV4aXN0c1N5bmMiLCJhZ2VudCIsInNlc3Npb24iLCJob3N0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7SUFFcUJBLE07QUFDbkIsa0JBQVlDLElBQVosRUFBa0JDLElBQWxCLEVBQXdCQyxVQUF4QixFQUFvQ0MsWUFBcEMsRUFBa0Q7QUFBQTs7QUFDaEQsU0FBS0gsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsU0FBS0MsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsU0FBS0csTUFBTCxHQUFjLElBQWQ7QUFDQSxTQUFLQyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQixJQUFoQjtBQUNBLFNBQUtKLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsU0FBS0MsWUFBTCxHQUFvQkEsWUFBcEI7QUFDRDs7Ozs4QkFFUztBQUNSLGFBQU8sS0FBS0YsSUFBWjtBQUNEOzs7a0NBRWE7QUFD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b3ItdXAvc3JjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCBub2RlbWlyYWwgZnJvbSAnbm9kZW1pcmFsJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE11cEFQSSB7XHJcbiAgY29uc3RydWN0b3IoYmFzZSwgYXJncywgY29uZmlnUGF0aCwgc2V0dGluZ3NQYXRoKSB7XHJcbiAgICB0aGlzLmJhc2UgPSBiYXNlO1xyXG4gICAgdGhpcy5hcmdzID0gYXJncztcclxuICAgIHRoaXMuY29uZmlnID0gbnVsbDtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSBudWxsO1xyXG4gICAgdGhpcy5zZXNzaW9ucyA9IG51bGw7XHJcbiAgICB0aGlzLmNvbmZpZ1BhdGggPSBjb25maWdQYXRoO1xyXG4gICAgdGhpcy5zZXR0aW5nc1BhdGggPSBzZXR0aW5nc1BhdGg7XHJcbiAgfVxyXG5cclxuICBnZXRBcmdzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYXJncztcclxuICB9XHJcblxyXG4gIGdldEJhc2VQYXRoKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYmFzZTtcclxuICB9XHJcblxyXG4gIGdldENvbmZpZygpIHtcclxuICAgIGlmICghdGhpcy5jb25maWcpIHtcclxuICAgICAgbGV0IGZpbGVQYXRoO1xyXG4gICAgICBpZih0aGlzLmNvbmZpZ1BhdGgpIHtcclxuICAgICAgICBmaWxlUGF0aCA9IHBhdGgucmVzb2x2ZSh0aGlzLmNvbmZpZ1BhdGgpO1xyXG4gICAgICAgIHRoaXMuYmFzZSA9IHBhdGguZGlybmFtZSh0aGlzLmNvbmZpZ1BhdGgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZpbGVQYXRoID0gcGF0aC5qb2luKHRoaXMuYmFzZSwgJ211cC5qcycpO1xyXG4gICAgICB9XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSByZXF1aXJlKGZpbGVQYXRoKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGlmKGUuY29kZSA9PSAnTU9EVUxFX05PVF9GT1VORCcpIHtcclxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYCdtdXAuanMnIGZpbGUgbm90IGZvdW5kLiBSdW4gJ211cCBpbml0JyBmaXJzdC5gKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuY29uZmlnO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2V0dGluZ3MoKSB7XHJcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MpIHtcclxuICAgICAgbGV0IGZpbGVQYXRoO1xyXG4gICAgICBpZih0aGlzLnNldHRpbmdzUGF0aCkge1xyXG4gICAgICAgIGZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKHRoaXMuc2V0dGluZ3NQYXRoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBmaWxlUGF0aCA9IHBhdGguam9pbih0aGlzLmJhc2UsICdzZXR0aW5ncy5qc29uJyk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5zZXR0aW5ncyA9IHJlcXVpcmUoZmlsZVBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLnNldHRpbmdzO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2Vzc2lvbnMobW9kdWxlcyA9IFtdKSB7XHJcbiAgICBjb25zdCBzZXNzaW9ucyA9IHRoaXMuX3BpY2tTZXNzaW9ucyhtb2R1bGVzKTtcclxuICAgIHJldHVybiBPYmplY3Qua2V5cyhzZXNzaW9ucykubWFwKG5hbWUgPT4gc2Vzc2lvbnNbbmFtZV0pO1xyXG4gIH1cclxuXHJcbiAgd2l0aFNlc3Npb25zKG1vZHVsZXMgPSBbXSkge1xyXG4gICAgY29uc3QgYXBpID0gT2JqZWN0LmNyZWF0ZSh0aGlzKTtcclxuICAgIGFwaS5zZXNzaW9ucyA9IHRoaXMuX3BpY2tTZXNzaW9ucyhtb2R1bGVzKTtcclxuICAgIHJldHVybiBhcGk7XHJcbiAgfVxyXG5cclxuICBfcGlja1Nlc3Npb25zKG1vZHVsZXMgPSBbXSkge1xyXG4gICAgaWYgKCF0aGlzLnNlc3Npb25zKSB7XHJcbiAgICAgIHRoaXMuX2xvYWRTZXNzaW9ucygpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNlc3Npb25zID0ge307XHJcblxyXG4gICAgbW9kdWxlcy5mb3JFYWNoKG1vZHVsZU5hbWUgPT4ge1xyXG4gICAgICBjb25zdCBtb2R1bGVDb25maWcgPSB0aGlzLmNvbmZpZ1ttb2R1bGVOYW1lXTtcclxuICAgICAgaWYgKCFtb2R1bGVDb25maWcpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAodmFyIG5hbWUgaW4gbW9kdWxlQ29uZmlnLnNlcnZlcnMpIHtcclxuICAgICAgICBpZiAoIW1vZHVsZUNvbmZpZy5zZXJ2ZXJzLmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnNlc3Npb25zW25hbWVdKSB7XHJcbiAgICAgICAgICBzZXNzaW9uc1tuYW1lXSA9IHRoaXMuc2Vzc2lvbnNbbmFtZV07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gc2Vzc2lvbnM7XHJcbiAgfVxyXG5cclxuICBfbG9hZFNlc3Npb25zKCkge1xyXG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5nZXRDb25maWcoKTtcclxuICAgIHRoaXMuc2Vzc2lvbnMgPSB7fTtcclxuXHJcbiAgICAvLyBgbXVwLnNlcnZlcnNgIGNvbnRhaW5zIGxvZ2luIGluZm9ybWF0aW9uIGZvciBzZXJ2ZXJzXHJcbiAgICAvLyBVc2UgdGhpcyBpbmZvcm1hdGlvbiB0byBjcmVhdGUgbm9kZW1pcmFsIHNlc3Npb25zLlxyXG4gICAgZm9yICh2YXIgbmFtZSBpbiBjb25maWcuc2VydmVycykge1xyXG4gICAgICBpZiAoIWNvbmZpZy5zZXJ2ZXJzLmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGluZm8gPSBjb25maWcuc2VydmVyc1tuYW1lXTtcclxuICAgICAgY29uc3QgYXV0aCA9IHt1c2VybmFtZTogaW5mby51c2VybmFtZX07XHJcbiAgICAgIGNvbnN0IG9wdHMgPSB7c3NoOiB7fX07XHJcblxyXG4gICAgICB2YXIgc3NoQWdlbnQgPSBwcm9jZXNzLmVudi5TU0hfQVVUSF9TT0NLO1xyXG5cclxuICAgICAgaWYgKGluZm8ub3B0cykge1xyXG4gICAgICAgIG9wdHMuc3NoID0gaW5mby5vcHRzO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaW5mby5wZW0pIHtcclxuICAgICAgICBhdXRoLnBlbSA9IGZzLnJlYWRGaWxlU3luYyhwYXRoLnJlc29sdmUoaW5mby5wZW0pLCAndXRmOCcpO1xyXG4gICAgICB9IGVsc2UgaWYgKGluZm8ucGFzc3dvcmQpIHtcclxuICAgICAgICBhdXRoLnBhc3N3b3JkID0gaW5mby5wYXNzd29yZDtcclxuICAgICAgfSBlbHNlIGlmIChzc2hBZ2VudCAmJiBmcy5leGlzdHNTeW5jKHNzaEFnZW50KSkge1xyXG4gICAgICAgIG9wdHMuc3NoLmFnZW50ID0gc3NoQWdlbnQ7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcclxuICAgICAgICAgICdlcnJvcjogc2VydmVyICVzIGRvZXNuXFwndCBoYXZlIHBhc3N3b3JkLCBzc2gtYWdlbnQgb3IgcGVtJyxcclxuICAgICAgICAgIG5hbWVcclxuICAgICAgICApO1xyXG4gICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3Qgc2Vzc2lvbiA9IG5vZGVtaXJhbC5zZXNzaW9uKGluZm8uaG9zdCwgYXV0aCwgb3B0cyk7XHJcbiAgICAgIHRoaXMuc2Vzc2lvbnNbbmFtZV0gPSBzZXNzaW9uO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=