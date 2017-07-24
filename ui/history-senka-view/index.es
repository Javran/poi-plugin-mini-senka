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
import { modifyObject } from 'subtender'

import { PTyp } from '../../ptyp'
import { __ } from '../../tr'

import {
  monthRecordsInfoSelector,
  monthSelector,
  monthRecordInfoSelector,
} from './selectors'

import {
  mapDispatchToProps,
} from '../../store'

const fmtTime = t => moment(t).format('YYYY-MM-DD HH:mm')

class HistorySenkaViewImpl extends Component {
  static propTypes = {
    monthRecordInfo: PTyp.array.isRequired,
    monthRecordsInfo: PTyp.array.isRequired,
    month: PTyp.string,
    uiModify: PTyp.func.isRequired,
  }

  static defaultProps = {
    month: null,
  }

  handleChangeMonth = month =>
    this.props.uiModify(
      modifyObject(
        'history',
        modifyObject(
          'month', () => month
        )
      )
    )

  monthToStr = month => {
    if (month === null)
      return __('HistoryNotSelected')

    const {monthRecordsInfo} = this.props
    const info = monthRecordsInfo.find(x => x.month === month)
    const {tsFirst, tsLast} = info
    return `${fmtTime(tsFirst)} ~ ${fmtTime(tsLast)}`
  }

  render() {
    const {
      monthRecordsInfo,
      month,
      monthRecordInfo,
    } = this.props
    return (
      <Panel
        header={
          <div>{__('History')}</div>
        }>
        <ButtonGroup
          style={{padding: 10}}
          fill justified>
          <DropdownButton
            onSelect={this.handleChangeMonth}
            title={this.monthToStr(month)}
            id="mini-senka-history-label-dropdown">
            <MenuItem key="none" eventKey={null}>None</MenuItem>
            {
              monthRecordsInfo.map(({month: curMonth}) => (
                <MenuItem key={curMonth} eventKey={curMonth}>
                  {this.monthToStr(curMonth)}
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
                {__('FirstRecord')}
              </th>
              <th style={{width: '32%', textAlign: 'center'}}>
                {__('LastRecord')}
              </th>
              <th style={{width: 'auto', textAlign: 'center'}}>
                {__('Senka')}
              </th>
            </tr>
          </thead>
          <tbody>
            {
              monthRecordInfo.map(historyInfo => {
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
    monthRecordsInfo: monthRecordsInfoSelector,
    month: monthSelector,
    monthRecordInfo: monthRecordInfoSelector,
  }),
  mapDispatchToProps,
)(HistorySenkaViewImpl)

export { HistorySenkaView }
