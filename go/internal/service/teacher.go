// first version is auto generated, copyright dpetal@sina.com

package service

import (
	"context"
	"gotmpl/internal/library/hgorm/handler"
	"gotmpl/internal/model/input/sysin"
	"github.com/gogf/gf/v2/database/gdb"
)

var localSysTeacher        ISysTeacher

type ISysTeacher interface {
		// Model ORM模型
		Model(ctx context.Context, option ...*handler.Option) *gdb.Model
		// List 获取列表
		List(ctx context.Context, in *sysin.TeacherListInp) (list []*sysin.TeacherListModel, totalCount int, err error)
		// Export 导出
		Export(ctx context.Context, in *sysin.TeacherListInp) (err error)
		// Edit 修改/新增
		Edit(ctx context.Context, in *sysin.TeacherEditInp) (err error)
		// Delete 删除
		Delete(ctx context.Context, in *sysin.TeacherDeleteInp) (err error)
		// View 获取指定信息
		View(ctx context.Context, in *sysin.TeacherViewInp) (res *sysin.TeacherViewModel, err error)
	}

func SysTeacher() ISysTeacher {
	if localSysTeacher == nil {
		panic("implement not found for interface ISysTeacher, forgot register?")
	}
	return localSysTeacher
}

func RegisterSysTeacher(i ISysTeacher) {
	localSysTeacher = i
}