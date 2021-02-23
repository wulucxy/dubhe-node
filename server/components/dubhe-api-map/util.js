const _ = require('lodash')
const url = require('url')
const env = process.env.NODE_ENV || 'development'
const path = require('path')

function findMatchRule(rules) {
  return function(pathname) {
    const rule = rules.find(({ match }) => {
      return _.isFunction(match)
        ? match(pathname)
        : match instanceof RegExp
        ? match.test(pathname)
        : true
    })

    return rule
  }
}

const getOrigin = host => {
  if (!host) {
    return ''
  }

  if (_.isString(host)) {
    return host
  }

  const origin = host[env]
  return origin
}

// 获取 map 对应的 path
const getPath = (mapConfig = {}, path) => {
  if (_.isFunction(mapConfig)) {
    return mapConfig(path)
  }

  let pathname = path

  // 如果匹配 获取该匹配值
  if (mapConfig[path]) {
    pathname = mapConfig[path]
  } else {
    // 尝试使用正则模式
    for (let key of Object.keys(mapConfig)) {
      const reg = new RegExp(key)
      // 获取匹配的正则数据
      if (reg.test(path)) {
        pathname = path.replace(reg, mapConfig[key])
        break
      }
    }
  }

  return pathname
}

// 合并路径
function composeUrl(host, pathname) {
  const hostObj = url.parse(host, true, true)
  const pathObj = url.parse(pathname, true)

  hostObj.pathname = path.posix.join(hostObj.pathname, pathObj.pathname)
  hostObj.query = pathObj.query

  return hostObj.format()
}

function isURL(path) {
  return path.startsWith('http://') || path.startsWith('https://')
}

module.exports = {
  findMatchRule,
  getOrigin,
  getPath,
  composeUrl,
  isURL,
}
