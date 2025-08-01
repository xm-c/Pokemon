import { defineConfig } from 'vite';
import { UnifiedViteWeappTailwindcssPlugin as uvtw } from 'weapp-tailwindcss/vite';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig(() => {
  const isH5 = process.env.TARO_ENV === 'h5';

  // 基础插件配置
  const basePlugins = [
    uvtw({
      rem2rpx: true,
      disabled: process.env.TARO_ENV === 'h5' || process.env.TARO_ENV === 'harmony' || process.env.TARO_ENV === 'rn',
      injectAdditionalCssVarScope: true,
    })
  ];

  // H5环境专用插件
  const h5Plugins = [
    legacy({
      targets: 'defaults',
      polyfills: ['es.array.includes', 'es.array.is-array', 'es.object.assign', 'es.promise'],
      renderLegacyChunks: false,
    })
  ];

  return {
    plugins: [
      ...basePlugins,
      // 只在H5环境下添加legacy插件
      ...(isH5 ? h5Plugins : [])
  ],
    // H5环境的特殊配置
    ...(isH5 ? {
      // H5构建优化配置
      esbuild: {
        target: 'es2015'
      },
      // 全局变量定义
      define: {
        global: 'globalThis',
      },
      // 开发环境优化配置
  optimizeDeps: {
        exclude: ['core-js-pure'],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
      // 开发服务器配置
      server: {
        force: true
      },
      // SSR配置
  ssr: {
        noExternal: ['core-js-pure', /^core-js-pure/]
  }
    } : {
      // 小程序环境的简洁配置
      esbuild: {
        target: 'es2017' // 小程序支持更现代的ES标准
      }
    })
  };
}); 