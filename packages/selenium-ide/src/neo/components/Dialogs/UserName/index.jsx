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

export default class UserNameDialog extends React.Component {
  static propTypes = {
    isSelectingUserName: PropTypes.bool,
  }
  render() {
    return (
      <Modal className="stripped" isOpen={this.props.isSelectingUserName}>
        <UserNameDialogContents {...this.props} />
      </Modal>
    )
  }
}

class UserNameDialogContents extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: '',
    }
    this.onUserNameChange = this.onUserNameChange.bind(this)
  }
  static propTypes = {
    onUserNameSelection: PropTypes.func,
    cancel: PropTypes.func,
  }
  onUserNameChange(userName) {
    this.setState({ userName })
  }
  render() {
    return (
      <DialogContainer
        title="Set your test's user to use"
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
              disabled={!this.state.userName}
              onClick={() => {
                this.props.onUserNameSelection(this.state.userName)
              }}
            >
              confirm
            </FlatButton>
          </div>
        )}
        onRequestClose={this.props.cancel}
      >
        <p>
          Before you can start recording, you must specify a valid user for your
          project. This will be used in the Given step as the email of the user
          used to log in.
        </p>
        <LabelledInput
          name="userName"
          label="User name"
          placeholder="Initial user name"
          value={this.state.userName}
          onChange={this.onUserNameChange}
          autoFocus
        />
      </DialogContainer>
    )
  }
}
