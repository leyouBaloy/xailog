# 效果展示

首页：写日志

![image-20250209170553020](./imagesForREADME/image-20250209170553020.png)

![image-20250209170655847](./imagesForREADME/image-20250209170655847.png)

个人页面：修改头像名、管理

日志窗口（仅管理员）

![image-20250209170720166](./imagesForREADME/image-20250209170720166.png)

日志查看：筛选，查看详情 

![image-20250209170800376](./imagesForREADME/image-20250209170800376.png)

![image-20250209170825819](./imagesForREADME/image-20250209170825819.png)

统计:日志数量或“小昕星”统计

![image-20250209170832706](./imagesForREADME/image-20250209170832706.png)

# 技术架构

### 前端技术

- JavaScript：作为小程序的主语言，用于编写业务逻辑，事件处理和页面交互等。
- WXML/WXSS：这两个文件语言是微信小程序特有的前端标记语言，分别负责描述结构和样式。

### 后端技术

- 云开发 (Cloud Functions)：项目中的 `cloud` 文件夹通常包含微信小程序的云函数。这些云函数用于处理服务器端逻辑，如数据存储、云数据库操作、文件上传等。
- 云数据库/云存储：微信小程序与微信提供的云服务（如云数据库、云存储）集成，提供后端服务。

# 数据库

### logs表

| 字段 |     _id      | _openid          | content  | fileIDs              | time     |
| ---- | :----------: | ---------------- | -------- | -------------------- | -------- |
| 说明 | 区别一条记录 | 用户的唯一身份码 | 日志内容 | 附件在云存储中的链接 | 日志时间 |
| 类型 |     str      | str              | str      | array，元素为str     | num      |
| 备注 |   自动生成   |                  |          |                      | 时间戳   |

| is_delete        |ifread      |ifstar      | create_time | is_public |      |
| ---------------- | ---- | ---- | ---- | ---- | ---- |
| 是否删除         |是否已读      |是否有星      | 提交日志的时间 | 是否公开 |      |
| boolean          |boolean      |boolean      | number | boolean |      |
| 1表示删除，0反之 | 1表示已读，0反之| 1表示有星，0反之 | 时间戳 | true表示公开，false反之 |      |

### comment表
| 字段 |     _id      | _openid          | content  |target              | time          |origin|
| ---- | :----------: | ---------------- | -------- | -------------------- | ------------- |------|
| 说明 | 区别一条记录 | 用户的唯一身份码 | 评论内容 | 回复的哪条评论 | 评论时间      |哪条日志下的评论|
| 类型 |     str      | str              | str      | str     | date         |str|
| 备注 |   自动生成   |                  |          |                      | 例如“8月23日” |      |

### mine表

第一次授权登录时，如果mine表里没有用户的openid，就写入。

| 字段 | _id | _openid  |  name  | avator                   |is_admin      |
| ---- | ---- | -------- | :----: | ------------------------ | ------------ |
| 说明 | 不解释了 | 不解释了 |  名字  | 头像                     |是不是管理员    |
| 类型 |      |          |  str   | str                      |boolean      |
| 备注 |      |          | 第一次获取微信名 | 头像的链接 |1表示已读，0反之      |



# 模板

在wxml里面引用:
```html
<view class="bottom_bar" style="height: {{safeArea}}px;">
    <view class="bottom_menu">
        <view class="bottom_menu_value"><image class="bottom_menu_img" mode="widthFix" src="../../images/comment.png"></image></view>
        <view class="bottom_menu_value"><image class="bottom_menu_img" mode="widthFix" src="../../images/good.png"></image></view>
        <view class="bottom_menu_value"><image class="bottom_menu_img" mode="widthFix" src="../../images/share.png"></image></view>
    </view>
</view>
```

加到当前页面js的data里面:

```javascript
safeArea: (app.globalData.screenHeight-app.globalData.safeBottom+44)
```
# 从缓存中获取用户的openid
`wx.getStorageSync('openid')`

# 卡片组件

github地址：https://github.com/katherine0325/wx-cards

使用方法详情请见/components/wx-cards-master/README.md

另外，leyoubaloy修改源码文件，在card中增加了`isImg`属性，表示是否显示图片


        bind:open_show='open_2'   回复评论
        bind:open_show2='open'    暂无评论的时候写评论

# 显示日志的逻辑

有两个数组`listLogs`和`mine_listLogs`分别显示全部日志和我的日志。

管理员的`listLogs`包含所有日志，而普通用户只包含公开日志。管理员和普通用户的`mine_listLogs`相同，都只包含自己的公开的和未公开的日志。

两个数组都通过云函数`listLogs`更新。
