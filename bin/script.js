#!/usr/bin/env node

var querystring = require('query-string')
var spawn = require('cross-spawn')
var command = process.argv[2]
var args = process.argv.slice(3)
var [script, params=''] = command.split('?')
var query = querystring.parse(params)
var params = Object.keys(query).map(key => query[key] ? `--${key}=${query[key]}` : `--${key}`)
var result
console.log(command,args,script,query,params)
switch (script) {
  case 'build':
  case 'start':
  case 'test':
    result = spawn.sync('node', params.concat(require.resolve('../scripts/' + script), args), {
      stdio: 'inherit'
    })
    break
  default:
    console.log('Unknown script "' + script + '".')
    break
}

if (result) {
  switch (result.signal) {
    case 'SIGKILL':
      console.log(
        'The build failed because the process exited too early. ' +
        'This probably means the system ran out of memory or someone called ' +
        '`kill -9` on the process.'
      )
      process.exit(1)
      break
    case 'SIGTERM':
      console.log(
        'The build failed because the process exited too early. ' +
        'Someone might have called `kill` or `killall`, or the system could ' +
        'be shutting down.'
      )
      process.exit(1)
      break
  }
  process.exit(result.status)
}