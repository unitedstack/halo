# halo

ustack web framework extends egg

## Usage

```bash
npm i -S @ustack/halo
```

```file
# package.json
"egg": {
  "framework": "@ustack/halo"
}
```

## 插件

### 清单

| 名称 | node_modules | enable |
| --- | --- | --- |
| ejs | egg-view-ejs | true |
| sequelize | egg-sequelize | false |
| ue | @ustack/egg-ue | true |
| io | egg-socket.io | false |
| redis | egg-redis | false |
| sessionRedis | egg-session-redis | false |

## 默认配置

```js
// plugin.js
module.exports = {
  ejs: {
    enable: true,
    package: 'egg-view-ejs',
  },
  sequelize: {
    enable: false,
    package: 'egg-sequelize',
  },
  ue: {
    enable: true,
    package: '@ustack/egg-ue',
  },
  io: {
    enable: false,
    package: 'egg-socket.io',
  },
  redis: {
    enable: false,
    package: 'egg-redis',
  },
  sessionRedis: {
    enable: false,
    package: 'egg-session-redis',
  },
};

// config.default.js
module.exports = () => {
  const config = {
    siteFile: {
      '/favicon.ico': readFileSync(join(__dirname, 'favicon.png')),
    },
    httpclient: {
      request: {
        timeout: [ 30000, 600000 ],
      },
    },
    io: {
      namespace: {
        '/': {
          connectionMiddleware: [],
          packetMiddleware: [],
        },
      },
      redis: {
        host: '127.0.0.1',
        port: 6379,
        auth_pass: '',
        db: 0,
      },
    },
    redis: {
      client: {
        host: '127.0.0.1',
        port: 6379,
        password: '',
        db: 0,
      },
    },
  };

  return config;
};
```

## 继承自egg

### 插件

+ onerror
+ session
+ i18n
+ watcher
+ multipart
+ security
+ development
+ logrotator
+ schedule
+ static
+ view
+ jsonp

### 中间件

+ meta
+ siteFile
+ notfound
+ bodyParser
+ overrideMethod

## Questions & Suggestions

Please open an issue [here](https://github.com/unitedstack/halo/issues).

>参考

## @ustack/egg-ue

### ctx.helper

```js
// urlconcat
ctx.helper.urlconcat('http://localhost:8080/', 'api/search', 'something', '?a=b&b=c')
// http://localhost:8080/api/search/something?a=b&b=c

// pagination

// fs
const content = await ctx.helper.fs.readFileAsync(__filename, 'utf8');
// content文件内容

// uuid
ctx.helper.uuid.v4()
ctx.helper.uuid.v1()

// lodash
ctx.helper._.pick
ctx.helper._.assign
...

// xor
ctx.helper.xor([ 2, 1, 3 ], [ 2, 4, 6, 1 ]);
// {toDel: [3], toAdd: [4, 6]}

// exec
await ctx.helper.exec(`ls ${__dirname}`);
// 执行结果

// password
const originalPassword = '1234';
const hashPassword = await ctx.helper.password.hash(originalPassword);
assert(originalPassword !== hashPassword);
assert(await ctx.helper.password.compare(originalPassword, hashPassword));
assert(!(await ctx.helper.password.compare(originalPassword, hashPassword + '123')));
```
