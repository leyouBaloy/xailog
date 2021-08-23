// pages/write/write.js
const db = wx.cloud.database({});
const book = db.collection('logs')
Page({

    data:  {
      weidu:null,
      quanbu:null, 
      shuju:[],
      shuju_num:0
      },
    
    onLoad: function (options) {
      console.log('onLoad') 
      var that = this
        db.collection('logs').get({
            success(res) {
              that.setData({
                shuju:res.data
              })
            }
          })  
    },

  detail:function (e) {
    var kind = e.target.id
        console.log(kind);
    wx.navigateTo({url: '/pages/checks/checks?kind='+kind})
  },


    onReady: function () {},
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function () {}
  })

  