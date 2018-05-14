import React from 'react';
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
//允许跨域的站点;
const fbCrossOrigin = [];

const host = 'http://127.0.0.1:5000';

const hightLightEl = ['button', 'a', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'p',
    'i', 'strong', 'small', 'sub', 'sup', 'b', 'time', 'img',
    'caption', 'input', 'label', 'legend', 'select', 'textarea',
    'details', 'summary'];

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
            shotOpen: false,
            loading: false,
            screenshotEdit: false,
            editMode: true,
            toolBarType: 'hightlight',
            hightlightItem: [],
            blackItem: [],
        };
        this.move = false;
        this.eX = 0;
        this.eY = 0;
        this.ctx = null;
        this.dragRect = false;
        this.startX = 0;
        this.startY = 0;
    }

    componentWillMount() {
        this.getDevice();
        let supportCanvas = funcs.support_canvas();
        this.setState({
            supportCanvas: supportCanvas,
            openStatus: this.props.open,
        });
        if (this.props.open) {
            setTimeout(() => {
                if (!this.refs.textarea.value) {
                    this.refs.textarea.focus();
                }
            })
        }
    }

    switchCanvasVisible(visible) {
        if (visible) {
            this.ref.canvas.removeAttribute('data-html2canvas-ignore');
        } else {
            this.ref.canvas.setAttribute('data-html2canvas-ignore', 'true');
        }
    }

    inElement(e) {
        let x = e.clientX,
            y = e.clientY;
        let el = document.elementsFromPoint(x, y)[3];
        this.refs.canvas.style.cursor = 'crosshair';
        if(el && hightLightEl.indexOf(el.nodeName.toLocaleLowerCase()) > -1) {
            let rect = el.getBoundingClientRect();
            let rectInfo = {
                sx: rect.left + document.documentElement.scrollLeft,
                sy: rect.top + document.documentElement.scrollTop,
                width: rect.width,
                height: rect.height
            };
            return rectInfo;
        }else {
            return false;
        }
    }

    elementHelper(e) {
        let rectInfo = this.inElement(e);
        if(rectInfo) {
            this.refs.canvas.style.cursor = 'pointer';
            this.drawElementHelper(rectInfo);
            this.hasHelper = true;
        }else {
            if(this.hasHelper) {
                this.hasHelper = false;
            }
            this.initCanvas();
        }
        this.drawHightlight();
    }

    elementHelperClick(e) {
        if(this.dragRect) return;
        let nodeName = e.target.nodeName;
        if(nodeName != 'CANVAS') return;
        let rectInfo = this.inElement(e);
        if(rectInfo) {
            let toolBarType = this.state.toolBarType;
            if(toolBarType == 'hightlight') {
                let hightlightItem = this.state.hightlightItem;
                hightlightItem.push(rectInfo);
                this.setState({
                    hightlightItem: hightlightItem,
                })
            }else if(toolBarType == 'black') {
                let blackItem = this.state.blackItem;
                blackItem.push(rectInfo);
                this.setState({
                    blackItem: blackItem,
                })
            }

        }
    }

    drawElementHelper(info) {
        this.initCanvas();
        let toolBarType = this.state.toolBarType;
        if(toolBarType == 'hightlight') {
            this.ctx.lineWidth = '3';
            this.ctx.strokeStyle = '#FEEA4E';
            this.ctx.rect(info.sx, info.sy, info.width, info.height);
            this.ctx.stroke();
            this.ctx.clearRect(info.sx, info.sy, info.width, info.height);
        }else if(toolBarType == 'black') {
            this.ctx.fillStyle = 'rgba(0,0,0,.4)';
            this.ctx.fillRect(info.sx, info.sy, info.width, info.height);
        }
    }

    documentMouseMove(e) {
        if(this.canvasMD) {
            if(!this.dragRect) {
                this.dragRect = true;
            }
            let toolBarType = this.state.toolBarType;
            let clientX = e.clientX + document.documentElement.scrollLeft,
                clientY = e.clientY + document.documentElement.scrollTop,
                width = this.startX - clientX,
                height = this.startY - clientY;
            this.initCanvas();
            this.drawHightlight();
            if(toolBarType == 'hightlight') {
                this.ctx.lineWidth = '3';
                this.ctx.strokeStyle = '#FEEA4E';
                this.ctx.rect(clientX, clientY, width, height);
                this.ctx.stroke();
                this.ctx.clearRect(clientX, clientY, width, height);
            }else if(toolBarType == 'black') {
                this.ctx.fillStyle = 'rgba(0,0,0,.4)';
                this.ctx.fillRect(clientX, clientY, width, height);
            }

        }else {
            this.elementHelper(e);
        }
    }

    addEventListener() {
        document.addEventListener('mousemove', this.documentMouseMove.bind(this));
        document.addEventListener('click', this.elementHelperClick.bind(this));
    }

    componentDidMount() {
        this.initCanvas();
        this.addEventListener();
        this.toEditMode();
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
            this.setState({
                device: device,
            })
        }
    }

    initCanvas() {
        let canvas = this.refs.canvas;
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

    drawHightlight() {
        let hightlightItem = this.state.hightlightItem;
        hightlightItem.map((data, k) => {
            this.ctx.lineWidth = '3';
            this.ctx.strokeStyle = '#FEEA4E';
            this.ctx.rect(data.sx, data.sy, data.width, data.height);
            this.ctx.stroke();
        });
        hightlightItem.map((data, k) => {
            this.ctx.clearRect(data.sx, data.sy, data.width, data.height);
        });
    }

    loadingState(state) {
        this.setState({
            loading: state,
        })
    }

    checkboxHandle() {
        this.setState({
            shotOpen: !this.state.shotOpen,
        });
        if (!this.state.shotOpen) {
            this.shotScreen();
        }
    }

    toEditMode() {
        this.setState({
            editMode: true,
        });
        setTimeout(() => {
            let toolBar = this.refs.toolBar,
                windowWidth = window.innerWidth,
                windowHeight = window.innerHeight;
            toolBar.style.left = `${windowWidth * 0.5}px`;
            toolBar.style.top = `${windowHeight * 0.6}px`;
        });
    }

    editCancel() {
        this.setState({
            editMode: false,
        });
        setTimeout(() => {
            this.shotScreen();
        })
    }

    handleMoveMouseDown(e) {
        this.move = true;
        this.eX = e.clientX + window.scrollX;
        this.eY = e.clientY + window.scrollY;
    }

    handleMoveMouseUp(e) {
        this.move = false;
        this.canvasMD = false;
        if(this.dragRect) {
            let clientX = e.clientX + document.documentElement.scrollLeft,
                clientY = e.clientY + document.documentElement.scrollTop,
                width = this.startX - clientX,
                height = this.startY - clientY,
                toolBarType = this.state.toolBarType,
                hightlightItem = this.state.hightlightItem,
                blackItem = this.state.blackItem,
                obj = {
                    sx: clientX,
                    sy: clientY,
                    width: width,
                    height: height
                };
            if(toolBarType == 'hightlight') {
                hightlightItem.push(obj);
                this.setState({
                    hightlightItem: hightlightItem,
                });
            }else if(toolBarType == 'black') {
                if(width < 0) {
                    obj.sx = obj.sx + width;
                    obj.width = Math.abs(width);
                }
                if(height < 0) {
                    obj.sy = obj.sy + height;
                    obj.height = Math.abs(height);
                }
                blackItem.push(obj);
                this.setState({
                    blackItem: blackItem,
                })
            }
            setTimeout(() => {
                this.dragRect = false;
                console.log(this.state.blackItem)
                this.drawHightlight();
            });
        }
    }

    handleMouseMove(e) {
        if (!this.move)return;
        let toolBar = this.refs.toolBar;
        let eX = this.eX;
        let eY = this.eY;
        let newEX = e.clientX + window.scrollX;
        let newEY = e.clientY + window.scrollY;
        let oX = newEX - eX;
        let oY = newEY - eY;
        let curL = parseFloat(toolBar.style.left);
        let curT = parseFloat(toolBar.style.top);
        toolBar.style.left = `${curL + oX}px`;
        toolBar.style.top = `${curT + oY}px`;
        this.eX = newEX;
        this.eY = newEY;
    }

    isVisible(el) {
        let visible = true;
        if ($(el).css('display') == 'none') {
            visible = false;
        }
        if ($(el).css('visibility') == 'hidden') {
            visible = false;
        }
        return visible;
    }

    handleCorsImg(parent, resolve, reject) {
        let origin = location.origin;
        let pItem = [];
        let imgItem = parent.getElementsByTagName('img');
        if (imgItem.length == 0) {
            resolve();
            return;
        }
        let reg = /^(\/|\.)/;
        for (let i = 0; i < imgItem.length; i++) {
            let src = imgItem[i].src;
            pItem[i] = new Promise((resolve2, reject2) => {
                if (src && !reg.test(src) && src.indexOf(origin) == -1 && src.indexOf('data:image/png;base64,') == -1 && this.isVisible(imgItem[i])) {
                    let inList = false;
                    (fbCrossOrigin || []).map((d, k) => {
                        if (d && src.indexOf(d) > -1) {
                            inList = true;
                        }
                    });
                    if (inList) {
                        resolve2();
                    } else {
                        if (imgItem[i].getAttribute('data-feedbackBase64')) {
                            imgItem[i].setAttribute('src', imgItem[i].getAttribute('data-feedbackBase64'));
                            resolve2();
                        } else {
                            fetch(`${host}/feedbackApi/cors`, {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({url: src})
                            }).then((res) => {
                                return res.json();
                            }).then(data => {
                                if (data.code == 200) {
                                    imgItem[i].setAttribute('data-feedbackOrigin', src);
                                    imgItem[i].setAttribute('src', 'data:image/png;base64,' + data.img);
                                    resolve2();
                                } else {
                                    resolve2();
                                }
                            });
                        }
                    }
                } else {
                    resolve2();
                }
            });
        }
        if (pItem.length > 0) {
            Promise.all(pItem).then(() => {
                resolve();
            })
        } else {
            resolve();
        }
    }

    handleIframe(parent, resolve, reject) {
        let iframeItem = parent.getElementsByTagName('iframe');
        if (iframeItem.length == 0) {
            resolve();
            return;
        }
        let pItem = [];
        for (let i = 0; i < iframeItem.length; i++) {
            let iframe = iframeItem[i];
            pItem.push(new Promise((presolve, preject) => {
                let displayType = $(iframe).css('display'),
                    position = $(iframe).css('position'),
                    margin = $(iframe).css('margin'),
                    padding = $(iframe).css('padding'),
                    boxSizing = $(iframe).css('box-sizing'),
                    left = $(iframe).css('left'),
                    right = $(iframe).css('right'),
                    top = $(iframe).css('top'),
                    bottom = $(iframe).css('bottom');
                if (!displayType || displayType == 'inline') {
                    displayType = 'inline-block';
                }
                // console.log(position)
                // console.log(margin)
                // console.log(padding)
                // console.log(boxSizing)
                // console.log(left)
                // console.log(right)
                // console.log(top)
                // console.log(bottom)
                let doc;
                let isCors = false;
                try {
                    doc = iframe.contentWindow.document.body;
                } catch (error) {
                    isCors = true;
                }
                if (!isCors) {
                    let shoted = iframe.getAttribute('data-shoted');
                    if (shoted == 'yes') {
                        presolve();
                        return;
                    }
                    let imgPromise = new Promise((resolve2, reject2) => {
                        if (this.isVisible(iframe)) {
                            this.handleCorsImg(doc, resolve2, reject2);
                        } else {
                            resolve2();
                        }
                    });

                    let iframePromise = new Promise((resolve3, reject3) => {
                        if (this.isVisible(iframe)) {
                            this.handleIframe(doc, resolve3, reject3);
                        } else {
                            resolve3();
                        }
                    });
                    Promise.all([imgPromise, iframePromise]).then(() => {
                        presolve();
                    });
                } else {
                    resolve();
                }
            }))
        }
        if (pItem.length > 0) {
            Promise.all(pItem).then(() => {
                resolve();
            })
        } else {
            resolve();
        }

    }

    shotScreen() {
        if (this.state.loading)return;
        this.loadingState(true);

        let imgPromise = new Promise((resolve, reject) => {
            this.handleCorsImg(document.body, resolve, reject);
        });

        let iframePromsie = new Promise((resolve, reject) => {
            this.handleIframe(document.body, resolve, reject);
        });
        Promise.all([imgPromise, iframePromsie]).then(() => {
            html2canvas(document.body, {
                width: window.innerWidth,
                height: window.innerHeight,
                x: $(document.body).scrollLeft(),
                y: $(document.body).scrollTop(),
            }).then((canvas) => {
                let src = canvas.toDataURL('image/png');
                this.refs.screenshotPrev.src = src;
                this.refs.screenshotPrev.onload = () => {
                    this.setState({
                        screenshotEdit: true,
                    })
                };
                this.loadingState(false);
            }).catch((e) => {
                this.setState({
                    screenshotEdit: false,
                });
                this.loadingState(false);
                console.log(e)
            });
        });
    }

    clearHightlight(k, e) {
        let hightlightItem = this.state.hightlightItem;
        hightlightItem.splice(k, 1);
        this.setState({
            hightlightItem: hightlightItem,
        });
        setTimeout(() => {
            this.drawHightlight();
        });
    }

    clearBlack(k, e) {
        let blackItem = this.state.blackItem;
        blackItem.splice(k, 1);
        this.setState({
            blackItem: blackItem,
        });
    }

    canvasMouseDown(e) {
        this.canvasMD = true;
        this.startX = e.clientX + document.documentElement.scrollLeft;
        this.startY = e.clientY + document.documentElement.scrollTop;
    }

    render() {
        let state = this.state,
            props = this.props;
        return (
            <div className="feedback-window" onMouseMove={this.handleMouseMove.bind(this)}
                 onMouseUp={this.handleMoveMouseUp.bind(this)}>
                {
                    !state.editMode?
                        <div className="dialog-mask"></div>:null
                }
                {
                    !state.editMode ?
                        <div id="feedbackDialog" className="dialog" data-html2canvas-ignore="true" style={{left:'50%',top:'50%'}}>
                            <div className="title"
                                 style={{background: props.themeColor || '#3986FF'}}>{props.title || '问题反馈'}</div>
                            <div className="feedback-area">
                                {
                                    state.textError ?
                                        <div className="required-tip">请输入问题描述</div> : null
                                }
                                <textarea placeholder="请说明您的问题或分享您的想法" ref="textarea" defaultValue={state.text}
                                          onChange={(e) => {
                                              this.setState({
                                                  text: e.target.value,
                                                  textError: '',
                                              })
                                          }}></textarea>
                                <div className="shot-switch clearfix">
                                    <div className="checkbox" onClick={this.checkboxHandle.bind(this)}>
                                        <svg className={`checkbox-icon ${state.shotOpen ? '' : 'active'}`}
                                             focusable="false"
                                             aria-label="" fill="#757575" viewBox="0 0 24 24" height="24" width="24">
                                            <path
                                                d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
                                        </svg>
                                        <svg className={`checkbox-icon ${state.shotOpen ? 'active' : ''}`}
                                             focusable="false"
                                             aria-label="" fill={props.themeColor || '#3986FF'} viewBox="0 0 24 24"
                                             height="24"
                                             width="24">
                                            <path
                                                d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                                        </svg>
                                    </div>
                                    <label>包含截图</label>
                                </div>
                                <div className="screenshot-area">
                                    {
                                        state.loading ?
                                            <div className="loading">
                                                <div className="loading-icon">
                                                    <svg viewBox="0 0 40 40"
                                                         style={{width: '40px', height: '40px', position: 'relative'}}>
                                                        <circle cx="20" cy="20" r="18.25" fill="none" strokeWidth="3.5"
                                                                strokeMiterlimit="20"
                                                                style={{
                                                                    stroke: props.themeColor || 'rgb(57, 134, 255)',
                                                                    strokeLnecap: 'round'
                                                                }}></circle>
                                                    </svg>
                                                </div>
                                                <span className="loading-text">正在加载屏幕截图...</span>
                                            </div> : null
                                    }
                                    <div className="screenshot">
                                        {
                                            state.screenshotEdit ?
                                                <div className="to-edit" onClick={this.toEditMode.bind(this)}>
                                                    <div className="edit-icon">
                                                        <svg focusable="false" aria-label="" fill="#757575"
                                                             viewBox="0 0 24 24" height="48" width="48">
                                                            <path
                                                                d="M21 17h-2.58l2.51 2.56c-.18.69-.73 1.26-1.41 1.44L17 18.5V21h-2v-6h6v2zM19 7h2v2h-2V7zm2-2h-2V3.08c1.1 0 2 .92 2 1.92zm-6-2h2v2h-2V3zm4 8h2v2h-2v-2zM9 21H7v-2h2v2zM5 9H3V7h2v2zm0-5.92V5H3c0-1 1-1.92 2-1.92zM5 17H3v-2h2v2zM9 5H7V3h2v2zm4 0h-2V3h2v2zm0 16h-2v-2h2v2zm-8-8H3v-2h2v2zm0 8.08C3.9 21.08 3 20 3 19h2v2.08z"></path>
                                                        </svg>
                                                    </div>
                                                    <span className="edit-label">点击编辑高亮或隐藏信息</span>
                                                </div> : null
                                        }
                                        <img id="screenshotPrev" ref="screenshotPrev" src=""/>
                                    </div>
                                </div>
                                <div className="legal">
                                    如出于法律原因需要请求更改内容，请前往<a href="">法律帮助</a>页面。系统可能已将部分<a href="">帐号和系统信息</a>发送给
                                    Google。我们将根据自己的<a href="">隐私权政策</a>和<a href="">服务条款</a>使用您提供的信息帮助解决技术问题和改进我们的服务。
                                </div>
                                <div className="actions">
                                    <div className="flatbutton cancel" style={{color: '#757575'}} onClick={() => {
                                    }}>取消
                                    </div>
                                    <div className="flatbutton confirm"
                                         style={{color: this.props.themeColor || '#3986FF'}}
                                         onClick={() => {
                                         }}
                                    >发送
                                    </div>
                                </div>
                            </div>
                        </div> :
                        <div ref="toolBar" className="tool-bar clearfix">
                            <div className="move"
                                 onMouseDown={this.handleMoveMouseDown.bind(this)}
                            >
                                <svg focusable="false" aria-label="Drag" fill="#BDBDBD" height="56" width="16"
                                     viewBox="-2 2 12 12">
                                    <circle cx="1.5" cy="1.5" r="1.5"></circle>
                                    <circle cx="1.5" cy="7.5" r="1.5"></circle>
                                    <circle cx="1.5" cy="13.5" r="1.5"></circle>
                                    <circle cx="6.5" cy="1.5" r="1.5"></circle>
                                    <circle cx="6.5" cy="7.5" r="1.5"></circle>
                                    <circle cx="6.5" cy="13.5" r="1.5"></circle>
                                </svg>
                            </div>
                            <div
                                className={`tool ${(this.state.toolBarType == 'hightlight') ? 'tool-active' : ''} hight-light`}
                                onClick={() => {
                                    this.setState({
                                        toolBarType: 'hightlight',
                                    })
                                }}
                            ><span
                                style={{display: 'inline-block', position: 'relative', height: '36px', width: '36px'}}><svg
                                focusable="false" aria-label="" viewBox="0 0 24 24" height="36" width="36"
                                fill="#FFEB3B"><path d="M3 3h18v18H3z"></path></svg>
                                <svg focusable="false" aria-label=""
                                 fill="#757575"
                                 viewBox="0 0 24 24" height="36"
                                 width="36" style={{
                                    left: '0px',
                                    position: 'absolute',
                                    top: '0px'
                                }}>
                                    <path
                                d="M21 17h-2.58l2.51 2.56c-.18.69-.73 1.26-1.41 1.44L17 18.5V21h-2v-6h6v2zM19 7h2v2h-2V7zm2-2h-2V3.08c1.1 0 2 .92 2 1.92zm-6-2h2v2h-2V3zm4 8h2v2h-2v-2zM9 21H7v-2h2v2zM5 9H3V7h2v2zm0-5.92V5H3c0-1 1-1.92 2-1.92zM5 17H3v-2h2v2zM9 5H7V3h2v2zm4 0h-2V3h2v2zm0 16h-2v-2h2v2zm-8-8H3v-2h2v2zm0 8.08C3.9 21.08 3 20 3 19h2v2.08z"></path></svg></span>
                            </div>
                            <div className={`tool ${(this.state.toolBarType == 'black') ? 'tool-active' : ''} hide`}
                                 onClick={() => {
                                     this.setState({
                                         toolBarType: 'black',
                                     })
                                 }}
                            ><span
                                style={{display: 'inline-block', position: 'relative', height: '36px', width: '36px'}}><svg
                                focusable="false" aria-label="" viewBox="0 0 24 24" height="36" width="36" fill="#000"><path
                                d="M3 3h18v18H3z"></path></svg></span></div>
                            <div className={`tool ${(this.state.toolBarType == 'text') ? 'tool-active' : ''} text`}
                                 onClick={() => {
                                     this.setState({
                                         toolBarType: 'text',
                                     })
                                 }}
                            ><span
                                style={{display: 'inline-block', position: 'relative', height: '36px', width: '36px'}}
                                draggable="false">A</span></div>
                            <div className="button"><span className="flatbutton" draggable="false" onClick={this.editCancel.bind(this)}>DONE</span>
                            </div>
                        </div>
                }
                <div ref="hightlight" className="hightlight-area">
                    {
                        state.hightlightItem.map((data, k) => {
                            return (
                                <div key={k} className="rect" style={{width: `${data.width}px`, height: `${data.height}px`, left: `${data.sx}px`, top: `${data.sy}px`}}>
                                    <span className="close" onClick={this.clearHightlight.bind(this, k)}>
                                        <svg viewBox="0 0 1024 1024"
                                             width="16" height="16">
                                            <path d="M896 224l-96-96-288 288-288-288-96 96 288 288-288 288 96 96 288-288 288 288 96-96-288-288 288-288z"/>
                                        </svg>
                                    </span>
                                </div>
                            )
                        })
                    }
                </div>
                <div ref="black" className="black-area">
                    {
                        state.blackItem.map((data, k) => {
                            return (
                                <div key={k} className="rect" style={{width: `${data.width}px`, height: `${data.height}px`, left: `${data.sx}px`, top: `${data.sy}px`}}>
                                    <span className="close" onClick={this.clearBlack.bind(this, k)}>
                                        <svg viewBox="0 0 1024 1024"
                                             width="16" height="16">
                                            <path d="M896 224l-96-96-288 288-288-288-96 96 288 288-288 288 96 96 288-288 288 288 96-96-288-288 288-288z"/>
                                        </svg>
                                    </span>
                                </div>
                            )
                        })
                    }
                </div>
                <canvas ref="canvas" id="feedbackCanvas"
                        onMouseDown={this.canvasMouseDown.bind(this)}
                ></canvas>
            </div>
        )
    }
}