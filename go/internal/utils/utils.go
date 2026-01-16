package utils

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"net/url"
)

const SECRET_KEY = "gojsbench"

// GenerateUUID 生成一个32位的UUID
func GenerateUUID() string {
	bytes := make([]byte, 16)
	_, err := rand.Read(bytes)
	if err != nil {
		// 如果生成失败，返回一个随机字符串作为备用
		return "fallback-" + hex.EncodeToString([]byte{1, 2, 3, 4, 5, 6, 7, 8})
	}
	return hex.EncodeToString(bytes)
}

// HashPasswordWithSalt 使用HMAC-SHA256对密码加盐哈希
func HashPasswordWithSalt(password string, salt string) string {
	if salt == "" {
		salt = "12" // 默认盐值
	}
	h := hmac.New(sha256.New, []byte(salt))
	h.Write([]byte(password))
	return hex.EncodeToString(h.Sum(nil))
}

// DecryptPassword 解密客户端传来的加密密码
// 解密步骤：
// 1. 反转字符串
// 2. Base64解码
// 3. URL解码
// 4. 与密钥进行异或运算还原
func DecryptPassword(encryptedPassword string) (string, error) {
	if encryptedPassword == "" {
		return "", nil
	}

	// 第一步：反转字符串
	reversed := reverseString(encryptedPassword)

	// 第二步：Base64解码
	base64Decoded, err := base64.StdEncoding.DecodeString(reversed)
	if err != nil {
		return "", err
	}

	// 第三步：URL解码
	urlDecoded, err := url.QueryUnescape(string(base64Decoded))
	if err != nil {
		return "", err
	}

	// 第四步：异或运算还原（处理Unicode字符）
	encryptedRunes := []rune(urlDecoded)
	keyRunes := []rune(SECRET_KEY)
	password := ""
	for i := 0; i < len(encryptedRunes); i++ {
		encryptedChar := encryptedRunes[i]
		keyChar := keyRunes[i%len(keyRunes)]
		password += string(rune(encryptedChar ^ keyChar))
	}

	return password, nil
}

// reverseString 反转字符串
func reverseString(s string) string {
	runes := []rune(s)
	for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}
	return string(runes)
}

// MergeJSON 将新的键值对合并到JSON字符串中
func MergeJSON(jsonStr string, key string, value interface{}) (string, error) {
	// 处理空JSON字符串的情况
	if jsonStr == "" {
		jsonStr = "{}"
	}
	
	// 解析原始JSON字符串
	var data map[string]interface{}
	err := json.Unmarshal([]byte(jsonStr), &data)
	if err != nil {
		return "", err
	}
	
	// 添加新的键值对
	data[key] = value
	
	// 重新序列化为JSON字符串
	mergedJSON, err := json.Marshal(data)
	if err != nil {
		return "", err
	}
	
	return string(mergedJSON), nil
}