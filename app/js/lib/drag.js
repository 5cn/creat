/* 
* @Author: wanghongxin
* @Date:   2015-05-08 23:57:28
* @Last Modified by:   wanghongxin
* @Last Modified time: 2015-05-13 16:18:04
*/
;(function(root,factory){
    require('../vender/touch.js');
    var $=window.$;
    module.exports.drag=factory.call(root,$);
}(this,function($){
    return function(target){
        var pos={
            start:0,
            now:0,
            move:0,
            end:0,
            min:null
        };
        $(window).on('touchmove.scroll',preventScroll);
        $(window).on('scroll.scroll',preventScroll);
        var imgs=$(target).find('.smallImg');
        // Math.ceil(imgs.length/2)*imgs
        $(target).on('touchmove',function(e){
            var move=pos.move=e.touches[0].pageY;
            var delta=move-pos.start;
            var _now=pos.end+delta;
            _now=_now>0?0:(_now<pos.min?pos.min:_now);
            var now=pos.now=_now;
            $(this).css({
                'webkitTransform':'translate3d(0,'+now+'px,0)',
                '-webkit-transform':'translate3d(0,'+now+'px,0)',
                'transform':'translate3d(0,'+now+'px,0)'
            });
            e.preventDefault();
        });
        $(target).on('touchstart',function(e){
            pos.start=e.touches[0].pageY;
            var rect=$(target).parent().get(0).getBoundingClientRect();
            var rect0=$(target).find('.smallImg').get(0).getBoundingClientRect();
            pos.min=(rect.bottom-rect.top)-((rect0.bottom-rect0.top+10)*Math.ceil(imgs.length/2));
            e.preventDefault();
        });
        $(target).on('touchend',function(e){
            pos.end=pos.now;
            e.preventDefault();
        });
        
        function preventScroll(e){
            e.preventDefault();
        }
    }
}));