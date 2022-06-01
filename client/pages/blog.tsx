import Link from 'next/link';
import Head from 'next/head'
import { service } from '../api';
import css from '../styles/blog.module.scss';
import { DateComponent } from '../components/date';
import { format } from '../utils';

interface IArticleList {
  id: number
  label_id: number
  title: string
  content: string
  author: string
  browser: number
  created_at: string
  updated_at: string
}

interface ILabelNum {
  id: number
  label: string
  num: number
}

export default function Blog({ articleList, labelNum }: { articleList: IArticleList[], labelNum: ILabelNum[] }) {

  async function getData() {
    let [err, data] = await service.articleList({ current: 1, pageSize: 10 })
    console.log(err);
    console.log(data.data);
  }

  return (
    <>
      <Head>
        <title>日志列表</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className={css.blog}>
        <div className={css['bread-crumb']}> <Link href="/">博客首页</Link><b>{'>'}</b><span>日志列表</span></div>
        <div className={css.main}>
          <div className={css.left}>
            <h3>最新文章</h3>
            {
              articleList.length ? (
                <ul className={css.list}>
                  {articleList.map(item => <li key={item.id}>
                    {/* <Link href={`/article?id=${item.id}`} as={`/article/${item.id}`}>{item.title}</Link> */}
                    <Link href={`/article?id=${item.id}`}>{item.title}</Link>
                    {/* <span title={`${item.browser}条评论`}>（{item.browser}）</span> */}
                    <span>{format(item.created_at)} </span>
                  </li>)}
                </ul>
              ) :
                <p className={css['no-article']}>暂无文章</p>
            }
          </div>
          <div className={css.right}>
            {/* <DateComponent /> */}
            <div className={css.item}>
              <h3>分类</h3>
              <ul>
                {
                  labelNum.map(item => <li key={item.id}><a href="#" onClick={(ev) => ev.preventDefault()} title={`${item.label}  ${item.num} 篇`}>{item.label} （{item.num}）</a></li>)
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* export async function getServerSideProps() {
  
} */

export async function getServerSideProps() {
  let result1: IArticleList[] = []
  let result2: ILabelNum[] = []
  let p1 = service.articleList({ current: 1, pageSize: 10 })
  let p2 = service.articleNumOfLabel()
  let [res1, res2] = await Promise.allSettled([p1, p2]);
  if (res1.status === 'fulfilled') {
    const [err, res] = res1.value;
    if (err) {
      console.log(err);
    } else {
      const { errorCode, message, data } = res.data
      if (errorCode) {
        result1 = data.records
      }
    }
  }
  if (res2.status === 'fulfilled') {
    const [err, res] = res2.value;
    if (err) {
      console.log(err);
    } else {
      const { errorCode, message, data } = res.data
      if (errorCode) {
        result2 = data
      }
    }
  }

  return {
    props: {
      articleList: result1,
      labelNum: result2
    }
  }
}
