import { t } from 'elysia'

export namespace ItemModel {
  /** Item 数据结构 */
  export const item = t.Object({
    id: t.String(),
    name: t.String(),
    description: t.String(),
    createdBy: t.Optional(t.String()),
    updatedBy: t.Optional(t.String()),
  })

  export type Item = typeof item.static

  /** 创建项目请求体 */
  export const createBody = t.Object({
    name: t.String({ minLength: 1 }),
    description: t.String({ minLength: 1 }),
  })

  export type CreateBody = typeof createBody.static

  /** 项目 ID 参数 */
  export const params = t.Object({
    id: t.String(),
  })

  export type Params = typeof params.static

  /** 更新项目请求体 */
  export const updateBody = t.Partial(
    t.Object({
      name: t.String({ minLength: 1 }),
      description: t.String({ minLength: 1 }),
    }),
  )

  export type UpdateBody = typeof updateBody.static

  /** CPU 密集型计算请求体 */
  export const cpuIntensiveBody = t.Optional(
    t.Object({
      iterations: t.Optional(t.Number({ minimum: 1, maximum: 40 })),
    }),
  )

  export type CpuIntensiveBody = typeof cpuIntensiveBody.static

  /** 内存密集型计算请求体 */
  export const memoryIntensiveBody = t.Optional(
    t.Object({
      size: t.Optional(t.Number({ minimum: 10000, maximum: 10000000 })),
    }),
  )

  export type MemoryIntensiveBody = typeof memoryIntensiveBody.static

  /** 等待端点请求体 */
  export const waitBody = t.Optional(
    t.Object({
      duration: t.Optional(t.Number({ minimum: 1, maximum: 60000 })),
    }),
  )

  export type WaitBody = typeof waitBody.static
}
