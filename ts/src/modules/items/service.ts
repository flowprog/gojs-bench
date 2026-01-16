import { NotFoundError } from '../../errors'
import type { ItemModel } from './model'

// Item 类型
export type Item = ItemModel.Item

// 示例数据
let items: Item[] = [
  { id: '1', name: 'Item 1', description: 'First item' },
  { id: '2', name: 'Item 2', description: 'Second item' },
]

/**
 * Items 服务
 */
export abstract class ItemService {
  /**
   * 获取所有项目
   */
  static getItems() {
    return { data: items }
  }

  /**
   * 创建新项目
   */
  static async createItem(input: ItemModel.CreateBody) {
    const newItem: Item = {
      id: String(items.length + 1),
      name: input.name,
      description: input.description,
    }
    items.push(newItem)

    return {
      data: newItem,
      status: 201,
    }
  }

  /**
   * 获取单个项目
   */
  static getItemById(id: string) {
    const item = items.find((i) => i.id === id)
    if (!item) {
      throw new NotFoundError('Item not found')
    }
    return { data: item }
  }

  /**
   * 更新项目
   */
  static async updateItem(
    id: string,
    input: ItemModel.UpdateBody,
  ) {
    const index = items.findIndex((i) => i.id === id)

    if (index === -1) {
      throw new NotFoundError('Item not found')
    }

    items[index] = {
      ...items[index],
      name: input.name ?? items[index].name,
      description: input.description ?? items[index].description,
    }

    return { data: items[index] }
  }

  /**
   * 删除项目
   */
  static async deleteItem(id: string) {
    const index = items.findIndex((i) => i.id === id)

    if (index === -1) {
      throw new NotFoundError('Item not found')
    }

    const deletedItem = items.splice(index, 1)[0]
    return { data: deletedItem }
  }

  /**
   * CPU 密集型计算 - 斐波那契数列
   */
  static fibonacci(n: number): number {
    if (n <= 1) return n
    return this.fibonacci(n - 1) + this.fibonacci(n - 2)
  }

  /**
   * 计算密集型端点 - 用于压测
   */
  static async cpuIntensive(iterations: number = 40) {
    const startTime = Date.now()
    const result = this.fibonacci(iterations)
    const endTime = Date.now()

    return {
      data: {
        iterations,
        result,
        duration: `${endTime - startTime}ms`,
      },
    }
  }

  /**
   * 内存密集型计算 - 大数组处理
   */
  static async memoryIntensive(size: number = 1000000) {
    const startTime = Date.now()

    // 创建大数组
    const array = new Array(size)
    for (let i = 0; i < size; i++) {
      array[i] = Math.random()
    }

    // 排序计算
    array.sort((a, b) => a - b)

    // 计算统计值
    const sum = array.reduce((acc, val) => acc + val, 0)
    const avg = sum / size
    const mid = array[Math.floor(size / 2)]

    const endTime = Date.now()

    return {
      data: {
        size,
        sum,
        average: avg,
        median: mid,
        duration: `${endTime - startTime}ms`,
      },
    }
  }

  /**
   * 空等待端点 - 用于压测
   */
  static async wait(duration: number = 1000) {
    await new Promise((resolve) => setTimeout(resolve, duration))
    return {
      data: {
        message: `Waited ${duration}ms`,
      },
    }
  }
}
