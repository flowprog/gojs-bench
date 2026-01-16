// first version is auto generated, copyright dpetal@sina.com

package logic

import (
	"context"
	"fmt"
	"gotmpl/internal/dao"
	"gotmpl/internal/library/hgorm/handler"
	"gotmpl/internal/model/input/form"
	"gotmpl/internal/model/input/sysin"
	"gotmpl/internal/service"
	"hotgo/utility/convert"
	"hotgo/utility/excel"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gctx"
	"github.com/gogf/gf/v2/util/gconv"
	"github.com/gogf/gf/v2/util/guid"
)

type sSysTeacher struct{}

func NewSysTeacher() *sSysTeacher {
	return &sSysTeacher{}
}

func init() {
	fmt.Println("init internal/logic/sys/test.go")
	service.RegisterSysTeacher(NewSysTeacher())
}

// Model ORM模型
func (s *sSysTeacher) Model(ctx context.Context, option ...*handler.Option) *gdb.Model {
	return handler.Model(dao.Teacher.Ctx(ctx), option...)
}

// List 获取列表
func (s *sSysTeacher) List(ctx context.Context, in *sysin.TeacherListInp) (list []*sysin.TeacherListModel, totalCount int, err error) {
	mod := s.Model(ctx)

	// 字段过滤
	mod = mod.Fields(sysin.TeacherListModel{})

	// 查询id
	if in.Id != "" {
		mod = mod.Where(dao.Teacher.Columns().Id, in.Id)
	}

	// 分页
	mod = mod.Page(in.Page, in.PerPage)

	// 排序
	mod = mod.OrderDesc(dao.Teacher.Columns().Id)

	// 查询数据
	if err = mod.ScanAndCount(&list, &totalCount, false); err != nil {
		err = gerror.Wrap(err, "获取列表失败，请稍后重试！")
		return
	}
	return
}

// Export 导出
func (s *sSysTeacher) Export(ctx context.Context, in *sysin.TeacherListInp) (err error) {
	list, totalCount, err := s.List(ctx, in)
	if err != nil {
		return
	}

	// 字段的排序是依据tags的字段顺序，如果你不想使用默认的排序方式，可以直接定义 tags = []string{"字段名称", "字段名称2", ...}
	tags, err := convert.GetEntityDescTags(sysin.TeacherExportModel{})
	if err != nil {
		return
	}

	var (
		fileName  = "导出-" + gctx.CtxId(ctx)
		sheetName = fmt.Sprintf("索引条件共%v行,共%v页,当前导出是第%v页,本页共%v行", totalCount, form.CalPageCount(totalCount, in.PerPage), in.Page, len(list))
		exports   []sysin.TeacherExportModel
	)

	if err = gconv.Scan(list, &exports); err != nil {
		return
	}

	err = excel.ExportByStructs(ctx, tags, exports, fileName, sheetName)
	return
}

// Edit 修改/新增
func (s *sSysTeacher) Edit(ctx context.Context, in *sysin.TeacherEditInp) (err error) {
	return g.DB().Transaction(ctx, func(ctx context.Context, tx gdb.TX) (err error) {

		// 修改
		if in.Id != "" {
			if _, err = s.Model(ctx).
				Fields(sysin.TeacherUpdateFields{}).
				WherePri(in.Id).Data(in).Update(); err != nil {
				err = gerror.Wrap(err, "修改失败，请稍后重试！")
			}
			return
		}

		// 新增
		// 生成GUID作为ID
		in.Id = guid.S()
		if _, err = s.Model(ctx, &handler.Option{FilterAuth: false}).
			Fields(sysin.TeacherInsertFields{}).
			Data(in).Insert(); err != nil {
			err = gerror.Wrap(err, "新增失败，请稍后重试！")
		}
		return
	})
}

// Delete 删除
func (s *sSysTeacher) Delete(ctx context.Context, in *sysin.TeacherDeleteInp) (err error) {

	if _, err = s.Model(ctx).WherePri(in.Id).Delete(); err != nil {
		err = gerror.Wrap(err, "删除失败，请稍后重试！")
		return
	}
	return
}

// View 获取指定信息
func (s *sSysTeacher) View(ctx context.Context, in *sysin.TeacherViewInp) (res *sysin.TeacherViewModel, err error) {
	if err = s.Model(ctx).WherePri(in.Id).Scan(&res); err != nil {
		err = gerror.Wrap(err, "获取信息，请稍后重试！")
		return
	}
	return
}
