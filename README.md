# novelai-sample

Material Designed 风格的，使用 vue.js 的简易 novel AI 前端。

## 功能列表

对接官网后端的 文字->图片 前端界面。

* 自定义后端地址；
* 请求（`generate`接口）的 payload 生成；
* 一张或多张图片展示、保存、清空；

### text->img

* 自定义宽度高度；
* 选择采样方法；
* 自定义 prompt；
* 自定义 negative prompt;
* 自动为 prompt 前添加 `masterpiece, best quality,` （官网前端行为）
* 自定义 steps；
* 自定义 scale；
* 自定义或随机种子；
* 自定义张数；

## 使用

### 直接使用

[novel-ai.gaein.cn](http://novel-ai.gaein.cn/)

[Github Pages](https://nidbcn.github.io/novelai-sample/)

> 为什么不推荐直接使用在线？  
> 由于 RFC-1918 （私有网络控制） 可能无法向非 HTTPS 的内网的后端发送请求。
>
> 为什么不使用 Github Pages 和 HTTPS ?
> 如果后端使用 HTTP 协议，发送到后端的请求的 POST 请求会被浏览器拦截——而大部分人不会给这个后端部署反代以及 HTTPS。

### 自行部署（推荐）

确保需要部构建前端的服务器安装有 `nodejs`, `npm` 。

进入项目目录，执行：

```sh
npm install
```

启动开发服务器：

```sh
npm run serve
```

构建静态文件：

```sh
npm run build
```

构建完成后静态文件位于 `dist` 目录下，科研使用任意 web 服务器。

#### 个性化配置

修改 `src\config.js` 文件：

```js
export default {
    default: {
        backend: {
            url: "http://localhost:8000",
            payload: {
                prompt: "1girl, cute, school uniform, outside",
                uc: "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry",
                seed: 114514,
                n_samples: 1,
                sampler: "k_euler_ancestral",
                width: 384,
                height: 576,
                scale: 8,
                steps: 22
            }
        },
        website: {
            barTitle: "Novel AI frontend",
            links: [
                {
                    icon: "mdi-github",
                    text: "Github",
                    link: "https://github.com/nidbCN/novelai-sample"
                }
            ]
        }
    },
}

```

如上所示，`default` 节点内为 Web 前端的默认值，你可以通过修改这些来指定默认的参数、或者指定链接。

修改 `vue.config.js` 文件：

```js
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Novel AI frontend'

      return args
    })
  }
})

```

将 `'Novel AI frontend'` 替换为你想要的网站标题。
