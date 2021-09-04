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
      { text: '全部日志', value: 0 },
      { text: '未读日志', value: 1 },
    ],
    value1: 0,
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
    console.log('onLoad')
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
          time1:0,
          time2:0,
          changshi:0,
          nameall:[]
        });
      }
    });
        
      db.collection('logs').where(
            _.and([
              {
                time:_.eq(new Date(new Date().toLocaleDateString()).getTime()) 
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
                time:_.eq(new Date(new Date().toLocaleDateString()).getTime()) 
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
  onPullDownRefresh:function(){
    //显示顶部刷新图标
        wx.showLoading({
          title:"刷新中......"
        });
      //要刷新请求服务器的方法
       this.onLoad();
       console.log("shuxin")
     //隐藏导航栏加载框
       wx.hideLoading();
      //停止下拉事件
       wx.stopPullDownRefresh();
},
  //获取未读还是全部
  try: function(e) {
    console.log(e.detail)
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
    console.log(time1)
    console.log("changshi value")
    console.log(value)
    if(time2==0){
    if(value==0){
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
                time:_.eq(time1),
              },
              {
                ifread:false,
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
    console.log("changshi")
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
              time:_.eq(time1),
            },
            {
              ifread:false,
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
  detail:function (e) {
    var kind = e.currentTarget.dataset.id
        console.log(kind);
    wx.navigateTo({url: '/pages/checks/checks?kind='+kind})
  },


    onReady: function () {},
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function () {}
})