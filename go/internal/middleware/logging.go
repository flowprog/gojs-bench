package middleware

import (
	"time"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/gogf/gf/v2/os/gctx"
)

// RequestLogging 请求日志记录中间件
func RequestLogging(r *ghttp.Request) {
	// 记录请求入口日志
	g.Log().Debugf(gctx.New(), "Request: method=%s path=%s query=%+v body=%s", 
		r.Method, r.URL.Path, r.URL.Query(), r.GetBodyString())
	
	// 记录开始时间
	startTime := time.Now()
	
	// 继续处理请求
	r.Middleware.Next()
	
	// 计算请求耗时
	duration := time.Since(startTime)
	
	// 获取响应状态码
	statusCode := r.Response.Status
	
	// 记录日志
	g.Log().Info(gctx.New(), 
		"path:", r.URL.Path,
		"method:", r.Method,
		"status:", statusCode,
		"duration:", duration.String(),
		"client_ip:", r.GetClientIp(),
	)

	// 获取返回值
    // if err := r.GetError(); err != nil {
    //     // 统计错误次数
    //     g.Log().Errorf(r.Context(), "请求[%s]发生错误: %v", r.URL.Path, err)
	// }
}