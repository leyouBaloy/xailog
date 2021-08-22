// pages/checks/checks.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[],
        userInfo: null,
        user_id:''
      },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            userInfo: wx.getStorageSync('userInfo'),
            user_id:'cd045e756120b7b406f45cec4050f728'
          })
        var user_id='cd045e756120b7b406f45cec4050f728'
        // var user_time=options.user_time
        wx.cloud.database().collection('logs')
        .doc(user_id
            // id=id
        )
        .get()
        .then(res =>{
            console.log('返回的数据',res.data)
            this.setData({
                list:res.data
            })
        }
            )

    },
    good(){
    var user_id='cd045e756120b7b406f45cec4050f728'
    wx.cloud.database().collection('logs')
    .doc(user_id
    )
    .update(
        {
            data:{
                ifstar:true
            }
        }
    )
    .then(res =>{
        console.log('返回的数据',res)
    })
    }
})