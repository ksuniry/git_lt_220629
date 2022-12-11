var INDEX = CommonPageObject.clone();


INDEX.pageInit = function(){
	INDEX.location.pageInit();
}


// 화면내 초기화 부분
INDEX.location.pageInit = function() {
	
	getNewChapter();
	
}

////////////////////////////////////////////////////////////////////////////////////
// 번호조회
//  
function getNewChapter(){
	
	var inputParam 		= {};
	inputParam.sid 		= "selectSetSat";
	inputParam.target 	= "local";
	inputParam.url 		= "/selectSetSat";
	inputParam.data 	= {};
	inputParam.callback	= INDEX.callBack; 
	
	gfn_Transaction( inputParam );
}

function insNewChapter(){
	
	var inputParam 		= {};
	
	$('input[id^=ins]').each(function(){
		var thisVal = $(this).val();
		if(thisVal == ""){
			$(this).focus();
			$('#info').text('입력해주세요');
			return;	
		}else{
			inputParam.data.add(this.id,this.val());
		}
	})
	
	
	inputParam.sid 		= "insNewChapter";
	inputParam.target 	= "local";
	inputParam.url 		= "/insNewChapter";
	inputParam.data 	= {};
	inputParam.callback	= INDEX.callBack; 
	console.log(inputParam.data);
	
	
	
} 

function makeStairStart(){
	
	var inputParam 		= {};
	inputParam.sid 		= "makeStair";
	inputParam.target 	= "local";
	inputParam.url 		= "/makeStair";
	inputParam.data 	= {};
	inputParam.callback	= INDEX.callBack; 
	console.log(inputParam.data);
	gfn_Transaction( inputParam );
	
}


function btnVerifyStart(){
	
	var inputParam 		= {};
	inputParam.sid 		= "verifyStart";
	inputParam.target 	= "local";
	inputParam.url 		= "/verifyStart";
	inputParam.data 	= {};
	inputParam.callback	= INDEX.callBack; 
	console.log(inputParam.data);
	gfn_Transaction( inputParam );
	
}


function crawlingChapter(){	
	var inputParam 		= {};
	inputParam.sid 		= "crawlingChapter";
	inputParam.target 	= "local";
	inputParam.url 		= "/crawlingChapter";
	inputParam.data 	= {};
	inputParam.callback	= INDEX.callBack;
	gfn_Transaction( inputParam );
}

////////////////////////////////////////////////////////////////////////////////////
// 콜백 함수
//function fn_callBack(sid, result, success){

INDEX.callBack = function(sid, result, success){
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	if(sid == "selectSetSat"){
		INDEX.variable.detailData = result;
		console.log(INDEX.variable.detailData);
		$('#insChapter').val(result.ins_chapter);
		$('#insDt').val(result.ins_saturday);
		$('#lastChapter').val(result.chapter);
		$('#lastNum1').val(result.num1);
		$('#lastNum2').val(result.num2);
		$('#lastNum3').val(result.num3);
		$('#lastNum4').val(result.num4);
		$('#lastNum5').val(result.num5);
		$('#lastNum6').val(result.num6);
		$('#lastBonus').val(result.bonus);
		$('#lastDt').val(result.dt);
		$('#nowInfo').show();
		$('#insInfo').hide();
		if(result.update_yn == 'Y'){
			$('#chapter_update_btn').show();
			$('#chapter_update_label').hide();
		}else{
			$('#chapter_update_label').show();
			$('#chapter_update_btn').hide();
		}
	}else if(sid == "crawlingChapter"){
		if(result.continue){
			crawlingChapter();
			$('#nowInfo').hide();
			$('#insInfo').show();
			$('#insChapter').text(result.ins_chapter);
		}else{
			getNewChapter();
		}
	}else if(sid=="verifyStart"){
		
	}	
}
////////////////////////////////////////////////////////////////////////////////////

INDEX.pageInit();
