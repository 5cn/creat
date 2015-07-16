/*
* @Author: wanghongxin
* @Date:   2015-05-08 23:57:28
* @Last Modified by:   wanghongxin
* @Last Modified time: 2015-06-29 15:56:57
*/
;(function(root,factory){//这里存放后续模块
    var media=require('./lib/audio.js');
    var side=require('./lib/side.js');
    var interaction=require('./lib/interaction.js');
    var share=require('./lib/share.js');
    var www5cn=window.www5cn;
    var ldzx=window.ldzx;
    var advert;
    if(ldzx.config.ad){
        advert=require('./lib/banner.js');
    }
    factory.call(root,media,side,interaction,share,www5cn,advert,ldzx);
}(this,function(media,side,interaction,share,www5cn,advert,ldzx){
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
    if(ldzx.config.ad){
        advert(100,{
            'gdt_banner.js':[1,80],
            '5cn_banner.js':[81,100]
        },'http://img0.hx.com/magazine0120/js/');
    }
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