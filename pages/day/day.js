const date = new Date();
const years = [];
const months = [];
const days = [];
const app = getApp();
const db = wx.cloud.database({});
const book = db.collection('logs');
const MAX_LIMIT = 20;
const _ = db.command
import Dialog from '@vant/weapp/dialog/dialog'; 
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

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
    value1: 1,
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
    nameall:[],
    // 最重要的数据listLogs，日志数组
    listLogs:[],
    mine_listLogs:[],
    tab:0,
    release:[],
    t:0,
    comment:{},
    flags:{},
    show_2: false,

  },
  // 切换tab
  onChangeTab(event) {
    if(event.detail.name == "全部日志")
    {this.setData({tab:0})}
    if(event.detail.name == "我的日志")
    {this.setData({tab:1})}
  },
  // 封装好的加载"我的日志"数据函数
  get_mine_listLogs(){
    wx.showLoading({title:"加载中"})
    wx.cloud.callFunction({
      name: "testListLogs",
      data:{
        userInfo:this.data.userInfo,
        skip_num:this.data.mine_listLogs.length,
        type:"mine",
      }
    })
    .then(res => {
      console.log("调用云函数的结果",res.result.list)
      this.setData({mine_listLogs: this.data.mine_listLogs.concat(res.result.list)})
      wx.hideLoading()
      wx.showToast({title: '加载成功',})
    })
    .catch(res=>{
      console.log("加载失败",res)
      wx.hideLoading()
      wx.showToast({title: '加载失败',})
    })
  },

  // 封装好的加载数据函数
  get_listLogs(){
    // console.log(this.data.userInfo)
    wx.showLoading({title:"加载中"})
    wx.cloud.callFunction({
      name: "testListLogs",
      data:{
        userInfo:this.data.userInfo,
        skip_num:this.data.listLogs.length
      }
    })
    .then(res => {
      console.log("调用云函数的结果",res.result.list)
      this.setData({listLogs: this.data.listLogs.concat(res.result.list)})
      var i;
      for(i in this.data.listLogs){
        this.auto(this.data.listLogs[i]._id)
      }
      wx.hideLoading()
      wx.showToast({title: '加载成功',})
      console.log(this.data.listLogs)
    })
    .catch(res=>{
      console.log("加载失败",res)
      wx.hideLoading()
      wx.showToast({title: '加载失败',})
    })
  },

  // onload函数
  onLoad: function() {
    // 用户数据写入this.data
    this.setData({
      openid: wx.getStorageSync('openid'),
      userInfo: wx.getStorageSync('user'),
      listLogs:[],
      mine_listLogs:[],
    });
    // 加载第一次数据
    this.get_listLogs(),
    this.get_mine_listLogs(),

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
            ])).orderBy('time','desc').orderBy('create_time','desc').get().then(async res => {
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

  //触发下拉刷新
  onPullDownRefresh:function(){
    //显示顶部刷新图标
    wx.showLoading();
      //要刷新请求服务器的方法
       this.onLoad(),
       this.setData({
        value1:1,
        time2:0,
        })
       console.log("shuxin")
     //隐藏导航栏加载框
       wx.hideLoading();
      //停止下拉事件
       wx.stopPullDownRefresh();
   
},
// 触底刷新
onReachBottom: function () {
  if(this.data.tab == 0)
  {this.get_listLogs()}
  if(this.data.tab == 1)
  {this.get_mine_listLogs()}
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
    console.log(openid)
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
          ])).orderBy('time','desc').orderBy('create_time','desc').get().then(async res => {
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
          ])).orderBy('time','desc').orderBy('create_time','desc').get().then(async res => {
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
            ])).orderBy('time','desc').orderBy('create_time','desc').get().then(async res => {
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
            ])).orderBy('time','desc').orderBy('create_time','desc').get().then(async res => {
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
          ])).orderBy('time','desc').orderBy('create_time','desc').get().then(async res => {
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
          ])).orderBy('time','desc').orderBy('create_time','desc').get().then(async res => {
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
          ])).orderBy('time','desc').orderBy('create_time','desc').get().then(async res => {
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
          ])).orderBy('time','desc').orderBy('create_time','desc').get().then(async res => {
                let new_data = res.data
                let old_data = this.data.shuju
                console.log(new_data)
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


  delItem: function (e) {
    var id = e.currentTarget.dataset.id;
    var open= e.currentTarget.dataset.open;
    var openid = wx.getStorageSync('openid');
    if(open==openid){
    Dialog.confirm({
      title: '删除', 
      message: '确定要删除吗',
    })
      .then(() => {
        console.log('删除')
        db.collection('logs').doc(id).update({
          data: {
              is_delete:true
          },
          success: console.log,
          fail: console.log
        })
        this.setData({
          value1:1,
          time2:0
        });
      this.onLoad()
        // on confirm
      })
      .catch(() => {
        // on cancel
      });
    }else{
      Dialog.alert({
        title: '失败',
        message: '不能删除别人的'
       }).then(() => {
        // on close
       });
    }
   
},

//点赞小昕星
good:function(e){
  console.log("现在的点赞情况",e.detail.isLiked)

  this.setData({
    userid: wx.getStorageSync('openid')
})
  var id = e.currentTarget.dataset.id;
  var openid = wx.getStorageSync('openid');
  var idx = e.currentTarget.dataset.idx;
  if(this.data.userInfo.is_admin==true){
    if(e.detail.isLiked){
      db.collection('logs').doc(id).update({
        data: {
            ifstar:true
        }}).then(res=>{
          Toast.success('点赞成功')
          console.log('修改为点赞')
        }).catch(res=>{
          Toast.fail('点赞失败')
          console.log('修改点赞失败')
        })
        // this.data.listLogs[idx].ifstar : true
        if(this.data.tab == 0)
            {let idx_='listLogs['+idx+'].ifstar'
              this.setData({
                [idx_]:true
              })}
        if(this.data.tab == 1)
            {let idx_='mine_listLogs['+idx+'].ifstar'
              this.setData({
                [idx_]:true
              })}
      }
    else{
      db.collection('logs').doc(id).update({
        data: {
            ifstar:false
        },
        success: function(){
          Toast.fail('取消点赞')
          console.log("取消点赞成功")
        } ,
        fail: function(){console.log("取消点赞失败！")}
      })
      if(this.data.tab == 0)
            {let idx_='listLogs['+idx+'].ifstar'
              this.setData({
                [idx_]:false
              })}
        if(this.data.tab == 1)
            {let idx_='mine_listLogs['+idx+'].ifstar'
              this.setData({
                [idx_]:false
              })}
    }
  }else{
    console.log('no_admin')
    Toast.fail('只有管理员才能点击');
  }
},

//已读未读
read:function(e){
  this.setData({
    userid: wx.getStorageSync('openid')
})
  var id = e.currentTarget.dataset.id;
  var read = e.currentTarget.dataset.read;
  var openid = wx.getStorageSync('openid');
  var idx= e.currentTarget.dataset.idx;

  if(this.data.userInfo.is_admin==true){
    if(e.detail.isReaded){
      db.collection('logs').doc(id).update({
        data: {
            ifread:true
        },
        success: function(){console.log('修改为已读')},
        fail: function(){console.log('修改已读失败！')}
      })
      if(this.data.tab == 0)
            {let idx_='listLogs['+idx+'].ifread'
              this.setData({
                [idx_]:true
              })}
        if(this.data.tab == 1)
            {let idx_='mine_listLogs['+idx+'].ifread'
              this.setData({
                [idx_]:true
              })}
    }else{
      db.collection('logs').doc(id).update({
        data: {
            ifread:false
        },
        success: function(){console.log('修改为未读')},
        fail: function(){console.log('修改未读失败！')}
      })
      if(this.data.tab == 0)
        {let idx_='listLogs['+idx+'].ifread'
          this.setData({
            [idx_]:false
          })}
      if(this.data.tab == 1)
          {let idx_='mine_listLogs['+idx+'].ifread'
            this.setData({
              [idx_]:false
            })}
    }
  }else{
    Toast.fail('只有管理员才能点击');
  }
},

auto:function(e){
  var id = e;
  let p="comment."+id
  let q="flags."+id
  
  wx.cloud.database().collection('comment')
  .where({
    orign:id
  })
  .get()
  .then(res =>{
    let that=this
    this.setData({
      release:[]
    })
    this.find(res)
    this.setData({
      [p]:that.data.release
    })
    if(this.data.release.length==0){
      this.setData({
        [q]:false
      })
    }
    else{
      this.setData({
        [q]:true
      })
    }
  })
},
find:function (I) { 
  this.setData({
    t:0
  })
  for (var i=0;i<I.data.length;i++ ){
    if ( I.data[i].target==""){
      if(!(I.data[i] in this.data.release)){
        let p='release['+this.data.t+']'
        this.setData({
          [p]:I.data[i],
          t:this.data.t+1
        })
      }
      this.cirl(I,I.data[i])
    }
  }
}, 
cirl:function(I,i){
  for(var j=0;j<I.data.length;j++){
    if((I.data[j].target==i._id)&(!(I.data[j] in this.data.release))){
      let p="release["+this.data.t+"]"
      this.setData({
        [p]:I.data[j],
        t:this.data.t+1
      })
      this.cirl(I,I.data[j])
    }
    
  }
},
reply(e){
  this.setData({
      show_2:false,
      t:0,
      release:[]
    })
    var id = this.data.orign;
    let p="comment."+id
    let q="flags."+id
    wx.cloud.database().collection('comment').add({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        name:this.data.userInfo.name,
        content:e.detail.value.input,
        orign:this.data.orign,
        target:this.data.value,
        time:new Date().getTime()
      }
    })
    Toast.success('回复成功！');
    wx.cloud.database().collection('comment')
    .where({
      orign:this.data.orign
    })
    .get()
    .then(res =>{
      this.find(res)
      this.setData({
        [p]:this.data.release
      })
      if(this.data.release.length==0){
        this.setData({
          [q]:false
        })
      }
      else{
        this.setData({
          [q]:true
        })
      }
    })

},
open: function (event) {
  this.setData({
      show: true,
      orign:event.currentTarget.dataset.id
  })
},
submitForm(e) {
  this.setData({ 
    show:false,
    userMessage:'',
    t:0,
    release:[]
  })
  var id = this.data.orign;
  let p="comment."+id
  let q="flags."+id
  wx.cloud.database().collection('comment').add({
    // data 传入需要局部更新的数据
    data: {
      // 表示将 done 字段置为 true
      name:this.data.userInfo.name,
      content:e.detail.value.input,
      orign:this.data.orign,
      target:'',
      time:new Date().getTime()
    }})
    wx.cloud.database().collection('comment')
    .where({
      orign:this.data.orign
    })
    .get()
    .then(res =>{

      this.find(res)
      this.setData({
        [p]:this.data.release
      })
      if(this.data.release.length==0){
        this.setData({
          [q]:false
        })
      }
      else{
        this.setData({
          [q]:true
        })
      }
      })
      Toast.success('评论成功！');
  
  },
open_2: function (event) {
  this.setData({
      show_2: true,
      value:event.detail.value,
      orign:event.currentTarget.dataset.id
  })
  
  wx.cloud.database().collection('comment')
    .doc(this.data.value)
    .get()
    .then(res=>{
      this.setData({
        name:res.data.name
    })
    })
},

    onReady: function () {},
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onShareAppMessage: function () {}
})