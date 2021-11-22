// dist/cards/card/card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    headerImg: String,
    title: String,
    time: String,
    isImg: {
      type: Boolean,
      observer: function () { this.setData({ isImg: this.properties.isImg }); }
    },
    img: String,
    context: String,
    moreText: Array,
    isMoreText:{
      type: Boolean,
      observer: function () { this.setData({ isMoreText: this.properties.isMoreText }); }
    },
    isShowLike: Boolean,
    isLiked: {
      type: Boolean,
      observer: function () { this.setData({ isLiked: this.properties.isLiked }); }
    },
    isShowRead: Boolean,
    isReaded: {
      type: Boolean,
      observer: function () { this.setData({ isReaded: this.properties.isReaded }); }
    },
    likeNumber: Number,
    isShowUnlike: Boolean,
    unlikeNumber: Number,
    isShowDelete: Boolean,
    isShowComment: Boolean,
    tag: String,
    tagColor: String,
    // ignore the property since hide the share button
    // isShowShare: {
    //   type: Boolean,
    //   value: true,
    // }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isLiked: false,
    isReaded: false,
    open_show:false,
    open_show2:false,

  },

  /**
   * 组件的方法列表
   */
  methods: {
    showMoreText() {
      this.setData({ isMoreText: !this.data.isMoreText });
      this.triggerEvent('MoreText', {isMoreText: this.data.isMoreText});
    },
    open_2(event){
      this.setData({ open_show: !this.data.open_show });
      this.triggerEvent('open_show', {open_show: this.data.open_show,value:event.currentTarget.dataset.value});
    },
    open(){
      this.setData({ open_show2: !this.data.open_show2 });
      this.triggerEvent('open_show2', {open_show2: this.data.open_show2});
    },
    handleLike() {
      this.setData({ isLiked: !this.data.isLiked});
      this.triggerEvent('like', {isLiked: this.data.isLiked});
    },

    handleRead() {
      this.setData({ isReaded: !this.data.isReaded});
      this.triggerEvent('read', {isReaded: this.data.isReaded});
    },

    handleDelete() {
      this.triggerEvent('delete');
    },

    handledetail() {
      this.triggerEvent('detail');
    },

    // ignore the function since the share button be hidden
    // handleShare() {
    //   this.triggerEvent('share');
    // }
  }
})
