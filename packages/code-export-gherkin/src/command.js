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

let activeKeyword

export const emitters = {
  addSelection: skip,
  and: emitAnd,
  answerOnNextPrompt: skip,
  assert: skip,
  assertAlert: skip,
  assertChecked: skip,
  assertConfirmation: skip,
  assertEditable: skip,
  assertElementPresent: skip,
  assertElementNotPresent: skip,
  assertNotChecked: skip,
  assertNotEditable: skip,
  assertNotSelectedValue: skip,
  assertNotText: skip,
  assertPrompt: skip,
  assertSelectedLabel: skip,
  assertSelectedValue: skip,
  assertValue: skip,
  assertText: skip,
  assertTitle: skip,
  check: skip,
  chooseCancelOnNextConfirmation: skip,
  chooseCancelOnNextPrompt: skip,
  chooseOkOnNextConfirmation: skip,
  click: skip,
  clickAt: skip,
  close: skip,
  debugger: skip,
  do: skip,
  doubleClick: skip,
  doubleClickAt: skip,
  dragAndDropToObject: skip,
  echo: skip,
  editContent: skip,
  else: skip,
  elseIf: skip,
  end: skip,
  executeScript: skip,
  executeAsyncScript: skip,
  forEach: skip,
  given: emitGiven,
  if: skip,
  mouseDown: skip,
  mouseDownAt: skip,
  mouseMove: skip,
  mouseMoveAt: skip,
  mouseOver: skip,
  mouseOut: skip,
  mouseUp: skip,
  mouseUpAt: skip,
  open: skip,
  pause: skip,
  removeSelection: skip,
  repeatIf: skip,
  run: skip,
  runScript: skip,
  select: skip,
  selectFrame: skip,
  selectWindow: skip,
  sendKeys: skip,
  setSpeed: skip,
  setWindowSize: skip,
  store: skip,
  storeAttribute: skip,
  storeJson: skip,
  storeText: skip,
  storeTitle: skip,
  storeValue: skip,
  storeWindowHandle: skip,
  storeXpathCount: skip,
  submit: skip,
  then: emitThen,
  times: skip,
  type: skip,
  uncheck: skip,
  verify: skip,
  verifyChecked: skip,
  verifyEditable: skip,
  verifyElementPresent: skip,
  verifyElementNotPresent: skip,
  verifyNotChecked: skip,
  verifyNotEditable: skip,
  verifyNotSelectedValue: skip,
  verifyNotText: skip,
  verifySelectedLabel: skip,
  verifySelectedValue: skip,
  verifyText: skip,
  verifyTextContains: skip,
  verifyTitle: skip,
  verifyValue: skip,
  waitForElementEditable: skip,
  waitForElementPresent: skip,
  waitForElementVisible: skip,
  waitForElementNotEditable: skip,
  waitForElementNotPresent: skip,
  waitForElementNotVisible: skip,
  waitForText: skip,
  waitForTextContains: skip,
  webdriverAnswerOnVisiblePrompt: skip,
  webdriverChooseCancelOnVisibleConfirmation: skip,
  webdriverChooseCancelOnVisiblePrompt: skip,
  webdriverChooseOkOnVisibleConfirmation: skip,
  when: emitWhen,
  while: skip,
}

exporter.register.preprocessors(emitters)

function init() {
  activeKeyword = null
}

function register(command, emitter) {
  exporter.register.emitter({ command, emitter, emitters })
}

function emit(command) {
  return exporter.emit.command(command, emitters[command.command], {
    variableLookup,
    emitNewWindowHandling,
  })
}

function canEmit(commandName) {
  return !!emitters[commandName]
}

function variableLookup() {
  return ''
}

function emitWaitForWindow() {
  const generateMethodDeclaration = _ => {
    return ''
  }
  const commands = [{ level: 0, statement: '' }]
  return Promise.resolve({
    name: 'waitForWindow',
    commands,
    generateMethodDeclaration,
  })
}

async function emitNewWindowHandling() {
  return Promise.resolve(undefined)
}

async function emitAnd(step) {
  if (activeKeyword === null) {
    return Promise.reject(
      new Error('"And" cannot be the first step in an scenario')
    )
  }
  return emitStep('And', step)
}

async function emitGiven(step) {
  if (activeKeyword !== null) {
    return Promise.reject(
      new Error('"Given" must be the first step in an scenario')
    )
  }
  if (activeKeyword === 'Given') {
    return Promise.reject(
      new Error(
        'You cannot have two consecutive "Given" steps, use an "And" step instead'
      )
    )
  }
  return emitStep('Given', step)
}

async function emitThen(step) {
  if (activeKeyword === 'Then') {
    return Promise.reject(
      new Error(
        'You cannot have two consecutive "Then" steps, use an "And" step instead'
      )
    )
  }
  return emitStep('Then', step)
}

async function emitWhen(step) {
  if (activeKeyword === 'When') {
    return Promise.reject(
      new Error(
        'You cannot have two consecutive "When" steps, use an "And" step instead'
      )
    )
  }
  return emitStep('When', step)
}

function emitStep(command, step) {
  let result = command + ' ' + step
  if (command !== 'And') {
    activeKeyword = command
  }
  return Promise.resolve(result)
}

function skip() {
  return Promise.resolve('')
}

export default {
  canEmit,
  emit,
  register,
  init,
  extras: { emitWaitForWindow, emitNewWindowHandling },
}
