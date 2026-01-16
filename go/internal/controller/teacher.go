// first version is auto generated, copyright dpetal@sina.com

package controller

import (
	"context"
	"gotmpl/api/teacher"
	"gotmpl/internal/model/input/sysin"
	"gotmpl/internal/service"
)

var (
	Teacher = cTeacher{}
)

type cTeacher struct{}

// List 查看列表
func (c *cTeacher) List(ctx context.Context, req *teacher.ListReq) (res *teacher.ListRes, err error) {
	list, totalCount, err := service.SysTeacher().List(ctx, &req.TeacherListInp)
	if err != nil {
		return
	}

	if list == nil {
		list = []*sysin.TeacherListModel{}
	}

	res = new(teacher.ListRes)
	res.List = list
	res.PageRes.Pack(req, totalCount)
	return
}

// Export 导出列表
func (c *cTeacher) Export(ctx context.Context, req *teacher.ExportReq) (res *teacher.ExportRes, err error) {
	err = service.SysTeacher().Export(ctx, &req.TeacherListInp)
	return
}

// Edit 更新
func (c *cTeacher) Edit(ctx context.Context, req *teacher.EditReq) (res *teacher.EditRes, err error) {
	err = service.SysTeacher().Edit(ctx, &req.TeacherEditInp)
	return
}

// View 获取指定信息
func (c *cTeacher) View(ctx context.Context, req *teacher.ViewReq) (res *teacher.ViewRes, err error) {
	data, err := service.SysTeacher().View(ctx, &req.TeacherViewInp)
	if err != nil {
		return
	}

	res = new(teacher.ViewRes)
	res.TeacherViewModel = data
	return
}

// Delete 删除
func (c *cTeacher) Delete(ctx context.Context, req *teacher.DeleteReq) (res *teacher.DeleteRes, err error) {
	err = service.SysTeacher().Delete(ctx, &req.TeacherDeleteInp)
	return
}

// Items 获取数据项列表
func (c *cTeacher) Items(ctx context.Context, req *teacher.ItemsReq) (res *teacher.ItemsRes, err error) {
	res = &teacher.ItemsRes{
		Items: []teacher.Item{
			{
				Id:          "1",
				Name:        "Item 1",
				Description: "First item",
			},
			{
				Id:          "2",
				Name:        "Item 2",
				Description: "Second item",
			},
		},
	}
	return
}