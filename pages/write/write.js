Page({
  data: {
    //日历
    show: false,
    date: "",
    datestamp:1,
    //日志内容
    content: "",
    //附件
    accept:'image',//上传内容格式，video
    fileList: [], //上传文件临时存储
    fileIDs: [],//文件上传后获取云数据中的位置
  },

  // 日历
  onDisplay() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
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
  const { file } = event.detail;
  // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
  console.log("afterread中的file",file)
  //更新 fileList
  this.setData({fileList: file});
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
    }
  })
},
upload(that){
  let _fileIDs = [];
  for(let val of that.data.fileList) {
    console.log("上传图片的临时地址", val.url);
    wx.cloud.uploadFile({
      cloudPath: "tmp.jpg",
      filePath: val.url,
      success: res => {
        console.log("上传成功", res)
        _fileIDs.push(res.fileID)
        that.setData({fileIDs:_fileIDs})
      },
      fail(err) {
        console.log("上传失败", res)
      }
    })
  }
},

// 提交
submit() {
  // 上传云存储
  var that = this;
  (this.upload(that)).then(
  //提交数据到数据库
  wx.cloud.database().collection("logs")
  .add({
    data: {
      time: this.data.date,
      content: this.data.content,
      fileIDs: this.data.fileIDs
    }
  })
  .then(res => {
    console.log("添加数据库成功", res)
  })
  .catch(res => {
    console.log("添加数据库失败", res)
  }))
},
})