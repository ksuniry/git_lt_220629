/* Desc 	: 화면 첫 로드시 호출. 파라미터 기본 셋팅 및 내부 컴포넌트? 셋팅작업 */

function gfn_OnLoad(bNeedLogin){
	
	gfn_setType();		// 숫자, 영문 입력만 가능하도록 셋팅하는 부분
		
	//gfn_getToken();
	//gfn_SetButton();
	
	//공통으로 사용되는 컴퍼넌트들을 셋팅해준다.
	//gfn_SetCommInit();
}

function gfn_setType(){
	//$("").blur(function(){$(this).val( gfn_maskAmt($(this).val().replace(/[^\.0-9]/g,""), true) );} );			// 숫자로 보이게 만듬.
	
	$.each($('input[type="number"]'), function(index){
		if(!ComUtil.isNull($(this).attr("maxlength"))){
			$(this).attr('oninput', 'gfn_maxLengthCheck(this)');
		}
		
		/*
		if($(this).is('[acntno]')){
			$(document).off("focusout", '#'+$(this).attr('id')).on("focusout",'#'+$(this).attr('id'),function(){
				//alert($(this).val());
				//$(this).val('111-222-333');
			    //$(this).attr('pattern', "/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3'");
			});	
		}
		*/
	});
	
	
	$(".inp_with_btn").each(function(){

        $(this).bind("focus", function(){
            $(".btn_box").css("display", "none");     
        });
        $(this).bind("blur",function(){
            $(".btn_box").css("display", "block");
        });

    });
}

function gfn_maxLengthCheck(obj){
	if (obj.value.length > obj.maxLength){
        obj.value = obj.value.slice(0, obj.maxLength);
    }
}


function gfn_isNoBackScreen(screenId){
	
	if(ComUtil.isNull(screenId)){
		screenId = gfn_getScreenId();
	}
	
	
	if("DASHBRD01S01|".indexOf(screenId) > -1){
		return truen;
	}
	else{
		return false;
	}
}


//공통으로 사용되는 컴퍼넌트들을 셋팅해준다.
function gfn_setHeader(screenObj){
	
	if(ComUtil.isNull(screenObj.variable.noHead)){
		screenObj.variable.noHead = false;
	}
	
	if(ComUtil.isNull(screenObj.variable.headType)){
		screenObj.variable.headType = 'normal';
	}
	
	// 뒤로가기 버튼 체크
	if(ComUtil.null(screenObj.variable.noBack, false) == false){
		$('#btnBack').show();
	}
	
	if(gfn_isOper()){
		$('#testMenu').remove();		
	}
	else{
		$('#testMenu').show();
	}
	
	
	// 해더가 필요없는 화면일 경우 숨김처리한다.
	if(screenObj.variable.noHead == false){
		if('popup' != screenObj.variable.headType){
			$('#page_head').show();
		}
		$('#header_'+screenObj.variable.headType).show();
	}
	
	// 햄버거메뉴 s
	if(ComUtil.null(screenObj.variable.showMenu, true) == true){
		//$('#divHMenu', $('#header_'+screenObj.variable.headType)).show();
		var divHMenu = '\
		<div class="head_right" id="divHMenu">\
            <a href="javascript:void(0);" class="push" id="headerPush">\
                <span class="blind">알림</span>\
            </a>\
            <a href="javascript:void(0);" class="menu" id="headerMenu">\
                <span class="blind">메뉴</span>\
            </a>\
        </div>\
		';
		$('#header_'+screenObj.variable.headType).append(divHMenu);
	}
	
	$(document).off("click", '#headerMenu').on("click",'#headerMenu',function(){
	    $('.m_menu').addClass('show_ani');
		$('.dim.ham').show();
		gfn_scrollDisable();
	});
	
	$(document).off("click", '.m_close').on("click",'.m_close',function(){
	//$('.m_close').click(function(){
	    $(this).parents('.m_menu').removeClass('show_ani');
		$('.dim.ham').hide();
		gfn_scrollAble();
	});
	// 햄버거메뉴 e
	
	
	// 알림 클릭시
	$(document).off("click", '#headerPush').on("click",'#headerPush',function(){
		// 알림카운트가 있어야 호출되게 한다.
	    var sParam = {};
		sParam.url = '/board_mng/BORDPUS01P01';
		gfn_callPopup(sParam, function(){});
	});
	
	$(document).off("click", '.logo').on("click",'.logo',function(){
	//$('.logo').click(function(){
	    var link = $(this).data('link');
		if("m" == link){
			//ComUtil.moveLink('/pension_advice/dashBoard/DASHBRD01S01', true);
			
			//var homeUrl = sStorage.getItem('homeUrl');
			//ComUtil.moveLink(homeUrl, false);
			
			gfn_historyClear();
			gfn_goMain();
		}
	});
	
	
	//accor
	/*
    //$('.accor_title' , $('#P82-content')).click(function(){
    $(document).off("click", '.accor_title').on("click",'.accor_title',function(){
        if($(this).find('.ico').hasClass('arr_down') === true){
            $(this).next().show();
            $(this).find('.ico').removeClass('arr_down').addClass('arr_up');
        }else{
            $(this).next().hide();
            $(this).find('.ico').removeClass('arr_up').addClass('arr_down');
        }
    });*/
	
	
	
	// 헤더의 이름과 기간 알람 표시
	gfn_setHeaderInfo();
}

function gfn_setHeaderInfo(){
	if(gfn_getUserInfo('pushYn', false) == 'Y'){
		$('#headerPush').addClass('active');
	}
	if(gfn_getUserInfo('userNm', true) != ''){
		$('#h_user_nm').html(gfn_getUserInfo('userNm', true));
	}
	
	if(!ComUtil.isNull(gfn_getUserInfo('usePrd', false))){
		$('#h_use_prd').html(gfn_getUserInfo('usePrd', false));
	}
	
	
	// 권한에 맞는 셋팅하기
	gfn_setAuthority();
}


// 권한에 맞는 메뉴 셋팅하기
function gfn_setAuthority(){
	var uStatus = gfn_getUserInfo('status', false);
	
	$('.menu_' + uStatus).show();
		
}


//공통으로 사용되는 컴퍼넌트들을 셋팅해준다.
function gfn_SetCommInit_old(){
	
	
	$("td[id^='userLogo'], span[id^='userLogo'], div[id^='userLogo']").each(function() {
		if (!(typeof SES_USER_NAME == 'undefined')) {
			if(!gfn_isNull(SES_USER_NAME)){
				var commTag = "<p class=\"userAdmin\">" + SES_USER_NAME + " 관리자입니다.</p>";
				$(this).html(commTag);
			}
		}
	});
	
	//var site_id = site_id = "?SITE_ID=" + gfn_getSiteID();
	var site_id = "?";
	
	$("td[id^='top_link'], span[id^='top_link'], div[id^='top_link']").each(function() {
		
		var commTag = "<ul>";
		
		
		commTag += "<li><a href=\""+ gfn_getApplication() +"/shop/main.do"+site_id+"\">SHOP</a></li>";
		
		
		if(gfn_isLogin()){
			commTag += "<li><a href=\""+ gfn_getApplication() +"/login/logout.do"+site_id+"\">로그아웃</a></li>";
			commTag += "<li><a href=\""+ gfn_getApplication() +"/adminuser/adminUserChgPswd.do"+site_id+"&mode=M\">비밀번호 변경</a></li>";
		}
		else
			commTag += "<li><a href=\""+ gfn_getApplication() +"/login/login.do"+site_id+"\">로그인</a></li>";
			
		commTag += "</ul>";
			
		
		$(this).html(commTag);
	});
	
	
	// 목록 버튼 생성
	$("td[id^='list_link'], span[id^='list_link'], div[id^='list_link']").each(function() {
		var listUrl = "";
		var connect = "?";
		if(!gfn_isNull($('#LISTPARAMS').val()) && !gfn_isNull($('#LISTURL').val())){
			listUrl = location.origin + $('#LISTURL').val();
			if(listUrl.indexOf("?") > -1)
				connect = "&";
			listUrl += connect + "MYPARAMS=" + $('#LISTPARAMS').val();
		}
		else{
			// 리스트 목록이 없는경우
			//var aObj = $('a' , $(this));
			var H_MENU_CD = "";
			var L_MENU_CD = "";
			
			if($('#H_MENU_CD').length > 0){
				H_MENU_CD = "&H_MENU_CD=" + $('#H_MENU_CD').val();
			}
			
			if($('#L_MENU_CD').length > 0){
				L_MENU_CD = "&L_MENU_CD=" + $('#L_MENU_CD').val();
			}
			
			listUrl = $('#LISTURL').val() + "?SITE_ID=" + gfn_getSiteID() + H_MENU_CD + L_MENU_CD;
		}
		
		var title = $(this).attr("title");
		
		if (gfn_isNull(title)) {
			title = "목록";
		}
		
		var commTag = "<a href=\""+listUrl+"\">" + title + " </a>";
		
		$(this).html(commTag);
	});
	
	// 이전 페이지 목록 버튼 생성
	$("td[id^='preLink'], span[id^='preLink'], div[id^='preLink']").each(function() {
		if( $('#findForm').length > 0 ){
			var title = $(this).attr("title");
			
			if (gfn_isNull(title)) {
				title = "이전";
			}
			
			var commTag = "<button type='button' id='btnR_Return'>" + title + "</button>";
			
			$(this).html(commTag);
		}
	});
	
	// 돌아가기 버튼
	$("#btnR_Return").click(function() {
		if( $('#findForm').length > 0 ){
			var inputParam = gfn_makeInputData($("#findForm"));
		
			gfn_commonGo(inputParam.FIND_RETURNURL, inputParam, "N");
		}
	});
	
	// 이전 페이지 목록 버튼 생성
	$("td[id^='pre_link'], span[id^='pre_link'], div[id^='pre_link']").each(function() {
		if( $('#REFPATH').length > 0 ){
			var title = $(this).attr("title");
			
			if (gfn_isNull(title)) {
				title = "이전";
			}
			
			var commTag = "<a href=\""+ gfn_getApplication() + $('#REFPATH').val()+"\">" + title + " </a>";
			
			$(this).html(commTag);
		}
	});
	
	// 이전화면에서 던저준 목폭페이지 조건 셋팅
	if(!gfn_isNull($('#MYPARAMS').val())){
		var arrParam = $('#MYPARAMS').val().split("|");
		var params = new Object();
		
		try{
			for(var i = 0 ; i < arrParam.length; i++){
				var arrPa = arrParam[i].split("=");
				eval("params." + arrPa[0] + " = '" + arrPa[1] + "'");
			}
			gfn_setDetails(params);
		}catch(e){console.log("MYPARAMS setting error!!");}
		
		//$('#MYPARAMS').val("");
	}
	
	// 달력 셋팅... 아직 미적용
	$( ".datepicker" ).datepicker({
	    dateFormat: 'yy-mm-dd',
	    prevText: '이전 달',
	    nextText: '다음 달',
	    monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
	    monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
	    dayNames: ['일','월','화','수','목','금','토'],
	    dayNamesShort: ['일','월','화','수','목','금','토'],
	    dayNamesMin: ['일','월','화','수','목','금','토'],
	    showMonthAfterYear: true,
	    yearSuffix: '년'
	  });

}

/**************************************************************** 
 * Desc 	: 로그인 후.. 접속할 메인 페이지
 *  ****************************************************************/ 
function gfn_goMain(){
	//var url = "/pension_advice/dashBoard/DASHBRD01S01";
	
	var homeUrl = sStorage.getItem('homeUrl');
	gfn_log('gfn_goMain homeUrl :: ' + homeUrl);
	
	if(ComUtil.isNull(homeUrl)){
		
		var status = gfn_getUserInfo('status', false);
		switch(status){
			case 'advice' :
					   homeUrl = "";
				break;
			case 'trans' :
					   homeUrl = "";
				break;
			case 'wait' :
				   	   homeUrl = "";
				break;
			case 'mng' :
					   homeUrl = "";
				break;
			default  : 
					   homeUrl = "";
				break;
		}
		sStorage.setItem('homeUrl', homeUrl);
	}
	
	if(!ComUtil.isNull(homeUrl)){
		//gfn_commonGo(homeUrl, "", "");
		ComUtil.moveLink(homeUrl, false);
	}

}


function gfn_helpDeskMsg(){
	return '고객센터에 문의 하시길 바랍니다.';
}

/**************************************************************** 
 * Desc 	: 탑으로 이동 버튼 제어
 *  ****************************************************************/ 
function gfn_scrollFunction(screenId) {

	if($('#btnToTop_'+screenId).length == 0){
		return;
	}
	
    var goToTop = $('#btnToTop_'+screenId);

	//gfn_log(screenId + " document.body.scrollTop  :: " + document.body.scrollTop );
	if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        goToTop.show();
    } else {
        goToTop.hide();
    }
}

function gfn_scrollFunctionPop(screenId, curScreenOjb) {

	if($('#btnToTop_'+screenId).length == 0){
		return;
	}
	
    var goToTop = $('#btnToTop_'+screenId);

	//gfn_log("curScreenOjb.scrollTop() :: " + curScreenOjb.scrollTop());
	//gfn_log(screenId + " $('.popup_wrap').scrollTop() :: " + $('.popup_wrap', curScreenOjb).scrollTop());
	if($('.popup_wrap', curScreenOjb).scrollTop() > 80){
        goToTop.show();
        goToTop.click(function(){
            event.preventDefault();
            $('.popup_wrap', curScreenOjb).scrollTop(0);
        });
        
    }else{
        goToTop.hide();
    }
}

/**************************************************************** 
* Desc 	: 토큰초기화
* @Method Name : gfn_initToken  
* @param    :	void
* @return   :  token 
****************************************************************/
function gfn_initToken(){
	if($('#accessToken').length > 0){
		if(!ComUtil.isNull($('#accessToken').val())){
			sStorage.setItem('accessToken', $('#accessToken').val());
		}
	}
	if($('#refreshToken').length > 0){
		if(!ComUtil.isNull($('#refreshToken').val())){
			sStorage.setItem('refreshToken', $('#refreshToken').val());
		}
		// 암호화 셋팅
		JsEncrptObject.init();
	}
}
	
/**************************************************************** 
* Desc 	: 토큰값 읽어오기
* @Method Name : gfn_readToken  
* @param    :	void
* @return   :  token 
****************************************************************/
function gfn_readToken(){
	var token = sStorage.getItem("accessToken");
	
	/*
	if(ComUtil.isNull(token)){
		token = $("#accessToken").val();
	}
	*/
	
	return token;
}

/**************************************************************** 
 * Desc 	: 푸쉬로 화면이동 하면 안되는 화면리스트 등록 및 애드브릭스 이벤트  추가  
 *  ****************************************************************/ 
function gfn_setProtectPage(screenId){
	
	if(ComUtil.isNull(sStorage.getItem('g_protectPage'))){
		var g_protectPage = new Array();
		g_protectPage.push('/index');
		
		sStorage.setItem('g_protectPage', g_protectPage);
	}
	
	// 애드브릭스 이벤트  추가
	var screenObj = window[screenId];
	if(!ComUtil.isNull(screenObj.variable.screenType)){
		// 화면접근정보 통지
		var inputParam = {};
		inputParam.type 	= '1';
		inputParam.event 	= screenObj.variable.screenType;
		gfn_enterScreen(inputParam);
	}
	
	if(!ComUtil.isNull(screenObj.variable.screenFType)){
		// 화면접근정보 통지
		var inputParam = {};
		inputParam.type 	= '2';
		inputParam.event 	= screenObj.variable.screenFType;
		gfn_enterScreen(inputParam);
	}
}

/**************************************************************** 
 * Desc 	: 불충분한 이용자 화면 접근 방지
 *  ****************************************************************/ 
function gfn_protectPageByStatus(screenId){
	var status = gfn_getUserInfo('status', false);
	
	if(gfn_isLocal() || gfn_isDev()){
		return false;
	}
		
	if(sStorage.getItem('finish') == 'Y'){
		//gfn_alertMsgBox('비정상적인 접근입니다. 앱을 종료합니다.', '', function(){
			gfn_finishView();
			return true;
		//});
	}
	
	
	// 'advice' : 자문전, 'trans' : 자문계약중, 'mng' : 자문완료
	var finish = false;
	if(status == 'advice'){
		if(location.pathname.indexOf('/pension_execution/advice_contract/') > -1
		//|| location.pathname.indexOf('/advice_execution') > -1 
		|| location.pathname.indexOf('/pension_mng') > -1 
		){
			if(location.pathname.indexOf('ADVCEXC12S01') > -1){
				finish = false;
			}
			else{
				finish = true;
			}
		}
	}
	else if(status == 'trans'){
		if(location.pathname.indexOf('/dashBoard') > -1 
		|| location.pathname.indexOf('/pension_mng') > -1
		){
			finish = true;
		}
	}
	else if(status == 'mng'){
		if(location.pathname.indexOf('/dashBoard') > -1
		|| location.pathname.indexOf('/untact_open') > -1
		|| location.pathname.indexOf('/pension_execution/PENSEXE') > -1
		|| location.pathname.indexOf('/pension_advice') > -1
		){
			finish = true;
		}
	}
	else if(status == 'wait'){
		finish = false;
	}
	else{
		if(location.pathname.indexOf('/template') == -1 ){
			finish = true;
		}
	}
	
	if(finish){
		//gfn_alertMsgBox('비정상적인 접근입니다. 앱을 종료합니다.', '', function(){
			gfn_finishView();
			sStorage.setItem('finish', 'Y');
		//});
	}
	
	return finish;
}


/**************************************************************** 
 * Desc 	: 시스템 가능여부 체크 
 *  ****************************************************************/ 
function gfn_checkSystem(screenId){
	// 시스템 체크 제외  화면정의 
	if("".indexOf(screenId) > -1 ){
		return;
	}
	var inputParam 		= {};
	inputParam.sid 		= "checkSystemStatus";
	inputParam.target 	= "api";
	inputParam.url 		= "";
	inputParam.data 	= {};
	inputParam.callback	= gfn_callBackCheckSystem; 
	inputParam.bAsync	= false;
	
	//gfn_Transaction( inputParam );
}

function gfn_callBackCheckSystem(sid, result, success){
	//상태값 체크 후 사용여부
	if(result.foreign_user_status == 'Y'){
		gfn_callPopupSysClose({msg:result.foreign_user_status_msg});
	}
	
}


/**************************************************************** 
 * Desc 	: body 스크롤 막기
 *  ****************************************************************/ 
function gfn_scrollDisable(){
    $('body').addClass('hidden_scroll').on('scroll touchmove mousewheel', function(e){
        e.preventDefault();
    });
}
function gfn_scrollAble(){
    $('body').removeClass('hidden_scroll').off('scroll touchmove mousewheel');
}
/**************************************************************** 
 * Desc 	: 운영상태코드에 따른 값 셋팅
 *  ****************************************************************/ 
function gfn_getOprtStatusInfo(oprt_status_cd){
	var oprtInfo = {};
	
	if(ComUtil.isNull(oprt_status_cd)){
		return oprtInfo;
	}
		
	var sdc = oprt_status_cd.substr(0,1);
	if("99" == oprt_status_cd){
		sdc =  oprt_status_cd;
	}
	
	//  해지여부
	oprtInfo.bTerminate	= false;
	
	switch(sdc){
		case '0' : oprtInfo.operStatusText 	= "정상";
		           oprtInfo.operStatusClass	= "normal";
		           oprtInfo.operStatusBoxClass	= "";
		           oprtInfo.bHelpBtn		= false;
			break; 
		case '1' : oprtInfo.operStatusText 	= "경고";
		           oprtInfo.operStatusClass	= "warning";
		           oprtInfo.operStatusBoxClass	= "box_lock";
		           oprtInfo.bHelpBtn		= true;
			break; 
		case '2' : oprtInfo.operStatusText 	= "심각";
		           oprtInfo.operStatusClass	= "serious";
		           oprtInfo.operStatusBoxClass	= "box_lock";
		           oprtInfo.bHelpBtn		= true;
			break; 
		case '3' : oprtInfo.operStatusText 	= "대기";
		           oprtInfo.operStatusClass	= "wait";
		           oprtInfo.operStatusBoxClass	= "box_lock";
		           oprtInfo.bHelpBtn		= true;
			break; 
		case '4' : oprtInfo.operStatusText 	= "잠김";
		           oprtInfo.operStatusClass	= "lock";
		           oprtInfo.operStatusBoxClass	= "box_lock";
		           oprtInfo.bHelpBtn		= true;
			break; 
		case '99' : oprtInfo.operStatusText 	= "";
		           oprtInfo.operStatusClass	= "";
		           oprtInfo.operStatusBoxClass	= "other";
		           oprtInfo.bHelpBtn		= false;
			break; 
		default	 : break;
	}
	
	
	switch(oprt_status_cd){
		//상태값체크
		/*case '300' :	 
		           oprtInfo.bHelpBtn	= false;
		           oprtInfo.nextUrl		= '/pension_execution/order/ORDREXE01P02';
		           oprtInfo.nextType	= 'p';
			break;*/
		case '210' : 	
		           oprtInfo.bTerminate	= true;
				   oprtInfo.operStatusText 		= "해지중";
		           oprtInfo.operStatusClass		= "cancel";
		           oprtInfo.operStatusBoxClass	= "cancel";
			break;
		case '219' : 	// 자문계약해지
		           oprtInfo.bTerminate	= true;
					oprtInfo.operStatusText 	= "해지";
		           oprtInfo.operStatusClass		= "cancel";
		           oprtInfo.operStatusBoxClass	= "cancel";
			break;
		case '301' : 	// 상품주문중
		           oprtInfo.bHelpBtn	= false;
		default	 : break;
	}
	
	return oprtInfo;
}

/**************************************************************** 
* Desc 	: 사용자정보조회
* @Method Name : gfn_setUInfoInit  
* @param   : 없음
* @return   : 없음
****************************************************************/
function gfn_setUInfoInit(){
	
	var inputParam 		= {};
	inputParam.sid 		= "selectUserDefaultInfo";
	inputParam.target 	= "auth";
	inputParam.url 		= "/user/select_user_default_info";
	inputParam.data 	= {};
	inputParam.callback	= gfn_callBackSetUInfoInit; 
	inputParam.bAsync	= false;
	
	gfn_Transaction( inputParam );
}

function gfn_callBackSetUInfoInit(sid, result, success){
	if(success != "success" ) {
		gfn_errorMsgBox("사용자정보 조회중 오류가 발생하였습니다.");
		return;
	}
	
	
	if(result.result != "ok" ) {
		gfn_errorMsgBox(result.message);
		return;
	}
	
	if(ComUtil.isNull(result.user_nm)){
		return;
	}

	gfn_setUserInfo('userNm', 		result.user_nm);
	gfn_setUserInfo('userPn', 		result.user_pn);
	gfn_setUserInfo('userEmail', 	result.user_email);
	gfn_setUserInfo('usePrd', 		result.use_prd);
	gfn_setUserInfo('status', 		result.status);		// 'advice' : 대기, 'trans' : 진행, 'mng' : 완료
	gfn_setHeaderInfo();
}




// pushYn, userNm, usePrd
function gfn_setUserInfo(key, value){
	var userInfo = ComUtil.null(sStorage.getItem('gUserInfo'), {});
	userInfo[key] = value;
	sStorage.setItem('gUserInfo', userInfo);
}

function gfn_getUserInfo(key, bDecrpt){
	var userInfo = ComUtil.null(sStorage.getItem('gUserInfo'), {});
	
	bDecrpt = ComUtil.null(bDecrpt, true);
	/* 암호화
	if(bDecrpt){
		return JsEncrptObject.decrypt(ComUtil.null(userInfo[key], ''));
	}
	else{
		return ComUtil.null(userInfo[key], '');
	}
	*/
	return ComUtil.null(userInfo[key], '');
}


/**************************************************************** 
* Desc 	: 알림정보 조회
* @Method Name : gfn_reloadAlarm  
* @param   : 없음
* @return   : 없음
****************************************************************/
function gfn_reloadAlarm() {
	
	var inputParam 		= {};
	inputParam.sid 		= "pushMessageList";
	inputParam.target 	= "auth";
	inputParam.url 		= "/push/push_message_list";
	inputParam.data 	= {}; 
	inputParam.callback	= gfn_callBackReloadAlarm; 
	
	gfn_Transaction( inputParam );
	/*
	var result = {};
	result.message_list = 
						 [{p_uid : "1", title:"aaa", type:"진행1", 	read_yn:"N", body:"메세지1"}
						 ,{p_uid : "2", title:"bbb", type:"진행2", 		read_yn:"Y", body:"메세지2"}
						 ,{p_uid : "3", title:"ccc", type:"경고", 		read_yn:"N", body:"메세지3"}
					     ];

	gfn_callBackReloadAlarm('', result, 'success');
	*/
}

function gfn_callBackReloadAlarm(sid, result, success){
	if(success != "success" ) {
		gfn_errorMsgBox("알림정보 조회중 오류가 발생하였습니다.");
		return;
	}
	
	//sStorage.setItem('g_messageList', ComUtil.null(result.message_list, []));
	$.each(result.message_list, function(index, item){
		if(item.read_yn == 'N'){
			$('#headerPush').addClass('active');
			gfn_setUserInfo('pushYn', 'Y');
		}
	});
}


/**************************************************************** 
* Desc 	: 공지사항 / 이벤트 조회
* @Method Name : gfn_noticePop  
* @param   : 없음
* @return   : 없음
****************************************************************/
function gfn_noticePop() {
	
	var inputParam 		= {};
	inputParam.sid 		= "noticePopup";
	inputParam.target 	= "home";
	inputParam.url 		= "/api/notice_popup";
	inputParam.data 	= {}; 
	inputParam.callback	= gfn_callBackNoticePop; 
	
	gfn_Transaction( inputParam );
	/*
	var result = {};
	result.message_list = 
						 [{p_uid : "1", title:"aaa", type:"진행1", 	read_yn:"N", body:"메세지1"}
						 ,{p_uid : "2", title:"bbb", type:"진행2", 		read_yn:"Y", body:"메세지2"}
						 ,{p_uid : "3", title:"ccc", type:"경고", 		read_yn:"N", body:"메세지3"}
					     ];


	gfn_callBacknoticePop('', result, 'success');
	*/
}

function gfn_callBackNoticePop(sid, result, success){
	if(success != "success" ) {
		gfn_errorMsgBox("이벤트 조회중 오류가 발생하였습니다.");
		return;
	}
	
	// 공지팝업 호출하자.
	if(ComUtil.null(result.result, 'fail').toUpperCase() == "OK" ) {
		sStorage.setItem("NoticePopInfo", result);
		
		// 메인 화면 스크롤 막기 
		$('body').addClass('hidden_scroll').on('scroll touchmove mousewheel', function(e){
            e.preventDefault();
        });
		$('#divEventPop').show();
		
		$('.modal .event-close, .dim', $('#divEventPop')).on("click", function(){
			$('body').removeClass('hidden_scroll').off('scroll touchmove mousewheel');
			$('#divEventPop').hide();
		});
		
		// 자세히 보러 가기.
		$('#btnNoticeDetail', $('#divEventPop')).on("click", function(){
			var data = sStorage.getItem("NoticePopInfo");
	
			sStorage.setItem("BORDNOT03P05Params", data.notice);
			
			var sParam = {};
			sParam.url = "/board_mng/BORDNOT03P05";	// 공지사항 상세내역 보기화면 호출
			
			// 팝업호출
			gfn_callPopup(sParam, function(){});
			$('body').removeClass('hidden_scroll').off('scroll touchmove mousewheel');
			$('#divEventPop').hide();
		});
		
		// 공지팝업 다시 보지 않기
		$('#btnNoticeDeny', $('#divEventPop')).on("click", function(){
			gfn_noticeDeny();
			$('body').removeClass('hidden_scroll').off('scroll touchmove mousewheel');
			$('#divEventPop').hide();
		});
		
		//$(document).off("click", 'input, textarea').on("click",'input, textarea',function(e){
		//});
		return;
	}
}

// 이벤트 다시 보지 않기
function gfn_noticeDeny() {
	var data = sStorage.getItem("NoticePopInfo");
	var inputParam 		= {};
	inputParam.sid 		= "noticePopupDenied";
	inputParam.target 	= "home";
	inputParam.url 		= "/api/notice_popup_denied";
	inputParam.data 	= data.notice;
	inputParam.callback	= gfn_callBackNoticeDeny; 
	
	gfn_Transaction( inputParam );
	/*
	var result = {};
	result.message_list = 
						 [{p_uid : "1", title:"aaa", type:"입금/매수", 	read_yn:"N", body:"KB 연금자문계좌(3309) 10/31 09:00 매수 완료"}
						 ,{p_uid : "2", title:"bbb", type:"출금", 		read_yn:"Y", body:"KB 연금자문계좌(3310) 10/31 09:00 매수 완료"}
						 ,{p_uid : "3", title:"ccc", type:"경고", 		read_yn:"N", body:"KB 연금자문계좌(3311) 10/31 09:00 매수 완료"}
					     ];

	gfn_callBacknoticePop('', result, 'success');
	*/
}


function gfn_callBackNoticeDeny(sid, result, success){
	if(success != "success" ) {
		gfn_errorMsgBox("이벤트 다시보지않기 저장중 오류가 발생하였습니다.");
		return;
	}
}


/**************************************************************** 
* Desc 	: 공통코드조회
* @Method Name : gfn_getCommCode  
* @param   : 없음
* @return   : 없음
****************************************************************/
function gfn_getCommCode(sParam){
	
	var inputParam 		= {};
	inputParam.sid 		= "selectCommCode";
	inputParam.target 	= "home";
	inputParam.url 		= "/api/code_list";
	inputParam.data 	= sParam;
	inputParam.callback	= gfn_callBackCommCode;
	inputParam.bAsync	= false;
	
	gfn_Transaction( inputParam );
}

function gfn_callBackCommCode(sid, result, success){
	if(success != "success" ) {
		gfn_errorMsgBox("서버에서 오류가 발생하였습니다.");
		history.back();
		return;
	}
	
	if(gfn_isNull(result.code_list)){
		return;
	}
	
	var sendData = result.sendData;
	
	var callback = sendData.callback;
	
	switch (sendData.setType){
		case 'sel'		: gfn_setSelectBox(result.code_list, sendData.objId);
						break; 
		default			:
						break; 
	}
	
	
	if( typeof callback != "function"){
		if ( window.fn_callBack ) {
			fn_callBack(sid, result, success);    
		}
	}
	else {
		callback(sendData.sid, result, success);
	}
}


function gfn_setSelectBox(codeList, objId){
	var obj = $('#'+objId);
	obj.html('');
	
	if(gfn_isNull(codeList)){
		return;
	}
	
	$.each(codeList, function(index, item){
		var option = '<option value="'+item.code+'">'+item.code_nm+'</option>';
		
		$('#'+objId).append(option);
	});
}

function gfn_setSelectBoxByJson(codeInfo, objId){
	var obj = $('#'+objId);
	obj.html('');
	
	if(gfn_isNull(codeInfo)){
		return;
	}
	
	$.each(codeInfo, function(key, value){
		var option = '<option value="'+key+'">'+value+'</option>';
		
		$('#'+objId).append(option);
	});
}

/**************************************************************** 
* Desc 	: 공지팝업 호출
* @Method Name : gfn_callNoticePopup  
* @param   : sParam object
				callback : 콜백 함수
* @return   : returnParam object (팝업에서 종료시 담을 결과값  gfn_closePopup)
****************************************************************/
function gfn_callNoticePopup(sParam){
	sParam = ComUtil.null(sParam, {});
	sParam.url = '/template/template_pop';	
	gfn_callPopup(sParam, function(returnParam){
		if(!ComUtil.isNull(sParam.callback)){
			sParam.callback(returnParam);
		}
	});
}


/**************************************************************** 
* Desc 	: 비밀번호 입력 공통팝업 호출
* @Method Name : gfn_callPwdPopup  
* @param   : sParam object
				callback : 콜백 함수
* @return   : returnParam object (팝업에서 종료시 담을 결과값  gfn_closePopup)
****************************************************************/
function gfn_callPwdPopup(sParam){
	sParam = ComUtil.null(sParam, {});
	
	{
		sStorage.setItem("CMMPWDK09P02Params", sParam);
		sParam.url = '/popup/CMMPWDK09P02';		// KB 증권 비밀번호 입력 화면 호출 
	}
	
	gfn_callPopup(sParam, function(returnParam){
		if(!ComUtil.isNull(sParam.callback)){
			sParam.callback(returnParam);
		}
		$('body').removeClass('hidden_scroll').off('scroll touchmove mousewheel');
	});
}

/**************************************************************** 
* Desc 	: 깃플상탐호출 공통팝업 호출
* @Method Name : gfn_callGitplePopup  
* @param   : sParam object
				callback : 콜백 함수
* @return   : returnParam object (팝업에서 종료시 담을 결과값  gfn_closePopup)
****************************************************************/
function gfn_callGitplePopup(sParam){
	sParam = ComUtil.null(sParam, {});
	
	{
		sStorage.setItem("CMMGITP02P01Params", sParam);
		sParam.url = '/popup/CMMGITP02P01'; 
	}
	
	gfn_callPopup(sParam, function(returnParam){
		if(!ComUtil.isNull(sParam.callback)){
			sParam.callback(returnParam);
		}
	});
}



/**************************************************************** 
* Desc 	: 공지팝업 호출
* @Method Name : gfn_callNoticePopup  
* @param   : sParam object
				callback : 콜백 함수
* @return   : returnParam object (팝업에서 종료시 담을 결과값  gfn_closePopup)
****************************************************************/
function gfn_getDownloadUrl(sParam){
	return "https://file.wealthguide.co.kr/file/doc_download";
}


/**************************************************************** 
* Desc 	: 펀드링크 호출
* @Method Name : gfn_callFundDetail  
* @param   : sParam.fund_no  펀드번호
* @return   : 없음  (각 화면의   callBack.native   key == 'otherLinkOpen'  로 전달된다. )
****************************************************************/
function gfn_callFundDetail(sParam){
	var url = "https://m.fundsolution.co.kr/SPFM43000MASS.do?mode=fnList6&FUND_CD="+sParam.fund_no+"&cntSubM=load";
	
	var inputParam = {};
	inputParam.url 			= url;
	inputParam.screenId 	= gfn_getScreenId();
	inputParam.objId	 	= sParam.fund_no;
	inputParam.inYn		 	= "Y";
	inputParam.type		 	= "link";
	
	gfn_otherLinkOpen(inputParam);
}

/**************************************************************** 
* Desc 	: app 버젼 체크후 구버젼이면 false, 기준 초과이면  true
* @Method Name : gfn_checkAppVersion  
* @param   : 없음 
* @return   : 구버젼이면 false, 기준 이상이면  true
****************************************************************/
function gfn_checkAppVersion(){
	var appVer = ComUtil.null(sStorage.getItem('appVer'), '1.0.1');
	
	if(gfn_isLocal() && !gfn_isMobile()){
		return true;
	}
	
	var mType = gfn_checkMobile();
	var checkVer = '2.1.5';
	if(mType == 'android'){
		checkVer = '2.1.5';
	}
	else if(mType == 'ios'){
		checkVer = '2.1.5';
	}
	
	gfn_log("mType :: " + mType);
	gfn_log("appVer :: " + appVer);
	gfn_log("checkVer :: " + checkVer);
	
	var appVerArr = appVer.split('.');
	var checkVerArr = checkVer.split('.');
	
	for(_idx in appVerArr){
		if( parseInt(appVerArr[_idx]) < parseInt(checkVerArr[_idx])){
			return false;
		}
		else if( parseInt(appVerArr[_idx]) > parseInt(checkVerArr[_idx])){
			return true;
		}
	}
	
	return false;
}


// 임시 사용함수
function gfn_movePageLifePlanFirst(){
	// 메뉴 > 내정보 > 연금포털 연결하기 로그인 화면
	//if(!gfn_isOper()){
		ComUtil.moveLink('/my_info/MYINFOM03S21', true);	// 신규프로세스
	//}
	//else{
	//	ComUtil.moveLink('/my_info/MYINFOM03S20', true);	// app 배포전엔 예전프로세수
	//}
}


function gfn_btnClickEvent(e){
	gfn_log($(this).attr('id'));
	//debugger;
	//e.data.nextFunc(e);
}



function gfn_lock(){
	
}