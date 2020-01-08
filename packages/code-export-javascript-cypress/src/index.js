// Licensed to the Software Freedom Conservancy (SFC) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The SFC licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

import { codeExport as exporter } from '@seleniumhq/side-utils'
import emitter from './command'
import location from './location'
import { generateHooks } from './hook'

// Define language options
export const displayName = 'JavaScript Cypress'

export let opts = {}
opts.emitter = emitter
opts.hooks = generateHooks()
opts.fileExtension = '.js'
opts.commandPrefixPadding = '    '
opts.terminatingKeyword = '})'
opts.commentPrefix = '//'
opts.testLevel = 0
opts.commandLevel = 1
opts.generateMethodDeclaration = generateMethodDeclaration

// Create generators for dynamic string creation of primary entities (e.g., filename, methods, test, and suite)
function generateTestDeclaration() {
  return ''
}

function generateMethodDeclaration() {
  return {
    body: '',
    terminatingKeyword: '',
  }
}

function generateSuiteDeclaration() {
  return ''
}

function generateFilename(name) {
  return `${exporter.parsers.uncapitalize(
    exporter.parsers.sanitizeName(name)
  )}${opts.fileExtension}`
}

// Emit an individual test, wrapped in a suite (using the test name as the suite name)
export async function emitTest({
  baseUrl,
  test,
  tests,
  project,
  enableOriginTracing,
  beforeEachOptions,
  enableDescriptionAsComment,
}) {
  global.baseUrl = baseUrl
  const testDeclaration = generateTestDeclaration(test.name)
  const result = await exporter.emit.test(test, tests, {
    ...opts,
    testDeclaration,
    enableOriginTracing,
    enableDescriptionAsComment,
    project,
  })
  const suiteName = test.name
  const suiteDeclaration = generateSuiteDeclaration(suiteName)
  const _suite = await exporter.emit.suite(result, tests, {
    ...opts,
    suiteDeclaration,
    suiteName,
    project,
    beforeEachOptions,
  })
  return {
    filename: generateFilename(test.name),
    body: emitOrderedSuite(_suite),
  }
}

// Emit a suite with all of its tests
export async function emitSuite({
  baseUrl,
  suite,
  tests,
  project,
  enableOriginTracing,
  beforeEachOptions,
  enableDescriptionAsComment,
}) {
  global.baseUrl = baseUrl
  const result = await exporter.emit.testsFromSuite(tests, suite, opts, {
    enableOriginTracing,
    generateTestDeclaration,
    enableDescriptionAsComment,
    project,
  })
  const suiteDeclaration = generateSuiteDeclaration(suite.name)
  const _suite = await exporter.emit.suite(result, tests, {
    ...opts,
    suiteDeclaration,
    suite,
    project,
    beforeEachOptions,
  })
  return {
    filename: generateFilename(suite.name),
    body: emitOrderedSuite(_suite),
  }
}

function emitOrderedSuite(emittedSuite) {
  let result = ''
  result += emittedSuite.dependencies
  result += emittedSuite.suiteDeclaration
  result += emittedSuite.variables
  result += emittedSuite.beforeAll
  result += emittedSuite.beforeEach
  result += emittedSuite.afterEach
  result += emittedSuite.afterAll
  result += emittedSuite.methods
  if (emittedSuite.tests.testDeclaration) {
    const test = emittedSuite.tests
    result += test.testDeclaration
    result += test.inEachBegin
    result += test.commands
    result += test.inEachEnd
    result += test.testEnd
  } else {
    for (const testName in emittedSuite.tests) {
      const test = emittedSuite.tests[testName]
      result += test.testDeclaration
      result += test.inEachBegin
      result += test.commands
      result += test.inEachEnd
      result += test.testEnd
    }
  }
  return result
}

export default {
  emit: {
    test: emitTest,
    suite: emitSuite,
    locator: location.emit,
  },
  register: {
    command: emitter.register,
    variable: opts.hooks.declareVariables.register,
    dependency: opts.hooks.declareDependencies.register,
    beforeAll: opts.hooks.beforeAll.register,
    beforeEach: opts.hooks.beforeEach.register,
    afterEach: opts.hooks.afterEach.register,
    afterAll: opts.hooks.afterAll.register,
    inEachBegin: opts.hooks.inEachBegin.register,
    inEachEnd: opts.hooks.inEachEnd.register,
  },
}
