import React, { PureComponent } from 'react'
import {
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'
import { PTyp } from '../../ptyp'

class BossCountCell extends PureComponent {
  static propTypes = {
    prefix: PTyp.string.isRequired,
    bossCount: PTyp.number.isRequired,
    bossRanks: PTyp.array.isRequired,
  }
  render() {
    const {bossCount, bossRanks, prefix} = this.props
    const content = (<div>{bossCount}</div>)

    return bossRanks.length > 0 ? (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id={`${prefix}boss-count`}>
            {
              bossRanks.map(({winRank, count}) => (
                <div key={winRank}>
                  {`${winRank}: ${count}`}
                </div>
              ))
            }
          </Tooltip>
        }
      >
        {content}
      </OverlayTrigger>
    ) : content
  }
}

export { BossCountCell }
