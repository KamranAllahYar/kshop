// function to convert array of key value in to object of key value
export function arrayToObjectKeyValuePair(data: any []) {
  const params: any = {}
  if (data && data.length) {
    for (const datum of data) {
      params[datum.key] = datum.value
    }
  }
  return params
}

export function arrayToObjectKeyValuePairWithOtherData(data: any []) {
  const params: any = {}
  if (data && data.length) {
    for (const datum of data) {
      params[datum.key] = {
        value: datum.value,
        id: datum.id,
        is_active: datum.is_active
      }
    }
  }
  return params
}

export const s3Link = (path) =>{
  if (path) {
    return `${process.env.AWS_URL}/${path}`
  }
  return null
}
