import momentTz from 'moment-timezone'

/*

   Reference: http://kancolle.wikia.com/wiki/Experience_and_Rank (as of Jun 20, 2017)

   - ranking points are accounted at 2:00 JST and 14:00 JST each day
     with the exception of the last day of a month

   - for the last day of a month, ranking point is accounted at 2:00 JST, 14:00 JST
     and 22:00 JST. ranking points earned after 22:00 JST is accounted into
     2:00 JST of the next day (the first day of next month)

 */
const computeAccountingMoment = (...args) => {
  const now = momentTz(...args).tz('Asia/Tokyo')
  const lastDateOfMonth = now.clone().endOf('month').date()

  const dateNum = now.date()
  const hourNum = now.hour()

  if (hourNum < 2) {
    return now.clone().startOf('date').hour(2)
  }

  if (hourNum < 14) {
    return now.clone().startOf('date').hour(14)
  }

  if (dateNum < lastDateOfMonth) {
    return now.clone().add(1,'day').startOf('date').hour(2)
  } else {
    if (hourNum >= 14 && hourNum < 22) {
      return now.clone().startOf('date').hour(22)
    }
    if (hourNum >= 22) {
      return now.clone().add(1,'day').startOf('date').hour(2)
    }
  }
}

const computeAccountingInfo = (...args) => {
  const accountingMoment = computeAccountingMoment(...args)
  const timestamp = accountingMoment.valueOf()
  const label = accountingMoment.format('YYYY-MM-DD|HH')
  return {timestamp, label}
}

export {
  computeAccountingInfo,
}
