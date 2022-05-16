/* 
	高阶组件 high order component
	使用高阶组件，来共享数据
	*/
import React, { PureComponent } from 'react';
let count = 0;
let listeners = [];
export default function (Component) {
  return class extends PureComponent {
    constructor(props) {
      super(props);
      console.log(this);
      this.state = {
        count,
      };
    }

    componentDidMount() {
      console.log(this);
      listeners.push(this);
    }

    componentWillUnmount() {
      listeners = listeners.filter(instance => instance !== this);
    }

    changeCount = count => {
      listeners.forEach(cmp => {
        console.log(cmp);
        cmp.setState({ count });
      });
    };

    render() {
      const { staticContext, ...props } = this.props;
      const newProps = {
        changeCount: this.changeCount,
        count: this.state.count,
        ...props,
      };
      return <Component {...newProps} />;
    }
  };
}
