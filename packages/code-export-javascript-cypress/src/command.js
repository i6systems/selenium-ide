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
import location from './location'

let activeKeyword

let emittedSteps = []

let emitting

export const emitters = {
  addSelection: emitSelect,
  and: emitAnd,
  answerOnNextPrompt: skip,
  assert: emitAssert,
  assertAlert: skip,
  assertChecked: emitVerifyChecked,
  assertConfirmation: skip,
  assertEditable: emitVerifyEditable,
  assertElementPresent: emitVerifyElementPresent,
  assertElementNotPresent: emitVerifyElementNotPresent,
  assertNotChecked: emitVerifyNotChecked,
  assertNotEditable: emitVerifyNotEditable,
  assertNotSelectedValue: emitVerifyNotSelectedValue,
  assertNotText: emitVerifyNotText,
  assertPrompt: skip,
  assertSelectedLabel: emitVerifySelectedLabel,
  assertSelectedValue: emitVerifyValue,
  assertValue: emitVerifyValue,
  assertText: emitVerifyText,
  assertTitle: emitVerifyTitle,
  check: emitCheck,
  chooseCancelOnNextConfirmation: skip,
  chooseCancelOnNextPrompt: skip,
  chooseOkOnNextConfirmation: skip,
  click: emitClick,
  clickAt: emitClick,
  close: skip,
  debugger: skip,
  do: skip,
  doubleClick: emitDoubleClick,
  doubleClickAt: emitDoubleClick,
  dragAndDropToObject: emitDragAndDrop,
  echo: emitEcho,
  editContent: emitEditContent,
  else: skip,
  elseIf: skip,
  end: skip,
  executeScript: skip,
  executeAsyncScript: skip,
  forEach: skip,
  given: emitGiven,
  if: skip,
  mouseDown: emitMouseDown,
  mouseDownAt: emitMouseDown,
  mouseMove: emitMouseMove,
  mouseMoveAt: emitMouseMove,
  mouseOver: emitMouseMove,
  mouseOut: emitMouseOut,
  mouseUp: emitMouseUp,
  mouseUpAt: emitMouseUp,
  open: emitOpen,
  pause: emitPause,
  removeSelection: emitSelect,
  repeatIf: skip,
  run: emitRun,
  runScript: skip,
  select: emitSelect,
  selectFrame: skip,
  selectWindow: skip,
  sendKeys: emitSendKeys,
  setSpeed: skip,
  setWindowSize: emitSetWindowSize,
  store: emitStore,
  storeAttribute: emitStoreAttribute,
  storeJson: emitStoreJson,
  storeText: emitStoreText,
  storeTitle: emitStoreTitle,
  storeValue: emitStoreValue,
  storeWindowHandle: skip,
  storeXpathCount: emitStoreXpathCount,
  submit: emitSubmit,
  then: emitThen,
  times: skip,
  type: emitSendKeys,
  uncheck: emitUncheck,
  verify: emitAssert,
  verifyChecked: emitVerifyChecked,
  verifyEditable: emitVerifyEditable,
  verifyElementPresent: emitVerifyElementPresent,
  verifyElementNotPresent: emitVerifyElementNotPresent,
  verifyNotChecked: emitVerifyNotChecked,
  verifyNotEditable: emitVerifyNotEditable,
  verifyNotSelectedValue: emitVerifyNotSelectedValue,
  verifyNotText: emitVerifyNotText,
  verifySelectedLabel: emitVerifySelectedLabel,
  verifySelectedValue: emitVerifyValue,
  verifyText: emitVerifyText,
  verifyTitle: emitVerifyTitle,
  verifyValue: emitVerifyValue,
  waitForElementEditable: emitVerifyEditable,
  waitForElementPresent: emitVerifyElementPresent,
  waitForElementVisible: emitWaitForElementVisible,
  waitForElementNotEditable: emitVerifyNotEditable,
  waitForElementNotPresent: emitVerifyElementNotPresent,
  waitForElementNotVisible: emitWaitForElementNotVisible,
  webdriverAnswerOnVisiblePrompt: skip,
  waitForText: emitVerifyText,
  webdriverChooseCancelOnVisibleConfirmation: skip,
  webdriverChooseCancelOnVisiblePrompt: skip,
  webdriverChooseOkOnVisibleConfirmation: skip,
  when: emitWhen,
  while: skip,
}

exporter.register.preprocessors(emitters)

function init() {
  activeKeyword = null
  emitting = true
}

function register(command, emitter) {
  exporter.register.emitter({ command, emitter, emitters })
}

function emit(command) {
  if (
    command.command !== 'and' &&
    command.command !== 'given' &&
    command.command !== 'then' &&
    command.command !== 'when' &&
    emitting === false
  ) {
    return skip()
  }

  return exporter.emit.command(command, emitters[command.command], {
    variableLookup,
    emitNewWindowHandling,
  })
}

function canEmit(commandName) {
  return !!emitters[commandName]
}

function variableLookup(varName) {
  return `vars["${varName}"]`
}

function variableSetter(varName, value) {
  return varName ? `vars["${varName}"] = ${value}` : ''
}

function emitWaitForWindow() {
  return skip()
}

async function emitNewWindowHandling() {
  return skip()
}

function emitAssert(varName, value) {
  return Promise.resolve(`expect(vars['${varName}']).to.equal('${value}')`)
}

async function emitCheck(locator) {
  return Promise.resolve(
    `${await location.emit(locator)}.check({ force:true })`
  )
}

async function emitClick(locator) {
  return Promise.resolve(
    `${await location.emit(locator)}.click({ force:true })`
  )
}

async function emitDoubleClick(locator) {
  return Promise.resolve(
    `${await location.emit(locator)}.dblclick({ force:true })`
  )
}

async function emitDragAndDrop(dragged, dropped) {
  const commands = [
    { level: 0, statement: `{` },
    {
      level: 1,
      statement: `${await location.emit(dragged)}.trigger('dragstart')`,
    },
    {
      level: 1,
      statement: `${await location.emit(dropped)}.trigger('drop')`,
    },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitEcho(message) {
  const _message = message.startsWith('vars[') ? message : `"${message}"`
  return Promise.resolve(`cy.log(${_message})`)
}

async function emitEditContent(locator, content) {
  return Promise.resolve(`
    ${await location.emit(
      locator
    )}.then($element => { $element.innerText = '${content}' }"`)
}

async function emitMouseDown(locator) {
  return Promise.resolve(`${await location.emit(locator)}.trigger('mousedown')`)
}

async function emitMouseMove(locator) {
  return Promise.resolve(`${await location.emit(locator)}.trigger('mousemove')`)
}

async function emitMouseOut(locator) {
  return Promise.resolve(`
    ${await location.emit(locator)}.trigger('mouseleave')`)
}

async function emitMouseUp(locator) {
  return Promise.resolve(`${await location.emit(locator)}.trigger('mouseup')`)
}

function emitOpen(target) {
  const url = /^(file|http|https):\/\//.test(target)
    ? `"${target}"`
    : `"${global.baseUrl}${target}"`
  return Promise.resolve(`cy.visit(${url})`)
}

async function emitPause(time) {
  const commands = [{ level: 0, statement: `cy.wait(${time})` }]
  return Promise.resolve({ commands })
}

async function emitRun(testName) {
  return Promise.resolve(`${exporter.parsers.sanitizeName(testName)}()`)
}

async function emitSetWindowSize(size) {
  const [width, height] = size.split('x')
  return Promise.resolve(`cy.viewport(${width}, ${height})`)
}

async function emitSelect(selectElement, option) {
  if (option.startsWith('label=')) {
    option = option.substring(6)
  }
  return Promise.resolve(
    `${await location.emit(selectElement)}.select('${option}', { force:true })`
  )
}

function generateSendKeysInput(value) {
  if (typeof value === 'object') {
    return value
      .map(s => {
        if (s.startsWith('vars[')) {
          return s
        } else if (s.startsWith('Key[')) {
          const key = s.match(/\['(.*)'\]/)[1]
          return `Key.${key}`
        } else {
          return `"${s}"`
        }
      })
      .join(', ')
  } else {
    if (value.startsWith('vars[')) {
      return value
    } else {
      return `"${value}"`
    }
  }
}

async function emitSendKeys(locator, value) {
  return Promise.resolve(
    `${await location.emit(locator)}.type(${generateSendKeysInput(
      value
    )}, { force:true })`
  )
}

async function emitStore(value, varName) {
  return Promise.resolve(variableSetter(varName, `"${value}"`))
}

async function emitStoreAttribute(locator, varName) {
  const attributePos = locator.lastIndexOf('@')
  const elementLocator = locator.slice(0, attributePos)
  const attributeName = locator.slice(attributePos + 1)

  const commands = [
    {
      level: 0,
      statement: `${await location.emit(
        elementLocator
      )}.its('${attributeName}').then(value => {`,
    },
    { level: 1, statement: `${variableSetter(varName, 'value')}` },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitStoreJson(json, varName) {
  return Promise.resolve(variableSetter(varName, `JSON.parse('${json}')`))
}

async function emitStoreText(locator, varName) {
  const commands = [
    {
      level: 0,
      statement: `${await location.emit(locator)}.text().then(text => {`,
    },
    { level: 1, statement: `${variableSetter(varName, 'text')}` },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitStoreTitle(_, varName) {
  const commands = [
    {
      level: 0,
      statement: `cy.title().then(title => {`,
    },
    { level: 1, statement: `${variableSetter(varName, 'title')}` },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitStoreValue(locator, varName) {
  const commands = [
    {
      level: 0,
      statement: `${await location.emit(locator)}.its('value').then(value => {`,
    },
    { level: 1, statement: `${variableSetter(varName, 'value')}` },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitStoreXpathCount(locator, varName) {
  const commands = [
    {
      level: 0,
      statement: `${await location.emit(
        locator
      )}.its('length').then(count => {`,
    },
    { level: 1, statement: `${variableSetter(varName, 'count')}` },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitSubmit(locator) {
  return Promise.resolve(
    `${await location.emit(locator)}.submit({ force:true })`
  )
}

async function emitUncheck(locator) {
  return Promise.resolve(
    `${await location.emit(locator)}.uncheck({ force:true })`
  )
}

async function emitVerifyChecked(locator) {
  return Promise.resolve(
    `${await location.emit(locator)}.should('have.prop', 'checked')`
  )
}

async function emitVerifyEditable(locator) {
  return Promise.resolve(`${await location.emit(locator)}.should('be.enabled')`)
}

async function emitVerifyElementPresent(locator) {
  return Promise.resolve(`${await location.emit(locator)}.should('exist')`)
}

async function emitVerifyElementNotPresent(locator) {
  return Promise.resolve(`${await location.emit(locator)}.should('not.exist')`)
}

async function emitVerifyNotChecked(locator) {
  return Promise.resolve(
    `${await location.emit(locator)}.should('not.have.prop', 'checked')`
  )
}

async function emitVerifyNotEditable(locator) {
  return Promise.resolve(
    `${await location.emit(locator)}.should('not.be.enabled')`
  )
}

async function emitVerifyNotSelectedValue(locator, expectedValue) {
  return Promise.resolve(
    `${await location.emit(
      locator
    )}.should('not.have.value','${expectedValue}')`
  )
}

async function emitVerifyNotText(locator, text) {
  return Promise.resolve(
    `${await location.emit(
      locator
    )}.text().should('not.equal','${exporter.emit.text(text)}')`
  )
}

async function emitVerifySelectedLabel(locator, labelValue) {
  return Promise.resolve(
    `${await location.emit(
      locator
    )}.find(':selected').should('contain','${labelValue}')`
  )
}

async function emitVerifyText(locator, text) {
  return Promise.resolve(
    `${await location.emit(
      locator
    )}.text().should('equal','${exporter.emit.text(text)}')`
  )
}

async function emitVerifyValue(locator, value) {
  return Promise.resolve(
    `${await location.emit(locator)}.should('have.value','${value}')`
  )
}

async function emitVerifyTitle(title) {
  return Promise.resolve(`cy.title().should('equal','${title}')`)
}

function skip() {
  return Promise.resolve(undefined)
}

async function emitWaitForElementVisible(locator) {
  return Promise.resolve(`${await location.emit(locator)}.should('be.visible')`)
}

async function emitWaitForElementNotVisible(locator) {
  return Promise.resolve(
    `${await location.emit(locator)}.should('not.be.visible')`
  )
}

async function emitAnd(step) {
  if (activeKeyword === null) {
    return Promise.reject(
      new Error('"And" cannot be the first step in an scenario')
    )
  }
  return emitGherkinStep(activeKeyword, step)
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
  return emitGherkinStep('Given', step)
}

async function emitThen(step) {
  if (activeKeyword === 'Then') {
    return Promise.reject(
      new Error(
        'You cannot have two consecutive "Then" steps, use an "And" step instead'
      )
    )
  }
  return emitGherkinStep('Then', step)
}

async function emitWhen(step) {
  if (activeKeyword === 'When') {
    return Promise.reject(
      new Error(
        'You cannot have two consecutive "When" steps, use an "And" step instead'
      )
    )
  }
  return emitGherkinStep('When', step)
}

async function emitGherkinStep(keyword, step) {
  if (step in emittedSteps) {
    emitting = false
    return skip()
  }
  emitting = true
  emittedSteps[step] = true

  let commands = []
  if (activeKeyword !== null) {
    commands.push({ level: 0, statement: `})` })
  }
  activeKeyword = keyword
  commands.push({ level: 0, statement: `` })
  commands.push({ level: 0, statement: `${keyword}(\`${step}\`, () => {` })

  return Promise.resolve({
    commands: commands,
    setStartingLevel: 0,
    endingLevelAdjustment: 1,
  })
}

export default {
  canEmit,
  emit,
  register,
  init,
  extras: { emitWaitForWindow },
}
