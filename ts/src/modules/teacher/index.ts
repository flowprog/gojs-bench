import { Elysia, t } from 'elysia'
import { TeacherService } from './service'
import { TeacherModel } from './model'

export const teacherRoutes = new Elysia({ prefix: '/teacher' })
  .post(
    '/origin',
    ({ body }) => {
      const params = {
        id: body.id,
        name: body.name,
        page: body.page ? Number(body.page) : undefined,
        pageSize: body.pageSize ? Number(body.pageSize) : undefined,
      }
      return TeacherService.getOriginTeacher(params)
    },
    {
      body: t.Object({
        id: t.Optional(t.String()),
        name: t.Optional(t.String()),
        page: t.Optional(t.String()),
        pageSize: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Teacher'],
        summary: '获取教师列表（原始数据）',
        description: '从数据库查询教师数据，支持分页',
      },
    },
  )
  .get(
    '/transform',
    () => TeacherService.getTeacherTransform(),
    {
      detail: {
        tags: ['Teacher'],
        summary: '获取教师列表（仅中文）',
        description: '返回姓名包含中文的教师数据',
      },
    },
  )
  .post(
    '/update',
    ({ body }) => TeacherService.updateTeacher(body),
    {
      body: TeacherModel.updateBody,
      detail: {
        tags: ['Teacher'],
        summary: '更新教师信息',
        description: '根据 ID 更新教师的姓名',
      },
    },
  )
