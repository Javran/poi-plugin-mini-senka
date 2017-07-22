import React, { PureComponent } from 'react'
import moment from 'moment'

import { PTyp } from '../../ptyp'

const fmtTime = t => moment(t).format('YYYY-MM-DD HH:mm')

class Timepiece extends PureComponent {
  static propTypes = {
    header: PTyp.node.isRequired,
    timestamp: PTyp.number,
  }

  static defaultProps = {
    timestamp: null,
  }

  render() {
    const {header, timestamp} = this.props
    const timeText = timestamp ? fmtTime(timestamp) : '-'
    return (
      <div
        style={{marginTop: 5}}
      >
        <div
          style={{fontSize: '.8em'}}>
          {header}
        </div>
        <div
          style={{
            fontSize: '1.1em',
            fontWeight: 'bold',
            marginTop: 5,
            textAlign: 'center',
          }}>
          {timeText}
        </div>
      </div>
    )
  }
}

export { Timepiece }
