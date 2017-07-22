import _ from 'lodash'
import { createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Table,
  Panel,
} from 'react-bootstrap'
import moment from 'moment'

import { computeAccountingInfo } from '../../senka-accounting'
import {
  recordsSelector,
  accountingInfoSelector,
} from '../../selectors'
import { PTyp } from '../../ptyp'

import { Timepiece } from './timepiece'
import { SortiesPanel } from './sorties-panel'

const fmtTime = t => moment(t).format('YYYY-MM-DD HH:mm')

class CurrentSenkaViewImpl extends Component {
  static propTypes = {
    records: PTyp.object,
    accountingInfo: PTyp.AccountingInfo.isRequired,
  }

  static defaultProps = {
    records: null,
  }

  renderSenkaInfo = senkaInfo => {
    const {expRange, sorties} = senkaInfo
    const expBefore = expRange.first.exp
    const expAfter = expRange.last.exp
    const hqExpDiff = expAfter - expBefore
    const senkaDiff = hqExpDiff * 7 / 10000

    const sortedMapIds =
      Object.keys(sorties).map(Number).sort((x,y) => x-y)

    return (
      <div>
        <div>
          <div style={{fontSize: '2rem'}}>
            {fmtTime(expRange.first.time)}
            {' ~ '}
            {fmtTime(expRange.last.time)}
          </div>
        </div>
        {
          <div style={{fontSize: '3rem', textAlign: 'center'}}>
            {
              senkaDiff.toFixed(2)
            }
          </div>
        }
        <Table
          striped bordered condensed hover>
          <thead>
            <tr>
              <th>Map</th>
              <th>Sortie</th>
              <th>Boss</th>
              <th>Control</th>
            </tr>
          </thead>
          <tbody>
            {
              sortedMapIds.map(mapId => {
                const mapArea = Math.floor(mapId/10)
                const mapNo = mapId - mapArea*10
                const sortieInfo = sorties[mapId]
                const bossInfo = _.isEmpty(sortieInfo.boss) ? {} : sortieInfo.boss
                return sortieInfo && sortieInfo.count > 0 && (
                  <tr key={mapId}>
                    <td>
                      {`${mapArea}-${mapNo}`}
                    </td>
                    <td>
                      {sortieInfo.count}
                    </td>
                    <td>
                      {_.sum(Object.values(bossInfo))}
                    </td>
                    <td>
                      TODO
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </div>
    )
  }

  renderSenkaDiff = senkaInfo => {
    const commonStyle = {
      fontSize: '3.2em',
      fontWeight: 'bold',
      textAlign: 'center',
    }
    if (!senkaInfo) {
      return (<div style={commonStyle}>-</div>)
    }

    const {expRange} = senkaInfo
    const expBefore = expRange.first.exp
    const expAfter = expRange.last.exp
    const hqExpDiff = expAfter - expBefore
    const senkaDiff = hqExpDiff * 7 / 10000

    return (
      <div style={commonStyle}>
        {senkaDiff.toFixed(2)}
      </div>
    )
  }

  render() {
    const {records, accountingInfo} = this.props
    const dataLabel = computeAccountingInfo(moment()).label
    const senkaInfo = _.get(records,dataLabel)
    const firstRecord = _.get(senkaInfo,'expRange.first',null)
    const lastRecord = _.get(senkaInfo,'expRange.last',null)
    return (
      <Panel>
        <div style={{display: 'flex', alignItems: 'stretch'}}>
          <Panel
            style={{width: '45%', marginRight: 10}}
            header={<div>Time</div>}>
            <Timepiece
              header="Next Accounting"
              timestamp={accountingInfo.timestamp} />
            <Timepiece
              header="First Record"
              timestamp={
                _.get(firstRecord,'time') || null
              } />
            <Timepiece
              header="Last Record"
              timestamp={
                _.get(lastRecord,'time') || null
              } />
          </Panel>
          <Panel
            style={{width: '55%'}}
            header={<div>Senka</div>}>
            {this.renderSenkaDiff(senkaInfo)}
          </Panel>
        </div>
        <SortiesPanel />
      </Panel>
    )
  }
}

const CurrentSenkaView = connect(createStructuredSelector({
  records: recordsSelector,
  accountingInfo: accountingInfoSelector,
}))(CurrentSenkaViewImpl)

export { CurrentSenkaView }
