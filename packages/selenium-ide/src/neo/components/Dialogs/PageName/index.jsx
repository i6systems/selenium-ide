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

export default class PageNameDialog extends React.Component {
  static propTypes = {
    isSelectingPageName: PropTypes.bool,
  }
  render() {
    return (
      <Modal className="stripped" isOpen={this.props.isSelectingPageName}>
        <PageNameDialogContents {...this.props} />
      </Modal>
    )
  }
}

class PageNameDialogContents extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pageName: '',
    }
    this.onPageNameChange = this.onPageNameChange.bind(this)
  }
  static propTypes = {
    onPageNameSelection: PropTypes.func,
    cancel: PropTypes.func,
  }
  onPageNameChange(pageName) {
    this.setState({ pageName })
  }
  render() {
    return (
      <DialogContainer
        title="Set your test's page name"
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
              disabled={!this.state.pageName}
              onClick={() => {
                this.props.onPageNameSelection(this.state.pageName)
              }}
            >
              confirm
            </FlatButton>
          </div>
        )}
        onRequestClose={this.props.cancel}
      >
        <p>
          Before you can start recording, you must specify a valid page name for
          your project. This will be used in the Given step as the name of the
          initial page load.
        </p>
        <LabelledInput
          name="pageName"
          label="Page name"
          placeholder="Initial page name"
          value={this.state.pageName}
          onChange={this.onPageNameChange}
          autoFocus
        />
      </DialogContainer>
    )
  }
}
