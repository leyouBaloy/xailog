var newDate = new Date();
const today = new Date();
today.setHours(0, 0, 0, 0);
Page({
  data: {
    //日历
    show: false,
    date: `${newDate.getMonth() + 1}月${newDate.getDate()}日`,
    datestamp: new Date(today.getFullYear(),today.getMonth(),today.getDate()).getTime(),
    mindate: new Date(newDate.setDate(newDate.getDate() - 1)).getTime(),
    maxdate: new Date().getTime(),
    //日志内容
    content: "",
    //附件
    accept: 'image', //上传内容格式，video
    fileList: [], //上传文件临时存储
    fileIDs: [], //文件上传后获取云数据中的位置
    reject: [], //用于uploadfilepromise的promise判断是否上传图片成功
    // 公开
    checked: true,
    disabled: false, //按钮禁用
    button_text: "提交",
  },
  onLoad: function (options) {
    var that = this ;
    // wx.getSetting({
    //     withSubscriptions: true,
    //     success (res) {
    //       console.log("subscriptionsSetting",res.subscriptionsSetting)
    //     // 如果没有订阅消息通知，提醒
    //     if(res.subscriptionsSetting.itemSettings['a5AX-3vtvGHxGXAGDhagAq-hE5Vp4d0w0sqm3o-bFII']!='accept'){
    //         that.remindSubscribe()
    //     }
    //     else{
    //         that.remindSubscribe()
    //     }
    //     }
    //   })
    that.remindSubscribe()
    
  },
  remindSubscribe(){
    var that = this
    wx.showModal({
        title: '温馨提示',
        content: '为了您能及时收到日志留言，请允许订阅消息通知。',
        confirmText:"同意",
        cancelText:"拒绝",
        success: function (res) {
            if (res.confirm) {
                console.log('用户点击确定');
                //调用订阅
                that.requestSubscribe();
            } else if (res.cancel) {
                console.log('用户点击取消');
                ///显示第二个弹说明一下
                wx.showModal({
                    title: '温馨提示',
                    content: '拒绝后您将无法收到通知',
                    confirmText:"知道了",
                    showCancel:false,
                    success: function (res) {
                    ///点击知道了的后续操作 
                    ///如跳转首页面 
                    }
                });
            }
        }
    });
  },
   //   订阅消息
   requestSubscribe(){
	wx.requestSubscribeMessage({
        tmplIds: ['a5AX-3vtvGHxGXAGDhagAq-hE5Vp4d0w0sqm3o-bFII'],
        success :(res)=>{
          console.log("订阅消息 成功 "+res);
         },
        fail :(errCode,errMessage) =>{ 
          console.log("订阅消息 失败 "+errCode+" message "+errMessage);
        },
        complete:(errMsg)=>{
          console.log("订阅消息 完成 "+errMsg);
        }
      });
    },
  // 日历
  onDisplay() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onConfirm(event) {
    let date = new Date(event.detail);
    let datestr = `${date.getMonth() + 1}月${date.getDate()}日`
    let datestamp = Date.parse(date) //化成时间戳存入数据库
    this.setData({
      show: false,
      date: datestr,
      datestamp: datestamp,
    });
  },

  // 日志
  contentOnChange(event) {
    // event.detail 为当前输入的值
    // console.log(event.detail);
    this.setData({
      content: event.detail
    })
  },

  // 上传附件
  afterRead(event) {
    const {
      file
    } = event.detail;
    console.log("上传图片event:", event)
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    //更新 fileList
    for (let val of file) {
      val.name = val.url.replace(/\//g, "").replace(":", "")
    };
    this.setData({
      fileList: file
    });
    console.log("fileList的值", this.data.fileList)
  },
  // 删除其中一张图片
  Delete(event) {
    let that = this
    console.log(event)
    console.log(event.detail.index)
    wx.showModal({
      title: '要删除这个文件吗？',
      content: '',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          that.data.fileList.splice(event.detail.index, 1);
          that.setData({
            fileList: that.data.fileList
          })
        }
        console.log("fileList", this.data.fileList)
      }
    })
  },

  // 提交
  submit() {
    var that = this;
    // 改变按钮
    that.setData({
      disabled: true,
      button_text: "已提交"
    })
    // 上传附件
    let fileList = this.data.fileList;
    if (that.data.date.length == 0 || that.data.content == 0) {
      wx.showToast({
        title: '请完善内容',
        icon: 'none'
      });
    } else {
      wx.showLoading({title:"提交中"})
      const uploadTasks = fileList.map(item => this.uploadFilePromise(item.name, item.url));
      console.log("submit里的uploadTaks内容", uploadTasks);
      Promise.all(uploadTasks)
        .then(data => {
          wx.showToast({
            title: '上传成功',
            icon: 'none'
          });
          const _fileIDs = data.map(item => (item.fileID));
          this.setData({
            cloudPath: data,
            fileIDs: _fileIDs
          });
          //再提交数据到数据库
          wx.cloud.database().collection("logs")
            .add({
              data: {
                time: that.data.datestamp,
                content: that.data.content,
                fileIDs: that.data.fileIDs,
                is_delete: false,
                ifread: false,
                ifstar: false,
                create_time: new Date().getTime(),
                is_public: that.data.checked,
              }
            })
            .then(res => {
              console.log("添加数据库成功", res);
              wx.hideLoading({}) // 关闭提示
              wx.switchTab({
                url: '/pages/day/day',
              })
            })
            .catch(res => {
              console.log("添加数据库失败", res)
            })
        })
        .catch(e => {
          wx.hideLoading({}) // 关闭提示
          wx.showToast({
            title: '上传失败',
            icon: 'none'
          });
          console.log(e);
        });
    }

  },
  uploadFilePromise(fileName, url) {
    console.log("filename是" + fileName)
    return wx.cloud.uploadFile({
      cloudPath: 'appendix/' + fileName,
      filePath: url
    })
  },

  // 开关
  switchOnChange({
    detail
  }) {
    // 需要手动对 checked 状态进行更新
    this.setData({
      checked: detail
    });
    console.log("开关checked的值", this.data.checked)
  },
   
})

