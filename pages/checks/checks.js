
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
      t:0
    },
  
  onLoad: function (options) {
      // var user_id=options.id
      this.setData({
        targets:'cd045e756120b7b406f45cec4050f728'
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
        orign:user_id,
        target:""
      })
      .get()
      .then(res =>{
        this.find(res)
        console.log('rea',this.data.release)
      })

  },
  find:function (I) {
    for (var i =0;i<I.data.length;i++) {
      var price = 'release['+this.data.t+']';
      this.setData({
          [price]:I.data[i]})
      this.setData({
        t:this.data.t+1})
      console.log('1')
      wx.cloud.database().collection('comment')
      .where({
        orign:this.data.targets,
        target:I.data[i]._id
      })
      .get()
      .then(res=>{
        this.find(res)
        console.log('2')
      })
      console.log('3')
    }
  },
  good:function(){
  var user_id=this.data.targets
  wx.cloud.database().collection('logs').doc(user_id)
  .get()
  .then(res =>{
      if (res.data.ifstar==true){
          wx.cloud.database().collection('logs').doc(user_id).update({
              // data 传入需要局部更新的数据
              data: {
                // 表示将 done 字段置为 true
                ifstar: false
              },
              success: function(res) {
              console.log(res)
              }
            })
      }else{
          wx.cloud.database().collection('logs').doc(user_id).update({
              // data 传入需要局部更新的数据
              data: {
                // 表示将 done 字段置为 true
                ifstar: true
              },
              success: function(res) {
              console.log(res)
              }
            })
      }
      
      
  })
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