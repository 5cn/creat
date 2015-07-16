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