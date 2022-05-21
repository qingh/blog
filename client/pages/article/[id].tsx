/* export default function Test() {
  return <h1>进来了</h1>
} */

import Link from 'next/link';
import Image from 'next/image';
import { baseUrl } from '../../config';
import css from '../../styles/article.module.scss';

interface IArticleDetail {
  id: number,
  label_id: number,
  title: string,
  content: string,
  author: string,
  browser: number,
  created_at: string,
  updated_at: string,
  label: "java"
}
interface IContext {
  prevData: {
    id: number,
    title: string,
  }
  nextData: {
    id: number,
    title: string,
  }
}

export default function Article({ articleDetail, context }: { articleDetail: IArticleDetail, context: IContext }) {
  if (articleDetail) {
    return (
      <div className={css.article}>
        <div className={css['bread-crumb']}>
          <Link href="/">博客首页</Link><b>{'>'}</b><Link href="/blog">日志列表</Link><b>{'>'}</b><span>日志详情</span>
        </div>
        <div className={css.top}>
          <p className={css.type}>分类：<a href="#" onClick={(ev) => ev.preventDefault()}>{articleDetail.label}</a></p>
          <ul>
            {context.prevData ? <li><span>上一篇：</span><Link href={`/article?id=${context.prevData.id}`} as={`/article/${context.prevData.id}`}>{context.prevData.title}</Link></li> : null}
            {context.nextData ? <li><span>下一篇：</span><Link href={`/article?id=${context.nextData.id}`} as={`/article/${context.nextData.id}`}>{context.nextData.title}</Link></li> : null}
          </ul>
        </div>
        <div className={css.main}>
          <h1 className={css.title}>{articleDetail.title}</h1>
          <p className={css.author}>作者：{articleDetail.author}</p>
          <p className={css.date}>日期：{articleDetail.created_at}</p>
          {/* <iframe id="mainFrame" name="mainFrame" src="https://www.a.com"
            width="100%" height="1000" scrolling="no"></iframe> */}
          <div>
            {articleDetail.content}
          </div>
        </div>
        <div className={css['leave-word']}>
          <h2>我要发表看法</h2>
          <dl>
            <dt>* 您的留言：</dt>
            <dd><textarea id="msgContent" placeholder="请输入留言"></textarea></dd>
          </dl>
          <dl>
            <dt>* 您的昵称：</dt>
            <dd><input id="nickName" type="text" /></dd>
          </dl>
          <dl>
            <dt>头像：（建议尺寸72*72，支持 jpg | png | bmp | gif）</dt>
            <dd>
              <input id="picker" type="file" name="logo" />
              <span className={css['sel-file']} id="selFile" title="images/default.jpg">未选择任何文件</span>
              {/* <img id="loading" src="./images/loading.gif" /> */}
              <Image src="/images/loading.gif" alt='' layout='fill' />
            </dd>
          </dl>
          <input className={css.publish} id="publish" type="button" value="发表" />
        </div>
      </div>
    )
  } else {
    return <h1>loading...</h1>
  }

}


export async function getStaticProps(context: { params: { id: number } }) {
  const { id } = context.params
  let result1: IArticleDetail[] = []
  let result2: IContext[] = []
  {
    let res = await fetch(`${baseUrl}/api/v1/articles/${id}`)
    let { errorCode, message, data } = await res.json()
    if (errorCode) {
      result1 = data
    } else {
      console.log(message);
    }
  }
  {
    let res = await fetch(`${baseUrl}/api/v1/articles/${id}/context`)
    let { errorCode, message, data } = await res.json()
    if (errorCode) {
      result2 = data
    } else {
      console.log(message);
    }
  }


  return {
    props: {
      articleDetail: result1,
      context: result2
    }
  }
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: "134", user: 'qingh' } }],
    fallback: true,
  };
}
