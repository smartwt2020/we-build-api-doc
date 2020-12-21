export const isP = (data) => {
  return ['number', 'string', 'boolean', 'undefined', 'symbol', 'bigint'].indexOf(typeof data) !== -1
}

export const J2S = (data) => {
  if (isP(data)) {
    return data
  }
  try {
    return JSON.stringify(data, null, 1)
  } catch (e) {
    console.error(e)
    return ''
  }
}

export const S2J = (data) => {
  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}
