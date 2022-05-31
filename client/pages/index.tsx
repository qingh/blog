import Link from 'next/link';
import Head from 'next/head'
import css from '../styles/index.module.scss';

const Home = () => {
  return (
    <>
      <Head>
        <title>刘庆华的个人网站</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={css.home}>
        <main className={css.main}>
          <div className={css.title}><strong>刘庆华的个人网站</strong><span>qingh&apos;s Personal Website</span></div>
          <div className={css.content}>
            <div className={css.blog}>
              <Link href="/blog">» 网络日志（Blog）</Link>
            </div>
          </div>
          <footer className={css.footer}><Link href="/about">about this blog</Link><b></b><span>liuqh.com</span></footer>
        </main>
      </div>
    </>
  )
}

export default Home
