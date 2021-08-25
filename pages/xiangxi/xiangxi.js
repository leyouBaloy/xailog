const date = new Date();
const years = [];
const months = [];
const days = [];
const app = getApp();
const db = wx.cloud.database({});
const book = db.collection('logs');
const MAX_LIMIT = 20;
const _ = db.command

//获取年
for (let i = 2021; i <= date.getFullYear() + 5; i++) {
  years.push("" + i);
}
//获取月份
for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  months.push("" + i);
}
//获取日期
for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  days.push("" + i);
}
Page({
  /**
   * 页面的初始数据
   */
  data:  {
    // 下拉菜单
    itemTitle: '日期选择',
    option1: [
      { text: '未读', value: 0 },
      { text: '全部', value: 1 },
    ],
    value1: 0,
    time: '',
    multiArray: [years, months, days],
    multiIndex: [0, 0, 0],
    choose_year: '',
    choose_month:'',
    shuju:[],
    shuju_num:0
    },
    try: function(e) {
      console.log(e.detail)
      var value = e.detail
      var that = this
      var openid = wx.getStorageSync('openid');
      that.setData({
        shuju:[]
      });
      if (value==0) {
         db.collection('logs').where(
          _.and([
            {
              ifread:false,
            },
            {
              is_delete:false,
            }
          ])).count().then(async res =>{
        let total = res.total;
        // 计算需分几次取
        const batchTimes = Math.ceil(total / MAX_LIMIT)
        // 承载所有读操作的 promise 的数组
        for (let i = 0; i < batchTimes; i++) {
          await db.collection('logs').skip(i * MAX_LIMIT).limit(MAX_LIMIT).where(
            _.and([
              {
                ifread:false,
              },
              {
                is_delete:false,
              }
            ])).get().then(async res => {
                  let new_data = res.data
                  let old_data = this.data.shuju
                  this.setData({
                      shuju : old_data.concat(new_data)
                      })
                  })
            }
        })
        .catch(err=>{//请求失败
          console.log('请求失败',err)
          })
       
     } else {
       db.collection('logs').where(
        _.and([
          {
            is_delete:false,
          }
        ])).count().then(async res =>{
      let total = res.total;
      // 计算需分几次取
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      // 承载所有读操作的 promise 的数组
      for (let i = 0; i < batchTimes; i++) {
        await db.collection('logs').skip(i * MAX_LIMIT).limit(MAX_LIMIT).where(
          _.and([
            {
              is_delete:false,
            }
          ])).get().then(async res => {
                let new_data = res.data
                let old_data = this.data.shuju
                this.setData({
                    shuju : old_data.concat(new_data)
                    })
                })
          }
      })
      .catch(err=>{//请求失败
        console.log('请求失败',err)
        })
     } 
  
    },
  
    onLoad: function (options) {
      var that = this
         db.collection('logs').where(
          _.and([
            {
              time:_.gte(new Date(new Date().toLocaleDateString()).getTime())
            },
            {
              is_delete:false,
            }
          ])).count().then(async res =>{
        let total = res.total;
        // 计算需分几次取
        const batchTimes = Math.ceil(total / MAX_LIMIT)
        // 承载所有读操作的 promise 的数组
        for (let i = 0; i < batchTimes; i++) {
          await db.collection('logs').skip(i * MAX_LIMIT).limit(MAX_LIMIT).where(
            _.and([
              {
                time:_.gte(new Date(new Date().toLocaleDateString()).getTime())
              },
              {
                is_delete:false,
              }
            ])).get().then(async res => {
                  let new_data = res.data
                  let old_data = that.data.shuju
                  that.setData({
                      shuju : old_data.concat(new_data)
                      })
                  })
            }
        })

        var year = date.getFullYear()-2021, month = date.getMonth(), day = date.getDate()-1
            that.setData({
            multiIndex:[year,month,day]
            })
    },
      //获取时间日期
  bindMultiPickerChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex;
    const year = this.data.multiArray[0][index[0]];
    const month = this.data.multiArray[1][index[1]];
    const day = this.data.multiArray[2][index[2]];

    console.log(`${year}-${month}-${day}`);
    this.setData({
      time: year + '-' + month + '-' + day,
      shuju:[]
    });
    var shijian=new Date(year + '-' + month + '-' + day)
    var time1 = shijian.getTime()-28800000
     db.collection('logs').where(
      _.and([
        {
          time:_.eq(time1),
        },
        {
          is_delete:false,
        }
      ])).count().then(async res =>{
    let total = res.total;
    // 计算需分几次取
    const batchTimes = Math.ceil(total / MAX_LIMIT)
    // 承载所有读操作的 promise 的数组
    for (let i = 0; i < batchTimes; i++) {
      await db.collection('logs').skip(i * MAX_LIMIT).limit(MAX_LIMIT).where(
        _.and([
          {
            time:_.eq(time1),
          },
          {
            is_delete:false,
          }
        ])).get().then(async res => {
              let new_data = res.data
              let old_data = this.data.shuju
              this.setData({
                  shuju : old_data.concat(new_data)
                  })
              })
        }
    })
    .catch(err=>{//请求失败
      console.log('请求失败',err)
      })

  },

    gotoresult:function (e) {
      var kind = e.currentTarget.dataset.id
          console.log(kind);
      wx.navigateTo({url: '/pages/checks/checks?kind='+kind})
    },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})
