// pages/login/login.js
Page({
    data: {

    },

    onLoad: function (options) {
        
    },

    //登录
  Login() {
    // 获取用户资料
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        // console.log(res.userInfo)
        wx.setStorageSync('userInfo', res.userInfo)
        // 判断用户是否首次授权，并将用户资料写入数据库
        wx.cloud.database().collection('mine')
        .where({_openid: wx.getStorageSync('openid')})
        .get()
        .then(ress => {
          if (ress.data.length==0){
            console.log("写入数据库")
            wx.cloud.database().collection('mine')
            .add({
              data: {
                avatar: res.userInfo.avatarUrl,
                is_admin: false,
                name: res.userInfo.nickName
              }
            })
          }
        })
        wx.switchTab({
          url: '../index/index',
        })
      }
    })

  }

})