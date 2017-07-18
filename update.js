'use strict'

const pkg = require('./package.json')
const Acho = require('acho')
const get = require('simple-get')
const JSONStream = require('JSONStream')
const fs = require('fs')
const es = require('event-stream')
var map = require('through2-map')

const split2 = require('split2')
const log = Acho()

const OPTS = {
  url: 'https://api.github.com/emojis',
  headers: {
    'user-agent': pkg.version
  }
}

get(OPTS, function (err, res) {
  res
    .pipe(JSONStream.parse('*'))
    .pipe(map(function (chunk) {
      chunk = chunk.toString()

      console.log(chunk)
      // return chunk.slice(0, 10)
    }))
})
