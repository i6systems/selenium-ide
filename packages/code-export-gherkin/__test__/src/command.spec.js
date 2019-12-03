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

import Command from '../../src/command'
import {
  Commands,
  ControlFlowCommandNames,
} from '../../../selenium-ide/src/neo/models/Command'
import { opts } from '../../src/index'
import { codeExport as exporter } from '@seleniumhq/side-utils'

const commandPrefixPadding = opts.commandPrefixPadding

async function prettify(command, { fullPayload } = {}) {
  const commandBlock = await Command.emit(command)
  const result = exporter.prettify(commandBlock, {
    commandPrefixPadding,
  })
  return fullPayload ? result : result.body
}

describe('command code emitter', () => {
  it('should emit all known commands', () => {
    let result = []
    Commands.array.forEach(command => {
      if (!Command.canEmit(command)) {
        result.push(command)
      }
    })
    expect(() => {
      if (result.length) {
        if (result.length === 1) {
          throw new Error(`${result[0]} has no emitter, write one!`)
        } else {
          throw new Error(`No emitters for ${result.join(', ')}. Write them!`)
        }
      }
    }).not.toThrow()
  })
  it('should emit a command without comment', () => {
    const command = {
      command: 'addSelection',
      target: 'css=select',
      value: 'label=A label',
    }
    return expect(prettify(command)).resolves.toMatchSnapshot()
  })
  it('should emit a command with a comment', () => {
    const command = {
      command: 'assert',
      target: 'varrrName',
      value: 'blah',
      comment: 'test step',
    }
    return expect(prettify(command)).resolves.toMatchSnapshot()
  })
  it('should emit new window handling, if command opens a new window', () => {
    const command = {
      command: 'click',
      target: 'css=button',
      value: '',
      opensWindow: true,
      windowHandleName: 'newWin',
      windowTimeout: 2000,
    }
    return expect(prettify(command)).resolves.toMatchSnapshot()
  })
})
