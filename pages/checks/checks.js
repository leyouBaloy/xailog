import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp()

Page({

  data: {
      list:[],
      openid:null,
      userid:null,
      userInfo: null,
      Info:null,
      isstar:'',
      release:[],
      show: false,
      show_2:false,
      userMessage:"",
      targets:'',
      value:'',
      name:'',
      t:0,
      safeArea: (app.globalData.screenHeight-app.globalData.safeBottom+44),
      dialogShow: false
    },
  
  onLoad: function (options) {
      // var user_id=options.id
      this.setData({
        userid: wx.getStorageSync('openid')
    })
    if (!this.data.targets){
      this.setData({
        targets:options.kind
    })
    }
    wx.cloud.database().collection('mine').where({
      _openid:this.data.userid
    })
    .get()
    .then(res=>{
      this.setData({
        userInfo:res.data[0]
      })
    })
    let that=this
    var user_id=this.data.targets
      wx.cloud.database().collection('logs')
      .doc(user_id)
      .get()
      .then(res =>{
          console.log('返回的数据',res.data)
          this.setData({
              list:res.data,
              isstar:res.data.ifstar,
              openid:res.data._openid
          })
          let imgIDs = [];
          let otherIDs = [];
          for(var i of res.data.fileIDs){
                let split = i.split(".")
              if(split[split.length-1]=="jpg" || split[split.length-1]=="png"){
                  imgIDs.push(i);
              }
              else{
                  otherIDs.push(i);
              }
          }
          this.setData({
            imgIDs:imgIDs,
            otherIDs:otherIDs
        })
          var date_2 = new Date(this.data.list.time);
          var date=new Date(this.data.list.create_time);
          this.setData({
          Y_2:date_2.getFullYear(),
          M_2 :(date_2.getMonth()+1 < 10 ? '0'+(date_2.getMonth()+1) : date_2.getMonth()+1) ,
          D_2 : date_2.getDate() ,
          Y:date.getFullYear(),
          M :(date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) ,
          D : date.getDate() ,
          h : date.getHours(),
          m : date.getMinutes(),
          s :date.getSeconds()
          })
          wx.cloud.database().collection('mine').where({
            _openid:this.data.openid
          })
          .get()
          .then(res=>{
            this.setData({
              Info:res.data[0]
            })
            if(this.data.userInfo.is_admin==true){
              wx.cloud.database().collection('logs').doc(user_id).update({
                // data 传入需要局部更新的数据
                data: {
                  // 表示将 done 字段置为 true
                  ifread: true
                },
                success: function(res) {
                console.log(res)
                wx.cloud.database().collection('comment')
                .where({
                  orign:user_id
                })
                .get()
                .then(res =>{
                  that.find(res)
                })
                }
            })
            }
            else{
              wx.cloud.database().collection('comment')
                .where({
                  orign:user_id
                })
                .get()
                .then(res =>{
                  that.find(res)
                })
            }
          })
          
      })
      
  },
  //下拉刷新
//   onPullDownRefresh:function(){
//     //显示顶部刷新图标
//         wx.showLoading({
//           title:"刷新中......"
//         });
//       //要刷新请求服务器的方法
//        this.onLoad()
//        console.log("shuxin")
//      //隐藏导航栏加载框
//        wx.hideLoading();
//       //停止下拉事件
//        wx.stopPullDownRefresh();
// },
  find:function (I) { 
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
  good:function(){
  var user_id=this.data.targets
  if(this.data.userInfo.is_admin==true){
    if (this.data.isstar==true){
      wx.cloud.database().collection('logs').doc(user_id).update({
          // data 传入需要局部更新的数据
          data: {
            // 表示将 done 字段置为 true
            ifstar: false
          }
        })
      this.setData({
        isstar:false
    })
    }else{
        wx.cloud.database().collection('logs').doc(user_id).update({
            // data 传入需要局部更新的数据
            data: {
              // 表示将 done 字段置为 true
              ifstar: true
            }
          })
          this.setData({
            isstar:true
          })
    }
  }else{
    Toast.fail('只有管理员才能点击');
  }
  
  },
  open: function () {
    this.setData({
        show: true
    })
},
open_2: function (event) {
    this.setData({
        show_2: true,
        value:event.currentTarget.dataset.value
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
submitForm(e) {
this.setData({ 
  show:false,
  userMessage:'',
  t:0,
  release:[]
})
wx.cloud.database().collection('comment').add({
  // data 传入需要局部更新的数据
  data: {
    // 表示将 done 字段置为 true
    name:this.data.userInfo.name,
    content:e.detail.value.input,
    orign:this.data.targets,
    target:'',
    time:new Date().getTime()
  }})
  Toast.success('评论成功！');
  wx.cloud.database().collection('comment')
  .where({
    orign:this.data.targets
  })
  .get()
  .then(res =>{
    this.onLoad()
    })

},
reply(e){
  this.setData({
      show_2:false,
      t:0,
      release:[]
    })
    var myDate = new Date();
    wx.cloud.database().collection('comment').add({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        name:this.data.userInfo.name,
        content:e.detail.value.input,
        orign:this.data.targets,
        target:this.data.value,
        time:new Date().getTime()
      }
    })
    Toast.success('回复成功！');
    wx.cloud.database().collection('comment')
    .where({
      orign:this.data.targets
    })
    .get()
    .then(res =>{
      this.find(res)
      this.setData({
        release:this.data.release
      })
    })

},
imgYu:function(event){
  var src = event.currentTarget.dataset.src;//获取data-src
  var imgList = event.currentTarget.dataset.list;//获取data-list
  console.log(src)
  console.log(imgList)
  //图片预览
  wx.previewImage({
  current: imgList, // 当前显示图片的http链接
  urls:src  // 需要预览的图片http链接列表
  })
  },
saveImage(event){
wx.cloud.downloadFile({
  fileID:event.currentTarget.dataset.list,
  success: res => {
    // 返回临时文件路径
    let split = res.tempFilePath.split("/")
    wx.getFileSystemManager().saveFile({
      tempFilePath: res.tempFilePath, // 传入一个本地临时文件路径, http://tmp/开头的
      filePath:  wx.env.USER_DATA_PATH +'/'+split[split.length-1], //保存到用户目录/abc文件中，此处文件名自定义，因为tempFilePath对应的是一大长串字符
      success(res) {
        console.log('save ->', res) // res.savedFilePath 为一个本地缓存文件路径
        wx.showToast({
          title: '文件已保存至：' + res.savedFilePath,
          icon: 'none',
          duration: 3000
        })
      },
      fail(res){
        console.log(res)
      }
    })
  },
  fail: console.error
})
}
})