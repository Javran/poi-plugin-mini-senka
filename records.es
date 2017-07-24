import { ensureDirSync, readJsonSync, writeJsonSync } from 'fs-extra'
import { join } from 'path-extra'
import { modifyObject, SortedMap } from 'subtender'
import { computeAccountingInfo } from './senka-accounting'

// use default (string) comparison,
// key is 'month' prop
const MonthRecords = SortedMap.withContext({
  ...SortedMap.defaultContext,
  elementToKey: x => x.month,
})

// use default (string) comparison,
// key is 'key' prop (default)
const DayRecords = SortedMap.withContext(
  SortedMap.defaultContext)

/*

   records structure:

   - $dataVersion: 0.0.1
   - records: <Array of MonthRecord>, sorted by 'month' string

   MonthRecord Object

   - month: 'YYYY-MM'
   - records: <Array of DayRecord>, sorted by 'key' string

   DayRecord Object

   - key: 'YYYY-MM-DD|HH'
   - record: <Entity> (see emptyEntity)

 */

const emptyConfig = {
  $dataVersion: '0.0.1',
  records: [],
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
  sorties: {
    /*
       keys are mapIds (e.g. 54, 15)
       values are of shape:
       { count: <number>, boss: {<rank>: <number>} }
     */
  },
}

const emptySortieInfo = {
  count: 0,
  boss: {},
}

const modifyRecordByTime = (time, modifier) => {
  const accountingInfo = computeAccountingInfo(time)
  return modifyObject(
    accountingInfo.label,
    (entity = emptyEntity) => modifier(entity)
  )
}

const modifyRecordByTimeNew = (time, modifier) => {
  const accountingInfo = computeAccountingInfo(time)
  return modifyObject(
    'records',
    MonthRecords.modify(
      accountingInfo.month,
      (
        monthRecord = {
          month: accountingInfo.month,
          records: [],
        }
      ) =>
        modifyObject(
          'records',
          DayRecords.modify(
            accountingInfo.label,
            (
              dayRecord = {
                key: accountingInfo.label,
                record: emptyEntity,
              }
            ) =>
              modifyObject(
                'record',
                entity => modifier(entity)
              )(dayRecord)
          )
        )(monthRecord)
    )
  )
}

const modifySortieByMapId = (mapId, modifier) =>
  modifyObject(
    mapId,
    (mapSortieInfo = emptySortieInfo) =>
      modifier(mapSortieInfo))

const getRecordFilePath = admiralId => {
  const { APPDATA_PATH } = window
  const configPath = join(APPDATA_PATH,'mini-senka')
  ensureDirSync(configPath)
  return join(configPath,`${admiralId}.json`)
}

const updateConfig = recordsArg => {
  if (! recordsArg) {
    throw new Error(`records not found`)
  }

  // might change to 'let' in futre in case there are
  // data structure updates
  const records = recordsArg

  if (records.$dataVersion !== emptyConfig.$dataVersion) {
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
  emptyConfig,
  emptyEntity,
  emptySortieInfo,

  modifyRecordByTime,
  modifyRecordByTimeNew,
  modifySortieByMapId,

  MonthRecords,
  DayRecords,

  loadRecords,
  saveRecords,
}
