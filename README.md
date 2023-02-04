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

```shell
echo "                            _ooOoo_"
echo "                           o8888888o"
echo "                           88" . "88"
echo "                           (| -_- |)"
echo "                            O\ = /O"
echo "                        ____/`---'\____"
echo "                      .   ' \\| |// `."  
echo "                       / \\||| : |||// \"
echo "                     / _||||| -:- |||||- \"
echo "                       | | \\\ - /// | |"
echo "                     | \_| ''\---/'' | |"
echo "                      \ .-\__ `-` ___/-. /"
echo "                   ___`. .' /--.--\ `. . __"
echo "                ."" '< `.___\_<|>_/___.' >'""."
echo "               | | : `- \`.;`\ _ /`;.`/ - ` : | |"
echo "                 \ \ `-. \_ __\ /__ _/ .-` / /"
echo "         ======`-.____`-.___\_____/___.-`____.-'======"
echo "                            `=---='
echo "
echo "         ............................................."
echo "                  佛祖镇楼                  BUG辟易"
echo "          佛曰:"
echo "                  写字楼里写字间，写字间里程序员；"
echo "                  程序人员写程序，又拿程序换酒钱。"
echo "                  酒醒只在网上坐，酒醉还来网下眠；"
echo "                  酒醉酒醒日复日，网上网下年复年。"
echo "                  但愿老死电脑间，不愿鞠躬老板前；"
echo "                  奔驰宝马贵者趣，公交自行程序员。"
echo "                  别人笑我忒疯癫，我笑自己命太贱；"
echo "                  不见满街漂亮妹，哪个归得程序员？"
```