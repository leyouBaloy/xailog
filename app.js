// app.js
App({
  onLaunch() {
    // 初始化云开发环境
    wx.cloud.init({
        env: 'aigroup-5gsmkvvy34505c6a' //云开发环境id
    })

    // 获取openid写入缓存
    if (!wx.getStorageSync('openid')){
      wx.cloud.callFunction({
        name: "login",
        success(res) {
          wx.setStorageSync('openid', res.result.userInfo.openId)
        }
      })
    }

    // 读取数据库个人信息写入缓存
    var openid = wx.getStorageSync('openid')
    wx.cloud.database().collection('mine').where({
      _openid: openid
    })
    .get()
    .then(res=>{
      wx.setStorageSync('user', res.data[0])
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
        this.globalData.screenHeight = res.screenHeight
        this.globalData.safeBottom = res.safeArea.bottom
      }
    })

    // 获取胶囊信息
    this.globalData.menubutton = wx.getMenuButtonBoundingClientRect()
  },
  globalData: {
    userInfo: null,
    statusBarHeight: null,
    screenHeight: null,
    safeBottom: null,
    menubutton: null
  }
})