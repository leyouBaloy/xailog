// pages/stat/stat.js
Page({
    data: {

    },
    bgslpm(){
        console.log("点我干啥(报告数量排名)")
        wx.navigateTo({
          url: '../../pages/bgslpm/bgslpm',
        })
    },
    xxxspm(){
        console.log("点我干啥(点赞次数排名)");
        wx.navigateTo({
            url: '../../pages/stars/stars',
          })
    }
})

