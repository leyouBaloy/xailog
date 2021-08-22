
// pages/checks/checks.js
Page({

    data: {
        list:[],
        userInfo: null,
        isstar:'',
        release:[],
        show: false,
        userMessage:"",
        targets:''
      },
    
    onLoad: function (options) {
        // var user_id=options.id
        this.setData({
          targets:'cd045e756120b7b406f45cec4050f728'
      })
      var user_id=this.data.targets
        wx.cloud.database().collection('logs')
        .doc(user_id)
        .get()
        .then(res =>{
            console.log('返回的数据',res.data)
            this.setData({
                list:res.data,
                isstar:res.data.ifstar
            })
        })
        wx.cloud.database().collection('comment')
        .where({
          target:user_id
        })
        .get()
        .then(res =>{
          console.log('数据',res.data)
          this.setData({
              release:res.data
          })
      })

    },
    good:function(){
    var user_id=this.data.targets
    wx.cloud.database().collection('logs').doc(user_id)
    .get()
    .then(res =>{
        if (res.data.ifstar==true){
            wx.cloud.database().collection('logs').doc(user_id).update({
                // data 传入需要局部更新的数据
                data: {
                  // 表示将 done 字段置为 true
                  ifstar: false
                },
                success: function(res) {
                console.log(res)
                }
              })
        }else{
            wx.cloud.database().collection('logs').doc(user_id).update({
                // data 传入需要局部更新的数据
                data: {
                  // 表示将 done 字段置为 true
                  ifstar: true
                },
                success: function(res) {
                console.log(res)
                }
              })
        }
        
        
    })
    },
    open: function () {
      this.setData({
          show: true
      })
  },
submitForm(e) {
  this.setData({ 
    show:false,
    userMessage:''
  })
  var myDate = new Date();
  console.log(e.detail.value.input)
  wx.cloud.database().collection('comment').add({
    // data 传入需要局部更新的数据
    data: {
      // 表示将 done 字段置为 true
      name:wx.getStorageSync('userInfo').nickName,
      content:e.detail.value.input,
      target:this.data.targets,
      time:myDate.toLocaleString( )
    },
    success: function(res) {
    console.log(res)
    }
  })
}

})