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
    moreText: String,
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
    isMoreText: false,
    isLiked: false,
    isReaded: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showMoreText() {
      this.setData({ isMoreText: !this.data.isMoreText });
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
