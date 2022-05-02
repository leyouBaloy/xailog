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

Page({
  data: {
    // 缓存信息
    myopenid:null,
    userInfo:null,
    // 其它
    time: '',
    // 最重要的数据listLogs，日志数组
    listLogs:[],
    mine_listLogs:[],
    release:[],
    t:0,
    comment:{},
    flags:{},
    show_2: false,
    // 只看我的
    onlyMe: false,
  },
  // 切换“只看我的”
  onChangeOnlyMe({ detail }) {
    this.setData({ onlyMe: detail });
    if(this.data.mine_listLogs.length==0 || this.data.listLogs.length==0){
      this.onPullDownRefresh()
    }
  },
  // 封装好的加载数据函数
  get_listLogs(){
    // console.log(this.data.userInfo)
    wx.showLoading({title:"加载中"})
    wx.cloud.callFunction({
      name: "listLogs",
      data:{
        type: this.data.onlyMe ? "mine": "all",
        userInfo:this.data.userInfo,
        skip_num:this.data.onlyMe ? this.data.mine_listLogs.length: this.data.listLogs.length
      }
    })
    .then(res => {
      console.log("云函数listLogs结果：",res.result.list)
      // 展开评论
      for(var i in res.result.list){
        this.auto(res.result.list[i]._id)
      }
      // 拼接数组
      if(this.data.onlyMe){
        this.setData({mine_listLogs: this.data.mine_listLogs.concat(res.result.list)})
      }else{
        this.setData({listLogs: this.data.listLogs.concat(res.result.list)})
      }
      wx.hideLoading()
      wx.showToast({title: '加载成功',})
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
      myopenid: wx.getStorageSync('openid'),
      userInfo: wx.getStorageSync('user'),
      listLogs:[],
      mine_listLogs:[],
    });
    // 加载第一次数据
    this.get_listLogs()
  },

  //触发下拉刷新
  onPullDownRefresh:function(){
    //显示顶部刷新图标
    wx.showLoading();
      //要刷新请求服务器的方法
       this.onLoad(),
       console.log("刷新")
     //隐藏导航栏加载框
       wx.hideLoading();
      //停止下拉事件
       wx.stopPullDownRefresh();
   
},
// 触底刷新
onReachBottom: function () {
  this.get_listLogs()

},


  //跳转详细界面
  detail:function (e) {
    var kind = e.currentTarget.dataset.id
        console.log(kind);
    wx.navigateTo({url: '/pages/checks/checks?kind='+kind})
  },

  //点击头像，跳转个人主页
  personal:function (e) {
    var id= e.currentTarget.dataset.open
        console.log(id);
        console.log("成功触发personal")
    wx.navigateTo({url: '/pages/alldetail/alldetail?id='+id})

  },

//垃圾箱删除功能
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
        if(!this.data.onlyMe)
            {let idx_='listLogs['+idx+'].ifstar'
              this.setData({
                [idx_]:true
              })}
        if(this.data.onlyMe)
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
      if(!this.data.onlyMe)
            {let idx_='listLogs['+idx+'].ifstar'
              this.setData({
                [idx_]:false
              })}
        if(this.data.onlyMe)
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
      if(!this.data.onlyMe)
            {let idx_='listLogs['+idx+'].ifread'
              this.setData({
                [idx_]:true
              })}
        if(this.data.onlyMe)
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
      if(!this.data.onlyMe)
        {let idx_='listLogs['+idx+'].ifread'
          this.setData({
            [idx_]:false
          })}
      if(this.data.onlyMe)
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