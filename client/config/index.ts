const env = process.env.NODE_ENV

const url = env === 'development' ? 'http://localhost' : 'http://42.192.188.150'

export const baseUrl = `${url}:8888`