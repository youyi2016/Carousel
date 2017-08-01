/*
 * 工具类方法，包括：
 * 1、获取dom元素
 * 2、日期倒计时
 * 3、兼容性事件处理
 */
//(function(globle, document) {
	
	function $(str) {
	
		var doc = document;
		var arr = str.split(" ");
	
	    for (var i=0, len = arr.length; i<len; i++) {
	
		    var type = arr[i][0];
		    var className = arr[i];
		 
		    switch (type) {
		        case ".":
		            className = arr[i].slice(1);            
		            doc = doc.getElementsByClassName(className)[0];
		            break;
		        case "#":
		            className = arr[i].slice(1);            
		            doc = doc.getElementById(className);
		            break;                
		        default: 
		           doc = doc.getElementsByTagName(className)[0];
		           break;
		    }
	    }
	    
	    return doc;
	}
	
	function $_ajax(obj) {
	    var obj = obj || {};
		var  xhr = null;
		var responseData;
		
		if ( window.XMLHttpRequest ) {
			xhr = new XMLHttpRequest();
		}
		else {
			xhr = new ActiveXObject( "Microsoft.XMLHTTP" );
		};
		
		xhr.onreadystatechange = function () {
			if ( xhr.readyState === 4 ) {
				if ( (xhr.status >= 200 && xhr.status <= 300) || xhr.status === 304 ) {
				   responseData = JSON.parse( xhr.responseText );	
				   obj.success && obj.success(responseData);
				}
				else {
					obj.error && obj.error("request was unsuccessful:"+xhr.status);
					console.log("request was unsuccessful:"+xhr.status);
				}
			}
		};
		xhr.open(obj.type, obj.url, obj.async);
		//xhr.open('get', this.option.url, true);
		if (obj.type.toLowerCase() === 'get') {
			xhr.send(null);
		}
		else if (obj.type.toLowerCase() === 'post') {	
			if(obj.dataType === 'json') {
				xhr.send(obj.data);
			}
		}
	
	}
	
	//倒计时
	function downCount(time)
	{
	    var t = time;
	    var timer;
	
	    function loop(delay)
	    {
	        timer = setTimeout(function ()
	        {
	            if (t > 0)
	            {
	                t -= 1;
	                var hour = Math.floor(t / 3600);
	                var min = Math.floor((t - hour * 3600) / 60);
	                var second = Math.floor(t - hour * 3600 - min * 60) % 60;
	                $('.hour').innerText = addZero(hour) + ":";
	                $('.min').innerText = addZero(min) + ":";
	                $('.second').innerText = addZero(second);
	                loop(1000);
	            }
	            else
	            {
	                clearTimeout(timer);
	                $('.hour').innerText = "00" + ":";
	                $('.min').innerText = "00" + ":";
	                $('.second').innerText = "00";
	               
	            }
	
	        }, delay);
	    }
	
	    loop(0);
	}
	
	function addZero(time)
	{
	    return time < 10 ? "0" + time : time;
	}
	
	function remainDays(endTime)
	{
		var endTime = endTime.replace(/-/g,"/");
	    var dbTime = $(".db-time");
	    var end = new Date(endTime);
	    var now = new Date();
	    var difftime = end - now;
	    console.log("end:" + end);
	    downCount(difftime / 1000);
	}
	
	//模块增强模式封装变量
	var client = function () {
		var engine = {
			ie: 0,
			gecko: 0,
			webkit: 0,
			khtml: 0,
			opera: 0,			
			ver: null
		};
		
		if (window.opera) {
			engine.ver = window.opera.version();
			engine.opera = parseFloat(engine.ver);		
		}
		
		return {
			engine: engine
		};
	}();
	
	 var EventUtil = {
	    //事件处理
	    addHandler: function(element, type, handler) {
	        if(element.addEventListener) {
	            element.addEventListener(type, handler, false);
	        } else if(element.attachEvent) {
	            //ie9之前的浏览器的事件监听方式，和上面的方式不一样
	            //attachEvent中的事件类型前有一个on
	            element.attachEvent("on"+type,handler);
	        } else {
	            element["on"+type] = handler;
	        }
	    },
	     
	    //ie8即更早版本只支持事件冒泡，ie中使用attachEvent
	    //事件处理程序会在全局作用域中运行，所以回调函数中的this等于window，
	    //而不是当前点击的元素
	    getEvent: function(event) {
	        return event ? event : window.event;
	    },
	     
	    //获取目标对象，即当前被点击的元素IE中用event.srcElement获取
	    getTarget: function(event) {
	        return event.target || event.srcElement;
	    },
	     
	    preventDefault: function(event) {
	        if(event.preventDefault) {
	            event.preventDefault();
	        } else {//IE
	            event.returnValue = false;
	        }
	    },
	     
	    removeHandler: function(element, type, handler) {
	        if(element.removeListener) {
	            element.removeListener(type, handler, false);
	        } else if(element.detachEvent) {
	             element.detachEvent("on"+type,handler);
	        } else {
	            element["on"+type] = null;
	        }
	    },
	     
	    stopPropagation: function(event) {
	        if(event.stopPropagation) {
	            event.stopPropagation();
	        } else {//IE
	            event.cancelBubble = true;
	        }
	    },
	    
	    //获取滚轮增量信息
	    getWheelDelta: function (event) {
	    	if (event.wheelDelta) {
	    		return (client.engine.opera && client.engine.opera < 9.5) ? -event.wheelDelta : event.wheelDelta;
	    	}
	    	else {
	    		return -event.detail * 40;//兼容firfox
	    	}
	    }
	};     
	
//	globle.EventUtil = EventUtil;
	
	 //判断是否有这个类
	function hasClass(obj, cls) {
		return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	}
	
	//添加类
	function addClass(obj, cls) {
		if(!this.hasClass(obj, cls)) obj.className += " " + cls;
	}
	
	//移除类
	function removeClass(obj, cls) {
		if(hasClass(obj, cls)) {
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			obj.className = obj.className.replace(reg, '');
		}
	}
	
	//所有的兄弟节点
	function siblingss(elm) {
		var a = [];
		var p = elm.parentNode.children;
		for(var i = 0, pl = p.length; i < pl; i++) {
			if(p[i] !== elm) a.push(p[i]);
		}
		return a;
	}
	
	//获取浏览器滚动条的位置
	function scollPostion() {
	        var t, l, w, h;
	        if (document.documentElement && document.documentElement.scrollTop) {
	            t = document.documentElement.scrollTop;
	            l = document.documentElement.scrollLeft;
	            w = document.documentElement.scrollWidth;
	            h = document.documentElement.scrollHeight;
	        } else if (document.body) {
	            t = document.body.scrollTop;
	            l = document.body.scrollLeft;
	            w = document.body.scrollWidth;
	            h = document.body.scrollHeight;
	        }
	        return { top: t, left: l, width: w, height: h };
	}
	
	// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
	function getPosition(element) {
		// your implement
		var x = 0,
			y = 0;
		var current = element;
	
		if(current != null) {
			y = current.offsetTop;
			x = current.offsetLeft;
		}
	
		var scrollLeft = document.body.scrollLeft || window.pageXOffset || document.documentElement.scrollLeft;
		var scrollTop = document.body.scrollTop || window.pageYOffset || document.documentElement.scrollTop;
		x -= scrollLeft;
		y -= scrollTop;
		console.log("实际距离：" + y + " " + "滚动高度：" + scrollTop);
		return {
			x: x,
			y: y
		}
	}
	
	/* loading
	 * @param {object} el 包含loading的父元素
	 */
	function Loading(ele) {
	
		 this.ele = ele;	
	}
	
	Loading.prototype = {
			
	     	constructor: Loading,	
	        initElement: function() {
	        	 var div = document.createElement('div');
				 var img = document.createElement('img');
				 div.setAttribute("id", "loading");
				 div.setAttribute("class", "loading");
				 img.src="data:image/gif;base64,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";
				 div.appendChild(img);	 
				 this.ele.appendChild(div);
	        },
	        
			on: function() {	  
			      removeClass(this.ele, "hide");  
		    },
		      
			off: function() {
			    addClass(this.ele, "hide");  	
			}		
	};
	 
	/*
	 * 自定义弹窗
	 */
	var action = {
		
		on: function() {
			if ($(".alert")) {
	    	  $(".alert").style.display = "block";
	    	} 
	    	
	    	if ($(".zhezhao")) {
	    	  $(".zhezhao").style.display = "block";
	    	}
	    },
	    
	    off: function() {
	    	if ($(".alert")) {
	    	  $(".alert").style.display = "none";
	    	} 
	    	
	    	if ($(".zhezhao")) {
	    	  $(".zhezhao").style.display = "none";
	    	}
	    },
	    
		alert: function(type, tipContent, btnText) {
	        $(".alert").getElementsByTagName("p")[0].innerText = tipContent;
	        $(".alert").getElementsByClassName("off")[0].innerText = btnText;
	        if (type === "on") {
	        	this.on();
	        }
	    }
	    	
	};
	  
//})(this, document);
