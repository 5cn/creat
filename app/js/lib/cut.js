(function(root,factory) {
    var $=require('../vender/query.js');
    require('../vender/event.js');
    module.exports =factory.call(root, $.$);
}(this, function($) {
    function Cut(height) {
        var car = {
            isIframe:!(top==self),
            _events: {}, // 自定义事件---this._execEvent('scrollStart');
            _windowHeight: $(window).height(), // 设备屏幕高度
            _windowWidth: $(window).width(),

            _rotateNode: $('.p-ct'), // 旋转体

            _page: $('.m-page'), // 模版页面切换的页面集合
            _pageNum: $('.m-page').size(), // 模版页面的个数
            _pageNow: 0, // 页面当前的index数
            _pageNext: null, // 页面下一个的index数

            _touchStartValY: 0, // 触摸开始获取的第一个值
            _touchDeltaY: 0, // 滑动的距离

            _moveStart: true, // 触摸移动是否开始
            _movePosition: null, // 触摸移动的方向（上、下）
            _movePosition_c: null, // 触摸移动的方向的控制
            _mouseDown: false, // 判断鼠标是否按下
            _moveFirst: true,
            _moveInit: false,

            _firstChange: false,
            _height:height||$(window).height(),

            _elementStyle: document.createElement('div').style, // css属性保存对象

            _UC: RegExp("Android").test(navigator.userAgent) && RegExp("UC").test(navigator.userAgent) ? true : false,
            _weixin: RegExp("MicroMessenger").test(navigator.userAgent) ? true : false,
            _iPhoen: RegExp("iPhone").test(navigator.userAgent) || RegExp("iPod").test(navigator.userAgent) || RegExp("iPad").test(navigator.userAgent) ? true : false,
            _Android: RegExp("Android").test(navigator.userAgent) ? true : false,
            _IsPC: function() {
                var userAgentInfo = navigator.userAgent;
                var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
                var flag = true;
                for (var v = 0; v < Agents.length; v++) {
                    if (userAgentInfo.indexOf(Agents[v]) > 0) {
                        flag = false;
                        break;
                    }
                }
                return flag;
            },
            arrowIndex: 0, //相册索引
            isArrowOK: true, //判断翻页是否完成
            arrowShow:function(){
                $('.u-arrow').removeClass('f-hide');
            },
            arrowHide:function(){
                $('.u-arrow').addClass('f-hide');
            },
            toSlide    : function(index, oldPage) {//跳页面
                var pages                        = car._page;
                var page                         = pages[index];
                var oldPage                      = oldPage || pages[car._pageNow];
                page.classList.remove('f-hide');
                page.classList.add('z-animate');
                page.classList.add('action'); //跳转到计数页
                oldPage.classList.add('f-hide');
                oldPage.classList.remove('z-animate');
                oldPage.classList.remove('action'); //跳转到计数页
                car._pageNow                    = index; //修改活动页面的参数
                car.lazy_change($(pages[index]), false);
            },
            // decideNow:function(now){
            //     this._pageNow=now;
            //     this._page.removeClass('z-animate action');
            //     this._page.eq(now).addClass('z-animate');

            // },
            // slideUp:function(){
            //     if(this._pageNum==1){
            //         return;
            //     }
            //     var self=this;
            //     var now=this._pageNow,
            //         height=$('.p-ct').height(),
            //         total=this._pageNum,
            //         next=now===0?(total-1):this._pageNow-1,
            //         page=this._page,
            //         target=page.eq(next);
            //     target.
            //         removeClass('f-hide').addClass('show').
            //         css({
            //             'transform':'translate3d(0,-'+height+'px,0)',
            //             'webkitTransform':'translate3d(0,-'+height+'px,0)',
            //             '-webkit-transform':'translate3d(0,-'+height+'px,0)',
            //         });
            //     car.lazy_change(car2._page.eq(next), false);
            //     _.delay(function(){
            //         target.
            //             css({
            //                 'transform':'translate3d(0,0,0)',
            //                 'webkitTransform':'translate3d(0,0,0)',
            //                 '-webkit-transform':'translate3d(0,0,0)',
            //             });
            //         _.delay(function(){
            //             page.eq(now).addClass('f-hide');
            //             target.removeClass('show');
            //             self.decideNow(next);
            //         }, 300);
            //     },100);
            //     $(window).trigger('cut',[next,now,this._page]);
            // },
            // slideDown:function(){

            //     if(this._pageNum==1){
            //         return;
            //     }
            //     var self=this;
            //     var now=this._pageNow,
            //         height=$('.p-ct').height(),
            //         total=this._pageNum,
            //         next=(now===total-1)?0:this._pageNow+1,
            //         page=this._page,
            //         target=page.eq(next);
            //     target.
            //         removeClass('f-hide').addClass('show').
            //         css({
            //             'transform':'translate3d(0,'+height+'px,0)',
            //             'webkitTransform':'translate3d(0,'+height+'px,0)',
            //             '-webkit-transform':'translate3d(0,'+height+'px,0)',
            //         });

            //     car.lazy_change(car2._page.eq(next), false);
            //     _.delay(function(){
            //         target.
            //             css({
            //                 'transform':'translate3d(0,0,0)',
            //                 'webkitTransform':'translate3d(0,0,0)',
            //                 '-webkit-transform':'translate3d(0,0,0)',
            //             });
            //         _.delay(function(){
            //             page.eq(now).addClass('f-hide');
            //             target.removeClass('show');
            //             self.decideNow(next);
            //         }, 300);
            //     },100);
                
            //     $(window).trigger('cut',[next,now,this._page]);
            // },
            _setHeight:function(height){//iframe适配
                $('.p-ct').height(height);
                $('.m-page').height(height);
                $('.page-con').height(height);
                $('.translate-back').height(height);
                cut._height=height;
            },
            _setHeight2:function(height){//手机端固定640*960
                $('.p-ct').height(height);
                $('.m-page').height(960);
                $('.page-con').height(960);
                $('.translate-back').height(960);
                cut._height=height;
                var top=(height-960)/2;
                var ratio=top>0?height/960:1;
                $('.translate-back').css({
                    'top':top+'px',
                    '-webkit-transform':'scale('+ratio+')'
                });

            },
            _isOwnEmpty: function(obj) {
                for (var name in obj) {
                    if (obj.hasOwnProperty(name)) {
                        return false;
                    }
                }
                return true;
            },
            decideNow:function(now){//决定下一个是哪一个页面
                this._pageNow=now;
                this._page.removeClass('z-animate action');
                this._page.eq(now).addClass('z-animate');

            },
            slideUp:function(){//往上翻页

                if(this._pageNum==1){
                    return;
                }
                var self=this;
                var now=this._pageNow,
                    height=$('.p-ct').height(),
                    total=this._pageNum,
                    next=now===0?(total-1):this._pageNow-1,
                    page=this._page,
                    target=page.eq(next);
                car.lazy_change(car._page.eq(next), false);
                target.
                    removeClass('f-hide').addClass('show').
                    css({
                        'transform':'translate3d(0,-'+height+'px,0)',
                        'webkitTransform':'translate3d(0,-'+height+'px,0)',
                        '-webkit-transform':'translate3d(0,-'+height+'px,0)',
                    });
                _.delay(function(){
                    target.
                        css({
                            'transform':'translate3d(0,0,0)',
                            'webkitTransform':'translate3d(0,0,0)',
                            '-webkit-transform':'translate3d(0,0,0)',
                        });
                    _.delay(function(){
                        page.eq(now).addClass('f-hide');
                        target.removeClass('show');
                        self.decideNow(next);
                    }, 300);
                },100);
                $(window).trigger('cut',[next,now,this._page]);
            },
            slideDown:function(){//往下翻页
                
                if(this._pageNum==1){
                    return;
                }
                var self=this;
                var now=this._pageNow,
                    height=$('.p-ct').height(),
                    total=this._pageNum,
                    next=(now===total-1)?0:this._pageNow+1,
                    page=this._page,
                    target=page.eq(next);
                car.lazy_change(car._page.eq(next), false);//懒加载下一页
                target.
                    removeClass('f-hide').addClass('show').
                    css({
                        'transform':'translate3d(0,'+height+'px,0)',
                        'webkitTransform':'translate3d(0,'+height+'px,0)',
                        '-webkit-transform':'translate3d(0,'+height+'px,0)',
                    });
                _.delay(function(){
                    target.
                        css({
                            'transform':'translate3d(0,0,0)',
                            'webkitTransform':'translate3d(0,0,0)',
                            '-webkit-transform':'translate3d(0,0,0)',
                        });
                    _.delay(function(){
                        page.eq(now).addClass('f-hide');
                        target.removeClass('show');
                        self.decideNow(next);
                    }, 300);
                },100);
                $(window).trigger('cut',[next,now,this._page]);//触发成功的回调函数
            },
            // 微信初始化函数
            _WXinit: function(callback) {
                if (typeof window.WeixinJSBridge == 'undefined' || typeof window.WeixinJSBridge.invoke == 'undefined') {
                    setTimeout(function() {
                        this.WXinit(callback);
                    }, 200);
                } else {
                    callback();
                }
            },
            // 判断浏览器内核类型
            _vendor: function() {
                var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
                    transform,
                    i = 0,
                    l = vendors.length;

                for (; i < l; i++) {
                    transform = vendors[i] + 'ransform';
                    if (transform in this._elementStyle) return vendors[i].substr(0, vendors[i].length - 1);
                }
                return false;
            },
            // 判断浏览器来适配css属性值
            _prefixStyle: function(style) {
                if (this._vendor() === false) return false;
                if (this._vendor() === '') return style;
                return this._vendor() + style.charAt(0).toUpperCase() + style.substr(1);
            },
            // 判断是否支持css transform-3d（需要测试下面属性支持）
            _hasPerspective: function() {
                var ret = this._prefixStyle('perspective') in this._elementStyle;
                if (ret && 'webkitPerspective' in this._elementStyle) {
                    this._injectStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function(node, rule) {
                        ret = node.offsetLeft === 9 && node.offsetHeight === 3;
                    });
                }
                return !!ret;
            },
            _translateZ: function() {
                if (car._hasPerspective) {
                    return ' translateZ(0)';
                } else {
                    return '';
                }
            },

            // 判断属性支持是否
            _injectStyles: function(rule, callback, nodes, testnames) {
                var style, ret, node, docOverflow,
                    div = document.createElement('div'),
                    body = document.body,
                    fakeBody = body || document.createElement('body'),
                    mod = 'modernizr';

                if (parseInt(nodes, 10)) {
                    while (nodes--) {
                        node = document.createElement('div');
                        node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
                        div.appendChild(node);
                    }
                }

                style = ['&#173;', '<style id="s', mod, '">', rule, '</style>'].join('');
                div.id = mod;
                (body ? div : fakeBody).innerHTML += style;
                fakeBody.appendChild(div);
                if (!body) {
                    fakeBody.style.background = '';
                    fakeBody.style.overflow = 'hidden';
                    docOverflow = docElement.style.overflow;
                    docElement.style.overflow = 'hidden';
                    docElement.appendChild(fakeBody);
                }

                ret = callback(div, rule);
                if (!body) {
                    fakeBody.parentNode.removeChild(fakeBody);
                    docElement.style.overflow = docOverflow;
                } else {
                    div.parentNode.removeChild(div);
                }

                return !!ret;
            },
            // 自定义事件操作
            _handleEvent: function(type) {
                if (!this._events[type]) {
                    return;
                }

                var i = 0,
                    l = this._events[type].length;

                if (!l) {
                    return;
                }

                for (; i < l; i++) {
                    this._events[type][i].apply(this, [].slice.call(arguments, 1));
                }
            },
            // 给自定义事件绑定函数
            _on: function(type, fn) {
                if (!this._events[type]) {
                    this._events[type] = [];
                }

                this._events[type].push(fn);
            },
            //禁止滚动条
            _scrollStop: function() {
                //禁止滚动
                $(window).on('touchmove.scroll', this._scrollControl);
                $(window).on('scroll.scroll', this._scrollControl);
            },
            //启动滚动条
            _scrollStart: function() {
                //开启屏幕禁止
                $(window).off('touchmove.scroll');
                $(window).off('scroll.scroll');
            },
            //滚动条控制事件
            _scrollControl: function(e) {
                e.preventDefault();
            },
            page_start: function() {
                car._page.on('touchstart mousedown', car.page_touch_start);
                car._page.on('touchmove mousemove', car.page_touch_move);
                car._page.on('touchend mouseup', car.page_touch_end);
            },

            // 页面切换停止
            page_stop: function() {
                car._page.off('touchstart mousedown');
                car._page.off('touchmove mousemove');
                car._page.off('touchend mouseup');
            },

            // page触摸移动start
            page_touch_start: function(e) {
                if (!car._moveStart) return;

                if (e.type == "touchstart") {
                    car._touchStartValY = window.event.touches[0].pageY;
                } else {
                    car._touchStartValY = e.pageY || e.y;
                    car._mouseDown = true;
                }

                car._moveInit = true;

                // start事件
                car._handleEvent('start');
            },

            // page触摸移动move
            page_touch_move: function(e) {
                e.preventDefault();

                if (!car._moveStart) return;
                if (!car._moveInit) return;

                // 设置变量值
                var $self = car._page.eq(car._pageNow),
                    h = parseInt($self.height()),
                    moveP,
                    scrollTop,
                    node = null,
                    move = false;

                // 获取移动的值
                if (e.type == "touchmove") {
                    moveP = window.event.touches[0].pageY;
                    move = true;
                } else {
                    if (car._mouseDown) {
                        moveP = e.pageY || e.y;
                        move = true;
                    } else return;
                }

                // 获取下次活动的page
                node = car.page_position(e, moveP, $self);

                // page页面移动         
                car.page_translate(node);

                // move事件
                car._handleEvent('move');

            },

            // page触摸移动判断方向
            page_position: function(e, moveP, $self) {
                var now, next;

                // 设置移动的距离
                if (moveP != 'undefined') car._touchDeltaY = moveP - car._touchStartValY;

                // 设置移动方向
                if (moveP - car._touchStartValY > 100) {
                    car._movePosition = 'down';
                } else if (moveP - car._touchStartValY < -100) {
                    car._movePosition = 'up'
                }
                if (car._movePosition != car._movePosition_c) {
                    car._moveFirst = true;
                    car._movePosition_c = car._movePosition;
                } else {
                    car._moveFirst = false;
                }

                // 设置下一页面的显示和位置        
                if (car._touchDeltaY <= 0) {
                    if ($self.next('.m-page').length == 0) {
                        car._pageNext = 0;
                    } else {
                        car._pageNext = car._pageNow + 1;
                    }

                    next = car._page.eq(car._pageNext)[0];
                } else {
                    if ($self.prev('.m-page').length == 0) {
                        if (car._firstChange) {
                            car._pageNext = car._pageNum - 1;
                        } else {
                            return;
                        }
                    } else {
                        car._pageNext = car._pageNow - 1;
                    }

                    next = car._page.eq(car._pageNext)[0];
                }

                now = car._page.eq(car._pageNow)[0];
                node = [next, now];

                // move阶段根据方向设置页面的初始化位置--执行一次
                if (car._moveFirst) init_next(node);

                function init_next(node) {
                    var s, l, _translateZ = car._translateZ();

                    car._page.removeClass('action');
                    $(node[1]).addClass('action').removeClass('f-hide');
                    car._page.not('.action').addClass('f-hide');

                    // 模版高度适配函数处理
                    car.height_auto(car._page.eq(car._pageNext), 'false');

                    // 显示对应移动的page
                    $(node[0]).removeClass('f-hide').addClass('active');

                    // 设置下一页面的显示和位置        
                    if (car._movePosition == 'up') {
                        s = parseInt($(window).scrollTop());
                        if (s > 0) l = car._height + s;
                        else l = car._height;
                        node[0].style[car._prefixStyle('transform')] = 'translate(0,' + l + 'px)' + _translateZ;
                        $(node[0]).attr('data-translate', l);

                        $(node[1]).attr('data-translate', 0);
                    } else {
                        node[0].style[car._prefixStyle('transform')] = 'translate(0,-' + Math.max(car._height, $(node[0]).height()) + 'px)' + _translateZ;
                        $(node[0]).attr('data-translate', -Math.max(car._height, $(node[0]).height()));

                        $(node[1]).attr('data-translate', 0);
                    }
                }

                return node;
            },

            // page触摸移动设置函数
            page_translate: function(node) {
                // 没有传值返回
                if (!node) return;

                var _translateZ = car._translateZ(),
                    y_1, y_2, scale,
                    y = car._touchDeltaY;

                // 切换的页面移动
                if ($(node[0]).attr('data-translate')) y_1 = y + parseInt($(node[0]).attr('data-translate'));
                node[0].style[car._prefixStyle('transform')] = 'translate(0,' + y_1 + 'px)' + _translateZ;

                // 当前的页面移动
                if ($(node[1]).attr('data-translate')) y_2 = y + parseInt($(node[1]).attr('data-translate'));
                scale = 1 - Math.abs(y * 0.2 / car._height);
                y_2 = y_2 / 5;
                node[1].style[car._prefixStyle('transform')] = 'translate(0,' + y_2 + 'px)' + _translateZ + ' scale(' + scale + ')';
            },

            // page触摸移动end
            page_touch_end: function(e) {
                car._moveInit = false;
                car._mouseDown = false;
                if (!car._moveStart) return;
                if (!car._pageNext && car._pageNext != 0) return;

                car._moveStart = false;

                // 确保移动了
                if (Math.abs(car._touchDeltaY) > 10) {
                    car._page.eq(car._pageNext)[0].style[car._prefixStyle('transition')] = 'all .3s';
                    car._page.eq(car._pageNow)[0].style[car._prefixStyle('transition')] = 'all .3s';
                }

                // 页面切换
                if (Math.abs(car._touchDeltaY) >= 100) { // 切换成功
                    car.page_success();
                } else if (Math.abs(car._touchDeltaY) > 10 && Math.abs(car._touchDeltaY) < 100) { // 切换失败       
                    car.page_fial();
                } else { // 没有切换
                    car.page_fial();
                }

                // end事件
                car._handleEvent('end');

                // 注销控制值
                car._movePosition = null;
                car._movePosition_c = null;
                car._touchStartValY = 0;


            },

            // 切换成功
            page_success: function() {
                var _translateZ = car._translateZ();

                // 下一个页面的移动
                car._page.eq(car._pageNext)[0].style[car._prefixStyle('transform')] = 'translate(0,0)' + _translateZ;

                // 当前页面变小的移动
                var y = car._touchDeltaY > 0 ? car._height / 5 : -car._height / 5;
                var scale = 0.8;
                car._page.eq(car._pageNow)[0].style[car._prefixStyle('transform')] = 'translate(0,' + y + 'px)' + _translateZ + ' scale(' + scale + ')';

                // 成功事件
                car._handleEvent('success');
            },

            // 切换失败
            page_fial: function() {
                var _translateZ = car._translateZ();

                // 判断是否移动了
                if (!car._pageNext && car._pageNext != 0) {
                    car._moveStart = true;
                    car._moveFirst = true;
                    return;
                }

                if (car._movePosition == 'up') {
                    car._page.eq(car._pageNext)[0].style[car._prefixStyle('transform')] = 'translate(0,' + car._height + 'px)' + _translateZ;
                } else {
                    car._page.eq(car._pageNext)[0].style[car._prefixStyle('transform')] = 'translate(0,-' + car._height + 'px)' + _translateZ;
                }

                car._page.eq(car._pageNow)[0].style[car._prefixStyle('transform')] = 'translate(0,0)' + _translateZ + ' scale(1)';

                // fial事件
                car._handleEvent('fial');
            },

            haddle_envent_fn: function() {
                // 当前页面移动，延迟加载以后的图片
                car._on('start', car.lazy_bigP);

                // 当前页面移动
                car._on('move', function() {

                });

                // 切换失败事件
                car._on('fial', function() {
                    setTimeout(function() {
                        car._page.eq(car._pageNow).attr('data-translate', '');
                        car._page.eq(car._pageNow)[0].style[car._prefixStyle('transform')] = '';
                        car._page.eq(car._pageNow)[0].style[car._prefixStyle('transition')] = '';
                        car._page.eq(car._pageNext)[0].style[car._prefixStyle('transform')] = '';
                        car._page.eq(car._pageNext)[0].style[car._prefixStyle('transition')] = '';

                        car._page.eq(car._pageNext).removeClass('active').addClass('f-hide');
                        car._moveStart = true;
                        car._moveFirst = true;
                        car._pageNext = null;
                        car._touchDeltaY = 0;
                        car._page.eq(car._pageNow).attr('style', '');
                    }, 300)
                })

                // 切换成功事件
                car._on('success', function() {
                    // 判断最后一页让，开启循环切换
                    if (car._pageNext == 0 && car._pageNow == car._pageNum - 1) {
                        car._firstChange = true;
                    }
                    var now=car._pageNext;
                    var pre=car._pageNow;
                    $(window).trigger('cut',[now,pre,this._page]);
                    car.lazy_change(cut._page.eq(now), false);
                    setTimeout(function() {

                        // 判断是否为最后一页，显示或者隐藏箭头
                        // if (car._pageNext == car._pageNum - 1) $('.u-arrow').addClass('f-hide');
                        // else $('.u-arrow').removeClass('f-hide');

                        car._page.eq(car._pageNow).addClass('f-hide');

                        car._page.eq(car._pageNow).attr('data-translate', '');
                        car._page.eq(car._pageNow)[0].style[car._prefixStyle('transform')] = '';
                        car._page.eq(car._pageNow)[0].style[car._prefixStyle('transition')] = '';
                        car._page.eq(car._pageNext)[0].style[car._prefixStyle('transform')] = '';
                        car._page.eq(car._pageNext)[0].style[car._prefixStyle('transition')] = '';

                        // 初始化切换的相关控制值
                        $('.p-ct').removeClass('fixed');
                        car._page.eq(car._pageNext).removeClass('active');
                        car._page.eq(car._pageNext).removeClass('fixed');
                        car._pageNow = car._pageNext;
                        car._moveStart = true;
                        car._moveFirst = true;
                        car._pageNext = null;
                        // car._page.eq(car._pageNow).attr('style', '');
                        car._page.eq(car._pageNow).removeClass('fixed');
                        car._page.eq(car._pageNow).attr('data-translate', '');
                        car._touchDeltaY = 0;

                        // 切换成功后，执行当前页面的动画---延迟200ms
                        setTimeout(function() {
                            if (car._page.eq(car._pageNow).hasClass('z-animate')) return;
                            car._page.eq(car._pageNow).addClass('z-animate');
                        }, 20)

                        // 切换停止视频的播放
                        $('video').each(function() {
                            if (!this.paused) this.pause();
                        })
                    }, 300)

                })
            },
            /* 图片延迟加载 */
            lazy_img: function() {
                var lazyNode = $('.lazy-img');
                lazyNode.each(function() {
                    var self = $(this);
                    if (self.is('img')) {
                        // self.attr('src', 'http://img0.hx.com/magazine/img/load.gif');
                    } else {
                        // 把原来的图片预先保存下来
                        var position = self.css('background-position'),
                            size = self.css('background-size');

                        self.attr({
                            'data-position': position,
                            'data-size': size
                        });

                        if (self.attr('data-bg') == 'no') {
                            self.css({
                                'background-repeat': 'no-repeat'
                            })
                        }else{ 
                            if(!self.hasClass('f-shape')){
                                self.css({
                                    'background-image': 'url(http://img0.hx.com/magazine/img/load.gif)',
                                    'background-size': '120px 120px',
                                    'background-position': 'center'
                                })
                            }
                        }

                        if (self.attr('data-image') == 'no') {
                            self.css({
                                'background-image': 'none'
                            })
                        }
                    }
                })
            },

            // 开始加载前三个页面
            lazy_start: function() {
                // 前三个页面的图片延迟加载
                setTimeout(function() {
                    for (var i = 0; i < 3; i++) {
                        var node = $(".m-page").eq(i);
                        if (node.length == 0) break;
                        if (node.find('.lazy-img').length != 0) {
                            car.lazy_change(node, false);
                        } else continue;
                    }
                }, 0);
            },

            // 加载当前后面第三个
            lazy_bigP: function() {
                for (var i = 3; i <= 7; i++) {
                    var node = $(".m-page").eq(car._pageNow + i);
                    if (node.length == 0) break;
                    if (node.find('.lazy-img').length != 0) {
                        car.lazy_change(node, false);
                    } else continue;
                }
            },

            // 图片延迟替换函数
            lazy_change: function(node, goon) {
                // 其他图片的延迟加载
                var lazy = node.find('.lazy-img');
                lazy.each(function() {
                    var self = $(this),
                        srcImg = self.attr('data-src'),
                        position = self.attr('data-position'),
                        size = self.attr('data-size');

                    if (self.attr('data-bg') != 'no') {
                        $('<img />')
                            .on('load', function() {
                                if (self.is('img')) {
                                    self.attr('src', srcImg)
                                } else {
                                    if(!self.hasClass('f-shape')){
                                        self.css({
                                            'background-image': 'url(' + srcImg + ')',
                                            'background-position': position,
                                            'background-size': size
                                        })
                                    }else{
                                        self.css({
                                            'webkitMask': 'url(' + srcImg + ') 0px 0px round',
                                            '-webkit-mask': 'url(' + srcImg + ') 0px 0px round',
                                            'mask': 'url(' + srcImg + ') 0px 0px round',
                                            'background-size': '100% 100%'
                                        });
                                    }
                                }

                                // 判断下面页面进行加载
                                if (goon) {
                                    for (var i = 0; i < $(".m-page").size(); i++) {
                                        var page = $(".m-page").eq(i);
                                        if ($(".m-page").find('.lazy-img').length == 0) continue
                                        else {
                                            car.lazy_change(page, true);
                                        }
                                    }
                                }
                            })
                            .attr("src", srcImg);

                        self.removeClass('lazy-img').addClass('lazy-finish');
                    } else {
                        if (self.attr('data-auto') == 'yes') self.css('background', 'none');
                    }
                })
            },
            height_auto: function(ele, val) {
                ele.children('.page-con').css('height', 'auto');
                var height = car._height;

                // 需要解除固定高度的page卡片
                var vial = true;
                if (!vial) {
                    if (ele.height() <= height) {
                        ele.children('.page-con').height(height + 2);
                        if ((!$('.p-ct').hasClass('fixed')) && val == 'true') $('.p-ct').addClass('fixed');
                    } else {
                        car._scrollStart();
                        if (val == 'true') $('.p-ct').removeClass('fixed');
                        ele.children('.page-con').css('height', '100%');
                        return;
                    }
                } else {
                    ele.children('.page-con').height(height + 2);
                    if ((!$('.p-ct').hasClass('fixed')) && val == 'true') $('.p-ct').addClass('fixed');
                }
            },
            // 微信的分享提示
            wxShare: function() {
                $('body').on('click', '.bigTxt-btn-wx', function() {
                    var img_wx = $(this).parent().find('.bigTxt-weixin');

                    img_wx.addClass('z-show');
                    car.page_stop();

                    img_wx.on('click', function() {
                        $(this).removeClass('z-show');
                        car.page_start();

                        $(this).off('click');
                    })
                })
            }(),

            // 对象私有变量刷新
            refresh: function() {
                car._windowHeight = $(window).height();
                car._windowWidth = $(window).width();
            },
            styleInit: function() {
                // 禁止文版被拖动
                document.body.style.userSelect = 'none';
                document.body.style.mozUserSelect = 'none';
                document.body.style.webkitUserSelect = 'none';

                // 判断设备的类型并加上class
                if (car._IsPC()) $(document.body).addClass('pc');
                else $(document.body).addClass('mobile');
                if (car._Android) $(document.body).addClass('android');
                if (car._iPhoen) $(document.body).addClass('iphone');

                // 判断是否有3d
                if (!car._hasPerspective()) {
                    car._rotateNode.addClass('transformNode-2d');
                    $(document.body).addClass('no-3d');
                } else {
                    car._rotateNode.addClass('transformNode-3d');
                    $(document.body).addClass('perspective');
                    $(document.body).addClass('yes-3d');
                }

                // 图片延迟加载的处理
                this.lazy_img();
                $('.u-arrow').on('touchmove', function(e) {
                    e.preventDefault()
                })
                if(car.isIframe){
                    car._setHeight(car._height);
                }else{
                    car._setHeight2(car._height);
                }
            },
            reinit:function(height){
                if(car.isIframe){
                    car._setHeight(height);
                }else{
                    car._setHeight2(height);
                }
            },
            // 对象初始化
            init: function() {
                this.styleInit();
                this.haddle_envent_fn();
                if(this._pageNum>1){
                    car.arrowShow();
                    car.page_start();
                }else{
                    car.page_stop();
                }
                $('.translate-back').removeClass('f-hide');
                $('.m-fengye').removeClass('f-hide');
                car.height_auto(car._page.eq(car._pageNow), 'false');
                car.lazy_start();
                if(car.isIframe){
                    car._setHeight(car._height);
                }else{
                    car._setHeight2(car._height);
                }
            }
        };
        return car;
    }
    return Cut;
}));
