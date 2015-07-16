/* 
* @Author: wanghongxin
* @Date:   2015-05-08 23:57:28
* @Last Modified by:   wanghongxin
* @Last Modified time: 2015-06-16 13:40:28
*/
;(function(root,factory){//这里存放后续模块
    var media=require('./lib/audio.js');
    var www5cn=window.www5cn;
    factory.call(root,media,www5cn);
}(this,function(media,www5cn){
    //启动音乐模块
    media.init(www5cn.music.src);
}));