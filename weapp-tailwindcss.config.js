export default {
  specialCharReplacement: {
    // 指定替换规则：冒号转为下划线
    ':': '_',
    // 斜杠转为下划线
    '/': '_',
    // 点转为下划线
    '.': '_'
  },
  // 以rpx为单位
  unit: 'rpx',
  // rpx转换比例，1px = 2rpx
  transformRpx: {
    ratio: 2
  },
  // 样式注入
  injectAdditionalCssVarScope: true,
  // 调试模式
  debug: false
} 