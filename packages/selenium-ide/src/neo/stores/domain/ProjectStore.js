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

import { action, observable, computed, reaction, toJS } from 'mobx'
import uuidv4 from 'uuid/v4'
import naturalCompare from 'string-natural-compare'
import TestCase from '../../models/TestCase'
import Suite from '../../models/Suite'
import { VERSIONS } from '../../IO/migrate'
import Command from '../../models/Command'

export default class ProjectStore {
  @observable
  id = uuidv4()
  @observable
  modified = false
  @observable
  name = ''
  @observable
  url = ''
  @observable
  pageName = ''
  @observable
  databaseName = ''
  @observable
  userName = ''
  @observable
  plugins = []
  @observable
  _tests = []
  @observable
  _suites = []
  @observable
  _urls = []
  @observable
  _pageNames = []
  @observable
  _databaseNames = []
  @observable
  _userNames = []
  @observable
  version = VERSIONS[VERSIONS.length - 1]

  constructor(name = 'Untitled Project') {
    this.name = name
    this.changedTestDisposer = reaction(
      () => this._tests.find(({ modified }) => modified),
      modified => {
        if (modified) this.setModified(true)
      }
    )
    this.changeTestsDisposer = reaction(
      () => this._tests.length,
      () => this.setModified(true)
    )
    this.changedSuiteDisposer = reaction(
      () => this._suites.find(({ modified }) => modified),
      modified => {
        if (modified) this.setModified(true)
      }
    )
    this.changeSuitesDisposer = reaction(
      () => this._suites.length,
      () => this.setModified(true)
    )
    this.toJS = this.toJS.bind(this)
    this.dispose = this.dispose.bind(this)
  }

  @computed
  get suites() {
    return this._suites
      .slice()
      .sort((s1, s2) => naturalCompare(s1.name, s2.name))
  }

  @computed
  get tests() {
    return this._tests
      .slice()
      .sort((t1, t2) => naturalCompare(t1.name, t2.name))
  }

  @computed
  get urls() {
    return this._urls.slice().sort()
  }

  @action.bound
  setUrl(url) {
    this.url = url
    this.setModified(true)
  }

  @action.bound
  addUrl(urlToAdd) {
    if (urlToAdd) {
      const url = new URL(urlToAdd).href
      if (!this._urls.find(u => u === url)) {
        this._urls.push(url)
        this.setModified(true)
      }
    }
  }

  @action.bound
  addCurrentUrl() {
    this.addUrl(this.url)
  }

  @computed
  get pageNames() {
    return this._pageNames.slice().sort()
  }

  @action.bound
  setPageName(pageName) {
    this.pageName = pageName
    this.setModified(true)
  }

  @action.bound
  addPageName(pageNameToAdd) {
    if (pageNameToAdd) {
      if (!this._pageNames.find(u => u === pageNameToAdd)) {
        this._pageNames.push(pageNameToAdd)
        this.setModified(true)
      }
    }
  }

  @action.bound
  addCurrentPageName() {
    this.addPageName(this.pageName)
  }

  @computed
  get databaseNames() {
    return this._databaseNames.slice().sort()
  }

  @action.bound
  setDatabaseName(databaseName) {
    this.databaseName = databaseName
    this.setModified(true)
  }

  @action.bound
  addDatabaseName(databaseNameToAdd) {
    if (databaseNameToAdd) {
      if (!this._databaseNames.find(u => u === databaseNameToAdd)) {
        this._databaseNames.push(databaseNameToAdd)
        this.setModified(true)
      }
    }
  }

  @action.bound
  addCurrentDatabaseName() {
    this.addDatabaseName(this.databaseName)
  }

  @computed
  get userNames() {
    return this._userNames.slice().sort()
  }

  @action.bound
  setUserName(userName) {
    this.userName = userName
    this.setModified(true)
  }

  @action.bound
  addUserName(userNameToAdd) {
    if (userNameToAdd) {
      if (!this._userNames.find(u => u === userNameToAdd)) {
        this._userNames.push(userNameToAdd)
        this.setModified(true)
      }
    }
  }

  @action.bound
  addCurrentUserName() {
    this.addUserName(this.userName)
  }

  @action.bound
  changeName(name) {
    this.name = name.replace(/<[^>]*>/g, '') // firefox adds unencoded html elements to the string, strip them
    this.setModified(true)
  }

  @action.bound
  setModified(modified = true) {
    this.modified = modified
  }

  @action.bound
  createSuite(...argv) {
    const suite = new Suite(undefined, ...argv)
    this._suites.push(suite)

    return suite
  }

  @action.bound
  deleteSuite(suite) {
    this._suites.remove(suite)
  }

  @action.bound
  createTestCase(...argv) {
    const test = new TestCase(undefined, ...argv)
    this.addTestCase(test)

    return test
  }

  @action.bound
  addTestCase(test, dontDuplicate) {
    if (!test || !(test instanceof TestCase)) {
      throw new Error(
        `Expected to receive TestCase instead received ${
          test ? test.constructor.name : test
        }`
      )
    } else {
      let foundNumber = 0
      let duplicate = false
      // handle duplicate names -> name (1)
      // by using the sorted array we can do it in one read of the array
      this.tests.forEach(t => {
        if (t.id === test.id && dontDuplicate === true) {
          duplicate = true
          return
        }
        if (
          t.name === (foundNumber ? `${test.name} (${foundNumber})` : test.name)
        ) {
          foundNumber++
        }
      })
      if (duplicate === false) {
        if (foundNumber) {
          test.name = `${test.name} (${foundNumber})`
        }
        this._tests.push(test)
      }
      return test
    }
  }

  @action.bound
  addSuite(suite) {
    let duplicate = false
    this.suites.forEach((s, i) => {
      if (s.id === suite.id) {
        duplicate = true
        suite._tests.forEach(test => {
          let testExists = false
          this.suites[i]._tests.forEach(t => {
            if (t.id === test.id) {
              testExists = true
            }
          })
          if (testExists === false) {
            this.suites[i]._tests.push(test)
          }
        })
      }
    })
    if (duplicate === false) {
      this._suites.push(suite)
    }
  }

  @action.bound
  duplicateTestCase(test) {
    const test2 = test.export()
    delete test2.id
    test2.commands.forEach(cmd => {
      delete cmd.id
    })
    const toBeAdded = TestCase.fromJS(test2)
    this.addTestCase(toBeAdded)
  }

  @action.bound
  deleteTestCase(test) {
    if (!test || !(test instanceof TestCase)) {
      throw new Error(
        `Expected to receive TestCase instead received ${
          test ? test.constructor.name : test
        }`
      )
    } else {
      this.suites.forEach(suite => {
        suite.removeTestCase(test)
      })
      this._tests.remove(test)
    }
  }

  @action.bound
  registerPlugin(plugin) {
    const existsInPlugins = this.plugins.findIndex(p => p.id === plugin.id)
    if (existsInPlugins !== -1) {
      this.plugins[existsInPlugins] = plugin
    } else {
      this.plugins.push(plugin)
    }
  }

  @action.bound
  saved() {
    this._tests.forEach(test => {
      test.modified = false
    })
    this._suites.forEach(test => {
      test.modified = false
    })
    this.setModified(false)
  }

  @action.bound
  fromJS(jsRep) {
    this.name = jsRep.name
    this.setUrl(jsRep.url)
    this.setPageName(jsRep.pageName)
    this.setDatabaseName(jsRep.databaseName)
    this.setUserName(jsRep.userName)
    this._tests.replace(jsRep.tests.map(TestCase.fromJS))
    this._suites.replace(
      jsRep.suites.map(suite => Suite.fromJS(suite, this.tests))
    )
    this._urls.clear()
    jsRep.urls.forEach(url => {
      this.addUrl(url)
    })
    this._pageNames.clear()
    jsRep.pageNames.forEach(pageName => {
      this.addPageName(pageName)
    })
    this._databaseNames.clear()
    jsRep.databaseNames.forEach(databaseName => {
      this.addDatabaseName(databaseName)
    })
    this._userNames.clear()
    jsRep.userNames.forEach(userName => {
      this.addUserName(userName)
    })
    this.plugins.replace(jsRep.plugins)
    this.version = jsRep.version
    this.id = jsRep.id || uuidv4()
    this.saved()
  }

  mergeFromJS(jsRep) {
    jsRep.tests.forEach(testJs => {
      let test = TestCase.fromJS(testJs)
      this.addTestCase(test, true)
    })
    jsRep.suites.forEach(suiteJs => {
      let suite = Suite.fromJS(suiteJs, this.tests)
      this.addSuite(suite)
    })
    jsRep.urls.forEach(url => {
      this.addUrl(url)
    })
    jsRep.pageNames.forEach(pageName => {
      this.addPageName(pageName)
    })
    jsRep.databaseNames.forEach(databaseName => {
      this.addDatabaseName(databaseName)
    })
    jsRep.userNames.forEach(userName => {
      this.addUserName(userName)
    })
    this.setModified(true)
  }

  importGherkinFile(contents, baseUrl, pageName, databaseName, userName) {
    let lines = contents.split('\n')
    let test = new TestCase()
    test.name = 'New Test'
    let firstCommand = true
    let numCommand = 0
    lines.forEach(line => {
      line = line.trim()
      let elements = line.split(' ', 1)
      let gherkinCommands = ['And', 'Given', 'When', 'Then']
      let command = elements[0]
      if (command !== undefined) {
        let restOfLine = line.substring(command.length + 1)
        if (gherkinCommands.includes(command)) {
          if (restOfLine !== '') {
            let skip = false
            if (firstCommand) {
              const given1 = test.createCommand(0)
              given1.setCommand('Given')
              given1.setTarget('I reset the "' + databaseName + '" database')
              given1.setValue('1')
              const given2 = test.createCommand(1)
              given2.setCommand('And')
              given2.setTarget('I log in as "' + userName + '"')
              given2.setValue('1')
              const given3 = test.createCommand(2)
              given3.setCommand('And')
              let step = `I am on the ${pageName} page`
              given3.setTarget(step)
              //if the first step in the gherkin file is a given command and
              //the step matches our automatic initial given step,
              //we skip this step from the gherkin file so that it is not duplicated
              //if it is a given but does not match our automatic initial step
              //we convert it into an and
              if (command === 'Given') {
                if (restOfLine === step) {
                  skip = true
                } else {
                  command = 'And'
                }
              }
              const open = test.createCommand(3)
              open.setCommand('open')
              open.setTarget(baseUrl)
              firstCommand = false
            }
            if (!skip) {
              let testCommand = new Command()
              testCommand.setCommand(command.toLowerCase())
              testCommand.setTarget(restOfLine)
              test.addCommand(testCommand)
              if (++numCommand === 2) {
                test.selectedCommand = testCommand
              }
            }
          }
        } else if (command === 'Scenario:') {
          test.name = restOfLine
        }
      }
    })
    this.addTestCase(test)
    this.setModified(true)
    return test
  }

  dispose() {
    this.changeTestsDisposer()
    this.changedTestDisposer()
    this.changeSuitesDisposer()
    this.changedSuiteDisposer()
  }

  toJS() {
    return toJS({
      id: this.id,
      version: this.version,
      name: this.name,
      url: this.url,
      pageName: this.pageName,
      databaseName: this.databaseName,
      userName: this.userName,
      tests: this._tests.map(t => t.export()),
      suites: this._suites.map(s => s.export()),
      urls: this._urls,
      pageNames: this._pageNames,
      databaseNames: this._databaseNames,
      userNames: this._userNames,
      plugins: this.plugins,
    })
  }
}
