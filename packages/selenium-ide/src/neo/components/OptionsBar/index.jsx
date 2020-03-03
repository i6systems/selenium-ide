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
import AutoComplete from '../AutoComplete'
import './style.css'

export default class OptionsBar extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    urls: PropTypes.array,
    setUrl: PropTypes.func.isRequired,
    pageName: PropTypes.string.isRequired,
    pageNames: PropTypes.array,
    setPageName: PropTypes.func.isRequired,
    databaseName: PropTypes.string.isRequired,
    databaseNames: PropTypes.array,
    setDatabaseName: PropTypes.func.isRequired,
  }
  render() {
    return (
      <div className="options">
        <div>
          <AutoComplete
            items={this.props.urls ? this.props.urls : []}
            value={this.props.url}
            inputProps={{
              type: 'url',
              placeholder: 'Playback base URL',
            }}
            onChange={e => {
              this.props.setUrl(e.target.value)
            }}
            onSelect={this.props.setUrl}
          />
          <AutoComplete
            items={this.props.pageNames ? this.props.pageNames : []}
            value={this.props.pageName}
            inputProps={{
              type: 'string',
              placeholder: 'Starting Page Name',
            }}
            onChange={e => {
              this.props.setPageName(e.target.value)
            }}
            onSelect={this.props.setPageName}
          />
          <AutoComplete
            items={this.props.databaseNames ? this.props.databaseNames : []}
            value={this.props.databaseName}
            inputProps={{
              type: 'string',
              placeholder: 'Database to use',
            }}
            onChange={e => {
              this.props.setDatabaseName(e.target.value)
            }}
            onSelect={this.props.setDatabaseName}
          />
        </div>
      </div>
    )
  }
}
