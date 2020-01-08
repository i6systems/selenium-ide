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
// KIND, either express or implied.  See the License for the specific language governing permissions and limitations
// under the License.

import { codeExport as exporter } from '@seleniumhq/side-utils'

const emitters = {
  afterAll: empty,
  afterEach: empty,
  beforeAll: empty,
  beforeEach: empty,
  declareDependencies,
  declareMethods: empty,
  declareVariables: empty,
  inEachBegin: empty,
  inEachEnd: empty,
}

function generate(hookName) {
  return new exporter.hook(emitters[hookName]())
}

export function generateHooks() {
  let result = {}
  Object.keys(emitters).forEach(hookName => {
    result[hookName] = generate(hookName)
  })
  return result
}

function declareDependencies() {
  return {
    startingSyntax: {
      commands: [
        {
          level: 0,
          statement:
            'import { Before, Given, When, Then } from "cypress-cucumber-preprocessor/steps"',
        },
        {
          level: 0,
          statement: "const Database = require('../../support/database')",
        },
        {
          level: 0,
          statement: "const Redis = require('../../support/redis')",
        },
        {
          level: 0,
          statement: 'const Helpers = require("../../support/helpers")',
        },
        {
          level: 0,
          statement: '',
        },
        {
          level: 0,
          statement: 'Before(() => {',
        },
        {
          level: 1,
          statement: 'Database.reload()',
        },
        {
          level: 1,
          statement: 'Redis.clear()',
        },
        {
          level: 1,
          statement: "Helpers.login('test.user@example.com')",
        },
        {
          level: 0,
          statement: '})',
        },
      ],
    },
  }
}

function empty() {
  return {}
}
