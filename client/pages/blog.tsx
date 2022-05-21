import Link from 'next/link';
import { baseUrl } from '../config';
import css from '../styles/blog.module.scss';
import { Date } from '../components/date';
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
  console.log(articleList);
  return (
    <div className={css.blog}>
      <div className={css['bread-crumb']}> <Link href="/">博客首页</Link><b>{'>'}</b><span>日志列表</span></div>
      <div className={css.main}>
        <div className={css.left}>
          <h3>最新文章</h3>
          {
            articleList.length ? (
              <ul className={css.list}>
                {articleList.map(item => <li key={item.id}>
                  <Link href={`/article?id=${item.id}`} as={`/article/${item.id}`}>{item.title}</Link>
                  <span title={`${item.browser}条评论`}>（{item.browser}）</span>
                  <span>{format(item.created_at)} </span>
                </li>)}
              </ul>
            ) :
              <p className={css['no-article']}>暂无文章</p>
          }
        </div>
        <div className={css.right}>
          <Date />
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
  )
}

export async function getStaticProps() {
  let result1: IArticleList[] = []
  let result2: ILabelNum[] = []
  {
    let res = await fetch(`${baseUrl}/api/v1/articles?current=1&pageSize=10`)
    let { errorCode, message, data } = await res.json()
    if (errorCode) {
      result1 = data.records
    } else {
      console.log(message);
    }
  }
  {
    let res = await fetch(`${baseUrl}/api/v1/labels/articleNumOfLabel`)
    let { errorCode, message, data } = await res.json()
    if (errorCode) {
      result2 = data
    } else {
      console.log(message);
    }
  }

  console.log(result1);
  console.log(result2);
  return {
    props: {
      articleList: result1,
      labelNum: result2
    }
  }
}
