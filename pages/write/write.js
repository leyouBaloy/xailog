// pages/write/write.js
Page({

  /**
   * 页面的初始数据
   */
  data:  {
    weidu:null,
    quanbu:null, 
    shuju:[],
    listData:[
      {"code":"张三","text":"今天我吃了很多大学，学习了核对的知识，深度学习真难啊","type":true},
      {"code":"李四","text":"text2","type":true},
      {"code":"王五","text":"text3","type":true},
      {"code":"小王","text":"text4","type":true},
      {"code":"小徐","text":"text5","type":true},
      {"code":"小廖","text":"text6","type":false},
      {"code":"乐乐","text":"text7","type":false}
    ]},
  
  onLoad: function (options) {
    console.log('onLoad') 
    var that = this
    that.setData({
      weidu:options.nameData,
      quanbu:options.ageData
    }) },

    detail: function(param){
      var that = this
      wx.navigateTo({
          url: '/pages/test2/test2?name=' + that.data.shuju + '&time=' + that.data.shuju
      })
    },
    inputgetname:function(e){
      this.setData({
        getname:e.detail.value
      })
    },
    searchDataNameFn:function(){
      wx.cloud.callFunction({
        name:'useroption',
        data:{
          option:'get',
          getname:this.data.getname
        },
        success: res => {
          this.setData({
            array:res.result.data
          })
          wx.showToast({
            title:"我好累",
          })
          console.log(res.result.data)
        },
        fail:err => {
          console.log(err)
        }
      })
    },

  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})