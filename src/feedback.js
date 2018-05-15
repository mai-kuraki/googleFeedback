/**
 * Created by zhengliuyang on 2018/5/15.
 */
import html2canvas from 'html2canvas';
import $ from 'n-zepto';

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

        return (prop) => {
            if (prop in div.style) return true;

            prop = prop.replace(/^[a-z]/, (val) => {
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
        let support = funcs.support_css3('perspective');
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
const fbCrossOrigin = [];
const host = 'http://127.0.0.1:5000';
const hightLightEl = ['button', 'a', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'p',
    'i', 'strong', 'small', 'sub', 'sup', 'b', 'time', 'img',
    'caption', 'input', 'label', 'legend', 'select', 'textarea',
    'details', 'summary'];

class Feedback {
    constructor() {
        this.theme = '#3986FF';
        this.device = 'pc';
        this.sysInfo = {
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
        };
        this.text = '';
        this.textError = '';
        this.shotOpen = true;
        this.loading = true;
        this.screenshotEdit = false;
        this.editMode = false;
        this.toolBarType = 'hightlight';
        this.hightlightItem = [];
        this.blackItem = [];
        this.move = false;
        this.eX = 0;
        this.eY = 0;
        this.ctx = null;
        this.dragRect = false;
        this.startX = 0;
        this.startY = 0;
        this.init();
    }

    init() {
        this.getDevice();
        this.createRoot();
        this.render();
        this.initCanvas();
        this.addEventListener();
    }

    initCanvas() {
        let canvas = document.getElementById('feedbackCanvas');
        if (!this.ctx) {
            this.ctx = canvas.getContext('2d');
        }
        let docWidth = document.body.clientWidth,
            docHeight = document.body.clientHeight;
        canvas.width = docWidth;
        canvas.height = docHeight;
        canvas.style.width = docWidth;
        canvas.style.height = docHeight;
        this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
        this.ctx.fillRect(0, 0, docWidth, docHeight);
    }

    getDevice() {
        let device = 'pc';
        let ua = navigator.userAgent;
        let ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
            isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
            isAndroid = ua.match(/(Android)\s+([\d.]+)/),
            isMobile = isIphone || isAndroid;
        if (isMobile) {
            device = 'mobile';
            this.device = device;
        }
    }

    createRoot() {
        let docHeight = document.body.clientHeight;
        $(document.body).append(`<div id="googleFeedback" style="height: ${docHeight}px"></div>`);
    }

    addEventListener() {
        document.addEventListener('mousemove', this.documentMouseMove.bind(this));
        document.addEventListener('click', this.elementHelperClick.bind(this));
        document.getElementById('confirmButton').addEventListener('click', () => {
            console.log('send')
        })
    }

    render() {
        $('#googleFeedback').html(`
        <div class="feedback-window">
            ${!this.editMode ? '<div class="dialog-mask"></div>' : ''}
            ${!this.editMode ?
                `<div id="feedbackDialog" class="dialog" data-html2canvas-ignore="true" style="left: 50%; top: 50%">
                    <div class="title" style="background: ${this.theme}">问题反馈</div>
                        <div class="feedback-area">
                            <textarea placeholder="请说明您的问题或分享您的想法"></textarea>
                            <div class="shot-switch clearfix">
                                <div class="checkbox">
                                    <svg class="checkbox-icon ${this.shotOpen ? '' : 'active'}" focusable="false" aria-label="" fill="#757575" viewBox="0 0 24 24" height="24" width="24">
                                        <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
                                    </svg>
                                    <svg class="checkbox-icon ${this.shotOpen ? 'active' : ''}" focusable="false" aria-label="" fill="${this.theme}" viewBox="0 0 24 24"
                                             height="24" width="24">
                                        <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                                    </svg>
                                </div>
                                <label>包含截图</label>
                            </div>
                            ${this.shotOpen ?
                            `<div class="screenshot-area">
                            ${this.loading ?
                                `<div class="loading">
                                    <div class="loading-icon">
                                        <svg viewBox="0 0 40 40" style="width: 40px; height: 40px; position: relative">
                                            <circle cx="20" cy="20" r="18.25" fill="none" stroke-width="3.5" stroke-miterlimit="20" style="stroke: ${this.theme}; stroke-lnecap: round;"></circle>
                                        </svg>
                                    </div>
                                    <span class="loading-text">正在加载屏幕截图...</span>
                                </div>` : ``
                            }
                            <div class="screenshot">
                            ${this.screenshotEdit && !this.loading ?
                                `<div class="to-edit">
                                    <div class="edit-icon">
                                        <svg focusable="false" aria-label="" fill="#757575" viewBox="0 0 24 24" height="48" width="48">
                                            <path d="M21 17h-2.58l2.51 2.56c-.18.69-.73 1.26-1.41 1.44L17 18.5V21h-2v-6h6v2zM19 7h2v2h-2V7zm2-2h-2V3.08c1.1 0 2 .92 2 1.92zm-6-2h2v2h-2V3zm4 8h2v2h-2v-2zM9 21H7v-2h2v2zM5 9H3V7h2v2zm0-5.92V5H3c0-1 1-1.92 2-1.92zM5 17H3v-2h2v2zM9 5H7V3h2v2zm4 0h-2V3h2v2zm0 16h-2v-2h2v2zm-8-8H3v-2h2v2zm0 8.08C3.9 21.08 3 20 3 19h2v2.08z"></path>
                                        </svg>
                                    </div>
                                    <span class="edit-label">点击编辑高亮或隐藏信息</span>
                                </div>` : ``
                            }
                            <img id="screenshotPrev" src=""/>
                            </div>
                        </div>` : ``
                    }
                    <div class="legal">
                        如出于法律原因需要请求更改内容，请前往<a href="">法律帮助</a>页面。系统可能已将部分<a href="">帐号和系统信息</a>发送给
                        Google。我们将根据自己的<a href="">隐私权政策</a>和<a href="">服务条款</a>使用您提供的信息帮助解决技术问题和改进我们的服务。
                    </div>
                    <div class="actions">
                        <div class="flatbutton cancel" style="color: #757575">取消
                        </div>
                        <div class="flatbutton confirm"
                        id="confirmButton"
                             style="color: ${this.theme}"
                        >发送
                        </div>
                    </div>
                </div>
            </div>`:
            `<div class="tool-bar clearfix">
                <div class="move" >
                    <svg focusable="false" aria-label="Drag" fill="#BDBDBD" height="56" width="16" viewBox="-2 2 12 12">
                        <circle cx="1.5" cy="1.5" r="1.5"></circle>
                        <circle cx="1.5" cy="7.5" r="1.5"></circle>
                        <circle cx="1.5" cy="13.5" r="1.5"></circle>
                        <circle cx="6.5" cy="1.5" r="1.5"></circle>
                        <circle cx="6.5" cy="7.5" r="1.5"></circle>
                        <circle cx="6.5" cy="13.5" r="1.5"></circle>
                    </svg>
                </div>
                            <div class="tool ${(this.toolBarType == 'hightlight') ? 'tool-active' : ''} hight-light">
                            <span style="display: inline-block; position: relative; height: 36px; width: 36px">
                            <svg focusable="false" aria-label="" viewBox="0 0 24 24" height="36" width="36" fill="#FFEB3B"><path d="M3 3h18v18H3z"></path></svg>
                            <svg focusable="false" aria-label="" fill="#757575" viewBox="0 0 24 24" height="36" width="36" style="left: 0px;position: absolute;top: 0px">
                            ${
                                this.toolBarType == 'hightlight'?
                                    '<path d="M21 17h-2.58l2.51 2.56c-.18.69-.73 1.26-1.41 1.44L17 18.5V21h-2v-6h6v2zM19 7h2v2h-2V7zm2-2h-2V3.08c1.1 0 2 .92 2 1.92zm-6-2h2v2h-2V3zm4 8h2v2h-2v-2zM9 21H7v-2h2v2zM5 9H3V7h2v2zm0-5.92V5H3c0-1 1-1.92 2-1.92zM5 17H3v-2h2v2zM9 5H7V3h2v2zm4 0h-2V3h2v2zm0 16h-2v-2h2v2zm-8-8H3v-2h2v2zm0 8.08C3.9 21.08 3 20 3 19h2v2.08z"></path>':
                                    '<path d="M3 3h18v18H3z" fill="#FEEA4E"></path>'
                            }
                            </svg>
                            </span>
                            </div>
                            <div class="tool ${(this.toolBarType == 'black') ? 'tool-active' : ''} hide">
                            <span style="display: inline-block; position: relative; height: 36px; width: 36px">
                                ${
                                    this.toolBarType == 'black'?
                                    `<svg focusable="false" aria-label="" viewBox="0 0 24 24" height="36" width="36" fill="#000"><path d="M3 3h18v18H3z"></path></svg>
                                    <svg focusable="false" aria-label="" fill="#757575" viewBox="0 0 24 24" height="36" width="36" style="left: 0px;position: absolute;top: 0px">
                                    <path d="M21 17h-2.58l2.51 2.56c-.18.69-.73 1.26-1.41 1.44L17 18.5V21h-2v-6h6v2zM19 7h2v2h-2V7zm2-2h-2V3.08c1.1 0 2 .92 2 1.92zm-6-2h2v2h-2V3zm4 8h2v2h-2v-2zM9 21H7v-2h2v2zM5 9H3V7h2v2zm0-5.92V5H3c0-1 1-1.92 2-1.92zM5 17H3v-2h2v2zM9 5H7V3h2v2zm4 0h-2V3h2v2zm0 16h-2v-2h2v2zm-8-8H3v-2h2v2zm0 8.08C3.9 21.08 3 20 3 19h2v2.08z"></path></svg>`:
                                    `<svg focusable="false" aria-label="" viewBox="0 0 24 24" height="36" width="36" fill="#000"><path d="M3 3h18v18H3z"></path></svg>`
                                }
                            </span>
                            </div>
                            <div class="button"><span class="flatbutton" draggable="false">完成</span></div>
                        </div>`
            }     
            <div class="hightlight-area"></div>
            <div class="black-area"></div>
            <canvas id="feedbackCanvas"></canvas>
         </div>`);
    }

}

let feedback = new Feedback();