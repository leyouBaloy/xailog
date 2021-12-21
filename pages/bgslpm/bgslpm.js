// pages/bgslpm/bgslpm.js

Page({
    data: {
        show: false,
        data:[],
        date:null,
      },

      onLoad() {
        this.getSDate()
        this.stat();
      },

      showPopup() {
        this.setData({ show: true });
      },
    
      onClose() {
        this.setData({ show: false });
      },

      download(){
        console.log("导出为Excel")
      },
      onConfirm(date) {
        this.setData({
          currentDate: date.detail,
        });
        this.getSDate();
        this.onClose();
      },

      getSDate(){
        var newdate = new Date()
        var pre = new Date(newdate.getFullYear(),newdate.getMonth()-1,newdate.getDate())
        this.setData({ 
          date: String(pre.getMonth()+1)+'月'+String(pre.getDate())+"日-"+
        String(newdate.getMonth()+1)+'月'+String(newdate.getDate())+"日"
       });
        // console.log(this.data.date)
      },

      stat(){
        wx.cloud.callFunction({name: "stat",})
        .then(res=>{
          console.log("调用云函数统计查询结果",res.result)
          this.setData({data:res.result})
        })
        .catch(res=>{
          console.log("云函数调用失败",res)
        })
        
        },

      personal: function(e) {
        var id = e.currentTarget.dataset.id //这里的id是数据库中的_openid
        console.log(id)
        wx.navigateTo({url: '/pages/alldetail/alldetail?id='+id})
      },
})
