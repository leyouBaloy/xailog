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
      
    onLoad: function (options) {
      this.setData({
        openid: wx.getStorageSync('openid'),
        userInfo: wx.getStorageSync('user')
      })
        
    },
    /*管理员账号可直接在日志里看到未公开的内容，
    无需从管理员页面内进入
    xiangxi: function (options) {
      wx.navigateTo({
        url: '/pages/xiangxi/xiangxi'
      })
    },
    guanli() {
      wx.navigateTo({
        url: '/pages/guanli/guan'
      })
    },
    */
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
  },

  tmpTest(){
    wx.showLoading({
      title: '导出中',
    })
    wx.cloud.callFunction({
        name: "exportLogs",
        complete: res => {
            console.log("云函数exportLogs结果：",res)
            // console.log(res.fileList[0].tempFileURL)
            wx.cloud.getTempFileURL({fileList:[res.result.fileID]}).then(res => {
                wx.hideLoading()
                Dialog.alert({
                    title: '已生成临时链接，点击确认复制',
                    message: res.fileList[0].tempFileURL,
                  }).then(() => {
                    wx.setClipboardData({
                        data: res.fileList[0].tempFileURL,
                        success(res) {
                          wx.showToast({
                            title: "复制成功"
                          })
                        }
                      })
                  });
                
                
            })
        }
      })
  }


  })