import { sql } from "bun"

export type TeacherItem = {
  id?: string
  name: string
}

export type PaginationParams = {
  page?: number
  pageSize?: number
}

/**
 * 查询教师列表
 * @param query 查询条件
 * @param pagination 分页参数
 * @returns 教师列表
 */
export async function queryTeachers(
  query?: Partial<TeacherItem>,
  pagination?: PaginationParams,
): Promise<TeacherItem[]> {
  const page = pagination?.page || 1
  const pageSize = pagination?.pageSize || 10
  const offset = (page - 1) * pageSize

  if (query?.id) {
    return await sql`SELECT * FROM teacher WHERE id = ${query.id} LIMIT ${pageSize} OFFSET ${offset}`
  }
  if (query?.name) {
    return await sql`SELECT * FROM teacher WHERE name LIKE ${"%" + query.name + "%"} LIMIT ${pageSize} OFFSET ${offset}`
  }
  return await sql`SELECT * FROM teacher LIMIT ${pageSize} OFFSET ${offset}`
}

/**
 * 创建教师
 */
export async function createTeacher(data: TeacherItem): Promise<TeacherItem> {
  const [result] = await sql`
    INSERT INTO teachers ${sql(data)}
    RETURNING *
  `
  return result as TeacherItem
}

/**
 * 更新教师
 */
export async function updateTeacher(
  id: string,
  data: TeacherItem,
): Promise<TeacherItem> {
  const [result] = await sql`
    UPDATE teacher
    SET ${sql(data)}
    WHERE id = ${id}
    RETURNING *
  `
  return result as TeacherItem
}

/**
 * 删除教师
 */
export async function deleteTeacher(id: string): Promise<void> {
  await sql`DELETE FROM teachers WHERE id = ${id}`
}

/**
 * 查询不包含中文的教师
 * @returns 教师列表
 */
export async function queryTeachersNonChinese(): Promise<TeacherItem[]> {
  /*return await sql`
    SELECT * FROM teacher
    WHERE name !~ '[\u4e00-\u9fa5]'
    `;*/
  return await sql`SELECT id,name FROM teacher where deleted_at is null ORDER BY id DESC LIMIT 10 OFFSET 0`
}
