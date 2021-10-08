
var newDate = new Date();
Page({
  data: {
    //日历
    show: false,
    date: "",
    datestamp:1,
    mindate: new Date(newDate.setDate(newDate.getDate()-1)).getTime(),
    maxdate: new Date().getTime(),
    //日志内容
    content: "",
    //附件
    accept:'image',//上传内容格式，video
    fileList: [], //上传文件临时存储
    fileIDs: [],//文件上传后获取云数据中的位置
    reject: [],//用于uploadfilepromise的promise判断是否上传图片成功
    // 公开
    checked: true,
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
  console.log("上传图片event:",event)
  // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
  //更新 fileList
  for(let val of file){
    val.name = val.url.replace(/\//g,"").replace(":","")
  };
  this.setData({fileList: file});
  console.log("fileList的值",this.data.fileList)
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
      console.log("fileList",this.data.fileList)
    }
  })
},

// 提交
submit() {
  // 先上传附件
  var that = this;
  let fileList= this.data.fileList;
  if (that.data.date.length==0 || that.data.content==0) {
    wx.showToast({ title: '请完善内容', icon: 'none' });
  } else {
    const uploadTasks = fileList.map(item => this.uploadFilePromise(item.name,item.url));
    console.log("submit里的uploadTaks内容",uploadTasks);
    Promise.all(uploadTasks)
      .then(data => {
        wx.showToast({ title: '上传成功', icon: 'none' });
        const _fileIDs = data.map(item => (item.fileID));
        this.setData({ cloudPath: data, fileIDs: _fileIDs });
        //再提交数据到数据库
    wx.cloud.database().collection("logs")
    .add({
      data: {
        time: that.data.datestamp,
        content: that.data.content,
        fileIDs: that.data.fileIDs,
        is_delete:false,
        ifread:false,
        ifstar:false,
        create_time:new Date().getTime(),
        is_public:that.data.checked,
      }
    })
    .then(res => {
      console.log("添加数据库成功", res);
      wx.switchTab({
        url: '/pages/day/day',
      })
    })
    .catch(res => {
      console.log("添加数据库失败", res)
    })
      })
      .catch(e => {
        wx.showToast({ title: '上传失败', icon: 'none' });
        console.log(e);
      });
  }

},
uploadFilePromise(fileName, url) {
  console.log("filename是"+fileName)
  return wx.cloud.uploadFile({
    cloudPath: 'appendix/'+fileName,
    filePath: url
  })},

// 开关
switchOnChange({ detail }) {
  // 需要手动对 checked 状态进行更新
  this.setData({ checked: detail });
  console.log("开关checked的值", this.data.checked)
},
})