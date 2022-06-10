import ReactDOM from 'react-dom/client'
import { message } from 'antd'
import { App } from './App'
import 'antd/dist/antd.less'

message.config({
  maxCount: 1
})
message.destroy()

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
