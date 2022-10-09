# novelai-sample

Material Designed 风格的，使用 vue.js 的简易 novel AI 前端。

## 功能列表

没啥功能。最基础的 text2img 。

## 使用

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

## 个性化配置

修改 `src\config.js` 文件：

```js
export default {
    default: {
        backend: {
            url: "http://localhost:8000",
            payload: {
                prompt: "masterpiece, best quality, 1girl, cute, school uniform, outside",
                uc: "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry",
                seed: 114514,
                n_samples: 1,
                sampler: "k_euler_ancestral",
                width: 288,
                height: 512,
                scale: 8,
                step: 22
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
