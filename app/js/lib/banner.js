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

