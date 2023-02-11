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


## just for fun
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

## issues when deploying on an VPS
[Github Actions pm2: command not found](https://stackoverflow.com/questions/69644460/github-actions-pm2-command-not-found)

For puppeteer to work, you need to install the following dependencies with the apt-get, and install Chromium-browser
```shell
sudo apt-get install chromium-browser
sudo apt install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils
```

[Bug Cannot read properties of undefined (reading 'queryExists') #1985](https://github.com/pedroslopez/whatsapp-web.js/issues/1985)
```node_modules/whatsapp-web.js/src/util/Injected.js
window.Store.QueryExist = window.mR.findModule('queryExists')[0] ? window.mR.findModule('queryExists')[0].queryExists : window.mR.findModule('queryExist')[0].queryWidExists;
```
