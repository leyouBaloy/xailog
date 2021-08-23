
Page({

  data: {
      list:[],
      userInfo: null,
      isstar:'',
      release:[],
      show: false,
      show_2:false,
      userMessage:"",
      targets:'',
      value:'',
      name:'',
      t:0,
    },
  
  onLoad: function (options) {
      // var user_id=options.id
      this.setData({
        targets:options.kind
    })
    var user_id=this.data.targets
      wx.cloud.database().collection('logs')
      .doc(user_id)
      .get()
      .then(res =>{
          console.log('返回的数据',res.data)
          this.setData({
              list:res.data,
              isstar:res.data.ifstar
          })
          wx.cloud.database().collection('logs').doc(user_id).update({
            // data 传入需要局部更新的数据
            data: {
              // 表示将 done 字段置为 true
              ifread: true
            },
            success: function(res) {
            console.log(res)
            }
          })
      })
      wx.cloud.database().collection('comment')
      .where({
        orign:user_id
      })
      .get()
      .then(res =>{
        this.find(res)
      })
  },
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
  userMessage:''
})
var myDate = new Date();
console.log(e.detail.value.input)
wx.cloud.database().collection('comment').add({
  // data 传入需要局部更新的数据
  data: {
    // 表示将 done 字段置为 true
    name:wx.getStorageSync('userInfo').nickName,
    content:e.detail.value.input,
    orign:this.data.targets,
    target:'',
    time:myDate.toLocaleString( )
  },
  success: function(res) {
  console.log(res)
  }
})
},
reply(e){
  this.setData({
      show_2:false
    })
    var myDate = new Date();
    wx.cloud.database().collection('comment').add({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        name:wx.getStorageSync('userInfo').nickName,
        content:e.detail.value.input,
        orign:this.data.targets,
        target:this.data.value,
        time:myDate.toLocaleString( )
      },
      success: function(res) {
      console.log(res)
      }
    })

}
})