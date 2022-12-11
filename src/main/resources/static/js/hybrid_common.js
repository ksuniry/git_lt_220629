// 안드로이드 & iOS 네이티브와 통신하기 위한 함수

// 모바일 여부 (true / false)
function gfn_isMobile(){
	if("other" == gfn_checkMobile()){
		return false;
	}
	else{
		return true;
	}
}
 
//자바스크립트로 안드로이드 구분
function gfn_checkMobile(){ 
    var varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기
 
    if ( varUA.indexOf('android') > -1) {
        //안드로이드
        return "android";
    } else if ( varUA.indexOf("iphone") > -1||varUA.indexOf("ipad") > -1||varUA.indexOf("ipod") > -1 ) {
        //IOS
        return "ios";
    } else {
        //아이폰, 안드로이드 외
        return "other";
    }
    
}

// 비정상 접근시 오류 메세지와 함께 app을 종료 시킨다.
function gfn_finishView(sParamData) {
	sParamData = 	ComUtil.null(sParamData, {});
	var data = {
			data : {
				key : "finishView",
				value : {
					msg : ComUtil.null(sParamData.msg, '비정상적인 접근입니다. 앱을 종료합니다.')
					,status : ComUtil.null(sParamData.status, 'e')
				},
				callback : ""
				} 
			};
	var jsonData = JSON.stringify(data);
	
	gfn_callNative(jsonData);
}

// 테이티브로 토큰을 요청하는 함수.
function gfn_getToken() {
	if(!ComUtil.isNull(gfn_readToken())){
		return;
	}
	
	var data = {
			data : {
				key : "getToken",
				value : "",
				callback : "gfn_setToken"
				} 
			};
	var jsonData = JSON.stringify(data);
	gfn_log("call gfn_getToken!!");
	gfn_callNative(jsonData);
}

// 네이티브에 토큰 정보 요청 시 call back 함수
//refresh token 및 active token 정보 수신하여 저장
function gfn_setToken(tokenString) {
	// 기존 정보들 날려버려야지...  살려야 할 정보들이 있을까??    이미 토큰 날아갔으면  다시 받아오는 로직이 있는게 이상한듯 한데...
	gfn_log("start gfn_setToken!!");
	sessionStorage.clear();
	
	if ( typeof tokenString  == "string" ) {
		//alert("gfn_setToken!! " + tokenString);
		var token = JSON.parse(tokenString);
		sStorage.setItem('refreshToken', token.data.refreshToken);
		sStorage.setItem('accessToken', token.data.accessToken);
		$("#accessToken").val(token.data.accessToken);		
	} else {
		var jsonData = JSON.stringify(tokenString);
		//alert("jsonData  : " + jsonData);
		sStorage.setItem('refreshToken', tokenString.data.refreshToken);
		sStorage.setItem('accessToken', tokenString.data.accessToken);		
	}
	
	// 새로운 키로  암호화 셋팅
	JsEncrptObject.init();
}

/**************************************************************** 
* Desc 	: 새로 발급 받은 Active Token과 Refresh Token을 네이티브에 저장하도록 요청
* @Method Name : gfn_sendTokenToNative  
* @param   :	1. aToken : 신규로 발급받은 Active token 
* 				2. rToken : 신규로 발급받은 Refresh token
* @return   : 없음
****************************************************************/
function gfn_sendTokenToNative(aToken, rToken) {
	if(aToken == "" || rToken == "") {
		return ;
	}
	
	var data = {
			data : {
				key : "setToken",
				value : { accessToken : aToken , refreshToken : rToken },
				callback : ""
				}
			};
	var jsonData = JSON.stringify(data);
	gfn_callNative(jsonData);
}


/**************************************************************** 
* Desc 	: 네이티브로 본인인증 진행을 요청
* @Method Name : gfn_checkPerson  
* @param   : 없음
* @return   : 없음
****************************************************************/
/*
function gfn_checkPerson() {
	var data = {
			data : {
				key : "checkPerson",
				value : "",
				callback : ""
				}
			};
	var jsonData = JSON.stringify(data);
	gfn_callNative(jsonData);
}
*/

/**************************************************************** 
* Desc 	: 메뉴 화면 노출 요청
* @Method Name : gfn_callMenu  
* @param   : 없음
* @return   : 없음
****************************************************************/
/*
function gfn_callMenu() {
	var data = {
			data : {
				key : "callMenu",
				value : "",
				callback : ""
				}
			};
	var jsonData = JSON.stringify(data);
	gfn_callNative(jsonData);
}
*/

/**************************************************************** 
* Desc 	: 보안키패드 호출
* @Method Name : gfn_callKeyPad  
* @param   : 없음
* @return   : 없음
****************************************************************/
function gfn_callKeyPad(keyPadObj) {
	
	var data = {
			data : {
				key : "openKeypad",
				value : {
					type 		: ('|num|number|'.indexOf(ComUtil.null($(keyPadObj).attr('type'), 'numAlpa')) > -1) ? 'num' : 'numAlpa',
					maxLength 	: $(keyPadObj).attr('maxlength'),
					id 			: ComUtil.null($(keyPadObj).attr('id'), ""),
					encrypt		: ComUtil.null($(keyPadObj).data('encrypt'), "N")
				},
				//callback : ComUtil.null($(keyPadObj).attr('callback'), "gfn_setKeyPad")
				callback : "gfn_setKeyPad"
			}
		};
	var jsonData = JSON.stringify(data);
	gfn_log("gfn_callKeyPad send data:: " + jsonData);
	gfn_callNative(jsonData);
}

//  mode  "I/C/F" (입력중/캔슬/완료)
function gfn_setKeyPad(resultData){
	
	/*
	resultData = {
		data : {
			returnData : {
				"mode" 		: "I", 	// I C F
			     "value" 	:  "4",
			     "id"     	:  "jumin2_keypad",
			     "encrypt" 	:  "Y",
			     "cnt" 		:  "3"
			}
		}
	};
	
	resultData = {
		data : {
			returnData : {
				"mode" 		: "F", 	// I C F
			     "value" 	:  "7",
			     "id"     	:  "jumin2_keypad",
			     "encrypt" 	:  "Y",
			     "cnt" 		:  "7"
			}
		}
	};
	*/
	
	
	var rData = {};
	if ( typeof resultData  == "string" ) {
		//gfn_log("gfn_setKeyPad!! " + resultData);
		resultData = resultData.replace(/\n/gi,"\\r\\n");
		rData = JSON.parse(resultData);
		rData = rData.returnData;		
	} else {
		var jsonData = JSON.stringify(resultData);
		//gfn_log("gfn_setKeyPad!!  : " + jsonData);
		rData = resultData.returnData;		
	}
	
	// 평문일 경우 처리 
	//var id = rData.id;	
	var valId = ComUtil.string.replaceAll(rData.id, '_keypad', '');  // 실제 값을 저장할 아이디
	var valObj = $('#' + valId);
	
	var keyPadObj = $('#' + rData.id);
	var valObj = $('#' + valId);
	var maxlength = parseInt($(keyPadObj).attr('maxLength'));
	
	//gfn_log("rData.mode : " + rData.mode);
	if("I" == rData.mode){
		var tagName = $(keyPadObj).prop('tagName');
		
		if(tagName == 'INPUT'){
			var addStar = "";
			for(var i = 0; i < rData.cnt; i++){
				addStar += '*';
			}
			
			$(keyPadObj).val( addStar );
		}
		else{
			$.each($('li' , $(keyPadObj)), function(index){
				if(index < rData.cnt){
					$(this).addClass('is_active');
				}
				else{
					$(this).removeClass('is_active');
				}
			});
		}
	}
	else if("C" == rData.mode){
		var tagName = $(keyPadObj).prop('tagName');
		
		if(tagName == 'INPUT'){
			$(keyPadObj).val('');
			$(valObj).val('');
		}
		else{
			$('li' , $(keyPadObj)).removeClass('is_active');
			$(valObj).val('');
		}
		
	}
	else if("F" == rData.mode){
		//gfn_log("maxlength :::::::::: " + maxlength);
		if(maxlength < rData.cnt){
			gfn_alertMsgBox("입력길이가 맞지 않습니다. 관리자에게 문의 부탁드립니다.");
			return;
		}
		
		var encrypt = ComUtil.null($(keyPadObj).data('encrypt'), "N");
		
		if(encrypt == 'N'){
			var type = ('|num|number|'.indexOf(ComUtil.null($(keyPadObj).attr('type'), 'numAlpa')) > -1) ? 'num' : 'numAlpa';
			if(type == 'num'){
				//gfn_log("num :::::::::: " + ComUtil.number.addCommmas(rData.value));
				$(keyPadObj).val(ComUtil.number.addCommmas(rData.value));
			}
			else{
				$(keyPadObj).val(rData.value);
			}
		}
		
		$(valObj).val(rData.value);
		$(valObj).trigger('change');
		
		/* 
		gfn_log("rData.orivalue ::: " + rData.value);
		if(rData.encrypt == 'Y'){
			gfn_log("rData.value ::: " + JsEncrptObject.decrypt(rData.value));
		}
		*/
		
		
		// 두개의 패스워드 비교해야 할때
		if(!ComUtil.isNull($(keyPadObj).data('check'))){
			var bId = $(keyPadObj).data('check');
			
			if(!ComUtil.isNull($('#'+bId).val())){
				gfn_log("bId ::: " + bId);
				gfn_log("rData.value ::: " + JsEncrptObject.decrypt(rData.value));
				gfn_log("$('#'+bId).val() ::: " + JsEncrptObject.decrypt($('#'+bId).val()));
				
				if($('#'+bId).val() != rData.value){
					$(keyPadObj).val('');
					$(valObj).val('');
					
					// 비교대상 데이터 클리어
					//$('#'+bId).val('');
					//$('#'+bId+'_keypad').val('');
					
					gfn_alertMsgBox("두개의 패스워드가 다릅니다.");
					return;
				}
				else{
					$('#'+bId+'_keypad').data('checkok', true);
				}
			}
		}
	}
	
	// 키보드 입력 완료시 화면 콜백함수 호출
	if("F" == rData.mode){
		if(!ComUtil.isNull($(keyPadObj).data('callback'))){
			gnf_callFunctionByName($(keyPadObj).data('callback'), window, rData);
		}
		else{
			if( $.type(window[gfn_getScreenId()]['callBack']['native']) === 'function'){
				rData.key = 'keyPad';
				window[gfn_getScreenId()].callBack.native(rData);
			}
		}
		
	}
}


/**************************************************************** 
* Desc 	: 신분증 찰영 진위확인
* @Method Name : gfn_callIdAuthComfirm  
* @param   : 없음
* @return   : 없음
****************************************************************/
function gfn_callIdAuthComfirm(sParamData){
	/*KB용 s*/
	var data = {
			data : {
				key : "idAuthComfirm_KB",
				value : {
					acnt_open_cnt : sParamData.acnt_open_cnt
					,screenId	  : ComUtil.null(sParamData.screenId, gfn_getScreenId())
					,objId		  : sParamData.objId
				},
				callback : "gfn_setIdAuthComfirm_KB"
			}
		};
	/*KB용 e*/
	
	
	var jsonData = JSON.stringify(data);
	gfn_log(jsonData);
	gfn_callNative(jsonData);
}

function gfn_setIdAuthComfirm_KB(resultData){
	/*
	var resultData = {
		returnData : {
	     "id_crd_sq" 	:	"111111|222222|33333",
	     "cs_nm" 		:	"JVfazqUJEuIaeQhIdAE84Q==",
	     "id_crd_ccd"   :	'1',
	     "screenId"   	:	'UNTOPEN04S01',
	     "objId"       	:	'aaaaa',
	     "passYn"     	:	"Y",
	     "msg"     		:	'오류이유' 
		}
	}
	var resultData = '{"returnData":{"cs_nm":"배수한"}}';
	*/
	var rData = {};
	if ( typeof resultData  == "string" ) {
		gfn_log("gfn_setToken!! " + resultData);
		resultData = resultData.replace(/\n/gi,"\\r\\n");
		rData = JSON.parse(resultData);
		rData = rData.returnData;		
	} else {
		var jsonData = JSON.stringify(resultData);
		gfn_log("jsonData  : " + jsonData);
		rData = resultData.returnData;		
	}
	
	rData.type = "KB";

	if(!ComUtil.isNull(rData.screenId)){
		if( $.type(window[rData.screenId]['callBack']['native']) === 'function'){
			rData.key = 'idAuthComfirm_KB';
			window[rData.screenId].callBack.native(rData);
		}
	}
}


/**************************************************************** 
* Desc 	: 화면접근정보 통지
* @Method Name : gfn_enterScreen
* @param   : sParamData
* @return   : 없음
****************************************************************/
function gfn_enterScreen(sParamData){
	gfn_log("gfn_enterScreen start !!! " + ComUtil.null(sParamData.event, 'click'));
	/*KB용 s*/
	var data = {
			data : {
				key : "enterScreen",
				value : {
					url 		: location.pathname.substr(location.pathname.indexOf('/', 10)+1)
					,event	  	: ComUtil.null(sParamData.event, 'click')
					,type		: ComUtil.null(sParamData.type, '1')			// 애드브릭스 1,  페이스북 2
					,nickname   : gfn_getUserInfo('userNm', true)
				}
			}
		};
	
	var jsonData = JSON.stringify(data);
	gfn_log(jsonData);
	gfn_callNative(jsonData);
}

/**************************************************************** 
* Desc 	: 앱화면 로딩창 중지요청
* @Method Name : gfn_finishLoading
* @param   : sParamData
* @return   : 없음
****************************************************************/
function gfn_finishLoading(){
	//alert("gfn_finishLoading start!!");
	/*KB용 s*/
	var data = {
			data : {
				key : "finishLoading",
				value : {
				}
			}
		};
	
	var jsonData = JSON.stringify(data);
	gfn_log(jsonData);
	gfn_callNative(jsonData);
}



/**************************************************************** 
* Desc 	: 외부링크 호출
* @Method Name : gfn_otherLinkOpen
* @param   : sParamData
				( 'link' webpage/  'pdf' PDF/ )
* @return   : 없음
****************************************************************/
function gfn_otherLinkOpen(sParamData){
	
	/*if(sParamData.type == 'pdf' && gfn_isOper()){
		return;
	}*/
	
	gfn_log("gfn_otherLinkOpen start :: ");
	/*KB용 s*/
	var data = {
			data : {
				key : "otherLinkOpen",
				value : {
					url				: sParamData.url
					,screenId		: ComUtil.null(sParamData.screenId, gfn_getScreenId())
					,objId		  	: sParamData.objId + ""
					,inYn  			: sParamData.inYn
         			,type 			: sParamData.type 
         			,title			: ComUtil.null(sParamData.title, null) 
				},
				callback : "gfn_setOtherLinkOpen"
			}
		};
	
	var jsonData = JSON.stringify(data);
	gfn_log("gfn_otherLinkOpen :: " + jsonData);
	gfn_callNative(jsonData);
}

function gfn_setOtherLinkOpen(resultData){
	gfn_log("gfn_setOtherLinkOpen start :: ");
	/*
	var returnData : {
	     url 		: "https://m.fundsolution.co.kr/SPFM43000MASS.do?mode=fnList6&FUND_CD=K55105D50468&cntSubM=load"
	     ,screenId  :  'UNTOPEN04S01'
	     ,type 		:  "link"
	     ,passYn 	: 'Y / N'   
	     ,msg 		:  '오류이유'   
	}
	*/
	var rData = {};
	if ( typeof resultData  == "string" ) {
		gfn_log("gfn_setOtherLinkOpen!! " + resultData);
		resultData = resultData.replace(/\n/gi,"\\r\\n");
		rData = JSON.parse(resultData);
		rData = rData.returnData;		
	} else {
		var jsonData = JSON.stringify(resultData);
		gfn_log("gfn_setOtherLinkOpen!! : " + jsonData);
		rData = resultData.returnData;		
	}
		
	/*if(!ComUtil.isNull(rData.screenId)){
		if( $.type(window[rData.screenId]['callBack']['setOtherLinkOpen']) === 'function'){
			window[rData.screenId].callBack.setOtherLinkOpen(rData);
		}
	}*/
	
	if(!ComUtil.isNull(rData.screenId)){
		if( $.type(window[rData.screenId]['callBack']['native']) === 'function'){
			rData.key = 'otherLinkOpen';
			window[rData.screenId].callBack.native(rData);
		}
	}
	
}


/**************************************************************** 
* Desc 	: 스크랩핑 호출
* @Method Name : gfn_scraping
* @param   : sParamData
				{
					screenId  :  gfn_getScreenId()
					,type		: 'lifeplan'
					,result 	: [{
									job 			: "pay"
									,errorCode		: "0"
									,errorMsg		: "스크랩핑 에러입니다."
								  }]      
				}
* @return   : 없음
****************************************************************/
function gfn_scraping(sParamData){
	gfn_log("gfn_scraping start :: ");
	/*
	var resultData = {};
	resultData.returnData = {
		screenId  :  gfn_getScreenId()
		,type		: 'lifeplan'
		,result 	: [{
						job 			: "pay"
						,errorCode		: "0"
						,errorMsg		: "스크랩핑 에러입니다."
					  }]      
	};
	gfn_callbackScraping(resultData);
	return;
	*/
	var data = {
			data : {
				key : "scraping",
				value : {
					name			: gfn_getUserInfo("userNm", false)
					,userId			: JsEncrptObject.encrypt(ComUtil.null(sParamData.userId, ''))
					,userPw			: ComUtil.null(sParamData.userPw, '')
					,type 			: ComUtil.null(sParamData.type, '') 
         			,jobs 			: ComUtil.null(sParamData.jobs, '') 
         			,finance		: ComUtil.null(sParamData.finance, {}) 
         			,screenId 		: ComUtil.null(sParamData.screenId, gfn_getScreenId())
				},
				callback : "gfn_callbackScraping"
			}
		};
	
	var jsonData = JSON.stringify(data);
	gfn_log("gfn_scraping :: " + jsonData);
	gfn_callNative(jsonData);
}

function gfn_callbackScraping(resultData){
	gfn_log("gfn_callbackScraping start :: ");
	/*
	var resultData = {}
	resultData.returnData = {
		screenId  :  sParamData.screenId
		,passYn 	: 'N'   
		,msg 		:  '오류이유'   
	};
	resultData = '{"returnData":{"result":[{"errorCode":"00000000","errorMsg":"","job":"retire"},{"errorCode":"00000000","errorMsg":"","job":"save"}],"screenId":"MYINFOM02S07","type":"stock"}}';
	*/
	
	var rData = {};
	if ( typeof resultData  == "string" ) {
		gfn_log("gfn_callbackScraping!! " + resultData);
		resultData = resultData.replace(/\n/gi,"\\r\\n");
		rData = JSON.parse(resultData);
		rData = rData.returnData;		
	} else {
		var jsonData = JSON.stringify(resultData);
		gfn_log("gfn_callbackScraping!! : " + jsonData);
		rData = resultData.returnData;
	}
		
	if(!ComUtil.isNull(rData.screenId)){
		if( $.type(window[rData.screenId]['callBack']['native']) === 'function'){
			rData.key = 'scraping';
			window[rData.screenId].callBack.native(rData);
		}
	}
}


/**************************************************************** 
* Desc 	: 타사이트 회원가입 (통합연금포탈 등)
* @Method Name : gfn_enterOtherSite
* @param   : sParamData
				{
				}
* @return   : 없음
****************************************************************/
function gfn_enterOtherSite(sParamData){
	gfn_log("gfn_enterOtherSite start :: ");
	/*
	var resultData = {};
	resultData.returnData = {
		screenId  :  gfn_getScreenId()
		,passYn		: 'N'
		,msg		: '회원가입중 오류가 발생하였습니다.'      
	};
	gfn_callbakEnterOtherSite(resultData);
	return;
	*/
	var data = {
			data : {
				key 	: ComUtil.null(sParamData.key, 'lifeplanJoin'),
				value 	: {
					 userId			: JsEncrptObject.encrypt(sParamData.userId)
					,userPw			: sParamData.userPw
					,email			: JsEncrptObject.encrypt(sParamData.email)
					,addressSido	: sParamData.addressSido
					,addressGunGu	: ComUtil.null(sParamData.addressGunGu, '') 
         			,screenId 		: ComUtil.null(sParamData.screenId, gfn_getScreenId())
				},
				callback : "gfn_callbakEnterOtherSite"
			}
		};
	
	var jsonData = JSON.stringify(data);
	gfn_log("gfn_enterOtherSite :: " + jsonData);
	gfn_callNative(jsonData);
}

function gfn_callbakEnterOtherSite(resultData){
	gfn_log("gfn_callbakEnterOtherSite start :: ");
	/*
	var resultData = {}
	resultData.returnData = {
		screenId  :  sParamData.screenId
		,passYn 	: 'N'   
		,msg 		:  '오류이유'   
	};
	*/
	
	var rData = {};
	if ( typeof resultData  == "string" ) {
		gfn_log("gfn_callbakEnterOtherSite!! " + resultData);
		resultData = resultData.replace(/\n/gi,"\\r\\n");
		rData = JSON.parse(resultData);
		rData = rData.returnData;		
	} else {
		var jsonData = JSON.stringify(resultData);
		gfn_log("gfn_callbakEnterOtherSite!! : " + jsonData);
		rData = resultData.returnData;
	}
		
	if(!ComUtil.isNull(rData.screenId)){
		if( $.type(window[rData.screenId]['callBack']['native']) === 'function'){
			rData.key = 'lifeplanJoin';
			window[rData.screenId].callBack.native(rData);
		}
	}
}

/**************************************************************** 
* Desc 	: 본인인증 (인증번호, 생체인식등..)
* @Method Name : gfn_idenVerification
* @param   : sParamData
				{
					"callId"   :  "aa"  (무엇을위한 인증인가)
					"option"   : "confirm" (confirm : 확인, change : 변경)
				}
* @return   : 없음
****************************************************************/
function gfn_idenVerification(sParamData){
	gfn_log("gfn_idenVerification start :: ");
	
	var data = {
			data : {
				key 	: 'verification',
				value 	: {
					screenId 		: ComUtil.null(sParamData.screenId, gfn_getScreenId())
					,callId 		: ComUtil.null(sParamData.callId, 'c1')
					//,option 		: ComUtil.null(sParamData.option, 'confirm')
				},
				callback : "gfn_callbackIdenVerification"
			}
		};
	
	var jsonData = JSON.stringify(data);
	gfn_log("gfn_idenVerification :: " + jsonData);
	
	if(!gfn_isMobile() && !gfn_isOper()){
		var resultData = {};
		resultData.returnData = {
			screenId  :  gfn_getScreenId()
			,callId		: 'C1'
			,passYn		: 'Y'
			,msg		: '회원가입중 오류가 발생하였습니다.'
			,idenType	: 'P'			// P/B  pin bio
			,bio		: 'adfasdfasdfasdfasdfasdfasd'      
		};
		gfn_callbackIdenVerification(resultData);
		return;
	}
	
	gfn_callNative(jsonData);
}

function gfn_callbackIdenVerification(resultData){
	gfn_log("gfn_callbackIdenVerification start :: ");
	
	var rData = {};
	if ( typeof resultData  == "string" ) {
		gfn_log("gfn_callbackIdenVerification!! " + resultData);
		resultData = resultData.replace(/\n/gi,"\\r\\n");
		rData = JSON.parse(resultData);
		rData = rData.returnData;		
	} else {
		var jsonData = JSON.stringify(resultData);
		gfn_log("gfn_callbackIdenVerification!! : " + jsonData);
		rData = resultData.returnData;
	}
		
	if(!ComUtil.isNull(rData.screenId)){
		if( $.type(window[rData.screenId]['callBack']['native']) === 'function'){
			rData.key = 'verification';
			window[rData.screenId].callBack.native(rData);
		}
	}
}



/**************************************************************** 
* Desc 	: 생체인증 정보조회 
* @Method Name : gfn_idenInfo
* @param   : sParamData
				{
				}
* @return   : 없음
****************************************************************/
function gfn_idenInfo(sParamData){
	gfn_log("gfn_idenInfo start :: ");

	var data = {
			data : {
				key 	: 'idenInfo',
				value 	: {
					screenId 		: ComUtil.null(sParamData.screenId, gfn_getScreenId())
				},
				callback : "gfn_callbackIdenInfo"
			}
		};
	
	var jsonData = JSON.stringify(data);
	gfn_log("gfn_idenInfo :: " + jsonData);
	
	
	if(!gfn_isMobile() && !gfn_isOper()){
		var resultData = {};
		resultData.returnData = {
			screenId  	:  gfn_getScreenId()
			,useYn		: 'Y'
			,bioType	: 'finger'	// finger, face, space      
		};
		gfn_callbackIdenInfo(resultData);
		return;
	}
	
	gfn_callNative(jsonData);
}

function gfn_callbackIdenInfo(resultData){
	gfn_log("gfn_callbackIdenInfo start :: ");
	
	var rData = {};
	if ( typeof resultData  == "string" ) {
		gfn_log("gfn_callbackIdenInfo!! " + resultData);
		resultData = resultData.replace(/\n/gi,"\\r\\n");
		rData = JSON.parse(resultData);
		rData = rData.returnData;		
	} else {
		var jsonData = JSON.stringify(resultData);
		gfn_log("gfn_callbackIdenInfo!! : " + jsonData);
		rData = resultData.returnData;
	}
	
	if(!ComUtil.isNull(rData.screenId)){
		if( $.type(window[rData.screenId]['callBack']['native']) === 'function'){
			rData.key = 'idenInfo';
			window[rData.screenId].callBack.native(rData);
		}
	}
}



/**************************************************************** 
* Desc 	: 생체정보 설정수정 
* @Method Name : gfn_idenInfoUpdate
* @param   : sParamData
				{
				}
* @return   : 없음
****************************************************************/
function gfn_idenInfoUpdate(sParamData){
	gfn_log("gfn_idenInfoUpdate start :: ");
	
	if(!gfn_isMobile() && !gfn_isOper()){
		var resultData = {};
		resultData.returnData = {
			screenId  :  gfn_getScreenId()
			,passYn		: 'N'
			,msg		: '인증정보 사용여부 변경중 오류가 발생하였습니다.'      
		};
		gfn_callbackIdenInfoUpdate(resultData);
		return;
	}
	
	if(ComUtil.isNull(sParamData.useYn)){
		gfn_alertMsgBox('인증 사용여부가 설정되지 않았습니다.');
		return;
	}
	
	var data = {
			data : {
				key 	: 'idenInfoUpdate',
				value 	: {
					screenId 		: ComUtil.null(sParamData.screenId, gfn_getScreenId())
					,useYn 			: sParamData.useYn
				},
				callback : "gfn_callbackIdenInfoUpdate"
			}
		};
	
	var jsonData = JSON.stringify(data);
	gfn_log("gfn_idenInfoUpdate :: " + jsonData);
	gfn_callNative(jsonData);
}

function gfn_callbackIdenInfoUpdate(resultData){
	gfn_log("gfn_callbackIdenInfoUpdate start :: ");
	
	var rData = {};
	if ( typeof resultData  == "string" ) {
		gfn_log("gfn_callbackIdenInfoUpdate!! " + resultData);
		resultData = resultData.replace(/\n/gi,"\\r\\n");
		rData = JSON.parse(resultData);
		rData = rData.returnData;		
	} else {
		var jsonData = JSON.stringify(resultData);
		gfn_log("gfn_callbackIdenInfoUpdate!! : " + jsonData);
		rData = resultData.returnData;
	}
		
	if(!ComUtil.isNull(rData.screenId)){
		if( $.type(window[rData.screenId]['callBack']['native']) === 'function'){
			rData.key = 'idenInfoUpdate';
			window[rData.screenId].callBack.native(rData);
		}
	}
}


/**************************************************************** 
* Desc 	: 앱 인증번호 변경 
* @Method Name : gfn_changePinnum
* @param   : sParamData
				{
				}
* @return   : 없음
****************************************************************/
function gfn_changePinnum(sParamData){
	gfn_log("gfn_changePinnum start :: ");
	
	var data = {
			data : {
				key 	: 'changePinnum',
				value 	: {
					screenId 		: ComUtil.null(sParamData.screenId, gfn_getScreenId())
				},
				callback : "gfn_callbackChangePinnum"
			}
		};
	
	var jsonData = JSON.stringify(data);
	gfn_log("gfn_changePinnum :: " + jsonData);
	
	if(!gfn_isMobile() && !gfn_isOper()){
		var resultData = {};
		resultData.returnData = {
			screenId  	:  gfn_getScreenId()
			,passYn		: 'N'
			,msg		: '앱 인증번호 변경중 오류가 발생하였습니다.'      
		};
		gfn_callbackChangePinnum(resultData);
		return;
	}
	
	gfn_callNative(jsonData);
}

function gfn_callbackChangePinnum(resultData){
	gfn_log("gfn_callbackChangePinnum start :: ");
	
	var rData = {};
	if ( typeof resultData  == "string" ) {
		gfn_log("gfn_callbackChangePinnum!! " + resultData);
		resultData = resultData.replace(/\n/gi,"\\r\\n");
		rData = JSON.parse(resultData);
		rData = rData.returnData;		
	} else {
		var jsonData = JSON.stringify(resultData);
		gfn_log("gfn_callbackChangePinnum!! : " + jsonData);
		rData = resultData.returnData;
	}
		
	if(!ComUtil.isNull(rData.screenId)){
		if( $.type(window[rData.screenId]['callBack']['native']) === 'function'){
			rData.key = 'changePinnum';
			window[rData.screenId].callBack.native(rData);
		}
	}
}


/**************************************************************** 
* Desc 	: 회원탈퇴 
* @Method Name : gfn_memberSecession
* @param   : sParamData
				{
				}
* @return   : 없음
****************************************************************/
function gfn_memberSecession(sParamData){
	gfn_log("gfn_memberSecession start :: ");

	var data = {
			data : {
				key 	: 'memberSecession',
				value 	: {
					screenId 		: ComUtil.null(sParamData.screenId, gfn_getScreenId())
				},
				callback : "gfn_callbackMemberSecession"
			}
		};
	
	var jsonData = JSON.stringify(data);
	gfn_log("gfn_memberSecession :: " + jsonData);
	
	if(!gfn_isMobile() && !gfn_isOper()){
		var resultData = {};
		resultData.returnData = {
			screenId  :  gfn_getScreenId()
			,passYn		: 'N'
			,msg		: '회원탈퇴중 오류가 발생하였습니다.'      
		};
		gfn_callbackMemberSecession(resultData);
		return;
	}
	
	gfn_callNative(jsonData);
}

function gfn_callbackMemberSecession(resultData){
	gfn_log("gfn_callbackMemberSecession start :: ");
	
	var rData = {};
	if ( typeof resultData  == "string" ) {
		gfn_log("gfn_callbackMemberSecession!! " + resultData);
		resultData = resultData.replace(/\n/gi,"\\r\\n");
		rData = JSON.parse(resultData);
		rData = rData.returnData;		
	} else {
		var jsonData = JSON.stringify(resultData);
		gfn_log("gfn_callbackMemberSecession!! : " + jsonData);
		rData = resultData.returnData;
	}
		
	if(!ComUtil.isNull(rData.screenId)){
		if( $.type(window[rData.screenId]['callBack']['native']) === 'function'){
			rData.key = 'memberSecession';
			window[rData.screenId].callBack.native(rData);
		}
	}
}

/**************************************************************** 
* Desc 	: 버젼정보 조회 
* @Method Name : gfn_getAppVersion
* @param   : sParamData
				{
				}
* @return   : 없음
****************************************************************/
function gfn_getAppVersion(sParamData){
	gfn_log("gfn_getAppVersion start :: ");

	var data = {
			data : {
				key 	: 'versionInfo',
				value 	: {
					screenId 		: ComUtil.null(sParamData.screenId, gfn_getScreenId())
				},
				callback : "gfn_callbackGetAppVersion"
			}
		};
	
	var jsonData = JSON.stringify(data);
	gfn_log("gfn_getAppVersion :: " + jsonData);
	
	//if(!gfn_isMobile() && gfn_isLocal()){
	if(!gfn_isMobile() && !gfn_isOper()){
		var resultData = {};
		resultData.returnData = {
			screenId  	:  ComUtil.null(sParamData.screenId, gfn_getScreenId())
			,version	: '1.0.1'      
		};
		gfn_callbackGetAppVersion(resultData);
		return;
	}
	
	gfn_callNative(jsonData);
}

function gfn_callbackGetAppVersion(resultData){
	gfn_log("gfn_callbackGetAppVersion start :: ");
	
	var rData = {};
	if ( typeof resultData  == "string" ) {
		gfn_log("gfn_callbackGetAppVersion!! " + resultData);
		resultData = resultData.replace(/\n/gi,"\\r\\n");
		rData = JSON.parse(resultData);
		rData = rData.returnData;		
	} else {
		var jsonData = JSON.stringify(resultData);
		gfn_log("gfn_callbackGetAppVersion!! : " + jsonData);
		rData = resultData.returnData;
	}
	
	sStorage.setItem('appVer', rData.version);
		
	if(!ComUtil.isNull(rData.screenId)){
		if( $.type(window[rData.screenId]['callBack']['native']) === 'function'){
			rData.key = 'versionInfo';
			window[rData.screenId].callBack.native(rData);
		}
	}
}

/**************************************************************** 
* Desc 	: openbanking 3자동의 
* @Method Name : gfn_openBank3Agree
* @param   : sParamData
				{
				}
* @return   : 없음
****************************************************************/
function gfn_openBank3Agree(sParamData){
	gfn_log("gfn_openBank3Agree start :: ");

	var data = {
			data : {
				key 	: 'ob3agree',
				value 	: {
					screenId 		: ComUtil.null(sParamData.screenId, gfn_getScreenId())
				},
				callback : "gfn_callbackOpenBank3Agree"
			}
		};
	
	var jsonData = JSON.stringify(data);
	gfn_log("gfn_openBank3Agree :: " + jsonData);
	
	if(!gfn_isMobile() && !gfn_isOper()){
		var resultData = {};
		resultData.returnData = {
			screenId  	:  gfn_getScreenId()
			,passYn		: 'Y'
			,msg		: 'msgmsgmsg'      
		};
		gfn_callbackOpenBank3Agree(resultData);
		return;
	}
	
	gfn_callNative(jsonData);
}

function gfn_callbackOpenBank3Agree(resultData){
	gfn_log("gfn_callbackOpenBank3Agree start :: ");
	
	var rData = {};
	if ( typeof resultData  == "string" ) {
		gfn_log("gfn_callbackOpenBank3Agree!! " + resultData);
		resultData = resultData.replace(/\n/gi,"\\r\\n");
		rData = JSON.parse(resultData);
		rData = rData.returnData;		
	} else {
		var jsonData = JSON.stringify(resultData);
		gfn_log("gfn_callbackOpenBank3Agree!! : " + jsonData);
		rData = resultData.returnData;
	}
	
	if(!ComUtil.isNull(rData.screenId)){
		if( $.type(window[rData.screenId]['callBack']['native']) === 'function'){
			rData.key = 'ob3agree';
			window[rData.screenId].callBack.native(rData);
		}
	}
}

/**************************************************************** 
* Desc 	: 메뉴호출
* @Method Name : gfn_openMenu
* @param   : sParamData
				{
				}
* @return   : 없음
****************************************************************/
function gfn_openMenu(sParamData){
	gfn_log("gfn_openMenu start :: ");

	var data = {
			data : {
				key 	: 'openMenu',
				value 	: {
					userNm 			: gfn_getUserInfo('userNm', false)
					,usePrd			: '♥ 마이머플러와 '+gfn_getUserInfo('usePrd', false)+'일 째'
					,status			: gfn_getUserInfo('status', false)
				},
				callback : "gfn_callbackOpenMenu"
			}
		};
	
	var jsonData = JSON.stringify(data);
	gfn_log("gfn_openMenu :: " + jsonData);
	
	if(!gfn_isMobile() && !gfn_isOper()){
		var resultData = {};
		resultData.returnData = {
			passYn		: 'Y'
			,msg		: 'msgmsgmsg'      
		};
		gfn_callbackOpenMenu(resultData);
		return;
	}
	
	gfn_callNative(jsonData);
}

function gfn_callbackOpenMenu(resultData){
	gfn_log("gfn_callbackOpenMenu start :: ");
	
	var rData = {};
	if ( typeof resultData  == "string" ) {
		gfn_log("gfn_callbackOpenMenu!! " + resultData);
		resultData = resultData.replace(/\n/gi,"\\r\\n");
		rData = JSON.parse(resultData);
		rData = rData.returnData;		
	} else {
		var jsonData = JSON.stringify(resultData);
		gfn_log("gfn_callbackOpenMenu!! : " + jsonData);
		rData = resultData.returnData;
	}
		
	/*if(!ComUtil.isNull(rData.screenId)){
		if( $.type(window[rData.screenId]['callBack']['native']) === 'function'){
			rData.key = 'openMenu';
			window[rData.screenId].callBack.native(rData);
		}
	}*/
}



/**************************************************************** 
* Desc 	: 
* @Method Name : gfn_moveLinkByApp()  
* @param   :    1. jsonData : 네이티브에 요청할 Json 데이터
* @return   : 없음
****************************************************************/
function gfn_moveLinkByApp(inputData){
	
	gfn_log("gfn_moveLinkByApp start :: ");
	/*
	inputData = {
	     url 			: "/pension_advice/dashBoard/DASHBRD01S01"
	     ,otherLinkYn 	: 'N'
         ,accessToken   : ''
         ,refreshToken  : ''
	     ,paramData 	: {a:''}   
	}
	*/
	var iData = {};
	if ( typeof inputData  == "string" ) {
		gfn_log("gfn_setOtherLinkOpen!! string : " + inputData);
		iData = JSON.parse(inputData);
		iData = iData.inputData;
	} else {
		var jsonData = JSON.stringify(inputData);
		gfn_log("gfn_setOtherLinkOpen!! : object : " + jsonData);
		iData = inputData.inputData;		
	}
	
	
	
	gfn_log("iData.url :: " + iData.url);
	
	// 현재 이동가능한 화면인지 체크
	if(!gfn_enableMovePage()){
		return;
	}
	
	// 외부이동호출해야 할 경우
	if(iData.otherLinkYn == 'Y'){
		var inputParam = {};
		inputParam.url 			= iData.url;
		inputParam.screenId 	= "";
		inputParam.objId	 	= '';
		inputParam.inYn		 	= "N";
		inputParam.type		 	= "link";
		
		gfn_otherLinkOpen(inputParam); 
		return;	
	}
	
	var url = iData.url;
	//  화면에 전달할 파라미터 셋팅 
	if(!ComUtil.isNull(iData.paramData)){
		var screenId = url.substring(url.lastIndexOf('/') + 1);
		sStorage.setItem(screenId + 'Params', iData.paramData);
		gfn_log("screenId :: " + screenId);
		gfn_log(iData.paramData);
	}
	
	// 화면으로 이동
	ComUtil.moveLink(url);
}

/**************************************************************** 
* Desc 		   : MS Azure Analytics
* @Method Name : gfn_azureAnalytics
* @param       : sParamData
* @return      : 없음
****************************************************************/
function gfn_azureAnalytics(sParamData){
	gfn_log("gfn_azureAnalytics start !!! " + ComUtil.null(sParamData.event, 'click'));
	
	if(gfn_isLocal()){
		return;
	}

	var data = {
			data : {
				key : "azureAnalytics",
				value : {
					screenName  : ComUtil.null(sParamData.screenName, 'click'),
					param  : {}
				}
			}
	 };
	
	var jsonData = JSON.stringify(data);
	gfn_log(jsonData);
	gfn_callNative(jsonData);
}

/**************************************************************** 
* Desc 		   : 마이데이터 화면 호출 (for the Test)
* @Method Name : gfn_callMyData
* @return      : 없음
****************************************************************/
function gfn_callMyData(){
	gfn_log("gfn_callMyData start !!! ");

	var data = {
			data : {
				key : "mydata",
				value : {
				}
			}
	 };
	
	var jsonData = JSON.stringify(data);
	gfn_log(jsonData);
	gfn_callNative(jsonData);
}

/**************************************************************** 
* Desc 		   : 마이데이터 인증 화면 이동 (for the Test)
* @Method Name : gfn_myDataAuthScreen
* @return      : 없음
****************************************************************/
function gfn_myDataAuthScreen(sParamData){
	gfn_log("gfn_myDataAuthScreen start !!! ");

	var data = {
			data : {
				key : "mydataAuth",
				value : {
					 screenId 		: ComUtil.null(sParamData.screenId, gfn_getScreenId()),
					 org_code 		: sParamData.org_code
				},
				callback : "gfn_callbackMyDataAuthScreen"
			}
	 };
	
	
	
	var jsonData = JSON.stringify(data);
	gfn_log("gfn_myDataAuthScreen :: " + jsonData);
	
	if(!gfn_isMobile() && !gfn_isOper()){
		var resultData = {};
		resultData.returnData = {
			screenId  	:  gfn_getScreenId()
			,passYn		: 'Y'
			,msg		: 'msgmsgmsg'      
		};
		gfn_callbackMyDataAuthScreen(resultData);
		return;
	}
	
	gfn_callNative(jsonData);
}


function gfn_callbackMyDataAuthScreen(resultData){
	gfn_log("gfn_callbackMyDataAuthScreen start :: ");
	
	var rData = {};
	if ( typeof resultData  == "string" ) {
		gfn_log("gfn_callbackMyDataAuthScreen!! " + resultData);
		resultData = resultData.replace(/\n/gi,"\\r\\n");
		rData = JSON.parse(resultData);
		rData = rData.returnData;		
	} else {
		var jsonData = JSON.stringify(resultData);
		gfn_log("gfn_callbackMyDataAuthScreen!! : " + jsonData);
		rData = resultData.returnData;
	}
	
	if(!ComUtil.isNull(rData.screenId)){
		if( $.type(window[rData.screenId]['callBack']['native']) === 'function'){
			rData.key = 'myDataAuth';
			window[rData.screenId].callBack.native(rData);
		}
	}
}



function gfn_enableMovePage(){
	if(location.pathname.indexOf('UNTOPEN') > -1 || location.pathname.indexOf('ADVCEXC') > -1 || location.pathname.indexOf('PENSEXE') > -1){
		return false;
	}
	
	var g_protectPage = sStorage.getItem('g_protectPage');
	if(g_protectPage.indexOf(location.pathname) > -1){
		return false;
	}
	return true;
}


/**************************************************************** 
* Desc 	: 토큰만료등으로 인해 로그인이 필요한 경우
* @Method Name  : gfn_reLogin()  
* @param   		:    1. jsonData : 네이티브에 요청할 Json 데이터
* @return   	: 없음
****************************************************************/
function gfn_reLogin(){
	var data = {
			data : {
				key : "reLogin",
				value : { 
				}
			}
		};
	
	var jsonData = JSON.stringify(data);
	gfn_log("gfn_otherLinkOpen :: " + jsonData);
	gfn_callNative(jsonData);
}

/**************************************************************** 
* Desc 	: 입력된 Json 데이터를 네이티브로 요청
* @Method Name : gfn_callNative  
* @param   :    1. jsonData : 네이티브에 요청할 Json 데이터
* @return   : 없음
****************************************************************/
function gfn_callNative(jsonData) {
	
	var host = location.host;
	
	var osGbn = gfn_checkMobile();
	if( osGbn == "android") {
		//안드로이드
		window.AndMuffler.callAndroid(jsonData);
	} else if(osGbn == "ios") {
		//iOS호출
		webkit.messageHandlers.callIos.postMessage ( jsonData );		
	} else {
		var a = JSON.parse(jsonData);
		if("setToken" == a.data.key){	
			return;
		}
		
		if(gfn_isLocal() || true){
			/*
			// local test
			var accessToken 	= 'eyJhbGciOiJIUzUxMiJ9.eyJlaWQiOiIzQkE2NUNGRi1FOTA3LTQ3Q0MtOURCNi1BNTdCMjQ2MjM1MUUiLCJBUkZsYWciOiJBIiwiZXhwIjoxNjA5NTUxMjU3LCJpYXQiOjE2MDkzNzg0NTd9.1ROrRhd33UsvAiPnx1DVI0LRXaiugpBE_v7oR21CAmnIm43Xwp8Wnqy2Puag0pXoRXS4vKrcdaqtnh0zjwAAeA';
			var refreshToken 	= 'eyJhbGciOiJIUzUxMiJ9.eyJlaWQiOiIzQkE2NUNGRi1FOTA3LTQ3Q0MtOURCNi1BNTdCMjQ2MjM1MUUiLCJBUkZsYWciOiJSIiwiZXhwIjoxNjEwMjQyNDU3LCJpYXQiOjE2MDkzNzg0NTd9.Rg654vG0w0NKjWro7P7TGod-t1BhFG540aajE1K8whbsK58z_wWeHYmcbLMp6ZW04UjM4v2gxQNGe1NaJAD1oA';
			
			sStorage.setItem('refreshToken', refreshToken);
			sStorage.setItem('accessToken', accessToken);
			
			// 암호화 셋팅
			JsEncrptObject.init();
			*/
			if(ComUtil.isNull(sStorage.getItem('refreshToken'))){
				gfn_setTokenInit('h');
			}
		}
		else{
			gfn_alertMsgBox("마이머플러 서비스는 안드로이드 또는 iOS OS에서만 지원됩니다.", '', function(){});
		}
	}
}

// local 에서만 사용한다. 
function gfn_setTokenInit(type){
	if(!gfn_isLocal()){
		return;
	}
	
	sessionStorage.clear();
	
	var inputParam 		= {};
	inputParam.sid 		= "selectMyToken";
	inputParam.target 	= "appweb";
	inputParam.url 		= "/template/selectToken";
	inputParam.data 	= {
							uUid : gfn_getWhoUid(type)
							,USER_NAME : type
						  };
	inputParam.callback	= gfn_callBackSetTokeninit; 
	inputParam.bAsync	= false;
	
	gfn_Transaction( inputParam );
}

function gfn_callBackSetTokeninit(sid, result, success){
	sStorage.setItem('accessToken', result.ds_detail.accessToken);
	sStorage.setItem('refreshToken', result.ds_detail.refreshToken);
	sStorage.setItem('uUid', result.ds_detail.user_uid);
	
	// 암호화 셋팅
	JsEncrptObject.init();
	
	
	if(success != "success" ) {
		gfn_errorMsgBox("토큰정보 조회중 오류가 발생하였습니다.");
		return;
	}
	
	if(ComUtil.isNull(result.ds_detail)){
		return;
	}
	
	
			
	gfn_sendTokenToNative(result.ds_detail.accessToken, result.ds_detail.refreshToken);
}


// local 에서만 사용한다. 
function gfn_resetTokenInit(type){
	if(!gfn_isLocal()){
		return;
	}
	
	
	var inputParam 		= {};
	inputParam.sid 		= "selectMyToken";
	inputParam.target 	= "auth";
	inputParam.url 		= "/user/request_token";
	inputParam.data 	= {
							refresh_token : sStorage.getItem('refreshToken')
							,ext_id       : sStorage.getItem('uUid')
						  };
	inputParam.callback	= gfn_callBackResetTokeninit; 
	inputParam.bAsync	= false;
	
	sessionStorage.clear();
	
	gfn_Transaction( inputParam );
}

function gfn_callBackResetTokeninit(sid, result, success){
	
	if(success != "success" ) {
		gfn_errorMsgBox("토큰정보 조회중 오류가 발생하였습니다.");
		return;
	}
			
	//gfn_sendTokenToNative(result.ds_detail.accessToken, result.ds_detail.refreshToken);
	var type = ComUtil.null($('#uid').val(), 'h').toLowerCase();
	gfn_setTokenInit(type);
	
	gfn_setUInfoInit();
}



function gfn_getWhoToken(){
	var uUid = sStorage.getItem('uUid');
	
	if(uUid == 'FB933E79-055F-4548-AEE4-B750A8526FBD'){	// 허성실
		return 'h';
	}
	if(uUid == 'BEC5A0D4-2D3C-4672-8EC5-000809BA9924'){	// 배수한
		return 'b';
	}
	if(uUid == 'FB58E0F0-C154-4DB6-BDFA-B7B35FB38669'){	// 정우현
		return 'j';
	}
	if(uUid == '7DFE3995-B2A3-42DF-82D1-5EEE2C525F0F'){	// 이정욱
		return 'l';
	}
	if(uUid == '9E6308C8-B60C-4DBA-9CE4-16DCD5F511AE'){	// 안은영
		return 'a';
	}
	
	var userNm = gfn_getUserInfo('userNm', true)
	if(userNm == '허성실'){
		return 'h';
	}
	if(userNm == '배수한'){
		return 'b';
	}
	if(userNm == '정우현'){
		return 'j';
	}
	if(userNm == '이정욱'){
		return 'l';
	}
	if(userNm == '정차민'){
		return 'c';
	}
	if(userNm == '안은영'){
		return 'a';
	}
	if(userNm == '전유애'){
		return 'j2';
	}
	if(userNm == '김지수'){
		return 'js';
	}
	if(userNm == '이동규'){
		return 'ldk';
	}
	if(userNm == '배현기'){
		return 'bh';
	}
	if(userNm == '김학영'){
		return 'k';
	}
	if(userNm == '강상묵'){
		return 'ka';
	}
	if(userNm == '강민서'){
		return 'km';
	}
	if(userNm == '박재훈'){
		return 'pj';
	}
	

	return 'c';
}


function gfn_getWhoUid(type){
	var uid = '';
	switch(type){
		case 'b' : uid = 'BEC5A0D4-2D3C-4672-8EC5-000809BA9924';	// 배수한
			break;
		case 'h' : uid = 'FB933E79-055F-4548-AEE4-B750A8526FBD';	// 허성실
			break;
		case 'j' : uid = 'FB58E0F0-C154-4DB6-BDFA-B7B35FB38669';	// 정우현
			break;
		case 'l' : uid = 'AA431FA8-54C3-4D1F-B311-818CF5A7B600';	// 이정욱
			break;
		case 'c' : uid = '5DAC8551-89F6-49C3-990D-B5BD0EC954C5';	// 정차민
			break;
		case 'a' : uid = 'A3BFF0DD-9566-4041-8B0A-8564703FDA45';	// 안은영
			break;
		case 'j2' : uid = '6D8C69E9-0295-45B8-A9D6-5769A5B0C837';	// 전유애
			break;
		case 'js' : uid = 'D1C03704-C4E0-4E50-B424-A8043814EE06';	// 김지수
			break;
		case 'ldk' : uid = 'A8EEED37-DA58-42FC-8735-467446E36EF7';	// 이동규
			break;
		case 'bh' : uid = '29B6D40C-E37B-453B-A387-5782CD7A3128';	// 배현기
			break;
		case 'k' : uid = 'F418D708-C6F8-4B05-A872-23CB1F9D013D';	// 김학영
			break;
		case 'ka' : uid = 'ECF6BE98-B0AF-4A81-BDAA-0CCEC4951778';	// 강상묵
			break;
		case 'km' : uid = '1D582A93-2B94-4DDA-BEAB-B175E8E42801';	// 강민서
			break;
		case 'pj' : uid = '1258A537-A3C8-4730-90CA-80F5230C6198';	// 박재훈
			break;
	}
	
	return uid;
}
			/*
			'E7B18DEC-06D8-492D-8CD5-DDCAE1EC41F9'	// 김학영
			'FB933E79-055F-4548-AEE4-B750A8526FBD'	// 허성실
			'BEC5A0D4-2D3C-4672-8EC5-000809BA9924'	// 배수한
			'9E6308C8-B60C-4DBA-9CE4-16DCD5F511AE'	// 안은영
			'FB58E0F0-C154-4DB6-BDFA-B7B35FB38669'	// 정우현
			*/