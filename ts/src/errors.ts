/**
 * 自定义应用错误类
 * 用于在控制器中抛出带有 HTTP 状态码的错误
 */
export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "AppError"
  }
}

/**
 * 验证错误（400）
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message)
    this.name = "ValidationError"
  }
}

/**
 * 未授权错误（401）
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(401, message)
    this.name = "UnauthorizedError"
  }
}

/**
 * 禁止访问错误（403）
 */
export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(403, message)
    this.name = "ForbiddenError"
  }
}

/**
 * 资源不存在错误（404）
 */
export class NotFoundError extends AppError {
  constructor(message: string = "Not found") {
    super(404, message)
    this.name = "NotFoundError"
  }
}

/**
 * 冲突错误（409）
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message)
    this.name = "ConflictError"
  }
}
