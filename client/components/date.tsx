import { useEffect } from 'react';
import css from '../styles/date.module.scss';





let r = new RegExp('a')

export function Date() {

  useEffect(() => {

  }, [])

  return (
    <div className={css.date} id="date" data-nowdate="1653009955366">
      <div className={css['date-change']}>
        <a className={css['date-prev']} id="prev" href="#" onClick={ev=>ev.preventDefault()} title="上个月">&lt;</a>
        <p id="nowTime" data-time="2022-5">2022年5月</p>
        <a className={css['date-next']} id="next" href="#" onClick={ev=>ev.preventDefault()} title="下个月">&gt;</a>
      </div>
      <table id="tab" className={css['date-tab']}>
        <thead>
          <tr>
            <th>日</th>
            <th>一</th>
            <th>二</th>
            <th>三</th>
            <th>四</th>
            <th>五</th>
            <th>六</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}