import _ from 'lodash'
import { createStructuredSelector } from 'reselect'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import FontAwesome from 'react-fontawesome'
import { modifyObject } from 'subtender'

import {
  Table, Panel, Button,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'
import { __ } from '../../tr'
import {
  showAllConfigSelector,
  sortieInfoRowsSelector,
} from '../../selectors'
import { mapDispatchToProps } from '../../store'
import { BossCountCell } from './boss-count-cell'

class SortiesPanelImpl extends PureComponent {
  static propTypes = {
    showAll: PTyp.bool.isRequired,
    sortieInfoRows: PTyp.arrayOf(PTyp.shape({
      mapId: PTyp.number.isRequired,
      type: PTyp.oneOf(['starred','normal','hidden']).isRequired,
      sortieInfo: PTyp.object.isRequired,
    })).isRequired,
    configModify: PTyp.func.isRequired,
  }

  modifySortieTable = modifier =>
    this.props.configModify(
      modifyObject('sortieTable',modifier))

  handleToggleShowAll = () =>
    this.modifySortieTable(
      modifyObject('showAll', x => !x))

  handleStarMap = mapId => () =>
    this.modifySortieTable(
      modifyObject(
        'starredMapIds',
        xs => [...xs, mapId]))

  handleUnstarMap = mapId => () =>
    this.modifySortieTable(
      modifyObject(
        'starredMapIds',
        xs => xs.filter(x => x !== mapId)))

  handleSwapStarredMap = (mapId, dir) => () =>
    this.modifySortieTable(
      modifyObject(
        'starredMapIds',
        xs => {
          const otherIndF = {
            up: x => x-1,
            down: x => x+1,
          }[dir]

          const ind = xs.findIndex(x => x === mapId)
          if (ind === -1) {
            console.error(`mapId ${mapId} not found`)
            return xs
          }

          const otherInd = otherIndF(ind)
          if (otherInd < 0 || otherInd >= xs.length) {
            console.error('invalid action')
            return xs
          }
          const ys = [...xs]
          ys[ind] = xs[otherInd]
          ys[otherInd] = xs[ind]
          return ys
        }))

  handleHideMap = mapId => () =>
    this.modifySortieTable(
      modifyObject(
        'hiddenMapIds',
        xs => [...xs, mapId]))

  handleUnhideMap = mapId => () =>
    this.modifySortieTable(
      modifyObject(
        'hiddenMapIds',
        xs => xs.filter(x => x !== mapId)))

  renderControlCell = (cellStyle, sortieInfoRow, index, sortieInfoRows) => {
    const {type, mapId} = sortieInfoRow

    const buttons =
      type === 'starred' ? [
        index > 0 && (
          <Button
            onClick={this.handleSwapStarredMap(mapId,'up')}
            bsSize="xsmall"
            style={{width: '40%', marginTop: 0}}>
            <FontAwesome name="chevron-up" />
          </Button>
        ),
        (
          index+1 >= sortieInfoRows.length ||
          sortieInfoRows[index+1].type !== 'starred'
        ) ? (
          <Button
            onClick={this.handleUnstarMap(mapId)}
            bsSize="xsmall"
            style={{width: '40%', marginTop: 0}}>
            <FontAwesome name="star-o" />
          </Button>
        ) : (
          <Button
            onClick={this.handleSwapStarredMap(mapId,'down')}
            bsSize="xsmall"
            style={{width: '40%', marginTop: 0}}>
            <FontAwesome name="chevron-down" />
          </Button>
        ),
      ] :
      type === 'normal' ? [
        <Button
          onClick={this.handleStarMap(mapId)}
          bsSize="xsmall"
          style={{width: '40%', marginTop: 0}}>
          <FontAwesome name="star" />
        </Button>,
        <Button
          onClick={this.handleHideMap(mapId)}
          bsSize="xsmall"
          style={{width: '40%', marginTop: 0}}>
          <FontAwesome name="ban" />
        </Button>,
      ] :
      type === 'hidden' ? [
        <Button
          onClick={this.handleUnhideMap(mapId)}
          bsSize="xsmall"
          style={{width: '40%', marginTop: 0}}>
          <FontAwesome name="plus" />
        </Button>,
      ] :
      []

    const btnLeft = _.get(buttons,0,null)
    const btnRight = _.get(buttons,1,null)

    return (
      <td
        style={{
          ...cellStyle,
          textAlign: 'center',
        }}>
        {
          btnLeft
        }
        {
          btnRight && ' '
        }
        {
          btnRight
        }
      </td>
    )
  }

  render() {
    const {showAll,sortieInfoRows} = this.props
    return (
      <Panel
        style={{marginBottom: 5}}
        header={
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{flex: 1}}>
              {__('Sorties')}
            </div>
            <Button
              onClick={this.handleToggleShowAll}
              active={showAll}
              bsSize="xsmall"
              style={{
                alignSelf: 'flex-end',
                marginTop: 0,
              }}>
              {__('SortieTable.ShowAll')}
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
                {__('SortieTable.Map')}
              </th>
              <th style={{width: '25%', textAlign: 'center'}}>
                {__('SortieTable.Boss')}
              </th>
              <th style={{width: '25%', textAlign: 'center'}}>
                {__('SortieTable.Sortie')}
              </th>
              <th style={{width: 'auto', textAlign: 'center'}}>
                {__('SortieTable.Control')}
              </th>
            </tr>
          </thead>
          <tbody>
            {
              sortieInfoRows.map((sortieInfoRow,ind) => {
                const {mapId, type, sortieInfo} = sortieInfoRow
                const mapArea = Math.floor(mapId/10)
                const mapNo = mapId - mapArea*10
                const textClass =
                  type === 'starred' ? 'text-primary' :
                  type === 'normal' ? 'text-default' :
                  type === 'hidden' ? 'text-muted' :
                  ''
                const cellStyle = {
                  verticalAlign: 'middle',
                  textAlign: 'center',
                }
                return (
                  <tr key={mapId}>
                    <td
                      className={textClass}
                      style={{
                        ...cellStyle,
                        fontSize: '1.1em',
                        fontWeight: 'bold',
                      }}>
                      {`${mapArea}-${mapNo}`}
                    </td>
                    <td
                      className={textClass}
                      style={cellStyle}>
                      <BossCountCell
                        prefix={`mini-senka-tooltip-current-${mapId}-`}
                        bossCount={sortieInfo.bossCount}
                        bossRanks={sortieInfo.bossRanks}
                      />
                    </td>
                    <td
                      className={textClass}
                      style={cellStyle}>
                      {sortieInfo.sortieCount}
                    </td>
                    {
                      this.renderControlCell(
                        cellStyle,
                        sortieInfoRow,
                        ind,
                        sortieInfoRows,
                      )
                    }
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

const SortiesPanel = connect(
  createStructuredSelector({
    showAll: showAllConfigSelector,
    sortieInfoRows: sortieInfoRowsSelector,
  }),
  mapDispatchToProps,
)(SortiesPanelImpl)

export { SortiesPanel }
