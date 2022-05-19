declare module '*.png';
declare module '*.svg';

declare global {

  interface IPage {
    current: number
    pageSize: number
  }

  interface ITable extends IPage {
    total: number
    loading: boolean
  }
}

export { }
