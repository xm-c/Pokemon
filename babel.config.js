// babel.config.js
const config = {
  presets: [
    ['taro', { framework: 'react', ts: true, compiler: 'vite' }]
  ]
};

// H5环境配置 - 完全依赖Vite的polyfill机制
if (process.env.TARO_ENV === 'h5') {
  // 移除useBuiltIns，让Vite legacy插件处理polyfills
  config.presets[0][1].targets = {
    browsers: ['Chrome >= 49', 'iOS >= 10', 'Android >= 6', 'Safari >= 10']
  };
  
  // 简化的runtime配置 - 不使用core-js
  config.plugins = [
    ['@babel/plugin-transform-runtime', {
      helpers: true,
      regenerator: true,
      useESModules: true
      // 完全移除corejs配置
    }]
  ];
}

module.exports = config;
