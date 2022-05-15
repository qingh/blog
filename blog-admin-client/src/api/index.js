import ajax from './axios';

const menuService = {
  getMenuList: params => ajax.get('/getMenuList', params),
};

const fileService = {
  download: params => ajax.get('/download', params),
  upload: params => ajax.upload('/upload', params),
};

const articleService = {
  articleList: params => ajax.get('/articles', params),
  addArticle: params => ajax.post('/articles', params),
  delArticle: params => ajax.delete(`/articles/${params}`),
  editArticle: params => ajax.put(`/articles/${params.id}`, params),
};

const commentService = {
  commentList: params => ajax.get('/comments', params),
  delComment: params => ajax.delete(`/comments/${params}`),
};

const labelService = {
  labelList: params => ajax.get('/labels', params),
  addLabel: params => ajax.post('/labels', params),
  delLabel: params => ajax.delete(`/labels/${params}`),
  editLabel: params => ajax.put(`/labels/${params.id}`, params),
};

const userService = {
  login: params => ajax.post('/login', params),
  userList: params => ajax.get('/users', params),
  addUser: params => ajax.post('/users', params),
  delUser: params => ajax.delete(`/users/${params}`),
  editUser: params => ajax.put(`/users/${params.id}`, params),
};

export { menuService, fileService, articleService, commentService, labelService, userService };
