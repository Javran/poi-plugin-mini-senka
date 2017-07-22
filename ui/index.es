import { join } from 'path-extra'
import React, { Component } from 'react'

import { CurrentSenkaView } from './current-senka-view'
import { HistorySenkaView } from './history-senka-view'

class MiniSenkaMain extends Component {
  render() {
    return (
      <div style={{margin: 10}}>
        <link
          rel="stylesheet"
          href={join(__dirname, '..', 'assets', 'mini-senka.css')}
        />
        <CurrentSenkaView />
        <HistorySenkaView />
      </div>
    )
  }
}

export { MiniSenkaMain }
