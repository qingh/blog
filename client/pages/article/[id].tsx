import { FormEvent, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { service } from '../../api';
import { baseUrl } from '../../config';
import css from '../../styles/article.module.scss';
import { format } from '../../utils';

interface IComment {
  id: number
  article_id: number
  nick_name: string
  comment: string
  avatar: string
  created_at: string
  updated_at: string
}
interface IArticleDetail {
  id: number,
  label_id: number,
  title: string,
  content: string,
  author: string,
  browser: number,
  created_at: string,
  updated_at: string,
  label: "java",
  comment: IComment[]
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
  const commentRef = useRef<HTMLTextAreaElement>(null)
  const nickRef = useRef<HTMLInputElement>(null)
  const avatarRef = useRef<HTMLInputElement>(null)

  const [dd, setDD] = useState(articleDetail)

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const comment = commentRef.current!.value;
    const nick_name = nickRef.current!.value;
    const avatar = avatarRef.current!.files;
    const formData = new FormData()
    formData.append('article_id', articleDetail.id.toString())
    formData.append('comment', comment)
    formData.append('nick_name', nick_name)
    if (avatar?.length) {
      formData.append('avatar', avatar[0])
    }
    const [err, res] = await service.addComment(formData)
    if (err) {
      console.log(err);
    } else {
      const { errorCode } = res.data
      if (errorCode) {
        // getStaticProps({ params: { id: articleDetail.id } })
        const [err, res] = await service.commentOfarticle(articleDetail.id)
        if (err) {
          console.log(err);
        }
        const { errorCode,data } = res.data
        if (errorCode) {
          console.log(data.comment);
          // setDD({
          //   ...articleDetail,
          //   comment:data.comment
          // })
          setDD(data)
        }
      }
    }
  }
  console.log('render');

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
          <p className={css.date}>日期：{format(articleDetail.created_at)}</p>
          {/* <iframe id="mainFrame" name="mainFrame" src="https://www.a.com"
            width="100%" height="1000" scrolling="no"></iframe> */}
          <div>
            {articleDetail.content}
          </div>
        </div>
        <div className={css.msg}>
          <h2>留言（{articleDetail.comment.length}条）</h2>
          <ul>
            {
              articleDetail.comment.map((item, index) => <li key={item.id}>
                <div className={css['msg-wrap']}>
                  <div className={css.photo}>
                    <Image src={`${baseUrl}${item.avatar}`} loader={({ src }) => src} width="48" height="48" alt='' unoptimized={true} />
                    <span>{item.nick_name}</span>
                  </div>
                  <div className={css['msg-right']}>
                    <div className={css['msg-cnt']}>
                      <p>{item.comment}</p>
                    </div>
                  </div>
                </div>
                <div className={css['msg-info']}>
                  <p>{format(item.created_at)}</p>
                </div>
                <a className={css.floor} href="#" onClick={ev => ev.preventDefault()}>#{index + 1}楼</a>
              </li>)
            }
          </ul>
        </div>
        <div className={css['leave-word']}>
          <h2>我要发表看法</h2>
          <form onSubmit={onSubmit}>
            <dl>
              <dt>* 您的留言：</dt>
              <dd><textarea name="comment" ref={commentRef} placeholder="请输入留言"></textarea></dd>
            </dl>
            <dl>
              <dt>* 您的昵称：</dt>
              <dd><input name="nick_name" type="text" ref={nickRef} /></dd>
            </dl>
            <dl>
              <dt>头像：（建议尺寸72*72，支持 jpg | png | bmp | gif）</dt>
              <dd>
                <input type="file" name="avatar" ref={avatarRef} />
                {/* <span className={css['sel-file']} title="images/default.jpg">未选择任何文件</span> */}
                <button className={css['sel-file']} type='button'>选择文件</button>
                {/* <img id="loading" src="./images/loading.gif" /> */}
                {/* <Image src="/images/loading.gif" alt='' layout='fill' /> */}
              </dd>
            </dl>
            <input className={css.publish} type="submit" value="发表" />
          </form>
        </div>
      </div>
    )
  } else {
    return <h1>loading...</h1>
  }
}

export async function getStaticProps(context: { params: { id: number } }) {
  console.log('@@', context);
  const { id } = context.params
  let result1: IArticleDetail[] = []
  let result2: IContext[] = []
  let p1 = service.commentOfarticle(id)
  let p2 = service.articleContext(id)
  let [res1, res2] = await Promise.allSettled([p1, p2]);
  if (res1.status === 'fulfilled') {
    const [err, res] = res1.value;
    if (err) {
      console.log(err);
    } else {
      const { errorCode, data } = res.data
      if (errorCode) {
        result1 = data
      }
    }
  }
  if (res2.status === 'fulfilled') {
    const [err, res] = res2.value;
    if (err) {
      console.log(err);
    } else {
      const { errorCode, data } = res.data
      if (errorCode) {
        result2 = data
      }
    }
  }

  return {
    props: {
      articleDetail: result1,
      context: result2
    }
  }
}

export async function getStaticPaths(...args) {
  console.log('201', args);
  return {
    paths: [{ params: { id: "" } }],
    fallback: true,
  };
}
