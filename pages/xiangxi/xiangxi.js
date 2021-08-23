Page({
  data: {
    date: "",
    show: false,
    value: "",
    content: "",
    fileList: [],
  },

  /**
   * 页面的初始数据
   */
  data:  {
    weidu:null,
    quanbu:null, 
    shuju:[],
    listData:[
      {"id":"4545","code":"张三","text":"今天我吃了很多大学，学习了核对的知识，深度学习真难啊","type":true},
      {"id":"45","code":"张三","text":"wewe今天我吃了很多大学，学习了核对的知识，深度学习真难啊","type":true},
      {"id":"445","code":"张三","text":"未读今天我吃了很多大学，学习了核对的知识，深度学习真难啊","type":true},
      {"id":"545","code":"张三","text":"请问今天我吃了很多大学，学习了核对的知识，深度学习真难啊","type":true},
      {"id":"230","code":"李四","text":"text2","type":true},
      {"id":"76","code":"王五","text":"text3","type":true},
      {"id":"560","code":"小王","text":"text4","type":true},
      {"id":"79","code":"小徐","text":"text5","type":true},
      {"id":"cd045e756120b7b406f45cec4050f728","code":"小廖","text":"text6","type":false},
      {"id":"63","code":"乐乐","text":"text7","type":false}
    ]},
  
  onLoad: function (options) {
    console.log('onLoad') 
    var that = this
    that.setData({
      weidu:options.nameData,
      quanbu:options.ageData
    }) },

    gotoresult:function (e) {
      var kind = e.target.id
          console.log(kind);
      wx.navigateTo({url: '/pages/checks/checks?kind='+kind})
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
