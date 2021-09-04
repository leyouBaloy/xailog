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
    // 缓存信息
    openid:null,
    userInfo:null,
    // 其它
    time: '',
    time1:0,
    time2:0,
    changshi:0,
    multiArray: [years, months, days],
    multiIndex: [0, 0, 0],
    choose_year: '',
    choose_month:'',
    shuju:[],
    shuju_num:0,
    delBtnWidth:160,
    isScroll:true,
    windowHeight:0,
    nameall:[]
  },

  onLoad: function() {
    this.setData({
      openid: wx.getStorageSync('openid'),
      userInfo: wx.getStorageSync('user')
    });
    db.collection('mine').count().then(async res =>{
      let total = res.total;
      // 计算需分几次取
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      // 承载所有读操作的 promise 的数组
      for (let i = 0; i < batchTimes; i++) {
        await db.collection('mine').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get().then(async res => {
                let new_data = res.data
                let old_data = that.data.nameall
                that.setData({
                    nameall : old_data.concat(new_data)
                    })
                })
          }
      })
    var that = this
    var openid = wx.getStorageSync('openid');
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          shuju:[],
          time2:0,
          nameall:[]
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
            ])).orderBy('time','desc').get().then(async res => {
            let new_data = res.data
            let old_data = that.data.shuju
            that.setData({
              shuju : old_data.concat(new_data),
            })
          })
        }
      })
    var year = date.getFullYear()-2021, month = date.getMonth(), day = date.getDate()-1
        that.setData({
            multiIndex:[year,month,day]
        })
        
  },
  //获取未读还是全部
  try: function(e) {
    var openid = wx.getStorageSync('openid');
    var value = e.detail
    var that = this
    //time2是全部日期，默认为0选中，未选中为1
    that.setData({
      shuju:[],
      changshi:value
    });
    var time1 = e.currentTarget.dataset.time1
    var time2 = e.currentTarget.dataset.time2
    var openid = wx.getStorageSync('openid');
    if(time2==0){
    if(value==0){
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
          ])).orderBy('time','desc').get().then(async res => {
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
    }else{
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
          ])).orderBy('time','desc').get().then(async res => {
                let new_data = res.data
                let old_data = this.data.shuju
                console.log(res.data[0]._openid)
                this.setData({
                    shuju : old_data.concat(new_data)
                    })
                })
          }
      })
      .catch(err=>{//请求失败
        console.log('请求失败',err)
        })
    }}else{
      if(value==0){
        db.collection('logs').where(
          _.and([
            {
              _openid:openid,
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
                _openid:openid,
              },
              {
                time:_.eq(time1),
              },
              {
                is_delete:false,
              }
            ])).orderBy('time','desc').get().then(async res => {
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
      }else{
        db.collection('logs').where(
          _.and([
            {
              time:_.eq(time1),
            },
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
                time:_.eq(time1),
              },
              {
                is_public:true,
              },
              {
                is_delete:false,
              }
            ])).orderBy('time','desc').get().then(async res => {
                  let new_data = res.data
                  let old_data = this.data.shuju
                  console.log(res.data[0]._openid)
                  this.setData({
                      shuju : old_data.concat(new_data)
                      })
                  })
            }
        })
        .catch(err=>{//请求失败
          console.log('请求失败',err)
          })
      }}
  },
   //获取哪天的日期
  bindMultiPickerChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    var that = this
    this.selectComponent('#item').toggle();
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex;
    const year = this.data.multiArray[0][index[0]];
    const month = this.data.multiArray[1][index[1]];
    const day = this.data.multiArray[2][index[2]];
    var openid = wx.getStorageSync('openid');
    console.log(`${year}-${month}-${day}`);
    var shijian=new Date(year + '-' + month + '-' + day)
    var time1 = shijian.getTime()-28800000
    this.setData({
      time: year + '-' + month + '-' + day,
      time1:time1,
      time2:1,
      shuju:[],
    });
    var changshi = e.currentTarget.dataset.changshi
    console.log(changshi)
    var openid = wx.getStorageSync('openid');
    console.log(time1)
    if(changshi==0){
      db.collection('logs').where(
        _.and([
          {
            time:_.eq(time1),
          },
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
              time:_.eq(time1),
            },
            {
              _openid:openid,
            },
            {
              is_delete:false,
            }
          ])).orderBy('time','desc').get().then(async res => {
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
    }else{
      db.collection('logs').where(
        _.and([
          {
            time:_.eq(time1),
          },
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
              time:_.eq(time1),
            },
            {
              is_public:true,
            },
            {
              is_delete:false,
            }
          ])).orderBy('time','desc').get().then(async res => {
                let new_data = res.data
                let old_data = this.data.shuju
                console.log(res.data[0]._openid)
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
   //获取全部日期
   quanbu: function(e) {
    this.selectComponent('#item').toggle();
    var changshi = e.currentTarget.dataset.changshi
    var openid = wx.getStorageSync('openid');
    var that = this
    that.setData({
      shuju:[],
      time2:0
    });
    console.log(changshi)
    if(changshi==0){
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
          ])).orderBy('time','desc').get().then(async res => {
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
    }else{
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
          ])).orderBy('time','desc').get().then(async res => {
                let new_data = res.data
                let old_data = this.data.shuju
                console.log(res.data[0]._openid)
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

  //跳转详细界面
  detail:function (e) {
    var kind = e.currentTarget.dataset.id
        console.log(kind);
    wx.navigateTo({url: '/pages/checks/checks?kind='+kind})
  },

  //左滑删除的代码
  delItem: function (e) {
    console.log('删除')
    var id = e.currentTarget.dataset.id;
    var open= e.currentTarget.dataset.open;
    var openid = wx.getStorageSync('openid');
    console.log(id)
    if(open==openid){
      db.collection('logs').doc(id).update({
      data: {
          is_delete:true
      },
      success: console.log,
      fail: console.log
    })
    this.setData({
      value1:0
    });
  }else{
    console.log('不能删除别人的')
  }
  this.onLoad()
  },
  //左滑删除到这里结束

    onReady: function () {},
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function () {}
})