// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: null
  },
  onLoad() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
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
  guanli:function(param){
    var that = this
    wx.navigateTo({
      url: '/pages/guanli/guan'
    })
  },
  writelog: function(param){
    wx.navigateTo({
      url: '/pages/write/write',
    })
  }
})