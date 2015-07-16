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