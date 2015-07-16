(function(){var e=-1;var t=parseInt(window.screen.width);var i=t/640;var n=navigator.userAgent;if(/Android (\d+\.\d+)/.test(n)){var a=parseFloat(RegExp.$1);if(a>2.3){document.write('<meta name="viewport" content="width=640, minimum-scale = '+i+", maximum-scale = "+i+', target-densitydpi=device-dpi">')}else{document.write('<meta name="viewport" content="width=640, target-densitydpi=device-dpi">')}}else{document.write('<meta name="viewport" content="width=640, user-scalable=no, target-densitydpi=device-dpi">')}})();
var ldzx=ldzx||{
    config:{
        saved:false,
        attentioned:false,
        isApp:false
    },
    ctrl:{
        _prevent:function(e){
            e.preventDefault();
        },
        stop:function(){
         /*   $(window).on('touchmove.scroll',ldzx.ctrl._prevent);*/
      
        },
        start:function(){
           /* $(window).off('touchmove.scroll',ldzx.ctrl._prevent);*/
            
        }
    }
};
var isFireFox=navigator.userAgent.search(/FireFox/i)>-1;
if(isFireFox){
    var html=document.querySelector('html');
    html.style.overflow='hidden';
    html.style.width='100%';
    html.style.fontFamily='Microsoft YaHei';
}