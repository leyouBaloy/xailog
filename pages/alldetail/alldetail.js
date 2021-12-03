const app = getApp();
const db = wx.cloud.database({});
const book = db.collection('logs');
const MAX_LIMIT = 20;
const _ = db.command
import Dialog from '@vant/weapp/dialog/dialog'; 
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  data: {
    openid:null,
    userInfo:null,
    // 其它
    time: '',
    // 最重要的数据mine_listLogs，日志数组
    mine_listLogs:[],
    tab:0,
    release:[],
    t:0,
    comment:{},
    flags:{},
    show_2: false,
    targets:'',
    },
    
    onLoad: function (options) {

      if (!this.data.targets){
        this.setData({
          targets:options.id
        })
      }
      var this_id=this.data.targets
      console.log("this_id:",this_id)
      console.log("mine",this.data.mine_listLogs)

    this.setData({
      openid: wx.getStorageSync('openid'),
      mine_listLogs:[],
    });
    // 加载第一次数据
    this.get_mine_listLogs()

  },
  
  // 封装好的加载"我的日志"数据函数
  get_mine_listLogs(){
    if (!this.data.targets){
      this.setData({
        targets:options.id
      })
    }
    var this_id=this.data.targets
    
    wx.showLoading({title:"加载中"})
    wx.cloud.callFunction({
    name: "listLogs",
    data:{
      userInfo:{_openid:this_id},
      skip_num:this.data.mine_listLogs.length,
      type:"mine",
    }
  })
  .then(res => {
    console.log("调用云函数的结果",res.result.list)
    this.setData({mine_listLogs: this.data.mine_listLogs.concat(res.result.list)})
    wx.hideLoading()
    wx.showToast({title: '加载成功',})
    console.log("mine",this.data.mine_listLogs)

  })
  .catch(res=>{
    console.log("加载失败",res)
    wx.hideLoading()
    wx.showToast({title: '加载失败',})
  })
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
  this.get_mine_listLogs()
},
    //跳转详细界面
    detail:function (e) {
      var kind = e.currentTarget.dataset.id
          console.log(kind);
      wx.navigateTo({url: '/pages/checks/checks?kind='+kind})
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

})