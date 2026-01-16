package utils

import (
	"context"

	"github.com/gogf/gf/v2/net/ghttp"
)

// GetCurrentUserRole 从context中获取当前用户的角色
// 在中间件中已经将role信息写入了context，这里提供便捷的获取方法
func GetCurrentUserRole(ctx context.Context) (string, string) {
	if r := ghttp.RequestFromCtx(ctx); r != nil {
		if role := r.GetCtxVar("role"); role != nil {
			if roleStr, ok := role.Interface().(string); ok {
				uid := r.GetCtxVar("uid")
				uidStr, _ := uid.Interface().(string)
				return roleStr, uidStr
			}
		}
	}
	return "", ""
}

// IsAdmin 判断当前用户是否为管理员
func IsAdmin(ctx context.Context) bool {
	role, _ := GetCurrentUserRole(ctx)
	return role == "admin"
}

// IsTeacher 判断当前用户是否为教师
func IsTeacher(ctx context.Context) bool {
	role, _ := GetCurrentUserRole(ctx)
	return role == "teacher"
}