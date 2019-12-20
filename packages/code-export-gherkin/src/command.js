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

export const emitters = {
  addSelection: emitStep,
  answerOnNextPrompt: emitStep,
  assert: emitStep,
  assertAlert: emitStep,
  assertChecked: emitStep,
  assertConfirmation: emitStep,
  assertEditable: emitStep,
  assertElementPresent: emitStep,
  assertElementNotPresent: emitStep,
  assertNotChecked: emitStep,
  assertNotEditable: emitStep,
  assertNotSelectedValue: emitStep,
  assertNotText: emitStep,
  assertPrompt: emitStep,
  assertSelectedLabel: emitStep,
  assertSelectedValue: emitStep,
  assertValue: emitStep,
  assertText: emitStep,
  assertTitle: emitStep,
  check: emitStep,
  chooseCancelOnNextConfirmation: emitStep,
  chooseCancelOnNextPrompt: emitStep,
  chooseOkOnNextConfirmation: emitStep,
  click: emitStep,
  clickAt: emitStep,
  close: emitStep,
  debugger: emitStep,
  do: emitStep,
  doubleClick: emitStep,
  doubleClickAt: emitStep,
  dragAndDropToObject: emitStep,
  echo: emitStep,
  editContent: emitStep,
  else: emitStep,
  elseIf: emitStep,
  end: emitStep,
  executeScript: emitStep,
  executeAsyncScript: emitStep,
  forEach: emitStep,
  if: emitStep,
  mouseDown: emitStep,
  mouseDownAt: emitStep,
  mouseMove: emitStep,
  mouseMoveAt: emitStep,
  mouseOver: emitStep,
  mouseOut: emitStep,
  mouseUp: emitStep,
  mouseUpAt: emitStep,
  open: emitStep,
  pause: emitStep,
  removeSelection: emitStep,
  repeatIf: emitStep,
  run: emitStep,
  runScript: emitStep,
  select: emitStep,
  selectFrame: emitStep,
  selectWindow: emitStep,
  sendKeys: emitStep,
  setSpeed: emitStep,
  setWindowSize: emitStep,
  store: emitStep,
  storeAttribute: emitStep,
  storeJson: emitStep,
  storeText: emitStep,
  storeTitle: emitStep,
  storeValue: emitStep,
  storeWindowHandle: emitStep,
  storeXpathCount: emitStep,
  submit: emitStep,
  times: emitStep,
  type: emitStep,
  uncheck: emitStep,
  verify: emitStep,
  verifyChecked: emitStep,
  verifyEditable: emitStep,
  verifyElementPresent: emitStep,
  verifyElementNotPresent: emitStep,
  verifyNotChecked: emitStep,
  verifyNotEditable: emitStep,
  verifyNotSelectedValue: emitStep,
  verifyNotText: emitStep,
  verifySelectedLabel: emitStep,
  verifySelectedValue: emitStep,
  verifyText: emitStep,
  verifyTitle: emitStep,
  verifyValue: emitStep,
  waitForElementEditable: emitStep,
  waitForElementPresent: emitStep,
  waitForElementVisible: emitStep,
  waitForElementNotEditable: emitStep,
  waitForElementNotPresent: emitStep,
  waitForElementNotVisible: emitStep,
  waitForText: emitStep,
  webdriverAnswerOnVisiblePrompt: emitStep,
  webdriverChooseCancelOnVisibleConfirmation: emitStep,
  webdriverChooseCancelOnVisiblePrompt: emitStep,
  webdriverChooseOkOnVisibleConfirmation: emitStep,
  while: emitStep,
}

exporter.register.preprocessors(emitters)

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

function emitStep(_locator, _value, comment) {
  let result = undefined
  if (comment && comment !== '-') {
    result = `        ${comment}`
  }
  return Promise.resolve(result)
}

export default {
  canEmit,
  emit,
  register,
  extras: { emitWaitForWindow, emitNewWindowHandling },
}
