var zoom={
	moved:0,//保存左移的li个数
	WIDTH:62,//保存每个li的宽度
	MSIZE:175,//保存mask的大小
	OFFSET:20,//保存ul的起始left值
	MAX:3,//保存可左移的最多li个数
	MAXLEFT:175,MAXTOP:175,//保存mask可用的最大坐标
	init:function(){
		//为id为preview下的h1绑定单击事件代理,仅a能响应事件,事件函数为move
		$("#preview>h1").on("click","a",this.move.bind(this));
		//为id为icon_listd的ul绑定单击事件代理,仅li>img能响应事件,处理函数为changeMImg
		$("#icon_list").on("mouseover","li>img",this.changeImgs);
		//为id为superMask的div添加hover事件,设置其id为mask的div显示/隐藏,在绑定鼠标移动事件moveMask
		$("#superMask").hover(this.toggle,this.toggle)
					   .mousemove(this.moveMask.bind(this));
	},
	moveMask:function(e){//需要知道当前鼠标的位置所以需要添加e
		var x=e.offsetX;// 获得鼠标相对于父元素的x
		var y=e.offsetY;// 获得鼠标相对于父元素的y
		//鼠标永远在mask的中心点
		//计算mask的left:x-MSIZE/2
		var left=x-this.MSIZE/2;
		//计算mask的top:y-MSIZE/2
		var top=y-this.MSIZE/2;
		//如果left越界,要改回边界值
		left=left<0?0:
			 left>this.MAXLEFT?this.MAXLEFT:
			 left;
		//如果top越界,改回边界值
		top=top<0?0:
			top>this.MAXTOP?this.MAXTOP:
			top;
		// 设置id为mask的元素的left为x-MSZIE/2,top为y-MSIZE/2
		$("#mask").css({left:left,top:top});
		// 设置id为largeDiv的背景图片位置
		$("#largeDiv").css(
			"backgroundPosition",
			-left*16/7+"px "+
			-top*16/7+"px"
			);
	},
	toggle:function(){//切换mask的显示和隐藏
		$("#mask").toggle();
		$("#largeDiv").toggle();
		// 如果largeDiv的display为block
		if ($("#largeDiv").css("display")=="block") {
		// 获得id为mImg的元素的src属性
		var src=$("#mImg").attr("src");
		var i=src.lastIndexOf(".");
		var newSrc=src.slice(0,i-2)+"-l"+src.slice(i);
		$("#largeDiv").css(
			"backgroundImage","url("+newSrc+")"
			);
		}
	},
	move:function(e){
		var $target=$(e.target);//获得目标函数$target
		var btnClass=$target.attr("class");
		//如果btnClass中没有disabled
		if (btnClass.indexOf("disabled")==-1) {
		//如果btnClass以forward开头
		//将moved+1
		//否则
		//将moved-1
		this.moved+=btnClass.indexOf("forward")!=-1?1:-1;
		//设置id为icon-list的ul的left为-moved*WIDTH+OFFSET
		$("#icon_list").css("left",-this.moved*this.WIDTH+this.OFFSET);
		//检查a的状态
		this.checkA();
		}
	},
	checkA:function(){//检查两个a的状态
		//查找class属性以backward开头的a,保存在$backward
		var $backward=$("a[class^='backward']");
		//查找class属性以forward开头的a,保存在$forward
		var $forward=$("a[class^='forward']")
		//如果moved等于0
		if (this.moved==0) {
			//设置$backward的class为backward_disabled
			$backward.attr("class","backward_disabled");
		}else if (this.moved==this.MAX){
			//否则,如果moved等于MAX
			//设置$forward的class为forward_disabled
			$forward.attr("class","forward_disabled");
		}else{//否则
			//$backward的class为backward
			$backward.attr("class","backward");
			//$forward的class为forward
			$forward.attr("class","forward");
		}
	},

	changeImgs:function(e){//根据小图片更换图片
		var $target=$(e.target);
		// 获得目标元素的src属性,保存在变量src中
		var src=$target.attr("src");
		// 查找src中最后一个.的位置i
		var i=src.lastIndexOf(".");
		// 设置id为mImg的元素的src为:
			// src从开头-i拼接-m 拼接src从i到结尾
			$("#mImg").attr("src",src.slice(0,i)+"-m"+src.slice(i));
	}


}
zoom.init();