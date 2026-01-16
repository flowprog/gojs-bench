/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */

import { appendFile } from "node:fs/promises"
import { mkdirSync } from "node:fs"

interface Logger {
  trace(message: string, ...optionalParams: any[]): void
  debug(message: string, ...optionalParams: any[]): void
  info(message: string, ...optionalParams: any[]): void
  warn(message: string, ...optionalParams: any[]): void
  error(message: string, ...optionalParams: any[]): void
  [x: string]: any
}

const levels = ["trace", "debug", "info", "warn", "error"] as const
export type LogLevels = (typeof levels)[number]

const prefixColors = {
  trace: `\x1b[90m`, // gray
  debug: `\x1b[36m`, // cyan
  info: `\x1b[97m`, // white
  warn: `\x1b[33m`, // yellow
  error: `\x1b[31m`, // red
}
const colorReset = `\x1b[0m`

class logger implements Logger {
  private subscriptions: {
    fn: (m: { message: string; level: LogLevels; ts: number }) => void
    level: LogLevels
  }[]

  private appName: string
  private logDir: string
  private currentDate: string
  private fileEnabled: boolean
  private consoleEnabled: boolean
  private minLevel: LogLevels

  // 异步日志队列 - 直接存储格式化的日志行字符串
  private logQueue: string[]
  private queueProcessing: boolean = false
  private queueFlushInterval: number = 1000 // 每秒刷新一次
  private maxQueueSize: number = 100 // 最大缓存100条日志

  // 时间戳缓存
  private cachedTimestamp: string = ""
  private lastTimestampUpdate: number = 0
  private timestampCacheTTL: number = 100 // 缓存100ms

  constructor(
    appName: string = "app",
    logDir: string = "./logs",
    fileEnabled: boolean = true,
    consoleEnabled: boolean = true,
  ) {
    this.subscriptions = []
    this.appName = appName
    this.logDir = logDir
    this.currentDate = ""
    this.fileEnabled = fileEnabled
    this.consoleEnabled = consoleEnabled
    this.minLevel = process.env.NODE_ENV === "development" ? "trace" : "info"
    this.logQueue = []

    if (this.fileEnabled) {
      this.initializeLogFile()
      this.startQueueProcessor()
    }
  }

  /**
   * 初始化日志文件
   */
  private initializeLogFile() {
    try {
      // 确保日志目录存在（使用同步方法）
      mkdirSync(this.logDir, { recursive: true })

      // 获取当前日期
      this.currentDate = this.getFormattedDate()
    } catch (error) {
      console.error("Failed to initialize log file:", error)
      this.fileEnabled = false
    }
  }

  /**
   * 启动队列处理器
   */
  private startQueueProcessor() {
    // 定期刷新队列
    const intervalId = setInterval(() => {
      this.flushQueue()
    }, this.queueFlushInterval)

    // 确保进程退出前刷新队列
    process.on("beforeExit", () => {
      clearInterval(intervalId)
      this.flushQueue()
    })

    process.on("SIGINT", () => {
      clearInterval(intervalId)
      this.flushQueue()
    })

    process.on("SIGTERM", () => {
      clearInterval(intervalId)
      this.flushQueue()
    })
  }

  /**
   * 处理日志队列
   */
  private async flushQueue() {
    if (this.queueProcessing || this.logQueue.length === 0) return

    this.queueProcessing = true

    // 取出所有待写入的日志
    const entriesToWrite = this.logQueue.splice(0, this.logQueue.length)

    if (entriesToWrite.length === 0) {
      this.queueProcessing = false
      return
    }

    try {
      // 检查日期是否变化
      const todayDate = this.getFormattedDate()
      if (todayDate !== this.currentDate) {
        this.initializeLogFile()
      }

      // 批量写入文件 - 直接join，无需map格式化
      const logFilePath = `${this.logDir}/${this.appName}-${this.currentDate}.log`
      const logContent = entriesToWrite.join("")

      await appendFile(logFilePath, logContent)
    } catch (error) {
      console.error("Failed to flush log queue:", error)
    } finally {
      this.queueProcessing = false
    }
  }

  /**
   * 添加日志到队列
   */
  private enqueueLog(level: LogLevels, message: string) {
    if (!this.fileEnabled) return

    const timestamp = this.getCachedTimestamp()
    // 入队时直接格式化为最终字符串，避免flush时重复格式化
    const logLine = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`
    this.logQueue.push(logLine)

    // 如果队列达到最大大小，立即刷新
    if (this.logQueue.length >= this.maxQueueSize) {
      this.flushQueue()
    }
  }

  /**
   * 获取格式化的日期 YYYY-MM-DD
   */
  private getFormattedDate(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  /**
   * 获取缓存的格式化时间戳 YYYY-MM-DD HH:mm:ss.SSS
   */
  private getCachedTimestamp(): string {
    const now = Date.now()

    // 如果缓存过期，更新时间戳
    if (now - this.lastTimestampUpdate > this.timestampCacheTTL) {
      const date = new Date()
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")
      const hours = String(date.getHours()).padStart(2, "0")
      const minutes = String(date.getMinutes()).padStart(2, "0")
      const seconds = String(date.getSeconds()).padStart(2, "0")
      const milliseconds = String(date.getMilliseconds()).padStart(3, "0")

      this.cachedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`
      this.lastTimestampUpdate = now
    }

    return this.cachedTimestamp
  }

  trace(message: string | Error | unknown, ...optionalParams: any[]) {
    if (message instanceof Error) {
      this.log("trace", message.message, [
        optionalParams,
        message.stack,
        message.cause,
      ])
    } else if (typeof message === "string") {
      this.log("trace", message, optionalParams)
    } else {
      this.log("trace", JSON.stringify(message), optionalParams)
    }
  }

  debug(message: string | Error | unknown, ...optionalParams: any[]) {
    if (message instanceof Error) {
      this.log("debug", message.message, [
        optionalParams,
        message.stack,
        message.cause,
      ])
    } else if (typeof message === "string") {
      this.log("debug", message, optionalParams)
    } else {
      this.log("debug", JSON.stringify(message), optionalParams)
    }
  }

  info(message: string | Error | unknown, ...optionalParams: any[]) {
    if (message instanceof Error) {
      this.log("info", message.message, [
        optionalParams,
        message.stack,
        message.cause,
      ])
    } else if (typeof message === "string") {
      this.log("info", message, optionalParams)
    } else {
      this.log("info", JSON.stringify(message), optionalParams)
    }
  }

  warn(message: string | Error | unknown, ...optionalParams: any[]) {
    if (message instanceof Error) {
      this.log("warn", message.message, [
        optionalParams,
        message.stack,
        message.cause,
      ])
    } else if (typeof message === "string") {
      this.log("warn", message, optionalParams)
    } else {
      this.log("warn", JSON.stringify(message), optionalParams)
    }
  }

  error(message: string | Error | unknown, ...optionalParams: any[]) {
    if (message instanceof Error) {
      this.log("error", message.message, [
        optionalParams,
        message.stack,
        message.cause,
      ])
    } else if (typeof message === "string") {
      this.log("error", message, optionalParams)
    } else {
      this.log("error", JSON.stringify(message), optionalParams)
    }
  }

  subscribe(
    fn: (m: { message: string; level: LogLevels; ts: number }) => void,
    level?: LogLevels,
  ) {
    if (!level) level = "info"
    this.subscriptions.push({ fn, level })
  }

  unsubscribe(
    fn: (m: { message: string; level: LogLevels; ts: number }) => void,
  ) {
    this.subscriptions = this.subscriptions.filter(
      ({ fn: subFn }) => subFn !== fn,
    )
  }

  private log(level: LogLevels, message: string, optionalParams: any[]) {
    // 日志级别过滤
    if (!getLogLevels(this.minLevel).includes(level)) return

    const ts = Date.now()

    if (this.consoleEnabled) {
      console[level](consoleFormat(level, message), ...optionalParams)
    }

    // 异步写入队列（不阻塞）
    this.enqueueLog(level, message)

    this.subscriptions.forEach(({ fn, level: subLevel }) => {
      if (getLogLevels(subLevel).includes(level)) fn({ message, level, ts })
    })
  }
}

// get all log levels above and including the given level
const getLogLevels = (level: LogLevels): LogLevels[] => {
  return levels.slice(levels.indexOf(level))
}

// formatting
const consoleFormat = (level: LogLevels, message: string) => {
  return `${
    prefixColors[level]
  }[${level.toUpperCase()}] ${message}${colorReset}`
}

const loggerInstance = new logger("tsbff", "./logs", true, false)

export default loggerInstance

/**
 * HTTP 请求日志包装器
 * 记录请求和响应信息
 */
export function withHttpLogger(
  handler: (req: Request) => Response | Promise<Response>,
): (req: Request) => Promise<Response> {
  return async (req: Request) => {
    const url = new URL(req.url)
    const method = req.method
    const userAgent = req.headers.get("user-agent") || "unknown"
    const startTime = Date.now()

    loggerInstance.info(
      `HTTP Request: ${method} ${url.pathname} - User-Agent: ${userAgent}`,
    )

    try {
      const res = await handler(req)
      const duration = Date.now() - startTime
      const status = res.status
      const statusText =
        status >= 200 && status < 300
          ? "SUCCESS"
          : status >= 400 && status < 500
            ? "CLIENT_ERROR"
            : status >= 500
              ? "SERVER_ERROR"
              : "UNKNOWN"

      if (status >= 400) {
        loggerInstance.warn(
          `HTTP Response: ${method} ${url.pathname} - Status: ${status} ${statusText} - ${duration}ms`,
        )
      } else {
        loggerInstance.info(
          `HTTP Response: ${method} ${url.pathname} - Status: ${status} ${statusText} - ${duration}ms`,
        )
      }

      return res
    } catch (error) {
      const duration = Date.now() - startTime
      loggerInstance.error(
        `HTTP Error: ${method} ${url.pathname} - ${(error as Error).message} - ${duration}ms`,
      )
      throw error
    }
  }
}
