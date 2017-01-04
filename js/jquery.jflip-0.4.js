/*
 * jFlip plugin for jQuery v0.4 (28/2/2009)
 * 
 * A plugin to make a page flipping gallery    
 *
 * Copyright (c) 2008-2009 Renato Formato (rformato@gmail.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *    
 */
var screenH = document.documentElement.clientHeight,
    screenW = document.documentElement.clientWidth,
    middlev = parseInt(screenW/2),
    ss = 0,
    page = 5,
    nowPage = 1,
    moveXcount = 0,
    changeValue = true,
    mainP = document.getElementById("container"),
    count_data={
        touchStartX: 0,
        touchEndX: 0,
        moveX: 0,
        nowX:0,
        nowP:1
    },
    ratio = 0,
    tv = 0,
    lv =0,
    delayTimer = null,
    aniTimer1 = null,
    aniTimer2 = null,
    aniTimer3 = null,
    aniTimer4 = null,
    aniTimer5 = null,
    aniTimer6 = null,
    aniTimer7 = null,
    aniTimer8 = null,
    aniTimer9 = null,
    aniTimer10 = null,
    aniTimer11 = null,
    aniTimer12 = null,
    aniTimer13 = null,
    aniTimer14 = null; 
(function($){
    var wv = screenW/280,hv = screenH/460;
    //瀹藉害姣斿ぇ浜庨珮搴︽瘮
    if((wv-hv)>0){
      ss = hv;
    }
    //楂樺害姣斿ぇ浜庡搴︽瘮
    if((wv-hv)<0){
      ss = wv;
    }
    //楂樺害姣旂瓑浜庡搴︽瘮
    if((hv-wv)==0){
      if(wv>=1){
        ss = wv;      
      }else{
        ss = wv;    
      }
    } 
    var Flip = function(canvas,width,height,images,opts) {
      //private vars
      opts = $.extend({
        background:"green",
        cornersTop:true,
        scale:"noresize"
      },opts);
      var obj = this,
      el = canvas.prev(),
      index = 0,
      init = false,
      bgInit = true,
      background = opts.background,
      cornersTop = opts.cornersTop,
      gradientColors = opts.gradientColors || ['#777170','#d8d6d5','#fff'],
      curlSize = opts.curlSize || 0.1,
      scale = opts.scale,
      patterns = [],
      canvas2 = canvas.clone(),
      ctx2 = $.browser.msie?null:canvas2[0].getContext("2d"),
      canvas = $.browser.msie?$(G_vmlCanvasManager.initElement(canvas[0])):canvas,
      ctx = canvas[0].getContext("2d"),
      loaded = 0;
      var bgImg = new Image();  
          bgImg.src = "images/bg.jpg";
      // bgImg.onload = function(){
      //   bgInit = true;
      // }      
      var images = images.each(function(i){
        if(patterns[i]) return;
        var img = this;
        img.onload = function() {
          var r = 1;
          if(scale!="noresize") {
            var rx = width/this.width,
            ry = height/this.height;
            // var rx = 280*ss/this.width,
            // ry = 460*ss/this.height;
            if(scale=="fit"){
              //r = (rx<1 || ry<1)?Math.min(rx,ry):1;
              if(rx>ry){
                r = ry
              }
              if(rx<ry){
                r=rx
              }
            }              
            if(scale=="fill") {
              r = Math.min(rx,ry);
            }
          };
          $(img).data("flip.scale",r);
          patterns[i] = ctx.createPattern(img,"no-repeat");
          loaded++;
          if(loaded==images.length && !init) {
            init = true;
            draw();
          }
        };
        if(img.complete)
          window.setTimeout(function(){img.onload()},10);
      }).get();      
    // polyfill 鎻愪緵浜嗚繖涓柟娉曠敤鏉ヨ幏鍙栬澶囩殑 pixel ratio
    var getPixelRatio = function(context) {
        var backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;
        return (window.devicePixelRatio || 1) / backingStore;
    };
    var ratio = getPixelRatio(ctx);
      var
        width = width,height = height,mX = width,mY = height,
        basemX = mX*(1-curlSize), basemY = mY*curlSize,sideLeft = false,
        off = $.browser.msie?canvas.offset():null,
        onCorner = false,
        curlDuration=400,curling = false,
        animationTimer,startDate,
        flipDuration=700,flipping = false,baseFlipX,baseFlipY,
        lastmX,lastmY,
        inCanvas = false,
        mousedown = false,
        dragging = false;
      $(window).scroll(function(){
              //off = canvas.offset(); //update offset on scroll
      });
      
      //IE can't handle correctly mouseenter and mouseleave on VML 
      var c = $.browser.msie?(function(){
          var div = $("<div>").width(width).height(height).css({position:"absolute",cursor:"default",zIndex:1}).appendTo("body");
          //second hack for IE7 that can't handle correctly mouseenter and mouseleave if the div has no background color 
          if(parseInt($.browser.version)==7)
            div.css({opacity:0.000001,background:"#FFF"});
          var positionDiv = function() {
            off = canvas.offset();
            return div.css({left:off.left+'px',top:off.top+'px'});
          }
          $(window).resize(positionDiv);
          return positionDiv();
      })():canvas;
      c.mousemove(function(e){
        //track the mouse
        /*
        if(!off) off = canvas.offset(); //safari can't calculate correctly offset at DOM ready
        mX = e.clientX-off.left;
        mY = e.clientY-off.top;
        window.setTimeout(draw,0);
        return;
        */
        if(!off)
          off = canvas.offset(); //safari can't calculate correctly offset at DOM ready
        
        if(mousedown && onCorner) {
          if(!dragging) {
            dragging = true;
            window.clearInterval(animationTimer);
          }
          mX = !sideLeft?e.pageX-off.left:width-(e.pageX-off.left);
          mY = cornersTop?e.pageY-off.top:height-(e.pageY-off.top);
          window.setTimeout(draw,0);
          return false;        
        }
        
        lastmX = e.pageX||lastmX, lastmY = e.pageY||lastmY;
        if(!flipping) {
          sideLeft = (lastmX-off.left)<width/2;
          //cornersTop = (lastmY-off.top)<height/2;
        }
        if(!flipping && 
          ((lastmX-off.left)>basemX || (lastmX-off.left)<(width-basemX)) && 
          ((cornersTop && (lastmY-off.top)<basemY) || (!cornersTop && (lastmY-off.top)>(height-basemY)))) {
          if(!onCorner) {
            onCorner= true;
            c.css("cursor","pointer");          
          }
        } else {
          if(onCorner) {
            onCorner= false;
            c.css("cursor","default");
          }
        };
        return false;
      }).bind("mouseenter",function(e){
        inCanvas = true;
        if(flipping) return;
        window.clearInterval(animationTimer);
        startDate = new Date().getTime();
        animationTimer = window.setInterval(cornerCurlIn,10);
        return false;
      }).bind("mouseleave",function(e){
        inCanvas = false;
        dragging = false;
        mousedown = false;
        if(flipping) return;
        window.clearInterval(animationTimer);
        startDate = new Date().getTime();
        animationTimer = window.setInterval(cornerCurlOut,10);
        return false;
      }).click(function(){
        if(onCorner && !flipping) {
          flipping = true;
          c.triggerHandler("mousemove");
          window.clearInterval(animationTimer);
          startDate = new Date().getTime();
          baseFlipX = mX;
          baseFlipY = mY;
          animationTimer = window.setInterval(flip,10);
          index += sideLeft?-1:1;
          if(index<0) index = images.length-1;
          //if(index==images.length) index = 0;
          el.trigger("flip.jflip",[index,images.length]);
        }
        return false;
      }).mousedown(function(){
        dragging = false;
        mousedown = true;
        return false;
      }).mouseup(function(){
        mousedown = false;
        return false;
      });
        function hideSec(){
            secBox.hide();
        }
        function showSec(){
            secBox.show();
        }
        function hideCanvas(){
            flipBox.hide();
        }
        function showCanvas(){
            flipBox.show();
        }
      mainP.addEventListener('touchstart', function (e) {
          count_data.touchStartX = e.touches[0].clientX;//浼犻€掕捣濮嬩綅缃�
      },false);
      mainP.addEventListener('touchmove', function (e) {  
          e.preventDefault();
          if (e.targetTouches.length == 1) {
              var touch = e.changedTouches[0];    
              moveXcount = touch.pageX - count_data.touchStartX;//浣嶇Щ  
              count_data.moveX = moveXcount;
          }
      },false);
      mainP.addEventListener('touchend', function (e) {
          if(count_data.touchStartX>=middlev){
                if(nowPage<5){
                    onCorner = true;
                    sideLeft = false;
                    if(changeValue){
                        changeValue = false;
                        setTimeout(function(){
                            showCanvas();
                            setTimeout(function(){
                                hideSec()
                            }, 30)
                        }, 30)
                        c.click();
                        //$(".fy-tips").hide();
                        clearTimeout(delayTimer);
                    }                    
                }
                // else if(nowPage == 7){
                //   $(".share-bg").show();
                //   $(".share-tips").show();                    
                // } 
          }else{
            if(nowPage>1){
                onCorner = true;
                sideLeft = true;
                if(changeValue){
                    changeValue = false;
                    setTimeout(function(){
                        showCanvas();
                        setTimeout(function(){
                            hideSec()
                        }, 30)
                    }, 30)
                    c.click();
                    //$(".fy-tips").hide();
                    clearTimeout(delayTimer)
                }                    
            } 
            if(nowPage != 5){
                  $(".share-bg").hide();
                  $(".share-tips").hide();               
            }
          }                                 
          if(nowPage == 1){
            clearInterval(aniTimer1);
          }
          if(nowPage == 2){
            clearInterval(aniTimer2);
            clearInterval(aniTimer3); ;
          }
          if(nowPage == 3){
            clearInterval(aniTimer9);
            clearInterval(aniTimer10);
            clearInterval(aniTimer11);
          }
          if(nowPage == 4){
            $(".fy-tips").hide();
            clearInterval(aniTimer7);
            clearInterval(aniTimer8);
          }
          if(nowPage == 5){
            clearInterval(aniTimer12);
            clearInterval(aniTimer13);
            clearInterval(aniTimer14);
          }
          count_data.touchStartX= 0;
          count_data.touchEndX = 0;
          count_data.moveX = 0;
          moveXcount = 0;
      },false);


      var flip = function() {             
        var date = new Date(),delta = date.getTime()-startDate;
        if(delta>=flipDuration) {
            //缈婚〉鍔ㄧ敾缁撴潫鏃�
          window.clearInterval(animationTimer);          
            setTimeout(function(){
                secBox.show(); 
                setTimeout(function(){
                    flipBox.hide();
                    changeValue = true;                    
                }, 30)
            }, 30) 
          if(sideLeft) {           
            $("#sec"+nowPage).removeClass('z5');
            nowPage--;
            if(nowPage<1){
                nowPage = 5
            }
            $("#sec"+nowPage).addClass('z5');
            images.unshift(images.pop());
            patterns.unshift(patterns.pop());   
            aniJudg();   
          } else {
            $("#sec"+nowPage).removeClass('z5');
            nowPage++;
            if(nowPage>5){
                nowPage = 1;
            }
            $("#sec"+nowPage).addClass('z5');
            images.push(images.shift());
            patterns.push(patterns.shift());  
            aniJudg();    
          }
          mX = width;
          mY = height; 
          draw();
          flipping = false;
          //init corner move if still in Canvas
          if(inCanvas) {
            startDate = new Date().getTime();
            animationTimer = window.setInterval(cornerCurlIn,10);
            c.triggerHandler("mousemove");
          } 
          return;
        }
        //da mX a -width  (mX+width) in duration millisecondi 
        mX = baseFlipX-2*(width)*delta/flipDuration;
        mY = baseFlipY+2*(height)*delta/flipDuration;
        draw();
      },
      cornerMove =  function() {
        var date = new Date(),delta = date.getTime()-startDate;
        
        mX = basemX+Math.sin(Math.PI*2*delta/1000);
        mY = basemY+Math.cos(Math.PI*2*delta/1000);
        drawing = true;
        window.setTimeout(draw,0);
      },
      cornerCurlIn = function() {
        var date = new Date(),delta = date.getTime()-startDate;
        if(delta>=curlDuration) {
          window.clearInterval(animationTimer);
          startDate = new Date().getTime();
          animationTimer = window.setInterval(cornerMove,10);        
        }      
        mX = width-(width-basemX)*delta/curlDuration;
        mY = basemY*delta/curlDuration;
        draw();    
      },
      cornerCurlOut = function() {
        var date = new Date(),delta = date.getTime()-startDate;
        if(delta>=curlDuration) {
          window.clearInterval(animationTimer);
        }      
        mX = basemX+(width-basemX)*delta/curlDuration;
        mY = basemY-basemY*delta/curlDuration;
        draw();    
      },
      curlShape = function(m,q) {
        //cannot draw outside the viewport because of IE blurring the pattern
        var intyW = m*width+q,intx0 = -q/m;
        if($.browser.msie) {
          intyW = Math.round(intyW);
          intx0 = Math.round(intx0);
        };
        ctx.beginPath();
        ctx.moveTo(width,Math.min(intyW,height));
        ctx.lineTo(width,0);
        ctx.lineTo(Math.max(intx0,0),0);
        if(intx0<0) {
          ctx.lineTo(0,Math.min(q,height));
          if(q<height) {
            ctx.lineTo((height-q)/m,height);
          }
          ctx.lineTo(width,height);
        } else {
          if(intyW<height)
            ctx.lineTo(width,intyW);
          else {
            ctx.lineTo((height-q)/m,height);
            ctx.lineTo(width,height);
          }
        }
      },
      draw = function() {
        if(!init || !bgInit) return;
        if($.browser.msie){
          ctx.clearRect(0,0,width,height);
        }
        // ctx.fillStyle = background;
        // ctx.fillRect(0,0,width,height);  
        //ctx.drawImage(images[6],0,0,screenW,screenH);
        ctx.drawImage(bgImg,0,0,screenW*ratio,screenH*ratio);
        var img = images[0], r = $(img).data("flip.scale"); 
        //ctx.drawImage(img,(width-img.width/2*ss*0.875)/2-img.width/2*ss*0.875*0.015,(height-img.height/2*ss*0.875)/2-img.height/2*ss*0.875*0.01,img.width/2*ss*0.875*ratio,img.height/2*ss*0.875*ratio);
        ctx.drawImage(img,(width*ratio-img.width/2*ss*0.875*ratio)/2-img.width/2*ss*0.875*0.015*ratio,(height*ratio-img.height/2*ss*0.875*ratio)/2-img.height/2*ss*0.875*0.01*ratio,img.width/2*ss*0.875*ratio,img.height/2*ss*0.875*ratio);
      lv = (width-img.width/2*ss*0.875)/2-img.width/2*ss*0.875*0.015;
      tv = (height-img.height/2*ss*0.875)/2-img.height/2*ss*0.875*0.01;
      $(".section").css({
        "top":tv,
        "left":lv
      })

        if(mY && mX!=width) {          
          var m = 2,
              q = (mY-m*(mX+width))/2;
              m2 = mY/(width-mX),
              q2 = mX*m2;
          if(m==m2) return;

          var sx=1,sy=1,tx=0,ty=0;
          ctx.save();
          if(sideLeft) {
            tx = width;
            sx = -1;
          }
          if(!cornersTop) {
            ty = height;
            sy = -1;
          }
          ctx.translate(tx,ty);
          ctx.scale(sx,sy);
          //draw page flip
          //intx,inty is the intersection between the line of the curl and the line
          //from the canvas corner to the curl point 
          var intx = (q2-q)/(m-m2);
          var inty = m*intx+q;
          //y=m*x+mY-m*mX line per (mX,mY) parallel to the curl line
          //y=-x/m+inty+intx/m line perpendicular to the curl line
          //intersection x between the 2 lines = int2x
          //y of perpendicular for the intersection x = int2y 
          //opera do not fill a shape if gradient is finished
          var int2x = (2*inty+intx+2*m*mX-2*mY)/(2*m+1);
          var int2y = -int2x/m+inty+intx/m;
          var d = Math.sqrt(Math.pow(intx-int2x,2)+Math.pow(inty-int2y,2));
          var stopHighlight = Math.min(d*0.5,30);
          
          var c;
          if(!($.browser.mozilla && parseFloat($.browser.version)<1.9)) {
            c = ctx;
          } else {
            c = ctx2;
            c.clearRect(0,0,width,height);
            c.save();
            c.translate(1,0); //the curl shapes do not overlap perfeclty
          }
          var gradient = c.createLinearGradient(intx,inty,int2x,int2y);
          gradient.addColorStop(0, gradientColors[0]);
          gradient.addColorStop(stopHighlight/d, gradientColors[1]);
          gradient.addColorStop(1, gradientColors[2]);
          c.fillStyle = gradient;
          c.beginPath();
          c.moveTo(-q/m,0);
          c.quadraticCurveTo((-q/m+mX)/2+0.02*mX,mY/2,mX,mY);
          c.quadraticCurveTo((width+mX)/2,(m*width+q+mY)/2-0.02*(height-mY),width,m*width+q);
          if(!($.browser.mozilla && parseFloat($.browser.version)<1.9)) {
            c.fill();
          } else {
            //for ff 2.0 use a clip region on a second canvas and copy all its content (much faster)
            c.save();
            c.clip();
            c.fillRect(0,0,width,height);
            c.restore();
            ctx.drawImage(canvas2[0],0,0);
            c.restore();      
          }
          //can't understand why this doesn't work on ff 2, fill is slow
          /*
          ctx.save();
          ctx.clip();
          ctx.fillRect(0,0,width,height);
          ctx.restore();
          */
          gradient = null;
                    
          //draw solid color background
          ctx.fillStyle = background;
          curlShape(m,q);
          ctx.fill(); 

          //draw back image
          curlShape(m,q);
          //safari and opera delete the path when doing restore
          if(!$.browser.safari && !$.browser.opera){            
           ctx.restore();  
          }        

          var img = sideLeft?images[images.length-1]:images[1];
          r = $(img).data("flip.scale");
          if($.browser.msie) {
            //excanvas does not support clip
            ctx.fillStyle = sideLeft?patterns[patterns.length-1]:patterns[1];
            //hack to scale the pattern on IE (modified excanvas)
            ctx.fillStyle.width2 = ctx.fillStyle.width*r;
            ctx.fillStyle.height2 = ctx.fillStyle.height*r;
            ctx.fill();
          } else {
            ctx.save();
            ctx.clip();
            //safari and opera delete the path when doing restore
            //at this point we have not reverted the trasform
            if($.browser.safari || $.browser.opera) {
              //revert transform
              ctx.scale(1/sx,1/sy);
              ctx.translate(-tx,-ty);
            }            

            //ctx.drawImage(img,(width-img.width*r)/2,(height-img.height*r)/2,img.width*r,img.height*r);
            //ctx.drawImage(img,(width-img.width)/2,(height-img.height)/2);

            //ctx.drawImage(images[6],0,0,screenW,screenH);  
            // ctx.drawImage(img,(width-img.width/2*ss*0.875)/2-img.width/2*ss*0.875*0.015,(height-img.height/2*ss*0.875)/2-img.height/2*ss*0.875*0.01,img.width/2*ss*0.875*ratio,img.height/2*ss*0.875*ratio);

            ctx.drawImage(bgImg,0,0,screenW*ratio,screenH*ratio);        
            ctx.drawImage(img,(width*ratio-img.width/2*ss*0.875*ratio)/2-img.width/2*ss*0.875*0.015*ratio,(height*ratio-img.height/2*ss*0.875*ratio)/2-img.height/2*ss*0.875*0.01*ratio,img.width/2*ss*0.875*ratio,img.height/2*ss*0.875*ratio);

            ctx.restore();
            if($.browser.safari || $.browser.opera) {
              ctx.restore()              
            }
          }
        }   
      }
    }

    $.fn.jFlip = function(width,height,opts){
      return this.each(function() {
        $(this).wrap("<div class='flip_gallery'>");
        var images = $(this).find("img");
        //cannot hide because explorer does not give the image dimensions if hidden
        var canvas = $(document.createElement("canvas")).attr({width:width,height:height}).css({margin:0,width:width+"px",height:height+"px"})
        $(this).css({position:"absolute",left:"-9000px",top:"-9000px"}).after(canvas);
        new Flip($(this).next(),width || 300,height || 300,images,opts);
      });
    };
    
})(jQuery);

      
function picAni(id,w,h,n,speed){
    var box = $("#"+id),
        picW = w,
        picH = h,
        picN = n,
        aN = 0;     
    box.attr({"style":"background-position:0px 0px"});    
    if(nowPage == 1){
      aniTimer1 = setInterval(personAni,speed);      
    } 
    if(nowPage == 2){
      aniTimer2 = setInterval(personAni,speed);
      aniTimer3 = setInterval(personAni,speed);       
    }
    if(nowPage == 3){
      aniTimer4 = setInterval(personAni,speed);
      aniTimer5 = setInterval(personAni,speed); 
      aniTimer6 = setInterval(personAni,speed);       
    }
    if(nowPage == 4){
      aniTimer7 = setInterval(personAni,speed);
      //aniTimer8 = setInterval(personAni,speed);       
    }
    if(nowPage == 5){
      aniTimer9 = setInterval(personAni,speed);
      aniTimer10 = setInterval(personAni,speed); 
      aniTimer11 = setInterval(personAni,speed);       
    }
    if(nowPage == 6){
      aniTimer12 = setInterval(personAni,speed);
      aniTimer13 = setInterval(personAni,speed); 
      aniTimer14 = setInterval(personAni,speed);       
    }
    function personAni(){
        box.attr({"style":"background-position:-"+w*aN+"px 0px"});
        aN++;
        if(aN == picN){
            aN=0
        }
    }
}


// picAni("sec1-2",112,72,18,aniTimerA,100);

// picAni("sec2-1",186,174,26,aniTimerB,100);
// picAni("sec2-2",91,137,26,aniTimerC,100);

// picAni("sec3-1",186,120,46,aniTimerA,100);
// picAni("sec3-2",90,103,26,aniTimerB,100);
// picAni("sec3-3",91,65,51,aniTimerC,100);

// picAni("sec4-1",282,76,51,aniTimerA,100);
// picAni("sec4-2",90,54,4,aniTimerB,100);

// picAni("sec5-1",187,109,51,aniTimerA,100);
// picAni("sec5-2",283,75,20,aniTimerB,100);
// picAni("sec5-3",91,64,24,aniTimerC,100);

// picAni("sec6-1",282,109,6,aniTimerA,100);
// picAni("sec6-2",91,51,26,aniTimerB,100);
// picAni("sec6-3",90,64,26,aniTimerC,100);

$("#sec1 .pic").hide();
picAniA("sec1-2",112,72,18,150); 
function aniJudg(){    
    $(".share-bg").hide();
    $(".share-tips").hide();
    $(".section .pic").show();
    if(nowPage == 1){
      $(".fy-tips").show();
      $("#sec1 .pic").hide();
      // clearInterval(aniTimer2);
      // clearInterval(aniTimer3);
      picAniA("sec1-2",112,72,18,150);//1
    }
    if(nowPage == 2){
      $(".fy-tips").show();
      $("#sec2 .pic").hide();
      // clearInterval(aniTimer1);      
      // clearInterval(aniTimer8);
      // clearInterval(aniTimer9);
      // clearInterval(aniTimer10);
      picAniB("sec2-1",186,174,26,120);//2
      picAniC("sec2-2",91,137,26,120);//3
    }
    if(nowPage == 3){
      $(".fy-tips").show();
      $("#sec3 .pic").hide();
      // clearInterval(aniTimer2);
      // clearInterval(aniTimer3);
      // clearInterval(aniTimer7);
      // clearInterval(aniTimer8);
      picAniI("sec3-1",187,109,51,100);//9
      picAniJ("sec3-2",283,75,20,140);//10
      picAniK("sec3-3",91,64,24,130);//11
    }
    if(nowPage == 4){
      $(".fy-tips").show();
      $("#sec4 .pic").hide();
      // clearInterval(aniTimer9);
      // clearInterval(aniTimer10);
      // clearInterval(aniTimer11);
      // clearInterval(aniTimer12);
      // clearInterval(aniTimer13);
      // clearInterval(aniTimer14);
      picAniG("sec4-1",282,76,51,100);//7
      picAniH("sec4-2",90,54,4,800);//8
    }
    if(nowPage == 5){
      $(".fy-tips").hide();
      $("#sec5 .pic").hide();
      picAniL("sec5-1",282,109,6,800);//12
      picAniM("sec5-2",91,51,26,120);//13
      picAniN("sec5-3",90,64,26,120);//14
    }
}

// $("#sec1 .pic").hide();
// picAni("sec1-2",112,72,18,100); 



function picAniA(id,w,h,n,speed){
    var box = $("#"+id),
        picW = w,
        picH = h,
        picN = n,
        aN = 0;
    box.attr({"style":"background-position:0px 0px"});     
    function personAni(){
        box.attr({"style":"background-position:-"+w*aN+"px 0px"});
        aN++;
        if(aN == picN){
            aN=0
        }
    }
    aniTimer1 = setInterval(personAni,speed);
}
function picAniB(id,w,h,n,speed){
    var box = $("#"+id),
        picW = w,
        picH = h,
        picN = n,
        aN = 0;
    box.attr({"style":"background-position:0px 0px"});     
    function personAni(){
        box.attr({"style":"background-position:-"+w*aN+"px 0px"});
        aN++;
        if(aN == picN){
            aN=0
        }
    }
    aniTimer2 = setInterval(personAni,speed);
}
function picAniC(id,w,h,n,speed){
    var box = $("#"+id),
        picW = w,
        picH = h,
        picN = n,
        aN = 0;
    box.attr({"style":"background-position:0px 0px"});     
    function personAni(){
        box.attr({"style":"background-position:-"+w*aN+"px 0px"});
        aN++;
        if(aN == picN){
            aN=0
        }
    }
    aniTimer3 = setInterval(personAni,speed);
}
function picAniD(id,w,h,n,speed){
    var box = $("#"+id),
        picW = w,
        picH = h,
        picN = n,
        aN = 0;
    box.attr({"style":"background-position:0px 0px"});     
    function personAni(){
        box.attr({"style":"background-position:-"+w*aN+"px 0px"});
        aN++;
        if(aN == picN){
            aN=0
        }
    }
    aniTimer4 = setInterval(personAni,speed);
}
function picAniE(id,w,h,n,speed){
    var box = $("#"+id),
        picW = w,
        picH = h,
        picN = n,
        aN = 0;
    box.attr({"style":"background-position:0px 0px"});     
    function personAni(){
        box.attr({"style":"background-position:-"+w*aN+"px 0px"});
        aN++;
        if(aN == picN){
            aN=0
        }
    }
    aniTimer5 = setInterval(personAni,speed);
}
function picAniF(id,w,h,n,speed){
    var box = $("#"+id),
        picW = w,
        picH = h,
        picN = n,
        aN = 0;
    box.attr({"style":"background-position:0px 0px"});     
    function personAni(){
        box.attr({"style":"background-position:-"+w*aN+"px 0px"});
        aN++;
        if(aN == picN){
            aN=0
        }
    }
    aniTimer6 = setInterval(personAni,speed);
}
function picAniG(id,w,h,n,speed){
    var box = $("#"+id),
        picW = w,
        picH = h,
        picN = n,
        aN = 0;
    box.attr({"style":"background-position:0px 0px"});     
    function personAni(){
        box.attr({"style":"background-position:-"+w*aN+"px 0px"});
        aN++;
        if(aN == picN){
            aN=0
        }
    }
    aniTimer7 = setInterval(personAni,speed);
}
function picAniH(id,w,h,n,speed){
    var box = $("#"+id),
        picW = w,
        picH = h,
        picN = n,
        aN = 0;
    box.attr({"style":"background-position:0px 0px"});     
    function personAni(){
        box.attr({"style":"background-position:-"+w*aN+"px 0px"});
        aN++;
        if(aN == picN){
            aN=0
        }
    }
    aniTimer8 = setInterval(personAni,speed);
}
function picAniI(id,w,h,n,speed){
    var box = $("#"+id),
        picW = w,
        picH = h,
        picN = n,
        aN = 0;
    box.attr({"style":"background-position:0px 0px"});     
    function personAni(){
        box.attr({"style":"background-position:-"+w*aN+"px 0px"});
        aN++;
        if(aN == picN){
            aN=0
        }
    }
    aniTimer9 = setInterval(personAni,speed);
}
function picAniJ(id,w,h,n,speed){
    var box = $("#"+id),
        picW = w,
        picH = h,
        picN = n,
        aN = 0;
    box.attr({"style":"background-position:0px 0px"});     
    function personAni(){
        box.attr({"style":"background-position:-"+w*aN+"px 0px"});
        aN++;
        if(aN == picN){
            aN=0
        }
    }
    aniTimer10 = setInterval(personAni,speed);
}
function picAniK(id,w,h,n,speed){
    var box = $("#"+id),
        picW = w,
        picH = h,
        picN = n,
        aN = 0;
    box.attr({"style":"background-position:0px 0px"});     
    function personAni(){
        box.attr({"style":"background-position:-"+w*aN+"px 0px"});
        aN++;
        if(aN == picN){
            aN=0
        }
    }
    aniTimer11 = setInterval(personAni,speed);
}
function picAniL(id,w,h,n,speed){
    var box = $("#"+id),
        picW = w,
        picH = h,
        picN = n,
        aN = 0;
    box.attr({"style":"background-position:0px 0px"});     
    function personAni(){
        box.attr({"style":"background-position:-"+w*aN+"px 0px"});
        aN++;
        if(aN == picN){
            aN=0
        }
    }
    aniTimer12 = setInterval(personAni,speed);
}
function picAniM(id,w,h,n,speed){
    var box = $("#"+id),
        picW = w,
        picH = h,
        picN = n,
        aN = 0;
    box.attr({"style":"background-position:0px 0px"});     
    function personAni(){
        box.attr({"style":"background-position:-"+w*aN+"px 0px"});
        aN++;
        if(aN == picN){
            aN=0
        }
    }
    aniTimer13 = setInterval(personAni,speed);
}
function picAniN(id,w,h,n,speed){
    var box = $("#"+id),
        picW = w,
        picH = h,
        picN = n,
        aN = 0;
    box.attr({"style":"background-position:0px 0px"});     
    function personAni(){
        box.attr({"style":"background-position:-"+w*aN+"px 0px"});
        aN++;
        if(aN == picN){
            aN=0
        }
    }
    aniTimer14 = setInterval(personAni,speed);
}