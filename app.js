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
  },
  globalData: {
    userInfo: null
  }
})