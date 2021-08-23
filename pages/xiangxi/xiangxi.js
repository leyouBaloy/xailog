const app = getApp()
const db = wx.cloud.database({});
const book = db.collection('logs')
const MAX_LIMIT = 20
Page({
  /**
   * 页面的初始数据
   */
  data:  {
    weidu:null,
    quanbu:null, 
    shuju:[],
    },
  
    onLoad: function (options) {
      var that = this
        that.setData({
          weidu:options.nameData,
          quanbu:options.ageData
        })
        db.collection('logs').count().then(async res =>{
        let total = res.total;
        // 计算需分几次取
        const batchTimes = Math.ceil(total / MAX_LIMIT)
        // 承载所有读操作的 promise 的数组
        for (let i = 0; i < batchTimes; i++) {
          await db.collection('logs').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get().then(async res => {
            let new_data = res.data
            let old_data = that.data.shuju
            that.setData({
              shuju : old_data.concat(new_data)
            })
          })
        }
      })
    },

    gotoresult:function (e) {
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
