// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

// Users is the golang structure for table users.
type Users struct {
	Id        string `json:"id"        orm:"id"         description:""` //
	Email     string `json:"email"     orm:"email"      description:""` //
	Password  string `json:"password"  orm:"password"   description:""` //
	Name      string `json:"name"      orm:"name"       description:""` //
	VipInfo   string `json:"vipInfo"   orm:"vip_info"   description:""` //
	CreatedAt int    `json:"createdAt" orm:"created_at" description:""` //
	UpdatedAt int    `json:"updatedAt" orm:"updated_at" description:""` //
	Sync      int    `json:"sync"      orm:"sync"       description:""` //
	Role      string `json:"role"      orm:"role"       description:""` //
}
