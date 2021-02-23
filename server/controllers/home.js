module.exports = async ctx => {
  await ctx.render('index', {
    pageTitle: 'test',
    config: JSON.stringify({ code: 1 }),
    baseURI: '/node',
  })
}
