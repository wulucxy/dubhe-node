# dubhe-node

> 基于 Node.js, Vue3 的前端全栈开发框架。

## 环境依赖

- node 10+ LTS
- npm 5+
- PM2

## 特性

- 提供了一套开箱即用，集成了 node.js、vue3、webpack 的前端统一开发技术栈
- 灵活配置能力，支持前端接口自动代理到后端 api 服务
- 提供了 mock 服务，并支持 Restful 接口

## 常用命令

**本地开发**

```sh
$ npm start
$ open localhost:3000
```

**代码格式化**

```sh
$ npm run lint
```

**本地编译**

```sh
$ npm run compile
```

**部署发布**

- 本操作需要依赖 PM2

```sh
$ npm run deploy
```