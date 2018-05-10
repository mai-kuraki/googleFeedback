import React from 'react';

const funcs = {
    browserType: () => {
        let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        let isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
        let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
        let isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器
        let isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
        let isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
        let isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

        if (isIE) {
            let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            let fIEVersion = parseFloat(RegExp["$1"]);
            if (fIEVersion == 7) {
                return "IE7";
            }
            else if (fIEVersion == 8) {
                return "IE8";
            }
            else if (fIEVersion == 9) {
                return "IE9";
            }
            else if (fIEVersion == 10) {
                return "IE10";
            }
            else if (fIEVersion == 11) {
                return "IE11";
            }
            else {
                return "0"
            }//IE版本过低
        }//isIE end

        if (isFF) {
            return "FF";
        }
        if (isOpera) {
            return "Opera";
        }
        if (isSafari) {
            return "Safari";
        }
        if (isChrome) {
            return "Chrome";
        }
        if (isEdge) {
            return "Edge";
        }
    },
    support_canvas: () => {
        let elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    },
    support_video: () => {
        return !!document.createElement('video').canPlayType;
    },
    support_svg: () => {
        return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
    },
    support_audio: () => {
        return !!document.createElement('audio').canPlayType;
    },
    support_webWorker: () => {
        return !!window.Worker;
    },
    support_applicationCache: () => {
        return !!window.applicationCache;
    },
    support_css3: () => {
        let div = document.createElement('div'),
            vendors = 'Ms O Moz Webkit'.split(' '),
            len = vendors.length;

        return function (prop) {
            if (prop in div.style) return true;

            prop = prop.replace(/^[a-z]/, function (val) {
                return val.toUpperCase();
            });

            while (len--) {
                if (vendors[len] + prop in div.style) {
                    return true;
                }
            }
            return false;
        };
    },
    support_css3_3d: () => {
        let docElement = document.documentElement;
        let support = this.support_css3('perspective');
        let body = document.body;
        if (support && 'webkitPerspective' in docElement.style) {
            let style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = '@media (transform-3d),(-webkit-transform-3d){#css3_3d_test{left:9px;position:absolute;height:3px;}}';
            body.appendChild(style);
            let div = document.createElement('div');
            div.id = 'css3_3d_test';
            body.appendChild(div);
            support = div.offsetLeft === 9 && div.offsetHeight === 3;
            document.getElementById('css3_3d_test').parentNode.removeChild(document.getElementById('css3_3d_test'));
        }
        return support;
    },
    support_webSocket: () => {
        return 'WebSocket' in window || 'MozWebSocket' in window;
    },
    support_localStorage: () => {
        try {
            if ('localStorage' in window && window['localStorage'] !== null) {
                localStorage.setItem('test_str', 'test_str');
                localStorage.removeItem('test_str');
                return true;
            }
            return false;
        }
        catch (e) {
            return false;
        }
    },
    support_sessionStorage: () => {
        try {
            if ('localStorage' in window && window['sessionStorage'] !== null) {
                localStorage.setItem('test_str', 'test_str');
                localStorage.removeItem('test_str');
                return true;
            }
            return false;
        }
        catch (e) {
            return false;
        }
    },
    support_geolocation: () => {
        return 'geolocation' in navigator;
    },
    getPluginName: () => {
        let info = "";
        let plugins = navigator.plugins;
        if (plugins.length > 0) {
            for (let i = 0; i < navigator.plugins.length; i++) {
                info += navigator.plugins[i].name + ",";
            }
        }
        return info;
    },
    support_history: () => {
        return !!(window.history && history.pushState);
    },
};

export default class Window extends React.Component {
    constructor() {
        super();
        this.state = {
            device: 'pc',
            sysInfo: {
                origin: '',
                browserType: '',
                userAgent: '',
                appName: '',
                appVersion: '',
                cookieEnabled: '',
                mimeType: [],
                platform: '',
                screenWidth: '',
                screenHeight: '',
                colorDepth: '',
                onLine: '',
                support_localStorage: '',
                support_sessionStorage: '',
                support_history: '',
                support_webSocket: '',
                support_applicationCache: '',
                support_webWorker: '',
                support_canvas: '',
                support_video: '',
                support_audio: '',
                support_svg: '',
                support_css3_3d: '',
                support_geolocation: '',
                plugins: '',
                javaEnabled: '',
            },
            text: '',
            textError: '',
            shotOpen: true,
        };
        this.ctx = null;
    }

    componentWillMount() {
        this.getDevice();
        let supportCanvas = funcs.support_canvas();
        this.setState({
            supportCanvas: supportCanvas,
            openStatus: this.props.open,
        });
        if(this.props.open) {
            setTimeout(() => {
                if(!this.refs.textarea.value) {
                    this.refs.textarea.focus();
                }
            })
        }
    }

    componentDidMount() {
        this.initCanvas();
    }

    getDevice() {
        let device = 'pc';
        let ua = navigator.userAgent;
        let ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
            isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
            isAndroid = ua.match(/(Android)\s+([\d.]+)/),
            isMobile = isIphone || isAndroid;
        if(isMobile) {
            device = 'mobile';
            this.setState({
                device: device,
            })
        }
    }

    initCanvas() {
        let canvas = this.refs.canvas;
        if(!this.ctx) {
            this.ctx = canvas.getContext('2d');
        }
        let windowWidth = window.innerWidth,
            windowHeight = window.innerHeight;
        canvas.width = windowWidth;
        canvas.height = windowHeight;
        canvas.style.width = windowWidth;
        canvas.style.height = windowHeight;
        this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
        this.ctx.fillRect(0,0,windowWidth,windowHeight);
    }

    checkboxHandle() {

    }

    render() {
        return (
            <div className="feedback-window">
                <div className="dialog-mask"></div>
                <div className="dialog">
                    <div className="title" style={{background: this.props.themeColor || '#3986FF'}}>{this.props.title || '问题反馈'}</div>
                    <div className="feedback-area">
                        {
                            this.state.textError?
                                <div className="required-tip">请输入问题描述</div>:null
                        }
                        <textarea placeholder="描述你的问题或分享你的意见" ref="textarea" defaultValue={this.state.text} onChange={(e) => {
                            this.setState({
                                text: e.target.value,
                                textError: '',
                            })
                        }}></textarea>
                        <div className="shot-switch clearfix">
                            <div className="checkbox" onClick={this.checkboxHandle.bind(this)}>
                                <svg className={`checkbox-icon ${this.state.shotOpen ? '' : 'active'}`} focusable="false"
                                     aria-label="" fill="#757575" viewBox="0 0 24 24" height="24" width="24">
                                    <path
                                        d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
                                </svg>
                                <svg className={`checkbox-icon ${this.state.shotOpen ? 'active' : ''}`} focusable="false"
                                     aria-label="" fill={this.props.themeColor || '#3986FF'} viewBox="0 0 24 24" height="24"
                                     width="24">
                                    <path
                                        d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                                </svg>
                            </div>
                            <label>包含截图</label>
                        </div>
                    </div>
                </div>
                <canvas ref="canvas" id="feedbackCanvas"></canvas>
            </div>
        )
    }
}