// first version is auto generated, copyright dpetal@sina.com

package sysin

import (
	"context"
	"gotmpl/internal/model/entity"
	"gotmpl/internal/model/input/form"
)

// TeacherUpdateFields 修改字段过滤
type TeacherUpdateFields struct {
	Name string `json:"name" description:""`
}

// TeacherInsertFields 新增字段过滤
type TeacherInsertFields struct {
	Id   string `json:"id" description:""`
	Name string `json:"name" description:""`
}

// TeacherEditInp 修改/新增
type TeacherEditInp struct {
	entity.Teacher
}

func (in *TeacherEditInp) Filter(ctx context.Context) (err error) {

	return
}

type TeacherEditModel struct{}

// TeacherDeleteInp 删除
type TeacherDeleteInp struct {
	Id interface{} `json:"id" v:"required#id不能为空" dc:"id"`
}

func (in *TeacherDeleteInp) Filter(ctx context.Context) (err error) {
	return
}

type TeacherDeleteModel struct{}

// TeacherViewInp 获取指定信息
type TeacherViewInp struct {
	Id string `json:"id" v:"required#id不能为空" dc:"id"`
}

func (in *TeacherViewInp) Filter(ctx context.Context) (err error) {
	return
}

type TeacherViewModel struct {
	entity.Teacher
}

// TeacherListInp 获取列表
type TeacherListInp struct {
	form.PageReq
	Id string `json:"id" dc:"id"`
}

func (in *TeacherListInp) Filter(ctx context.Context) (err error) {
	return
}

type TeacherListModel struct {
	Id string `json:"id" description:""`
	Name string `json:"name" description:""`
}

// TeacherExportModel 导出
type TeacherExportModel struct {
	Id string `json:"id" description:""`
	Name string `json:"name" description:""`
}
