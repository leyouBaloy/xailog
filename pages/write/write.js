Page({
  data: {
    //日历
    show: false,
    date: "",
    datestamp:1,
    //日志内容
    content: "",
    //附件
    fileList: [],
  },

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
  
    
  contentOnChange(event) {
    // event.detail 为当前输入的值
    // console.log(event.detail);
    this.setData({
      content: event.detail
    })
  },

  submit() {
    wx.cloud.database().collection("logs")
    .add({//提交数据到数据库
      data: {
        time: this.data.date,
        content: this.data.content
      }
    })
    .then(res => {
      console.log("添加成功", res)
    })
    .catch(res => {
      console.log("添加失败", res)
    })
  }
})