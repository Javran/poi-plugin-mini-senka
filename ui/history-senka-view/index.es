import _ from 'lodash'
import { createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Panel,
  Table,
  OverlayTrigger, Tooltip,
} from 'react-bootstrap'

import {
  Button,
  Menu,
  MenuItem,
  Position,
  ButtonGroup,
} from '@blueprintjs/core'

import moment from 'moment'
import { modifyObject, generalComparator } from 'subtender'

import { Popover } from 'views/components/etc/overlay'

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

  handleChangeMonth = month => () =>
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


    const menuContent = (
      <Menu>
        <MenuItem
          key="none"
          text="None"
          onClick={this.handleChangeMonth(null)}
        />
        {
          monthRecordsInfo.map(({month: curMonth}) => (
            <MenuItem
              key={curMonth}
              text={this.monthToStr(curMonth)}
              onClick={this.handleChangeMonth(curMonth)}
            />
          ))
        }
      </Menu>
    )

    return (
      <Panel>
        <Panel.Heading>
          <div>{__('History')}</div>
        </Panel.Heading>
        <Panel.Body>
          <ButtonGroup fill>
            <Popover
              content={menuContent}
              position={Position.BOTTOM}
            >
              <Button>
                {this.monthToStr(month)}
              </Button>
            </Popover>
          </ButtonGroup>
          {
            month && (
              <Table
                className="history-table"
                style={{
                  tableLayout: 'fixed',
                  marginBottom: 0,
                }}
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
                      const {key, tsFirst, tsLast, expDiff, sorties} = historyInfo
                      const senkaDiff = _.isNumber(expDiff) ? (expDiff * 7 / 10000) : null
                      const cellStyle = {
                        verticalAlign: 'middle',
                        textAlign: 'center',
                      }

                      const content = [
                        (<td key="1" style={cellStyle}>{fmtTime(tsFirst)}</td>),
                        (<td key="2" style={cellStyle}>{fmtTime(tsLast)} </td>),
                        (<td
                           key="3"
                           style={{
                             ...cellStyle,
                             fontSize: '1.2em',
                             fontWeight: 'bold',
                           }}>
                          {
                            _.isNumber(senkaDiff) ? senkaDiff.toFixed(2) : '-'
                          }
                        </td>),
                      ]

                      return _.isEmpty(sorties) ? (
                        <tr key={key}>
                          {content}
                        </tr>
                      ) : (
                        <OverlayTrigger
                          key={key}
                          placement="top"
                          overlay={(
                            <Tooltip id={`mini-senka-hist-rec-${key}`}>
                              <Table
                                style={{
                                  tableLayout: 'fixed',
                                  paddingBottom: 0,
                                  marginBottom: 0,
                                }}
                                      fill
                                      bordered condensed hover>
                                <tbody>
                                  {
                                    Object.keys(sorties).map(Number)
                                          .sort(generalComparator).map(mapId => {
                                            const area = Math.floor(mapId / 10)
                                            const num = mapId % 10
                                            const record = sorties[mapId]
                                            const bossCount = _.sum(
                                              _.compact(Object.values(record.boss))
                                            )
                                            return (
                                              <tr key={mapId}>
                                                <td>{`${area}-${num}`}</td>
                                                <td>{bossCount}</td>
                                                <td>{record.count}</td>
                                              </tr>
                                            )
                                          })
                                  }
                                </tbody>
                              </Table>
                            </Tooltip>
                          )}
                          >
                          <tr>
                            {content}
                          </tr>
                        </OverlayTrigger>
                      )
                    })
                  }
                </tbody>
              </Table>
            )
          }
        </Panel.Body>
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
