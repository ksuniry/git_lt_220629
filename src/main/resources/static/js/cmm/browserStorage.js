var JsEncrypt = {
	 jsPrivateKey : CryptoJS.enc.Utf8.parse('WEALTHGUIDE_2019')
	,jsPrivateIve : CryptoJS.enc.Utf8.parse('WEALTHGUIDE_2019')
	,module : CryptoJS.AES
}


//window.sStorage = window.sessionStorage || (function() {
window.sStorage = (function() {
	var winObj = opener || window; //opener가 있으면 팝업창으로 열렸으므로 부모 창을 사용
	var data = JSON.parse(winObj.top.name || '{}');
	var fn = {
		length : Object.keys(data).length,
		isStorage : function() {
			var isRet = false;
			if( 'sessionStorage' in window ) {isRet = true;}
			return isRet;
		},
		encrypt : function(strObj){
			var encrypted = strObj;
			if(JsEncrypt.module && strObj){
				encrypted = JsEncrypt.module.encrypt(strObj, JsEncrypt.jsPrivateKey,{iv:JsEncrypt.jsPrivateIve});
			}
			//gfn_log("encrypt strObj : " + strObj + ", " + encrypted);
			return encrypted + "";
		},
		decrypt : function(strObj){
			if(ComUtil.isNull(strObj)){
				gfn_log("decrypt str is null!!! ");
				return '';
			}
			var decrypted = strObj;
			if(JsEncrypt.module && strObj){
				decrypted = JsEncrypt.module.decrypt(strObj, JsEncrypt.jsPrivateKey,{iv:JsEncrypt.jsPrivateIve}).toString(CryptoJS.enc.Utf8);
				//decrypted = JsEncrypt.module.decrypt(strObj, JsEncrypt.jsPrivateIve).toString(CryptoJS.enc.Utf8);
			}
			//gfn_log("decrypt strObj : " + strObj + ", " + decrypted);
			return decrypted;
		},
		/*
		setItem : function(key, value) {
			if(this.isStorage()){
				sessionStorage.setItem(key, JSON.stringify(value));
			}
		},
		getItem : function(key) {
			var value = sessionStorage.getItem(key);
			return value ? JSON.parse(value) : "";
		},
		*/
		setItem : function(key, value) {
			//gfn_log("setItem key :: " + key);
			if(this.isStorage()){
				if(gfn_isLocal()){
					sessionStorage.setItem(key, JSON.stringify(value));
				}
				else{
					sessionStorage.setItem(this.encrypt(key), this.encrypt(JSON.stringify(value)));
				}
			}
		},
		getItem : function(key) {
			//gfn_log("getItem key :: " + key);
			var value = "";
			if(this.isStorage()){
				if(gfn_isLocal()){
					value = sessionStorage.getItem(key);
				}
				else{
					value = this.decrypt(sessionStorage.getItem(this.encrypt(key)));
				}
			}
			return !ComUtil.isNull(value) ? JSON.parse(value) : "";
		},
		key : function(idx) {
			return Object.keys(data)[idx] || null; //Object.keys() 는 IE9 이상을 지원하므로 IE8 이하 브라우저 환경에선 수정되어야함
		},
		removeItem : function(key) {
			delete data[key];
			winObj.top.name = JSON.stringify(data);
			fn.length--;
		},
		clear : function() {
			//winObj.top.name = '{}';
			//fn.length = 0;
			var accessToken 	= this.getItem('accessToken');
			var refreshToken 	= this.getItem('refreshToken');
			var gHistoryArr 	= this.getItem('gHistoryArr');
			var gCurPopupId 	= this.getItem('gCurPopupId');
			var gPopupScreenArr	= this.getItem('gPopupScreenArr');
			var gMenuInfo 		= this.getItem('gMenuInfo');
			var gUserInfo 		= this.getItem('gUserInfo');
			var homeUrl 		= this.getItem('homeUrl');
			var appVer 			= this.getItem('appVer');
			sessionStorage.clear();
			this.setItem('refreshToken', 	refreshToken);
			this.setItem('accessToken', 	accessToken);
			this.setItem('gHistoryArr', 	gHistoryArr);
			this.setItem('gCurPopupId', 	gCurPopupId);
			this.setItem('gPopupScreenArr',	gPopupScreenArr);
			this.setItem('gMenuInfo',		gMenuInfo);
			this.setItem('gUserInfo', 		gUserInfo);
			this.setItem('homeUrl', 		homeUrl);
			this.setItem('appVer',	 		appVer);
		}
	};
	return fn;
})();