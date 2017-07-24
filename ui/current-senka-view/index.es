import _ from 'lodash'
import { createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Table,
  Panel,
} from 'react-bootstrap'
import moment from 'moment'

import {
  recordSelector,
  accountingInfoSelector,
} from '../../selectors'
import { PTyp } from '../../ptyp'

import { Timepiece } from './timepiece'
import { SortiesPanel } from './sorties-panel'

class CurrentSenkaViewImpl extends Component {
  static propTypes = {
    record: PTyp.object.isRequired,
    accountingInfo: PTyp.object.isRequired,
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
    const expBefore = _.get(expRange.first, 'exp')
    const expAfter = _.get(expRange.last, 'exp')
    const hqExpDiff = expAfter - expBefore
    if (! _.isFinite(hqExpDiff)) {
      return (<div style={commonStyle}>-</div>)
    }
    const senkaDiff = hqExpDiff * 7 / 10000

    return (
      <div style={commonStyle}>
        {senkaDiff.toFixed(2)}
      </div>
    )
  }

  render() {
    const {accountingInfo} = this.props
    const senkaInfo = this.props.record
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
            {
              this.renderSenkaDiff(senkaInfo)
            }
          </Panel>
        </div>
        <SortiesPanel />
      </Panel>
    )
  }
}

const CurrentSenkaView = connect(createStructuredSelector({
  record: recordSelector,
  accountingInfo: accountingInfoSelector,
}))(CurrentSenkaViewImpl)

export { CurrentSenkaView }
