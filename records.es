import { ensureDirSync, readJsonSync, writeJsonSync } from 'fs-extra'
import { join } from 'path-extra'

const emptyConfig = {
  $dataVersion: '0.0.1',
}

const emptyEntity = {
  expRange: {
    /*
       shape for both `first` and `last`:
       { exp: <number>, time: <number> }
     */
    first: null,
    last: null,
  },
  sortieCounts: {
    /*
       keys are mapIds (e.g. 54, 15)
       values are of shape:
       { total: <number>, boss: <number> }
     */
  },
}

const getRecordFilePath = admiralId => {
  const { APPDATA_PATH } = window
  const configPath = join(APPDATA_PATH,'mini-senka')
  ensureDirSync(configPath)
  return join(configPath,`${admiralId}.json`)
}

const updateConfig = records => {
  if (! records || records.$dataVersion !== emptyConfig.$dataVersion) {
    throw new Error(`validation failed for records, version mismatched`)
  }
  return records
}

const loadRecords = (admiralId, onRecordReady) => {
  try {
    onRecordReady(
      updateConfig(
        readJsonSync(
          getRecordFilePath(admiralId))))
  } catch (err) {
    if (err.syscall !== 'open' || err.code !== 'ENOENT') {
      console.error('Error while reading config file', err)
    }
    onRecordReady(emptyConfig)
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
  emptyEntity,
}