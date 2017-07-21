import React, { Component } from 'react'

import { CurrentSenkaView } from './current-senka-view'

class MiniSenkaMain extends Component {
  render() {
    return (
      <div style={{margin: 10}}>
        <CurrentSenkaView />
        <div>History</div>
      </div>
    )
  }
}

export { MiniSenkaMain }
