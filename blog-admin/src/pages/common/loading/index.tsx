import { Spin } from 'antd'
import css from './index.module.less'

const Loading = () => {
  return (
    <div className={css.loading}>
      <Spin size='large' />
    </div>
  )
}

export default Loading
