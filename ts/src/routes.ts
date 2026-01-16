import { Elysia } from 'elysia'
import { itemRoutes } from './modules/items'
import { teacherRoutes } from './modules/teacher'

export const apiRoutes = new Elysia({ prefix: '/api' })
  .use(itemRoutes)
  .use(teacherRoutes)
  .get('/', {
    message: 'Welcome to the API',
    version: '1.0.0',
    detail: {
      tags: ['General'],
      summary: 'API 欢迎信息',
      description: '返回 API 的基本信息和版本号',
    },
  })
