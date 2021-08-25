// pages/bgslpm/bgslpm.js
Page({
    data: {
        show: false,
        currentDate: new Date().getTime(),
        date: null,
        openids:[],
        cnt_by_month:[],
        cnt_by_day:[],
      },

      onLoad() {
        this.getSDate(),
        this.stat()
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

      download(){
        console.log("导出为Excel")
      },
      onConfirm(date) {
        this.setData({
          currentDate: date.detail,
        });
        this.getSDate();
        this.onClose();
      },

      stat(){
        var that = this;
        let currentDate = new Date();
        let currentDateStamp = currentDate.getTime();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();
        let currentDay = currentDate.getDate();
        let openids = new Set();
        let cnt_by_month = [];
        let cnt_by_day = [];
        let tmp_cnt_by_month = 0;
        let tmp_cnt_by_day = 0;
        wx.cloud.database().collection("logs")
        .where({is_delete:0})
        .get()
        .then(res => {
          console.log("查询logs成功", res)
          for (var val of res.data){
            openids.add(val._openid);
          };
          console.log("查到的openids",openids);//找到openids，放进集合里
          that.setData({openids:openids});//数据库暂时没有name，用openid代替
          for (var openid of openids){
            for (var data of res.data){
              if(openid==data._openid){
                let _date = new Date(data.time);
                let _year = _date.getFullYear();
                let _month = _date.getMonth();
                let _day = _date.getDate();
                if (_year==currentYear && _month==currentMonth){
                  tmp_cnt_by_month += 1;
                  // console.log("currentMonth的值", currentMonth,"_month的值", _month);
                  if (_day == currentDay) {
                    // console.log("currentDay的值", currentDay,"_day的值", _day);
                    tmp_cnt_by_day += 1;
                  }
                }
              }
            }
            cnt_by_month.push(tmp_cnt_by_month);
            tmp_cnt_by_month=0;
            cnt_by_day.push(tmp_cnt_by_day);
            tmp_cnt_by_day=0;
          };
          console.log("cnt_by_month的值", cnt_by_month);
          that.setData({cnt_by_month:cnt_by_month});
          console.log("cnt_by_day的值", cnt_by_day);
          that.setData({cnt_by_day:cnt_by_day});
        })
        .catch(err => {
          console.log("查询logs失败", err)
        })
      }
})