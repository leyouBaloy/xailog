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
    weidu:null,
    quanbu:null, 
    time: '',
    multiArray: [years, months, days],
    multiIndex: [0, 0, 0],
    choose_year: '',
    choose_month:'',
    shuju:[],
    shuju_num:0
    },
  
    onLoad: function (options) {
      var that = this
        that.setData({
          weidu:options.nameData,
          quanbu:options.ageData
        })
         db.collection('logs').where({//条件查询
          time:_.gte(new Date(new Date().toLocaleDateString()).getTime())
        }).count().then(async res =>{
        let total = res.total;
        // 计算需分几次取
        const batchTimes = Math.ceil(total / MAX_LIMIT)
        // 承载所有读操作的 promise 的数组
        for (let i = 0; i < batchTimes; i++) {
          await db.collection('logs').skip(i * MAX_LIMIT).limit(MAX_LIMIT).where({//条件查询
              time: _.gte(new Date(new Date().toLocaleDateString()).getTime())
              }).get().then(async res => {
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
     db.collection('logs').where({//条件查询
      time:_.eq(time1)
    }).count().then(async res =>{
    let total = res.total;
    // 计算需分几次取
    const batchTimes = Math.ceil(total / MAX_LIMIT)
    // 承载所有读操作的 promise 的数组
    for (let i = 0; i < batchTimes; i++) {
      await db.collection('logs').skip(i * MAX_LIMIT).limit(MAX_LIMIT).where({//条件查询
          time: _.eq(time1)
          }).get().then(async res => {
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
      //监听picker的滚动事件
    bindMultiPickerColumnChange: function(e) {
      //获取年份
      if (e.detail.column == 0) {
        let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
        console.log(choose_year);
        this.setData({
          choose_year
        })
      }
      //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
      if (e.detail.column == 1) {
        let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
        let temp = [];
        if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
          for (let i = 1; i <= 31; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
          for (let i = 1; i <= 30; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        } else if (num == 2) { //判断2月份天数
          let year = parseInt(this.data.choose_year);
          console.log(year);
          if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
            for (let i = 1; i <= 29; i++) {
              if (i < 10) {
                i = "0" + i;
              }
              temp.push("" + i);
            }
            this.setData({
              ['multiArray[2]']: temp
            });
          } else {
            for (let i = 1; i <= 28; i++) {
              if (i < 10) {
                i = "0" + i;
              }
              temp.push("" + i);
            }
            this.setData({
              ['multiArray[2]']: temp
            });
          }
        }
        console.log(this.data.multiArray[2]);
      }
      var data = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
      };
      data.multiIndex[e.detail.column] = e.detail.value;
      this.setData(data);
    },
    gotoresult:function (e) {
      console.log('e',e.target)
      var kind = e.target.id
          console.log('kind',kind);
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
