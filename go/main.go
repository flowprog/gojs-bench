package main

import (
	_ "gotmpl/internal/packed"

	"github.com/gogf/gf/v2/os/gctx"

	"gotmpl/internal/cmd"

	_ "gotmpl/internal/logic"

	_ "github.com/gogf/gf/contrib/drivers/pgsql/v2"
)

func main() {
	cmd.Main.Run(gctx.GetInitCtx())
}
