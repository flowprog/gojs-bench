// first version is auto generated, copyright dpetal@sina.com


package teacher

import (
	"gotmpl/internal/model/input/form"
	"gotmpl/internal/model/input/sysin"

	"github.com/gogf/gf/v2/frame/g"
)

// ListReq 查询列表
type ListReq struct {
	g.Meta `path:"/teacher/list" method:"get" tags:"" summary:"获取列表"`
	sysin.TeacherListInp
}

type ListRes struct {
	form.PageRes
	List []*sysin.TeacherListModel `json:"list"   dc:"数据列表"`
}

// ExportReq 导出列表
type ExportReq struct {
	g.Meta `path:"/teacher/export" method:"get" tags:"" summary:"导出列表"`
	sysin.TeacherListInp
}

type ExportRes struct{}

// ViewReq 获取指定信息
type ViewReq struct {
	g.Meta `path:"/teacher/view" method:"get" tags:"" summary:"获取指定信息"`
	sysin.TeacherViewInp
}

type ViewRes struct {
	*sysin.TeacherViewModel
}

// EditReq 修改/新增
type EditReq struct {
	g.Meta `path:"/teacher/edit" method:"post" tags:"" summary:"修改/新增"`
	sysin.TeacherEditInp
}

type EditRes struct{}

// DeleteReq 删除
type DeleteReq struct {
	g.Meta `path:"/teacher/delete" method:"post" tags:"" summary:"删除"`
	sysin.TeacherDeleteInp
}

type DeleteRes struct{}

// Item 数据项
type Item struct {
	Id          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

// ItemsReq 获取数据项列表
type ItemsReq struct {
	g.Meta `path:"/items" method:"get" tags:"" summary:"获取数据项列表"`
}

type ItemsRes struct {
	Items []Item `json:"items"`
}