import { t } from 'elysia'

export namespace TeacherModel {
  /** 更新教师请求体 */
  export const updateBody = t.Object({
    id: t.String({ minLength: 1 }),
    name: t.String({ minLength: 1 }),
  })

  export type UpdateBody = typeof updateBody.static
}
