package utils

import (
	"encoding/base64"
	"net/url"
	"testing"
)

// TestDecryptPassword 测试密码解密功能
func TestDecryptPassword(t *testing.T) {
	tests := []struct {
		name              string
		encryptedPassword string
		expectedPassword  string
		shouldError       bool
	}{
		{
			name:              "测试空密码",
			encryptedPassword: "",
			expectedPassword:  "",
			shouldError:       false,
		},
		{
			name:              "测试简单密码",
			encryptedPassword: encryptPasswordForTest("123456"),
			expectedPassword:  "123456",
			shouldError:       false,
		},
		{
			name:              "测试复杂密码",
			encryptedPassword: encryptPasswordForTest("Test@123!"),
			expectedPassword:  "Test@123!",
			shouldError:       false,
		},
		{
			name:              "测试中文密码",
			encryptedPassword: encryptPasswordForTest("测试密码"),
			expectedPassword:  "测试密码",
			shouldError:       false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			decrypted, err := DecryptPassword(tt.encryptedPassword)
			
			if tt.shouldError {
				if err == nil {
					t.Errorf("DecryptPassword() 期望返回错误，但没有错误")
				}
			} else {
				if err != nil {
					t.Errorf("DecryptPassword() 返回错误 = %v", err)
					return
				}
				if decrypted != tt.expectedPassword {
					t.Errorf("DecryptPassword() = %v, 期望 %v", decrypted, tt.expectedPassword)
				}
			}
		})
	}
}

// encryptPasswordForTest 用于测试的加密函数（模拟客户端加密）
// 加密步骤：
// 1. 将密码转为rune数组处理Unicode字符
// 2. 与密钥进行异或运算
// 3. Base64编码
// 4. 字符位置混淆（反转字符串）
func encryptPasswordForTest(password string) string {
	if password == "" {
		return ""
	}

	// 将密码和密钥转为rune数组以正确处理Unicode字符（模拟JavaScript的字符处理）
	passwordRunes := []rune(password)
	keyRunes := []rune(SECRET_KEY)
	
	// 第一步：异或运算
	encrypted := ""
	for i := 0; i < len(passwordRunes); i++ {
		passwordChar := passwordRunes[i]
		keyChar := keyRunes[i%len(keyRunes)]
		// 将异或结果转为字符
		encrypted += string(rune(passwordChar ^ keyChar))
	}

	// 第二步：URL编码（模拟JavaScript的encodeURIComponent）
	urlEncoded := url.QueryEscape(encrypted)
	
	// 第三步：Base64编码
	base64Encoded := base64.StdEncoding.EncodeToString([]byte(urlEncoded))

	// 第四步：反转字符串
	reversed := reverseString(base64Encoded)

	return reversed
}

// TestEncryptDecryptRoundTrip 测试加密解密往返
func TestEncryptDecryptRoundTrip(t *testing.T) {
	testPasswords := []string{
		"123456",
		"password",
		"Test@123!",
		"复杂密码123",
	}

	for _, original := range testPasswords {
		t.Run("往返测试_"+original, func(t *testing.T) {
			// 加密
			encrypted := encryptPasswordForTest(original)
			
			// 解密
			decrypted, err := DecryptPassword(encrypted)
			
			if err != nil {
				t.Errorf("解密失败: %v", err)
				return
			}
			
			if decrypted != original {
				t.Errorf("往返测试失败: 原始=%v, 解密后=%v", original, decrypted)
			}
		})
	}
}
