import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import type { Plugin } from 'vite' with { 'resolution-mode': 'import' }
import { UnifiedViteWeappTailwindcssPlugin as uvtw } from 'weapp-tailwindcss/vite'
import devConfig from './dev'
import prodConfig from './prod'

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<'vite'>(async (merge) => {
  const baseConfig: UserConfigExport<'vite'> = {
    projectName: 'pokemon',
    date: '2025-7-23',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: [
      "@tarojs/plugin-generator"
    ],
    defineConstants: {
    },
    copy: {
      patterns: [
      ],
      options: {
      }
    },
    framework: 'react',
    compiler: {
      type: 'vite',
      prebundle: { enable: false },
      vitePlugins: [
        {
          // 通过 vite 插件加载 postcss
          name: 'postcss-config-loader-plugin',
          config(config) {
            // 确保postcss配置被加载
            if (typeof config.css?.postcss !== 'object') {
              config.css = config.css || {}
              config.css.postcss = { plugins: [] }
            }
          },
        },
        uvtw({
          // rem转rpx
          rem2rpx: true,
          // 除了小程序这些，其他平台都 disable
          disabled: process.env.TARO_ENV === 'h5' || process.env.TARO_ENV === 'harmony' || process.env.TARO_ENV === 'rn',
          // 由于 taro vite 默认会移除所有的 tailwindcss css 变量，所以一定要开启这个配置，进行css 变量的重新注入
          injectAdditionalCssVarScope: true,
        })
      ] as Plugin[] // 从 vite 引入 type, 为了智能提示
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        },
        url: {
          enable: true,
          config: {
            limit: 10240 // 设定转换尺寸上限
        }
      },
        tailwindcss: {
          enable: true
        }
      }
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        },
        tailwindcss: {
          enable: true
        }
      }
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: false
        }
      }
    }
  }

  process.env.BROWSERSLIST_ENV = process.env.NODE_ENV

  if (process.env.NODE_ENV === 'development') {
    return merge({}, baseConfig, devConfig)
  }
  return merge({}, baseConfig, prodConfig)
})
