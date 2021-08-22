// pages/checks/checks.js
Page({

    data: {
        list:[],
        userInfo: null,
        isstar:''
      },
    
    onLoad: function (options) {
        this.setData({
            userInfo: wx.getStorageSync('userInfo'),
          })
        var user_id='cd045e756120b7b406f45cec4050f728'
        // var user_time=options.user_time
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

    },
    good:function(){
    var user_id='cd045e756120b7b406f45cec4050f728'
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
    }
})