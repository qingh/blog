import { useEffect, useRef } from 'react';
import css from '../styles/date.module.scss';

export function DateComponent() {
  const nowRef = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    initDate()
  }, [])

  function initDate() {
    let nowDate = new Date(),
      year = nowDate.getFullYear(),
      month = nowDate.getMonth() + 1,
      month1 = [1, 3, 5, 7, 8, 10, 12],
      month2 = [4, 6, 9, 11],
      day = 0; //存储当前月份的天数

    let setDate, curWeek;
    setDate = new Date();
    setDate.setFullYear(year, month - 1, 1);
    curWeek = setDate.getDay(); //获取当前月份的1号是周几

    // $('#nowTime').html(year + '年' + month + '月').attr('data-time', year + '-' + month);
    nowRef.current!.innerHTML = `${year}年${month}月`

    /* 计算闰年的天数 */
    if (month == 2) {
      if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
        day = 29;
      } else {
        day = 28;
      }
    }
    for (let i = 0; i < month1.length; i++) {
      if (month == month1[i]) {
        day = 31;
      }
    }

    for (let i = 0; i < month2.length; i++) {
      if (month == month2[i]) {
        day = 30;
      }
    }

    for (let j = 0; j < day; j++) {
      // $('#tab td').eq(curWeek + j).html(j + 1);
    }

    //如果是当前日期
    if (year == new Date().getFullYear() && month == new Date().getMonth() + 1) {
      // $('#tab td').eq(new Date().getDate() + curWeek - 1).addClass('date-cutTime');
    }
  }

  return (
    <div className={css.date} id="date" data-nowdate="1653009955366">
      <div className={css['date-change']}>
        <a className={css['date-prev']} id="prev" href="#" onClick={ev => ev.preventDefault()} title="上个月">&lt;</a>
        <p ref={nowRef}>2022年5月</p>
        <a className={css['date-next']} id="next" href="#" onClick={ev => ev.preventDefault()} title="下个月">&gt;</a>
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