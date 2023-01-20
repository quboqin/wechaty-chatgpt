# 基于wechaty创建一个自己的ChatGPT机器人
## 更新
### 1月20日
创建项目

## 安装机器人
### 源码安装
```bash
git clone https://github.com/quboqin/wechaty-chatgpt.git
cd wechaty-chatgpt
```
根据 `.env.example` 创建自己的 `.env`
```bash
npm i
npm run chatgpt
```
### 保持后台运行
```bash
npm install pm2 -g
pm2 start src/index.js
```
## 使用机器人
- 扫码登录
- 测试ding-dong
- /c 使用chatgpt
## 感谢
- <https://github.com/wechaty/wechaty/>
