Page({
  data: {
    date: "",
    show: false,
    value: "",
    content: "",
    fileList: [],
  },

  onDisplay() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },
  onConfirm(event) {
    this.setData({
      show: false,
      date: this.formatDate(event.detail),
    });
  },
  onChange(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
  },
  contentOnChange(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
  },
});