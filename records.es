import { ensureDirSync, readJsonSync, writeJsonSync } from 'fs-extra'
import { join } from 'path-extra'

const getRecordFilePath = admiralId => {
  const { APPDATA_PATH } = window
  const configPath = join(APPDATA_PATH,'mini-senka')
  ensureDirSync(configPath)
  return join(configPath,`${admiralId}.json`)
}

const loadRecords = (admiralId, onRecordReady) => {
  try {
    onRecordReady(readJsonSync(getRecordFilePath(admiralId)))
  } catch (err) {
    if (err.syscall !== 'open' || err.code !== 'ENOENT') {
      console.error('Error while reading config file', err)
    }
    onRecordReady({})
  }
}

const saveRecords = (admiralId, recordObj) => {
  try {
    writeJsonSync(getRecordFilePath(admiralId),recordObj)
  } catch (err) {
    console.error('Error while writing to config file', err)
  }
}

export {
  loadRecords,
  saveRecords,
}
