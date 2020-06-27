import _ from 'lodash'
import { createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Panel,
} from 'react-bootstrap'

import { store } from 'views/create-store'

import { __ } from '../../tr'

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
    if (lastRecord !== null) {
      // broadcast a bit of the information for other plugins to received.
      // since the predicate is on lastRecord, this resulting action
      // is guaranteed to have both expRange.first and expRange.last filled.
      // note that the existence of lastRecord also implies the existence of first one
      // as both can be the same record.
      store.dispatch({
        type: '@poi-plugin-mini-senka@SenkaUpdate',
        senkaInfo,
      })
    }
    return (
      <Panel>
        <Panel.Body>
          <div style={{display: 'flex', alignItems: 'stretch'}}>
            <Panel
              style={{width: '45%', marginRight: 10}}
            >
              <Panel.Heading>
                <div>{__('Time')}</div>
              </Panel.Heading>
              <Panel.Body>
                <Timepiece
                  header={__('FirstRecord')}
                  timestamp={
                    _.get(firstRecord,'time') || null
                  } />
                <Timepiece
                  header={__('LastRecord')}
                  timestamp={
                    _.get(lastRecord,'time') || null
                  } />
                <Timepiece
                  header={__('NextAccounting')}
                  timestamp={accountingInfo.timestamp} />
              </Panel.Body>
            </Panel>
            <Panel
              style={{width: '55%'}}
            >
              <Panel.Heading>
                <div>{__('Senka')}</div>
              </Panel.Heading>
              <Panel.Body>
                {
                  this.renderSenkaDiff(senkaInfo)
                }
              </Panel.Body>
            </Panel>
          </div>
          <SortiesPanel />
        </Panel.Body>
      </Panel>
    )
  }
}

const CurrentSenkaView = connect(createStructuredSelector({
  record: recordSelector,
  accountingInfo: accountingInfoSelector,
}))(CurrentSenkaViewImpl)

export { CurrentSenkaView }
