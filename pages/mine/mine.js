// pages/mine/mine.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

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
      guanli() {
        wx.navigateTo({
          url: '/pages/guanli/guan'
        })
      },
    onLoad: function (options) {
      this.setData({
        openid: wx.getStorageSync('openid'),
        userInfo: wx.getStorageSync('user')
      })
        
    },
    changeAvatar() {
      Dialog.confirm({
        message: '是否更新头像为当前微信头像\n(需重新授权)',
      })
        .then(() => {
          wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
              wx.setStorageSync('userInfo', res.userInfo)
            }
          })
          wx.cloud.database().collection('mine').doc(this.data.userInfo._id)
          .update({
            data: {
              avatar: wx.getStorageSync('userInfo').avatarUrl
            }
          })
          .then(res=> {
            var tem = this.data.userInfo
            tem.avatar = wx.getStorageSync('userInfo').avatarUrl
            this.setData({
              userInfo:tem
            })
            wx.setStorageSync('user', this.data.userInfo)
          })
        })
        .catch(() => {
          console.log("关闭弹窗")
        });
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
          var tem = this.data.userInfo
          tem.name = e.detail.value.input
          this.setData({
            userInfo:tem,
            dialogShow: false
          })
          wx.setStorageSync('user', this.data.userInfo)
        })
      }
      else{
        Toast.fail('请输入名字后确定');
      }
  }


  })