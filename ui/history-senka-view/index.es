import { createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Panel,
  DropdownButton, MenuItem,
  Table,
  ButtonGroup,
} from 'react-bootstrap'
import moment from 'moment'

import { PTyp } from '../../ptyp'
import { modifyObject } from '../../utils'

import {
  recordPrefixesInfoSelector,
  prefixSelector,
  historyInfoListSelector,
} from './selectors'

import {
  mapDispatchToProps,
} from '../../store'

const fmtTime = t => moment(t).format('YYYY-MM-DD HH:mm')

class HistorySenkaViewImpl extends Component {
  static propTypes = {
    historyInfoList: PTyp.array.isRequired,
    recordPrefixesInfo: PTyp.array.isRequired,
    prefix: PTyp.string,
    uiModify: PTyp.func.isRequired,
  }

  static defaultProps = {
    prefix: null,
  }

  handleChangePrefix = prefix =>
    this.props.uiModify(
      modifyObject(
        'history',
        modifyObject(
          'prefix', () => prefix
        )
      )
    )

  prefixToStr = prefix => {
    if (prefix === null)
      return 'None'

    const {recordPrefixesInfo} = this.props
    const info = recordPrefixesInfo.find(x => x.prefix === prefix)
    const {tsFirst, tsLast} = info
    return `${fmtTime(tsFirst)} ~ ${fmtTime(tsLast)}`
  }

  render() {
    const {
      recordPrefixesInfo,
      prefix,
      historyInfoList,
    } = this.props
    return (
      <Panel
        header={
          <div>History</div>
        }>
        <ButtonGroup
          style={{padding: 10}}
          fill justified>
          <DropdownButton
            onSelect={this.handleChangePrefix}
            title={this.prefixToStr(prefix)}
            id="mini-senka-history-label-dropdown">
            <MenuItem key="none" eventKey={null}>None</MenuItem>
            {
              recordPrefixesInfo.map(({prefix: curPrefix}) => (
                <MenuItem key={curPrefix} eventKey={curPrefix}>
                  {this.prefixToStr(curPrefix)}
                </MenuItem>
              ))
            }
          </DropdownButton>
        </ButtonGroup>
        <Table
          style={{tableLayout: 'fixed'}}
          fill
          bordered condensed hover>
          <thead>
            <tr>
              <th style={{width: '32%', textAlign: 'center'}}>
                First Record
              </th>
              <th style={{width: '32%', textAlign: 'center'}}>
                Last Record
              </th>
              <th style={{width: 'auto', textAlign: 'center'}}>
                Senka
              </th>
            </tr>
          </thead>
          <tbody>
            {
              historyInfoList.map(historyInfo => {
                const {key, tsFirst, tsLast, expDiff} = historyInfo
                const senkaDiff = expDiff * 7 / 10000
                const cellStyle = {
                  verticalAlign: 'middle',
                  textAlign: 'center',
                }

                return (
                  <tr key={key}>
                    <td
                      style={cellStyle}>
                      {fmtTime(tsFirst)}
                    </td>
                    <td
                      style={cellStyle}>
                      {fmtTime(tsLast)}
                    </td>
                    <td
                      style={{
                        ...cellStyle,
                        fontSize: '1.2em',
                        fontWeight: 'bold',
                      }}>
                      {senkaDiff.toFixed(2)}
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </Panel>
    )
  }
}

const HistorySenkaView = connect(
  createStructuredSelector({
    recordPrefixesInfo: recordPrefixesInfoSelector,
    prefix: prefixSelector,
    historyInfoList: historyInfoListSelector,
  }),
  mapDispatchToProps,
)(HistorySenkaViewImpl)

export { HistorySenkaView }
