(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
* @Author: wanghongxin
* @Date:   2015-05-08 23:57:28
* @Last Modified by:   wanghongxin
* @Last Modified time: 2015-06-25 17:05:22
*/
;(function(root,factory){//这里存放后续模块
    var media=require('./lib/audio.js');
    var side=require('./lib/side.js');
    var advert=require('./lib/banner.js');
    var interaction=require('./lib/interaction.js');
    var share=require('./lib/share.js');
    var www5cn=window.www5cn;
    factory.call(root,media,side,advert,interaction,share,www5cn);
}(this,function(media,side,advert,interaction,share,www5cn){
    var tmp;
    function isWeiXin(){ 
        var ua = window.navigator.userAgent.toLowerCase(); 
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
            return true; 
        }else{ 
            return false; 
        } 
    } 
    //启动音乐模块
    media.init(www5cn.music.src);
    //启动侧边栏模块
    function findId(search){
        var search=search.replace(/\?/,'').split('&');
        search=_.map(search,
            function(item,index){
                item=item.split('=');
                return {
                    key:item[0],
                    value:item[1]
                }
            });
        var id=_.find(search,
            function(item,index){
                return item.key=='userid';
            });
        if (!id) {return 0};
        var unsafeId=id.value;
        var safeId=id.value.replace(/[^\d\w]/,'');
        return safeId;
    }
    $.
        ajax({//加载侧边栏数据后启动侧边栏
            url: 'http://userservice.5.cn/inner/user/getUserByUserID.json',
            type: 'post',
            dataType:'json',
            data:{params:JSON.stringify({"userID":www5cn.uid||"123"})},
            success:function(data){
                //因为后台的没有提供接口的约定，后台接口不可预测，所以在此将所有后台数据拦截，进行转化
                var url=window.location.href;
                data.avater=data.data.image;
                data.user={
                    avatar:data.data.image,
                    name:data.data.name,
                    liked:data.data.myFavouriteMsgCount,
                    fans:data.data.followerCount,
                    observers:data.data.followCount
                };
                data.magazine={
                    saved:www5cn.magazine.saved,
                    readed:www5cn.magazine.readed
                };
                data.audio={
                    name:www5cn.music.name,
                    src:www5cn.music.src
                };
                var interData={
                    back:'javascript:;',
                    reviews:'javascript:;',
                    good:'javascript:;',
                    share:'javascript:;',
                    comment:www5cn.magazine.comment,
                    saved:www5cn.magazine.saved
                };
                data.user.message='javascript:;';
                data.user.attention='javascript:;';
                if(ldzx.config.isApp){
                    data.user.hotUrl=url+'#hot';
                    data.user.homeUrl=url+'#home';
                    data.user.downloadUrl=url+'#download';
                    data.user.newestUrl=url+'#newest';
                    data.user.recommendUrl=url+'#recommend';
                    data.user.restMagazineUrl=url+'#rest';
                    data.user.message=url+'#message';
                    data.user.attention=url+'#attention';
                    interData.back=url+'#back';
                    interData.reviews=url+'#reviews';
                    interData.good=url+'#good';
                    interData.share=url+'#share';
                }else{
                    data.user.hotUrl='http://mookservice.5.cn/page/installApp.json';
                    data.user.homeUrl='http://mookservice.5.cn/page/installApp.json';
                    data.user.downloadUrl='http://mookservice.5.cn/page/installApp.json';
                    data.user.newestUrl='http://mookservice.5.cn/page/installApp.json';
                    data.user.recommendUrl='http://mookservice.5.cn/page/installApp.json';
                    data.user.restMagazineUrl='http://mookservice.5.cn/page/installApp.json';
                    data.user.message='http://mookservice.5.cn/page/installApp.json';
                    data.user.attention='http://mookservice.5.cn/page/installApp.json';
                    interData.back='http://mookservice.5.cn/page/installApp.json';
                    interData.reviews='http://mookservice.5.cn/page/installApp.json';
                    interData.good='http://mookservice.5.cn/page/installApp.json';
                    interData.share='http://mookservice.5.cn/page/installApp.json';
                }
                data.isApp=ldzx.config.isApp;
                data.attentioned=ldzx.config.attentioned;
                $.extend(www5cn,data);
                data.side=www5cn.side;//侧边栏数据来自www5cn

                //启动侧边栏
                // console.log(ldzx.config)
                side(data,ldzx.config||{
                    attentioned:false,
                    isApp:false
                });
                //启动底部互动栏
                interaction(interData,ldzx.config||{
                    saved:false
                });
                //后台缓存池问题，需要再次请求刷新数据
                $.ajax({
                    'url':'http://mookservice.5.cn/inner/magazine/status.json',
                    'data':{params:JSON.stringify({"topicid":www5cn.magaId||"123"})},
                    'dataType':'json',
                    'success':function(data){
                        if(data.code===200){
                            data=data.obj;
                            $('.i-reviews').next().html(data.comment);
                            $('.i-good').next().html(data.favorite);
                        }
                    }
                });
            }
        });
    //启动广告模块
    advert(100,{
        'gdt_banner.js':[1,80],
        '5cn_banner.js':[81,100]
    },'http://img0.hx.com/magazine0120/js/');
    //启动互动模块
    // 微信分享模块
    // console.log(www5cn.wx);
    share(www5cn.wx);
    if(ldzx.config.isApp||true){
        tmp={
            setComment:function(counts){
                $('.i-reviews').next().html(counts);
            },
            setSaved:function(saved,counts){
                var target=$('.i-good');
                target.next().html(counts);
                if(saved){
                    target.css('backgroundPosition','0 -218px');
                }else{
                    target.css('backgroundPosition','0 -115px');
                }
            },
            setAttention:function(attended){
                var target=$('.reputation').find('span').eq(2);
                if(attended){
                    $('.attention').html('取消关注');
                    target.html(parseInt(target.html())+1);
                }else{
                    $('.attention').html('关 注');
                    target.html(parseInt(target.html())-1);
                }
            }
        }
        ldzx.ctrl=ldzx.ctrl||{};
        $.extend(ldzx.ctrl,tmp);
    }
}));
},{"./lib/audio.js":2,"./lib/banner.js":3,"./lib/interaction.js":5,"./lib/share.js":6,"./lib/side.js":7}],2:[function(require,module,exports){
/* 
* @Author: wanghongxin
* @Date:   2015-05-08 23:57:28
* @Last Modified by:   wanghongxin
* @Last Modified time: 2015-05-18 10:39:01
*/
;(function(root,factory){
    require('./coffee.js');
    require('../vender/touch.js');
    module.exports=factory.call(root,$);    
}(this,function($){
    var service={
        audioPlay:audioPlay,
        audioPause:audioPause,
        init:init
    };
    var audio=new Audio();
    var played=true;
    function init(url){
        if(!url)return;//根据数据判断是否加载
        var optsAudio={
            loop: true,
            preload: "auto",
            src: url
        };
        for(var i in optsAudio){
            if(optsAudio.hasOwnProperty(i)&&(i in audio)){
                audio[i]=optsAudio[i];
            }
        }
        window.audio=audio;
        audio.load();


        var html='<section class="u-audio">'+
                    '<p id="coffee_flow" class="btn_audio"><strong class="txt_audio z-hide">关闭</strong><span class="css_sprite01 audio_open"></span></p>'+
                '</section>';
        $(html).prependTo($('body'));
        $('#coffee_flow').coffee({
            steams              : ["<img src='http://www5.5.cn/Public/newimages/audio_widget_01@2x.png' />","<img src='http://www5.5.cn/Public/newimages/audio_widget_01@2x.png' />"], 
            steamHeight         : 100,
            steamWidth          : 44 
        });

        service.audioPlay();
        $('.u-audio').on('tap',function(){
            played=!played;
            if(played){
                service.audioPlay();
            }else{
                service.audioPause();
            }
        });
    }
    function audioPlay(){
        audio.play();
        $.fn.coffee.start();
        $('.coffee-steam-box').show(500);
    }
    function audioPause(){
        audio.pause();
        $.fn.coffee.stop();
        $('.coffee-steam-box').hide(500);
    }
    return service;
}));


},{"../vender/touch.js":9,"./coffee.js":4}],3:[function(require,module,exports){
/* 
* @Author: wanghongxin
* @Date:   2015-05-08 23:57:28
* @Last Modified by:   wanghongxin
* @Last Modified time: 2015-06-16 13:39:16
*/
;(function(root,factory){
    var $=window.$;
    var cut=window.cut;
    module.exports=factory.call(root,$,cut);
}(this,function($,cut){

    var getRandom=function(max){
        return Math.random() * (max) | 1;
      };
      var getBannerAd=function(url){
          var script=document.createElement('script');
          script.src=url;
          $('body').append(script);
      };
      var fetchBanner=function(length,opts,prefix){
          cut.reinit($(window).height()-100);
          var random=getRandom(length);
          for(var i in opts){
              if(opts.hasOwnProperty(i)){
                  if(opts[i][0]<=random&&random<=opts[i][1]){
                      getBannerAd((prefix?prefix:'')+i);
                  }
              }
          }
      };
      
      return fetchBanner;
}));


},{}],4:[function(require,module,exports){
/* 
* @Author: wanghongxin
* @Date:   2015-05-08 23:57:28
* @Last Modified by:   wanghongxin
* @Last Modified time: 2015-05-12 13:16:23
*/
;(function($, undefined){
  var prefix = '', eventPrefix, endEventName, endAnimationName,
    vendors = { Webkit: 'webkit', Moz: '', O: 'o' },
    document = window.document, testEl = document.createElement('div'),
    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
    transform,
    transitionProperty, transitionDuration, transitionTiming, transitionDelay,
    animationName, animationDuration, animationTiming, animationDelay,
    cssReset = {}

  function dasherize(str) { return str.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase() }
  function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : name.toLowerCase() }

  $.each(vendors, function(vendor, event){
    if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
      prefix = '-' + vendor.toLowerCase() + '-'
      eventPrefix = event
      return false
    }
  })

  transform = prefix + 'transform'
  cssReset[transitionProperty = prefix + 'transition-property'] =
  cssReset[transitionDuration = prefix + 'transition-duration'] =
  cssReset[transitionDelay    = prefix + 'transition-delay'] =
  cssReset[transitionTiming   = prefix + 'transition-timing-function'] =
  cssReset[animationName      = prefix + 'animation-name'] =
  cssReset[animationDuration  = prefix + 'animation-duration'] =
  cssReset[animationDelay     = prefix + 'animation-delay'] =
  cssReset[animationTiming    = prefix + 'animation-timing-function'] = ''

  $.fx = {
    off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
    speeds: { _default: 400, fast: 200, slow: 600 },
    cssPrefix: prefix,
    transitionEnd: normalizeEvent('TransitionEnd'),
    animationEnd: normalizeEvent('AnimationEnd')
  }

  $.fn.animate = function(properties, duration, ease, callback, delay){
    if ($.isFunction(duration))
      callback = duration, ease = undefined, duration = undefined
    if ($.isFunction(ease))
      callback = ease, ease = undefined
    if ($.isPlainObject(duration))
      ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration
    if (duration) duration = (typeof duration == 'number' ? duration :
                    ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
    if (delay) delay = parseFloat(delay) / 1000
    return this.anim(properties, duration, ease, callback, delay)
  }

  $.fn.anim = function(properties, duration, ease, callback, delay){
    var key, cssValues = {}, cssProperties, transforms = '',
        that = this, wrappedCallback, endEvent = $.fx.transitionEnd,
        fired = false

    if (duration === undefined) duration = $.fx.speeds._default / 1000
    if (delay === undefined) delay = 0
    if ($.fx.off) duration = 0

    if (typeof properties == 'string') {
      // keyframe animation
      cssValues[animationName] = properties
      cssValues[animationDuration] = duration + 's'
      cssValues[animationDelay] = delay + 's'
      cssValues[animationTiming] = (ease || 'linear')
      endEvent = $.fx.animationEnd
    } else {
      cssProperties = []
      // CSS transitions
      for (key in properties)
        if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
        else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

      if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
      if (duration > 0 && typeof properties === 'object') {
        cssValues[transitionProperty] = cssProperties.join(', ')
        cssValues[transitionDuration] = duration + 's'
        cssValues[transitionDelay] = delay + 's'
        cssValues[transitionTiming] = (ease || 'linear')
      }
    }

    wrappedCallback = function(event){
      if (typeof event !== 'undefined') {
        if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
        $(event.target).unbind(endEvent, wrappedCallback)
      } else
        $(this).unbind(endEvent, wrappedCallback) // triggered by setTimeout

      fired = true
      $(this).css(cssReset)
      callback && callback.call(this)
    }
    if (duration > 0){
      this.bind(endEvent, wrappedCallback)
      // transitionEnd is not always firing on older Android phones
      // so make sure it gets fired
      setTimeout(function(){
        if (fired) return
        wrappedCallback.call(that)
      }, (duration * 1000) + 25)
    }

    // trigger page reflow so new elements can animate
    this.size() && this.get(0).clientLeft

    this.css(cssValues)

    if (duration <= 0) setTimeout(function() {
      that.each(function(){ wrappedCallback.call(this) })
    }, 0)

    return this
  }

  testEl = null
})(Zepto)

// 音符的漂浮的插件制作--zpeto扩展
;(function($){
  // 利用zpeto的animate的动画-css3的动画-easing为了css3的easing(zpeto没有提供easing的扩展)
	$.fn.coffee = function(option){
    // 动画定时器
    var __time_val=null;
    var __time_wind=null;
    var __flyFastSlow = 'cubic-bezier(.09,.64,.16,.94)';

    // 初始化函数体，生成对应的DOM节点
		var $coffee = $(this);
		var opts = $.extend({},$.fn.coffee.defaults,option);  // 继承传入的值

    // 漂浮的DOM
    var coffeeSteamBoxWidth = opts.steamWidth;
    var $coffeeSteamBox = $('<div class="coffee-steam-box"></div>')
      .css({
        'height'   : opts.steamHeight,
        'width'    : opts.steamWidth,
        'left'     : 60,
        'top'      : -50,
        'position' : 'absolute',
        'overflow' : 'hidden',
        'z-index'  : 0 
      })
      .appendTo($coffee);

    // 动画停止函数处理
    $.fn.coffee.stop = function(){
      clearInterval(__time_val);
      clearInterval(__time_wind);
    }

    // 动画开始函数处理
    $.fn.coffee.start = function(){
      __time_val = setInterval(function(){
        steam();
      }, rand( opts.steamInterval / 2 , opts.steamInterval * 2 ));

      __time_wind = setInterval(function(){
        wind();
      },rand( 100 , 1000 )+ rand( 1000 , 3000))
    }
		return $coffee;
		
    // 生成漂浮物
    function steam(){	
      // 设置飞行体的样式
			var fontSize = rand( 8 , opts.steamMaxSize  ) ;     // 字体大小
      var steamsFontFamily = randoms( 1, opts.steamsFontFamily ); // 字体类型
      var color = '#'+ randoms(6 , '0123456789ABCDEF' );  // 字体颜色
			var position = rand( 0, 44 );                       // 起初位置
			var rotate = rand(-90,89);                          // 旋转角度
			var scale = rand02(0.4,1);                          // 大小缩放
      var transform =  $.fx.cssPrefix+'transform';        // 设置音符的旋转角度和大小
          transform = transform+':rotate('+rotate+'deg) scale('+scale+');'

      // 生成fly飞行体
			var $fly = $('<span class="coffee-steam">'+ randoms( 1, opts.steams ) +'</span>');
			var left = rand( 0 , coffeeSteamBoxWidth - opts.steamWidth - fontSize );
			if( left > position ) left = rand( 0 , position );
			$fly
        .css({
          'position'     : 'absolute',
          'left'         : position,
          'top'          : opts.steamHeight,
          'font-size:'   : fontSize+'px',
          'color'        : color,
          'font-family'  : steamsFontFamily,
          'display'      : 'block',
          'opacity'      : 1
        })
        .attr('style',$fly.attr('style')+transform)
        .appendTo($coffeeSteamBox)
        .animate({
  				top		: rand(opts.steamHeight/2,0),
  				left	: left,
  				opacity	: 0
			  },rand( opts.steamFlyTime / 2 , opts.steamFlyTime * 1.2 ),__flyFastSlow,function(){
				  $fly.remove();
				  $fly = null;			
			 });
		};
		
    // 风行，可以让漂浮体，左右浮动
		function wind(){
      // 左右浮动的范围值
      var left = rand( -10 , 10 );
      left += parseInt($coffeeSteamBox.css('left'));
      if(left>=54) left=54;
      else if(left<=34) left=34;

      // 移动的函数
      $coffeeSteamBox.animate({
        left  : left 
      } , rand( 1000 , 3000) ,__flyFastSlow);
		};
		
    // 随即一个值
    // 可以传入一个数组和一个字符串
    // 传入数组的话，随即获取一个数组的元素
    // 传入字符串的话，随即获取其中的length的字符
		function randoms( length , chars ) {
			length = length || 1 ;
			var hash = '';                  // 
			var maxNum = chars.length - 1;  // last-one
			var num = 0;                    // fisrt-one
			for( i = 0; i < length; i++ ) {
				num = rand( 0 , maxNum - 1  );
				hash += chars.slice( num , num + 1 );
			}
			return hash;
		};

    // 随即一个数值的范围中的值--整数
		function rand(mi,ma){   
			var range = ma - mi;
			var out = mi + Math.round( Math.random() * range) ;	
			return parseInt(out);
		};	

    // 随即一个数值的范围中的值--浮点
		function rand02(mi,ma){   
			var range = ma - mi;
			var out = mi + Math.random() * range;	
			return parseFloat(out);
		};		
	};

	$.fn.coffee.defaults = {
		steams				    : ['jQuery','HTML5','HTML6','CSS2','CSS3','JS','$.fn()','char','short','if','float','else','type','case','function','travel','return','array()','empty()','eval','C++','JAVA','PHP','JSP','.NET','while','this','$.find();','float','$.ajax()','addClass','width','height','Click','each','animate','cookie','bug','Design','Julying','$(this)','i++','Chrome','Firefox','Firebug','IE6','Guitar' ,'Music' ,'攻城师' ,'旅行' ,'王子墨','啤酒'], /*漂浮物的类型，种类*/
		steamsFontFamily	: ['Verdana','Geneva','Comic Sans MS','MS Serif','Lucida Sans Unicode','Times New Roman','Trebuchet MS','Arial','Courier New','Georgia'],  /*漂浮物的字体类型*/
		steamFlyTime		  : 5000 , /*Steam飞行的时间,单位 ms 。（决定steam飞行速度的快慢）*/
		steamInterval	    : 500 ,  /*制造Steam时间间隔,单位 ms.*/
		steamMaxSize		  : 30 ,   /*随即获取漂浮物的字体大小*/
		steamHeight	  	  : 200,   /*飞行体的高度*/
		steamWidth	      : 300    /*飞行体的宽度*/
	};
	$.fn.coffee.version = '2.0.0'; // 更新为音符的悬浮---重构的代码
})(Zepto);


},{}],5:[function(require,module,exports){
/* 
* @Author: wanghongxin and fuwei
* @Date:   2015-05-12 14:17:54
* @Last Modified by:   wanghongxin
* @Last Modified time: 2015-06-13 16:39:41
*/

'use strict';
;(function(root,factory){
    var _=window._;
    var $=window.$;
    require('../vender/touch.js');
    module.exports=factory.call(root,_,$);
}(this,function(_,$){
    return function(data,config){
        var html=$('#inter').html();   
        var template=_.template(html);
        $('body').prepend(template(data));
        var Document=$(document);
        var inter=$('.inter');
		var right_menu=$('.right_menu');
		var left_menu=$('.left_menu');
        var showed=true;
        Document.on('tap','.p-ct',slideShow);
		
		_.delay(function(){
			inter.addClass("show");
			right_menu.addClass("show");
			left_menu.addClass("show");
		},300);
		function slideShow(){
			if(showed)
			{
			
                inter.removeClass("show");
				right_menu.removeClass("show");
				left_menu.removeClass("show");
				showed = !showed; 
                _.delay(function(){
                    inter.css('display','none');
                },300);
			}else{
				
				
                inter.css('display','block');
				_.delay(function(){
                    inter.addClass("show");
                    right_menu.addClass("show");
                    left_menu.addClass("show");
                    showed = !showed;
                }, 10);
			}
		}
        // $('.i-good').on('tap',
        //     function(){
        //         $(this).toggleClass('i-red');
        // //     });
        // window.webview={
        //     addRedHeart:function(){},
        //     removeRedHeart:function(){}
        // };
        // webview.addRedHeart();
        // webview.removeRedHeart();
        if(config.saved){
            $('.i-good').css('backgroundPosition','0 -218px');
        }
    }
}));
},{"../vender/touch.js":9}],6:[function(require,module,exports){
/* 
* @Author: wanghongxin
* @Date:   2015-05-12 14:17:54
* @Last Modified by:   wanghongxin
* @Last Modified time: 2015-05-18 10:40:23
*/

'use strict';
;(function(root,factory){//后续模块
    var $=window.$;
    require('./weixin.js');
    module.exports=factory.call(root,$);
}(this,function($){
    return function(opts){
        $(document.body).wx(opts);
    }
}));
},{"./weixin.js":8}],7:[function(require,module,exports){
/* 
* @Author: wanghongxin
* @Date:   2015-05-12 14:17:54
* @Last Modified by:   wanghongxin
* @Last Modified time: 2015-06-16 13:41:19
*/

'use strict';
;(function(root,factory){//后续模块
    var _=window._;
    var $=window.$;
    require('../vender/touch.js');
    // var drag=require('./drag.js');
    var cut=window.cut;
    var www5cn=window.www5cn;
    module.exports=factory.call(root,_,$,cut,www5cn);
}(this,function(_,$,cut,www5cn){
    return function(data,config){
        // console.log(data)
        var temlplate=_.template($('#sidejs').html());
        var isIphone4=($(window).height()==832);
        $('body').prepend(temlplate(data));
        var left_menu=$('.left_menu');
        var right_menu=$('.right_menu');
        var right_side=$('.right_side');
        var left_side=$('.left_side');
        var back=$('.back');
        var imgs=$('.smallImg');
        var pageIndex=$('#pageIndex');
		var inter=$(".inter");
		var catalogueFoter = $(".catalogueFoter");
        var pageTotal=cut._pageNum;
        init();
        function init(){
	
            left_menu.on('tap',showLeft);
            right_menu.on('tap',showRight);
            back.on('tap',hide);
            $('.catalogueContent div').on('tap',toSlide);
            //drag('.catalogueContent');
            styleInit();
            $(window).on('cut',success);
            if(config.attentioned){
                $('.attention').html('取消关注');
            }
			right_side.on("touchmove",function(e){
				
				 e.preventDefault();
			});	 
        }
        
        function success(e,now,pre){
            pageIndex.html(now+1+'/'+pageTotal);
        }

        function showLeft(){
          
            closeSide();
            left_side.
                removeClass('f-hide');
            cut.page_stop();              
			_.delay(function(){
                   
                        left_side.addClass("f-show");
                   
                }, 100);

          _.delay(function(){
                
                right_side.addClass('f-hide');
            }, 300);
        }
        function styleInit(){
            // var rect=$('.catalogueContent').parent().get(0).getBoundingClientRect();
            var Parentheight=$(window).height()-200;
            var smallImgHeight=(Parentheight/4)-10;
            imgs.each(function(index, el) {
                $(el).css({
                        height:smallImgHeight+'px'
                   });
            });
        }
        function showRight(){
          
            closeSide();
            right_side.
                removeClass('f-hide');
            left_side.addClass('f-hide');
            cut.page_stop();
             _.delay(function(){
                   
                        right_side.addClass("f-show");
                   
                }, 100);

        }
		
        function closeSide(){
                right_side.removeClass("f-show");
				left_side.removeClass("f-show");

        }
		
        function toSlide(){
            var now=$(this).index();
            if(cut._pageNow===now){
                return;
            }
            cut.toSlide(now);
            hide();
            cut.page_start();
            $(window).trigger('cut',[now]);
        }

        function hide(){
        
                right_side.removeClass("f-show");
				left_side.removeClass("f-show");

            _.delay(function(){
                left_side.addClass('f-hide');
                right_side.addClass('f-hide');
            }, 300);
            if(cut._pageNum>1){
                cut.page_start();
            }
        }
    }
}));
},{"../vender/touch.js":9}],8:[function(require,module,exports){
/* 
* @Author: wanghongxin
* @Date:   2015-05-08 23:57:28
* @Last Modified by:   wanghongxin
* @Last Modified time: 2015-05-09 00:25:58
*/
;(function($){
    $.fn.wx = function(option){
        // 初始化函数体
        var $wx = $(this);
        var opts = $.extend({},$.fn.wx.defaults,option);  // 继承传入的值

        // 确定微信是否准备好
        document.addEventListener("WeixinJSBridgeReady", function(){
            window.G_WEIXIN_READY = true;
        }, false);

        // 回到函数循环执行
        function CallWeiXinAPI(fn, count){
            var total = 2000;   //30s     
            count = count || 0;
            
            if(true === window.G_WEIXIN_READY || ("WeixinJSBridge" in window)){
                fn.apply(null, []);
            }else{
                if(count <= total){
                    setTimeout(function(){
                        CallWeiXinAPI(fn, count++);
                    }, 15);
                }
            }
        }

        var _unit = {
            /**
             * 执行回调
             * @param Object handler {Function callback, Array args, Object context, int delay}
             */
             execHandler : function(handler){
                if(handler && handler instanceof Object){
                    var callback = handler.callback || null;
                    var args = handler.args || [];
                    var context = handler.context || null;
                    var delay = handler.delay || -1;

                    if(callback && callback instanceof Function){
                        if(typeof(delay) == "number" && delay >= 0){
                            setTimeout(function(){
                                callback.apply(context, args);
                            }, delay);
                        }else{
                            callback.apply(context, args);
                        }
                    }
                }
            },

            /**
             * 合并参数后执行回调
             * @param Object handler {Function callback, Array args, Object context, int delay}
             * @param Array args 参数
             */
            execAfterMergerHandler : function(handler, _args){
                if(handler && handler instanceof Object){
                    var args = handler.args || [];

                    handler.args = _args.concat(args);
                }
                
                this.execHandler(handler);
            }
        }

        // 微信的接口
        var _api = {
            Share : {
                /**
                 * 分享到微博
                 * @param Object options {String content, String url}
                 * @param Object handler
                 */
                "weibo" : function(options, handler){
                    CallWeiXinAPI(function(){
                        WeixinJSBridge.on("menu:share:weibo",function(argv){
                            WeixinJSBridge.invoke('shareWeibo', options, function(res){
                                _unit.execAfterMergerHandler(handler, [res]);
                            });
                        });
                    });
                },
                /**
                 * 分享到微博
                 * @param Object options {
                 *                  String img_url, 
                 *                  Number img_width, 
                 *                  Number img_height, 
                 *                  String link, 
                 *                  String desc, 
                 *                  String title
                 * }
                 * @param Object handler
                 */
                "timeline" : function(options, handler){
                    CallWeiXinAPI(function(){
                        WeixinJSBridge.on("menu:share:timeline",function(argv){
                            WeixinJSBridge.invoke('shareTimeline', options, function(res){
                                if(res.err_msg=='share_timeline:ok'){
                                    _unit.execAfterMergerHandler(handler, [res]);
                                }
                            });
                        });
                    });
                },
                /**
                 * 分享到微博
                 * @param Object options {
                 *                  String appid, 
                 *                  String img_url, 
                 *                  Number img_width, 
                 *                  Number img_height, 
                 *                  String link, 
                 *                  String desc, 
                 *                  String title
                 * }
                 * @param Object handler
                 */
                "message" : function(options, handler){
                    CallWeiXinAPI(function(){
                        WeixinJSBridge.on("menu:share:appmessage",function(argv){
                            WeixinJSBridge.invoke('sendAppMessage', options, function(res){
                                if(res.err_msg=='send_app_msg:ok'||res.err_msg=='send_app_msg:confirm'){
                                    _unit.execAfterMergerHandler(handler, [res]);
                                }
                                
                            });
                        });
                    });
                }
            },
            /**
             * 设置底栏
             * @param boolean visible 是否显示
             * @param Object handler
             */
            "setToolbar" : function(visible, handler){
                CallWeiXinAPI(function(){
                    if(true === visible){
                        WeixinJSBridge.call('showToolbar');
                    }else{
                        WeixinJSBridge.call('hideToolbar');
                    }
                    _unit.execAfterMergerHandler(handler, [visible]);
                });
            },
            /**
             * 设置右上角选项菜单
             * @param boolean visible 是否显示
             * @param Object handler
             */
            "setOptionMenu" : function(visible, handler){
                CallWeiXinAPI(function(){
                    if(true === visible){
                        WeixinJSBridge.call('showOptionMenu');
                    }else{
                        WeixinJSBridge.call('hideOptionMenu');
                    }
                    _unit.execAfterMergerHandler(handler, [visible]);
                });
            },
            /**
             * 调用微信支付
             * @param Object data 微信支付参数
             * @param Object handlerMap 回调句柄 {Handler success, Handler fail, Handler cancel, Handler error}
             */
            "pay" : function(data, handlerMap){
                CallWeiXinAPI(function(){
                    var requireData = {"appId":"","timeStamp":"","nonceStr":"","package":"","signType":"","paySign":""};
                    var map = handlerMap || {};
                    var handler = null;
                    var args = [data];

                    for(var key in requireData){
                        if(requireData.hasOwnProperty(key)){
                            requireData[key] = data[key]||"";
                            console.info(key + " = " + requireData[key]);
                        }
                    }

                    WeixinJSBridge.invoke('getBrandWCPayRequest', requireData, function(response){
                        var key = "get_brand_wcpay_request:";
                        switch(response.err_msg){
                            case key + "ok":
                                handler = map.success;
                                break;
                            case key + "fail":
                                handler = map.fail || map.error;
                                break;
                            case key + "cancel":
                                handler = map.cancel || map.error;
                                break;
                            default:
                                handler = map.error;
                                break;
                        }

                        _unit.execAfterMergerHandler(handler, args);
                    });
                });                
            }
        };

        var opt1 = {
            "content" : opts.con
        };

        var opt2 = {
            "img_url" : opts.img,
            "img_width" : 180,
            "img_height" : 180,
            "link" : opts.link,
            "desc" : opts.con,
            "title" : opts.title
        };

        // var opt3 = $.extend({"appid":"wx21f7e6a981efd178"}, opt2);

        handler = {
            callback : function(){
                //window.location.href='http://mp.weixin.qq.com/s?__biz=MjM5MjQyODk5OA==&mid=200616630&idx=5&sn=f210df44503259ef54fb8f935758fe5a&scene=1#wechat_redirect'
                window.location.href='http://www.5.cn/wap/share?url='+document.URL;
            }
        }

        // 执行函数
        _api.Share.timeline(opt2,handler);
        _api.Share.message(opt2,handler);
        _api.Share.weibo(opt1,handler);

        return $wx;
    }
    $.fn.wx.defaults = {
        title : '5cn,我为你传媒,制作你自己的微杂志', 
        con : '不一样的阅读新方式.颠覆手机新体验！',
        link : document.URL, 
        img  : location.protocol + "//" + location.hostname + ':' + location.port +'/magtemplate/one/img/5.jpg?time=1'
    };

$.fn.wx.version = '1.0.0';

})(Zepto);



},{}],9:[function(require,module,exports){
//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  var touch = {},
    touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
    longTapDelay = 750,
    gesture

  function swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >=
      Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
  }

  function longTap() {
    longTapTimeout = null
    if (touch.last) {
      touch.el.trigger('longTap')
      touch = {}
    }
  }

  function cancelLongTap() {
    if (longTapTimeout) clearTimeout(longTapTimeout)
    longTapTimeout = null
  }

  function cancelAll() {
    if (touchTimeout) clearTimeout(touchTimeout)
    if (tapTimeout) clearTimeout(tapTimeout)
    if (swipeTimeout) clearTimeout(swipeTimeout)
    if (longTapTimeout) clearTimeout(longTapTimeout)
    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
    touch = {}
  }

  function isPrimaryTouch(event){
    return (event.pointerType == 'touch' ||
      event.pointerType == event.MSPOINTER_TYPE_TOUCH)
      && event.isPrimary
  }

  function isPointerEventType(e, type){
    return (e.type == 'pointer'+type ||
      e.type.toLowerCase() == 'mspointer'+type)
  }

  $(document).ready(function(){
    var now, delta, deltaX = 0, deltaY = 0, firstTouch, _isPointerType

    if ('MSGesture' in window) {
      gesture = new MSGesture()
      gesture.target = document.body
    }

    $(document)
      .bind('MSGestureEnd', function(e){
        var swipeDirectionFromVelocity =
          e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
        if (swipeDirectionFromVelocity) {
          touch.el.trigger('swipe')
          touch.el.trigger('swipe'+ swipeDirectionFromVelocity)
        }
      })
      .on('touchstart MSPointerDown pointerdown', function(e){
        if((_isPointerType = isPointerEventType(e, 'down')) &&
          !isPrimaryTouch(e)) return
        firstTouch = _isPointerType ? e : e.touches[0]
        if (e.touches && e.touches.length === 1 && touch.x2) {
          // Clear out touch movement data if we have it sticking around
          // This can occur if touchcancel doesn't fire due to preventDefault, etc.
          touch.x2 = undefined
          touch.y2 = undefined
        }
        now = Date.now()
        delta = now - (touch.last || now)
        touch.el = $('tagName' in firstTouch.target ?
          firstTouch.target : firstTouch.target.parentNode)
        touchTimeout && clearTimeout(touchTimeout)
        touch.x1 = firstTouch.pageX
        touch.y1 = firstTouch.pageY
        if (delta > 0 && delta <= 250) touch.isDoubleTap = true
        touch.last = now
        longTapTimeout = setTimeout(longTap, longTapDelay)
        // adds the current touch contact for IE gesture recognition
        if (gesture && _isPointerType) gesture.addPointer(e.pointerId);
      })
      .on('touchmove MSPointerMove pointermove', function(e){
        if((_isPointerType = isPointerEventType(e, 'move')) &&
          !isPrimaryTouch(e)) return
        firstTouch = _isPointerType ? e : e.touches[0]
        cancelLongTap()
        touch.x2 = firstTouch.pageX
        touch.y2 = firstTouch.pageY

        deltaX += Math.abs(touch.x1 - touch.x2)
        deltaY += Math.abs(touch.y1 - touch.y2)
      })
      .on('touchend MSPointerUp pointerup', function(e){
        if((_isPointerType = isPointerEventType(e, 'up')) &&
          !isPrimaryTouch(e)) return
        cancelLongTap()

        // swipe
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
            (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

          swipeTimeout = setTimeout(function() {
            touch.el.trigger('swipe')
            touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
            touch = {}
          }, 0)

        // normal tap
        else if ('last' in touch)
          // don't fire tap when delta position changed by more than 30 pixels,
          // for instance when moving to a point and back to origin
          if (deltaX < 30 && deltaY < 30) {
            // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
            // ('tap' fires before 'scroll')
            tapTimeout = setTimeout(function() {

              // trigger universal 'tap' with the option to cancelTouch()
              // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
              var event = $.Event('tap')
              event.cancelTouch = cancelAll
              touch.el.trigger(event)

              // trigger double tap immediately
              if (touch.isDoubleTap) {
                if (touch.el) touch.el.trigger('doubleTap')
                touch = {}
              }

              // trigger single tap after 250ms of inactivity
              else {
                touchTimeout = setTimeout(function(){
                  touchTimeout = null
                  if (touch.el) touch.el.trigger('singleTap')
                  touch = {}
                }, 250)
              }
            }, 0)
          } else {
            touch = {}
          }
          deltaX = deltaY = 0

      })
      // when the browser window loses focus,
      // for example when a modal dialog is shown,
      // cancel all ongoing events
      .on('touchcancel MSPointerCancel pointercancel', cancelAll)

    // scrolling the window indicates intention of the user
    // to scroll, not tap or swipe, so cancel all ongoing events
    $(window).on('scroll', cancelAll)
  })

  ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
    'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName){
    $.fn[eventName] = function(callback){ return this.on(eventName, callback) }
  })
})(Zepto)

},{}]},{},[1])