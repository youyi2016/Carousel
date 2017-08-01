(function(globle, $, _, doc) {
	'user strict';
	
	var carousel = function(options) {
		
	 	options = options || {};
	 	this.ele = options.ele || {};
	 	this.circles = options.circles || {};
	    this.imgLength = options.imgLength || 0;
	    this.intervalTime = options.intervalTime || null;
	    this.defaultImgUrl = options.defaultImgUrl || null;
	    this.isShowCircleBtn = options.isShowCircleBtn || true,
	 	this.index = 0; //控制小圆点的显示
	    this.subEles = [];
	    this.len = 0;	
	    this.time = 0;
	    this.eventMaps = {
	    	'click #next img': 'clickNextBtn',
	    	'click #prev img': 'clickPrevBtn',
	    	'click #circles' : 'clickCircleBtn',
	    	'mouseout .banner': 'mouseOutStart',
	    	'mouseover .banner': 'mouseOverStop'	    	
	    };
	    this.init();
	    this.initElement();  
    };
		
	carousel.Eles = {
		imgIndex: '#img-index',
		imgs: '#img-index img',
		next: '#next img',
		prev: '#prev img'
	};

	carousel.prototype = {
		
		constructor: carousel,	
	
		_showCirculars: function() {
			
			  var lis = this.circles.children;			     
				for (var i = 0; i<this.len; i++) {
					if (hasClass(lis[i],"light")) {
						removeClass(lis[i],"light");
					}
				}
		     addClass(lis[this.index],"light");
		},
		
		 //正序播放
		 _playAsc: function() {		 	
		 	var that = this;
			this._clearLastIntervalTime();	
			this.time = setInterval(function() {
			  that.clickNextBtn();
			},this.intervalTime);		
		 },
		
		//逆序播放
		_playDesc: function() {			
			this._clearLastIntervalTime();
			this.time = setInterval(function() {
			  that.clickPrevBtn();
			},this.intervalTime);
		},
		
		_clearLastIntervalTime: function() {
			if (this.time) {
			  this._stop();
			}
		},
		
		//停止轮播
		 _stop: function() {
			clearInterval(this.time);
		},
		
		setStyle: function(ele, styleProp, value) {
			ele.style[styleProp] = value;
		},
		
		getStyleValue: function(ele, styleProp) {
			return parseInt(ele.style[styleProp]);
		},
		
		_animate: function(offset) {
		
			var newLeft = this.getStyleValue(this.imgIndex, "left") + offset;
			//图片循环切换的关键步骤
	        if (newLeft <= -this.imgLength*this.len) {
				this.setStyle(this.imgIndex, "left", 0+"px");
			} 
			else if (newLeft >= this.imgLength) {
				this.setStyle(this.imgIndex, "left", -this.imgLength*(this.len - 1)+"px");
			}
			else {
				this.setStyle(this.imgIndex, "left", newLeft+"px");
			}
		},
		
		_switchImg: function(el) {
			//当前图片再次被点击时不再执行后面的方法
			if (hasClass(el,"light")) {
				return;
			}			
			//获取当前点击的圆点的index属性值
			var thisIndex = parseInt(el.getAttribute("index")),
			//改变父容器的偏移量，切换图片	
	        offset = -this.imgLength * (thisIndex - this.index);	
	           
			this._animate(offset);
			this.index = thisIndex;	
			this._showCirculars();			
			this._playAsc();		
	    }, 	
	    
	    _lazyload: function() { //懒加载
	       
	        var seeHeight = this.ele.clientHeight, //可见区域高度
	            seeWidth = this.ele.clientWidth,//可见区域宽度
	            imgs = this.ele.children; 
	
	        for (var i = this.index; i < this.len; i++) {
	            if (imgs[i].offsetLeft < seeWidth) {
	                if (imgs[i].getAttribute("src") === this.defaultImgUrl) {
	                    imgs[i].src = imgs[i].getAttribute("data-src");
	                }
	            }
	        }
       },
       
        throttle: function(fun, delay, time) {
	        var timeout,
	            startTime = new Date();
	        
		    return function() {
		         var context = this,
		            args = arguments,
		            curTime = new Date();
		            clearTimeout(timeout);
		            
		        // 如果达到了规定的触发时间间隔，触发 handler
		        if (curTime - startTime >= time) {
		            fun.apply(context, args);
		            startTime = curTime;
		            // 没达到触发间隔，重新设定定时器
		        }
		        else {
		            timeout = setTimeout(fun, delay);
		        }
		    };
	    },
	    
	    _getNextImgIndex: function() {
	    	if(this.index === this.len-1){
				this.index = 0;
			}
	    	else {
			    this.index += 1;
			}
	    },
	    
	    _getPreviousImgIndex: function() {
	    	if (this.index === 0) {
			  this.index = this.len-1;
			} 
			else {
		      this.index -= 1;
		    }
	    },
	    
	    _getNewImgIndex: function(type) {
	    	switch(type) {
	    		case 'next': 
	    		  this._getNextImgIndex();
	    		  break;
	    		case 'prev' :
	    		   this._getPreviousImgIndex();
	    		   break;
	    		defaults: 
	    		   break;
	    	}
	    },
	    
	    clickNextBtn: function(event) {
	    	
			this._getNewImgIndex('next');
			this._showCirculars();
			this._lazyload();
	        this._animate(-this.imgLength);
	        this._playAsc();
	    },
	    
	    clickPrevBtn: function(event) {
	    	
			this._getNewImgIndex('prev');
			this._showCirculars();
			this._lazyload();
	        this._animate(this.imgLength);
	        this._playAsc();
	    },
	    
	    clickCircleBtn: function(event) {
	    	
	    	var e = EventUtil.getEvent(event);
	    	var el= EventUtil.getTarget(e);	    
	    	
	    	if (el.tagName.toLowerCase() === "li") {
	    		this._switchImg(el);
	    	}  
	    	this._lazyload();
	    },
	    
	    mouseOverStop: function() {    	
	    	this._stop();
	    },
	    
	    mouseOutStart: function() {
	    	this._playAsc();
	    },
	    
	    _initImg: function() {
	    	
	    	if (this.ele) {				
				this.len = this.ele.children.length;
				
				if (this.len)　{	  
				    this._lazyload(); //页面载入完毕加载可视区域内的图片
				    if (this.isShowCircleBtn) {
				       this._showCirculars();
				    }  
					this._playAsc();					
		        }
            }
	    },
	    
	    _scanEventsMap: function(maps, isOn) {
	    	
	    	var delegateEventSplitter = /^(\S+)\s*(.*)$/;
            var bind = isOn ? this._delegate.bind(this) : this._undelegate.bind(this);
       
            for (var keys in maps) {
            	
                if (maps.hasOwnProperty(keys)) {
                    var matchs = keys.match(delegateEventSplitter);
                    bind(matchs[1], matchs[2], this[maps[keys]]);
//                   var index = keys.indexOf(" ");
//                   var matchs[1] = keys.slice(0, index);
//                   var matchs[2] = keys.slice(index+1);
//                   bind(matchs[1], matchs[2], maps[keys].bind(this));
                }
            }
	    },  
	    
	    initializeOrdinaryEvents: function(maps) {           
            this._scanEventsMap(maps, true);
        },
        
        uninitializeOrdinaryEvents: function(maps) {
            this._scanEventsMap(maps);
        },
        
        _delegate: function(name, selector, func) {
            var ele = $(selector);
            var that = this;
	    	EventUtil.addHandler(ele, name, function(event) {
	    		func.apply(that, event);
	    	});
        },
        
        _undelegate: function(name, selector, func) {
            var ele = $(selector);
	    	EventUtil.removeHandler(ele, name, this[func]);
        },
                  
	    bindEvent: function() {
	    	this.initializeOrdinaryEvents(this.eventMaps);
	    },
	    
	    unbindEvent: function() {
	    	this.uninitializeOrdinaryEvents(this.eventMaps);
	    },
	   	    
	    initElement: function() {
	    	var eles = carousel.Eles;
            for (var name in eles) {
                if (eles.hasOwnProperty(name)) {
                    this[name] = $(eles[name]);
                }
            }
	    },
	    	     
	    init: function() {
	    	this._initImg();
	    	this.bindEvent();	    	
	    },
	    
	    destory: function() {
	    	this.unbindEvent();
	    }
    
};
		
	globle.carousel = carousel;
	
})(this, this.$, this._, document);


	
