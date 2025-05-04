const { app, BrowserWindow, Menu } = require('electron')

// 引入 Node.js 的 path 模块，用于处理文件路径
const path = require('path')

// 定义创建浏览器窗口的函数
function createWindow() {
  // 创建一个新的浏览器窗口实例
  const win = new BrowserWindow({
    width: 1200,            // 窗口初始宽度
    height: 800,           // 窗口初始高度
    minWidth: 800,         // 窗口最小宽度
    minHeight: 600,        // 窗口最小高度
    resizable: true,       // 窗口允许调整大小
    fullscreen: false,     // 初始不全屏显示
    frame: true,           // 显示窗口边框（即标题栏和关闭/最大化按钮）
    show: true,            // 创建后立即显示窗口
    backgroundColor: '#ffffff', // 窗口背景颜色为白色
    icon: path.join(__dirname, './public/ico/win_icon_256.ico'), // 设置窗口图标
    webPreferences: {      // 渲染进程的网页配置选项
      preload: path.join(__dirname, 'preload.js'), // 预加载脚本
      nodeIntegration: true,       // 启用 Node.js 集成（可在渲染进程中使用 Node API）
      contextIsolation: false,     // 关闭上下文隔离（不推荐用于生产环境，存在安全风险）
      devTools: true,              // 允许打开开发者工具
      webSecurity: false,          // 禁用同源策略（CSP），方便调试但有安全隐患
      spellcheck: false,           // 禁用拼写检查功能
      enableRemoteModule: true     // 启用 remote 模块（Electron 旧版本特性，新版本已弃用）
    }
  })

  // 隐藏菜单栏
  win.setMenuBarVisibility(false)

  // 右键菜单刷新
  win.webContents.on('context-menu', (e, params) => {
    const menu = Menu.buildFromTemplate([
      {
        label: '刷新',
        click: () => { win.webContents.reload(); }
      }
    ])
    menu.popup()
  })

  // 加载本地打包后的 index.html 文件作为应用主界面
  win.loadFile(path.join(__dirname, 'dist/index.html'))
}

// 当 Electron 初始化完成后执行
app.whenReady().then(() => {
  // 创建主窗口
  createWindow()

  // 监听 'activate' 事件（例如在 macOS 上点击应用图标时触发）
  app.on('activate', function () {
    // 如果没有打开任何窗口，则重新创建一个
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 监听 'window-all-closed' 事件：当所有窗口都被关闭时触发
app.on('window-all-closed', function () {
  // 如果不是 macOS 平台，则退出应用
  // 在 macOS 上，通常用户会通过 Cmd+Q 来退出应用
  if (process.platform !== 'darwin') app.quit()
})