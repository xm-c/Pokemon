// babel-preset-taro 更多选项和默认值：
// https://docs.taro.zone/docs/next/babel-config
const config = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: true,
      compiler: 'vite'
    }]
  ]
};

// 在H5环境下启用useBuiltIns
if (process.env.TARO_ENV === 'h5') {
  config.presets[0][1].useBuiltIns = 'usage';
  config.presets[0][1].targets = {
    browsers: [
      'last 2 versions',
      'not dead',
      '> 0.2%'
  ]
  };
}

module.exports = config;
