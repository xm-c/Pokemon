// weapp.config.js - weapp-tailwindcss配置
export default {
  // 转换单位 
  unit: 'rpx', 
  
  // 转换比率
  // 在微信小程序中，1px = 2rpx
  transformRpx: {
    ratio: 2
  },
  
  // 处理特殊字符
  specialCharReplacement: {
    // hover:scale-110 => hover_scale-110
    ':': '_',
    '/': '_',
    '.': '_'
  },

  // 禁用预检样式以避免与小程序内置样式冲突
  disablePreflight: true,
  
  // 是否打印调试信息
  debug: false
} 