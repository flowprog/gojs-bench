import { Elysia } from 'elysia'
import { ItemService } from './service'
import { ItemModel } from './model'

export const itemRoutes = new Elysia({ prefix: '/items' })
  .get(
    '/list',
    () => ItemService.getItems(),
    {
      detail: {
        tags: ['Items'],
        summary: '获取所有项目',
        description: '返回项目列表',
      },
    },
  )
  .post(
    '/:id/get',
    ({ params }) => ItemService.getItemById(params.id),
    {
      params: ItemModel.params,
      detail: {
        tags: ['Items'],
        summary: '获取单个项目',
        description: '根据 ID 获取项目详情',
      },
    },
  )
  .post(
    '/create',
    ({ body }) => ItemService.createItem(body),
    {
      body: ItemModel.createBody,
      detail: {
        tags: ['Items'],
        summary: '创建新项目',
        description: '创建一个新项目',
      },
    },
  )
  .post(
    '/:id/update',
    ({ params, body }) => ItemService.updateItem(params.id, body),
    {
      params: ItemModel.params,
      body: ItemModel.updateBody,
      detail: {
        tags: ['Items'],
        summary: '更新项目',
        description: '更新指定 ID 的项目信息',
      },
    },
  )
  .post(
    '/:id/delete',
    ({ params }) => ItemService.deleteItem(params.id),
    {
      params: ItemModel.params,
      detail: {
        tags: ['Items'],
        summary: '删除项目',
        description: '删除指定 ID 的项目',
      },
    },
  )
  .get(
    '/cpu',
    ({ body }) => ItemService.cpuIntensive(body?.iterations),
    {
      body: ItemModel.cpuIntensiveBody,
      detail: {
        tags: ['Items', 'Stress Test'],
        summary: 'CPU 密集型计算',
        description: '执行斐波那契数列计算，用于 CPU 压力测试。默认迭代 35 次，耗时约 50-100ms',
      },
    },
  )
  .get(
    '/memory',
    ({ body }) => ItemService.memoryIntensive(body?.size),
    {
      body: ItemModel.memoryIntensiveBody,
      detail: {
        tags: ['Items', 'Stress Test'],
        summary: '内存密集型计算',
        description: '创建大数组并进行排序和统计计算，用于内存压力测试。默认处理 100 万元素',
      },
    },
  )
  .get(
    '/wait',
    ({ body }) => ItemService.wait(body?.duration),
    {
      body: ItemModel.waitBody,
      detail: {
        tags: ['Items', 'Stress Test'],
        summary: '空等待端点',
        description: '等待指定时间后返回，用于测试连接池和并发处理能力。默认等待 1000ms',
      },
    },
  )
