// pages/stat/stat.js
Page({
  data: {
    weidu:'true',
    quanbu:'true'  
  },
  onLoad: function (options) {},
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},

  weidu: function(param){
    var that = this
    wx.navigateTo({
      url: '/pages/xiangxi/xiangxi?nameData=' + that.data.weidu
    })
  },
  quanbu: function(param){
    var that = this
    wx.navigateTo({
      url: '/pages/xiangxi/xiangxi?ageData=' + that.data.quanbu
    })
  },
  onShareAppMessage: function () {}
})

