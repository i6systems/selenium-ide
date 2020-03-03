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

import React from 'react'
import PropTypes from 'prop-types'
import Modal from '../../Modal'
import DialogContainer from '../Dialog'
import LabelledInput from '../../LabelledInput'
import FlatButton from '../../FlatButton'

export default class DatabaseNameDialog extends React.Component {
  static propTypes = {
    isSelectingDatabaseName: PropTypes.bool,
  }
  render() {
    return (
      <Modal className="stripped" isOpen={this.props.isSelectingDatabaseName}>
        <DatabaseNameDialogContents {...this.props} />
      </Modal>
    )
  }
}

class DatabaseNameDialogContents extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      databaseName: '',
    }
    this.onDatabaseNameChange = this.onDatabaseNameChange.bind(this)
  }
  static propTypes = {
    onDatabaseNameSelection: PropTypes.func,
    cancel: PropTypes.func,
  }
  onDatabaseNameChange(databaseName) {
    this.setState({ databaseName })
  }
  render() {
    return (
      <DialogContainer
        title="Set your test's database to use"
        type="info"
        renderFooter={() => (
          <div
            className="right"
            style={{
              display: 'flex',
            }}
          >
            <FlatButton onClick={this.props.cancel}>cancel</FlatButton>
            <FlatButton
              type="submit"
              disabled={!this.state.databaseName}
              onClick={() => {
                this.props.onDatabaseNameSelection(this.state.databaseName)
              }}
            >
              confirm
            </FlatButton>
          </div>
        )}
        onRequestClose={this.props.cancel}
      >
        <p>
          Before you can start recording, you must specify a valid database to
          use for your project. This will be used in the Given step as the name
          of the database to use.
        </p>
        <LabelledInput
          name="databaseName"
          label="Database name"
          placeholder="Initial database name"
          value={this.state.databaseName}
          onChange={this.onDatabaseNameChange}
          autoFocus
        />
      </DialogContainer>
    )
  }
}
