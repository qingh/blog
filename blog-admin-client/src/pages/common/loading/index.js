import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import css from './style.less';
class Loading extends PureComponent {
  render() {
    return (
      <div className={css.loading}>
        <Spin size='large' />
      </div>
    );
  }
}

export default Loading;
