/*
* @Author: wanghongxin
* @Date:   2015-05-08 23:57:28
* @Last Modified by:   wanghongxin
* @Last Modified time: 2015-07-08 14:34:30
*/
'use strict';
(function(root,factory){
	var Cut=require('./lib/cut.js');
	var Lottery=require('./lib/lottery.js');
	var $=window.$;
	module.exports.app=factory.call(root,Cut,$,Lottery);//app初始化模块
}(this,function(Cut,$,Lottery){
	return function(){
		//转场模块
		var cut=new Cut();
		window.cut=cut;//cut模块有一些信息，放在这里让广告模块可以获取
        window.car2=cut;//为了让iframe可以获取
		cut.init();
		//这里存放初始化模块
		//这里是lottery模块
		$(window).on('cut',//转场之后要执行的任务放在这里，自定义事件，也叫观察者模式，也叫发布订阅系统
			function(e,now,pre,pages){
                var page1=www5cn.pages[now];
                var page=pages.eq(now);
                var con=page.find('.page-con');
                if(con.hasClass('bkEffects')&&page1.bkEffects[0]){
                    con.addClass(page1.bkEffects[0]);
                    console.log(page1.bkEffects)
                    _.delay(function(){
                        con.removeClass(page1.bkEffects[0]);
                    },1000);
                }
                // console.warn(_.findWhere(page1.effects,{'type':'lottery'}))
                if(!_.findWhere(page1.effects,{'type':'lottery'})){
                	return;
                    
                }else{
                    page1.effects=_.filter(page1.effects,
                        function(item,index){
                            return item.type!='lottery';
                        });
	                var target=page[0],
                        dim=getComputedStyle(target,false),
                        width=parseInt(dim.width),
                        height=parseInt(dim.height),
                        data=www5cn.pages[now].effects,
                        lottery=new Lottery(target,"img/1.jpg",'image',width,height,cb,60,'40');
                    cut.page_stop();    
                    lottery.init();
                }
                function cb(){
                	page.removeClass('lottery');
                    page[0].removeChild(page[0].querySelector('.lottery'));
                    lottery=null;
                    cut.page_start();
                }
			});
        $(window).on('reinit',//重置容器高度的任务放在这里
            function(e,height){
                cut.reinit(height);
            });
		//广告模块
		//媒体模块
		//评论模块
		//目录模块
		//菜单模块
	}
}));
