import { defineConfig } from 'vite';
import { UnifiedViteWeappTailwindcssPlugin as uvtw } from 'weapp-tailwindcss/vite';

export default defineConfig({
  plugins: [
    // 直接在vite插件系统中配置
    uvtw({
      // rem转rpx
      rem2rpx: true,
      // 根据不同平台决定是否禁用
      disabled: process.env.TARO_ENV === 'h5' || process.env.TARO_ENV === 'harmony' || process.env.TARO_ENV === 'rn',
      // 由于taro vite默认会移除所有的tailwindcss css变量，所以一定要开启这个配置，进行css变量的重新注入
      injectAdditionalCssVarScope: true,
    })
  ]
}); 