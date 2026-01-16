import {
  queryTeachers,
  queryTeachersNonChinese,
  updateTeacher as dbUpdateTeacher,
} from './dao'
import type { TeacherModel } from './model'

// Teacher 查询参数类型
export interface TeacherQueryParams {
  id?: string
  name?: string
  page?: number
  pageSize?: number
}

/**
 * Teacher 服务
 */
export abstract class TeacherService {
  /**
   * 获取教师列表（直接从数据库查询，支持分页）
   */
  static async getOriginTeacher(params: TeacherQueryParams = {}) {
    const { id, name, page = 1, pageSize = 10 } = params

    // 构建查询条件
    const query: { id?: string; name?: string } = {}
    if (id) query.id = id
    if (name) query.name = name

    // 调用数据库查询
    const list = await queryTeachers(query, { page, pageSize })

    return {
      list,
      totalCount: list.length,
      pageSize,
      pageCount: Math.ceil(list.length / pageSize),
      pagination: true,
      page,
    }
  }

  /**
   * 获取教师列表（调用已有的API，过滤只返回name包含中文的）
   */
  static async getTeacherTransform() {
    const list = await queryTeachersNonChinese()

    return {
      list,
      totalCount: list.length,
      pageSize: list.length,
      pageCount: 1,
      pagination: false,
      page: 1,
    }
  }

  /**
   * 更新教师（直接从数据库更新）
   */
  static async updateTeacher(input: TeacherModel.UpdateBody) {
    const result = await dbUpdateTeacher(input.id, { name: input.name })
    return result
  }
}
