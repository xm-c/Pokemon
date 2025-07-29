import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'

// 引入全局样式（包含自定义CSS工具类）
import './app.less'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
  })

  // children 是将要会渲染的页面
  return children
}

export default App
