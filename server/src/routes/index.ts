import Koa from 'koa';
import { articles } from './articles.js';
import { comments } from './comments.js';
import { labels } from './labels.js';
import { users } from './users.js';



export const router = (app: Koa) => {
  app.use(articles.routes()).use(articles.allowedMethods())
  app.use(comments.routes()).use(comments.allowedMethods())
  app.use(labels.routes()).use(labels.allowedMethods())
  app.use(users.routes()).use(users.allowedMethods())
}