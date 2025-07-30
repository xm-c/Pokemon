/**
 * 此文件修复core-js-pure模块的默认导出问题
 * 在H5环境中，某些模块尝试从core-js-pure导入默认导出，但实际上只有命名导出可用
 */
import { Plugin } from 'vite';
import fs from 'fs';

// 导出修复模块的插件
export function createCoreJSFixPlugin(): Plugin {
  const CORE_JS_REGEX = /core-js-pure\/features\/.*\.js$/;
  
  return {
    name: 'vite-plugin-fix-core-js-pure',
    enforce: 'pre' as const,
    
    // 拦截请求
    load(id) {
      // 如果是core-js-pure模块
      if (CORE_JS_REGEX.test(id)) {
        // 获取原始模块的内容
        if (fs.existsSync(id)) {
          const content = fs.readFileSync(id, 'utf-8');
          
          // 添加默认导出
          return `${content}\nexport default module.exports;`;
        }
      }
      return null;
    },
  };
} 