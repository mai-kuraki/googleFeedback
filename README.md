# googleFeedback

![](https://user-gold-cdn.xitu.io/2018/5/17/1636cec3652b9860?w=420&h=270&f=gif&s=3401375)
![](https://user-gold-cdn.xitu.io/2018/5/17/1636cec56d528280?w=255&h=420&f=gif&s=1070950)
[demo演示](http://39.105.103.128/feedback/demo)
### 1.安装：
使用npm
```
npm install react-googlefeedback --save-dev
```
### 2.使用
react中：
```
import React from 'react';
import ReactDOM from 'react-dom';
import Feedback from 'react-googlefeedback';
import 'react-googlefeedback/dist/style.css';

const license = `如出于法律原因需要请求更改内容，请前往
                <a href="" >法律帮助</a>
                页面。系统可能已将部分
                <a href="">帐号和系统信息</a>
                发送给Google。我们将根据自己的
                <a href="">隐私权政策</a>和<a href="">服务条款</a>
                使用您提供的信息帮助解决技术问题和改进我们的服务。`;

class Page extends React.Component {
    constructor() {
        super();
        this.state = {
            open: false,
        }
    }
    open() {
        this.setState({
            open: true,
        })
    }
    cancel() {
        this.setState({
            open: false,
        })
    }
    send(data) {
        console.log(data)
    }
    render() {
        return (
            <div>
                <button onClick={this.open.bind(this)}>feedback</button>
                {
                    this.state.open?
                        <Feedback
                            theme="#3986FF"
                            cancel={this.cancel.bind(this)}
                            send={this.send.bind(this)}
                            license={license}
                            allowCORS={['http://127.0.0.1:5000']}
                            proxy="http://127.0.0.1:5000/feedbackApi/cors"
                        />:null
                }
            </div>
        )
    }
}
ReactDOM.render(<Page/>, document.getElementById('main'));
```
在页面中引入js文件使用：
```
<body>
    <div id="feedback"></div>
    <button id="btn"></button>
<body>
<script src="react-googlefeedback/dist/googlefeedback.js"></script>
<script>
    new Feedback({
        container: document.getElementById('feedback'),
        trigger: document.getElementById('btn'),
        theme: '#3986FF',
        allowCORS: ['http://127.0.0.1:5000'],
        proxy: 'http://127.0.0.1:5000/feedbackApi/cors',
        license: `如出于法律原因需要请求更改内容，请前往
                <a href="" >法律帮助</a>
                页面。系统可能已将部分
                <a href="">帐号和系统信息</a>
                发送给Google。我们将根据自己的
                <a href="">隐私权政策</a>和<a href="">服务条款</a>
                使用您提供的信息帮助解决技术问题和改进我们的服务。`,
        send: function (data) {
            console.log(data)
        }
    });
</script>
```
### 3.参数说明
react 组件：
| 参数 | 功能 | 类型 | 是否必填 |
|-|-|-|-|
|theme|设置组件主题颜色|string|✗ 默认值 #3986FF|
|cancel|取消按钮处理函数|function|✓|
|send|发送按钮处理函数，会传回收集的数据|function|✓|
|license|协议内容|html字符串|✗ 默认值为谷歌的隐私条款协议|
|allowCORS|页面中允许跨域访问的域|arrary|✗ 默认值[]|
|proxy|代理地址，如果页面中存在跨域图片可以设置这个值|string|✗ 默认空值|
页面中直接引用：
| 参数 | 功能 | 类型 | 是否必填 |
|-|-|-|-|
|container|组件容器元素|element|✓|
|trigger|用于触发组件打开的元素|element|✓|
|theme|设置组件主题颜色|string|✗ 默认值 #3986FF|
|license|协议内容|html字符串|✗ 默认值为谷歌的隐私条款协议|
|allowCORS|页面中允许跨域访问的域|arrary|✗ 默认值[]|
|proxy|代理地址，如果页面中存在跨域图片可以设置这个值|string|✗ 默认空值|
|send|发送按钮处理函数，会传回收集的数据|function|✓|
### 4.跨域图片代理
需要启动一个服务奖跨域的图片资源转成base64格式,样例在route.js中。
