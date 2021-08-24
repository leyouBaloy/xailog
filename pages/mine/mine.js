// pages/mine/mine.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      openid:null,
      userInfo:null,
      dialogShow: false,
      userMessage:"",
      },
    onLoad: function (options) {
      this.setData({
        openid: wx.getStorageSync('openid')
      })
      wx.cloud.database().collection('mine').where({
        _openid:this.data.openid
      })
      .get()
      .then(res=>{
        this.setData({
          userInfo:res.data[0]
        })
        console.log(this.data.userInfo)
      })
        
    },
    openConfirm: function () {
      this.setData({
          dialogShow: true
      })
  },
  tapDialogButton(e) {
      if(e.detail.value.input){
        wx.cloud.database().collection('mine').doc(
          this.data.userInfo._id
        )
        .update({
          data:{
            name:e.detail.value.input
          }})
        .then(res=> {
            wx.cloud.database().collection('mine').where({
              _openid:this.data.openid
            })
            .get()
            .then(res=>{
              this.setData({
                userInfo:res.data[0],
                dialogShow: false
              })
            })
        })
      }
      else{
        Toast.fail('请输入名字后确定');
      }
  }


  })