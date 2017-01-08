'use strict';

require('babel-polyfill');
require('source-map-support/register');

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.help = help;
exports.logs = logs;
exports.setup = setup;
exports.push = push;
exports.envconfig = envconfig;
exports.start = start;
exports.deploy = deploy;
exports.stop = stop;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _nodemiral = require('nodemiral');

var _nodemiral2 = _interopRequireDefault(_nodemiral);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _underscore = require('underscore');

var _ = _interopRequireWildcard(_underscore);

var _utils = require('../utils');

var _build = require('./build.js');

var _build2 = _interopRequireDefault(_build);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('mup:module:meteor');

function help() /* api */{
  log('exec => mup meteor help');
  console.log('mup meteor', Object.keys(this));
}

function logs(api) {
  log('exec => mup meteor logs');
  var config = api.getConfig().meteor;
  if (!config) {
    console.error('error: no configs found for meteor');
    process.exit(1);
  }

  var args = api.getArgs();
  var sessions = api.getSessions(['meteor']);
  return (0, _utils.getDockerLogs)(config.name, sessions, args);
}

function setup(api) {
  log('exec => mup meteor setup');
  var config = api.getConfig().meteor;
  if (!config) {
    console.error('error: no configs found for meteor');
    process.exit(1);
  }

  var list = _nodemiral2.default.taskList('Setup Meteor');

  list.executeScript('Setup Environment', {
    script: _path2.default.resolve(__dirname, 'assets/meteor-setup.sh'),
    vars: {
      name: config.name
    }
  });

  if (config.ssl) {
    var basePath = api.getBasePath();

    if (config.ssl.upload !== false) {
      list.copy('Copying SSL Certificate Bundle', {
        src: _path2.default.resolve(basePath, config.ssl.crt),
        dest: '/opt/' + config.name + '/config/bundle.crt'
      });

      list.copy('Copying SSL Private Key', {
        src: _path2.default.resolve(basePath, config.ssl.key),
        dest: '/opt/' + config.name + '/config/private.key'
      });
    }

    list.executeScript('Verifying SSL Configurations', {
      script: _path2.default.resolve(__dirname, 'assets/verify-ssl-config.sh'),
      vars: {
        name: config.name
      }
    });
  }

  var sessions = api.getSessions(['meteor']);

  return (0, _utils.runTaskList)(list, sessions);
}

function push(api) {
  log('exec => mup meteor push');
  var config = api.getConfig().meteor;
  if (!config) {
    console.error('error: no configs found for meteor');
    process.exit(1);
  }
  if (!config.docker) {
    if (config.dockerImage) {
      config.docker = { image: config.dockerImage };
      delete config.dockerImage;
    } else {
      config.docker = { image: 'kadirahq/meteord' };
    }
  }
  if (config.dockerImageFrontendServer) {
    config.docker.imageFrontendServer = config.dockerImageFrontendServer;
  }
  if (!config.docker.imageFrontendServer) {
    config.docker.imageFrontendServer = 'meteorhacks/mup-frontend-server';
  }

  var buildOptions = config.buildOptions || {};
  buildOptions.buildLocation = buildOptions.buildLocation || _path2.default.resolve('/tmp', _uuid2.default.v4());

  console.log('Building App Bundle Locally');

  var bundlePath = _path2.default.resolve(buildOptions.buildLocation, 'bundle.tar.gz');
  var appPath = _path2.default.resolve(api.getBasePath(), config.path);

  return (0, _build2.default)(appPath, buildOptions).then(function () {
    config.log = config.log || {
      opts: {
        'max-size': '100m',
        'max-file': 10
      }
    };
    var list = _nodemiral2.default.taskList('Pushing Meteor');

    list.copy('Pushing Meteor App Bundle to The Server', {
      src: bundlePath,
      dest: '/opt/' + config.name + '/tmp/bundle.tar.gz',
      progressBar: config.enableUploadProgressBar
    });

    list.copy('Pushing the Startup Script', {
      src: _path2.default.resolve(__dirname, 'assets/templates/start.sh'),
      dest: '/opt/' + config.name + '/config/start.sh',
      vars: {
        appName: config.name,
        useLocalMongo: api.getConfig().mongo ? 1 : 0,
        port: config.env.PORT || 80,
        sslConfig: config.ssl,
        logConfig: config.log,
        volumes: config.volumes,
        docker: config.docker
      }
    });

    var sessions = api.getSessions(['meteor']);
    return (0, _utils.runTaskList)(list, sessions, { series: true });
  });
}

function envconfig(api) {
  log('exec => mup meteor envconfig');
  var config = api.getConfig().meteor;
  if (!config) {
    console.error('error: no configs found for meteor');
    process.exit(1);
  }

  var list = _nodemiral2.default.taskList('Configuring  Meteor Environment Variables');

  var env = _.clone(config.env);
  env.METEOR_SETTINGS = JSON.stringify(api.getSettings());
  // sending PORT to the docker container is useless.
  // It'll run on PORT 80 and we can't override it
  // Changing the port is done via the start.sh script
  delete env.PORT;

  list.copy('Sending Environment Variables', {
    src: _path2.default.resolve(__dirname, 'assets/templates/env.list'),
    dest: '/opt/' + config.name + '/config/env.list',
    vars: {
      env: env || {},
      appName: config.name
    }
  });
  var sessions = api.getSessions(['meteor']);
  return (0, _utils.runTaskList)(list, sessions, { series: true });
}

function start(api) {
  log('exec => mup meteor start');
  var config = api.getConfig().meteor;
  if (!config) {
    console.error('error: no configs found for meteor');
    process.exit(1);
  }

  var list = _nodemiral2.default.taskList('Start Meteor');

  list.executeScript('Start Meteor', {
    script: _path2.default.resolve(__dirname, 'assets/meteor-start.sh'),
    vars: {
      appName: config.name
    }
  });

  list.executeScript('Verifying Deployment', {
    script: _path2.default.resolve(__dirname, 'assets/meteor-deploy-check.sh'),
    vars: {
      deployCheckWaitTime: config.deployCheckWaitTime || 60,
      appName: config.name,
      port: config.env.PORT || 80
    }
  });

  var sessions = api.getSessions(['meteor']);
  return (0, _utils.runTaskList)(list, sessions, { series: true });
}

function deploy(api) {
  log('exec => mup meteor deploy');
  var config = api.getConfig().meteor;
  if (!config) {
    console.error('error: no configs found for meteor');
    process.exit(1);
  }

  return push(api).then(function () {
    return envconfig(api);
  }).then(function () {
    return start(api);
  });
}

function stop(api) {
  log('exec => mup meteor stop');
  var config = api.getConfig().meteor;
  if (!config) {
    console.error('error: no configs found for meteor');
    process.exit(1);
  }

  var list = _nodemiral2.default.taskList('Stop Meteor');

  list.executeScript('Stop Meteor', {
    script: _path2.default.resolve(__dirname, 'assets/meteor-stop.sh'),
    vars: {
      appName: config.name
    }
  });

  var sessions = api.getSessions(['meteor']);
  return (0, _utils.runTaskList)(list, sessions);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImhlbHAiLCJsb2dzIiwic2V0dXAiLCJwdXNoIiwiZW52Y29uZmlnIiwic3RhcnQiLCJkZXBsb3kiLCJzdG9wIiwiXyIsImxvZyIsImNvbnNvbGUiLCJPYmplY3QiLCJrZXlzIiwiYXBpIiwiY29uZmlnIiwiZ2V0Q29uZmlnIiwibWV0ZW9yIiwiZXJyb3IiLCJwcm9jZXNzIiwiZXhpdCIsImFyZ3MiLCJnZXRBcmdzIiwic2Vzc2lvbnMiLCJnZXRTZXNzaW9ucyIsIm5hbWUiLCJsaXN0IiwidGFza0xpc3QiLCJleGVjdXRlU2NyaXB0Iiwic2NyaXB0IiwicmVzb2x2ZSIsIl9fZGlybmFtZSIsInZhcnMiLCJzc2wiLCJiYXNlUGF0aCIsImdldEJhc2VQYXRoIiwidXBsb2FkIiwiY29weSIsInNyYyIsImNydCIsImRlc3QiLCJrZXkiLCJkb2NrZXIiLCJkb2NrZXJJbWFnZSIsImltYWdlIiwiZG9ja2VySW1hZ2VGcm9udGVuZFNlcnZlciIsImltYWdlRnJvbnRlbmRTZXJ2ZXIiLCJidWlsZE9wdGlvbnMiLCJidWlsZExvY2F0aW9uIiwidjQiLCJidW5kbGVQYXRoIiwiYXBwUGF0aCIsInBhdGgiLCJ0aGVuIiwib3B0cyIsInByb2dyZXNzQmFyIiwiZW5hYmxlVXBsb2FkUHJvZ3Jlc3NCYXIiLCJhcHBOYW1lIiwidXNlTG9jYWxNb25nbyIsIm1vbmdvIiwicG9ydCIsImVudiIsIlBPUlQiLCJzc2xDb25maWciLCJsb2dDb25maWciLCJ2b2x1bWVzIiwic2VyaWVzIiwiY2xvbmUiLCJNRVRFT1JfU0VUVElOR1MiLCJKU09OIiwic3RyaW5naWZ5IiwiZ2V0U2V0dGluZ3MiLCJkZXBsb3lDaGVja1dhaXRUaW1lIl0sIm1hcHBpbmdzIjoiOzs7OztRQVVnQkEsSSxHQUFBQSxJO1FBS0FDLEksR0FBQUEsSTtRQWFBQyxLLEdBQUFBLEs7UUE2Q0FDLEksR0FBQUEsSTtRQWlFQUMsUyxHQUFBQSxTO1FBNkJBQyxLLEdBQUFBLEs7UUE4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QUQsT0FBS0UsYUFBTCxDQUFtQixhQUFuQixFQUFrQztBQUNoQ0MsWUFBUSxlQUFLQyxPQUFMLENBQWFDLFNBQWIsRUFBd0IsdUJBQXhCLENBRHdCO0FBRWhDQyxVQUFNO0FBQ0p5QixlQUFTMUMsT0FBT1U7QUFEWjtBQUYwQixHQUFsQzs7QUFPQSxNQUFNRixXQUFXVCxJQUFJVSxXQUFKLENBQWdCLENBQUUsUUFBRixDQUFoQixDQUFqQjtBQUNBLFNBQU8sd0JBQVlFLElBQVosRUFBa0JILFFBQWxCLENBQVA7QUFDRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZVJvb3QiOiJDOi93YW1wNjQvd3d3L21ldGVvci11cC9zcmMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcclxuaW1wb3J0IG5vZGVtaXJhbCBmcm9tICdub2RlbWlyYWwnO1xyXG5pbXBvcnQgdXVpZCBmcm9tICd1dWlkJztcclxuaW1wb3J0ICogYXMgXyBmcm9tICd1bmRlcnNjb3JlJztcclxuaW1wb3J0IHtydW5UYXNrTGlzdCwgZ2V0RG9ja2VyTG9nc30gZnJvbSAnLi4vdXRpbHMnO1xyXG5pbXBvcnQgYnVpbGRBcHAgZnJvbSAnLi9idWlsZC5qcyc7XHJcbmNvbnN0IGxvZyA9IGRlYnVnKCdtdXA6bW9kdWxlOm1ldGVvcicpO1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBoZWxwKC8qIGFwaSAqLykge1xyXG4gIGxvZygnZXhlYyA9PiBtdXAgbWV0ZW9yIGhlbHAnKTtcclxuICBjb25zb2xlLmxvZygnbXVwIG1ldGVvcicsIE9iamVjdC5rZXlzKHRoaXMpKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvZ3MoYXBpKSB7XHJcbiAgbG9nKCdleGVjID0+IG11cCBtZXRlb3IgbG9ncycpO1xyXG4gIGNvbnN0IGNvbmZpZyA9IGFwaS5nZXRDb25maWcoKS5tZXRlb3I7XHJcbiAgaWYgKCFjb25maWcpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yOiBubyBjb25maWdzIGZvdW5kIGZvciBtZXRlb3InKTtcclxuICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGFyZ3MgPSBhcGkuZ2V0QXJncygpO1xyXG4gIGNvbnN0IHNlc3Npb25zID0gYXBpLmdldFNlc3Npb25zKFsgJ21ldGVvcicgXSk7XHJcbiAgcmV0dXJuIGdldERvY2tlckxvZ3MoY29uZmlnLm5hbWUsIHNlc3Npb25zLCBhcmdzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwKGFwaSkge1xyXG4gIGxvZygnZXhlYyA9PiBtdXAgbWV0ZW9yIHNldHVwJyk7XHJcbiAgY29uc3QgY29uZmlnID0gYXBpLmdldENvbmZpZygpLm1ldGVvcjtcclxuICBpZiAoIWNvbmZpZykge1xyXG4gICAgY29uc29sZS5lcnJvcignZXJyb3I6IG5vIGNvbmZpZ3MgZm91bmQgZm9yIG1ldGVvcicpO1xyXG4gICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgbGlzdCA9IG5vZGVtaXJhbC50YXNrTGlzdCgnU2V0dXAgTWV0ZW9yJyk7XHJcblxyXG4gIGxpc3QuZXhlY3V0ZVNjcmlwdCgnU2V0dXAgRW52aXJvbm1lbnQnLCB7XHJcbiAgICBzY3JpcHQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdhc3NldHMvbWV0ZW9yLXNldHVwLnNoJyksXHJcbiAgICB2YXJzOiB7XHJcbiAgICAgIG5hbWU6IGNvbmZpZy5uYW1lLFxyXG4gICAgfSxcclxuICB9KTtcclxuXHJcbiAgaWYgKGNvbmZpZy5zc2wpIHtcclxuICAgIGNvbnN0IGJhc2VQYXRoID0gYXBpLmdldEJhc2VQYXRoKCk7XHJcblxyXG4gICAgaWYgKGNvbmZpZy5zc2wudXBsb2FkICE9PSBmYWxzZSkge1xyXG4gICAgICBsaXN0LmNvcHkoJ0NvcHlpbmcgU1NMIENlcnRpZmljYXRlIEJ1bmRsZScsIHtcclxuICAgICAgICBzcmM6IHBhdGgucmVzb2x2ZShiYXNlUGF0aCwgY29uZmlnLnNzbC5jcnQpLFxyXG4gICAgICAgIGRlc3Q6ICcvb3B0LycgKyBjb25maWcubmFtZSArICcvY29uZmlnL2J1bmRsZS5jcnQnXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgbGlzdC5jb3B5KCdDb3B5aW5nIFNTTCBQcml2YXRlIEtleScsIHtcclxuICAgICAgICBzcmM6IHBhdGgucmVzb2x2ZShiYXNlUGF0aCwgY29uZmlnLnNzbC5rZXkpLFxyXG4gICAgICAgIGRlc3Q6ICcvb3B0LycgKyBjb25maWcubmFtZSArICcvY29uZmlnL3ByaXZhdGUua2V5J1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsaXN0LmV4ZWN1dGVTY3JpcHQoJ1ZlcmlmeWluZyBTU0wgQ29uZmlndXJhdGlvbnMnLCB7XHJcbiAgICAgIHNjcmlwdDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2Fzc2V0cy92ZXJpZnktc3NsLWNvbmZpZy5zaCcpLFxyXG4gICAgICB2YXJzOiB7XHJcbiAgICAgICAgbmFtZTogY29uZmlnLm5hbWVcclxuICAgICAgfSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY29uc3Qgc2Vzc2lvbnMgPSBhcGkuZ2V0U2Vzc2lvbnMoWyAnbWV0ZW9yJyBdKTtcclxuXHJcbiAgcmV0dXJuIHJ1blRhc2tMaXN0KGxpc3QsIHNlc3Npb25zKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHB1c2goYXBpKSB7XHJcbiAgbG9nKCdleGVjID0+IG11cCBtZXRlb3IgcHVzaCcpO1xyXG4gIGNvbnN0IGNvbmZpZyA9IGFwaS5nZXRDb25maWcoKS5tZXRlb3I7XHJcbiAgaWYgKCFjb25maWcpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yOiBubyBjb25maWdzIGZvdW5kIGZvciBtZXRlb3InKTtcclxuICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICB9XHJcbiAgaWYgKCFjb25maWcuZG9ja2VyKSB7XHJcbiAgICBpZihjb25maWcuZG9ja2VySW1hZ2UpIHtcclxuICAgICAgY29uZmlnLmRvY2tlciA9IHtpbWFnZTogY29uZmlnLmRvY2tlckltYWdlfTtcclxuICAgICAgZGVsZXRlIGNvbmZpZy5kb2NrZXJJbWFnZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbmZpZy5kb2NrZXIgPSB7aW1hZ2U6ICdrYWRpcmFocS9tZXRlb3JkJ307XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChjb25maWcuZG9ja2VySW1hZ2VGcm9udGVuZFNlcnZlcikge1xyXG4gICAgY29uZmlnLmRvY2tlci5pbWFnZUZyb250ZW5kU2VydmVyID0gY29uZmlnLmRvY2tlckltYWdlRnJvbnRlbmRTZXJ2ZXI7XHJcbiAgfVxyXG4gIGlmICghY29uZmlnLmRvY2tlci5pbWFnZUZyb250ZW5kU2VydmVyKSB7XHJcbiAgICBjb25maWcuZG9ja2VyLmltYWdlRnJvbnRlbmRTZXJ2ZXIgPSAnbWV0ZW9yaGFja3MvbXVwLWZyb250ZW5kLXNlcnZlcic7XHJcbiAgfVxyXG5cclxuICB2YXIgYnVpbGRPcHRpb25zID0gY29uZmlnLmJ1aWxkT3B0aW9ucyB8fCB7fTtcclxuICBidWlsZE9wdGlvbnMuYnVpbGRMb2NhdGlvbiA9IGJ1aWxkT3B0aW9ucy5idWlsZExvY2F0aW9uIHx8IHBhdGgucmVzb2x2ZSgnL3RtcCcsIHV1aWQudjQoKSk7XHJcblxyXG4gIGNvbnNvbGUubG9nKCdCdWlsZGluZyBBcHAgQnVuZGxlIExvY2FsbHknKTtcclxuXHJcbiAgdmFyIGJ1bmRsZVBhdGggPSBwYXRoLnJlc29sdmUoYnVpbGRPcHRpb25zLmJ1aWxkTG9jYXRpb24sICdidW5kbGUudGFyLmd6Jyk7XHJcbiAgY29uc3QgYXBwUGF0aCA9IHBhdGgucmVzb2x2ZShhcGkuZ2V0QmFzZVBhdGgoKSwgY29uZmlnLnBhdGgpO1xyXG5cclxuICByZXR1cm4gYnVpbGRBcHAoYXBwUGF0aCwgYnVpbGRPcHRpb25zKVxyXG4gICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICBjb25maWcubG9nID0gY29uZmlnLmxvZyB8fCB7XHJcbiAgICAgICAgb3B0czoge1xyXG4gICAgICAgICAgJ21heC1zaXplJzogJzEwMG0nLFxyXG4gICAgICAgICAgJ21heC1maWxlJzogMTBcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICAgIGNvbnN0IGxpc3QgPSBub2RlbWlyYWwudGFza0xpc3QoJ1B1c2hpbmcgTWV0ZW9yJyk7XHJcblxyXG4gICAgICBsaXN0LmNvcHkoJ1B1c2hpbmcgTWV0ZW9yIEFwcCBCdW5kbGUgdG8gVGhlIFNlcnZlcicsIHtcclxuICAgICAgICBzcmM6IGJ1bmRsZVBhdGgsXHJcbiAgICAgICAgZGVzdDogJy9vcHQvJyArIGNvbmZpZy5uYW1lICsgJy90bXAvYnVuZGxlLnRhci5neicsXHJcbiAgICAgICAgcHJvZ3Jlc3NCYXI6IGNvbmZpZy5lbmFibGVVcGxvYWRQcm9ncmVzc0JhclxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGxpc3QuY29weSgnUHVzaGluZyB0aGUgU3RhcnR1cCBTY3JpcHQnLCB7XHJcbiAgICAgICAgc3JjOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnYXNzZXRzL3RlbXBsYXRlcy9zdGFydC5zaCcpLFxyXG4gICAgICAgIGRlc3Q6ICcvb3B0LycgKyBjb25maWcubmFtZSArICcvY29uZmlnL3N0YXJ0LnNoJyxcclxuICAgICAgICB2YXJzOiB7XHJcbiAgICAgICAgICBhcHBOYW1lOiBjb25maWcubmFtZSxcclxuICAgICAgICAgIHVzZUxvY2FsTW9uZ286IGFwaS5nZXRDb25maWcoKS5tb25nbyA/IDEgOiAwLFxyXG4gICAgICAgICAgcG9ydDogY29uZmlnLmVudi5QT1JUIHx8IDgwLFxyXG4gICAgICAgICAgc3NsQ29uZmlnOiBjb25maWcuc3NsLFxyXG4gICAgICAgICAgbG9nQ29uZmlnOiBjb25maWcubG9nLFxyXG4gICAgICAgICAgdm9sdW1lczogY29uZmlnLnZvbHVtZXMsXHJcbiAgICAgICAgICBkb2NrZXI6IGNvbmZpZy5kb2NrZXJcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc3Qgc2Vzc2lvbnMgPSBhcGkuZ2V0U2Vzc2lvbnMoWyAnbWV0ZW9yJyBdKTtcclxuICAgICAgcmV0dXJuIHJ1blRhc2tMaXN0KGxpc3QsIHNlc3Npb25zLCB7c2VyaWVzOiB0cnVlfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGVudmNvbmZpZyhhcGkpIHtcclxuICBsb2coJ2V4ZWMgPT4gbXVwIG1ldGVvciBlbnZjb25maWcnKTtcclxuICBjb25zdCBjb25maWcgPSBhcGkuZ2V0Q29uZmlnKCkubWV0ZW9yO1xyXG4gIGlmICghY29uZmlnKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdlcnJvcjogbm8gY29uZmlncyBmb3VuZCBmb3IgbWV0ZW9yJyk7XHJcbiAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBsaXN0ID0gbm9kZW1pcmFsLnRhc2tMaXN0KCdDb25maWd1cmluZyAgTWV0ZW9yIEVudmlyb25tZW50IFZhcmlhYmxlcycpO1xyXG5cclxuICB2YXIgZW52ID0gXy5jbG9uZShjb25maWcuZW52KTtcclxuICBlbnYuTUVURU9SX1NFVFRJTkdTID0gSlNPTi5zdHJpbmdpZnkoYXBpLmdldFNldHRpbmdzKCkpO1xyXG4gIC8vIHNlbmRpbmcgUE9SVCB0byB0aGUgZG9ja2VyIGNvbnRhaW5lciBpcyB1c2VsZXNzLlxyXG4gIC8vIEl0J2xsIHJ1biBvbiBQT1JUIDgwIGFuZCB3ZSBjYW4ndCBvdmVycmlkZSBpdFxyXG4gIC8vIENoYW5naW5nIHRoZSBwb3J0IGlzIGRvbmUgdmlhIHRoZSBzdGFydC5zaCBzY3JpcHRcclxuICBkZWxldGUgZW52LlBPUlQ7XHJcblxyXG4gIGxpc3QuY29weSgnU2VuZGluZyBFbnZpcm9ubWVudCBWYXJpYWJsZXMnLCB7XHJcbiAgICBzcmM6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdhc3NldHMvdGVtcGxhdGVzL2Vudi5saXN0JyksXHJcbiAgICBkZXN0OiAnL29wdC8nICsgY29uZmlnLm5hbWUgKyAnL2NvbmZpZy9lbnYubGlzdCcsXHJcbiAgICB2YXJzOiB7XHJcbiAgICAgIGVudjogZW52IHx8IHt9LFxyXG4gICAgICBhcHBOYW1lOiBjb25maWcubmFtZVxyXG4gICAgfVxyXG4gIH0pO1xyXG4gIGNvbnN0IHNlc3Npb25zID0gYXBpLmdldFNlc3Npb25zKFsgJ21ldGVvcicgXSk7XHJcbiAgcmV0dXJuIHJ1blRhc2tMaXN0KGxpc3QsIHNlc3Npb25zLCB7c2VyaWVzOiB0cnVlfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzdGFydChhcGkpIHtcclxuICBsb2coJ2V4ZWMgPT4gbXVwIG1ldGVvciBzdGFydCcpO1xyXG4gIGNvbnN0IGNvbmZpZyA9IGFwaS5nZXRDb25maWcoKS5tZXRlb3I7XHJcbiAgaWYgKCFjb25maWcpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yOiBubyBjb25maWdzIGZvdW5kIGZvciBtZXRlb3InKTtcclxuICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGxpc3QgPSBub2RlbWlyYWwudGFza0xpc3QoJ1N0YXJ0IE1ldGVvcicpO1xyXG5cclxuICBsaXN0LmV4ZWN1dGVTY3JpcHQoJ1N0YXJ0IE1ldGVvcicsIHtcclxuICAgIHNjcmlwdDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2Fzc2V0cy9tZXRlb3Itc3RhcnQuc2gnKSxcclxuICAgIHZhcnM6IHtcclxuICAgICAgYXBwTmFtZTogY29uZmlnLm5hbWVcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgbGlzdC5leGVjdXRlU2NyaXB0KCdWZXJpZnlpbmcgRGVwbG95bWVudCcsIHtcclxuICAgIHNjcmlwdDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2Fzc2V0cy9tZXRlb3ItZGVwbG95LWNoZWNrLnNoJyksXHJcbiAgICB2YXJzOiB7XHJcbiAgICAgIGRlcGxveUNoZWNrV2FpdFRpbWU6IGNvbmZpZy5kZXBsb3lDaGVja1dhaXRUaW1lIHx8IDYwLFxyXG4gICAgICBhcHBOYW1lOiBjb25maWcubmFtZSxcclxuICAgICAgcG9ydDogY29uZmlnLmVudi5QT1JUIHx8IDgwXHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHNlc3Npb25zID0gYXBpLmdldFNlc3Npb25zKFsgJ21ldGVvcicgXSk7XHJcbiAgcmV0dXJuIHJ1blRhc2tMaXN0KGxpc3QsIHNlc3Npb25zLCB7c2VyaWVzOiB0cnVlfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkZXBsb3koYXBpKSB7XHJcbiAgbG9nKCdleGVjID0+IG11cCBtZXRlb3IgZGVwbG95Jyk7XHJcbiAgY29uc3QgY29uZmlnID0gYXBpLmdldENvbmZpZygpLm1ldGVvcjtcclxuICBpZiAoIWNvbmZpZykge1xyXG4gICAgY29uc29sZS5lcnJvcignZXJyb3I6IG5vIGNvbmZpZ3MgZm91bmQgZm9yIG1ldGVvcicpO1xyXG4gICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHB1c2goYXBpKVxyXG4gICAgLnRoZW4oKCkgPT4gZW52Y29uZmlnKGFwaSkpXHJcbiAgICAudGhlbigoKSA9PiBzdGFydChhcGkpKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN0b3AoYXBpKSB7XHJcbiAgbG9nKCdleGVjID0+IG11cCBtZXRlb3Igc3RvcCcpO1xyXG4gIGNvbnN0IGNvbmZpZyA9IGFwaS5nZXRDb25maWcoKS5tZXRlb3I7XHJcbiAgaWYgKCFjb25maWcpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yOiBubyBjb25maWdzIGZvdW5kIGZvciBtZXRlb3InKTtcclxuICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGxpc3QgPSBub2RlbWlyYWwudGFza0xpc3QoJ1N0b3AgTWV0ZW9yJyk7XHJcblxyXG4gIGxpc3QuZXhlY3V0ZVNjcmlwdCgnU3RvcCBNZXRlb3InLCB7XHJcbiAgICBzY3JpcHQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdhc3NldHMvbWV0ZW9yLXN0b3Auc2gnKSxcclxuICAgIHZhcnM6IHtcclxuICAgICAgYXBwTmFtZTogY29uZmlnLm5hbWVcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgY29uc3Qgc2Vzc2lvbnMgPSBhcGkuZ2V0U2Vzc2lvbnMoWyAnbWV0ZW9yJyBdKTtcclxuICByZXR1cm4gcnVuVGFza0xpc3QobGlzdCwgc2Vzc2lvbnMpO1xyXG59XHJcbiJdfQ==