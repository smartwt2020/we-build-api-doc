/* eslint-disable no-unused-vars */
const defMap = {
  array: [],
  string: 'string',
  integer: 0
}

const getObj = function (dto, def) {
  if (dto.type === 'object') {
    const obj = {}
    if ('properties' in dto) {
      for (const key in dto.properties) {
        obj[key] = getObj(dto.properties[key], def)
      }
    } else if ('additionalProperties' in dto) {
      obj.MapKey = getObj(dto.additionalProperties, def)
    } else {
      console.log('failed', dto)
    }
    return obj
  } else if (dto.type === 'array') {
    const obj = []
    obj.push(getObj(dto.items, def))
    return obj
  } else if ('$ref' in dto) {
    return getObj(def[dto.$ref.split('/')[2]], def)
  } else {
    return dto.type
  }
}

export default {
  init (data) {
    const res = {}
    res.basePath = data.basePath
    res.host = data.host
    res.api = []
    res.api2 = {}
    const paths = data.paths
    for (const tag of data.tags) {
      res.api2[tag.name] = {
        name: tag.name,
        description: tag.description,
        open: 0,
        api: []
      }
    }
    for (const path in paths) {
      for (const method in paths[path]) {
        const obj = {}
        const config = paths[path][method]
        obj.urlPath = path
        obj.method = method
        obj.tag = config.tags || []
        obj.summary = config.summary || ''
        obj.produces = config.produces || []
        obj.consumes = config.consumes || []
        obj.body = null
        obj.query = null
        obj.path = null
        obj.header = []
        obj.res = {}
        const parameters = config.parameters || []
        for (const i in parameters) {
          if (parameters[i].in === 'query') {
            obj.query = obj.query === null ? {} : obj.query
            obj.query[parameters[i].name] = parameters[i].type
          } else if (parameters[i].in === 'path') {
            obj.path = obj.path === null ? {} : obj.path
            obj.path[parameters[i].name] = parameters[i].type
          } else if (parameters[i].in === 'body') {
            obj.body = obj.body === null ? {} : obj.body
            obj.body = getObj(parameters[i].schema, data.definitions)
          } else if (parameters[i].in === 'header') {
            obj.header.push([parameters[i].name, parameters[i].type])
          }
        }
        for (const resp in config.responses) {
          if ('schema' in config.responses[resp]) {
            const bodyPath = config.responses[resp].schema.$ref.split('/')[2]
            obj.res[resp] = getObj(data.definitions[bodyPath], data.definitions)
          }
        }
        res.api.push(obj)
        for (const tag of obj.tag) {
          res.api2[tag].api.push(obj)
        }
      }
    }
    return res
  }
}
