var INDEX = CommonPageObject.clone();

/* 화면내 변수  */
INDEX.variable = {
	sendData		: {}								// 조회시 조건
	,detailData		: {}								// 조회 결과값
	,noHead			: false								// 해더영역 존재여부 default 는 false  popUp은 true
}

/* 이벤트 정의 */
INDEX.events = {
	'click #saveBtn'	: 'INDEX.event.clickSaveBtn'
}

INDEX.init = function(){
	alert('1');
	//여기에 최초 실행될 자바스크립트 코드를 넣어주세요
	/*eventBind*/
	CommonPageObject.eventBind('INDEX');
	gfn_OnLoad();
	INDEX.location.pageInit();
}


// 화면내 초기화 부분
INDEX.location.pageInit = function() {
	
	INDEX.tran.getNewChapter();
	
}
////////////////////////////////////////////////////////////////////////////////////
// event
//  
INDEX.event.clickSaveBtn = function(){
	
}
////////////////////////////////////////////////////////////////////////////////////
// 번호조회
//  
INDEX.tran.getNewChapter = function() {
	
	var inputParam 		= {};
	inputParam.sid 		= "getNewChapter";
	inputParam.target 	= "local";
	inputParam.url 		= "/getNewChapter";
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
	
	if(sid == "getNewChapter"){
		INDEX.variable.detailData = result;
	}
}
////////////////////////////////////////////////////////////////////////////////////
// 지역함수
INDEX.location.displayDeatil = function() {
}

INDEX.init();
