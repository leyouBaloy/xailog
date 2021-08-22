// app.js
App({
  onLaunch() {
    // 初始化云开发环境
    wx.cloud.init({
        env: 'aigroup-2gtja1ym4715274c' //云开发环境id
    })

    // 获取openid写入缓存
    wx.cloud.callFunction({
      name: "login",
      success(res) {
        // console.log(res.result.openid)
        wx.setStorageSync('openid', res.result.openid)
      }
    })

    // 判断用户是否已经授权
    if (wx.getStorageSync('userInfo')){
      wx.switchTab({
        url: 'pages/index/index',
      })
    }

    // 获取手机信息
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.statusBarHeight = res.statusBarHeight
      }
    })

    // 获取胶囊信息
    this.globalData.menubutton = wx.getMenuButtonBoundingClientRect()
  },
  globalData: {
    userInfo: null,
    statusBarHeight: null,
    menubutton: null
  }
})