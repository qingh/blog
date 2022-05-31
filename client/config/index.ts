const env = process.env.NODE_ENV

const url = env === 'development' ? 'http://localhost' : 'http://121.41.3.33'

export const baseUrl = `${url}:8888`