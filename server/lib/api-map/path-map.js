module.exports = {
  // 正常映射
  '/api/query': '/app/query',
  // 正则映射，多用于 RESTful 接口，请正确的使用"()" 和 $x 设置
  '/api/update/(\\d+)': '/app/update/$1',
  // 固定映射模式，会直接返回对应的地址
  '/api/delete': 'https://www.api.com/app/delete',
}
