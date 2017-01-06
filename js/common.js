var screenH = document.documentElement.clientHeight,
    screenW = document.documentElement.clientWidth,
    wraperBox = $(".wraper"),
    containerBox = $(".container"),
    secBox = $(".section-box"),
    sec = $(".section"),
    stimer = null,
    flipBox = $(".flip-box"); 

//设置高宽
function resetSize(){
    wraperBox.css({"width":screenW,"height":screenH});
    containerBox.css({"width":screenW,"height":screenH});
    secBox.css({"width":screenW,"height":screenH}); 
    sec.css({"width":screenW,"height":screenH});    
    flipBox.css({"width":screenW,"height":screenH});
    $(".fy-tips").css({"width":screenW,"height":screenH});
}

function pageScale(){
    var wv = screenW/280,hv = screenH/460,sec = $(".sec-box"),ss= null;
    //宽度比大于高度比
    if((wv-hv)>0){
        ss = hv;
    }
    //高度比大于宽度比
    if((wv-hv)<0){
        ss = wv;
    }
    //高度比等于宽度比
    if((hv-wv)==0){
        if(wv>=1){
            ss = wv;            
        }else{
            ss = wv;        
        }
    }   
    //$(".main").css({"-webkit-transform":"translate3d(-51.5%,-51%,0) scale("+ss*0.875+")"});
    $(".main").css({"-webkit-transform":"scale("+ss*0.875+")"});
};
$(".loading").css({
    "width":screenW,
    "height":screenH
});

var basePath = "images/";
var loadingArr = ["sec1-bg.png","sec1-bg.png","sec2-bg-none.png","sec3-bg-none.png","sec4-bg-none.png"];
var firstImgLoadArr = [];
for (var i = 0; i < loadingArr.length; i++) {
    loadingArr[i] = basePath + loadingArr[i];
}
for (var j = 0; j < firstImgLoadArr.length; j++) {
    firstImgLoadArr[j] = basePath + firstImgLoadArr[j];
}
new mo.Loader(loadingArr, {             
    onLoading: function(count, total) {
        // var loadPercent = Math.floor((count / total) * 100)
        // $(".loadTxt").html(loadPercent + "%");
    },
    onComplete: function(time) {
        $(".wraper").addClass('wraper-show');
        $(".loading").hide();
        $("#sec1").addClass('z5');
        new mo.Loader(firstImgLoadArr, {
            onLoading: function(count, total) {
            },
            onComplete: function(time) {
            }
        })
    }
})  


$("#sec7-3").click(function(){
    $(".share-bg").show();
    $(".share-tips").show();
})       
$(".share-bg").click(function(){
    $(this).hide();
    $(".share-tips").hide();
})
     

//页面执行函数
function pageFun(){
    resetSize();
    pageScale();
}
pageFun();

(function($){    
    $(function(){    
        $("#g1").jFlip(screenW,screenH,{cornersTop:false,scale:"fit"});
    });
})(jQuery);

var onBridgeReady = function () {
    //转发朋友圈 SharePoint2
    WeixinJSBridge.on("menu:share:timeline", function(e) {
        WeixinJSBridge.invoke("shareTimeline", {
            img_url: "http://game.gtimg.cn/images/up/act/a20160318paper/share.jpg",
            img_width: "120",
            img_height: "120",
            link: 'http://up.qq.com/act/a20160318paper/index.htm',
            desc:'你积极学习IP建设理论的样子已成功引起了我的注意，这一刻想和你一起打开泛娱乐生态新局面',
            title:'腾讯互娱泛娱乐大会在京胜利召开'
        }, function(res) {(callback)(res);});
        pgvSendClick({hottag:'up.a20160318paper.relay.quan'});
    });
    //分享给朋友
    WeixinJSBridge.on('menu:share:appmessage', function(argv) {
        WeixinJSBridge.invoke("sendAppMessage", {
            img_url: "http://game.gtimg.cn/images/up/act/a20160318paper/share.jpg",
            img_width: "120",
            img_height: "120",
            link: 'http://up.qq.com/act/a20160318paper/index.htm',
            desc: '你积极学习IP建设理论的样子已成功引起了我的注意，这一刻想和你一起打开泛娱乐生态新局面',
            title: '腾讯互娱泛娱乐大会在京胜利召开'
        }, function(res) {(callback)(res);});
        pgvSendClick({hottag:'up.a20160318paper.relay.friend'});
    });
};
try{document.addEventListener('WeixinJSBridgeReady', function() {
    onBridgeReady();
});}catch(e){};