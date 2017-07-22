import _ from 'lodash'
import React, { PureComponent } from 'react'
import FontAwesome from 'react-fontawesome'
import {
  Table, Panel, Button,
  ButtonGroup, ButtonToolbar,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'

class SortiesPanel extends PureComponent {
  static propTypes = {
    sorties: PTyp.object.isRequired,
  }

  render() {
    const {sorties} = this.props
    const sortedMapIds =
      Object.keys(sorties).map(Number).sort((x,y) => x-y)

    return (
      <Panel
        style={{marginBottom: 5}}
        header={
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{flex: 1}}>
              Sorties
            </div>
            <Button
              bsSize="xsmall"
              style={{
                alignSelf: 'flex-end',
                marginTop: 0,
              }}>
              Show All
            </Button>
          </div>
        }>
        <Table
          style={{tableLayout: 'fixed'}}
          fill
          bordered condensed hover>
          <thead>
            <tr>
              <th style={{width: '27%', textAlign: 'center'}}>
                Map
              </th>
              <th style={{width: '25%', textAlign: 'center'}}>
                Sortie
              </th>
              <th style={{width: '25%', textAlign: 'center'}}>
                Boss
              </th>
              <th style={{width: 'auto', textAlign: 'center'}}>
                Control
              </th>
            </tr>
          </thead>
          <tbody>
            {
              sortedMapIds.map(mapId => {
                const mapArea = Math.floor(mapId/10)
                const mapNo = mapId - mapArea*10
                const sortieInfo = sorties[mapId]
                const bossInfo = _.isEmpty(sortieInfo.boss) ? {} : sortieInfo.boss
                const cellStyle = {
                  verticalAlign: 'middle',
                  textAlign: 'center',
                }
                return sortieInfo && sortieInfo.count > 0 && (
                  <tr key={mapId}>
                    <td style={{
                      ...cellStyle,
                      fontSize: '1.1em',
                      fontWeight: 'bold',
                    }}>
                      {`${mapArea}-${mapNo}`}
                    </td>
                    <td style={cellStyle}>
                      {sortieInfo.count}
                    </td>
                    <td style={cellStyle}>
                      {_.sum(Object.values(bossInfo))}
                    </td>
                    <td
                      style={{
                        ...cellStyle,
                        textAlign: 'center',
                      }}>
                      <Button
                        bsSize="xsmall"
                        style={{width: '40%', marginTop: 0}}>
                        <FontAwesome name="chevron-up" />
                      </Button>
                      {' '}
                      <Button
                        bsSize="xsmall"
                        style={{width: '40%', marginTop: 0}}>
                        <FontAwesome name="chevron-down" />
                      </Button>
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

export { SortiesPanel }
