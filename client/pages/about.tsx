import Link from 'next/link';
import css from '../styles/about.module.scss';


export default function About (){
  return (
    <div className={css.about}>
    <div className={css['bread-crumb']}><Link href="/">博客首页</Link><b>{'>'}</b><span>关于本站</span></div>
    <div className={css['about-blog']}>
      <p>本站是作者于2017年7月离职后着手开发，花了接近两个星期的时间，网站用到了nodejs最新框架koa2+pug模板引擎 + mysql数据库。界面参考了<a
          href="http://www.ruanyifeng.com/home.html"
          target="_blank" rel="noreferrer">阮一峰的个人网站</a>以及博客园的排版。开发本站主要是记录一些学习笔记，方便以后查阅，也为方便以后找工作，所以内容极为简洁，有些内容可能只有我自己能看懂。</p>
      <p>
        本站已完成基本开发工作，遗留一个bug，就是点赞和点踩功能。因为此功能不需要用户登录，验证不了用户身份，所以，这两项操作可以无限点击，本人偿试过修复此bug，包括获取客户端IP地址，以及session来确定用户身份，但都有其缺陷。故此功能数据仅供参考。
      </p>
      <p>本人主要是做前端开发，菜鸟一枚。本站内容如果对您有益，那也算我的笔记没有白做，如果觉得跟您的想法出入甚远，请留言发表您的看法，切勿乱喷，谢谢！</p>
    </div>
    <dl>
      <dt>作者邮箱</dt>
      <dd>lqhday@gmail.com</dd>
    </dl>
  </div>
  )
}

