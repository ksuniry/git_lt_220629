/**
* 파일명 : /js/cmm/pageReadyInit.js
 */

var CommonPageObject = {
	init : function() {},
	
	/*화면내 변수*/
	variable : {},
	
	/*event 이벤트 정의 영역*/
	events : {},
	
	/*event 이벤트 함수 영역*/
	event : {},
	
	/*지역  함수 영역*/
	location : {},
	
	/*거래호출  함수 영역*/
	tran : {},
	
	/*callBack 콜백 정의 영역*/
	callBack : {},
	
	eventBind : function(screenObj){
	},
	
	clone : function() {
		var me = this;
		return $.extend(true, {}, me);
	}
}