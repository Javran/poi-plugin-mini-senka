const defaultConfig = {
  sortieTable: {
    showAll: false,
    // a list of map ids, to show on top of the table
    // the order should be respected
    starredMapIds: [],
    // a list of hidden map ids.
    // unlike starredMapIds, the order should not matter
    hiddenMapIds: [],
  },
}

const loadConfig = () => {
  const { config } = window
  return config.get(
    'plugin.poi-plugin-mini-senka.data',
    defaultConfig)
}

const saveConfig = configData => {
  const { config } = window
  config.set(
    'plugin.poi-plugin-mini-senka.data',
    configData)
}

export {
  defaultConfig,
  loadConfig,
  saveConfig,
}
