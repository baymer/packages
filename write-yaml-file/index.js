'use strict'
const path = require('path')
const fs = require('graceful-fs')
const writeFileAtomic = require('write-file-atomic')
const makeDir = require('make-dir')
const pify = require('pify')
const YAML = require('js-yaml')

const main = (fn, fp, data, opts) => {
  if (!fp) {
    throw new TypeError('Expected a filepath')
  }

  if (data === undefined) {
    throw new TypeError('Expected data to stringify')
  }

  opts = opts || {}

  const yaml = YAML.safeDump(data, opts)

  return fn(fp, yaml, { mode: opts.mode })
}

module.exports = (fp, data, opts) =>
  makeDir(path.dirname(fp), { fs })
    .then(() => main(pify(writeFileAtomic), fp, data, opts))

module.exports.sync = (fp, data, opts) => {
  makeDir.sync(path.dirname(fp), { fs })
  main(writeFileAtomic.sync, fp, data, opts)
}
