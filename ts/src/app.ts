import { Elysia } from "elysia"
import { swagger } from "@elysiajs/swagger"
import loggerInstance from "./logger"
import { sql } from "bun"
import { apiRoutes } from "./routes"
import { AppError } from "./errors"

const port = Number(process.env.PORT) || 3000

// 创建 Elysia 应用
export const app = new Elysia({
  serve: {
    reusePort: true,
  },
})
  // Swagger API 文档
  .use(
    swagger({
      documentation: {
        info: {
          title: "TSBFF API",
          version: "1.0.0",
          description: "TypeScript/Bun Fast Backend Framework API 文档",
        },
        tags: [
          { name: "User", description: "用户管理" },
          { name: "Auth", description: "认证相关" },
          { name: "Items", description: "项目管理" },
          { name: "Teacher", description: "教师数据管理" },
        ],
      },
      swaggerOptions: {
        persistAuthorization: true,
      },
      excludeStaticFile: true,
    }),
  )
  // 全局错误处理
  .onError(({ code, error, set }) => {
    const errorMessage = error instanceof Error ? error.message : String(error)
    loggerInstance.error(`Error: ${code} - ${errorMessage}`)

    // 处理自定义 AppError
    if (error instanceof AppError) {
      set.status = error.status
      return { error: errorMessage }
    }

    if (code === "NOT_FOUND") {
      set.status = 404
      return { error: "Not found" }
    }

    if (code === "VALIDATION") {
      set.status = 400
      return { error: "Validation failed", details: errorMessage }
    }

    set.status = 500
    return { error: "Internal Server Error", message: errorMessage }
  })
  // 全局请求日志
  .onBeforeHandle(({ request, set }) => {
    const url = new URL(request.url)
    const method = request.method
    const userAgent = request.headers.get("user-agent") || "unknown"

    set.headers["X-Request-ID"] = crypto.randomUUID()
    set.headers["X-Request-Start"] = Date.now().toString()
    loggerInstance.info(
      `HTTP Request: ${method} ${url.pathname} - User-Agent: ${userAgent}`,
    )
  })
  .onAfterHandle(({ request, set }) => {
    const url = new URL(request.url)
    const method = request.method
    const status = Number(set.status) || 200
    const startTime = Number(set.headers["X-Request-Start"] || Date.now())
    const duration = Date.now() - startTime

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
  })
  // 注册 API 路由
  .use(apiRoutes)

  // 404 处理（放在所有路由之后）
  .all("*", ({ request }) => {
    const url = new URL(request.url)
    loggerInstance.debug(`Path not found: ${url.pathname}`)
    return {
      error: "Not found",
      path: url.pathname,
    }
  })

// 打印数据库配置信息
function printDatabaseConfig() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.log("数据库: 未配置 DATABASE_URL")
    return
  }

  try {
    const url = new URL(databaseUrl)
    const host = url.hostname
    const port = url.port || "5432"
    const database = url.pathname.slice(1) || "default"
    const user = url.username

    console.log("\n数据库配置:")
    console.log(`  连接类型: ${url.protocol.replace(":", "")}`)
    console.log(`  主机: ${host}`)
    console.log(`  端口: ${port}`)
    console.log(`  数据库: ${database}`)
    console.log(`  用户: ${user}`)

    // 从 sql.options 获取连接池配置
    const maxConnections = sql.options.max
    console.log(`  连接池: 已启用`)
    console.log(`  最大连接数: ${maxConnections}`)
  } catch (error) {
    console.log("数据库: 无法解析 DATABASE_URL")
  }
}

export type App = typeof app

// 启动服务器
export function startServer() {
  app.listen({
    port,
    hostname: '0.0.0.0'
  })

  console.log(`\nListening on http://0.0.0.0:${port}`)
  printDatabaseConfig()
  console.log(`\nPress Ctrl+C to stop`)

  // 优雅关闭处理
  async function gracefulShutdown(signal: string) {
    console.log(`\n收到 ${signal} 信号，开始优雅关闭...`)

    try {
      // 停止服务器
      app.stop()
      console.log("服务器已停止")

      // 关闭所有数据库连接
      await sql.end()
      console.log("数据库连接已关闭")

      console.log("优雅关闭完成")
      process.exit(0)
    } catch (error) {
      console.error("优雅关闭过程中出错:", error)
      process.exit(1)
    }
  }

  // 监听终止信号
  process.on("SIGINT", () => gracefulShutdown("SIGINT"))
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
}
