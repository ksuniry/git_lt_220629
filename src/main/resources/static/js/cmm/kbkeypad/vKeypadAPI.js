var vKeypadAPI = {

	_this:null,

	url : "https://viewapi.kbsec.com",
	service : "/common/vKeypadAPI.jsp",
	servlet : "/servlets/vKeypad.do",
	imagePath : "/js/plugins/kings/images_M_KB_AC/",
	kncGubun : "NUMBERPAD_M_KB_AC",
	account: "",
	keyInstances:[],
	option:null,
	errorPage:"",


	/**
	 * 가상키패드 암호화된 입력값을 리턴한다.
	 */
	getVKPadData : function() {
		var vkpadData = {};
		if ($('input[knc_etoe]').length > 0 && $('input[knc_etoe]:eq(0)').parents("form").length > 0) {

			// 가상 키패드 암호문 추가
			vKeypadGlobal.prepareSubmitAll();

			//가상 키패드 암호문 전송데이터에 첨부
			$("input[name^='VKPad']").each(function() {
				vkpadData[$(this).attr("name")] = $(this).val();
			});
		}
		return vkpadData;
	},

	/**
	 * 가상키패드 사용 객체 초기화
	 */
	initVKPad : function(o) {

		_this = this;

		_this.option = {
				"onloadCallback" : null,
				"showCallback" : null,
				"hideCallback" : null,
				"doneCallback" : null
			};

		$.extend(this.option, o);

		if ($('input[knc_etoe]').length > 0) {
			gfn_log("가상키패드 사용 객체 발견 : " + ($('input[knc_etoe]').length) + "개");

			if ($("[id^=VKPad]").parent().length > 0) {
				$("[id^=VKPad]").parent().remove();
			}
			
			if ($('input[knc_etoe]:eq(0)').parents("form").length == 0) {
				gfn_log("form으로 감싼다.");
				$('input[knc_etoe]:eq(0)').parents(".container>div").wrap("<form autocomplete='off' />"); // .container 가 붙이는 화면에 존재해야함.. ㄷㄷ  
			}

			$.ajax({
				type: "POST",
				url: vKeypadAPI.url + vKeypadAPI.service + "?type=key",
				success:function (data, status,jqXHR) {

					vKeypadAPI.key = $.trim(data);

					// 가상 키패드 서블릿 경로 설정
					vKeypadGlobal.setDefaultServletURL( vKeypadAPI.url + vKeypadAPI.servlet + ';jsessionid=' + vKeypadAPI.key);

					if ( _this.keyInstances != null)
						_this.keyInstances = null;
					_this.keyInstances = []

					//키패드 등록
					$('input[knc_etoe]').each(function(index, item){
						var knc_gubun = vKeypadAPI.kncGubun;
						if (vKeypadAPI.isEmpty($(item).attr('name'))) {
							$(item).attr('name', $(item).attr('id'));
						}

						_this.keyInstances.push(item);
						vKeypadGlobal.newInstance($(item).closest('form')[0] , item, null, knc_gubun, $(item).attr('maxlength'), null);
					})

					// keypad 이미지경로 지정
					vKeypadGlobal.setOptionAll('ImagesRoute_pop', vKeypadAPI.url + vKeypadAPI.imagePath);

					//모바일에서 처리
					vKeypadGlobal.setOptionAll('isMobile',true);

					if (_this.option.showCallback != null) {
						vKeypadGlobal.setOptionAll('showCallback', function(e) {
							_this.option.showCallback();
						});
					}

					if (_this.option.hideCallback != null) {
						vKeypadGlobal.setOptionAll('hideCallback', function(e) {
							_this.option.hideCallback();
						});
					}

					if (_this.option.doneCallback != null) {
						vKeypadGlobal.setOptionAll('doneCallback', function(){

							var param = vKeypadAPI.getVKPadData();

							if ( vKeypadAPI.account == "" ) {
								param["type"] 	 = "enc";
							} else {
								param["type"] 	 = "etoe";
								param["account"] = vKeypadAPI.account;
							}

							$.ajax({
								type: "POST",
								url: vKeypadAPI.url + vKeypadAPI.service + ";jsessionid=" + vKeypadAPI.key ,
								data: param,
								success:function (data, status,jqXHR) {
									
									_this.option.doneCallback($.trim(data));
								},
								error:function (jqXHR, status, err) {
									gfn_log("error");
								}
							});
						});
					}

					_this.loadKeyInstances(0);
				},
				error:function (jqXHR, status, err) {
					gfn_alertMsgBox('현재 [KB증권]과의 통신문제로 계좌개설을 진행 할 수 없습니다. 잠시후 다시 시도해주세요.', '', function(){
						ComUtil.moveLink(vKeypadAPI.errorPage, false);
					});
				}
			});




		} else {
			//console.info("가상키패드 사용 객체가 없습니다.");
		}
	},

	loadComplete : function() {
		//초기화완료 이벤트 처리
		if (vKeypadAPI.isNotEmpty(_this.option.onloadCallback) && typeof _this.option.onloadCallback =="function") {
			var vkeypadCheckInterval = setInterval(function(){
				if ($("[id^=VKPad]").length > 0) {
					try {
						_this.option.onloadCallback();
					} catch(e) {
						console.error("error by vKeypadAPI.initVKPad.onloadCallback() : " + e);
					}
					clearInterval(vkeypadCheckInterval);
				}
			}, 50);
		}
	},

	loadKeyInstances : function  ( index ) {
		var keyInstance =  vKeypadGlobal.getInstance ( _this.keyInstances[index] );
		if ( keyInstance != null ) {
			keyInstance.load(function(){
				if ( index < _this.keyInstances.length )
					_this.loadKeyInstances( ++index )
				else
					_this.loadComplete();
			});
		}
		else
			_this.loadComplete();
	},

	/**
	 * NULL 여부 체크
	*/
	isEmpty : function(value) {
		var rtnValue = false;
		if (typeof value != "object") {
			if (typeof value == "number" && !isNaN(Number(value)) || typeof value == "string") {
				value = value + "";
			}
		}

		var strLen = 0;
		if (typeof value == "string") {
			value = value.trim();
			if (value == "null") {
				rtnValue = true;
			} else {
				strLen = value.length;
			}

		} else if (Array.isArray(value)) {
			strLen = value.length;

		} else if (typeof value == "object") {
			var cnt = 0;
			for ( var i in value) {
				cnt++;
			}
			strLen = cnt;

		} else if (typeof value == "boolean") {
			strLen = 1;
		}

		if (strLen == 0) {
			if (vKeypadAPI.isFunction(value)) {
				rtnValue = false;
			} else {
				rtnValue = true;
			}
		} else {
			rtnValue = false;
		}
		return rtnValue;
	},

	/**
	 * 함수 존재 여부 체크
	*/
	isFunction : function(_checkFunc) {
		try {
			var getType = {};
			return _checkFunc && getType.toString.call(_checkFunc) === '[object Function]';
			return false;
		} catch (e) {
			console.error("[vKeypadAPI.isFunction] Exception :: ", e);
		}
	},

	/**
	 * NOT NULL 여부 체크
	*/
	isNotEmpty : function(value) {
		return !vKeypadAPI.isEmpty(value);
	},

	/**
	 * 숫자 여부 체크
	*/
	isNumber : function(value) {
		try {
			var sReturnValue = false;
			if (typeof value == "number") {
				return true;
			}
			if (typeof value == "string") {
				var reg = new RegExp('^[0-9]+$');
				var iBit = value.charAt(0);
				if ((iBit == "-" || iBit == "+") && value.substr(1, 1) != ".") {
					value = value.substr(1);
				}
				var len = value.split(".").length;
				if (len == 1) {
					if (reg.test(value.split(".")[0])) {
						return true;
					} else {
						return false;
					}
				} else if (len == 2) {
					var num1 = value.split(".")[0];
					var num2 = value.split(".")[1];
					if (reg.test(num1) && reg.test(num2)) {
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			}

			var iBit;
			for (var i = 0; i < value.length; i++) {
				iBit = value.charAt(i);
				if (i == 0) {
					if (!isNaN(parseInt(iBit))
							|| (iBit == "-" && value.substr(1, 1) != ".")
							|| (iBit == "+" && value.substr(1, 1) != ".")) {
						sReturnValue = true;
					} else {
						sReturnValue = false;
						break;
					}
				} else {
					if (!isNaN(parseInt(iBit))
							|| (iBit == "." && vKeypadAPI.isNull(value.substr(
									i + 1, 1))) === false) {
						sReturnValue = true;
					} else {
						sReturnValue = false;
						break;
					}
				}
			}
			return sReturnValue;
		} catch (e) {
			console.error("[vKeypadAPI.isNumber] Exception :: ", e);
		}
	}

};