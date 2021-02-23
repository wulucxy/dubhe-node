const { apiMap } = require('../../components')
const { backendMap } = require('../../utils/config')
const pathMap = require('./path-map')

const rules = [
  {
    host: backendMap,
    map: pathMap,
  },
]

const mapper = apiMap(rules)

module.exports = mapper
