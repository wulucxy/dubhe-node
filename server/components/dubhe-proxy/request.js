module.exports = (options = {}) => async ctx => {
  const { url, axios } = options
  const {
    method,
    request: { body },
    query,
  } = ctx
  const opts = {
    method,
    url,
    params: query,
    data: body,
  }

  const contentType = ctx.get('content-type')
  if (contentType) {
    opts.headers = {
      'content-type': contentType,
    }
  }

  const res = await axios(opts)
  return res.data
}
