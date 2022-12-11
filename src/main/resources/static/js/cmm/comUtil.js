/**
* 파일명 : /js/cmm/comUtil.js
 */

/**

ComUtil.isNull(sParam); 								null 인지 체크하여 null이면 true 아니면 false 리턴
ComUtil.null(sParam, sDefalut);							값이 null이면 디폴트값으로 리턴
ComUtil.moveLink(url, bHistory);						내부 url, 외부 url 의 경우에 대해서 오픈한다.

--string
ComUtil.string.replaceAll(value, patten, repatten); 	value 의 특정값들을 다른 문자로 변환
ComUtil.string.dateFormat(value, patten);				8자리 날짜에 패턴 적용하여 반환, 패턴 없으면 '-' 로 적용함
ComUtil.string.dateFormatHan(value, patten);			8자리 날짜에 패턴 적용하여 반환, 년월일로 적용함
ComUtil.string.hpFormat(value);							전화번호 자동 하이픈
ComUtil.string.format(value, type);						전화번호/ 등의 타입에 따른 포멧값으로 리턴
ComUtil.string.convertHtml(value);						html 형식으로 변경
ComUtil.string.lpad(str, padLen, padStr)				좌측문자열 채우기
ComUtil.string.rpad(str, padLen, padStr)				우측문자열 채우기
ComUtil.string.clipboardCopy(str)						클립보드 복사 
ComUtil.string.isIndexOf(tStr, sStr)					sStr에 tStr이 존재하면 true  


--number
ComUtil.number.addCommmas(sParam);						숫자(금액)를 3자리 마다 콤마를 찍어준다. 
ComUtil.number.removeCommmas(sParam);					콤마를 제거한다.
ComUtil.number.setDigitCount(selector, numStep, duration);	또르르 효과후 금액 셋팅


-- date
	YYYYMMDDHHmmss
ComUtil.date.curDate(pattern);							패넌에 맞는 스트링 리턴 :  YYYYMMDDHHmmssSSS
ComUtil.date.curYear();									4자리 년도
ComUtil.date.curMonth();								03, 12 2자리 월
ComUtil.date.curDay();									01, 11 2자리 일자

--validate
ComUtil.validate.check()								data-keyin attr 에 셋팅된 유효성 체크 진행 true/false 리턴
	data-keyin = "EML"									이메일
	data-keyin = "NUM"									숫자만 입력
	data-keyin = "EML|NUM"								이메일 & 숫자만 입력시
	
ComUtil.validate.isEmail(sParam);						유효한 email인지 체크하여 true/false 리턴
ComUtil.validate.isNum(sParam);							숫자만 있는지 체크하여 true/false 리턴   input에 사용할땐 numberOnly 를 attr로 추가해 사용하길 바람
ComUtil.validate.chkPW(sParam);							영문 / 숫자 / 특수문자 포함여부 및 연속된 문자인지 체크 
ComUtil.validate.stck(str, limit);						str 에 연속된 문자가 있는지 확인 


-- pattern
ComUtil.pettern.acntNo = function(value, type)			계좌번호 패턴 리턴


-- init
ComUtil.keyPad.init										_keypad 가 포함된 인풋박스가 존재하면 앱의 보안키패드를 연결시켜준다.

 */



var ComUtil = {
	
	isNull	: function(sParam){
		if(typeof(sParam) == "number" || typeof(sParam) == "boolean")
			return false;
		
		if(sParam == '' || sParam == null || sParam == undefined || sParam == 'undefined'){
			return true;
		}else{
			return false;
		}
	},
	
	null	: function(sParam, sDefalut){
		if(this.isNull(sParam))
			return sDefalut;
		else 
			return sParam;
	},
	
	moveLink : {},
	
	string : {
		replaceAll : {}
		,dateFormat : {}
		,dateFormatHan : {}
		,hpFormat : {}
		,format : {}
		,convertHtml : {}
		,lpad : {}
		,rpad : {}
		,clipboardCopy : {}
		,isIndexOf : {}
	},
	
	number : {
		addCommmas : {}		// 3자리 단위마다 콤마 생성
		,removeCommmas	: {}
		,setDigitCount	: {}
	},
	
	date	: {
		curDate : {}		// YYYYMMDD24HHMISS  
	},
	
	validate : {
		check	: {}
		,isEmail : {}
		,isNum	: {}
	},
	
	
	pettern	:	{
		acntNo	:	 {}
	},
	
	keyPad	:	{
		init	:	 {}
	},
	
	event	:	{
		touchClosePop	:	 {}
	}
}









ComUtil.moveLink = function(url, bHistory, bDevOnly){
	if(ComUtil.null(bDevOnly, false)){
		// 운영에선 동작하면 안됨.
		if(gfn_isOper()){
			return;
		}
	}
	
	if(url.indexOf("/") == 0){
		
		var now = gfn_getScreenId();

		var newForm = $('<form></form>');
		newForm.attr("name", "moveLink");
		newForm.attr("method", "post");
		newForm.attr("action", url);
		//newForm.attr("target", "_blank");
		
		/*
		paParam = ComUtil.null(paParam, {});
		for(_paParam in paParam){
	    	$form.append($('<input type="hidden" value="'+paParam[_paParam]+'" name="'+_paParam+'">'));
	    }
		*/
		
		newForm.appendTo('body');
		newForm.submit();
		
		window[now] = null;		// 이전화면 정보 삭제
		
		if(ComUtil.null(bHistory, true)){
			// history에 적용
			gfn_pushHitory(location.pathname);
		}
		
	}
	else{
		var inputParam = {};
		inputParam.url 			= url;
		inputParam.screenId 	= "";
		inputParam.objId	 	= '';
		inputParam.inYn		 	= "N";
		inputParam.type		 	= "link";
		
		gfn_otherLinkOpen(inputParam);
	}
}

ComUtil.string.replaceAll = function(value, patten, repatten){
		
	if(ComUtil.isNull(value)){
		return "";
	}
	else{
		return value.split(patten).join(repatten);
	}				
}

ComUtil.string.dateFormat = function(value, patten){
	if(ComUtil.isNull(value)){
		return "";
	}
	if(value.length < 8){
		return value;
	}
	
	
	value = ComUtil.string.replaceAll(ComUtil.string.replaceAll(ComUtil.string.replaceAll(ComUtil.string.replaceAll(value, "년", ""), "월", ""), "일", ""), " ", "");
	
	value = ComUtil.string.replaceAll(ComUtil.string.replaceAll(value, "-", ""), ".", "");
	patten = ComUtil.null(patten, "-");
	
	return value.substring(0, 4) + patten + value.substring(4, 6) + patten + value.substring(6); 
}

ComUtil.string.hpFormat = function(value){
	if(ComUtil.isNull(value)){
		return "";
	}
		
	return value.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3"); 
}

ComUtil.string.dateFormatHan = function(value){
	if(ComUtil.isNull(value)){
		return "";
	}
	value = ComUtil.string.replaceAll(ComUtil.string.replaceAll(value, "-", ""), ".", "");
	
	return value.substring(0, 4) + "년 " + value.substring(4, 6) + "월 " + value.substring(6) + "일"; 
}

ComUtil.string.format = function(value, type){
	if(ComUtil.isNull(value)){
		return "";
	}
	
	switch(type){
		case 'tel' 		: return value.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3");  
			break;
		default			: return "";
			break;
	}
}



/**
 * 좌측문자열채우기
 * @params
 *  - str : 원 문자열
 *  - padLen : 최대 채우고자 하는 길이
 *  - padStr : 채우고자하는 문자(char)
 */
ComUtil.string.lpad = function(str, padLen, padStr) {
    if (padStr.length > padLen) {
        gfn_log("오류 : 채우고자 하는 문자열이 요청 길이보다 큽니다");
        return str;
    }
    str += ""; // 문자로
    padStr += ""; // 문자로
    while (str.length < padLen)
        str = padStr + str;
    str = str.length >= padLen ? str.substring(0, padLen) : str;
    return str;
}

/**
 * 우측문자열채우기
 * @params
 *  - str : 원 문자열
 *  - padLen : 최대 채우고자 하는 길이
 *  - padStr : 채우고자하는 문자(char)
 */
ComUtil.string.rpad = function(str, padLen, padStr) {
    if (padStr.length > padLen) {
        gfn_log("오류 : 채우고자 하는 문자열이 요청 길이보다 큽니다");
        return str + "";
    }
    str += ""; // 문자로
    padStr += ""; // 문자로
    while (str.length < padLen)
        str += padStr;
    str = str.length >= padLen ? str.substring(0, padLen) : str;
    return str;
}

// 클립보드 복사
ComUtil.string.clipboardCopy = function(str) {
	//$('#clip_target').show();
	$('#clip_target').val(ComUtil.null(str, ''));
	$('#clip_target').select();
	document.execCommand("copy");
	//$('#clip_target').hide();
}

// sStr에 tStr이 존재하면 true
ComUtil.string.isIndexOf = function(tStr, sStr) {
	if(sStr.indexOf(tStr) > -1){
		return true;
	}
	else{
		return false;
	}
}					

// 3자리 단위마다 콤마 생성
ComUtil.number.addCommmas = function(value){
	if(ComUtil.isNull(value)){
		value = "";
	}
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 값에서 콤마제거
ComUtil.number.removeCommmas = function(sParam){
	return ComUtil.string.replaceAll(sParam, ",", "");
}

ComUtil.number.setDigitCount = function (selector, numStep, duration){
    var target = Number(ComUtil.number.removeCommmas($(selector).text()));
	if(!ComUtil.isNull($(selector).data('ori'))){
		target = Number(ComUtil.number.removeCommmas($(selector).data('ori')));
	}
	
	if(isNaN(target)){
		target = 0;
	}
	 
    var numNow = 0;
    var numNowComma = '';
    var timerId = 0;
    if(target < numStep){
		numStep = target / 2;
	}
    var step = Math.round(target / numStep);
    var timerSpeed = duration / numStep;
    
    $(selector).text(0);
	if(target == "0"){
		return;
	}

    timerId = setInterval(function(){
        numNow += step;
        $(selector).text(numNow);
        if(numNow > target){
            numNow = target;
            numNowComma = numNow.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
            $(selector).text(numNowComma);
            clearInterval(timerId);
        }else{
            numNowComma = numNow.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
            $(selector).text(numNowComma);
        }
    }, timerSpeed);
}



ComUtil.string.convertHtml = function(value){
	if(ComUtil.isNull(value)){
		return "";
	}
	return value.replace(/(?:\r\n|\r|\n)/g, '<br />');
}


// 패넌에 맞는 스트링 리턴 
ComUtil.date.curDate = function(pattern){
	var result = "";
	var object = moment();
	
	if(ComUtil.isNull(pattern)){
		pattern = "YYYYMMDD";
	}
	
	var m = moment(new Date());
	
	result = m.format(pattern);
	
	return result; 
}

ComUtil.date.curYear = function(){
	return ComUtil.date.curDate('YYYY'); 
}

ComUtil.date.curMonth = function(){
	return ComUtil.date.curDate('MM'); 
}

ComUtil.date.curDay = function(){
	return ComUtil.date.curDate('DD'); 
}

// required, data-keyin attr 에 셋팅된 유효성 체크 진행
ComUtil.validate.check = function(objSection){
	var result = true;
	var inputObj = null; 
	
	if(ComUtil.isNull(objSection)){
		inputObj = $('[required]'); 
	}
	else{
		inputObj = $('[required]', objSection);
	}
	
		
	/*필수값 체크 s*/
	$(inputObj).each(function(){
		var value = $(this).val();
		var title = jQuery("label[for='"+$(this).attr("id")+"']").text();
		
		if(ComUtil.isNull(title)){
			title = $(this).attr("title");
		}
		if(ComUtil.isNull(title)){
			title = $(this).attr("placeholder");
		}
		
		if(ComUtil.isNull(value)){
	        result = false;
	        //gfn_alertMsgBox(title+"는 필수 입력입니다.", "필수값 체크");
	        gfn_alertMsgBox(title+"는(은) 필수 입력입니다.", '', function(){
	        	$(this).focus();
			});
	        return false;
		}
	});
	
	
	if(!result){
		return result;
	}
	/*필수값 체크 e*/
	
	
	
	/*data-keyin s*/
	if(ComUtil.isNull(objSection)){
		inputObj = $('[data-keyin]'); 
	}
	else{
		inputObj = $('[data-keyin]', objSection);
	}	
	
	$(inputObj).each(function(){
		var filter = $(this).attr('data-keyin');
		if(!filter) {
			result = false;
			return false;
		}
		
		
		var value = $(this).val();
		var title = jQuery("label[for='"+$(this).attr("id")+"']").text();
		
		if(ComUtil.isNull(title)){
			title = $(this).attr("title");
		}
		if(ComUtil.isNull(title)){
			title = $(this).attr("placeholder");
		}
		
		if(filter.indexOf("EML") > -1){
			if(!ComUtil.validate.isEmail(value)){
            	$(this).focus();
				result = false;
            	gfn_alertMsgBox("올바른 이메일을 읿력 해주시길 바랍니다.");
				return false;
			}
		}
		
		if(filter.indexOf("NUM") > -1){
			if(!ComUtil.validate.isNum(value)){
            	$(this).focus();
				result = false;
            	gfn_alertMsgBox(title+" 숫자만 입력바랍니다.");
				return false;
			}
		}
		
		// 통합연금포털 아이디  영문으로 시작해야 하며 영문 + 숫자 조합
		if(filter.indexOf("IDLIFE") > -1){
			var inputParam = {};
			inputParam.value = value;
			inputParam.site = 'lifeplan';
			inputParam.minLength = ComUtil.null($(this).attr('minLength'), 8);
			inputParam.maxLength = ComUtil.null($(this).attr('maxLength'), 20);
			
			var resultParam = ComUtil.validate.chkId( inputParam );
			if( !resultParam.pass ) {
				result = false;
        		gfn_alertMsgBox(title + " " + resultParam.msg, '', function(){});
				return false;
			}
			
			/*var idReg = /^(?=.*[0-9]+)[a-zA-Z][a-zA-Z0-9]{5,16}$/g;
			if( !idReg.test( value ) ) {
				//gfn_log("영문으로 시작해야 하며 영문 + 숫자 조합 이어야 합니다.");
				result = false;
        		gfn_alertMsgBox(title+ "길이는 최소 6, 최대 16 영문으로 시작해야 하며 영문 + 숫자 조합 이어야 합니다.", '', function(){});
				return false;
			}*/
		}
		
		// 통합연금포털 패스워드  영문으로 시작해야 하며 영문 + 숫자 조합
		/*
		if(filter.indexOf("PWDLIFE") > -1){
			var inputParam = {};
			inputParam.value = value;
			inputParam.minLength = ComUtil.null($(this).attr('minLength'), 8);
			inputParam.maxLength = ComUtil.null($(this).attr('maxLength'), 20);
			
			var resultParam = ComUtil.validate.chkPW( inputParam );
			if( !resultParam.pass ) {
				result = false;
        		gfn_alertMsgBox(title + " " + resultParam.msg, '', function(){});
				return false;
			}
		}
		*/

		
		gfn_log(filter);
	});
	/*data-keyin e*/
	
	return result;
}

ComUtil.validate.isEmail = function(sParam){
	var email = sParam;
    var exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    if(exptext.test(email)==false){
        //이메일 형식이 알파벳+숫자@알파벳+숫자.알파벳+숫자 형식이 아닐경우            
        //gfn_alertMsgBox("이메일형식이 올바르지 않습니다.");
        return false;
    };
    return true;
}


ComUtil.validate.isNum = function(sParam){
	if(ComUtil.isNull(sParam)){return true;}
	return $.isNumeric( sParam );
}


ComUtil.validate.chkId = function(sParam){
	var idReg = '';
	
	var result = {};
	result.msg = '';
	
	var id = sParam.value;
	
	// 길이체크 
	if(id.length < sParam.minLength || id.length > sParam.maxLength){
		result.msg = sParam.minLength + "자리 ~ "+ sParam.maxLength +"자리 이내로 입력해주세요.";
		result.pass = false;
		return result;
	}
	
	// 통합연금포털
	if(sParam.site == 'lifeplan'){
		//idReg = /^(?=.*[0-9]+)[a-zA-Z][a-zA-Z0-9]{5,16}$/g;	// 영문시작   영문+숫자 입력 가능 
		idReg = new RegExp("^[a-zA-Z]+[a-zA-Z0-9]{"+(parseInt(sParam.minLength)-1)+","+(parseInt(sParam.maxLength))+"}$");
		//idReg = new RegExp("^(?=.*[0-9]+)[a-zA-Z][a-zA-Z0-9]{"+(parseInt(sParam.minLength)-1)+","+(parseInt(sParam.maxLength))+"}$");
		//idReg = new RegExp("^(?=.*[0-9]+)[a-zA-Z][a-zA-Z0-9]{"+(parseInt('6')-1)+","+(parseInt('20')-1)+"}$");
		//idReg = new RegExp("^(?=.*[0-9]+)[a-zA-Z][a-zA-Z0-9]{"+(parseInt(sParam.minLength)-1)+","+(parseInt(sParam.maxLength)-1)+"}$");		// 영문시작, 영문 + 숫자  조합(하나라도 포함)
		//result.msg = "길이는 최소 "+sParam.minLength+", 최대 "+sParam.maxLength+",</br>영문으로 시작해야 하며,</br>영문 + 숫자 조합 이어야 합니다.";
		result.msg = "영문으로 시작해야 하며,</br>영문 + 숫자 조합 이어야 합니다.";
	}
	
	
	result.pass = idReg.test( id );
	
	return result;
}

ComUtil.validate.chkPW = function(sParam){

	var pw = sParam.value;
	var num = pw.search(/[0-9]/g);
	var eng = pw.search(/[a-z]/ig);
	var spe = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
	
	var result = {};
	var msg = "";
	
	if(pw.length < sParam.minLength || pw.length > sParam.maxLength){
		result.msg = sParam.minLength + "자리 ~ "+ sParam.maxLength +"자리 이내로 입력해주세요.";
		result.pass = false;
	}else if(pw.search(/\s/) != -1){
		result.msg = "비밀번호는 공백 없이 입력해주세요.";
		result.pass = false;
	}else if(num < 0 || eng < 0 || spe < 0 ){
		result.msg = "영문,숫자, 특수문자를 혼합하여 입력해주세요.";
		result.pass = false;
	}else if(/(\w)\1\1/.test(pw)){
		result.msg = '같은 문자를 3번 이상 사용하실 수 없습니다.';
		result.pass = false;
	}else if(!ComUtil.validate.stck(pw, 3)){
		result.msg = '연속된 3자리 문자는 사용하실 수 없습니다.';
		result.pass = false;
	}else{
		result.pass = true;
	}
	
	return result;

}


/*********************************************************************************************
 *  Function명 : stck()
 *  설명       : 연속된 문자 체크 (비밀번호 체크용)
*********************************************************************************************/
ComUtil.validate.stck = function(str, limit) {
 
    var o, d, p, n = 0, l = limit == null ? 3 : limit;
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (i > 0 && (p = o - c) > -2 && p < 2 && (n = p == d ? n + 1 : 0) > l - 3) 
            return false;
            d = p, o = c;
    }
    return true;
}




ComUtil.pettern.acntNo = function(value, type){
	var result = "";
	
	if(ComUtil.isNull(value) || value.startsWith("null")){
		return result;
	}
	
	value = ComUtil.string.replaceAll(value, '-', '');
	
	type = ComUtil.null(type, 1);
	if (type == 0) {
		result = value.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-*****');
	} 
	else {
		if(value.length == 10){
			result = value.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
		}
		else if(value.length == 11){
			result = value.replace(/(\d{3})(\d{3})(\d{5})/, '$1-$2-$3');
		}
		else if(value.length == 12){
			result = value.replace(/(\d{4})(\d{3})(\d{5})/, '$1-$2-$3');
		}
		else if(value.length == 13){
			result = value.replace(/(\d{4})(\d{3})(\d{6})/, '$1-$2-$3');
		}
		else if(value.length == 14){
			result = value.replace(/(\d{6})(\d{2})(\d{6})/, '$1-$2-$3');
		}
		else{
			result = value;
		}
	}
	
	return result;
}



ComUtil.keyPad.init = function(screenId){
	//alert("ComUtil.keyPad.init start!!" + screenId);
	if(ComUtil.isNull(screenId)){
		screenId = gfn_getScreenId();
	}
	
	if(typeof screenId != 'string'){
		gfn_log('화면아이디를 넘겨야 합니다.');
		return false;
	}
	
	
	var screenObj = window[screenId];
	if($('[keypad="W"][keyon!="Y"]').length == 0){
		return;
	}
	
	
	// 대상 찾기
	var keyEvnets = {};
	$.each($('[keypad="W"][keyon!="Y"]'), function(index, item){
		
		var encryptYn = $(this).data('encrypt');
		var id = $(this).attr('id');
		var valueId = "";
		if(encryptYn == "N"){
			valueId = id;
		}
		else{
			valueId = ComUtil.string.replaceAll(id, '_keypad', '');
			$(this).after('<input type="hidden" id="'+valueId+'">');
		}
		
		keyEvnets['click #'+id] = screenId+'.event.callKeyPad';
		keyEvnets['change #'+valueId] = screenId+'.event.changeKeyPad';
	});
	
	
	// 이벤트 셋팅
	screenObj.events = $.extend({}, screenObj.events, keyEvnets);
	
	
	// click 이벤트 생성
	screenObj['event']['callKeyPad'] = function(e){
		e.preventDefault();
		$(this).val('');
		
		$('li' , $(this)).removeClass('is_active'); // 다시 호출시 이전 선택된 이미지 초기화 
		
		gfn_log('event.callKeyPad!!!!');
		
		var encryptYn = $(this).data('encrypt');
		var id = $(this).attr('id');
		var valueId = "";
		if(encryptYn == "Y"){
			valueId = ComUtil.string.replaceAll(id, '_keypad', '');
			$('#'+valueId).val('');
		}
		//InputMethodManager manager = (InputMethodManager)getSystemService(INPUT_METHOD_SERVICE);
		//manager.hideSoftInputFromWindow(getCurrentFocus().getWindowToken(), InputMethodManager.HIDE_NOT_ALWAYS);
		
		//alert("click!!! " + $(this).attr('id'));
		gfn_callKeyPad(this);	// 네이티브 키패드 호출
	}
	
	// chagne 이벤트 생성  (첫번째 변경시) 
	screenObj['event']['changeKeyPad'] = function(e){
		e.preventDefault();
		
		gfn_log('changeKeyPad call!!!!');
		
		var id = $(this).attr('id');
		if(id.indexOf('_re') == -1){
			var reId = id + '_re';
			
			$('#'+reId+'_keypad').val('');
			$('#'+reId).val('');
		}
	}
	
	// callback 함수 생성
	//if( $.type(screenObj['callBack']['keyPad']) === 'function'){
	//	screenObj.callBack.keyPad(result);
	//}
}


ComUtil.event.touchClosePop = function(screenId, sectionId){
	return;
	
	/*if(typeof screenId != 'string'){
		gfn_log('화면아이디를 넘겨야 합니다.');
		return false;
	}
	
	
	var screenObj = window[screenId];
	if($('#'+sectionId).length == 0){
		return;
	}
	
	$('#'+sectionId).bind('touchstart',function(event){
        //event.preventDefault();
        var e = event.originalEvent;
        screenObj.variable.startTouchX = e.targetTouches[0].pageX;
    });
    $('#'+sectionId).bind('touchmove',function(event){
        //event.preventDefault();
        var e = event.originalEvent;
        screenObj.variable.moveTouchX = e.targetTouches[0].pageX;
    });
    
    $('#'+sectionId).bind('touchend',function(event){
        if(screenObj.variable.moveTouchX - screenObj.variable.startTouchX >50){
			gfn_closePopup();
        }
    });*/
}

