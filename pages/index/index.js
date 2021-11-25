import todo from '../../components/v2/plugins/todo'
import selectable from '../../components/v2/plugins/selectable'
import solarLunar from '../../components/v2/plugins/solarLunar/index'
import timeRange from '../../components/v2/plugins/time-range'
import week from '../../components/v2/plugins/week'
import holidays from '../../components/v2/plugins/holidays/index'
import plugin from '../../components/v2/plugins/index'

plugin
  .use(todo)
  .use(solarLunar)
  .use(selectable)
  .use(week)
  .use(timeRange)
  .use(holidays)

// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    timeSeries:[],
    calendarConfig: {// 日历
      theme: 'elegant'
    },
    userInfo: null,
    statusBarHeight: app.globalData.statusBarHeight,
    menubutton: null
  },
  onLoad() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    }),
    this.get_log_time_data()
  },
  //登录
  Login() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        // console.log(res.userInfo)
        wx.setStorageSync('userInfo', res.userInfo)
        this.setData({
          userInfo: res.userInfo
        })
      }
    })
  },
  //注销
  Logout() {
    wx.setStorageSync('userInfo', null)
    this.setData({
      userInfo: null
    })
  },
  
  writelog: function(param){
    wx.navigateTo({
      url: '/pages/write/write',
    })
  },
  //  以下是日历相关
  afterTapDate(e) {
    console.log('afterTapDate', e.detail)
  },
  whenChangeMonth(e) {
    console.log('whenChangeMonth', e.detail)
  },
  whenChangeWeek(e) {
    console.log('whenChangeWeek', e.detail)
  },
  takeoverTap(e) {
    console.log('takeoverTap', e.detail)
  },
  afterCalendarRender(e) {
    console.log('afterCalendarRender', e)
    // 获取日历组件上的 calendar 对象
    this.get_log_time_data(this)
  },
  onSwipe(e) {
    console.log('onSwipe', e)
  },
  // 日历选中时间
  get_log_time_data(that){
    wx.cloud.callFunction({
      name:"getTimeSeries",
      data:{
        openid:wx.getStorageSync('openid')
      }
    })
    .then(res=>{
      // console.log(res)
      var timeSeries = res.result.data.map((item)=>this.turn(item))
      const calendar = that.selectComponent('#calendar').calendar
      console.log("时间序列",timeSeries)
      calendar.setSelectedDates(timeSeries)
    })
    .catch(error=>{
      console.log("查询时间序列失败",error)
    })
  },
  // 转换时间序列
  turn(item){
    let time = new Date(item.time)
    let year = time.getFullYear()
    let month = time.getMonth() + 1
    let date = time.getDate()+1
    return {year:year,month:month,date:date}
}
  
})