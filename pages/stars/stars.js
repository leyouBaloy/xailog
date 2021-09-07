// pages/stars/stars.js
Page({

    data: {
        show: false,
        currentDate: new Date().getTime(),
        date: null,
        // star_logs:null,
        mineWithStar:[]
    },

    onLoad: function (options) {
        this.getSDate();
        this.stat();
        // this.get_star_logs();
    },

    getSDate(){
        var tem = new Date(this.data.currentDate);
        this.setData({ date: String(tem.getFullYear())+'年'+String(tem.getMonth()+1)+'月' });
        // console.log(this.data.date)
      },

    showPopup() {
        this.setData({ show: true });
      },

    onClose() {
        this.setData({ show: false });
      },

    onConfirm(date) {
        this.setData({
          currentDate: date.detail,
        });
        this.getSDate();
        this.onClose();
      },

      async stat(){
        wx.cloud.database().collection("mine").get().then(ress => {
        let that = this;
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        // let currentDay = currentDate.getDate();

        const dbc = wx.cloud.database().command;

        wx.cloud.database().collection("logs")
            .where(dbc.and({is_delete:false},{ifstar:true}))
            .get().then(res=>{
              for(var i of ress.data){
                  i.allStars = 0;
                  i.monthStars = 0;
              }
              // that.setData({star_logs:res.data});
              console.log("查询到的logs",res.data);
              console.log("查询到的mine",ress.data);
              for(var log of res.data){
                for(var mine of ress.data){
                  if(log._openid==mine._openid){
                    let _date = new Date(log.time)
                    let _month = _date.getMonth();
                  
                  mine.allStars += 1;
                  if(_month == currentMonth){
                    mine.monthStars +=1;
                  }
                  }
                }
              }
              console.log("统计后的结果",ress.data);
              that.setData({mineWithStar:ress.data})


              
            })
          })
    },






})

