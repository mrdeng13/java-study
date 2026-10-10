# 云端进度同步（把学习进度存到你自己的 MySQL）

站点默认把进度存浏览器 `localStorage`。若想进度落库、换设备也能找回，按本文把本机后端经**内网穿透**
暴露到公网，GitHub Pages 上的页面就能把进度写进你的 MySQL。

## 一、准备后端（本机）

1. **改口令**：打开 `backend/src/main/resources/application.properties`，把 `app.passcode=study2026`
   改成你自己的口令（前端“☁ 账号”面板里填的口令要和这个一致）。
2. **编译**：`cd backend` 后运行 `build.bat`（或手动
   `javac -encoding UTF-8 -parameters -cp "lib/*" -d out src\main\java\com\tutorial\**\*.java`
   并把 `src/main/resources/application.properties` 拷到 `out/`）。
3. **启动**：确保本机 MySQL 在跑，然后
   ```
   java -cp "out;lib/*" com.tutorial.TutorialApplication
   ```
   看到 `Tomcat started on port 8080` 即成功。
   > Linux/macOS 把 classpath 分隔符 `;` 换成 `:`。

后端共有两个写入相关的接口（数据读取仍走静态快照，不依赖后端）：
- `GET  /api/progress?user=<用户名>` —— 读取该用户进度（无记录返回 `{}`）
- `POST /api/progress?user=<用户名>&passcode=<口令>` —— 保存进度（body 为整份 store 的 JSON）
进度存在 `java_tutorial.user_progress` 表，首次访问会自动建表。

## 二、内网穿透（让公网够得着本机 8080）

选一种：

### A. 临时/免登录：Cloudflare 临时隧道（最省事，重启换地址）

1. 安装 `cloudflared`（https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/）。
2. 运行：
   ```
   cloudflared tunnel --url http://localhost:8080
   ```
3. 控制台会打印一个 `https://xxxx.trycloudflare.com` 地址，这就是你的“服务器地址”。
   **注意**：每次重开都会变，适合临时用。

### B. 稳定地址：命名隧道 + 自己的域名（需 Cloudflare 账号 + 一个域名）

1. `cloudflared login`（按提示授权）。
2. `cloudflared tunnel create xk` 创建隧道，记下输出的 `credentials.json` 路径。
3. 建配置文件 `~/.cloudflared/config.yml`：
   ```yaml
   tunnel: <隧道ID>
   credentials-file: <credentials.json 路径>
   ingress:
     - hostname: xk.你的域名.com
       service: http://localhost:8080
     - service: http_status:404
   ```
4. `cloudflared tunnel route dns xk xk.你的域名.com` 把子域指向隧道。
5. `cloudflared tunnel run xk` 常驻运行（可用 `nssm`/系统服务让它开机自启）。
   此后“服务器地址”固定为 `https://xk.你的域名.com`。

## 三、在站点里接通

1. 打开线上站点 `https://mrdeng13.github.io/java-study/`。
2. 点右上角 **☁ 账号**：
   - **用户名**：随便起（如 `laodeng`），用来区分不同进度。
   - **口令**：填第一步里 `app.passcode` 的值。
   - **服务器地址**：填第二步拿到的隧道 URL（本机调试时留空=同源）。
3. 点 **保存设置** → 会自动从云端拉取该账号进度；之后每次学习进度变化都会在 0.8s 内防抖同步到库。
   也可用 **立即同步** / **从云端加载** 手动触发。后端不可达时自动降级成本机存储，不丢数据。

## 四、安全说明

- `app.passcode` 是**共享口令**，只为挡住陌生人乱写，不是真正的账号密码体系；别在公开站用弱口令。
- 隧道会把本机 8080 暴露到公网，**不用时关掉隧道 / 后端**即可下线。稳定方案建议用自己域名的 HTTPS，并尽量缩短暴露时间。
- 数据库仍是本机 MySQL，请确保它只监听本机（`localhost`），不要让 3306 直接暴露公网。
