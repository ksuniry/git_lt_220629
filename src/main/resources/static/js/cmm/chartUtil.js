/**
* 파일명 : /js/cmm/chartUtil.js
 */

var chartUtil = {
	
	ctx		: null,
	myChart : null,
	
	//chart yAxes
	maximum : 200,
	minimum : 0,
	//status
	statusNormal : 0, // 정상
	statusWait : 1, // 대기
	statusWarn : 2, // 경고
	statusSeri : 3, // 심각
	// var statusLock = 4; // 잠김

    waiting : new Image(),
	warning : new Image(),
	serious : new Image(),

	init : function() {
		this.ctx = document.getElementById('myChart').getContext('2d');
		
    	this.waiting.src = '../images/icon_waiting.svg';
		this.warning.src = '../images/icon_warning.svg';
		this.serious.src = '../images/icon_serious.svg';
		
		this.annotations = [
		    this.getAnnotations(1, 0 , '55세', '65세'),
		    this.getAnnotations(2, 1 , '65세', '85세'), 
		    this.getAnnotations(3, 2 , '85세', '95세')
		];
		
		this.options.annotation.annotations = this.annotations;
		
		this.icon = [
		    this.getIcon(1, 0 , '55세', '65세'),
		    this.getIcon(2, 1 , '65세', '85세'), 
		    this.getIcon(3, 2 , '85세', '95세')
		];
		
		this.data.icon = this.icon;
		
		Chart.pluginService.register(this.afterDrawIcon);
	},
	
	
	chartOn : function(){
		
		this.myChart = new Chart(this.ctx, {
		    type :'line',
		    data : this.data,
		    options : this.options
		});
	},

	getAnnotations : function(index, status, startAge, endAge) {
		var bgColor = 'rgba(24, 236, 201, 0.3)';
		switch(status){
	        case this.statusNormal: 	bgColor = 'rgba(0, 0, 0, 0)'; break; 
	        case this.statusWait: 	bgColor = 'rgba(153, 153, 153, 0.3)'; break; 
	        case this.statusWarn: 	bgColor = 'rgba(255, 149, 43, 0.3)'; break; 
	        case this.statusSeri: 	bgColor = 'rgba(255, 149, 43, 0.3)'; break;
	    }
		return {
	        borderColor: 'rgba(0, 0, 0, 0)',
	        borderWidth: 1,
	      	id: 'box' + index,
	        type: 'box',
	        xScaleID: 'x-axis-0',
	        yScaleID: 'y-axis-0',
	        xMin: startAge,
	        xMax: endAge,
	        backgroundColor:  bgColor,
	        onClick: function(e) {
	            if(status != 0){
	                gfn_alertMsgBox(index + "기");
	            }
	        }
	    };
	},

	
	annotations : null,
	
	getIcon : function(index,status, startAge, endAge){
	    return{
	        status:status,
	        start:startAge,
	        end:endAge
	    };
	},
	
	icon : null,
	
	data : {
	        labels: ["55세","65세",	"75세",	"85세",'95세'],
	        datasets: [{
	            label: '최초',
	            data: [100,	30, 100, 30, 20],
	            fill: false,
	            borderColor: '#999999', 
	            backgroundColor: '#999999', 
	            borderWidth: 1 
	        },
	        {
	            label: '현재', 
	            data: [150,	50,	120, 80, 80], 
	            fill: false,
	            borderColor: '#3ca455', 
	            backgroundColor: '#3ca455',
	            borderWidth: 1 
	        },{
	            label: '자문', 
	            data: [140,	70,	90, 100, 110],
	            fill: false,
	            borderColor: '#ff952b', 
	            backgroundColor: '#ff952b', 
	            borderWidth: 1 
	        }],
	        icon : this.icon
	},
	
	options : {
	    tooltips: {
	        enabled: false
	    },
	    legend: {
	        display: false,
	    },
	    scales: {
	        xAxes: [{
	            display: true,
	            gridLines: {
	                display: true,
	                color:'rgb(221, 221, 221)',
	                drawBorder: false,
	                borderDash:[2,3],
	            },
	        }],
	        yAxes: [{
	            display: true,
	            gridLines: {
	                display: true,
	                color:'rgb(221, 221, 221)',
	                drawBorder: false,
	                borderDash:[2,3],
	            },
	            ticks: {
	                min:this.minimum,
	                max:this.maximum,
	                stepSize:35
	            }
	        }]
	    },
	    annotation: {
	        drawTime: "beforeDatasetsDraw",
	        events: ['click'],
	        annotations: this.annotations
	    }
	},

	afterDrawIcon : {
	    afterDraw: function() {
	    
	    var originalLineDraw = Chart.controllers.line.prototype.draw;
	    // Extend the line chart, in order to override the draw function.
	    Chart.helpers.extend(Chart.controllers.line.prototype, {
	        draw : function() {
	
	        //draw line
	        originalLineDraw.apply(this, arguments);
	        
	        var chart = this.chart;
	        // Get the object that determines the region to highlight.
	        var icon = chart.config.data.icon;
	
	        // If the object exists.
	        if (icon !== undefined) {
	        var ctx = chart.chart.ctx;
	
	        var xaxis = chart.scales['x-axis-0'];
	        var yaxis = chart.scales['y-axis-0'];

	
	                ctx.save();
	                icon.forEach(ele => {
	                //icon position
	                var xStartPixel = xaxis.getPixelForValue(ele.start); // 개체 첫점
	                var xEndPixel = xaxis.getPixelForValue(ele.end); //
	                var yStartPixel = yaxis.getPixelForValue(chartUtil.maximum); // 완전 최상윗점
	                var yEndPixel = yaxis.getPixelForValue(chartUtil.minimum); // 완전 하위점
	
	                var xPixel = xStartPixel  + (xEndPixel - xStartPixel) * 0.43;
	                var yPixel = yaxis.getPixelForValue((chartUtil.maximum - chartUtil.minimum) * 0.8);
	
	                //bg transWhite
	                var xBoxStart = xStartPixel + 5;
	                var yBoxStart = yStartPixel + 5;
	                var xBoxEnd = (xEndPixel - xStartPixel) -10;
	                var yBoxEnd = yEndPixel - 17;
	
	                //btn
	                var xBtnStart = xBoxStart +10;
	                var yBtnStart = yBoxEnd - 25;
	                var xBtnEnd = xBoxEnd - 20;
	                var yBtnEnd = 26;
	
	                //rounded corner
	                CanvasRenderingContext2D.prototype.roundedRectangle = function(x, y, width, height, rounded) {
	                    const radiansInCircle = 2 * Math.PI
	                    const halfRadians = (2 * Math.PI)/2
	                    const quarterRadians = (2 * Math.PI)/4  
	                    
	                    // top left arc
	                    this.arc(rounded + x, rounded + y, rounded, -quarterRadians, halfRadians, true)
	                    // line from top left to bottom left
	                    this.lineTo(x, y + height - rounded)
	                    // bottom left arc  
	                    this.arc(rounded + x, height - rounded + y, rounded, halfRadians, quarterRadians, true)  
	                    // line from bottom left to bottom right
	                    this.lineTo(x + width - rounded, y + height)
	                    // bottom right arc
	                    this.arc(x + width - rounded, y + height - rounded, rounded, quarterRadians, 0, true)  
	                    // line from bottom right to top right
	                    this.lineTo(x + width, y + rounded)  
	                    // top right arc
	                    this.arc(x + width - rounded, y + rounded, rounded, 0, -quarterRadians, true)  
	                    // line from top right to top left
	                    this.lineTo(x + rounded, y)  
	                }
	                
	                //center
	                var xCenter = xStartPixel  + ((xEndPixel - xStartPixel)/2);
	                var yTxt = yBtnStart +18;
	
	                if(ele.status == chartUtil.statusNormal){
	                }else if(ele.status == chartUtil.statusWait){
	                    //bg
	                    ctx.fillStyle = "#ffffff06";
	                    ctx.fillRect(xBoxStart, yBoxStart, xBoxEnd, yBoxEnd);
	                    
	                    //btn
	                    ctx.beginPath();
	                    ctx.fillStyle = "#666666";
	                    ctx.roundedRectangle(xBtnStart, yBtnStart, xBtnEnd, yBtnEnd, 5);
	                    ctx.fill();
	
	                    ctx.font = "12px Arial";
	                    ctx.fillStyle = "#ffffff";
	                    ctx.textAlign = "center";
	                    ctx.fillText("확인하기", xCenter, yTxt);
	                    
	                    //icon
	                    var icoCenter = xCenter -11;
	                    var img = chartUtil.waiting;
	                    ctx.drawImage(img, icoCenter, 35, 22, 38);
	                }else if(ele.status == chartUtil.statusWarn){
	                    //bg
	                    ctx.fillStyle = "#ffffff06";
	                    ctx.fillRect(xBoxStart, yBoxStart, xBoxEnd, yBoxEnd);
	
	                    //btn
	                    ctx.beginPath();
	                    ctx.fillStyle = "#ff952b";
	                    ctx.roundedRectangle(xBtnStart, yBtnStart, xBtnEnd, yBtnEnd, 5);
	                    ctx.fill();
	
	                    ctx.font = "12px Arial";
	                    ctx.fillStyle = "#ffffff";
	                    ctx.textAlign = "center";
	                    ctx.fillText("확인하기", xCenter, yTxt);
	
	                    //icon
	                    var icoCenter = xCenter -12;
	                    var img = chartUtil.warning;
	                    ctx.drawImage(img, icoCenter, 32, 24, 41);
	                }else if(ele.status == chartUtil.statusSeri){
	                    //bg
	                    ctx.fillStyle = "#ffffff06";
	                    ctx.fillRect(xBoxStart, yBoxStart, xBoxEnd, yBoxEnd);
	
	                    //btn
	                    ctx.beginPath();
	                    ctx.fillStyle = "#ff952b";
	                    ctx.roundedRectangle(xBtnStart, yBtnStart, xBtnEnd, yBtnEnd, 5);
	                    ctx.fill();
	
	                    ctx.font = "12px Arial";
	                    ctx.fillStyle = "#ffffff";
	                    ctx.textAlign = "center";
	                    ctx.fillText("확인하기", xCenter, yTxt);
	
	                    //icon
	                    var icoCenter = xCenter -11;
	                    var img = chartUtil.serious;
	                    ctx.drawImage(img, icoCenter, 35, 22, 38);
	                }else{
	                    //lock
	                }
	            });
	            ctx.restore();
	        }
	        
	    }
	    });
	
	  }
	}
}

