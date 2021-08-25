// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: null,
    statusBarHeight: app.globalData.statusBarHeight,
    menubutton: null
  },
  onLoad() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    const db = wx.cloud.database({});
    var openid = wx.getStorageSync('openid');
    var ne = false
    var that = this
    db.collection('mine').field({_openid:openid}).get({
      //如果查询成功的话
     success:res =>{     
      console.log(res.data[0].is_admin),
       that.setData({
        ne:res.data[0].is_admin
       })
     }
     })
  },
  //登录
  Login() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        // console.log(res.userInfo)
        wx.setStorageSync('userInfo', res.userInfo)
        this.setData({
          userInfo: res.userInfo
        })
      }
    })
  },
  //注销
  Logout() {
    wx.setStorageSync('userInfo', null)
    this.setData({
      userInfo: null
    })
  },

  xiangxi() {
      wx.navigateTo({
        url: '/pages/xiangxi/xiangxi'
      })
  },

  
  writelog: function(param){
    wx.navigateTo({
      url: '/pages/write/write',
    })
  }
})