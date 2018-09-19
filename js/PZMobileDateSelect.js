function PZDateSelect(opt){
	this.$touchTag = null;
	this.$ipt = null;
	this.okcallback = opt.okcallback;
	this.startfunc = opt.startfunc;
	this.model = opt.model;
	this.itemHeight = 0;
	this.indArr = [0,0,0];
	this.valueArr = [0,0,0];
	this.init();
}

PZDateSelect.prototype = {
	init : function(){
		this.create();
		this.bind();
		if(this.model==='date'){
			this.setDateModel();
		}
		this.startfunc&&this.startfunc();
	},
	create : function(){
		if($("#date-touch").length!==0){
			return false;
		}
		var str = '<div class="date-touch" id="date-touch"> <div class="date-touch-head"> <span class="date-close">取消</span> <span class="date-ok">完成</span> </div> <div class="PZselect-wrap"> <div class="select-box"></div> <div class="select-wrap-list"> <div class="select-wrap"> <div class="select"> <ul> <li>-</li> </ul> </div> </div> <div class="select-wrap"> <div class="select"> <ul> <li>-</li> </ul> </div> </div> <div class="select-wrap"> <div class="select"> <ul> <li>-</li> </ul> </div> </div> </div> </div> </div>';
		$("body").append(str);
		this.$touchTag = $(".select-wrap");

	},
	show : function($ipt){
		this.$ipt = $ipt;
		$("#date-touch").fadeIn(300);
	},
	hide : function(){
		var This = this;
		$("#date-touch").fadeOut(300,function(){
			This.indArr = [0,0,0];
			This.valueArr = [0,0,0];
			This.$touchTag.find("ul").css({"top":0});
		});

	},
	bind : function(){
		var This = this;
		var downY = 0;
		var downTop = 0;
		var $touchTag = this.$touchTag;
		var touchTagInd = -1;
		var len = 0;
		var mTop = 0;
		$touchTag.on('touchstart',function(ev){
			touchTagInd = $(this).index()
			var touchs = ev.originalEvent.changedTouches[0];
			downY = touchs.pageY;
			var $moveTag = $(this).find("ul");
			len = $(this).find("li").length;
			this.itemHeight = $(this).find("li").height();
			downTop = parseInt($moveTag.css("top"));
			
			$touchTag.on('touchmove',function(ev){
				var touchs = ev.originalEvent.changedTouches[0];
				mTop = touchs.pageY - downY + downTop
				$moveTag.css({"top":mTop})
				return false;
			});
			
			$touchTag.on('touchend',function(ev){
				var touchs = ev.originalEvent.changedTouches[0];
				var endY = touchs.pageY;
				var itemInd = -1;
				// console.log(downY)
				// if(touchs.pageY<len*1){

				// }
				$touchTag.off('touchmove');
				$touchTag.off('touchend');
				document.ontouchmove = null;
				if(mTop<=-this.itemHeight*(len-1)){
					// $moveTag.animate({"top":-this.itemHeight*(len-3)},100);
					itemInd = len-1;
				}else if(mTop>=0){
					// $moveTag.animate({"top":0},100);
					itemInd = 0;
				}else if(mTop<0){
					itemInd = parseInt(Math.ceil(Math.abs(mTop/this.itemHeight-0.5)-1));
					// $moveTag.animate({"top":-this.itemHeight*itemInd},100);
				}
					// console.log(itemInd)
				This.indArr[touchTagInd] = itemInd;

				$moveTag.animate({"top":-this.itemHeight*(itemInd)},100);
				if(touchTagInd===0||touchTagInd===1){
					//回调
					console.log(touchTagInd)
					This.changeDate();
				}else{
					This.getValue()
				}
				return false;
			});
			
			return false;
		});

		$(document).on("click","#date-touch .date-close",function(){
			console.log("close")
			This.hide();
		}).on("click","#date-touch .date-ok",function(){
			console.log("ok")
			This.okcallback&&This.okcallback(This.$ipt,This.valueArr);
			This.hide();
		})

	},
	setDefDate : function(dateStr){
		console.log(dateStr)
		if(!dateStr){
			return
		}
		var dateArr = dateStr.split('-');
		this.itemHeight = this.$touchTag.find("li").height();
		for(var i=0;i<dateArr.length ;i++){
			this.indArr[i] = this.$touchTag.eq(i).find("li[value='"+dateArr[i]+"']").index()
			this.valueArr[i] = dateArr[i]
			this.$touchTag.eq(i).find("ul").css({"top":-this.itemHeight*(this.indArr[i])});
			console.log(this.itemHeight)
		}
	},
	setDateModel : function(){
		var This = this;
		createYear();
		createMonth();
		this.changeDate();


		function createYear(){
			var arr = []
			for(var i=new Date().getFullYear();i>=1900 ;i--){
				arr.push(i)
			}
			This.setDOMData(This.$touchTag.eq(0),arr,arr)
		}

		function createMonth(){
			var arr = []
			for(var i=0;i<12 ;i++){
				arr.push(i+1)
			}
			This.setDOMData(This.$touchTag.eq(1),arr,arr)
			
		}

		

		

		
	},
	changeDate : function(){
		var This = this;
		var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
		// this.curDay = -1
		
		this.getValue()
		if(this.indArr[0]>=0&&this.indArr[1]>=0){
			var dayNum = monthDays[this.indArr[1]]
			if (this.indArr[1] == 1 && isLeapYear()) {  
	      dayNum++
	    }
	    this.createDay(dayNum)
		}

		function isLeapYear(){
			//闰年
		  return (This.valueArr[0] % 4 == 0 || (This.valueArr[0] % 100 == 0 && This.valueArr[0] % 400 == 0))
		}
	},
	createDay : function(dayNum){
		var arr = []
		for(var i=0;i<dayNum ;i++){
			arr.push(i+1)
		}
		this.$touchTag.eq(2).find("ul").animate({"top":0},200)
		this.indArr[2] = 0
		this.setDOMData(this.$touchTag.eq(2),arr,arr)
		this.getValue()
	},
	setDOMData : function($DOM,dataList,valueList){
		var str = '';
		for (var i=0;i<dataList.length;i++) {
			str += '<li value="'+valueList[i]+'">'+dataList[i]+'</li>'
		}
		$DOM.find("ul").html(str);
	},
	getValue : function(){
		for(var i=0;i<this.valueArr.length;i++){
			this.valueArr[i] = this.$touchTag.eq(i).find("li").eq(this.indArr[i]).attr("value");
		}
		console.log(this.valueArr)
	}

};


