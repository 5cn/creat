/*
* @Author: wanghongxin
* @Date:   2015-05-08 23:57:28
* @Last Modified by:   wanghongxin
* @Last Modified time: 2015-07-09 14:39:36
*/
'use strict';
(function(root,factory){//这里是加载数据模块，也是启动模块，有了数据才能启动初始化模块
    //业务模块，跟业务相关的具体逻辑，跟数据相关的具体逻辑，都放在这里，这里也是真正的启动模块;
    var app=require('./init.js');
    var _=require('./vender/underscore.js');
    require('./vender/ajax.js');
    var parseData=require('./lib/parseData.js');
    var data=factory.call(root,app.app,_,parseData);//加载数据模块
    var config={
        'ad':false,
        'follow_auto':['./js/bin/follow_auto.js'],
        'follow_auto_min':['./js/bin/follow_auto.min.js'],
        'onlyMusic':['./js/bin/follow_iframe_music.js'],
        'onlyMusic_min':['./js/bin/follow_iframe_music.min.js']
    };
    _.extend(ldzx.config,config);
    var isIframe=!(self==top);
    checkContext(isIframe);
    function checkContext(isIframe){
        if(!isIframe){
            data(config.follow_auto_min);
        }else{
            data(config.onlyMusic_min);
        }
    }
    //启动初始化模块，并加载传入的后续模块
}(this,function(app,_,parseData){

    function getScript(url){
        var script=document.createElement('script');
        script.defer=true;//非阻塞ui
        script.src=url;
        document.body.appendChild(script);
    }
    return function(targets){
        var magaTpl=_.template($('#maga').html());
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
                    return item.key=='topicid';
                });
            if (!id) {return 0};
            var unsafeId=id.value;
            var safeId=id.value.replace(/[^\d\w]/,'');
            return safeId;
        }
        function parseUrl(search,key){
            console.log(search)
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
                    return item.key==key;
                });
            if (!id) {return null};
            var unsafeId=id.value;
            var safeId=id.value.replace(/[^\d\w]/,'');
            return parseInt(safeId);
        }
        function securityCheck(data,cb,url){
            if(!data){
                // window.location.href=url;
            }
            var value=parseUrl(location.search,'isuser');
            console.log(value);
            if(value===1){
                cb();
            }else if(data.islook===1&&data.ishide===0&&data.status===2){
                cb();
            }else{
                window.location.href=url;
                // throw new URIError('杂志权限检查失败,这里将要跳转到下载页;^_^')
            }
        }
        function iframeCheck(){
            if(!(top==self)){
                var transformNode=$('.p-ct')[0];
                transformNode.style.transform = "scale(0.5)";
                transformNode.style.WebkitTransform = "scale(0.5)";
                transformNode.style.MozTransform = "scale(0.5)";
                transformNode.style.MsTransform = "scale(0.5)";
                transformNode.style.OTransform = "scale(0.5)";
                transformNode.style.background = "#fff";
                transformNode.style.position = "absolute";
                transformNode.style.top = "-242px";
                transformNode.style.left = "-185px";
                $('.u-arrow').css({
                    bottom:0
                });
                $('.m-page').css('background','');
                $(window).trigger('reinit',[960]);
                var parent=window.parent;
                var pdoc=parent.document;
                var logic={
                    up:function(){
                        car2.slideUp();
                    },
                    down:function(){
                        car2.slideDown();
                    }
                }
                // $(parent).on('load');
                !function(){
                    var $$=parent.$;
                    $$(parent).on('click','.pre.btn',
                        function(e){
                            logic.up();
                        });
                    $$(parent).on('click','.next.btn',
                        function(e){
                            logic.down();
                        });
                }();
            }
        }
        function parseJSON(data){
            if('JSON' in window){
                return JSON.parse(data);
            }else{
                return eval("("+data+")");
            }
        }
        function transformJSON(data){
            if('JSON' in window){
                return JSON.stringify(data);
            }else{
                return data.toString();
            }
        }
        // if('performance' in window){
        //     // window.start=Date.now();
        //     // window.latency=(start-performance.timing.navigationStart)/1000
        //     // console.info(latency+'s past from http request initializing;ajax begin;')
        // }
        // 
        // alert('我来到了获取数据页面')
        var magaId=findId(window.location.search);
        if(magaId){
            $.ajax({
                'url':'http://mookservice.5.cn/inner/magazine/getmagazineOneByTopic.json',
                'dataType':'json',
                'type':'post',
                'data':{"params":JSON.stringify({"topicid":magaId||0})},
                'success':function(data){
                    document.querySelector('title').innerHTML=data.obj.varName;
                    // console.log(data)
                    window.nativeData=data;
                    // window.now=Date.now();
                    // console.info('magazine\'data loaded and costed '+(window.now-start)/1000+' s;')
                    var newData=parseData(data);
                    var check;
                    // console.info('data parsed',newData);
                    window.www5cn=newData;
                    www5cn.magaId=magaId;
                    $('body').prepend(magaTpl(newData));
                    var pageNums=newData.pages.length;
                    var real_init=_.after(pageNums>3?3:pageNums,initialize);
                    var preLoadList=_.first(newData.pages,3);
                    _.each(preLoadList,function(item){
                        var img=new Image();
                        img.onload=real_init;
                        img.onerror=real_init;
                        img.src=item.background.style['background-image'].replace(/url\((.{0,})\)/,'$1');
                    });
                    console.log(data)
                    if(data.code==200){
                        check={
                            ishide:parseInt(data.obj.ishide),
                            islook:parseInt(data.obj.islook),
                            status:parseInt(data.obj.status)
                        }
                    }
                    function initialize(){
                        //初始化模块执行
                        // app();
                        securityCheck(check,app,'http://mookservice.5.cn/page/installApp.json');
                        iframeCheck();
                        $(window).trigger('cut',[0,0,$('.m-page')])
                        // console.info('app initialized and it costed '+(Date.now()-window.now)/1000+'s from html rended')
                        //同步执行完毕，进入下一阶段
                        //加载后续模块
                        // console.info('following modules begin loading;')
                        _.each(targets,getScript);
                    }
                },
                'error':function(error){
                    console.error(error);
                    alert('Error() :read remote data failed;\n'+'Reason '+error.statusText+':'+error.status+'\nWhen it happens, ask for help from background\' development!');
                }
            });
        }else{
            throw new Error('invalid url');
        }
    }
}));
