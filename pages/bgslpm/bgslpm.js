// pages/bgslpm/bgslpm.js
Page({
    data: {
        show: false,
        currentDate: new Date().getTime(),
        date: null
      },

      onLoad() {
        this.getSDate()
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
})