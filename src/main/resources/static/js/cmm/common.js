var g_arrTrans = new Array();
var g_transInfo = new Array();
/**************************************************************** 
* Desc 	: API서버에 Ajax 호출 후 에러 발생 시 후속처리
* @Method Name : gfn_errorCallback  
* @param   :	1. httpCode : Http Code 
* 				2. resultJson : 응답 json data
* @return   : 없음
****************************************************************/
function gfn_errorCallback(httpCode, resultJson, inputParam) {
	var errMsg = "";
	var addMsg = "";
	var result = {}
	if(!ComUtil.isNull(resultJson)){
		result = JSON.parse(resultJson);
		gfn_log("errorResult!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
		gfn_log(result);
		g_transInfo[inputParam.url].tranSuccess = true;
		gfn_endTran(inputParam);
	}
	else{
		// 결과값이 오지 않은경우에만  해당거래에 대해서 3회까지 재조회 설정 
		g_transInfo[inputParam.url].tranSuccess = false;
		g_transInfo[inputParam.url].errorCnt++;
		if(gfn_endTran(inputParam)){
			return;
		}
	}
	
	
	if(httpCode == "401") {
		// result_cd에 따라서 후속 조치를 한다.
		var objAuth = JSON.parse(resultJson);
		addMsg = "[" + objAuth.result_cd + " || " + objAuth.result + " ||" + objAuth.message + "]";
		//return;
		if(objAuth.result_cd == "31") {
			//토큰 유효기관 만료로 인한 Active token 재 발급
			//토큰 재 발급 후에 네이티브로 새로 발급된 토큰을 전달 한다.
			errMsg = "토큰 유효기간이 만료되어 재발급을 진행하겠습니다.";
			gfn_errorMsgBox(errMsg + addMsg, '', function(){
				gfn_getToken();
			});
		} else {
			//본인인증을 진행한다.
			errMsg = "비정상적인 접근이 확인되었습니다. 고객님의 소중한 정보보호를 위해 본인인증을 다시 해주십시요.";
			
			// 앱 종료
			if(gfn_getScreenId() != 'testMain'){
				gfn_finishView( {msg:errMsg});
			}
			//else{
			//	gfn_errorMsgBox(errMsg + addMsg, '', function(){
					//gfn_getToken();
			//	});
			//}
			
			//gfn_errorMsgBox(errMsg + addMsg,'', function(){
				//history.back();
			//});
			//본인인증 처리 화면으로 이동
		}
	}
	else if(httpCode == "999") {	// refresh token error expire
		//gfn_reLogin(); 
	} 
	else {
		//HTTP Code 가 200 , 401 아닌 경우 고객에게 노출하고, 이전 화면으로 이동한다.
		//addMsg = "[" + httpCode + " || " + resultJson + "]"
		// 오류를 저장하자. alert(inputParam);
		
		errMsg = ComUtil.null(result.message, "서버에서 오류가 발생하였습니다. 잠시 후 다시 진행 해주세요.");
		
		gfn_errorMsgBox(errMsg, '', function(){
			//history.back();
		});
	}
}


/**************************************************************** 
* Desc 	: Ajax로 API를 호출하는 함수
* @Method Name : gfn_Transaction  
* @param   :	1. inputParam : 호출할 API의 정보를 담고 있는 object 
* 				   - inputParam.data : API 호출 Req json Object
* 				   - inputParam.callback : 호출 성공 시 호출된 call back 함수 명
* 				   - inputParam.sid : 호출 성공 시 호출된 call back 함수 내의 처리 SID
* @return   : 없음
****************************************************************/
function gfn_Transaction( inputParam ) {
	if(sStorage.getItem('finish') == 'Y'){
		return;
	}
	
	//loadStart();
	if(!gfn_checkDuplicateTran(inputParam)){
		return false;
	}
	
	var callback = inputParam.callback;
	
	if(typeof inputParam.data == "string"){
		inputParam.data += "&SID=" + inputParam.sid;
		inputParam.data += "&AJAX=" + "Y";
	}
	if(typeof inputParam.data == "object"){
		inputParam.data.SID = inputParam.sid;
		inputParam.data.AJAX = "Y";
	}
	
	
	inputParam.appMode = $('#operEnv').val();
	var url = "";
	url = gfn_getTranUrl(inputParam) + inputParam.url;
	
	$.ajax({
		 // url: (inputParam.application == false) ? "" : "http://localhost:8000" + inputParam.url
		 // url: "https://api-dev.wealthguide.co.kr" + inputParam.url
		  url		: url
		, type		: "POST"
		, jsonp		: false 
		, data		: JSON.stringify(inputParam.data)
		, dataType	: "json"
		, contentType: "application/x-www-form-urlencoded; charset=UTF-8"
		//, contentType: "application/json; charset=UTF-8"
		, async		: ComUtil.null(inputParam.bAsync, true)
		
		,beforeSend: function (xhr) {
			$('#loadingTxt').html(ComUtil.null(inputParam.loadingTxt, '잠시만 기다려주세요'));
			$('#divProgressPop').show();
			
			gfn_log("sendData ---------------------------------");
			gfn_log(inputParam.data);
            xhr.setRequestHeader("Content-type","application/json");
            //xhr.setRequestHeader("Authorization", "Bearer " + gfn_readToken());
			
        }
		, success	: function(result, textStatus, data) {
			
			g_transInfo[inputParam.url].tranSuccess = true;
			gfn_endTran(inputParam);
			result.sendData = inputParam.data;
			gfn_log("result ---------------------------------");
			gfn_log(result);
			
			
	   		if(!gfn_isNull(result.pageInfo)){
				result.pageInfo.responseURL = data.responseURL + "?" + inputParam.data;
		    }
		   
			if( typeof callback != "function"){
				if ( window.fn_callBack ) {
					fn_callBack(inputParam.sid, result, textStatus);    
				}
			}
			else {
				callback(inputParam.sid, result, textStatus);
			}
		}
		, error		: function(xhr, errorName, error) {
			//debugger;
			//gfn_endTran(inputParam);
			try{
				gfn_errorCallback(xhr.status, xhr.responseText, inputParam);
			}
			catch(e) {
				gfn_log("gfn_errorCallback error!!");
			}
		}
	});
}



/**************************************************************** 
* Desc 	: 중복거래 체크 로직
* @Method Name : gfn_checkDuplicateTran  
* @param    :	1. inputParam
* @return   :  boolean  false(중복발생) / true(중복없음) 
****************************************************************/
function gfn_checkDuplicateTran(inputParam){
	if( ComUtil.isNull(inputParam.url)){
		gfn_alertMsgBox("거래요청이 잘못되었습니다.");
		return false;
	}
	
	if(g_arrTrans.indexOf(inputParam.url) > -1){
		
		if(g_transInfo[inputParam.url].errorCnt < 3){
			return true;
		}
		else{
			gfn_log("중복거래!!!! 패스~ " + inputParam.url);
			return false;
		}
	}
	else{
		eval('g_transInfo["'+inputParam.url+'"] = {}');
		g_transInfo[inputParam.url].startTm = ComUtil.date.curDate('YYYYMMDDHHmmssSSS');
		g_transInfo[inputParam.url].errorCnt = 0;
		
		g_arrTrans.push(inputParam.url);
		gfn_log(inputParam.url + " start :: " + g_transInfo[inputParam.url].startTm);
		return true;
	}
}

/**************************************************************** 
* Desc 	: 거래 이후 작업
          거래중 내용 제거 및 뺑뺑이 제거 
* @Method Name : gfn_endTran  
* @param    :	1. inputParam
* @return   :  없음 
****************************************************************/
function gfn_endTran(inputParam){
	
	g_transInfo[inputParam.url].endTm = ComUtil.date.curDate('YYYYMMDDHHmmssSSS');
	gfn_log(inputParam.url + " end :: " + g_transInfo[inputParam.url].endTm);
	gfn_log(inputParam.url + " errorCnt :: " + g_transInfo[inputParam.url].errorCnt);
	gfn_log(inputParam.url + " total :: " + (g_transInfo[inputParam.url].endTm - g_transInfo[inputParam.url].startTm) / 1000 + "초");

	if(g_transInfo[inputParam.url].errorCnt < 3 && !g_transInfo[inputParam.url].tranSuccess){
		gfn_Transaction(inputParam);
		return false;
	}
	else{
		var idx = g_arrTrans.indexOf(inputParam.url);
		if(idx > -1){
			g_arrTrans.splice(idx, 1);
		}
		
		$('#divProgressPop').hide();
		return true;
	}
}


/**************************************************************** 
* Desc 	: application 별 서비스 호출 url을 생성한다.
* @Method Name : gfn_getTranUrl  
* @param   :	1. target 		: api, auth, home
* 				2. appMode 		: local, dev, oper
* @return   : url
****************************************************************/
function gfn_getTranUrl(sParam){
	var host = location.host;
	var target = sParam.target;
	if(ComUtil.isNull(sParam.appMode)){
		 sParam.appMode = $('#operEnv').val();
	}
	
	var url = "";
	var localPort = 80;
	var localip = $('#lip').val();
	
	
	if(sParam.target == "home"){
		if     (sParam.appMode == "oper"){url = 'https://';}
		else if(sParam.appMode == "test"){url = 'https://';}
		else if(sParam.appMode == "dev"){url = 'https://';}
		else if(sParam.appMode == "local"){url = 'https://';}
		else 						 	{url = location.host;}
	}
	else if(sParam.target == "api") {
		
	}
	else if(sParam.target == "auth") {
		
	}
	else if(sParam.target == "appweb") {
		
	}
	else if(sParam.target == "oapi") {
	
	}
	else{
		sParam.appMode = "local";
		url = 'http://'+location.hostname+':' + localPort;
	}
	gfn_log(sParam.appMode + "  url :: " + url);
	return url;
}

function gfn_isLocal(){
	return ("localhost" == location.hostname || $('#lip').val() == location.hostname || "127.0.0.1" == location.hostname || location.hostname.indexOf('192.168') > -1 ) ? true : false;
	//return false;
}

function gfn_isDev(){
	return ("appweb-dev.lt.co.kr" == location.hostname) ? true : false;
}

function gfn_isTest(){
	return ("appweb-test.lt.co.kr" == location.hostname) ? true : false;
}

function gfn_isOper(){
	return (gfn_isLocal() || gfn_isDev() || gfn_isTest()) ? false : true;
	//return true;
}


/**************************************************************** 
* Desc 	: 내부이동 페이지별 url을 저장한다.
* @Method Name 	: gfn_pushHitory  
* @param   		: 1. url  이동하는 내부 페이지 주쇼
* @return   	: null
****************************************************************/
function gfn_pushHitory(url){
	if(sStorage){
		var hArr = sStorage.getItem("gHistoryArr");
		if(ComUtil.isNull(hArr)){
			hArr = new Array();
		}
		
		hArr.push(url);
		//gfn_log("gfn_pushHitory :: " + hArr.length);
		sStorage.setItem("gHistoryArr", hArr);
	}
}

/**************************************************************** 
* Desc 	: 이전 내부이동 페이지별 url을 반환한다.
* @Method Name 	: gfn_popHitory  
* @param   		: null
* @return   	: url
****************************************************************/
function gfn_popHitory(){
	var hArr = sStorage.getItem("gHistoryArr");
	gfn_log("gfn_popHitory :: " + hArr.length);
	if(ComUtil.isNull(hArr)){
		return "";
	}
	
	var url = hArr.pop();
	/*if(url == '/pension_advice/dashBoard/DASHBRD01S00'){
		url = '/pension_advice/dashBoard/DASHBRD01S01';
	}*/
	sStorage.setItem("gHistoryArr", hArr);
	
	return url;
}

/**************************************************************** 
* Desc 	: 현재페이지의 화면 아이디를 리턴한다. 
* @Method Name 	: gfn_getScreenId  
* @param   		: null
* @return   	: screenId
****************************************************************/
function gfn_getScreenId(){
	var gCurScreenId 	= gfn_getPopupScreen(false);	// 팝업의 스크린 아이디
	if(ComUtil.isNull(gCurScreenId)){
		var path = location.pathname;
		return path.substr(path.lastIndexOf('/')+1);
	}
	else{
		return gCurScreenId;
	}
}


/**************************************************************** 
* Desc 	: 이전 이동 페이지별 url만 확인한다.
* @Method Name 	: gfn_getPreScreenId  
* @param   		: null
* @return   	: url
****************************************************************/
function gfn_getPreScreenId(){
	var url = gfn_popHitory();	// 이전화면 url
	
	if(ComUtil.isNull(url)){
		return "";
	}
	
	gfn_pushHitory(url);	// 다시 원복
	
	
	return url.substr(url.lastIndexOf('/')+1);
}

function gfn_historyClear(){
	
	sStorage.setItem("homeUrl", '');
	sStorage.setItem("gHistoryArr", '');
}
/**************************************************************** 
* Desc 	: 백버튼 클릭시 이전 화면으로 이동한다. 
* @Method Name 	: gfn_historyBack  
* @param   		: null
* @return   	: null
****************************************************************/
function gfn_historyBack(){
	gfn_clearPopupScreen();
	
	var url = gfn_popHitory();
	if(ComUtil.isNull(url)){
		
		// 권한별 main화면에서 뒤로 가기를 누른 경우 더이상 뒤로 갈수 없기 때문에 네이티브에 알려준다.
		var homeUrl = ComUtil.null(sStorage.getItem('homeUrl'), '');
		if(homeUrl.indexOf(gfn_getScreenId()) > -1){
			if(gfn_isMobile()){
				gfn_finishView( {msg:'앱을 종료하시겠습니까?', status:'c'});
			}
			else{
				gfn_log("더이상 뒤로 갈수 없어요!!");
			}
			return false;
		}
		
		
		if(gfn_isMobile()){
			gfn_historyClear();
			gfn_goMain();
		}
		else{
			gfn_historyClear();
			gfn_goMain();
			gfn_log("더이상 뒤로 갈수 없어요!!");
		}
		
		return false;
	}
	
	
	/*예외화면 정의*/
	if('UNTOPEN10S02'.indexOf(gfn_getScreenId()) > -1){
		if( $.type(window[gfn_getScreenId()]['callBack']['close']) === 'function'){
			window[gfn_getScreenId()].callBack.close();
		}
		return false;
	}
	/*--예외화면 정의*/
	
	
	
	if("/untact_open/UNTOPEN01S01" == url){
		// 비대면 계좌개설중 백버튼 이용시
		gfn_confirmMsgBox("계좌개설을 종료하시겠습니까?", '', function(returnData){
			
			if(returnData.result == 'Y'){
				ComUtil.moveLink(url, false);
			}
			else{
				gfn_pushHitory(url);
			}
		});
	}
	else{
		ComUtil.moveLink(url, false);
	}
	
}

/**************************************************************** 
* Desc 	: 로컬로 테스트일 경우만 내용 출력 
* @Method Name 	: gfn_log  
* @param   		: msg
* @return   	: null
****************************************************************/
function gfn_log(msg){
	
	if(gfn_isLocal() || gfn_isDev()){
		if ( typeof msg  == "string" ) {
			console.log(msg);
		} else {
			var jsonData = JSON.stringify(msg);
			gfn_log("jsonData  : " + jsonData);
		}
	}
}


	
// form validation 
function gfn_validationForm(formObj){
	
	var strConArr = formObj.serialize();
	var conArr = strConArr.split('&');
	for(var i = 0 ; i < conArr.length; i++){
		var itemArr = conArr[i].split('=');
		var conObj = $("#" + itemArr[0]);

		var depends = conObj.attr("depends");
		var val = conObj.val();
		var title = gfn_strNvl(conObj.attr("title"));

		// depends check
		if( !gfn_isNull( depends ) ){
			depends = "|" + conObj.attr("depends").split(",").join("|") + "|";
			// 필수값체크
			if( depends.indexOf("|required|") > -1){
				if (gfn_isNull(val)) {
//					alert(title + " 필수값입니다.");
					alert(title + gfn_getMsg("common.required.msg"));
					
					conObj.focus();
					return false;
				}
			}

			// 숫자알파벳 체크
			if( depends.indexOf("|englishNumeric|") > -1){
				if (!gfn_checkEnglishNumeric(val)) {
					alert(gfn_getMsg("errors.english_numeric", title));
					conObj.focus();
					return false;
				}
			}
			
			// 알파벳 체크
			if( depends.indexOf("|english|") > -1){
				if (!gfn_checkEnglish(val)) {
					alert(gfn_getMsg("errors.english", title));
					conObj.focus();
					return false;
				}
			}
			
			// 숫자 체크
			if( depends.indexOf("|numeric|") > -1){
				if (!gfn_checkNumber(val)) {
					alert(gfn_getMsg("errors.numeric", title));
					conObj.focus();
					return false;
				}
			}
			
			// 이메일 주소 유효성 체크
			if( depends.indexOf("|email|") > -1){
				if(!gfn_checkEmail(val)) {
//					alert("올바른 형식의 이메일주소가 아닙니다.");
					alert(gfn_getMsg("errors.email", title));
					conObj.focus();
					return false;
				}
			}

		}
		
		// maxlength
		var maxlength = conObj.attr("maxlength");
		// maxlength 를 자체적으로 가지고 있는 경우가 있음 (ckEdit 처럼 -1이 default 값임) 이때는 maxlength가 0 이상일 경우만 처리한다. 
		if( !gfn_isNull( maxlength ) && maxlength > 0){
			// 필수체크는 위에서 처리하였기 때문에 존재할경우만 처리한다.
			if( !gfn_isNull( val ) ){
				if( val.length > maxlength){
					alert(title + " 최대입력길이 " + maxlength + "를 초과하였습니다.");
					conObj.focus();
					return false;
				}
			}
		}
	}
	
	return true;
}

/**************************************************************** 
* Desc 	: 공통으로 사용되는 이동함수(이후 권한 관련 포함 예정)
* @Method Name : gfn_commonGo  
* @param   :	1. psUrl : 이동할 url 
* 				2. paParam : 팝업에 전달되는 파라미터(배열형태)
* 				3. psPopupYn : 팝업을 할건지에 대한 플래그
* @return   : 없음
****************************************************************/
function gfn_commonGo(psUrl, paParam, psPopupYn){
	var url = gfn_getApplication() + psUrl;
	//alert(url);
	$("#dataForm").attr('action', url);
	$("#dataForm").submit();
	// form 생성하자.
	/*
	var $form = $('<form></form>');
    $form.attr('action', url);
    $form.attr('method', 'post');
    $form.appendTo('body');
    
    if(psPopupYn == "Y"){
    	
    }
    else{
    	// 핸재 보내는곳의 주소 (돌아올곳.)
    	paParam.FIND_RETURNURL = gfn_getListUrl();
    	// 메뉴변수 셋팅
		gfn_setMenuParams(paParam);
    }
    
    
    for(_paParam in paParam){
    	$form.append($('<input type="hidden" value="'+paParam[_paParam]+'" name="'+_paParam+'">'));
    }
    
//    debugger;
    
    if(psPopupYn == "Y"){
    	var option = (gfn_isNull(fa_POP_STYLE[psUrl])) ? fa_POP_STYLE["DEFAULT"] : fa_POP_STYLE[psUrl];
    	var win = window.open("", psUrl, option);
    	
    	$form.attr('target', psUrl);
    	$form.submit();
    	win.focus();
    }
    else{
    	$form.submit();
    }
*/
    
}


function gfn_checkAll(pObj, eventSrc, pCheckName) {
	var tbl = $("#"+pObj);
	var name = "";
	if(!gfn_isNull(pCheckName)){
		name = "[name="+pCheckName+"]";
	}
	
	if($(eventSrc).is(":checked")) {
		$(":checkbox" + name, tbl).attr("checked", "checked");
	} else {
		$(":checkbox"+ name, tbl).removeAttr("checked");
	}
	
	try{
		fn_checkAllCallBack(pObj, eventSrc); 
	}
	catch(e){}
}

function gfn_getRadioOk(tbID, pRadioName){
	var SEL_CNT = 0;
	var reqKey = "";
	
	var name = "";
	if(!gfn_isNull(pRadioName)){
		name = "[name="+pRadioName+"]";
	}
	
	$("#"+tbID+ " :radio" + name).each(function(){
		if( $(this).is(":checked") ) {
			var objPrnt = $(this).parent().parent();
			
			SEL_CNT ++;	
			
			reqKey += gfn_replaceAll($('input[type=hidden]', objPrnt).serialize(), "&", ";");
		}
	});
	
	if(SEL_CNT == 0){
		alert('1건 이상 선택후 버튼을 클릭하여 주십시오.');
		return;
	}
	
	return reqKey;
}

function gfn_getCheckOk(tbID, pCheckName){
	var SEL_CNT = 0;
   	var reqKey = "";
   	
   	var name = "";
	if(!gfn_isNull(pCheckName)){
		name = "[name="+pCheckName+"]";
	}
   	
   	$("#"+tbID+ " :checkbox"+name).each(function(){
   		if( $(this).is(":checked") ) {
   			var objPrnt = $(this).parent().parent();
   			
   			SEL_CNT ++;	
   			
   			if(SEL_CNT > 1) {
   				reqKey += '@@';
   			}
   			
   			reqKey += gfn_replaceAll($('input[type=hidden]', objPrnt).serialize(), "&", ";");
   		}
   	});
   	
   	if(SEL_CNT == 0){
   		alert('1건 이상 선택후 버튼을 클릭하여 주십시오.');
   		return;
   	}
   	
   	return reqKey;
}


function gfn_getCheckOkInsrt(tbID, hiddenInfo, pCheckName){
	var SEL_CNT = 0;
	var reqKey = "";
	var name = "";
	if(!gfn_isNull(pCheckName)){
		name = "[name="+pCheckName+"]";
	}
	
	$("#"+tbID+ " :checkbox"+name).each(function(){
		if( $(this).is(":checked") ) {
			var objPrnt = $(this).parent().parent();
			
			SEL_CNT ++;	
			
			if(SEL_CNT > 1) {
				reqKey += '@@';
			}
			
			for(_hiddenInfo in hiddenInfo){
				var hidInfoType = $("[name="+hiddenInfo[_hiddenInfo]+"]",objPrnt).attr("type");
				
				if (hidInfoType == "hidden" || hidInfoType == "text" ) {
					reqKey += hiddenInfo[_hiddenInfo]+"="+$('input[name='+ hiddenInfo[_hiddenInfo] +']', objPrnt).val() + ";";
				} else if (hidInfoType.indexOf("select") >= 0) {
					reqKey += hiddenInfo[_hiddenInfo]+"="+$('select[name='+ hiddenInfo[_hiddenInfo] +']', objPrnt).val() + ";";
				} else
					reqKey += hiddenInfo[_hiddenInfo]+"=;";
			}
		}
	});
	
	if(SEL_CNT == 0){
		alert('1건 이상 선택후 버튼을 클릭하여 주십시오.');
		return;
	}
	
	return reqKey;
}

// 특정영역내 데이터 클리어
function gfn_clearData(pArea){
	pArea.find('input,select,combo,textarea').each(function(i){
		if($(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio'){
			if($(this).attr('checked')){
				$(this).removeAttr("checked");
			}
		}else{
			$(this).val("");
		}
	});	
}

/**************************************************************** 
 * Desc 	: 목록 상세조회 값 셋팅
 * @Method Name : gfn_setDetails  
 * @param   
 * @return   : 없음
 ****************************************************************/
function gfn_setDetails(oJsonObj, pArea){
	var objs = null;
	if(gfn_isNull(pArea))
		pArea = $('html');
		
	if(oJsonObj == null){
		return;
	}
	
	objs = pArea.find("input");
	for(var i = 0; i< objs.length; i++){
		var skey = objs[i].name;
//		var skey = !gfn_isNull(objs[i].id) ? objs[i].id : objs[i].name;
		
		
		if(skey != null && skey != ''){
			try{
				if(eval("oJsonObj." + skey) || eval("oJsonObj." + skey) == 0 ){
					var svalue = eval("oJsonObj." + skey);
					if(svalue == "null" || svalue == "[object Object]"){
						continue;
					}
					if(objs[i].type == 'radio'){
//						svalue = eval("oJsonObj." + skey);
//						skey = !gfn_isNull(objs[i].name) ? objs[i].name : objs[i].id;
						$(':input:radio[name="'+objs[i].name+'"]:input[value="'+svalue+'"]').attr("checked", true);
					}
					else if(objs[i].type == 'checkbox'){
//						svalue = eval("oJsonObj." + skey);
						var checkArr = svalue.split(",");
						for(var k= 0; k<checkArr.length ; k++){
							$(':input:checkbox[name="'+objs[i].name+'"]:input[value="'+checkArr[k]+'"]').attr("checked", true);
						}
					}
					else{
						objs[i].value = svalue;
					}
					
					if($('#' + skey).attr("isNum") == "Y"){
						//$('#' + skey).toPrice();
						$('#' + skey).val(gfn_maskAmt(svalue, ture));
					}
					
					if($('#' + skey).attr("isDate") == "Y"){
						$('#' + skey).val(gfn_maskDate(svalue));
					}
				}
			}
			catch(e){}
		}
	}
			
	objs = pArea.find("textarea, p");
	for(var i = 0; i< objs.length; i++){
		var skey = objs[i].id;
		if(skey != null && skey != ''){
			if(eval("oJsonObj." + skey) || eval("oJsonObj." + skey) == 0 ){
				
				var svalue = eval("oJsonObj." + skey);
				if(svalue == "null" || svalue == "[object Object]"){
					continue;
				}
				objs[i].value = svalue;
			}
		}
	}
	
	objs = pArea.find("select");
	for(var i = 0; i< objs.length; i++){
		var skey = objs[i].id;
		if(skey != null && skey != ''){
			if(eval("oJsonObj." + skey) || eval("oJsonObj." + skey) == 0 ){
	
				var svalue = eval("oJsonObj." + skey);
				if(svalue == "null" || svalue == "[object Object]"){
					continue;
				}
				// original
				objs[i].value = svalue;
				// css 특수
				//gfn_setSelect($("#"+skey), svalue);
			}
		}
	}
	
	objs = pArea.find("span, em");
	for(var i = 0; i< objs.length; i++){
		var skey = objs[i].id;
		/*
		if(skey == "payment_distribute_expl"){
			debugger;
		}
		*/
		if(skey != null && skey != ''){
			try{ 
				if(eval("oJsonObj." + skey) || eval("oJsonObj." + skey) == 0 ){
	
					var svalue = eval("oJsonObj." + skey);
					if(svalue == "null" || svalue == "[object Object]"){
						continue;
					}
					//gfn_log(skey + " || " + skey.lastIndexOf("_dis"));
					if(skey.endsWith("_dis")) {
						// 숫자의 경우 양수는 빨간색,  음수는 파랑색 표시
						if(ComUtil.null($(objs[i]).data("addclass"), false) == true){
							if( parseFloat(svalue) > 0 ){
								$(objs[i]).addClass('plus');
							}
							else if( parseFloat(svalue) < 0 ){
								$(objs[i]).addClass('minus');
							}
						}
						// 내려온 유닛정보를 표시할지 여부
						if(ComUtil.null($(objs[i]).data("nounit"), false) == false){
							unitKey = skey.substr(0, skey.lastIndexOf("_dis")) + '_unit'; 
							//console.log(unitKey);
							svalue = svalue + ComUtil.null($(objs[i]).data("space"), "") + eval("oJsonObj." + unitKey);
						}
						else{
							// unit 이 분리된경우에  빨간색, 파랑색 적용이 필요할 경우
							unitKey = skey.substr(0, skey.lastIndexOf("_dis")) + '_unit'; 
							if(ComUtil.null($(objs[i]).data("addclass"), false) == true){
								if( parseFloat(svalue) > 0 ){
									$('#'+unitKey, pArea).addClass('plus');
								}
								else if( parseFloat(svalue) < 0 ){
									$('#'+unitKey, pArea).addClass('minus');
								}
							}
						}
						
						// 플러스의 경우 앞에 + 표시를 할지 여부 (안쓰를걸로함.)
						/*
						if(ComUtil.isNull($(objs[i]).data("addplus")) == false){
							valueKey = skey.substr(0, skey.lastIndexOf("_dis")) + '_' + $(objs[i]).data("addplus"); 
							if( parseFloat(eval("oJsonObj." + valueKey)) > 0 ){
								svalue = "+" + svalue;
							}
						}
						*/
					}
					if($('#' + skey).attr("isNum") == "Y"){
						svalue = gfn_maskAmt(svalue, true);
					}
					if($('#' + skey).attr("isDate") == "Y"){
						svalue =  gfn_maskDate(svalue);
					}
					objs[i].innerHTML = svalue;
				}
			}catch(e){}
		}
	}
	
	objs = pArea.find("img");
	for(var i = 0; i< objs.length; i++){
		var skey = objs[i].id;
		var altKey = objs[i].id + "_ALT";
		
		if((skey != null && skey != '')){
			try{
				var svalue = "";
				var altValue = "IMAGE";
				
				if(eval("oJsonObj." + skey) || eval("oJsonObj." + skey) == 0 ){
					svalue = eval("oJsonObj." + skey);
					if(svalue == "null" || svalue == "[object Object]"){
						continue;
					}
					objs[i].src = svalue;
				}
				
				if(eval("oJsonObj." + altKey) || eval("oJsonObj." + altKey) == 0 ){
					altValue = eval("oJsonObj." + altKey);
					objs[i].alt = altValue;
				} else {
					objs[i].alt = altValue;
				}
			}catch(e){}
		}
	}
	
	objs = pArea.find("td,th,p");
	for(var i = 0; i< objs.length; i++){
		var skey = objs[i].id;
		if(skey != null && skey != ''){
			if(eval("oJsonObj." + skey) || eval("oJsonObj." + skey) == 0 ){
				
				var svalue = eval("oJsonObj." + skey);
				if(svalue == "null" || svalue == "[object Object]"){
					continue;
				}
				
				if($('#' + skey).attr("isNum") == "Y"){
					svalue = gfn_maskAmt(svalue);
				}
				if($('#' + skey).attr("isDate") == "Y"){
					svalue =  gfn_maskDate(svalue);
				}
				
				objs[i].innerHTML = svalue;
			}
		}
	}
	
	objs = pArea.find("a");
	for(var i = 0; i< objs.length; i++){
		var skey = objs[i].id;
		if(skey != null && skey != ''){
			try{
				if(eval("oJsonObj." + skey) || eval("oJsonObj." + skey) == 0 ){
	
					var svalue = eval("oJsonObj." + skey);
					if(svalue == "null" || svalue == "[object Object]"){
						continue;
					}
					$(objs[i]).attr("href", svalue);
				}
			}catch(e){}
		}
	}
	
	
	// footer 호출
	try{changeContentSize();}catch(e){}
}

/****************************************************************
 * Desc 	: 날짜 필드 validation  (날짜 유효성 + 크로스체크 + 기간체크)
 * 작성일 	: 2014-03-19 (limalove)
 * @param   psStartDate : 시작일
 * 			psEndDate : 종료일
 * 			psType : (D =일 M= 월) 필요없으면 안써도됨.
 * 			psGigan : (1 : 15일 or 2 : 30일 or 3 : 2 개월 or 4 : 3개월 or 5 : 1년 or  6 : 6개월 )
 * 			psisAlert : 알럿창을 띄울것인가?  true/false    필요없으면 안써도됨.
 * @return  bValid : validateion 결과
 * 사용 예 	:
	if(!gfn_DateCrossCheckAll("CalFrom", "CalTo"))					return false;	// 유효성 + 크로스체크만 체크
	if(!gfn_DateCrossCheckAll("CalFrom", "CalTo", "D"))				return false;	// 유효성 + 크로스체크만 체크
	if(!gfn_DateCrossCheckAll("CalFrom", "CalTo", "D", 1))			return false;	// 유효성 + 크로스체크 + 기간체크
	if(!gfn_DateCrossCheckAll("CalFrom", "CalTo", "D", 1, false))	return false;	// 유효성 + 크로스체크 + 기간체크 알럿은 필요없을경우 사용
****************************************************************/
function gfn_DateCrossCheckAll(psStartDate, psEndDate, psType, psGigan, psisAlert) {
	var Option = 0;
	var isAlert = true;
	var extraDay = "";
	var fromObj = null;
	var toObj = null;
	
	if(!gfn_isNull(psType)){
		Option = (psType == "M" ? 1 : 0);
		if(psType == "M") extraDay = "01";
	}
	
	if(!gfn_isNull(psisAlert)){
		isAlert = psisAlert;
	}
	
	if (typeof psStartDate == "object")
		fromObj = psStartDate;
	else
		fromObj = $("#" + psStartDate);
	
	if (typeof psEndDate == "object")
		toObj = psEndDate;
	else
		toObj = $("#" + psEndDate);
	
	// 날짜유효성 체크
	if(!gfn_isValidDateCheck(fromObj, fromObj.val() + extraDay, isAlert))	return false;
	if(!gfn_isValidDateCheck(toObj, toObj.val()  + extraDay, isAlert))	return false;
	
	
	// 날짜 cross 체크
	if(!gfn_dateCrossCheck(fromObj.val() + extraDay, toObj.val()  + extraDay, false, isAlert)){
		fromObj.focus();
		return false;
	}
	
	// 기간체크값이 있으면 아래를 호출, 일자체크일 경우에만 기간체크가 가능하다.
	if(!gfn_isNull(psGigan) && Option == 0 ){
		if(!gfn_calcDayCheck(psStartDate, psEndDate, psGigan, isAlert))	return false;
	}
	
	return true;
}

// 날짜 입력값 이 정상인지 유효성 확인 
function gfn_isValidDateCheck(dtObj, value, psisAlert){
	var isAlert = true;
	if (!gfn_isNull(psisAlert)) isAlert = psisAlert; 
	if(!gfn_isNull(value)){
		value = gfn_replaceAll(value, "-", "");
		if (value.length == 8) {
			vDate = new Date();
			vDate.setFullYear(value.substring(0, 4));
			vDate.setMonth(value.substring(4, 6));
			vDate.setDate(value.substring(6));

			if (vDate.getFullYear() != value.substring(0, 4)
					|| vDate.getMonth() != value.substring(4, 6)
					|| vDate.getDate() != value.substring(6)) {
				if(isAlert){
					alert(dtObj.attr("title") + " 날짜형식이 틀렸습니다.");
//					alert(gfn_getMsg("errors.date", dtObj.attr("title")));
					dtObj.focus();
				}
				
				return false;
			}
			return true;
		}
	}
}


/*******************************************************************************
 * Desc : 날짜 필드 validation
 * 
 * @param psStartDate :
 *            시작일, psEndDate : 종료일, pfAllneed : 모두 필수값 여부
 *             		psisAlert						: 알렷 여부 디폴트 true
 * @return bValid : validateion 결과
 ******************************************************************************/
function gfn_dateCrossCheck(psStartDate, psEndDate, pfAllneed, psisAlert) {
	var isAlert = true;
	if (!gfn_isNull(psisAlert)) isAlert = psisAlert; 
	var bValid = true;
	if( !gfn_isNull(psStartDate) || !gfn_isNull(psEndDate) ){
		if(!gfn_isNull(psStartDate) && !gfn_isNull(psEndDate)){
			bValid = gfn_compareDateValue(psStartDate, psEndDate, psisAlert);
		}else{
			if(isAlert)	alert("시작, 종료일 모두 입력하셔야합니다.");
			bValid = false;
		}
	}else{
		if(pfAllneed){
			if(isAlert)	alert("시작, 종료일 모두 입력하셔야합니다.");
			bValid = false;
		}
	}
	
	return bValid;
}


/**************************************************************** 
 * Desc 	         						: 날짜크기비교
 * @param  입력인자  						:
 * 			fromDate 						: 시작일
 * 			toDate							: 종료일
 * 			psisAlert						: 알렷 여부 디폴트 true
 * @return  Boolean
 ****************************************************************/
function gfn_compareDateValue(fromDate, toDate, psisAlert){
	var isAlert = true;
	if (!gfn_isNull(psisAlert)) isAlert = psisAlert; 
	var from_dt;
    var to_dt; 
    var fromDate = gfn_replaceAll(fromDate, "-", "");
    var toDate = gfn_replaceAll(toDate, "-", "");
    
    //년월일체크 
    if (fromDate.length != 8 || toDate.length != 8){
    	if(isAlert) alert("날짜 형식이 잘못 되었습니다.");
        return false;
    }
    
    var s_year = fromDate.substring(0,4);
    var s_month = (Number(fromDate.substring(4,6)) - 1) + "";
    var s_day = fromDate.substring(6,8);
    var e_year = toDate.substring(0,4);
    var e_month = (Number(toDate.substring(4,6)) - 1) + "";
    var e_day = toDate.substring(6,8);
    
    from_dt = new Date(s_year, s_month, s_day);
    to_dt = new Date(e_year, e_month, e_day);
    
    if( ( to_dt.getTime() - from_dt.getTime() ) < 0 ){
    	if(isAlert)	alert('시작일 또는 종료일을 다시 확인해주시길 바랍니다.');
        return false;
    }
    else {
        return true;
    }
}

/**************************************************************** 
 * 조회일자 기간 체크
 * 
 * @param strObj 시작일자 Component의 ID
 * @param endObj 종료일자 Component의 ID
 * @param term 기간 구분 (D7 : 7일, D15 : 15일, M1 : 한달, M3 : 석달)
 * @param psisAlert alert 사용여부
 * @returns {Boolean}
****************************************************************/ 
function gfn_calcDayCheck(psStartDate, psEndDate, pTerm, psisAlert) {
	var isAlert = true;
	if (!gfn_isNull(psisAlert)) isAlert = psisAlert; 
	var fromObj = null;
	var toObj = null;
	var Option = "";
	var term = 0;
	var fromDt = "";
	
	if(!gfn_isNull(pTerm)){
		Option = pTerm[0];
		term = Number(pTerm.substr(1));
	}
	
	if (typeof psStartDate == "object")
		fromObj = psStartDate;
	else
		fromObj = $("#" + psStartDate);
	
	if (typeof psEndDate == "object")
		toObj = psEndDate;
	else
		toObj = $("#" + psEndDate);
	
	if(Option == "D") {
		fromDt = gfn_addDay( fromObj.val(), term, true );
	}
	else if(Option == "M"){
		fromDt = gfn_addMonth( fromObj.val(), term, true );
	}
	
	
	if(!gfn_isNull(fromDt)){
		if(gfn_compareDateValue(fromDt, toObj.val(), false)){
			if(isAlert)	alert('허용된 검색기간을 초과하였습니다.');
			fromObj.focus();
			return false;
		}
	}
	
	return true;
}



/**************************************************************** 
 * Desc 	: 오늘 날짜 반화
 * @Method Name : fnGetToday
 *@조건      
 * @param    bool : '-'포함여부
 * @return   Y == true 나머지 false 
 ****************************************************************/ 
function gfn_getToday(bool) {
	var sToday = new Date();
	var y = sToday.getFullYear();
	var m = parseInt(sToday.getMonth())+1;
	var d = sToday.getDate();
	var sReturn = null;
	
	if(bool)
		sReturn =   y + "-" + m.toString().lpad(2, 0) + "-" + d.toString().lpad(2, 0); 
	else
		sReturn =   y + m.toString().lpad(2, 0) + d.toString().lpad(2, 0); 
	
	return sReturn;
}


/**************************************************************** 
 * Desc 	         						: 몇일 후 날짜 계산 
 * @Method Name      						: fn_addDay
 * @param  입력인자  						:
 * 			dateTime						: 년월일
 * 			addDay							: 일수
 * 			bool							: '-'으로 구분할지의 여부
 * @return  String
 ****************************************************************/
function gfn_addDay( yyyyMMdd, addDay, bool )
{

   if( yyyyMMdd == "" ){
       return;
   }
   
   if( yyyyMMdd.indexOf("-") != -1){
       yyyyMMdd = yyyyMMdd.replace(/(\,|\-|\:)/g,""); 
   }
   
   var y = yyyyMMdd.substring(0,4);
   var m = yyyyMMdd.substring(4,6);
   var d = yyyyMMdd.substring(6);

   //1970.01.01 날짜 계산이 시작되는 기준일
   //기준일
   var basic = new Date(0);
   
   //더할 날짜 
   var now = new Date(y,m-1,d);

   //오늘부터 몇일후 long 형태 
   var count;

   count = Number(addDay);

   //기준일부터 몇일후의 날짜를 알 수 있다
   //1000*60*60*24 는 하루를 나타냄
   //(now - basic) / (1000*60*60*24) 오늘부터 기준일까지의 날짜수
   //즉 기준일로부터 몇일까지의 날짜수를 Long형태로 만들어 날짜를 만들어낸다.
   var day = new Date((1000*60*60*24*(count+((now-basic)/(1000*60*60*24)))));

   var mm = (day.getMonth()+1);
   var dd = day.getDate();
   if(mm < 10) mm = "0" + mm;
   if(dd < 10) dd = "0" + dd;
   
   if(!fn_isEmpty(bool)){
	   if(bool){
		   return day.getFullYear() + '-' + mm + '-' + dd;
	   }
   }
   
   return day.getFullYear() + mm + dd;
}

/**************************************************************** 
 * Desc 	         						: 입력한날의 다음주 첫번째날을 리턴한다. 
 * @Method Name      						: fn_addDay
 * @param  입력인자  						:
 * 			dateTime						: 년월일
 * 			bool							: '-'으로 구분할지의 여부
 * @return  String
 ****************************************************************/
function gfn_setWeek( yyyyMMdd, bool )
{
	
	if( yyyyMMdd == "" ){
		return;
	}
	
	if( yyyyMMdd.indexOf("-") != -1){
		yyyyMMdd = yyyyMMdd.replace(/(\,|\-|\:)/g,""); 
	}
	
	var y = yyyyMMdd.substring(0,4);
	var m = yyyyMMdd.substring(4,6);
	var d = yyyyMMdd.substring(6);
	
	//1970.01.01 날짜 계산이 시작되는 기준일
	//기준일
	var basic = new Date(0);
	
	//더할 날짜 
	var now = new Date(y,m-1,d);
	
	var week = now.getDay();
	
	if( week == 0 )
		return gfn_addDay( yyyyMMdd, 0, bool );
	else
		return gfn_addDay( yyyyMMdd, 7-week, bool );
}


/**************************************************************** 
 * Desc 	         						: 몇개월 후 날짜 계산 
 * @Method Name      						: fn_addMonth
 * @param  입력인자  							:
 * 			dateTime						: 년월일
 * 			addDay							: 개월수
 * 			bool							: '-'으로 구분할지의 여부
 * @return  String
 ****************************************************************/
function gfn_addMonth( yyyyMMdd, addMonth, bool )
{

   if( yyyyMMdd == "" ){
       return;
   }
   
   if( yyyyMMdd.indexOf("-") != -1){
       yyyyMMdd = yyyyMMdd.replace(/(\,|\-|\:)/g,""); 
   }
   
   var y = yyyyMMdd.substring(0,4);
   var m = yyyyMMdd.substring(4,6);
   var d = yyyyMMdd.substring(6);

   //더할 날짜 
   var count = Number(addMonth);
   var day = new Date(y,m-1+count,d);

   var mm = (day.getMonth()+1);
   var dd = day.getDate();
   if(mm < 10) mm = "0" + mm;
   if(dd < 10) dd = "0" + dd;
   
   if(!fn_isEmpty(bool)){
	   if(bool){
		   return day.getFullYear() + '-' + mm + '-' + dd;
	   }
   }
          
   return day.getFullYear() + mm + dd + "";
}

/******************************************************************************
 * Desc 	         						: 윤년여부 확인 
 * @Method Name      						: fn_isLeapYear
 * @param  입력인자  							: yyyyMMdd형태의 날짜 ( 예 : "20121122" )
 * @return  boolean							: - sDate가 윤년인 경우 = true
 *				  							  - sDate가 윤년이 아닌 경우 = false
 *   										  - sDate가 입력되지 않은 경우 = false
 *******************************************************************************/
function gfn_isLeapYear(sDate){
    var ret;
    var nY;

    if( fn_isEmpty(sDate) )    
    	return false;

    nY = parseInt(sDate.substring(0,4), 10);

    if ((nY % 4) == 0) {
        if ((nY % 100) != 0 || (nY % 400) == 0) 
            ret = true;
        else 
            ret = false;
    }else 
        ret = false;

    return ret;
}

/******************************************************************************
 * Desc 	         						: 해당월의 마지막 날짜를 숫자로 구하기 
 * @Method Name      						: fn_lastDateNum
 * @param  입력인자  							: yyyyMMdd형태의 날짜 ( 예 : "20121122" )
 * @return  boolean							: - 성공 = 마지막 날짜 숫자값 ( 예 : 30 )
 *				  							  - 실패 = -1
 *******************************************************************************/
function gfn_lastDateNum(sDate)
{
    var nMonth, nLastDate;

    if( fn_isEmpty(sDate) )		
		return -1;

    nMonth = parseInt(sDate.substr(4,2), 10);
    if( nMonth == 1 || nMonth == 3 || nMonth == 5 || nMonth == 7  || nMonth == 8 || nMonth == 10 || nMonth == 12 )
        nLastDate = 31;
    else if( nMonth == 2 )  
    {
        if( gfn_isLeapYear(sDate) == true )
            nLastDate = 29;
        else
            nLastDate = 28;
    } 
    else 
        nLastDate = 30;
        
    return nLastDate;
}

/////////////////////////////////////////////////////////////////////

/**************************************************************** 
 * Desc 	: 달력 onload 에서 처리
 *  ****************************************************************/
//function gfn_setCalender(objArr){
//	var calObjArr = objArr.split(",");
//	var calObjs = "";
//	
//	for(_calObjArr in calObjArr){
//		calObjs += "#" + calObjArr[_calObjArr] + " , ";
//	}
//	
//	$( calObjs ).datepicker({
//	  dateFormat: 'yy-mm-dd',
//	  prevText: '이전 달',
//	  nextText: '다음 달',
//	  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
//	  monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
//	  dayNames: ['일','월','화','수','목','금','토'],
//	  dayNamesShort: ['일','월','화','수','목','금','토'],
//	  dayNamesMin: ['일','월','화','수','목','금','토'],
//	  showMonthAfterYear: true,
//	  yearSuffix: '년'
//	});
//}


/**************************************************************** 
 * Desc 	: 검색조건내 Div 내의 input type을 검색하여 검색조건을 만든다.
 *  ****************************************************************/
function gfn_makeSearchCondition(oSearchArea) {
	var arrCondition = new Array();
	var sCondition = "";
	
	var j = 0;	// 실제 배열의 크기
	
	oSearchArea.find('input,select,combo,textarea').each(function(i){
		if(!gfn_isNull($(this).attr('title')) && !gfn_isNull($(this).val()) ){
			if($(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio'){
				if($(this).attr('checked')){
					arrCondition[j++] = $(this).attr('title') + "=" + $(this).val();
				}
			}
			else if($(this).get(0).tagName == "SELECT"){
				arrCondition[j++] = $(this).attr('title') + "=" + $('option:selected',this).text();
			}
			else{
				arrCondition[j++] = $(this).attr('title') + "=" + $(this).val();
			}
		}
		
	});
	
	
	/*
	var objs = oSearchArea.find("label");
	for(var i=0; i < objs.length; i++){
		var lid = objs[i].id;
		var skey = $('#' + lid).attr("for");

		if( $('#' + skey).length > 0 && !gfn_isNull($('#' + skey).val()) ){
			arrCondition[j++] = objs[i].innerText + "=" + $('#' + skey).val();
		}
	}
	*/
	
	sCondition = arrCondition.join("|");

	return sCondition;
}

/**************************************************************** 
 * Desc 	: 검색조건내 Div 내의 input type을 검색하여 검색조건을 만든다.
 *  ****************************************************************/
function gfn_makeInputData(oSearchArea, inputData, prefix) {
	if( gfn_isNull(inputData) ){
		inputData = new Object();
	}
	inputData = $.extend(inputData, oSearchArea.fn_getInputdata(prefix));
	
	/*
	oSearchArea.find('input[isNum="Y"]').each(function(i){
		inputData[$(this).attr('id')] = $(this).getOnlyNumeric();
	});
	*/
	oSearchArea.find('input:text[numberOnly]').each(function(i){
		inputData[$(this).attr('id')] = ComUtil.number.removeCommmas($(this).val());
	});
	
	return inputData;
}

/**************************************************************** 
 * Desc 	: 검색조건내 Div 내의 input type을 검색하여 query string으로 만들기
 *  ****************************************************************/
function gfn_serialize(oSearchArea, inputParam){
	inputParam = gfn_makeInputData(oSearchArea, inputParam);
	return jQuery.param(inputParam);
}


/**************************************************************** 
 * Desc 	: 검색조건내 Div 내의 input type을 검색하여 disabled 상태로 만든다.
 *  ****************************************************************/
function gfn_makeObjDisable(oSearchArea, bDisabled) {
	var disable = gfn_isNull(bDisabled) ? true :  bDisabled;
	oSearchArea.find('input,select,combo,textarea').each(function(i){
		$(this).attr("disabled",disable);
	});
}


/**************************************************************** 
 * Desc 		: jquery object 내의 input,select,combo,textarea를 검색하여 (id or name):value의 json을 반환한다.
 * @Method Name : $.fn.fn_getInputdata  ex) var data = $('#id').fn_getInputdata();
 * @return  json 
 ****************************************************************/
$.fn.fn_getInputdata = function(prefix){
	prefix = gfn_null(prefix, "");
	var data = {};
	var setVal = function(obj){
		//var id = (gfn_isNull(obj.attr('id')))? obj.attr('name'):obj.attr('id');
		var id = (gfn_isNull(obj.attr('name')))? obj.attr('id'):obj.attr('name');
		var val = obj.val();
		
		if(obj.attr('type') == 'checkbox'){
			val = ($(obj).attr('checked')) ? "Y" : "N";
		}
		
		if(!gfn_isNull(val) && !gfn_isNull(id)){
			data[prefix + id] = val;
		}
	};	
	
	$(this).find('input,select,combo,textarea').each(function(i){
//		if($(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio'){
		if($(this).attr('type') == 'radio'){
			if($(this).attr('checked')){
				setVal($(this));
			}
		}else{
			setVal($(this));
		}
	});
	
	return data;
}



/**************************************************************** 
 * Desc 	: 현재사이트 루트경로 가지고 오기
 *  ****************************************************************/ 
function gfn_getApplication(){
	var arrPath = location.pathname.split("/");
	//return "/" + arrPath[1];
	return "";
}
/*Param 값가져오기*/
function gfn_getParaVal(objVal){
	var param="";
	var arrPath = location.search.split("?");
	
	if(!gfn_isNull(arrPath)){
		param = arrPath[1].split("&");
	}
	for (var i = 0; i < param.length; i++) {
		//for ( var x in param) {
		p = param[i].split("=");
		if(p[0] == objVal){
			return p[1];
			break;
		}
	}
	return "";
}	



function fn_nvl2(nullObj, trueObj, falseObj){
	if(fn_isEmpty(nullObj))
		return trueObj;
	else{
		if(typeof falseObj == 'undefined' || falseObj == null){
			return nullObj;
		}else{
			return falseObj;
		}
	}
}


function fn_isEmpty( obj ) {
    var isBlack = function(string){
    	return (!string || $.trim(string) === "");
    }
    	
	if(typeof obj == 'string'){
    	return isBlack(obj);
	}else if(typeof obj == 'number' || typeof obj == 'boolean'){
		var tmp = obj.toString();
		return isBlack(tmp);
	}else if( obj instanceof Array ){	//배열일 때 배열안의 값을 체크하여 공백이면 empty다.
		if( obj.length < 1 )
			return true;
		else{
			var rtn = true;
			$.each( obj, function(i, v){
				if( '' != $.trim(v) )
					rtn = false;
			} );

			return rtn;
		}
    }else{
    	return $.isEmptyObject(obj);
    }
}


function gfn_objectCopy(obj)
{
	if(ComUtil.isNull(obj)){
		return {}; 
	}
	//return $.extend(true, {}, obj);
	return JSON.parse(JSON.stringify(obj));
}

function gfn_isNull(sParam){
	if(typeof(sParam) == "number" || typeof(sParam) == "boolean")
		return false;
	
	if(sParam == '' || sParam == null || sParam == undefined || sParam == 'undefined'){
		return true;
	}else{
		return false;
	}
}

function gfn_null(sParam, sDefalut){
	if(gfn_isNull(sParam))
		return sDefalut;
	else 
		return sParam;
}

//replaceAll
function gfn_replaceAll(value, patten, repatten){
	 var returnValue = value;
	 try{
		 if(value.length > 1){
			 returnValue = value.split(patten).join(repatten);
		 }
	 }
	 catch(e){}
	 return returnValue;
}

//999,999,999 => 9999999999
//useDot : 소수점이하 사용여부
function gfn_maskAmt( pAmt, useDot ) {
	var sAmt = "";
	if( pAmt == 0 ) return pAmt;
	
	if( isNaN(pAmt) ) {
		return '';
	}
	
	if( pAmt ) {
		if( useDot ) {
			sAmt = Number(pAmt).toLocaleString();
		} else {
			sAmt = Number(pAmt).toLocaleString().split('.')[0];
		}	
	}
	
	
	return sAmt;
}

//999,999,999 => 9999999999
function gfn_unMaskAmt( pAmt ) {
	var nAmt = 0;
	
	nAmt = parseFloat( gfn_replaceAll( pAmt, ',', '' ) );
	
	if( isNaN(nAmt) ) {
		return '';
	}
	return nAmt;
}

function gfn_strNvl( pStr ) {
	if( gfn_isNull(pStr) ) {
		return '&nbsp';
	}
	return pStr;
}

function gfn_numNvl( pStr ) {
	if( gfn_isNull(pStr) ) {
		return '0';
	}
	return pStr;
}

function gfn_maskDate( pStr) {
	if( !gfn_isNull(pStr) ){
		if( pStr.length != 8 ) return pStr;
		
		return pStr.substring(0, 4) + '-' + pStr.substring(4, 6) + '-' + pStr.substring(6, 8);
	} else {
		return ;
	} 
}

function gfn_unMaskDate( pStr) {
	return gfn_replaceAll(pStr, '-', '');
}

function gfn_maskBizNo( pStr ) {
	if( pStr ) {
		return pStr.substring(0, 3) + '-' + pStr.substring(3, 5) + '-' + pStr.substring(5, 10);
	} else {
		return;
	}
}

function gfn_unMaskBizNo( pStr ) {
	return gfn_replaceAll(pStr, '-', '');
}

function gfn_maskCorpNo( pStr ) {
	if( pStr ) {
		return pStr.substring(0, 6) + '-' + pStr.substring(6, 13);
	} else {
		return;
	}
}


function fn_isNumber(str){
	var rtnBool = true;
	var isValidChar = function(ch){
		var numUnicode = ch.charCodeAt(0);                                                                                   
		if ( 48 <= numUnicode && numUnicode <= 57 ) 
			return true;
		
		return false;
	};
	
	if(!fn_isEmpty(str)){
		var arrayOfStr = str.split('');
		for(var k in arrayOfStr){
			var ch = arrayOfStr[k];
			
			if(!isValidChar(ch)){
				rtnBool = false;
				break;
			}
		}
	}
	return rtnBool;
}

function E(evt) { 
    var e = window.event || evt; 
    if (!e) return; 

    e.element = e.target || e.srcElement; 
    return e; 
}

/**
 * num_only 클래스를 가진 입력필드에 대해서
 * 숫자만 입력가능하도록 한다.
 */
restrictNumOnly = function() {
	try{
		$('.num_only').each(function() {
			if (!$(this).data("restrictNumOnly")) {
				$(this).data("restrictNumOnly", true);
				
				$(this).css('imeMode','disabled')
					.on("keypress", function(event) {
						if (event.which && (event.which < 48 || event.which > 57)) {
							event.preventDefault();
						}
					}).valueChanged(function(event) {
						var str = $(this).val();
						if (str) {
							if (str.match(/[^0-9]/)) {
								$(this).blur().focus();
								$(this).val(str.replace(/[^0-9]/g,''));
							}
						}
					});
			}
		});		
	} catch(e){}

};

/**
 * data-maxlength 애트리뷰트를 가진 입력필드에 대해서
 * data-maxlength에 지정된 최대 바이트수까지만 입력가능하도록 한다.
 */
restrictDataMaxLength = function() {
	$("[data-maxlength]").each(function() {
		if (!$(this).data("restrictDataMaxLength")) {
			$(this).data("restrictDataMaxLength", true);
			
			var dataMaxLength = $(this).attr("data-maxlength");
			if (Number(dataMaxLength) > 0) {
				$(this).maxBytes(Number(dataMaxLength), function(maxBytes) {
					alert(maxBytes+"바이트까지만 입력가능합니다.");
				});
			}
		}
	});
};
String.prototype.byteLength = function() {
	var len = 0;
	
	for (var i=0; i < this.length; i++) {
		var ch = encodeURI(this.charAt(i));
		
		if( ch.length==1 ) len++;
		else if( ch.indexOf("%u")!=-1 ) len += 2;
		else if( ch.indexOf("%")!=-1 ) len += ch.length/3;
	}
	
	return len;
};
$.fn.maxBytes = function(maxBytes, onOverflow) {
	this.on("keypress", function(event) {
			if ($(this).val().byteLength() >= maxBytes) {
				if (onOverflow) {
					onOverflow.call(this, maxBytes);
				}
				
				event.preventDefault();
			}
		}).valueChanged(function(event) {
			var str = $(this).val();
			if (str && str.byteLength() > maxBytes) {
				$(this).blur().focus();
				
				while ($(this).val().byteLength() > maxBytes) {
					str = $(this).val();
					$(this).val(str.substring(0, str.length-1));
					$(this).change();
				}
				
				if (onOverflow) {
					onOverflow.call(this, maxBytes);
				}
			}
		});
		
	return this;
};
$.fn.valueChanged = function(handler) {
	this.on("keyup", function(event) {
			handler.apply(this, arguments);
		})
		.on("paste", function(event) {
			var element = this;
			var args = arguments;
			setTimeout(function() {
				handler.apply(element, args);
			}, 100);
		});
		return this;
};
// tooltip
function getAbsolutePos(obj) {
	var position = new Object;
	position.x = 0;
	position.y = 0;

	if (obj) {
		position.x = obj.offsetLeft;
		position.y = obj.offsetTop;

		if (obj.offsetParent) {
			var parentpos = getAbsolutePos(obj.offsetParent);
			position.x += parentpos.x;
			position.y += parentpos.y;
		}

	}

	return position;
}

var tip=new Array();
// 보여줄 툴팁을 설정 하세요
// HTML 태그 사용이 가능합니다
tip[0]='직접입력시 체크박스를 선택해주세요';
	   
   
function showtip(current,e,num, curMainDivID)
{
	if (document.layers) // Netscape 4.0+
	{
		theString = "<DIV CLASS='ttip'>" + tip[num] + "</DIV>";
		document.tooltip.document.write(theString);
		document.tooltip.document.close();
		document.tooltip.left = e.pageX + 14;
		document.tooltip.top = e.pageY + 2;
		document.tooltip.visibility = "show";
	} else {
		if (document.getElementById) // Netscape 6.0+ , Internet Explorer 5.0+
		{
			var position = getAbsolutePos(current);
			if(!gfn_isNull(curMainDivID)){
				elmPar = document.getElementById(curMainDivID);
				var position2 = getAbsolutePos(elmPar);
				
				position.x -= position2.x;
				position.y -= position2.y;
			}
			
			elm = document.getElementById("tooltip");
			elml = current;
			
			
			if( gfn_isNull(num) )
				elm.innerHTML = current.value;
			else
				elm.innerHTML = tip[num];
			
			elm.style.height = elml.style.height;
			/*elm.style.top = parseInt(elml.offsetTop + elml.offsetHeight);
			elm.style.left = parseInt(elml.offsetLeft + elml.offsetWidth + 10);*/
			elm.style.top = parseInt(position.y);
			elm.style.left = parseInt(position.x + elml.offsetWidth / 2 + 10);
			elm.style.visibility = "visible";
		}
	}
}
function hidetip(){
if (document.layers) // Netscape 4.0+
   {
    document.tooltip.visibility="hidden";
   }
else
  {
   if(document.getElementById) // Netscape 6.0+ , Internet Explorer 5.0+
     {
      elm.style.visibility="hidden";
     }
  } 
}

// 필수값 체크
function gfn_isCheckOk(fieldlist){
	
	for (var i = 0; i < fieldlist.length; i++) {
        val = $('#'+fieldlist[i][0]).val();
        if (gfn_isNull(val)) {
            alert(fieldlist[i][1] + " 항목을 반드시 입력해 주십시오.");
            $('#'+fieldlist[i][0]).focus();
            return false;
        } // end if
    } // end for
	
	return true;
}

function gfn_checkEnglishNumeric(englishNumericStr){
	if(englishNumericStr == ''){
		return true;
	}
	var alpha_numeric = /^[a-zA-Z0-9_-]+$/;
	
	if(!alpha_numeric.test(englishNumericStr)){
		return false;
	}
	return true;
}

function gfn_checkEnglish(englishStr){
	if(englishStr == ''){
		return true;
	}
	var alpha = /^[a-zA-Z ]+$/;
	
	if(!alpha.test(englishStr)){
		return false;
	}
	return true;
}

function gfn_checkNumber(numericStr){
	if(numericStr == ''){
		return true;
	}
	var alpha = /^[0-9]+$/;
	
	if(!alpha.test(numericStr)){
		return false;
	}
	return true;
}

//이메일 유효성 체크
function gfn_checkEmail(emailAddr){
	if(emailAddr == ''){
		return true;
	}
	var format = /^((\w|[\-\.])+)@((\w|[\-\.])+)\.([A-Za-z]+)$/;
	
	if (!format.test(emailAddr)) {
		return false;
	}
	return true;
}


function gfn_clickPageNo(pgNo) {
    $('#pageNo').val(pgNo);
    fn_srch();
}

function isNumeric(data) {
	 var len, chrTmp;

	 len = data.length;
	 for(var i=0; i<len; ++i) {
		 chrTmp = str.charCodeAt(i);
		 if((chrTmp <= 47 && chrTmp > 31) || chrTmp >= 58) {
			 return false;
		 }
	 }

	 return true;
}

/**************************************************************** 
 * Desc 	         						: input 에서 숫자 입력서 자동 콤마 찍어주기( EX: 건설기계 작업계획서 SMSSQ0020JS01 에서 사용하고 있음)
 * @Method Name      						: toNumber
 * @param
 * @return
 ****************************************************************/
$.fn.toPrice = function(cipher) {
	  var strb, len, revslice;
	  
	  strb = $(this).val().toString();
	  strb = strb.replace(/,/g, '');
	  strb = $(this).getOnlyNumeric();
	  strb = parseInt(strb, 10);
	  if(isNaN(strb))
	   return $(this).val('');
	   
	  strb = strb.toString();
	  len = strb.length;
	 
	  if(len < 4)
	   return $(this).val(strb);
	 
	  if(cipher == undefined || !isNumeric(cipher))
	   cipher = 3;
	 
	  count = len/cipher;
	  slice = new Array();
	 
	  for(var i=0; i<count; ++i) {
	   if(i*cipher >= len)
	    break;
	   slice[i] = strb.slice((i+1) * -cipher, len - (i*cipher));
	  }
	 
	  revslice = slice.reverse();
	  return $(this).val(revslice.join(','));
	 };
	 
 $.fn.getOnlyNumeric = function(data) {
	 //debugger;
	  var chrTmp, strTmp;
	  var len, str;
	  
	  if(data == undefined) {
	   str = $(this).val();
	  }
	  else {
	   str = data;
	  }
	 
	  len = str.length;
	  strTmp = '';
	  
	  
	  for(var i=0; i<len; ++i) {
	   chrTmp = str.charCodeAt(i);
	   //if((chrTmp > 47 || chrTmp <= 31) && chrTmp < 58) {
		if((chrTmp > 47 || chrTmp <= 31 || chrTmp==46) && chrTmp < 58) { // 소수점포함
	    strTmp = strTmp + String.fromCharCode(chrTmp);
	   }
	  }
	  
	  if(data == undefined)
	   return strTmp;
	  else 
	   return $(this).val(strTmp);
	 };	 
	 
	 
/**************************************************************** 
 * Desc 	         						: string의 left pad함수
 * @Method Name      						: rpad
 * @param  len  							: 리턴받을 string의 길이
 * 			char 							: pad할 char
 * @return  Boolean
 ****************************************************************/
String.prototype.lpad = function(len, char){
	var rtnStr = "";
	var addLen = len - this.length;
	
	for(var i=0; i<addLen; i++){
 		rtnStr += char;
 	}
 	return rtnStr + this;
}

/**************************************************************** 
 * Desc 	         						: string의 right pad함수
 * @Method Name      						: rpad
 * @param  len  							: 리턴받을 string의 길이
 * 			char 							: pad할 char
 * @return  Boolean
 ****************************************************************/
String.prototype.rpad = function(len, char){
 	var rtnStr = "";
 	var addLen = len - this.length;
 	
 	for(var i=0; i<addLen; i++){
 		rtnStr += char;
 	}
 	return this + rtnStr;
}


$.fn.onEnter = function(fn){
	var selfObj = $(this);
	$(this).keyup(function(e){
		if(e.keyCode == 13){
			fn(selfObj, e);
		}
	});
}



function gfn_alertMsgBox(msg, title, callBackFn){
	
	var dataParam = {};
	dataParam.msg = msg;
	dataParam.title = ComUtil.null(title, "알림");
	dataParam.id = "alertPop";
	
	$.popup({
            url: '/cmmPop/popAlertMsg.html',
	    	data:dataParam,
            close: function(result) {
                if(!ComUtil.isNull(callBackFn)){
                	callBackFn(result);
				}
            }
        });
}


function gfn_okMsgBox(msg, title, callBackFn){
	
	var dataParam = {};
	dataParam.msg = msg;
	dataParam.title = ComUtil.null(title, "성공");
	dataParam.id = "alertPop";
	
	$.popup({
            url: '/cmmPop/popOkMsg.html',
	    	data:dataParam,
            close: function(result) {
                if(!ComUtil.isNull(callBackFn)){
                	callBackFn(result);
				}
            }
        });
}


function gfn_errorMsgBox(msg, title, callBackFn){
	
	var dataParam = {};
	dataParam.msg = msg;
	dataParam.title = ComUtil.null(title, "경고");
	dataParam.id = "alertError";
	
	$.popup({
            url: '/cmmPop/popErrorMsg.html',
	    	data:dataParam,
            close: function(result) {
				if(!ComUtil.isNull(callBackFn)){
                	callBackFn(result);
				}
            }
        });
}



function gfn_confirmMsgBox(msg, title, callBackFn){
	
	var dataParam = {};
	dataParam.msg = msg;
	dataParam.title = ComUtil.null(title, "확인");
	dataParam.id = "alertConfirm";
	
	$.popup({
            url: '/cmmPop/popConfirmMsg.html',
	    	data:dataParam,
            close: function(result) {
				callBackFn(result);
            }
        });
}

function gfn_confirmMsgBox2(dataParam, callBackFn){
	
	dataParam.title = ComUtil.null(dataParam.title, "확인");
	dataParam.id = "alertConfirm";
	
	$.popup({
            url: '/cmmPop/popConfirmMsg.html',
	    	data:dataParam,
            close: function(result) {
				result.param = dataParam;
				callBackFn(result);
            }
        });
}


function gfn_callPopup(sParam, callBackFn){
	try{
		var dataParam = $.extend(dataParam, sParam);
		//dataParam.id = "popupIndex" + ($('div[id^="popupIndex"]').length + 1);
		dataParam.id = "popupIndex_" + (sParam.url).substr((sParam.url).lastIndexOf('/')+1) ;
		
		if(ComUtil.isNull(dataParam.type)){
			dataParam.type = "normal";
		}
		
		$.popup({
	            url: sParam.url,
	            //url: '/cmmPop/popupMain.html',
	            //url: '/cmmPop/popupMain.html',
	            //jsUrl: '/js/template/template_pop.js',
		    	data:dataParam,
	            close: function(result) {
					callBackFn(result);
	            }
	        });
	}
	catch(e) {
		gfn_log("callPopup error!!");
	}
	
}


function gfn_closePopup(returnParam){
	gfn_log("gfn_closePopup start!!" + sStorage.getItem("gCurPopupId"));
	gfn_log(returnParam);
	returnParam = ComUtil.null(returnParam, {});
	if(ComUtil.null(returnParam.alertPop, 'N') == 'Y'){
		if($('div[id^="alert"]').length == 0){
			return;
		}
		else{
			$.each($('div[id^="alert"]'),function(index, item){
				if($.modal.getCurrent()){
					$.modal.getCurrent().close(returnParam);
				}
			});
			return;
		}
	}
	else{
		gfn_getPopupScreen(true);
	}
	
	gfn_log("gfn_closePopup start2!!");
	if($.modal.getCurrent()){
		$.modal.getCurrent().close(returnParam);
		sStorage.setItem("gCurPopupId", "");
	}
}


//function gfn_movePage(url, ) 



$.popup = function(opt) {
	if(ComUtil.isNull(opt.url)){
		return;
	}
	
	if(!gfn_checkDuplicatePop({url:(opt.url).substr((opt.url).lastIndexOf('/')+1)})){
		return;
	}
	
    $.ajax({
        url: opt.url,
        data: opt.data,
        dataType: 'html',
        success: function(html) {
			var jsTxt = "";
			if(!ComUtil.isNull(opt.jsUrl)){
				jsTxt = '<script src="'+opt.jsUrl+'"></script>';
			}
			
			/*
			var classNm = 'modal_dir_up';
			
			if(opt.data.type == "ani"){
				classNm = 'modal_popup';
			}
			var popObj = $('<div class="'+classNm+'" id="'+opt.data.id+'">' + html + '</div>' + jsTxt);
			*/
			
			// 알림창류의 팝업은 미리 떠있는것들은 삭제 해주고 호출한다.
			if(opt.data.id.indexOf("alert") > -1){
				gfn_closePopup({alertPop:'Y'});
			}
	
			var popObj = $('<div class="modal_popup" id="'+opt.data.id+'">' + html + '</div>' + jsTxt);
			//debugger;
			// 현재 최근팝업 화면
			sStorage.setItem("gCurPopupId", opt.data.id);
			if(!ComUtil.isNull(opt.data.url)){
				gfn_setPopupScreen((opt.data.url).substr((opt.data.url).lastIndexOf('/')+1));
			}
			popObj.appendTo('body');
			var popObj = $('#'+opt.data.id);
			popObj.on($.modal.OPEN, function(event, modal) {
					// 밑에서 올라오는 효과를줌
					//debugger;
					//$('#' + opt.data.id).addClass('show_ani');
					
					if(opt.data.type == "ani"){
						//$('.popup_wrap', $('#' + opt.data.id)).hide().addClass('bottom');
						$('.popup_wrap', modal.$anchor).addClass('bottom');
						$(modal.$blocker).addClass('show');
						
						setTimeout(function(){
							$('.popup_wrap', modal.$anchor).addClass('in');
						}, 100);
					}
					else{
						$(modal.$blocker).addClass('show');
					}
					
					if($('#alertTitle', $(this))){
                    	$('#alertTitle', $(this)).html(opt.data.title);
					}
					if($('#alertMsg', $(this))){
                    	$('#alertMsg', $(this)).html(opt.data.msg);
						$(modal.$blocker).addClass('index07');
					}
					if($('#btnOkTitle', $(this))){
                    	$('#btnOkTitle', $(this)).html(ComUtil.null(opt.data.btnOkTitle, '확인'));
					}
					if($('#btnNoTitle', $(this))){
                    	$('#btnNoTitle', $(this)).html(ComUtil.null(opt.data.btnNoTitle, '취소'));
					}
					$('.close-modal', $(this)).hide();
                });
			popObj.on($.modal.CLOSE, function(event, modal) {
				
					if(opt.data.type == "ani"){
						modal.$anchor.show();
						
	                    if (opt.close){
							opt.close(modal.result);
						} 
						
						$('.popup_wrap', modal.$anchor).show().removeClass('in');
						setTimeout(function(){
	                    	modal.elm.remove();
						}, 400);
					}
					else{
	                    if (opt.close){
							opt.close(modal.result);
						}
	                    modal.elm.remove();
					}
					
					// 팝업 닫칠시 부모화면에 스코롤 이벤트 발생 시킨다. s
					if($('a[id^="btnToTop_"]').length > 0){
						var sid = $('a[id^="btnToTop_"]').last().data('sid');
						if(ComUtil.isNull(sid)){
							$(window).trigger('scroll');
						}
						else{
							$('.popup_wrap', $('#'+sid)).trigger('scroll');
						}
					}
					// 팝업 닫칠시 부모화면에 스코롤 이벤트 발생 시킨다. e

                });
			popObj.modal({
                    escapeClose: false,
                    clickClose: false,
                    closeExisting: false
                });
        },
        error: function(res) {
			gfn_getPopupScreen(true);
            if (opt.error) opt.error(res.responseText);
            else {
                gfn_alertMsgBox('연결이 원할하지 않습니다.<br>인터넷 연결을 확인하시고 다시 시도 하시기 바랍니다.');
            }
            throw 'popup_error';
        }
    });
};

// 팝업 리스트 배열 등록
function gfn_setPopupScreen(screenId) {
	var popScreenArr = ComUtil.null(sStorage.getItem("gPopupScreenArr"), new Array());
	var popInfo = {};
	popInfo.screenId = screenId;
	popInfo.pScreenId = gfn_getScreenId();
	popScreenArr.push(popInfo);
	var popScreenArr = sStorage.setItem("gPopupScreenArr", popScreenArr);
}


// type : m / 팝업화면 ,  p / 팝업호출화면
function gfn_getPopupScreen(bDelete, type){
	type = ComUtil.null(type, 'm');	// 실제 팝업을 호출한 화면 아이디   
	
	var popScreenArr = ComUtil.null(sStorage.getItem("gPopupScreenArr"), new Array());
	if(popScreenArr.length == 0){
		return '';
	}
	var popScreenId = '';
	if(bDelete){
		var popInfo = popScreenArr.pop();
		popScreenId = (type == 'p') ? popInfo.pScreenId : popInfo.screenId;
		window[popScreenId] = null;	// 닫치는 팝업 정보 삭제 
		sStorage.setItem("gPopupScreenArr", popScreenArr);
	}
	else{
		var popInfo = popScreenArr[popScreenArr.length -1];
		popScreenId = (type == 'p') ? popInfo.pScreenId : popInfo.screenId;
	}
	
	return popScreenId;
}

// popup history clear
function gfn_clearPopupScreen(){
	sStorage.setItem("gPopupScreenArr", new Array());
}

/**************************************************************** 
* Desc 	: 중복팝업창 체크 로직
* @Method Name : gfn_checkDuplicatePop  
* @param    :	1. inputParam
* @return   :  boolean  false(중복발생) / true(중복없음) 
****************************************************************/
function gfn_checkDuplicatePop(inputParam){
	var popScreenArr = ComUtil.null(sStorage.getItem("gPopupScreenArr"), new Array());
	
	if(popScreenArr.indexOf(inputParam.url) > -1){
		if( $('div[id="'+inputParam.url+'"]').length == 0){
			gfn_getPopupScreen(true);	// 안드로이드의 백버튼을 이용한 경우  팝업이 올바로 닫쳐지지 않아 쓰레기가 남을수 있음 
			gfn_log("팝업!!!! " + inputParam.url);
			return true;
		}
		else{
			gfn_log("중복팝업!!!! 패스~ " + inputParam.url);
			return false;
		}
	}
	else{
		gfn_log("팝업!!!! " + inputParam.url);
		return true;
	}
}



function gfn_toastMsgBox(inputParam) {
	
	if ( typeof inputParam  == "string" ) {
		var msg = inputParam;
		inputParam = {};
		inputParam.msg = msg;
	}
	
	
	$('#toastTxt').html(inputParam.msg);
	$('#toast').addClass('show');
	
	if(ComUtil.null(inputParam.isUnder, false)){
		$('#toast').addClass('toast_under');	// toast 메세지를 하단에 보이고 싶을때
	}
	
	setTimeout(function(){ 
		$('#toast').removeClass('show');
		$('#toast').removeClass('toast_under');
	}, 3000);
    /*const toast = document.getElementById("toast");

    toast.classList.contains("reveal") ?
        (clearTimeout(removeToast), removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 1000)) :
        removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 1000)
    toast.classList.add("reveal"),
        toast.innerText = string*/
}


function gfn_callPopupSysClose(inputParam){
	if(ComUtil.isNull(inputParam)){
		inputParam = {};
	}
	
	var sParam = {};
	sParam.url = '/popup/CMMSYSE01P01';
	sStorage.setItem("CMMSYSE01P01Params", inputParam);
	
	gfn_callPopup(sParam, function(resultData){
		gfn_log('gfn_callPopupSysClose :::  ' + resultData);
	});
}


function gfn_getCompanyCd(companyNm){
	if(ComUtil.isNull(companyNm)){
		return "";
	}
	
	if(companyNm.indexOf('우리') > -1){ return 'woori';}
	if(companyNm.indexOf('하나은행') > -1){ return 'hanabank';}
	if(companyNm.indexOf('하나') > -1){ return 'hana';}
	if(companyNm.indexOf('하나') > -1){ return 'hana';}
	if(companyNm.indexOf('한화') > -1){ return 'hanwha';}
	if(companyNm.indexOf('신한') > -1){ return 'shinhan';}
	
	return 'woori';
}

function gfn_getImgSrcByCd(companyCd, type){
	type = ComUtil.null(type, 'L');
	var folderNm = '/images/bank_logo/';
	if(type == 'C'){
		folderNm = '/images/bank_circle_logo/';
	}
	else if(type == 'G'){
		folderNm = '/images/bank_circle_logo_gray/';
	}
	else if(type == 'L'){
		folderNm = '/images/bank_logo/';
	}
	
	companyCd = ComUtil.string.lpad(ComUtil.null(companyCd, '999'), 3, '0');
	return folderNm+companyCd+'.png';
}


function gfn_getAddAcntNoByCd(companyCd){
	var addAcntNo = '';
	if(companyCd == '218'){
		addAcntNo = '01';
	}
	else{
		addAcntNo = '';
	}
	
	return addAcntNo;
}

function gfn_getChartBackgroundColor(legend_name){
	switch(legend_name){
		case '국민연금' :
				backgroundColor = 'rgb(40, 209, 80)'; 	//green
			break;
		case '퇴직연금' :
				backgroundColor = 'rgb(253, 242, 106)'; //yellow
			break;
		case '개인연금' :
				backgroundColor = 'rgb(255, 149, 43)'; 	//orange
			break;
		case '주택연금' :
				backgroundColor = 'rgb(153, 153, 153)';
			break;
		default : 
				backgroundColor = 'rgb(255, 149, 43)'; 	//orange
			break;
	}
	
	return backgroundColor;
}

// 계좌구분 (11:개인IRP/20:연금저축펀드/30:/99:TDF)
/*
0 : 미지정
10 : DC
11 : 개인IRP
20 : 연금저축펀드
21 : 구개인연금펀드
30 : 연금저축신탁
31 : 구개인연금저축신탁
40 : 연금저축보험
41 : 연금보험
42 : 변액연금
43 : 구개인연금저축보험
50 : 즉시연금
80 : 연금저축수관전용보험
81 : 구개인연금 수관전용보험
99 : TDF
*/
function gfn_getAcntTypeNm(acnt_type){
	acnt_type += '';	// 숫자로 인식할 경우가 발생한다.
	switch(acnt_type){
		case '10' :
				acnt_type_nm = 'DC';
			break;
		case '11' :
				acnt_type_nm = '개인IRP';
			break;
		case '20' :
				acnt_type_nm = '연금저축펀드';
			break;
		case '21' :
				acnt_type_nm = '구개인연금펀드';
			break;
		case '30' :
				acnt_type_nm = '연금저축신탁';
			break;
		case '31' :
				acnt_type_nm = '구개인연금저축신탁';
			break;
		case '40' :
				acnt_type_nm = '연금저축보험';
			break;
		case '41' :
				acnt_type_nm = '연금보험';
			break;
		case '42' :
				acnt_type_nm = '변액연금';
			break;
		case '50' :
				acnt_type_nm = '즉시연금';
			break;
		case '99' :
				acnt_type_nm = 'TDF';
			break;
		default : 
				acnt_type_nm = '미정의';
			break;
	}
	
	return acnt_type_nm;
	
}


function gnf_callFunctionByName(functionName, context /*, args */) {
	var args = Array.prototype.slice.call(arguments, 2);
	var namespaces = functionName.split(".");
	var func = namespaces.pop();
	for(var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	return context[func].apply(context, args);
}




$.fn.dSelectBox = function(options) {
	var linkObj = $('#'+$(this).data('link'));
    var settings = {
        isSelectTag: true,
        eventType: 'click'
    };
    var opt = $.extend(settings, options);

    return this.each(function() {
        var $obj = $(this),
            $input = $obj.find('input'),
            $select = $obj.find('select'),
            $vArea = $obj.find('.visible_area'),
            $vAreaButton = $obj.find('button'),
            $vAreaList = $obj.find('ul');

        var $event = settings.eventType;
        if ($event == 'click') {
         
            $vAreaButton.on({
                click: function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    gfn_log('button click');
                    if ($(this).hasClass('on')) {
                        $vAreaList.hide();
                        $(this).removeClass('on');
                    } else {
                        $vAreaList.show();
                        $(this).addClass('on');
                    }
                }
            });

            $(document).on({
                click: function() {
                    gfn_log('document click');
                    $vAreaList.hide();
                    $vAreaButton.removeClass('on');
                }
            });
        } else {
            // mouseenter Event
            $vArea.on({
                mouseenter: function() {
                    $vAreaList.show();
                    $(this).addClass('on');
                },
                mouseleave: function() {
                    $vAreaList.hide();
                }
            });
        }

        $vAreaList.find('li').on({
            click: function() {
                var clickIdx = $(this).index(),
                    clickTxt = $(this).text();
                $vAreaList.hide();
                //$vAreaButton.removeClass('on').text(clickTxt);
				if("직접입력" == clickTxt){
                	$(linkObj).val("");
                	$(linkObj).attr("placeholder", clickTxt);
				}
				else{
                	$(linkObj).val(clickTxt);
				}

                if (opt.isSelectTag) { // true false
                    $select.children('option:selected').removeProp('selected');
                    $select.children('option:eq(' + clickIdx + ')').prop('selected', true);
                }
            }
        });

    });
};