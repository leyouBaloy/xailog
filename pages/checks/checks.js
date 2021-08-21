// pages/checks/checks.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[]
      },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var user_id='123456'
        // var user_time=options.user_time
        wx.cloud.database().collection('logs')
        .where({
            openid:user_id,
            // time=user_time
        })
        .get()
        .then(res =>{
            console.log('返回的数据',res.data)
            this.setData({
                list:res.data
            })
        }
            )

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})