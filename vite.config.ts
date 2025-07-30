import { defineConfig } from 'vite';
import { UnifiedViteWeappTailwindcssPlugin as uvtw } from 'weapp-tailwindcss/vite';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    uvtw({
      rem2rpx: true,
      disabled: process.env.TARO_ENV === 'h5' || process.env.TARO_ENV === 'harmony' || process.env.TARO_ENV === 'rn',
      injectAdditionalCssVarScope: true,
    }),
    // 只保留legacy插件，提供必要的polyfills
    legacy({
      targets: 'defaults',
      polyfills: ['es.array.includes', 'es.array.is-array', 'es.object.assign', 'es.promise'],
      renderLegacyChunks: false,
    }),
  ],
  // 最小化配置
  esbuild: {
    target: 'es2015'
  },
  // 基本的全局变量定义
  define: {
    global: 'globalThis',
  }
}); 