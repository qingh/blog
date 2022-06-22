import Link from 'next/link'
import Head from 'next/head'
import css from '../styles/about.module.scss'


export default function About() {
  return (
    <>
      <Head>
        <title>关于本站</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={css.about}>
        <div className={css['bread-crumb']}><Link href="/">博客首页</Link><b>{'>'}</b><span>关于本站</span></div>
        <div className={css['about-blog']}>
          <p>本站是作者于2022年5月着手开发，花了近三个星期的时间，网站分为三个部分，用到了以下技术：</p>
          <ul className={css.list}>
            <li>client: nextjs + typescript；用户能看到的页面</li>
            <li>admin:  react + antd + typescript；<a href='http://admin.liuqh.com' target={'_blank'} rel={'noopener noreferrer'}>后台管理系统</a></li>
            <li>server: koa + mysql + sequlize + typescript + docker；给client和admin提供接口</li>
          </ul>
          <p>本站使用了mysql存储，建立了四张数据表，文章表articles、评论表comments、分类表labels、用户表users；共23个接口；<a href="https://github.com/qingh/blog" target={'_blank'} rel={'noopener noreferrer'}>源码地址</a></p>
          <p>界面参考了<a
            href="http://www.ruanyifeng.com/home.html"
            target="_blank" rel="noopener noreferrer">阮一峰的个人网站</a>以及博客园的排版。开发本站主要是记录一些学习笔记，方便以后查阅，也给面试官了解自己的技能增加一个入口。</p>
          <p>本人之前主要是做前端开发，现在想找一份后端的工作。正在招人的老板们，如果有合适的坑可以与我联系</p>
        </div>
        <dl>
          <dt>作者邮箱</dt>
          <dd>lqhday@gmail.com</dd>
        </dl>
      </div>
    </>
  )
}