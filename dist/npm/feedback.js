'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _html2canvas = require('html2canvas');

var _html2canvas2 = _interopRequireDefault(_html2canvas);

var _nZepto = require('n-zepto');

var _nZepto2 = _interopRequireDefault(_nZepto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var funcs = {
    browserType: function browserType() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
        var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器
        var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
        var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
        var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

        if (isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if (fIEVersion == 7) {
                return "IE7";
            } else if (fIEVersion == 8) {
                return "IE8";
            } else if (fIEVersion == 9) {
                return "IE9";
            } else if (fIEVersion == 10) {
                return "IE10";
            } else if (fIEVersion == 11) {
                return "IE11";
            } else {
                return "0";
            } //IE版本过低
        } //isIE end

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
    support_canvas: function support_canvas() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    },
    support_video: function support_video() {
        return !!document.createElement('video').canPlayType;
    },
    support_svg: function support_svg() {
        return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
    },
    support_audio: function support_audio() {
        return !!document.createElement('audio').canPlayType;
    },
    support_webWorker: function support_webWorker() {
        return !!window.Worker;
    },
    support_applicationCache: function support_applicationCache() {
        return !!window.applicationCache;
    },
    support_css3: function support_css3() {
        var div = document.createElement('div'),
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
    support_css3_3d: function support_css3_3d() {
        var docElement = document.documentElement;
        var support = funcs.support_css3('perspective');
        var body = document.body;
        if (support && 'webkitPerspective' in docElement.style) {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = '@media (transform-3d),(-webkit-transform-3d){#css3_3d_test{left:9px;position:absolute;height:3px;}}';
            body.appendChild(style);
            var div = document.createElement('div');
            div.id = 'css3_3d_test';
            body.appendChild(div);
            support = div.offsetLeft === 9 && div.offsetHeight === 3;
            document.getElementById('css3_3d_test').parentNode.removeChild(document.getElementById('css3_3d_test'));
        }
        return support;
    },
    support_webSocket: function support_webSocket() {
        return 'WebSocket' in window || 'MozWebSocket' in window;
    },
    support_localStorage: function support_localStorage() {
        try {
            if ('localStorage' in window && window['localStorage'] !== null) {
                localStorage.setItem('test_str', 'test_str');
                localStorage.removeItem('test_str');
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    },
    support_sessionStorage: function support_sessionStorage() {
        try {
            if ('localStorage' in window && window['sessionStorage'] !== null) {
                localStorage.setItem('test_str', 'test_str');
                localStorage.removeItem('test_str');
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    },
    support_geolocation: function support_geolocation() {
        return 'geolocation' in navigator;
    },
    getPluginName: function getPluginName() {
        var info = "";
        var plugins = navigator.plugins;
        if (plugins.length > 0) {
            for (var i = 0; i < navigator.plugins.length; i++) {
                info += navigator.plugins[i].name + ",";
            }
        }
        return info;
    },
    support_history: function support_history() {
        return !!(window.history && history.pushState);
    }
};
var hightLightEl = ['button', 'a', 'span', 'em', 'i', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'strong', 'small', 'sub', 'sup', 'b', 'time', 'img', 'video', 'input', 'label', 'select', 'textarea', 'article', 'summary', 'section'];

var Feedback = function (_React$Component) {
    _inherits(Feedback, _React$Component);

    function Feedback() {
        _classCallCheck(this, Feedback);

        var _this = _possibleConstructorReturn(this, (Feedback.__proto__ || Object.getPrototypeOf(Feedback)).call(this));

        _this.state = {
            docWidth: document.body.clientWidth,
            docHeight: document.body.clientHeight,
            winHeight: window.innerHeight,
            device: 'pc',
            text: '',
            textError: '',
            shotOpen: true,
            loading: false,
            screenshotEdit: false,
            editMode: false,
            toolBarType: 'hightlight',
            hightlightItem: [],
            blackItem: [],
            snackbar: false,
            snackbarMsg: ''
        };
        _this.sysInfo = {
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
            javaEnabled: ''
        };
        _this.move = false;
        _this.eX = 0;
        _this.eY = 0;
        _this.ctx = null;
        _this.dragRect = false;
        _this.startX = 0;
        _this.startY = 0;
        _this.documentMouseMove = _this.documentMouseMove.bind(_this);
        _this.elementHelperClick = _this.elementHelperClick.bind(_this);
        _this.windowResize = _this.windowResize.bind(_this);
        return _this;
    }

    _createClass(Feedback, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _this2 = this;

            this.getDevice();
            this.setState({
                openStatus: this.props.open
            });
            if (this.props.open) {
                setTimeout(function () {
                    if (!_this2.refs.textarea.value) {
                        _this2.refs.textarea.focus();
                    }
                });
            }
        }
    }, {
        key: 'getSysInfo',
        value: function getSysInfo() {
            var sysInfo = this.sysInfo;
            sysInfo.origin = window.location.href;
            sysInfo.browserType = funcs.browserType();
            sysInfo.userAgent = navigator.userAgent;
            sysInfo.appName = navigator.appName;
            sysInfo.appVersion = navigator.appVersion;
            sysInfo.cookieEnabled = navigator.cookieEnabled;
            sysInfo.mimeType = navigator.mimeTypes;
            sysInfo.platform = navigator.platform;
            sysInfo.screenWidth = screen.width;
            sysInfo.screenHeight = screen.height;
            sysInfo.colorDepth = screen.colorDepth;
            sysInfo.onLine = navigator.onLine;
            sysInfo.support_localStorage = funcs.support_localStorage();
            sysInfo.support_sessionStorage = funcs.support_sessionStorage();
            sysInfo.support_history = funcs.support_history();
            sysInfo.support_webSocket = funcs.support_webSocket();
            sysInfo.support_applicationCache = funcs.support_applicationCache();
            sysInfo.support_webWorker = funcs.support_webWorker();
            sysInfo.support_canvas = funcs.support_canvas();
            sysInfo.support_video = funcs.support_video();
            sysInfo.support_audio = funcs.support_audio();
            sysInfo.support_svg = funcs.support_svg();
            sysInfo.support_css3_3d = funcs.support_css3_3d();
            sysInfo.support_geolocation = funcs.support_geolocation();
            sysInfo.plugins = funcs.getPluginName();
            sysInfo.javaEnabled = navigator.javaEnabled();
            this.sysInfo = sysInfo;
        }
    }, {
        key: 'switchCanvasVisible',
        value: function switchCanvasVisible(visible) {
            if (visible) {
                this.refs.shadowCanvas.removeAttribute('data-html2canvas-ignore');
            } else {
                this.refs.shadowCanvas.setAttribute('data-html2canvas-ignore', 'true');
            }
        }
    }, {
        key: 'inElement',
        value: function inElement(e) {
            var x = e.clientX,
                y = e.clientY;
            var el = document.elementsFromPoint(x, y)[3];
            this.refs.canvas.style.cursor = 'crosshair';
            if (el && hightLightEl.indexOf(el.nodeName.toLocaleLowerCase()) > -1) {
                var rect = el.getBoundingClientRect();
                var rectInfo = {
                    sx: rect.left + (document.documentElement.scrollLeft + document.body.scrollLeft),
                    sy: rect.top + (document.documentElement.scrollTop + document.body.scrollTop),
                    width: rect.width,
                    height: rect.height
                };
                return rectInfo;
            } else {
                return false;
            }
        }
    }, {
        key: 'elementHelper',
        value: function elementHelper(e) {
            var rectInfo = this.inElement(e);
            if (rectInfo) {
                this.refs.canvas.style.cursor = 'pointer';
                this.drawElementHelper(rectInfo);
                this.hasHelper = true;
            } else {
                if (this.hasHelper) {
                    this.hasHelper = false;
                    this.initCanvas();
                    this.drawHightlightBorder();
                    this.drawHightlightArea();
                }
            }
        }
    }, {
        key: 'elementHelperClick',
        value: function elementHelperClick(e) {
            if (this.dragRect) return;
            var nodeName = e.target.nodeName;
            if (nodeName != 'CANVAS') return;
            var rectInfo = this.inElement(e);
            if (rectInfo) {
                var toolBarType = this.state.toolBarType;
                if (toolBarType == 'hightlight') {
                    var hightlightItem = this.state.hightlightItem;
                    hightlightItem.push(rectInfo);
                    this.setState({
                        hightlightItem: hightlightItem
                    });
                } else if (toolBarType == 'black') {
                    var blackItem = this.state.blackItem;
                    blackItem.push(rectInfo);
                    this.setState({
                        blackItem: blackItem
                    });
                }
            }
        }
    }, {
        key: 'drawElementHelper',
        value: function drawElementHelper(info) {
            this.initCanvas();
            var toolBarType = this.state.toolBarType;
            if (toolBarType == 'hightlight') {
                this.ctx.lineWidth = '5';
                this.ctx.strokeStyle = '#FEEA4E';
                this.ctx.rect(info.sx, info.sy, info.width, info.height);
                this.ctx.stroke();
                this.drawHightlightBorder();
                this.drawHightlightArea();
                this.ctx.clearRect(info.sx, info.sy, info.width, info.height);
                this.sctx.clearRect(info.sx, info.sy, info.width, info.height);
            } else if (toolBarType == 'black') {
                this.drawHightlightBorder();
                this.drawHightlightArea();
                this.ctx.fillStyle = 'rgba(0,0,0,.4)';
                this.ctx.fillRect(info.sx, info.sy, info.width, info.height);
            }
        }
    }, {
        key: 'documentMouseMove',
        value: function documentMouseMove(e) {
            if (this.canvasMD) {
                if (!this.dragRect) {
                    this.dragRect = true;
                }
                var toolBarType = this.state.toolBarType;
                var clientX = e.clientX + (document.documentElement.scrollLeft + document.body.scrollLeft),
                    clientY = e.clientY + (document.documentElement.scrollTop + document.body.scrollTop),
                    width = this.startX - clientX,
                    height = this.startY - clientY;
                this.initCanvas();
                this.drawHightlightBorder();
                if (toolBarType == 'hightlight') {
                    this.ctx.lineWidth = '5';
                    this.ctx.strokeStyle = '#FEEA4E';
                    this.ctx.rect(clientX, clientY, width, height);
                    this.ctx.stroke();
                    this.drawHightlightArea();
                    this.ctx.clearRect(clientX, clientY, width, height);
                    this.sctx.clearRect(clientX, clientY, width, height);
                } else if (toolBarType == 'black') {
                    this.drawHightlightArea();
                    this.ctx.fillStyle = 'rgba(0,0,0,.4)';
                    this.ctx.fillRect(clientX, clientY, width, height);
                }
            } else {
                this.elementHelper(e);
            }
        }
    }, {
        key: 'windowResize',
        value: function windowResize() {
            this.calcHeight();
        }
    }, {
        key: 'addEventListener',
        value: function addEventListener() {
            document.addEventListener('mousemove', this.documentMouseMove, false);
            document.addEventListener('click', this.elementHelperClick, false);
            window.addEventListener('resize', this.windowResize, false);
        }
    }, {
        key: 'removeEventListener',
        value: function removeEventListener() {
            document.removeEventListener('mousemove', this.documentMouseMove, false);
            document.removeEventListener('click', this.elementHelperClick, false);
            window.removeEventListener('resize', this.windowResize, false);
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.calcHeight();
            this.addEventListener();
            if (this.state.shotOpen) {
                this.shotScreen();
            }
        }
    }, {
        key: 'calcHeight',
        value: function calcHeight() {
            var _this3 = this;

            var docWidth = document.body.clientWidth,
                docHeight = document.body.clientHeight;
            var windowHeight = window.innerHeight;
            if (docHeight < windowHeight) {
                docHeight = windowHeight;
            }
            this.setState({
                docWidth: docWidth,
                docHeight: docHeight,
                winHeight: windowHeight
            });
            setTimeout(function () {
                _this3.initCanvas(true);
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.removeEventListener();
        }
    }, {
        key: 'getDevice',
        value: function getDevice() {
            var device = 'pc';
            var ua = navigator.userAgent;
            var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
                isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
                isAndroid = ua.match(/(Android)\s+([\d.]+)/),
                isMobile = isIphone || isAndroid;
            if (isMobile) {
                device = 'mobile';
                this.setState({
                    device: device
                });
            }
        }
    }, {
        key: 'initCanvas',
        value: function initCanvas(init) {
            var canvas = this.refs.canvas;
            var shadowCanvas = this.refs.shadowCanvas;
            var docWidth = this.state.docWidth,
                docHeight = this.state.docHeight;
            if (!this.ctx) {
                this.ctx = canvas.getContext('2d');
            }
            if (!this.sctx) {
                this.sctx = shadowCanvas.getContext('2d');
            }
            if (init) {
                canvas.style.width = docWidth;
                canvas.style.height = docHeight;
                shadowCanvas.style.width = docWidth;
                shadowCanvas.style.height = docHeight;
            }
            canvas.width = docWidth;
            canvas.height = docHeight;
            shadowCanvas.width = docWidth;
            shadowCanvas.height = docHeight;
            this.sctx.fillStyle = 'rgba(0,0,0,0.38)';
            this.sctx.fillRect(0, 0, docWidth, docHeight);
        }
    }, {
        key: 'drawHightlightBorder',
        value: function drawHightlightBorder() {
            var _this4 = this;

            var hightlightItem = this.state.hightlightItem;
            hightlightItem.map(function (data, k) {
                _this4.ctx.lineWidth = '5';
                _this4.ctx.strokeStyle = '#FEEA4E';
                _this4.ctx.rect(data.sx, data.sy, data.width, data.height);
                _this4.ctx.stroke();
            });
        }
    }, {
        key: 'drawHightlightArea',
        value: function drawHightlightArea() {
            var _this5 = this;

            var hightlightItem = this.state.hightlightItem;
            hightlightItem.map(function (data, k) {
                _this5.sctx.clearRect(data.sx, data.sy, data.width, data.height);
                _this5.ctx.clearRect(data.sx, data.sy, data.width, data.height);
            });
        }
    }, {
        key: 'loadingState',
        value: function loadingState(state) {
            this.setState({
                loading: state
            });
        }
    }, {
        key: 'checkboxHandle',
        value: function checkboxHandle() {
            this.setState({
                shotOpen: !this.state.shotOpen
            });
            if (!this.state.shotOpen) {
                this.shotScreen();
            }
        }
    }, {
        key: 'toEditMode',
        value: function toEditMode() {
            var _this6 = this;

            this.setState({
                editMode: true
            });
            setTimeout(function () {
                var toolBar = _this6.refs.toolBar,
                    windowWidth = window.innerWidth,
                    windowHeight = window.innerHeight;
                toolBar.style.left = windowWidth * 0.5 + 'px';
                toolBar.style.top = windowHeight * 0.6 + 'px';
            });
        }
    }, {
        key: 'editCancel',
        value: function editCancel() {
            var _this7 = this;

            this.setState({
                editMode: false
            });
            setTimeout(function () {
                _this7.shotScreen();
            });
        }
    }, {
        key: 'handleMoveMouseDown',
        value: function handleMoveMouseDown(e) {
            this.move = true;
            this.eX = e.clientX + window.scrollX;
            this.eY = e.clientY + window.scrollY;
        }
    }, {
        key: 'handleMoveMouseUp',
        value: function handleMoveMouseUp(e) {
            var _this8 = this;

            this.move = false;
            this.canvasMD = false;
            if (this.dragRect) {
                var clientX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft),
                    clientY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop),
                    width = this.startX - clientX,
                    height = this.startY - clientY;
                if (Math.abs(width) < 6 || Math.abs(height) < 6) {
                    return;
                }
                var toolBarType = this.state.toolBarType,
                    hightlightItem = this.state.hightlightItem,
                    blackItem = this.state.blackItem,
                    obj = {
                    sx: clientX,
                    sy: clientY,
                    width: width,
                    height: height
                };
                if (width < 0) {
                    obj.sx = obj.sx + width;
                    obj.width = Math.abs(width);
                }
                if (height < 0) {
                    obj.sy = obj.sy + height;
                    obj.height = Math.abs(height);
                }
                if (toolBarType == 'hightlight') {
                    hightlightItem.push(obj);
                    this.setState({
                        hightlightItem: hightlightItem
                    });
                } else if (toolBarType == 'black') {
                    blackItem.push(obj);
                    this.setState({
                        blackItem: blackItem
                    });
                }
                setTimeout(function () {
                    _this8.dragRect = false;
                    _this8.drawHightlightBorder();
                    _this8.drawHightlightArea();
                });
            }
        }
    }, {
        key: 'handleMouseMove',
        value: function handleMouseMove(e) {
            if (!this.move) return;
            var toolBar = this.refs.toolBar;
            var eX = this.eX;
            var eY = this.eY;
            var newEX = e.clientX + window.scrollX;
            var newEY = e.clientY + window.scrollY;
            var oX = newEX - eX;
            var oY = newEY - eY;
            var curL = parseFloat(toolBar.style.left);
            var curT = parseFloat(toolBar.style.top);
            toolBar.style.left = curL + oX + 'px';
            toolBar.style.top = curT + oY + 'px';
            this.eX = newEX;
            this.eY = newEY;
        }
    }, {
        key: 'handleVideo',
        value: function handleVideo(parent, resolve, reject) {
            var videoItem = parent.getElementsByTagName('video');
            if (videoItem == 0) {
                resolve();
                return;
            }
            for (var i = 0; i < videoItem.length; i++) {
                var video = videoItem[0];
                if (!video.style.backgroundImage) {
                    var w = (0, _nZepto2.default)(video).width();
                    var h = (0, _nZepto2.default)(video).height();
                    (0, _nZepto2.default)(video).after('<canvas width="' + w + '" height="' + h + '"></canvas>');
                    var canvas = (0, _nZepto2.default)(video).next('canvas').css({ display: 'none' });
                    var ctx = canvas.get(0).getContext('2d');
                    ctx.drawImage(video, 0, 0, w, h);
                    try {
                        video.style.backgroundImage = "url(" + canvas.get(0).toDataURL('image/png') + ")";
                    } catch (e) {
                        console.log(e);
                    } finally {
                        canvas.remove();
                    }
                }
            }
            resolve();
        }
    }, {
        key: 'shotScreen',
        value: function shotScreen() {
            var _this9 = this;

            if (this.state.loading) return;
            this.loadingState(true);
            var hightlightItem = this.state.hightlightItem;
            this.switchCanvasVisible(hightlightItem.length > 0);
            var videoPromise = new Promise(function (resolve, reject) {
                _this9.handleVideo(document.body, resolve, reject);
            });
            Promise.all([videoPromise]).then(function () {
                (0, _html2canvas2.default)(document.body, {
                    proxy: _this9.props.proxy || '',
                    width: window.innerWidth,
                    height: window.innerHeight,
                    x: document.documentElement.scrollLeft || document.body.scrollLeft,
                    y: document.documentElement.scrollTop || document.body.scrollTop
                }).then(function (canvas) {
                    var src = canvas.toDataURL('image/png');
                    _this9.refs.screenshotPrev.src = src;
                    _this9.refs.screenshotPrev.onload = function () {
                        _this9.setState({
                            screenshotEdit: true
                        });
                    };
                    _this9.loadingState(false);
                }).catch(function (e) {
                    _this9.setState({
                        screenshotEdit: false
                    });
                    _this9.loadingState(false);
                    console.log(e);
                });
            });
        }
    }, {
        key: 'clearHightlight',
        value: function clearHightlight(k, e) {
            var _this10 = this;

            var hightlightItem = this.state.hightlightItem;
            hightlightItem.splice(k, 1);
            this.setState({
                hightlightItem: hightlightItem
            });
            setTimeout(function () {
                _this10.initCanvas();
                _this10.drawHightlightBorder();
                _this10.drawHightlightArea();
            });
        }
    }, {
        key: 'clearBlack',
        value: function clearBlack(k, e) {
            var blackItem = this.state.blackItem;
            blackItem.splice(k, 1);
            this.setState({
                blackItem: blackItem
            });
        }
    }, {
        key: 'canvasMouseDown',
        value: function canvasMouseDown(e) {
            this.canvasMD = true;
            this.startX = e.clientX + (document.documentElement.scrollLeft + document.body.scrollLeft);
            this.startY = e.clientY + (document.documentElement.scrollTop + document.body.scrollTop);
        }
    }, {
        key: 'snackbar',
        value: function snackbar(msg) {
            var _this11 = this;

            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.setState({
                snackbar: true,
                snackbarMsg: msg || ''
            });
            this.timer = setTimeout(function () {
                _this11.setState({
                    snackbar: false,
                    snackbarMsg: ''
                });
            }, 1500);
        }
    }, {
        key: 'send',
        value: function send() {
            if (this.state.loading) {
                this.snackbar(this.props.loadingTip || '正在加载屏幕截图...');
                return;
            }
            var text = this.state.text;
            if (!text) {
                this.setState({
                    textError: this.props.requiredTip || '必须添加说明'
                });
                this.refs.textarea.focus();
                return;
            }
            this.getSysInfo();
            if (typeof this.props.send === 'function') {
                var data = {
                    sysInfo: this.sysInfo,
                    text: this.state.text
                };
                if (this.state.shotOpen) {
                    data.shot = this.refs.screenshotPrev.src || '';
                }
                this.props.send(data);
                this.cancel();
            }
        }
    }, {
        key: 'cancel',
        value: function cancel() {
            this.props.cancel();
        }
    }, {
        key: 'render',
        value: function render() {
            var _this12 = this;

            var state = this.state,
                props = this.props;
            return _react2.default.createElement(
                'div',
                { id: 'googleFeedback', style: { height: state.docHeight + 'px' }, onMouseMove: this.handleMouseMove.bind(this),
                    onMouseUp: this.handleMoveMouseUp.bind(this) },
                state.device == 'pc' ? _react2.default.createElement(
                    'div',
                    { className: 'feedback-window' },
                    !state.editMode ? _react2.default.createElement('div', { className: 'dialog-mask' }) : null,
                    !state.editMode ? _react2.default.createElement(
                        'div',
                        { id: 'feedbackDialog', className: 'dialog', 'data-html2canvas-ignore': 'true',
                            style: { left: '50%', top: '50%' } },
                        _react2.default.createElement(
                            'div',
                            { className: 'title',
                                style: { background: props.theme || '#3986FF' } },
                            props.title || '问题反馈'
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'feedback-area' },
                            state.textError ? _react2.default.createElement(
                                'div',
                                { className: 'required-tip' },
                                state.textError
                            ) : null,
                            _react2.default.createElement('textarea', { placeholder: props.placeholder || '请说明您的问题或分享您的想法', ref: 'textarea', defaultValue: state.text,
                                onChange: function onChange(e) {
                                    _this12.setState({
                                        text: e.target.value,
                                        textError: ''
                                    });
                                } }),
                            _react2.default.createElement(
                                'div',
                                { className: 'shot-switch clearfix' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'checkbox', onClick: this.checkboxHandle.bind(this) },
                                    _react2.default.createElement(
                                        'svg',
                                        { className: 'checkbox-icon ' + (state.shotOpen ? '' : 'active'),
                                            focusable: 'false',
                                            'aria-label': '', fill: '#757575', viewBox: '0 0 24 24', height: '24',
                                            width: '24' },
                                        _react2.default.createElement('path', {
                                            d: 'M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z' })
                                    ),
                                    _react2.default.createElement(
                                        'svg',
                                        { className: 'checkbox-icon ' + (state.shotOpen ? 'active' : ''),
                                            focusable: 'false',
                                            'aria-label': '', fill: props.theme || '#3986FF', viewBox: '0 0 24 24',
                                            height: '24',
                                            width: '24' },
                                        _react2.default.createElement('path', {
                                            d: 'M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' })
                                    )
                                ),
                                _react2.default.createElement(
                                    'label',
                                    null,
                                    props.checkboxLabel || '包含截图'
                                )
                            ),
                            state.shotOpen ? _react2.default.createElement(
                                'div',
                                { className: 'screenshot-area' },
                                state.loading ? _react2.default.createElement(
                                    'div',
                                    { className: 'loading' },
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'loading-icon' },
                                        _react2.default.createElement(
                                            'svg',
                                            { viewBox: '0 0 40 40',
                                                style: {
                                                    width: '40px',
                                                    height: '40px',
                                                    position: 'relative'
                                                } },
                                            _react2.default.createElement('circle', { cx: '20', cy: '20', r: '18.25', fill: 'none',
                                                strokeWidth: '3.5',
                                                strokeMiterlimit: '20',
                                                style: {
                                                    stroke: props.theme || 'rgb(57, 134, 255)',
                                                    strokeLnecap: 'round'
                                                } })
                                        )
                                    ),
                                    _react2.default.createElement(
                                        'span',
                                        { className: 'loading-text' },
                                        this.props.loadingTip || '正在加载屏幕截图...'
                                    )
                                ) : null,
                                _react2.default.createElement(
                                    'div',
                                    { className: 'screenshot' },
                                    state.screenshotEdit && !state.loading ? _react2.default.createElement(
                                        'div',
                                        { className: 'to-edit',
                                            onClick: this.toEditMode.bind(this) },
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'edit-icon' },
                                            _react2.default.createElement(
                                                'svg',
                                                { focusable: 'false', 'aria-label': '', fill: '#757575',
                                                    viewBox: '0 0 24 24', height: '48', width: '48' },
                                                _react2.default.createElement('path', {
                                                    d: 'M21 17h-2.58l2.51 2.56c-.18.69-.73 1.26-1.41 1.44L17 18.5V21h-2v-6h6v2zM19 7h2v2h-2V7zm2-2h-2V3.08c1.1 0 2 .92 2 1.92zm-6-2h2v2h-2V3zm4 8h2v2h-2v-2zM9 21H7v-2h2v2zM5 9H3V7h2v2zm0-5.92V5H3c0-1 1-1.92 2-1.92zM5 17H3v-2h2v2zM9 5H7V3h2v2zm4 0h-2V3h2v2zm0 16h-2v-2h2v2zm-8-8H3v-2h2v2zm0 8.08C3.9 21.08 3 20 3 19h2v2.08z' })
                                            )
                                        ),
                                        _react2.default.createElement(
                                            'span',
                                            { className: 'edit-label' },
                                            props.editTip || '点击编辑高亮或隐藏信息'
                                        )
                                    ) : null,
                                    _react2.default.createElement('img', { id: 'screenshotPrev', ref: 'screenshotPrev', src: '' })
                                )
                            ) : null,
                            _react2.default.createElement('div', { className: 'legal', dangerouslySetInnerHTML: { __html: this.props.license || '\u5982\u51FA\u4E8E\u6CD5\u5F8B\u539F\u56E0\u9700\u8981\u8BF7\u6C42\u66F4\u6539\u5185\u5BB9\uFF0C\u8BF7\u524D\u5F80<a href="" style="color: ' + (props.theme || '#3986FF') + '">\u6CD5\u5F8B\u5E2E\u52A9</a>\u9875\u9762\u3002\u7CFB\u7EDF\u53EF\u80FD\u5DF2\u5C06\u90E8\u5206<a href="" style="color: ' + (props.theme || '#3986FF') + '">\u5E10\u53F7\u548C\u7CFB\u7EDF\u4FE1\u606F</a>\u53D1\u9001\u7ED9\n                                        Google\u3002\u6211\u4EEC\u5C06\u6839\u636E\u81EA\u5DF1\u7684<a href="" style="color: ' + (props.theme || '#3986FF') + '">\u9690\u79C1\u6743\u653F\u7B56</a>\u548C<a href="" style="color: ' + (props.theme || '#3986FF') + '">\u670D\u52A1\u6761\u6B3E</a>\u4F7F\u7528\u60A8\u63D0\u4F9B\u7684\u4FE1\u606F\u5E2E\u52A9\u89E3\u51B3\u6280\u672F\u95EE\u9898\u548C\u6539\u8FDB\u6211\u4EEC\u7684\u670D\u52A1\u3002' } }),
                            _react2.default.createElement(
                                'div',
                                { className: 'actions' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'flatbutton cancel', style: { color: '#757575' }, onClick: this.cancel.bind(this) },
                                    props.cancelLabel || '取消'
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'flatbutton confirm',
                                        style: { color: this.props.theme || '#3986FF' },
                                        onClick: this.send.bind(this)
                                    },
                                    props.confirmLabel || '发送'
                                )
                            )
                        )
                    ) : _react2.default.createElement(
                        'div',
                        { ref: 'toolBar', className: 'tool-bar clearfix' },
                        _react2.default.createElement(
                            'div',
                            { className: 'move',
                                onMouseDown: this.handleMoveMouseDown.bind(this)
                            },
                            _react2.default.createElement(
                                'svg',
                                { focusable: 'false', 'aria-label': 'Drag', fill: '#BDBDBD', height: '56', width: '16',
                                    viewBox: '-2 2 12 12' },
                                _react2.default.createElement('circle', { cx: '1.5', cy: '1.5', r: '1.5' }),
                                _react2.default.createElement('circle', { cx: '1.5', cy: '7.5', r: '1.5' }),
                                _react2.default.createElement('circle', { cx: '1.5', cy: '13.5', r: '1.5' }),
                                _react2.default.createElement('circle', { cx: '6.5', cy: '1.5', r: '1.5' }),
                                _react2.default.createElement('circle', { cx: '6.5', cy: '7.5', r: '1.5' }),
                                _react2.default.createElement('circle', { cx: '6.5', cy: '13.5', r: '1.5' })
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            {
                                className: 'tool ' + (this.state.toolBarType == 'hightlight' ? 'tool-active' : '') + ' hight-light',
                                'data-label': props.hightlightTip || '突显问题',
                                onClick: function onClick() {
                                    _this12.setState({
                                        toolBarType: 'hightlight'
                                    });
                                }
                            },
                            _react2.default.createElement(
                                'span',
                                {
                                    style: {
                                        display: 'inline-block',
                                        position: 'relative',
                                        height: '36px',
                                        width: '36px'
                                    } },
                                _react2.default.createElement(
                                    'svg',
                                    {
                                        focusable: 'false', 'aria-label': '', viewBox: '0 0 24 24', height: '36', width: '36',
                                        fill: '#FFEB3B' },
                                    _react2.default.createElement('path', { d: 'M3 3h18v18H3z' })
                                ),
                                _react2.default.createElement(
                                    'svg',
                                    { focusable: 'false', 'aria-label': '',
                                        fill: '#757575',
                                        viewBox: '0 0 24 24', height: '36',
                                        width: '36', style: {
                                            left: '0px',
                                            position: 'absolute',
                                            top: '0px'
                                        } },
                                    this.state.toolBarType == 'hightlight' ? _react2.default.createElement('path', {
                                        d: 'M21 17h-2.58l2.51 2.56c-.18.69-.73 1.26-1.41 1.44L17 18.5V21h-2v-6h6v2zM19 7h2v2h-2V7zm2-2h-2V3.08c1.1 0 2 .92 2 1.92zm-6-2h2v2h-2V3zm4 8h2v2h-2v-2zM9 21H7v-2h2v2zM5 9H3V7h2v2zm0-5.92V5H3c0-1 1-1.92 2-1.92zM5 17H3v-2h2v2zM9 5H7V3h2v2zm4 0h-2V3h2v2zm0 16h-2v-2h2v2zm-8-8H3v-2h2v2zm0 8.08C3.9 21.08 3 20 3 19h2v2.08z' }) : _react2.default.createElement('path', {
                                        d: 'M3 3h18v18H3z', fill: '#FEEA4E' })
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'tool ' + (this.state.toolBarType == 'black' ? 'tool-active' : '') + ' hide',
                                'data-label': props.hideTip || '隐藏敏感信息',
                                onClick: function onClick() {
                                    _this12.setState({
                                        toolBarType: 'black'
                                    });
                                }
                            },
                            _react2.default.createElement(
                                'span',
                                {
                                    style: {
                                        display: 'inline-block',
                                        position: 'relative',
                                        height: '36px',
                                        width: '36px'
                                    } },
                                this.state.toolBarType == 'black' ? _react2.default.createElement(
                                    _react2.default.Fragment,
                                    null,
                                    _react2.default.createElement(
                                        'svg',
                                        { focusable: 'false', 'aria-label': '', viewBox: '0 0 24 24', height: '36',
                                            width: '36', fill: '#000' },
                                        _react2.default.createElement('path', { d: 'M3 3h18v18H3z' })
                                    ),
                                    _react2.default.createElement(
                                        'svg',
                                        { focusable: 'false', 'aria-label': '', fill: '#757575', viewBox: '0 0 24 24',
                                            height: '36', width: '36', style: {
                                                left: '0px',
                                                position: 'absolute',
                                                top: '0px'
                                            } },
                                        _react2.default.createElement('path', {
                                            d: 'M21 17h-2.58l2.51 2.56c-.18.69-.73 1.26-1.41 1.44L17 18.5V21h-2v-6h6v2zM19 7h2v2h-2V7zm2-2h-2V3.08c1.1 0 2 .92 2 1.92zm-6-2h2v2h-2V3zm4 8h2v2h-2v-2zM9 21H7v-2h2v2zM5 9H3V7h2v2zm0-5.92V5H3c0-1 1-1.92 2-1.92zM5 17H3v-2h2v2zM9 5H7V3h2v2zm4 0h-2V3h2v2zm0 16h-2v-2h2v2zm-8-8H3v-2h2v2zm0 8.08C3.9 21.08 3 20 3 19h2v2.08z' })
                                    )
                                ) : _react2.default.createElement(
                                    'svg',
                                    {
                                        focusable: 'false', 'aria-label': '', viewBox: '0 0 24 24', height: '36', width: '36',
                                        fill: '#000' },
                                    _react2.default.createElement('path', {
                                        d: 'M3 3h18v18H3z' })
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'button' },
                            _react2.default.createElement(
                                'span',
                                { className: 'flatbutton', draggable: 'false',
                                    onClick: this.editCancel.bind(this) },
                                props.editDoneLabel || '完成'
                            )
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { ref: 'hightlight', className: 'hightlight-area' },
                        state.hightlightItem.map(function (data, k) {
                            return _react2.default.createElement(
                                'div',
                                { key: k, className: 'rect', style: {
                                        width: data.width + 'px',
                                        height: data.height + 'px',
                                        left: data.sx + 'px',
                                        top: data.sy + 'px'
                                    } },
                                _react2.default.createElement(
                                    'span',
                                    { className: 'close', onClick: _this12.clearHightlight.bind(_this12, k) },
                                    _react2.default.createElement(
                                        'svg',
                                        { viewBox: '0 0 1024 1024',
                                            width: '16', height: '16' },
                                        _react2.default.createElement('path', {
                                            d: 'M896 224l-96-96-288 288-288-288-96 96 288 288-288 288 96 96 288-288 288 288 96-96-288-288 288-288z' })
                                    )
                                )
                            );
                        })
                    ),
                    _react2.default.createElement(
                        'div',
                        { ref: 'black', className: 'black-area' },
                        state.blackItem.map(function (data, k) {
                            return _react2.default.createElement(
                                'div',
                                { key: k, className: 'rect', style: {
                                        width: data.width + 'px',
                                        height: data.height + 'px',
                                        left: data.sx + 'px',
                                        top: data.sy + 'px'
                                    } },
                                _react2.default.createElement(
                                    'span',
                                    { className: 'close', onClick: _this12.clearBlack.bind(_this12, k) },
                                    _react2.default.createElement(
                                        'svg',
                                        { viewBox: '0 0 1024 1024',
                                            width: '16', height: '16' },
                                        _react2.default.createElement('path', {
                                            d: 'M896 224l-96-96-288 288-288-288-96 96 288 288-288 288 96 96 288-288 288 288 96-96-288-288 288-288z' })
                                    )
                                )
                            );
                        })
                    )
                ) : _react2.default.createElement(
                    'div',
                    { className: 'mobile-feedBack-window', 'data-html2canvas-ignore': 'true', style: { height: state.winHeight + 'px' } },
                    _react2.default.createElement(
                        'div',
                        { className: 'header' },
                        _react2.default.createElement(
                            'div',
                            { className: 'left' },
                            _react2.default.createElement(
                                'span',
                                { className: 'close btn', onClick: this.cancel.bind(this) },
                                _react2.default.createElement(
                                    'svg',
                                    { focusable: 'false', 'aria-label': 'CANCEL', fill: 'white', viewBox: '0 0 24 24', height: '24', width: '24' },
                                    _react2.default.createElement('path', { d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' })
                                )
                            ),
                            _react2.default.createElement(
                                'label',
                                null,
                                props.title || '发送反馈'
                            )
                        ),
                        _react2.default.createElement(
                            'span',
                            { className: 'send btn', onClick: this.send.bind(this) },
                            _react2.default.createElement(
                                'svg',
                                { focusable: 'false', 'aria-label': 'SEND', fill: 'white', viewBox: '0 0 24 24', height: '24', width: '24' },
                                _react2.default.createElement('path', { d: 'M2.01 21L23 12 2.01 3 2 10l15 2-15 2z' })
                            )
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'main' },
                        _react2.default.createElement(
                            'div',
                            { className: 'feedback-area' },
                            state.textError ? _react2.default.createElement(
                                'div',
                                { className: 'required-tip' },
                                state.textError
                            ) : null,
                            _react2.default.createElement('textarea', { placeholder: props.placeholder || '请说明您的问题或分享您的想法', ref: 'textarea', defaultValue: state.text, onChange: function onChange(e) {
                                    _this12.setState({
                                        text: e.target.value,
                                        textError: ''
                                    });
                                } })
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'screenshot' },
                            _react2.default.createElement(
                                'div',
                                { className: 'shot-switch clearfix' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'checkbox', onClick: this.checkboxHandle.bind(this) },
                                    _react2.default.createElement(
                                        'svg',
                                        { className: 'checkbox-icon ' + (state.shotOpen ? '' : 'active'), focusable: 'false',
                                            'aria-label': '', fill: '#757575', viewBox: '0 0 24 24', height: '24', width: '24' },
                                        _react2.default.createElement('path', {
                                            d: 'M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z' })
                                    ),
                                    _react2.default.createElement(
                                        'svg',
                                        { className: 'checkbox-icon ' + (state.shotOpen ? 'active' : ''), focusable: 'false',
                                            'aria-label': '', fill: props.theme || '#3986FF', viewBox: '0 0 24 24', height: '24',
                                            width: '24' },
                                        _react2.default.createElement('path', {
                                            d: 'M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' })
                                    )
                                ),
                                _react2.default.createElement(
                                    'label',
                                    null,
                                    props.checkboxLabel || '包含截图'
                                )
                            ),
                            state.shotOpen ? _react2.default.createElement(
                                'div',
                                { className: 'screenshot-area' },
                                state.loading ? _react2.default.createElement(
                                    'div',
                                    { className: 'loading-icon' },
                                    _react2.default.createElement(
                                        'svg',
                                        { viewBox: '0 0 40 40', style: { width: '40px', height: '40px', position: 'relative' } },
                                        _react2.default.createElement('circle', { cx: '20', cy: '20', r: '18.25', fill: 'none', strokeWidth: '3.5',
                                            strokeMiterlimit: '20',
                                            style: { stroke: props.theme || 'rgb(57, 134, 255)', strokeLnecap: 'round' } })
                                    )
                                ) : null,
                                _react2.default.createElement(
                                    'div',
                                    { className: 'screenshot' },
                                    _react2.default.createElement('img', { id: 'screenshotPrev', ref: 'screenshotPrev', src: '' })
                                )
                            ) : null
                        )
                    ),
                    _react2.default.createElement('div', { className: 'legal', dangerouslySetInnerHTML: { __html: this.props.license || '\u5982\u51FA\u4E8E\u6CD5\u5F8B\u539F\u56E0\u9700\u8981\u8BF7\u6C42\u66F4\u6539\u5185\u5BB9\uFF0C\u8BF7\u524D\u5F80<a href="" style="color: ' + (props.theme || '#3986FF') + '">\u6CD5\u5F8B\u5E2E\u52A9</a>\u9875\u9762\u3002\u7CFB\u7EDF\u53EF\u80FD\u5DF2\u5C06\u90E8\u5206<a href="" style="color: ' + (props.theme || '#3986FF') + '">\u5E10\u53F7\u548C\u7CFB\u7EDF\u4FE1\u606F</a>\u53D1\u9001\u7ED9\n                                        Google\u3002\u6211\u4EEC\u5C06\u6839\u636E\u81EA\u5DF1\u7684<a href="" style="color: ' + (props.theme || '#3986FF') + '">\u9690\u79C1\u6743\u653F\u7B56</a>\u548C<a href="" style="color: ' + (props.theme || '#3986FF') + '">\u670D\u52A1\u6761\u6B3E</a>\u4F7F\u7528\u60A8\u63D0\u4F9B\u7684\u4FE1\u606F\u5E2E\u52A9\u89E3\u51B3\u6280\u672F\u95EE\u9898\u548C\u6539\u8FDB\u6211\u4EEC\u7684\u670D\u52A1\u3002' } })
                ),
                _react2.default.createElement('canvas', { ref: 'canvas', id: 'feedbackCanvas', 'data-html2canvas-ignore': 'true',
                    onMouseDown: this.canvasMouseDown.bind(this)
                }),
                _react2.default.createElement('canvas', { ref: 'shadowCanvas', id: 'shadowCanvas'
                }),
                state.snackbar ? _react2.default.createElement(
                    'div',
                    { className: 'snackbar' },
                    state.snackbarMsg
                ) : null
            );
        }
    }]);

    return Feedback;
}(_react2.default.Component);

exports.default = Feedback;


Feedback.propTypes = {
    theme: _propTypes2.default.string,
    cancel: _propTypes2.default.func.isRequired,
    send: _propTypes2.default.func.isRequired,
    license: _propTypes2.default.string,
    proxy: _propTypes2.default.string,
    title: _propTypes2.default.string,
    placeholder: _propTypes2.default.string,
    requiredTip: _propTypes2.default.string,
    editTip: _propTypes2.default.string,
    loadingTip: _propTypes2.default.string,
    checkboxLabel: _propTypes2.default.string,
    cancelLabel: _propTypes2.default.string,
    confirmLabel: _propTypes2.default.string,
    hightlightTip: _propTypes2.default.string,
    hideTip: _propTypes2.default.string,
    editDoneLabel: _propTypes2.default.string
};