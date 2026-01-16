package cmd

import (
	"context"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/gogf/gf/v2/os/gcmd"

	"gotmpl/internal/controller"
	"gotmpl/internal/controller/hello"
	userctrl "gotmpl/internal/controller/user"
	"gotmpl/internal/middleware"
)

var (
	Main = gcmd.Command{
		Name:  "main",
		Usage: "main",
		Brief: "start http server",
		Func: func(ctx context.Context, parser *gcmd.Parser) (err error) {

			s := g.Server()
			s.Use(ghttp.MiddlewareCORS)

			s.Group("/api", func(group *ghttp.RouterGroup) {
				group.Middleware(ghttp.MiddlewareHandlerResponse)
				group.Middleware(middleware.RequestLogging)

				group.Bind(
					controller.Teacher,
					hello.NewV1(),
					userctrl.NewV1(),
				)
			})

			s.Run()
			return nil
		},
	}
)
