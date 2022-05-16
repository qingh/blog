import react from 'react';
import axios from 'axios';
import { HashRouter as Router } from 'react-router-dom';

//请求拦截器
axios.interceptors.request.use(
  config => {
    //此处可检查登录状态
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.common['token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

//响应拦截器
axios.interceptors.response.use(
  res => {
    return res;
  },
  error => {
    let router = new Router();
    if (error.response.status === 401) {
      router.history.push('/login');
    }
    return Promise.reject(error);
  }
);

/**
 * 封装ajax方法
 * url：请求地址、必填
 * params：请求参数、非必填
 * config：请求头配置信息、非必填
 */
const ajax = {
  baseUrl: '/api/v1',
  wrapAwait: promise => promise.then(res => [undefined, res]).catch(error => [error, undefined]),
  assert(isFalse, msg = '这里出错了') {
    if (!isFalse) {
      throw new Error(msg);
    }
  },
  get(url, params, headers) {
    return this.wrapAwait(
      axios.get(`${this.baseUrl}${url}`, {
        params,
        headers,
      })
    );
  },
  post(url, params, headers) {
    return this.wrapAwait(axios.post(`${this.baseUrl}${url}`, params, { headers }));
  },
  /**
   * upload方法
   *   option {
   *     onProgress: (event: { percent: number }): void,
   *     data: Object,
   *     file: File,
   *     headers: Object,
   *   }
   */
  upload(url, options) {
    this.assert(typeof options === 'object', `options must be a object`);
    this.assert(typeof options.data !== 'undefined', `options.data is invalid`);
    return this.wrapAwait(
      axios.post(`${this.baseUrl}${url}`, options.data, {
        headers: options.headers,
        onUploadProgress: progressEvent => {
          let percent = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
          progressEvent.percent = percent;
          options.onProgress && options.onProgress(progressEvent, options.file);
        },
      })
    );
  },
  delete(url, params, headers) {
    return this.wrapAwait(axios.delete(`${this.baseUrl}${url}`, { params, headers }));
  },
  put(url, params, headers) {
    return this.wrapAwait(axios.put(`${this.baseUrl}${url}`, params, { headers }));
  },
};

export default ajax;
