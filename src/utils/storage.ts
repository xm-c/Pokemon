import Taro from '@tarojs/taro';

// 平台检测
const isH5 = process.env.TARO_ENV === 'h5';

/**
 * 统一存储工具
 */
export const Storage = {
  /**
   * 同步获取存储数据
   */
  getSync: (key: string): any => {
    try {
      if (isH5) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      }
      return Taro.getStorageSync(key);
    } catch (e) {
      console.warn('获取存储数据失败:', key, e);
      return null;
    }
  },

  /**
   * 同步设置存储数据
   */
  setSync: (key: string, data: any): void => {
    try {
      if (isH5) {
        localStorage.setItem(key, JSON.stringify(data));
      } else {
        Taro.setStorageSync(key, data);
      }
    } catch (e) {
      console.error('设置存储数据失败:', key, e);
    }
  },

  /**
   * 同步删除存储数据
   */
  removeSync: (key: string): void => {
    try {
      if (isH5) {
        localStorage.removeItem(key);
      } else {
        Taro.removeStorageSync(key);
      }
    } catch (e) {
      console.error('删除存储数据失败:', key, e);
    }
  },

  /**
   * 清空所有存储数据
   */
  clearSync: (): void => {
    try {
      if (isH5) {
        localStorage.clear();
      } else {
        Taro.clearStorageSync();
      }
    } catch (e) {
      console.error('清空存储数据失败:', e);
    }
  }
};

/**
 * 统一提示工具（保留这个，因为在H5中确实需要适配）
 */
export const Toast = {
  /**
   * 显示提示
   */
  show: (options: { title: string; icon?: 'success' | 'error' | 'loading' | 'none'; duration?: number }) => {
    if (isH5) {
      // H5环境：可以使用原生Taro.showToast，它会自动适配
      Taro.showToast(options);
    } else {
      Taro.showToast(options);
    }
  }
};

// 注意：移除了Navigator工具，因为Taro.navigateTo等应该原生支持跨平台 