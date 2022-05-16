/* 
https://juejin.im/post/6844903795445465101
*/

import React, { createContext, PureComponent } from 'react';
const ThemeContext = createContext();

export class AAA extends PureComponent {
  constructor() {
    this.state = {
      theme: 'dark',
      handleToogle: this.handleToogle,
    };
  }

  handleToogle = () => {
    this.setState({
      theme: this.state.theme === 'dark' ? 'light' : 'dark',
    });
  };

  render() {
    return <ThemeContext.Provider value={this.state}>{this.props.children}</ThemeContext.Provider>;
  }
}

export const Consumer = ThemeContext.Consumer;
