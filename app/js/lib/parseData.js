/* 
* @Author: wanghongxin
* @Date:   2015-05-08 23:57:28
* @Last Modified by:   wanghongxin
* @Last Modified time: 2015-07-09 19:22:04
*/
;(function(root,factory){
    var _=window._;
    var $=window.$;
    module.exports=factory.call(root,_,$);
}(this,function(_,$){
    return function(data) {
                var maga = {};
                data = data.obj;
                // maga.id = data.id;
                // maga.wgUser = data.wgUser;
                // maga.media={
                //     audio:{}
                // };
                console.log(data)
                maga.music={};
                maga.side=[];
                maga.music.src=data.sound;
                maga.music.musicId = data.soundId;
                maga.music.name=data.soundName;
                maga.magazine={
                    readed:data.viewsnum||0,
                    saved:data.recommentsnum||0,
                    comment:data.commentsnum||0
                };
                maga.uid=data.uid;
                maga.wx={
                    title:data.fenxiangtitle,
                    con:data.fenxiangnote,
                    img:data.imagePic
                }
                maga.pages = _.map(data.pageslist,
                    function(item, index) {
                        var page = {
                            uniqueId:_.uniqueId('page_'),
                            order: item.pageNum,
                            effects:_.map(item.effects,
                                function(item,index){
                                    item.value=JSON.parse(item.value);
                                    return item;
                                }),
                            bkEffects:(function(){
                                if('styles' in item.backgroundImage){
                                    return _.chain(item.backgroundImage.styles)
                                                .filter(function(item,index,list){
                                                    return item.type=='action';
                                                })
                                                .map(function(item,index,list){
                                                    return item.key;
                                                }).value();
                                }else{
                                    return []
                                }
                            }()),
                            bkColor:item.backgroundImage.fillcolor,
                            bkOpacity:item.backgroundImage.opacityOpacity||1,
                            background: {
                                style:{
                                    'background-color': item.backgroundImage.fillcolor,
                                    'background-image': item.backgroundImage.image?item.backgroundImage.image.url:'',
                                    'background-repeat':'no-repeat',
                                    'background-position':'30px 30px',
                                    'background-size':'100% 100%'
                                    // 'opacity':item.backgroundImage.opacityOpacity||1
                                },
                                effects:[]
                            },
                            floatages: _.map(item.elementsList,
                                function(item, index) {
                                    var element;
                                    switch (item.elementType) {
                                        case 'img':
                                            element={
                                                type:'image',
                                                style:{
                                                    width:item.elementChild.width,
                                                    height:item.elementChild.height,
                                                    position:item.elementChild.position,
                                                    'background-color':item.elementChild.fillColor,
                                                    opacity:item.opacityOpacity,
                                                    shadow:item.shadow,
                                                    'animation-duration':item.animationDuration,
                                                    '-webkit-animation-duration':item.animationDuration,
                                                    'animation-delay':item.animationDelay,
                                                    '-webkit-animation-delay':item.animationDelay,
                                                },
                                                preStyle:{
                                                    left:item.positionX,
                                                    top:item.positionY,
                                                    width:item.width,
                                                    height:item.height,
                                                    'transform':'rotate('+(item.rotation||0)+'deg)',
                                                    '-webkit-transform':'rotate('+(item.rotation||0)+'deg)',
                                                    'position':'absolute',
                                                    'padding-left':item.paddingleft,
                                                    'padding-right':item.paddingright,
                                                    'padding-top':item.paddingtop,
                                                    'padding-bottom':item.paddingbottom
                                                },
                                                bkRotate:'rotate('+item.rotation+'deg)',
                                                bkLeft:item.positionX,
                                                bkTop:item.positionY,
                                                src:item.elementChild.image.url,
                                                effects:_.map(item.styles,
                                                    function(item,index){
                                                        return item.key;
                                                    })
                                            };
                                            break;
                                        case 'shape':
                                            element={
                                                type:'shape',
                                                preStyle:{
                                                    left:item.positionX,
                                                    top:item.positionY,
                                                    width:item.width,
                                                    height:item.height,
                                                    'transform':'rotate('+(item.rotation||0)+'deg)',
                                                    '-webkit-transform':'rotate('+(item.rotation||0)+'deg)',
                                                    'position':'absolute',
                                                    'padding-left':item.paddingleft,
                                                    'padding-right':item.paddingright,
                                                    'padding-top':item.paddingtop,
                                                    'padding-bottom':item.paddingbottom
                                                },
                                                bkRotate:'rotate('+item.rotation+'deg)',
                                                bkLeft:item.positionX,
                                                bkTop:item.positionY,
                                                // effects:_.map(item.styles,
                                                //     function(item,index){
                                                //         return item.key;
                                                //     }),
                                                effects:_.chain(item.styles).
                                                            filter(function(item,index) {
                                                                return item.type=='action';
                                                            }).
                                                            map(function(item,index){
                                                                return item.key
                                                            }).value(),
                                                src:'../images/'+_.find(item.styles,
                                                        function(item,index){
                                                            return item.type=='shape';
                                                        })['key']+'.png',
                                                style:{
                                                    width:item.elementChild.width,
                                                    height:item.elementChild.height,
                                                    'background-color':item.elementChild.fillColor,
                                                    opacity:item.opacityOpacity,
                                                    'animation-duration':item.animationDuration,
                                                    '-webkit-animation-duration':item.animationDuration,
                                                    'animation-delay':item.animationDelay,
                                                    '-webkit-animation-delay':item.animationDelay,
                                                },

                                            };
                                            element.style['-webkit-mask']='url('+element.src+') 0px 0px round';
                                            break;
                                        case 'btn':
                                            element={
                                                type:'btn',
                                                style:{
                                                    width:item.width,
                                                    'animation-duration':item.animationDuration,
                                                    '-webkit-animation-duration':item.animationDuration,
                                                    'animation-delay':item.animationDelay,
                                                    '-webkit-animation-delay':item.animationDelay
                                                }, 
                                                preStyle:{
                                                    'font-size':item.elementChild.fontsize,
                                                    'color':item.elementChild.fontcolor,
                                                    opacity:item.opacityOpacity,
                                                    'box-shadow':'black 0px 0px '+item.shadow,
                                                    'background-color':item.elementChild.backgroundcolor,
                                                    'border-color':item.elementChild.border,
                                                    'border-width':item.elementChild.borderstyle,
                                                    'border-style':item.elementChild.bordercrude,
                                                    'border-radius':item.elementChild.fillet,
                                                    left:item.positionX,
                                                    top:item.positionY,
                                                    width:item.width,
                                                    height:item.height,
                                                    'transform':'rotate('+(item.rotation||0)+'deg)',
                                                    '-webkit-transform':'rotate('+(item.rotation||0)+'deg)',
                                                    'position':'absolute',
                                                    'padding-left':item.paddingleft,
                                                    'padding-right':item.paddingright,
                                                    'padding-top':item.paddingtop,
                                                    'padding-bottom':item.paddingbottom
                                                },
                                                bkRotate:'rotate('+item.rotation+'deg)',
                                                bkLeft:item.positionX,
                                                bkTop:item.positionY,
                                                src:item.elementChild.url,
                                                value:item.elementChild.context,
                                                effects:_.map(item.styles,
                                                    function(item,index){
                                                        return item.key;
                                                    })
                                            };
                                            break;
                                        case 'text':
                                            element={
                                                type:'text',
                                                style:{
                                                    width:item.width,
                                                    height:item.height,
                                                    color:item.elementChild.color,
                                                    opacity:item.opacityOpacity,
                                                    shadow:item.shadow,
                                                    'font-size':item.elementChild.fontsize,
                                                    'background':item.elementChild.backgroundColor,
                                                    'animation-duration':item.animationDuration,
                                                    '-webkit-animation-duration':item.animationDuration,
                                                    'animation-delay':item.animationDelay,
                                                    '-webkit-animation-delay':item.animationDelay,
                                                    // borderColor:item.elementChild.border,
                                                    // borderWidth:item.elementChild.borderstyle,
                                                    'border-style':item.elementChild.bordercrude,
                                                    'line-height':item.elementChild.lineHeight
                                                },
                                                preStyle:{
                                                    left:item.positionX,
                                                    top:item.positionY,
                                                    width:item.width,
                                                    height:item.height,
                                                    'transform':'rotate('+(item.rotation||0)+'deg)',
                                                    '-webkit-transform':'rotate('+(item.rotation||0)+'deg)',
                                                    'position':'absolute', 
                                                    'padding-left':item.paddingleft,
                                                    'padding-right':item.paddingright,
                                                    'padding-top':item.paddingtop,
                                                    'padding-bottom':item.paddingbottom
                                                },
                                                bkRotate:'rotate('+item.rotation+'deg)',
                                                bkLeft:item.positionX,
                                                bkTop:item.positionY,
                                                textClass:item.elementChild.fontstyle,
                                                textAlign:item.elementChild.alignmentFunction,
                                                value:item.elementChild.content.split('##'),
                                                effects:_.map(item.styles,
                                                    function(item,index){
                                                        return item.key;
                                                    })
                                            };
                                            break;
                                    }
                                    // element.uniqueId=_.uniqueId('floatage_');
                                    return element;
                                })
                        };
                        if(item.backgroundImage.image){
                            maga.side.push({
                                src:item.backgroundImage.image.suolueUrl
                            })
                        }else{
                            maga.side.push({
                                backgroundColor:item.backgroundImage.fillcolor
                            });
                            page.noBk='no';
                        }
                        return page;
                    });
                return maga;
            }
}));