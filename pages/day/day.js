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
  data: {
    // 下拉菜单
    itemTitle: '日期选择',
    option1: [
      { text: '我的日志', value: 0 },
      { text: '全部日志', value: 1 },
    ],
    value1: 0,
    // 其它
    weidu:null,
    quanbu:null, 
    time: '',
    multiArray: [years, months, days],
    multiIndex: [0, 0, 0],
    choose_year: '',
    choose_month:'',
    shuju:[],
    shuju_num:0,
    delBtnWidth:160,
    isScroll:true,
    windowHeight:0,
    tryy:''
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
            _openid:openid,
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
              _openid:openid,
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
          is_public:true,
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
            is_public:true,
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
   } 

  },
    // 下拉菜单
    menuOnConfirm() {
      this.selectComponent('#item').toggle();
    },
  
    menuOnSwitch1Change({ detail }) {
      this.setData({ switch1: detail });
    },
  
    menuOnSwitch2Change({ detail }) {
      this.setData({ switch2: detail });
    },

  onLoad: function() {
    console.log('onLoad')
    var that = this
    var openid = wx.getStorageSync('openid');
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          shuju:[]
        });
      }
    });
        db.collection('logs').where(
            _.and([
              {
                _openid:openid,
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
                _openid:openid,
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
    var openid = wx.getStorageSync('openid');
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
          is_public:true,
        },
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
            is_public:true,
          },
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
  detail:function (e) {
    var kind = e.target.id
        console.log(kind);
    wx.navigateTo({url: '/pages/checks/checks?kind='+kind})
  },
  drawStart: function (e) {
    // console.log("drawStart");  
    var touch = e.touches[0]

    for(var index in this.data.shuju) {
      var item = this.data.shuju[index]
      item.right = 0
    }
    this.setData({
      shuju: this.data.shuju,
      startX: touch.clientX,
    })

  },
  drawMove: function (e) {
    var touch = e.touches[0]
    var item = this.data.shuju[e.currentTarget.dataset.index]
    var disX = this.data.startX - touch.clientX
    
    if (disX >= 20) {
      if (disX > this.data.delBtnWidth) {
        disX = this.data.delBtnWidth
      }
      item.right = disX
      this.setData({
        isScroll: false,
        shuju: this.data.shuju
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        shuju: this.data.shuju
      })
    }
  },  
  drawEnd: function (e) {
    var item = this.data.shuju[e.currentTarget.dataset.index]
    if (item.right >= this.data.delBtnWidth/2) {
      item.right = this.data.delBtnWidth
      this.setData({
        isScroll: true,
        shuju: this.data.shuju,
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        shuju: this.data.shuju,
      })
    }
  },
  delItem: function (e) {
    console.log('删除')
    var id = e.currentTarget.dataset.id;
    console.log(id)
    db.collection('logs').doc(id).update({
      data: {
          is_delete:true
      },
      success: console.log,
      fail: console.log
    })
  },

    onReady: function () {},
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function () {}
})