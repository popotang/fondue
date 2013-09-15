(function($, _aoWin, _aoUndefined) {
	// html encode
	$.htmlEncode = function(_asStr) {
		return _asStr && _asStr.replace ? (_asStr.replace(/&/g, "&amp;").replace(/\"/g, "&quot;")
			.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\'/g, "&#39;")) : _asStr;
	};

	$.htmlDecode = function(_asStr) {
		return _asStr && _asStr.replace ? (_asStr.replace(/&nbsp;/gi, " ").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
			.replace(/&quot;/gi, "\"").replace(/&#39;/gi, "'").replace(/&amp;/gi, "&")
		) : _asStr;
	}

	$.hrefEncode = function(_asStr) {
		if (document.lang == "zh_CN") {
			return _asStr.replace(/(((http|https|ftp):\/\/)|www\.)[-\w.]+(:\d+)?(\/([\w\/_=.%-~]*(\?[^\s\u4e00-\u9fa5]+)?)?)?(#[\d\w_-]+)?/ig, function() {
				var url = arguments[0],
					account = WebMM.model("account"),
					href = "/cgi-bin/mmwebwx-bin/webwxcheckurl?" + "uin=" + account.getUin() + "&sid=" + encodeURIComponent(account.getSid()) + "&skey=" + encodeURIComponent(account.getSkey()) + "&deviceid=" + encodeURIComponent(WebMM.getDeviceId()) + "&opcode=2&requrl=" + encodeURIComponent((url.indexOf("http") == 0 ? "" : "http://") + $.clearHtmlStr(url)) + "&scene=1&username=" + account.getUserName();
				return '<a target="_blank" href="' + href + '">' + url + '</a>'
			});
		} else {
			return _asStr.replace(/(((http|https|ftp):\/\/)|www\.)[-\w.]+(:\d+)?(\/([\w\/_=.%-~]*(\?[^\s\u4e00-\u9fa5]+)?)?)?(#[\d\w_-]+)?/ig, function() {
				return '<a target="_blank" href="' + (arguments[0].indexOf("http") == 0 ? "" : "http://") + $.clearHtmlStr(arguments[0]) + '">' + arguments[0] + '</a>'
			});
		}
	}

	$.isUrl = function(_asStr) {
		return /(((http|https|ftp):\/\/)|www\.)[-\w.]+(:\d+)?(\/([\w\/_=.%-~]*(\?[^\s\u4e00-\u9fa5]+)?)?)?(#[\d\w_-]+)?/ig.test(_asStr);
	}

	// let str come to reg exp
	$.regFilter = (function() {
		var _sExprFilter = /([\^\.\[\$\(\)\|\*\+\?\{\\])/ig;
		return function(_asRegExpStr) {
			return _asRegExpStr.replace(_sExprFilter, "\\$1");
		}
	})();

	$.getAsciiStr = function(_asStr) {
		return (_asStr || "").replace(/\W/g, "");
	}

	/**
	 * 清除字符中的HTML
	 * @param {String} _asStr
	 * @return {String}
	 */
	$.clearHtmlStr = function(_asStr) {
		return _asStr ? _asStr.replace(/<[^>]*>/g, "") : _asStr;
	}

	$.clearLinkTag = function(_asStr) {
		return _asStr ? _asStr.replace(/<a[^>]*>/g, "") : _asStr;
	}

	/**
	 * 格式化数字，把数字格式化为大于等于_anFormatLen的长度
	 * 当_anNum的位数没有_anFormatLen长，就补0
	 * 超过就不处理
	 * @param {Number} _anNum
	 * @param {Number} _anFormatLen
	 * @return {String}
	 */
	$.formatNum = function(_anNum, _anFormatLen) {
		var _sNum = (isNaN(_anNum) ? 0 : _anNum).toString(),
			_nPlusLen = _anFormatLen - _sNum.length;
		return _nPlusLen > 0 ? [new Array(_nPlusLen + 1).join("0"), _sNum].join("") : _sNum;
	}

	/**
	 * 格式化数字，保留N位小数，并加入,号
	 * @param {Number} _anNum 要格式化的数字
	 * @param {Number} _anN 保留小数位
	 * @return {String}
	 */
	$.numToStr = function(_anNum, _anN) {
		var _sNum = String(_anNum.toFixed(_anN));
		var re = /(-?\d+)(\d{3})/;
		while (re.test(_sNum)) {
			_sNum = _sNum.replace(re, "$1,$2");
		}
		return _sNum;
	}

	/**
	 * 转化一个整数为 HH:MM:SS 的形式。如50 -> 00:00:50
	 */
	$.numToTimeStr = function(_anNum, _asPattern) {
		return $.tmpl(_asPattern, {
			SS: $.formatNum(parseInt(_anNum) % 60, 2),
			MM: $.formatNum(parseInt(_anNum / 60) % 60, 2),
			HH: $.formatNum(parseInt(_anNum / 3600) % 60, 2)
		});
	}

	/**
	 * 格式化输出日期
	 * @param {Object} _aoDate Date日期对象，默认为当前的日期
	 * @param {String} _asPattern 字符串格式，例如：YYYY-MM-DD hh:mm:ss
	 * @return {String}
	 */
	$.formatDate = function(_aoDate, _asPattern) {
		var _oDate = (_aoDate instanceof Date) ? _aoDate : new Date(_aoDate),
			_fFormatFunc = $.formatNum;
		return _asPattern.replace(/YYYY/g, _fFormatFunc(_oDate.getFullYear(), 4))
			.replace(/MM/g, _fFormatFunc(_oDate.getMonth() + 1, 2))
			.replace(/DD/g, _fFormatFunc(_oDate.getDate(), 2))
			.replace(/hh/g, _fFormatFunc(_oDate.getHours(), 2))
			.replace(/mm/g, _fFormatFunc(_oDate.getMinutes(), 2))
			.replace(/ss/g, _fFormatFunc(_oDate.getSeconds(), 2));
	}

	$.endsWith = function(_asStr, suffix) {
		return _asStr.indexOf(suffix, _asStr.length - suffix.length) !== -1;
	};

	/**
	 * 获得字符串的asii长度
	 * 也就是说1个中文算2个字符
	 * @param {String} _asStr
	 * @return {Number}
	 */
	$.getAsiiStrLen = function(_asStr) {
		return (_asStr || "").replace(/[^\x00-\xFF]/g, "aa").length;
	}

	$.stripStr = function(_asStr, _anLen) {
		var idx = 0,
			i, len;

		for (i = 0, len = _asStr.length; i < len && idx < _anLen; i++) {
			if (_asStr.charCodeAt(i) < 128) {
				idx++;
			} else {
				idx += 2;
			}
		}

		return _asStr.substr(0, i);
	}

	/**
	 * 把字符串截取到规定长度
	 * @param {String} _asStr
	 * @param {Number} _anLen
	 * @param {String} _asPlus 截取后的额外显示，例如...
	 * @param {Boolean} _abHtml, true表示_asStr是html，那么如&gt;当作一个字符
	 * @return {String}
	 */
	$.subAsiiStr = function(_asStr, _anLen, _asPlus, _abHtml) {
		var _fDumb = function(_asText) {
			return _asText
		},
			_fOutput = _abHtml ? htmlEncode : _fDumb,
			_sStr = (_abHtml ? htmlDecode : _fDumb)($.trim((_asStr || "").toString())),
			_sPlus = _asPlus || "",
			_nCutLen = Math.max(_anLen - _sPlus.length, 1),
			_nStrLen = _sStr.length,
			_nCountLen = 0,
			_nCutPos = -1,
			_nCharCode;

		for (var i = 0; i < _nStrLen; i++) {
			_nCharCode = _sStr.charCodeAt(i);
			// asii -> 1 ( # W -> 1.3 )
			// not asii -> 1.5
			_nCountLen += _nCharCode == 35 || _nCharCode == 87 ? 1.2 : (_nCharCode > 255 ? 1.5 : 1);

			if (_nCutPos == -1 && _nCountLen > _nCutLen) {
				_nCutPos = i;
			}

			if (_nCountLen > _anLen) {
				return _fOutput(_sStr.substr(0, _nCutPos)) + _sPlus;
			}
		}

		return _fOutput(_sStr);
	}

	$.parseURLParam = function(_asUrl) {
		var _nIdx = _asUrl.indexOf("?"),
			_sQueryStr = _nIdx > -1 ? _asUrl.slice(_nIdx + 1) : "",
			_oQueryObj = {};

		if (_sQueryStr) {
			$(_sQueryStr.split("&")).each(function(_asKey, _asParam) {
				var _oPair = _asParam.split("=");
				_oPair.length == 2 && (_oQueryObj[_oPair[0]] = _oPair[1]);
			});
		}

		return _oQueryObj;
	};

	$.isArr = Array.isArray || function(_aoObj) {
		return Object.prototype.toString.call(_aoObj) == "[object Array]";
	}
	$.isObj = function(_aoObj) {
		return typeof _aoObj === "object";
	}

	/*	
    $.deepURIEncode = function (_avData)
	{
		var _oSelf = this;
		
		if (_oSelf.isArr(_avData) || _oSelf.isObj(_avData))
		{
			for (var name in _avData)
			{
				if (name.charAt(0) != "_") // 不能为私有
				{
					_avData[name] = _oSelf.deepURIEncode(_avData[name]);
				}
			}

			return _avData;
		}
		else if (typeof _avData == "string")
		{
			return encodeURIComponent(_avData.trim());
		}
		return _avData;
	};
    */

	var _iFlashTimer = 0,
		_sRawTitle = document.title;

	$.flashTitle = function(_asTxt) {
		if (_aoWin.qplus && _aoWin.qplus.window.flashWindow) {
			qplus.window.flashWindow();
		}
		clearInterval(_iFlashTimer);
		document.title = _asTxt;
		_iFlashTimer = setInterval(function() {
			document.title = (document.title == _sRawTitle) ? _asTxt : _sRawTitle;
		}, 1500);
	}

	$.stopFlashTitle = function() {
		clearInterval(_iFlashTimer);
		setTimeout(function() {
			document.title = _sRawTitle;
		}, 1000);
	}

	$.form = function(_asUrl, _aoData) {
		var _oData = _aoData || {},
			_oForm$ = $(document.createElement('form'));
		_oForm$.attr("method", "post").attr("action", _asUrl);
		for (var key in _oData) {
			_oForm$.append('<input type="hidden" name="' + key + '" value="' + _oData[key] + '">');
		}
		document.body.appendChild(_oForm$[0]);
		_oForm$.submit();
	}

	// 获取form当中的参数
	$.fn.getFormParam = function() {
		var _oSelf = this,
			_oResult = {};
		if (_oSelf.size()) {
			["input", "textarea", "select"].forEach(function(_asTag) {
				_oSelf.find(_asTag).forEach(function(_aoDom) {
					if (_aoDom.name && (_aoDom.type != "radio" && _aoDom.type != "checkbox" || _aoDom.checked)) {
						_oResult[_aoDom.name] = (_aoDom.value || "").trim();
					}
				});
			});
		}

		return _oResult;
	};

	$.extend2 = function() {
		var _oObj = {};
		for (var i = 0, len = arguments.length; i < len; i++) {
			$.extend(_oObj, arguments[i]);
		}
		return _oObj;
	};

	$.safe = function(_afFunc, _aoArgs, _aoContext) {
		try {
			_afFunc && _afFunc.apply(_aoContext || this, _aoArgs || []);
			return 0;
		} catch (e) {
			Log.e("JS Function: $.safe, e.stack: " + e.stack);
			return -1;
		}
	};

	$.getCookie = function(_asName) {
		return (new RegExp(["(?:; )?", $.regFilter(_asName), "=([^;]*);?"].join("")))
			.test(document.cookie) && decodeURIComponent(RegExp["$1"]);
	};

	$.fn.insertTextToInput = function(_asTxt) {
		var _oInput = this[0];

		if (document.selection) {
			_oInput.focus();
			document.selection.createRange().text = _asTxt;

		} else if (typeof _oInput.selectionStart == "number") {
			var _cur = _oInput.selectionStart,
				_tmpVal = _oInput.value;
			_oInput.value = _tmpVal.substr(0, _oInput.selectionStart) + _asTxt + _tmpVal.substr(_oInput.selectionEnd);
			_oInput.selectionStart = _oInput.selectionEnd = _cur + _asTxt.length;

		} else {
			_oInput.value += _asTxt;
		}

		return this;
	}

	$.clone = function(_aoObj) {
		var _oWrap = {
			v: _aoObj
		};
		var _oResult = $.extend(true, {}, _oWrap).v;
		return _oResult;
	}

	$.getExt = function(_asFileName) {
		return _asFileName.substr(_asFileName.lastIndexOf(".") + 1).toLowerCase();
	}

	$.getFileName = function(_asFilePath) {
		var _oSegs = $.trim(_asFilePath).split("\\");
		return _oSegs[_oSegs.length - 1];
	}

	var _oImgExt = {
		".bmp": 1,
		".png": 1,
		".jpeg": 1,
		".jpg": 1,
		".gif": 2
	};

	function _checkExt(_asFileName, _aoExtension) {
		var _sExt = _asFileName.substr(_asFileName.lastIndexOf(".")).toLowerCase();
		return _aoExtension[_sExt];
	}

	$.isImg = function(_asFileName) {
		return !!_checkExt($.trim(_asFileName) || "", _oImgExt);
	}

	$.isGif = function(_asFileName) {
		if (developMode) return _checkExt($.trim(_asFileName) || "", _oImgExt) == 2;
		else return false;
	}

	var BIT_OF_KB = 10,
		BIT_OF_MB = 20,
		BYTE_OF_KB = 1 << BIT_OF_KB,
		BYTE_OF_MB = 1 << BIT_OF_MB;

	$.getSizeDesc = function(bytes) {
		if (!$.isNumeric(bytes)) {
			return;
		}
		var cRound = 10;

		// > 1MB
		if ((bytes >> BIT_OF_MB) > 0) {
			var bytesInMB = (Math.round(bytes * cRound / BYTE_OF_MB)) / cRound;
			return "" + bytesInMB + "MB";
		}

		// > 0.5K
		if ((bytes >> (BIT_OF_KB - 1)) > 0) {
			var bytesInKB = (Math.round(bytes * cRound / BYTE_OF_KB)) / cRound;
			return "" + bytesInKB + "KB";
		}

		return "" + bytes + "B";
	}

	$.computeVoiceNodeWidth = function(_anTime) {
		if (_anTime < 2000) {
			return 80;
		} else if (_anTime < 10000) {
			return (80 + 10 * (_anTime - 2000) / 1000);
		} else if (_anTime < 60000) {
			return (80 + 80 + 10 * (_anTime - 10000) / 10000);
		} else {
			return 220;
		}
	}

	$.fn.isShow = function() {
		return this.length > 0 && this.css("display") != "none";
	}

	$.canPlayH264 = !! (document.createElement('video').canPlayType);

	$.fn.insertTextToInput = function(_asTxt) {
		var _oInput = this[0];
		if (!_oInput || _oInput.tagName != "TEXTAREA" && _oInput.tagName != "INPUT") {
			return this;
		}

		if (document.selection) {
			_oInput.focus();
			document.selection.createRange().text = _asTxt;

		} else if (typeof _oInput.selectionStart == "number") {
			var _cur = _oInput.selectionStart,
				_tmpVal = _oInput.value;

			_oInput.value = _tmpVal.substr(0, _oInput.selectionStart) + _asTxt + _tmpVal.substr(_oInput.selectionEnd);
			_oInput.selectionStart = _oInput.selectionEnd = _cur + _asTxt.length;

		} else {
			_oInput.value += _asTxt;
		}

		return this;
	}

	$.fn.moveToInputEnd = function() {
		var _oInput = this[0];
		if (!_oInput || _oInput.tagName != "TEXTAREA" && _oInput.tagName != "INPUT") {
			return this;
		}

		_oInput.focus();
		var _len = _oInput.value.length;
		if (document.selection) {
			var _sel = _oInput.createTextRange();
			_sel.moveStart('character', _len);
			_sel.collapse();
			_sel.select();
		} else if (typeof _oInput.selectionStart == "number") {
			_oInput.selectionStart = _oInput.selectionEnd = _len;
		}

		return this;
	}

	$.fn.setDblClickNoSel = function() {
		var _sAttKey = "__MoUSeDoWnnoSEL__"
		_aoDomObj = this[0];

		function getAtts() {
			return (_aoDomObj.getAttribute(_sAttKey) || "").toString().split(",");
		}

		function setAtts(_anTime, _asType) {
			_aoDomObj.setAttribute(_sAttKey, [_anTime, _asType]);
		}

		if (getAtts().length == 1) {
			// just set once!!!
			setAtts(0, "up");
			this.bind("mousedown", function(_aoEvent) {
				var _nNow = $.now(),
					_nTimeStamp = parseInt(getAtts()[0]);
				setAtts(_nNow, "down");
				// for non-IE
				if (_nNow - _nTimeStamp < 500) {
					_aoEvent.preventDefault();
				}
			});
			// mouseup/selectstart event for IE
			this.bind("mouseup", function(_aoEvent) {
				setAtts(getAtts()[0], "up");
			});

			this.bind("selectstart", function(_aoEvent) {
				if (getAtts().pop() == "up") {
					_aoEvent.preventDefault();
				}
			});
		}

		return this;
	}

	$.isiOS = function() {
		var p = navigator.platform;

		return (p === 'iPad' || p === 'iPhone' || p === 'iPod');
	}

	$.isChrome = function() {
		var _sUA = navigator.userAgent.toLowerCase(),
			_sAppVer = navigator.appVersion.toLowerCase(),
			_bIsWebKit = _sUA.indexOf("applewebkit") > -1,
			_bIsQBWebKit = _bIsWebKit ? (_sAppVer.indexOf("qqbrowser") != -1 ? 1 : 0) : 0;

		return _bIsWebKit && !_bIsQBWebKit && _sUA.indexOf("chrome") > -1 && _sUA.indexOf("se 2.x metasr 1.0") < 0;
	}

	$.evalVal = function(_asCode) {
		var _sKey = "a" + $.now(),
			_oValue;

		$.globalEval(
			[
				"(function(){try{window.", _sKey, "=", _asCode, ";}catch(_oError){}})();"
			].join("")
		);
		_oValue = _aoWin[_sKey];
		_aoWin[_sKey] = null;

		return _oValue;
	};

	$.genImgCentralStyle = function(_aoImg) {
		var _oImg$ = $(_aoImg),
			_anSrcWidth = _aoImg.width,
			_anSrcHeight = _aoImg.height,
			_anDestWidth = _oImg$.parent().width(),
			_anDestHeight = _oImg$.parent().height();

		debug("width:" + _anSrcWidth + ", height:" + _anSrcHeight);
		var _nSrcRate = _anSrcWidth / _anSrcHeight,
			_nDestRate = _anDestWidth / _anDestHeight;
		if (_nSrcRate > _nDestRate) {
			_anSrcHeight = _anDestHeight;
			_anSrcWidth = _nSrcRate * _anSrcHeight;
			_oImg$.css({
				height: _anSrcHeight,
				width: _anSrcWidth,
				top: 0,
				left: (_anDestWidth - _anSrcWidth) / 2,
				visibility: "inherit"
			}).show();

		} else {
			_anSrcWidth = _anDestWidth;
			_anSrcHeight = _anSrcWidth / _nSrcRate;

			_oImg$.css({
				height: _anSrcHeight,
				width: _anSrcWidth,
				top: (_anDestHeight - _anSrcHeight) / 2,
				left: 0,
				visibility: "inherit"
			}).show();
		}
	};

	$.transform = function(_aoFromDom$, _aoToDom$, _afCallback) {
		var _oToPos = _aoToDom$.position();
		_aoFromDom$.animate({
			"left": _oToPos.left,
			"top": _oToPos.top,
			"width": _aoToDom$.width(),
			"height": _aoToDom$.height()
		}, _afCallback);
	};

	//选中文本
	$.selectText = function selectText(_aoDom, _anStartPos, _anEndPos) {
		var _startPos = _anStartPos || 0,
			_endPos = _anEndPos || _aoDom.value.length;
		//IE浏览器
		if (_aoDom.createTextRange) {
			var length = _aoDom.value.length,
				range = _aoDom.createTextRange();
			//设置开始位置
			range.moveStart("character", _startPos);
			//设置结束位置，负数表示从最后位置往回走
			range.moveEnd("character", _endPos - length);
			range.select();
		}
		//主流浏览器
		else {
			_aoDom.setSelectionRange(_startPos, _endPos);
			//focus后才会真正的选中
			_aoDom.focus();
		}
	};

	$.setInputLength = function(_aoInput$, _anLen) {
		_aoInput$.off("keydown").on("keydown", function(event) {
			var _keyCode = event.keyCode;
			if ($.getAsiiStrLen(this.value) >= _anLen && _keyCode != 8 && _keyCode != 37 && _keyCode != 39) return false;
		});
		return _aoInput$;
	};

	$.getURLFromFile = function(_oFile) {
		var _sFileName = _oFile.name || _oFile.fileName || "",
			_sExt = _sFileName.substr(_sFileName.lastIndexOf(".")).toLowerCase();
		if (_sExt == ".gif") return null;

		var _sImgUrl = null;
		if (window.createObjectURL != undefined) { // basic
			_sImgUrl = window.createObjectURL(_oFile);
		} else if (window.URL != undefined) { // mozilla(firefox)
			_sImgUrl = window.URL.createObjectURL(_oFile);
		} else if (window.webkitURL != undefined) { // webkit or chrome
			_sImgUrl = window.webkitURL.createObjectURL(_oFile);
		}
		return _sImgUrl;
	};

	$.isLowerBrowser = function() { //if true, cancel some animations
		var _sUserAgent = navigator.userAgent,
			_tridentVer = _sUserAgent.match(/Trident\/(.*?);/),
			_IEVer = _sUserAgent.match(/MSIE(.*?);/),
			_QQB = _sUserAgent.match(/QQ[^A]rowser\/([0-9]+)\./);

		if (_QQB && _QQB.length > 1 && parseInt(_QQB[1]) < 8) return true;

		if (!_tridentVer) {
			if (!_IEVer || (_IEVer.length > 1 && parseInt(_IEVer[1]) > 8)) return false;
			return true;
		}

		_tridentVer = parseInt(_tridentVer[1]);
		if (_tridentVer > 4) return false;
		else return true;
	}
})(jQuery, this);
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
(function() {
	if (!Array.prototype.every) {
		Array.prototype.every = function(fun /*, thisp */ ) {
			"use strict";

			if (this === void 0 || this === null)
				throw new TypeError();

			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof fun !== "function")
				throw new TypeError();

			var thisp = arguments[1];
			for (var i = 0; i < len; i++) {
				if (i in t && !fun.call(thisp, t[i], i, t))
					return false;
			}

			return true;
		};
	}
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/filter
	if (!Array.prototype.filter) {
		Array.prototype.filter = function(fun /*, thisp */ ) {
			"use strict";

			if (this === void 0 || this === null)
				throw new TypeError();

			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof fun !== "function")
				throw new TypeError();

			var res = [];
			var thisp = arguments[1];
			for (var i = 0; i < len; i++) {
				if (i in t) {
					var val = t[i]; // in case fun mutates this
					if (fun.call(thisp, val, i, t))
						res.push(val);
				}
			}

			return res;
		};
	}
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/foreach
	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function(fun /*, thisp */ ) {
			"use strict";

			if (this === void 0 || this === null)
				throw new TypeError();

			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof fun !== "function")
				throw new TypeError();

			var thisp = arguments[1];
			for (var i = 0; i < len; i++) {
				if (i in t)
					fun.call(thisp, t[i], i, t);
			}
		};
	}
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(searchElement /*, fromIndex */ ) {
			"use strict";

			if (this === void 0 || this === null)
				throw new TypeError();

			var t = Object(this);
			var len = t.length >>> 0;
			if (len === 0)
				return -1;

			var n = 0;
			if (arguments.length > 0) {
				n = Number(arguments[1]);
				if (n !== n) // shortcut for verifying if it s NaN
					n = 0;
				else if (n !== 0 && n !== (Infinity) && n !== -(Infinity))
					n = (n > 0 || -1) * Math.floor(Math.abs(n));
			}

			if (n >= len)
				return -1;

			var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);

			for (; k < len; k++) {
				if (k in t && t[k] === searchElement)
					return k;
			}
			return -1;
		};
	}
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
	Array.isArray = Array.isArray || function(o) {
		return Object.prototype.toString.call(o) === '[object Array]';
	};
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
	if (!Array.prototype.lastIndexOf) {
		Array.prototype.lastIndexOf = function(searchElement /*, fromIndex*/ ) {
			"use strict";

			if (this === void 0 || this === null)
				throw new TypeError();

			var t = Object(this);
			var len = t.length >>> 0;
			if (len === 0)
				return -1;

			var n = len;
			if (arguments.length > 1) {
				n = Number(arguments[1]);
				if (n !== n)
					n = 0;
				else if (n !== 0 && n !== (Infinity) && n !== -(Infinity))
					n = (n > 0 || -1) * Math.floor(Math.abs(n));
			}

			var k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n);

			for (; k >= 0; k--) {
				if (k in t && t[k] === searchElement)
					return k;
			}
			return -1;
		};
	}
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map
	if (!Array.prototype.map) {
		Array.prototype.map = function(fun /*, thisp */ ) {
			"use strict";

			if (this === void 0 || this === null)
				throw new TypeError();

			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof fun !== "function")
				throw new TypeError();

			var res = new Array(len);
			var thisp = arguments[1];
			for (var i = 0; i < len; i++) {
				if (i in t)
					res[i] = fun.call(thisp, t[i], i, t);
			}

			return res;
		};
	}
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Reduce
	if (!Array.prototype.reduce) {
		Array.prototype.reduce = function(fun /*, initialValue */ ) {
			"use strict";

			if (this === void 0 || this === null)
				throw new TypeError();

			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof fun !== "function")
				throw new TypeError();

			// no value to return if no initial value and an empty array
			if (len == 0 && arguments.length == 1)
				throw new TypeError();

			var k = 0;
			var accumulator;
			if (arguments.length >= 2) {
				accumulator = arguments[1];
			} else {
				do {
					if (k in t) {
						accumulator = t[k++];
						break;
					}

					// if array contains no values, no initial value to return
					if (++k >= len)
						throw new TypeError();
				}
				while (true);
			}

			while (k < len) {
				if (k in t)
					accumulator = fun.call(undefined, accumulator, t[k], k, t);
				k++;
			}

			return accumulator;
		};
	}
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/ReduceRight
	if (!Array.prototype.reduceRight) {
		Array.prototype.reduceRight = function(callbackfn /*, initialValue */ ) {
			"use strict";

			if (this === void 0 || this === null)
				throw new TypeError();

			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof callbackfn !== "function")
				throw new TypeError();

			// no value to return if no initial value, empty array
			if (len === 0 && arguments.length === 1)
				throw new TypeError();

			var k = len - 1;
			var accumulator;
			if (arguments.length >= 2) {
				accumulator = arguments[1];
			} else {
				do {
					if (k in this) {
						accumulator = this[k--];
						break;
					}

					// if array contains no values, no initial value to return
					if (--k < 0)
						throw new TypeError();
				}
				while (true);
			}

			while (k >= 0) {
				if (k in t)
					accumulator = callbackfn.call(undefined, accumulator, t[k], k, t);
				k--;
			}

			return accumulator;
		};
	}
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
	if (!Array.prototype.some) {
		Array.prototype.some = function(fun /*, thisp */ ) {
			"use strict";

			if (this === void 0 || this === null)
				throw new TypeError();

			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof fun !== "function")
				throw new TypeError();

			var thisp = arguments[1];
			for (var i = 0; i < len; i++) {
				if (i in t && fun.call(thisp, t[i], i, t))
					return true;
			}

			return false;
		};
	}
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/now
	if (!Date.now) {
		Date.now = function now() {
			return +new Date();
		};
	}
	if (!Date.prototype.toJSON) {
		Date.prototype.toJSON = function() {
			if (typeof this.toISOString !== "function")
				throw new TypeError();

			return this.toISOString();
		};
	};
	if (!Date.prototype.toUTCString) {
		Date.prototype.toUTCString = (function() {
			var pad = function(n) {
				return (n = n + "", n.length == 2) ? n : "0" + n;
			}

			return function() {
				var year = [this.getUTCFullYear(), pad(this.getUTCMonth() + 1), pad(this.getUTCDate())].join("-"),
					time = [pad(this.getUTCHours()), pad(this.getUTCMinutes()), pad(this.getUTCSeconds())].join(":") + "." + this.getMilliseconds();
				return [year, time].join("T") + "Z";
			}
		})();
	};
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
	if (!Function.prototype.bind) {
		Function.prototype.bind = function(obj) {
			var slice = [].slice,
				args = slice.call(arguments, 1),
				self = this,
				nop = function() {},
				bound = function() {
					return self.apply(this instanceof nop ? this : (obj || {}),
						args.concat(slice.call(arguments)));
				};

			nop.prototype = self.prototype;

			bound.prototype = new nop();

			return bound;
		};
	}
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
	if (!Object.keys) {
		Object.keys = function(o) {
			if (o !== Object(o))
				throw new TypeError('Object.keys called on non-object');
			var ret = [],
				p;
			for (p in o)
				if (Object.prototype.hasOwnProperty.call(o, p)) ret.push(p);
			return ret;
		}
	}
	//http://blog.stevenlevithan.com/archives/faster-trim-javascript
	if (!String.prototype.trim) {
		String.prototype.trim = function() {
			var str = this.replace(/^\s\s*/, ''),
				ws = /\s/,
				i = str.length;
			while (ws.test(str.charAt(--i)));
			return str.slice(0, i + 1);
		}
	}

	if (!String.prototype.endsWith) {
		String.prototype.endsWith = function(suffix) {
			return this.indexOf(suffix, this.length - suffix.length) !== -1;
		};
	}

	if (!String.prototype.format) {
		String.prototype.format = String.prototype.f = function() {
			var s = this,
				i = arguments.length;

			while (i--) {
				s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
			}
			return s;
		};
	}

})();
(function($, _aoWin, _aoUndefined) {
	var cache = {};

	$.getTmplStr = function(str) {
		return document.getElementById(str).innerHTML;
	}

	$.tmpl = function tmpl(str, data) {
		// Figure out if we're getting a template, or if we need to
		// load the template - and be sure to cache the result.
		var fn = !/\W/.test(str) ?
			cache[str] = cache[str] ||
			tmpl($.getTmplStr(str)) :

		// Generate a reusable function that will serve as a template
		// generator (and which will be cached).
		new Function("obj",
			"var p=[],print=function(){p.push.apply(p,arguments);};" +

			// Introduce the data as local variables using with(){}
			"with(obj){p.push('" +

			// Convert the template into pure JavaScript
			str
			.replace(/[\r\t\n]/g, " ")
			.split("<#").join("\t")
			.replace(/((^|#>)[^\t]*)'/g, "$1\r")
			.replace(/\t=(.*?)#>/g, "',$1,'")
			.split("\t").join("');")
			.split("#>").join("p.push('")
			.split("\r").join("\\'") + "');}return p.join('');");

		// Provide some basic currying to the user
		return data != _aoUndefined ? fn.call(data, data) : fn;
	};
})(jQuery, this);
(function($, _aoWin, _aoUndefined) {
	function _weave(_aoObj, _afFilter, _afLink) {
		var _fCheck,
			_oObj = _aoObj.prototype != _aoUndefined ? _aoObj.prototype : _aoObj; // �����ﲻ֧�ֶ༶prototype
		if (_afFilter.exec) {
			_fCheck = function(_asStr) {
				return _afFilter.exec(_asStr)
			};
		} else if (_afFilter.call) {
			_fCheck = function(_asStr) {
				return _afFilter.call(this, _asStr)
			};
		}

		if (_fCheck) {
			var _fMemberFunc = [];
			for (var _sMember in _oObj) {
				if (_fCheck(_sMember)) {
					_fMemberFunc.push(_attach(_oObj, _sMember, _afLink));
				}
			}
			return _fMemberFunc;
		} else {
			return _attach(_oObj, _afFilter, _afLink);
		}
	}

	function _attach(_aoObj, _asMember, _afLink) {
		var _fOrig = _aoObj[_asMember];
		!_fOrig && (_fOrig = function() {}); //����û������member,����һ���յĺ���
		return (_aoObj[_asMember] = _afLink(_fOrig, _asMember));
	}

	$.extend(($.aop = {}), {
		before: function(_aoObj, _avFilter, _afBefore) {
			var _fLink = function(_afOrig, _asName) {
				return function() {
					return _afOrig.apply(this, _afBefore.apply(this, arguments) || arguments);
				}
			}

			return _weave(_aoObj, _avFilter, _fLink);
		},

		after: function(_aoObj, _avFilter, _afAfter) {
			var _fLink = function(_afOrig, _asName) {
				return function() {
					return _afAfter.apply(this, _afOrig.apply(this, arguments) || arguments);
				}
			}

			return _weave(_aoObj, _avFilter, _fLink);
		},

		around: function(_aoObj, _avFilter, _afAround) {
			var _fLink = function(_afOrig, _asName) {
				return function() {
					return _afAround.call(this, arguments, _afOrig, _asName);
				}
			}
			return _weave(_aoObj, _avFilter, _fLink);
		},

		exception: function(_aoObj, _avFilter, _fThrow) {
			var _fLink = function(_afOrig, _asName) {
				return function() {
					try {
						return _afOrig.apply(this, arguments);
					} catch (e) {
						_fThrow.apply(this, [e]);
					}
				}
			}
			return _weave(_aoObj, _avFilter, _fLink);
		}
	});

})(jQuery, this);

/*
    json2.js
    2012-10-08

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object' || true) {
	JSON = {};
}

(function() {
	'use strict';

	function f(n) {
		// Format integers to have at least two digits.
		return n < 10 ? '0' + n : n;
	}

	if (typeof Date.prototype.toJSON !== 'function') {

		Date.prototype.toJSON = function(key) {

			return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' +
				f(this.getUTCMonth() + 1) + '-' +
				f(this.getUTCDate()) + 'T' +
				f(this.getUTCHours()) + ':' +
				f(this.getUTCMinutes()) + ':' +
				f(this.getUTCSeconds()) + 'Z' : null;
		};

		String.prototype.toJSON =
			Number.prototype.toJSON =
			Boolean.prototype.toJSON = function(key) {
				return this.valueOf();
		};
	}

	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		gap,
		indent,
		meta = { // table of character substitutions
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\n',
			'\f': '\\f',
			'\r': '\r',
			'"': '\\"',
			'\\': '\\\\'
		},
		rep;


	function quote(string) {

		// If the string contains no control characters, no quote characters, and no
		// backslash characters, then we can safely slap some quotes around it.
		// Otherwise we must also replace the offending characters with safe escape
		// sequences.

		escapable.lastIndex = 0;
		return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
			var c = meta[a];
			return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		}) + '"' : '"' + string + '"';
	}


	function str(key, holder) {

		// Produce a string from holder[key].

		var i, // The loop counter.
			k, // The member key.
			v, // The member value.
			length,
			mind = gap,
			partial,
			value = holder[key];

		// If the value has a toJSON method, call it to obtain a replacement value.

		if (value && typeof value === 'object' &&
			typeof value.toJSON === 'function') {
			value = value.toJSON(key);
		}

		// If we were called with a replacer function, then call the replacer to
		// obtain a replacement value.

		if (typeof rep === 'function') {
			value = rep.call(holder, key, value);
		}

		// What happens next depends on the value's type.

		switch (typeof value) {
			case 'string':
				return quote(value);

			case 'number':

				// JSON numbers must be finite. Encode non-finite numbers as null.

				return isFinite(value) ? String(value) : 'null';

			case 'boolean':
			case 'null':

				// If the value is a boolean or null, convert it to a string. Note:
				// typeof null does not produce 'null'. The case is included here in
				// the remote chance that this gets fixed someday.

				return String(value);

				// If the type is 'object', we might be dealing with an object or an array or
				// null.

			case 'object':

				// Due to a specification blunder in ECMAScript, typeof null is 'object',
				// so watch out for that case.

				if (!value) {
					return 'null';
				}

				// Make an array to hold the partial results of stringifying this object value.

				gap += indent;
				partial = [];

				// Is the value an array?

				if (Object.prototype.toString.apply(value) === '[object Array]') {

					// The value is an array. Stringify every element. Use null as a placeholder
					// for non-JSON values.

					length = value.length;
					for (i = 0; i < length; i += 1) {
						partial[i] = str(i, value) || 'null';
					}

					// Join all of the elements together, separated with commas, and wrap them in
					// brackets.

					v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
					gap = mind;
					return v;
				}

				// If the replacer is an array, use it to select the members to be stringified.

				if (rep && typeof rep === 'object') {
					length = rep.length;
					for (i = 0; i < length; i += 1) {
						if (typeof rep[i] === 'string') {
							k = rep[i];
							v = str(k, value);
							if (v) {
								partial.push(quote(k) + (gap ? ': ' : ':') + v);
							}
						}
					}
				} else {

					// Otherwise, iterate through all of the keys in the object.

					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = str(k, value);
							if (v) {
								partial.push(quote(k) + (gap ? ': ' : ':') + v);
							}
						}
					}
				}

				// Join all of the member texts together, separated with commas,
				// and wrap them in braces.

				v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
				gap = mind;
				return v;
		}
	}

	// If the JSON object does not yet have a stringify method, give it one.

	if (typeof JSON.stringify !== 'function') {
		JSON.stringify = function(value, replacer, space) {

			// The stringify method takes a value and an optional replacer, and an optional
			// space parameter, and returns a JSON text. The replacer can be a function
			// that can replace values, or an array of strings that will select the keys.
			// A default replacer method can be provided. Use of the space parameter can
			// produce text that is more easily readable.

			var i;
			gap = '';
			indent = '';

			// If the space parameter is a number, make an indent string containing that
			// many spaces.

			if (typeof space === 'number') {
				for (i = 0; i < space; i += 1) {
					indent += ' ';
				}

				// If the space parameter is a string, it will be used as the indent string.

			} else if (typeof space === 'string') {
				indent = space;
			}

			// If there is a replacer, it must be a function or an array.
			// Otherwise, throw an error.

			rep = replacer;
			if (replacer && typeof replacer !== 'function' &&
				(typeof replacer !== 'object' ||
					typeof replacer.length !== 'number')) {
				throw new Error('JSON.stringify');
			}

			// Make a fake root object containing our value under the key of ''.
			// Return the result of stringifying the value.

			return str('', {
				'': value
			});
		};
	}


	// If the JSON object does not yet have a parse method, give it one.

	if (typeof JSON.parse !== 'function') {
		JSON.parse = function(text, reviver) {

			// The parse method takes a text and an optional reviver function, and returns
			// a JavaScript value if the text is a valid JSON text.

			var j;

			function walk(holder, key) {

				// The walk method is used to recursively walk the resulting structure so
				// that modifications can be made.

				var k, v, value = holder[key];
				if (value && typeof value === 'object') {
					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== undefined) {
								value[k] = v;
							} else {
								delete value[k];
							}
						}
					}
				}
				return reviver.call(holder, key, value);
			}


			// Parsing happens in four stages. In the first stage, we replace certain
			// Unicode characters with escape sequences. JavaScript handles many characters
			// incorrectly, either silently deleting them, or treating them as line endings.

			text = String(text);
			cx.lastIndex = 0;
			if (cx.test(text)) {
				text = text.replace(cx, function(a) {
					return '\\u' +
						('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				});
			}

			// In the second stage, we run the text against regular expressions that look
			// for non-JSON patterns. We are especially concerned with '()' and 'new'
			// because they can cause invocation, and '=' because it can cause mutation.
			// But just to be safe, we want to reject all unexpected forms.

			// We split the second stage into 4 regexp operations in order to work around
			// crippling inefficiencies in IE's and Safari's regexp engines. First we
			// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
			// replace all simple value tokens with ']' characters. Third, we delete all
			// open brackets that follow a colon or comma or that begin the text. Finally,
			// we look to see that the remaining characters are only whitespace or ']' or
			// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

			if (/^[\],:{}\s]*$/
				.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
					.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
					.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

				// In the third stage we use the eval function to compile the text into a
				// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
				// in JavaScript: it can begin a block or an object literal. We wrap the text
				// in parens to eliminate the ambiguity.

				j = eval('(' + text + ')');

				// In the optional fourth stage, we recursively walk the new structure, passing
				// each name/value pair to a reviver function for possible transformation.

				return typeof reviver === 'function' ? walk({
					'': j
				}, '') : j;
			}

			// If the text is not JSON parseable, then a SyntaxError is thrown.

			throw new SyntaxError('JSON.parse');
		};
	}
}());
// inherit 
(function($, _aoWin, _aoUndefined) {
	function _getStaticInstance() {
		return this.__instance__ || (this.__instance__ = new this());
	}

	function _inherit(_aoExts) {
		return Class.call(this, _aoExts);
	}

	var _class = _aoWin.Class = function(_aoExts) {
		var _oBase = typeof this == "function" ? this : (function() {}),
			_f = function() {
				var _oSelf = this,
					_oArgs = arguments;
				_oSelf.Root = _oBase.__base__;
				_oSelf.Super = _oBase.prototype;

				function _fConstruct(_aoInstanse, _aoContext) {
					if (_aoInstanse.Super) {
						_fConstruct(_aoInstanse.Super, _aoContext);
					}
					_aoInstanse.init && _aoInstanse.init.apply(_aoContext, _oArgs);
				}

				_fConstruct(_oSelf, _oSelf);
			};

		_f.prototype = $.extend2({}, _oBase.prototype || {}, _aoExts);
		_f.__base__ = _oBase.__base__ || _f.prototype;
		_f.GetStaticInstance = _getStaticInstance;
		_f.Inherit = _inherit;

		return _f;
	};
})(jQuery, this);
(function($, _aoWin, _aoUndefined) {

	var _oSetting = {};
	var _oQueueMap = {},
		_sQueueIdNotDefined = "__not_defined__",
		_fAjaxSend = function(_asUrl, _aoData, _aoCallback, _aoOptions) {
			var _oCb = {
				onbefore: function(xhr) {
					return _aoCallback.onbefore && _aoCallback.onbefore();
				},
				onsuccess: function(_aoData, _asStatus, jqXHR) {
					if (!_aoData || _aoData.retcode == "0" || _aoData["BaseResponse"] && _aoData["BaseResponse"].Ret === 0) {
						_aoCallback.onsuccess && _aoCallback.onsuccess(_aoData);

					} else {
						var _oBaseResponse = _aoData && _aoData["BaseResponse"] || {},
							_nRetCode = _oBaseResponse.Ret || _oBaseResponse.retcode || _aoData && _aoData.retcode || -1;

						if (_oSetting.globalExceptionHandler && _oSetting.globalExceptionHandler(_nRetCode)) {
							return;
						}
						_aoCallback.onerror && _aoCallback.onerror(_nRetCode,
							_oBaseResponse.ErrMsg);
					}
				},
				onerror: function(xhr, _asStatus, _aoError) {
					_aoCallback.onerror && _aoCallback.onerror(_asStatus, xhr.status);
				},
				oncomplete: function(XMLHttpRequest, textStatus) {
					_aoCallback.oncomplete && _aoCallback.oncomplete();
				}
			};

			var _oTimeout = 30 * 1000;
			if (developMode) {
				_oTimeout = 60 * 1000; //DEV����Ҫ60s
			}
			$.ajax($.extend({
				url: (_asUrl.indexOf("?") > 0 ? (_asUrl + "&") : (_asUrl + "?")) + "r=" + $.now(),
				data: JSON.stringify(_aoData),
				type: "post",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				timeout: _oTimeout,
				beforeSend: _oCb.onbefore,
				success: _oCb.onsuccess,
				error: _oCb.onerror,
				complete: _oCb.oncomplete
			}, _aoOptions));
		},

		_fQueue = Class({
			_mbSending: false,
			_moQueue: [],
			init: function(_asQueueId, _aoOptions) {
				this.queueId = _asQueueId;
				this.options = _aoOptions;
			},
			send: function(_asUrl, _aoData, _aoCallback) {
				if (_oSetting && _oSetting.wait)
					returun;

				var _oSelf = this;
				_aoCallback = _aoCallback || {};
				if (!_oSelf.queueId || _oSelf.options && _oSelf.options.noDelay) {
					_fAjaxSend(_asUrl, _aoData, _aoCallback, _oSelf.options);
					return;
				}

				$.aop.before(_aoCallback, "oncomplete", function() {
					_oSelf._mbSending = false;
					_oSelf._fSend(_oSelf._moQueue.shift());
				});

				_oSelf._moQueue.push({
					url: _asUrl,
					data: _aoData,
					callback: _aoCallback
				});
				if (_oSelf._moQueue.length > 10) {
					_oSelf._mbSending = false;
				}

				if (!_oSelf._mbSending) {
					_oSelf._fSend(_oSelf._moQueue.shift());
				}
			},

			clear: function() {
				this._moQueue = [];
			},

			_fSend: function(_aoRequest) {
				if (_aoRequest) {
					//this._mbSending = true;
					_fAjaxSend(_aoRequest.url, _aoRequest.data, _aoRequest.callback, this.options);
				}
			}
		});

	/*{onbefore, onsuccess, onerror, oncomplete}*/

	function _fNetQueue(_asQueueId, _aoOptions) {
		return _oQueueMap[_asQueueId] || (_oQueueMap[_asQueueId || _sQueueIdNotDefined] = new _fQueue(_asQueueId, _aoOptions || {}));
	}

	$.netQueue = _fNetQueue;
	$.netQueueSetting = function _setNetQueue(_aoSetting) {
		$.extend(_oSetting, _aoSetting);
	};

})(jQuery, this);
(function($, _aoWin, _aoUndefined) {
	var MM_MEDIA_TYPE_IMAGE = 1;
	var MM_MEDIA_TYPE_VIDEO = 2;
	var MM_MEDIA_TYPE_AUDIO = 3;
	var MM_MEDIA_TYPE_ATTACHMENT = 4;
	var MAX_IMG_SIZE = 3 * 1024 * 1024; //3M

	var _sBoundary = 'xxxxxxxxx';

	var _oUICallBacks = {
		ondocover: function() {},
		ondocleave: function() {},
		ontargetover: function() {},
		ontargetdrop: function() {},
		ontargetleave: function() {}
	};
	var _fGetXHR = null;

	function get_file_name(file) {
		return file.name || file.fileName;
	}

	function get_file_size(file) {
		return file.size || file.fileSize;
	}

	function isFileDragOver(_aoEvent) {
		var _oTypeInfo = _aoEvent.dataTransfer.types,
			_bFiles = false;
		if (_oTypeInfo === null) //A.gbIsSafari
		{
			return true;
		} else {
			$.each(_oTypeInfo, function(k, v) {
				if (v == "Files") {
					_bFiles = true;
				}
			});
			return _bFiles;
		}
	}

	function _composeFormBody(_asFileName, _aoBinary) {
		var body = '--' + _sBoundary + "\r\n";
		body += "Content-Disposition: form-data; name='upload'; filename='" + _asFileName + "'\r\n";
		body += "Content-Type: application/octet-stream\r\n\r\n";
		body += bin + "\r\n";
		body += '--' + _sBoundary + '--';
		return body;
	}

	function _getUploadXHR(_asUrl, _aoCallbacks, _asToUserName, _asName, _anLocalId) {
		var xhr = _fGetXHR ? _fGetXHR() : new XMLHttpRequest();
		xhr.open('POST', _asUrl, true);

		xhr.onabort = xhr.onerror = function() {
			_aoCallbacks.onerror && _aoCallbacks.onerror(xhr.responseText, xhr.status, _asToUserName, _anLocalId);
		}

		xhr.onload = function() {
			var _oResult = JSON.parse(xhr.responseText);
			if (_oResult.BaseResponse.Ret == "0") {
				_aoCallbacks.onsuccess && _aoCallbacks.onsuccess(_asToUserName, _asName, $.extend(_oResult, {
					LocalId: _anLocalId
				}), xhr.status);
			} else {
				_aoCallbacks.onerror && _aoCallbacks.onerror(xhr.responseText, xhr.status, _asToUserName, _anLocalId);
			}
		}

		xhr.onloadend = function() {
			_aoCallbacks.oncomplete && _aoCallbacks.oncomplete(_anLocalId);
		}

		/*
	xhr.onloadstart = function() {
	}

	xhr.onprogress = function() {
	}
	*/

		if (xhr.upload || xhr) {
			(xhr.upload || xhr).onprogress = function(_aoEvent) {
				_aoCallbacks.onprogress && _aoCallbacks.onprogress(_anLocalId, (_aoEvent.loaded || _aoEvent.position) / (_aoEvent.total || _aoEvent.totalSize));
			}
		}

		return xhr;
	}

	var _upload = function() {};

	_fDragFileUpload = function(_asUploadPanel, _afGetUrl, _afParams, _aoCallbacks) {

		// Upload image files
		_upload = function(file) {

			var xhr = _getUploadXHR(_afGetUrl(), _aoCallbacks, file.toUserName, file.name, file.localId);
			// Firefox 3.6+, Chrome 6+, WebKit
			if (_aoWin.FormData) {
				var f = new FormData();

				f.append("uploadmediarequest", JSON.stringify({
					BaseRequest: _afParams(),
					ClientMediaId: ("" + $.now()),
					TotalLen: file.size,
					StartPos: 0,
					DataLen: file.size,
					MediaType: MM_MEDIA_TYPE_ATTACHMENT

				}));
				f.append("filename", file);
				xhr.send(f);

			} else if (_aoWin.FileReader) {

				var _oReader = new FileReader();
				// Once the process of reading file
				this.loadEnd = function() {
					var bin = _oReader.result;

					if (xhr.sendAsBinary != null) {
						xhr.setRequestHeader('content-type', 'multipart/form-data; boundary=' + _sBoundary);
						xhr.sendAsBinary(_composeFormBody(file.name, bin));

					} else {
						xhr.setRequestHeader('BASE64', 1);
						xhr.setRequestHeader('UP-FILENAME', file.name);
						xhr.setRequestHeader('UP-SIZE', file.size);
						xhr.setRequestHeader('UP-TYPE', file.type);
						//xhr.send(window.btoa(bin));
						xhr.send(bin);
					}

				}

				// Loading errors
				this.loadError = function(event) {
					switch (event.target.error.code) {
						case event.target.error.NOT_FOUND_ERR:
							document.getElementById(status).innerHTML = 'File not found!';
							break;
						case event.target.error.NOT_READABLE_ERR:
							document.getElementById(status).innerHTML = 'File not readable!';
							break;
						case event.target.error.ABORT_ERR:
							break;
						default:
							document.getElementById(status).innerHTML = 'Read error.';
					}
				}

				// Reading Progress
				this.loadProgress = function(event) {
					if (event.lengthComputable) {
						var percentage = Math.round((event.loaded * 100) / event.total);
						document.getElementById(status).innerHTML = 'Loaded : ' + percentage + '%';
					}
				}

				// Firefox 3.6, WebKit
				if (_oReader.addEventListener) {
					_oReader.addEventListener('loadend', this.loadEnd, false);
					if (status != null) {
						_oReader.addEventListener('error', this.loadError, false);
						_oReader.addEventListener('progress', this.loadProgress, false);
					}

					// Chrome 7
				} else {
					_oReader.onloadend = this.loadEnd;
					if (status != null) {
						_oReader.onerror = this.loadError;
						_oReader.onprogress = this.loadProgress;
					}
				}


				var blob = null;
				if (file.webkitSlice) {
					blob = file.webkitSlice(0, 1024 + 1);
				} else if (file.mozSlice) {
					blob = file.mozSlice(0, 1024 + 1);
				}
				if (blob) {
					_oReader.readAsBinaryString(blob);
				} else {
					// The function that starts reading the file as a binary string
					_oReader.readAsBinaryString(file);
				}


				// Safari 5 does not support FileReader
			} else {
				xhr = new XMLHttpRequest();
				xhr.open('POST', targetPHP + '?up=true', true);
				xhr.setRequestHeader('UP-FILENAME', file.name);
				xhr.setRequestHeader('UP-SIZE', file.size);
				xhr.setRequestHeader('UP-TYPE', file.type);
				xhr.send(file);

				if (status) {
					document.getElementById(status).innerHTML = 'Loaded : 100%';
				}
			}
		}

		// Function drop file

		function _drop(event) {
			event.preventDefault();

			var dt = event.dataTransfer,
				_oFiles = dt.files;
			for (var i = 0, len = _oFiles.length; i < len; i++) {
				var _oFile = _oFiles[i],
					_oItem = _oUICallBacks.ontargetdrop(get_file_name(_oFile), get_file_size(_oFile), (_oFile.size > MAX_IMG_SIZE ? "" : $.getURLFromFile(_oFile)));
				if (_oItem && _oItem.localId) {
					_oFile.localId = _oItem.localId;
					_oFile.toUserName = _oItem.toUserName;
					_upload(_oFile);
				}
			}
			if (!_oFiles.length) {
				_oUICallBacks.ontargetdrop();
			}
		}

		// The inclusion of the event listeners (DragOver and drop)
		var _aoUploadPanel = document.getElementById(_asUploadPanel);
		if (!('draggable' in _aoUploadPanel)) {
			return;
		}

		_aoUploadPanel.addEventListener("dragover", function(event) {
			//event.stopPropagation(); 
			event.preventDefault();

			_oUICallBacks.ontargetover();
		}, true);
		_aoUploadPanel.addEventListener("drop", function(_aoEvent) {
			_drop(_aoEvent);
		}, false);
		_aoUploadPanel.addEventListener("dragleave", function() {
			_oUICallBacks.ontargetleave();
		}, false);

		_aoWin.addEventListener("dragover", function(event) {
			event.stopPropagation();
			event.preventDefault();

			if (!isFileDragOver(event)) {
				return;
			}

			_oUICallBacks.ondocover();
		}, false);

		_aoWin.addEventListener("dragleave", function(event) {
			event.stopPropagation();
			event.preventDefault();
			_oUICallBacks.ondocleave();

		}, false);

		_aoWin.addEventListener("drop", function(event) {
			event.stopPropagation();
			event.preventDefault();
			_oUICallBacks.ondocleave();
		}, false);
	}

	$.setDragFileUploadOption = function(_afGetXHR, _aoCallbacks) {
		_fGetXHR = _afGetXHR;;
		$.extend(_oUICallBacks, _aoCallbacks);
	};
	$.dragFileUpload = _fDragFileUpload;
	$.uploadFileByForm = function(evt) {
		var _oFiles = evt.target.files;
		for (var i = 0, len = _oFiles.length; i < len; i++) {
			var _oFile = _oFiles[i],
				_oItem = _oUICallBacks.ontargetdrop(get_file_name(_oFile), get_file_size(_oFile), (_oFile.size > MAX_IMG_SIZE ? "" : $.getURLFromFile(_oFile)));
			_oFile.localId = _oItem.localId;
			_oFile.toUserName = _oItem.toUserName;
			_upload(_oFile);
		}
	}

})(jQuery, this);
(function($, _aoWin, _aoUndefined) {

	function _getDomain() {
		return document.domain;
	}

	/**
	 * @method prototype.setCookie
	 *
	 * @desc ����cookie
	 * @param {String} _asName
	 * @param {String} _asValue
	 * @param {Object} _aoExpires ������Date����
	 * @param {String} _asPath Ĭ����/
	 * @param {String} _asDomain Ĭ��domain����getDomain()����
	 * @param {Boolean} _abSecure
	 * @return {Object} QMWin����
	 */
	$.setCookie = function(_asName, _asValue, _aoExpires, _asPath, _asDomain, _abSecure) {
		_asName && (document.cookie = $.tmpl(
			[
				'<#=name#>=<#=value#>; ', !_aoExpires ? '' : 'expires=<#=expires#>; ',
				'path=<#=path#>; ',
				'domain=<#=domain#>; ', !_abSecure ? '' : '<#=secure#>'
			].join(""), {
				name: _asName,
				value: (_asValue || "").replace(/%/ig, "%25").replace(/=/ig, "%3D").replace(/;/ig, "%3B"),
				expires: _aoExpires && _aoExpires.toGMTString(),
				path: _asPath || '/',
				domain: _asDomain || _getDomain(),
				secure: _abSecure ? "secure" : ""
			}
		));

		return this;
	};

	/**
	 * @method prototype.getCookie
	 *
	 * @desc ��ȡ��Ӧcookie
	 * @param {String} _asName
	 * @return {String}
	 */
	$.getCookie = function(_asName) {
		return (new RegExp(["(\\b|\\s|^|;)", $.regFilter(_asName), "=([^;]*);?"].join("")))
			.test(document.cookie) && decodeURIComponent(RegExp["$2"]) || "";
	}

	/**
	 * @method prototype.delCookie
	 *
	 * @desc ɾ����Ӧ��cookie
	 * @param {String} _asName
	 * @param {String} _asPath
	 * @param {String} _asDomain
	 * @return {Object} ����QMWin����
	 */
	$.delCookie = function(_asName, _asPath, _asDomain) {
		return this.setCookie(_asName, "", new Date(0), _asPath, _asDomain);
	}

})(jQuery, this);
(function($, _aoWin, _aoUndefined) {
	var _sCurHash = "",
		_oHashChangeHandles = [],
		_oHistoryStack = [];

	$.hashChange = function(_afCallback) {
		if ($.isFunction(_afCallback)) {
			_oHashChangeHandles.push(_afCallback);
		} else {
			for (var i = 0, len = _oHashChangeHandles.length; i < len; i++) {
				_oHashChangeHandles[i](_sCurHash);
			}
		}
	};

	$.hash = function(_asHash) {
		if (_asHash != _aoUndefined) {
			var _sNewHash = _asHash.replace(/^#/, "");
			if (_sNewHash && _sNewHash != _sCurHash) {
				_oHistoryStack.unshift(_sCurHash = _sNewHash);
				if (_oHistoryStack.length > 10) {
					_oHistoryStack.pop();
				}
				$.hashChange();
			}
			return this;
		}

		return _sCurHash;
	};

	$.history = $.extend(_oHistoryStack, {
		pushState: function() {
			//todo 
		},
		back: function() {
			var _sLastHash = this.shift();
			_sCurHash = this[0] || "";
			if (_sLastHash != _sCurHash) {
				$.hashChange();
			}
		}
	});
})(jQuery, this);
/*
 * jPlayer Plugin for jQuery JavaScript Library
 * http://www.jplayer.org
 *
 * Copyright (c) 2009 - 2013 Happyworm Ltd
 * Licensed under the MIT license.
 * http://opensource.org/licenses/MIT
 *
 * Author: Mark J Panaghiston
 * Version: 2.4.0
 * Date: 5th June 2013
 */

(function(b, f) {
	"function" === typeof define && define.amd ? define(["jquery"], f) : b.jQuery ? f(b.jQuery) : f(b.Zepto)
})(this, function(b, f) {
	b.fn.jPlayer = function(a) {
		var c = "string" === typeof a,
			d = Array.prototype.slice.call(arguments, 1),
			e = this;
		a = !c && d.length ? b.extend.apply(null, [!0, a].concat(d)) : a;
		if (c && "_" === a.charAt(0)) return e;
		c ? this.each(function() {
			var c = b(this).data("jPlayer"),
				h = c && b.isFunction(c[a]) ? c[a].apply(c, d) : c;
			if (h !== c && h !== f) return e = h, !1
		}) : this.each(function() {
			var c = b(this).data("jPlayer");
			c ? c.option(a || {}) : b(this).data("jPlayer", new b.jPlayer(a, this))
		});
		return e
	};
	b.jPlayer = function(a, c) {
		if (arguments.length) {
			this.element = b(c);
			this.options = b.extend(!0, {}, this.options, a);
			var d = this;
			this.element.bind("remove.jPlayer", function() {
				d.destroy()
			});
			this._init()
		}
	};
	"function" !== typeof b.fn.stop && (b.fn.stop = function() {});
	b.jPlayer.emulateMethods = "load play pause";
	b.jPlayer.emulateStatus = "src readyState networkState currentTime duration paused ended playbackRate";
	b.jPlayer.emulateOptions = "muted volume";
	b.jPlayer.reservedEvent =
		"ready flashreset resize repeat error warning";
	b.jPlayer.event = {};
	b.each("ready flashreset resize repeat click error warning loadstart progress suspend abort emptied stalled play pause loadedmetadata loadeddata waiting playing canplay canplaythrough seeking seeked timeupdate ended ratechange durationchange volumechange".split(" "), function() {
		b.jPlayer.event[this] = "jPlayer_" + this
	});
	b.jPlayer.htmlEvent = "loadstart abort emptied stalled loadedmetadata loadeddata canplay canplaythrough ratechange".split(" ");
	b.jPlayer.pause = function() {
		b.each(b.jPlayer.prototype.instances, function(a, c) {
			c.data("jPlayer").status.srcSet && c.jPlayer("pause")
		})
	};
	b.jPlayer.timeFormat = {
		showHour: !1,
		showMin: !0,
		showSec: !0,
		padHour: !1,
		padMin: !0,
		padSec: !0,
		sepHour: ":",
		sepMin: ":",
		sepSec: ""
	};
	var l = function() {
		this.init()
	};
	l.prototype = {
		init: function() {
			this.options = {
				timeFormat: b.jPlayer.timeFormat
			}
		},
		time: function(a) {
			var c = new Date(1E3 * (a && "number" === typeof a ? a : 0)),
				b = c.getUTCHours();
			a = this.options.timeFormat.showHour ? c.getUTCMinutes() : c.getUTCMinutes() +
				60 * b;
			c = this.options.timeFormat.showMin ? c.getUTCSeconds() : c.getUTCSeconds() + 60 * a;
			b = this.options.timeFormat.padHour && 10 > b ? "0" + b : b;
			a = this.options.timeFormat.padMin && 10 > a ? "0" + a : a;
			c = this.options.timeFormat.padSec && 10 > c ? "0" + c : c;
			b = "" + (this.options.timeFormat.showHour ? b + this.options.timeFormat.sepHour : "");
			b += this.options.timeFormat.showMin ? a + this.options.timeFormat.sepMin : "";
			return b += this.options.timeFormat.showSec ? c + this.options.timeFormat.sepSec : ""
		}
	};
	var m = new l;
	b.jPlayer.convertTime = function(a) {
		return m.time(a)
	};
	b.jPlayer.uaBrowser = function(a) {
		a = a.toLowerCase();
		var b = /(opera)(?:.*version)?[ \/]([\w.]+)/,
			d = /(msie) ([\w.]+)/,
			e = /(mozilla)(?:.*? rv:([\w.]+))?/;
		a = /(webkit)[ \/]([\w.]+)/.exec(a) || b.exec(a) || d.exec(a) || 0 > a.indexOf("compatible") && e.exec(a) || [];
		return {
			browser: a[1] || "",
			version: a[2] || "0"
		}
	};
	b.jPlayer.uaPlatform = function(a) {
		var b = a.toLowerCase(),
			d = /(android)/,
			e = /(mobile)/;
		a = /(ipad|iphone|ipod|android|blackberry|playbook|windows ce|webos)/.exec(b) || [];
		b = /(ipad|playbook)/.exec(b) || !e.exec(b) && d.exec(b) ||
			[];
		a[1] && (a[1] = a[1].replace(/\s/g, "_"));
		return {
			platform: a[1] || "",
			tablet: b[1] || ""
		}
	};
	b.jPlayer.browser = {};
	b.jPlayer.platform = {};
	var j = b.jPlayer.uaBrowser(navigator.userAgent);
	j.browser && (b.jPlayer.browser[j.browser] = !0, b.jPlayer.browser.version = j.version);
	j = b.jPlayer.uaPlatform(navigator.userAgent);
	j.platform && (b.jPlayer.platform[j.platform] = !0, b.jPlayer.platform.mobile = !j.tablet, b.jPlayer.platform.tablet = !! j.tablet);
	b.jPlayer.getDocMode = function() {
		var a;
		b.jPlayer.browser.msie && (document.documentMode ?
			a = document.documentMode : (a = 5, document.compatMode && "CSS1Compat" === document.compatMode && (a = 7)));
		return a
	};
	b.jPlayer.browser.documentMode = b.jPlayer.getDocMode();
	b.jPlayer.nativeFeatures = {
		init: function() {
			var a = document,
				b = a.createElement("video"),
				d = {
					w3c: "fullscreenEnabled fullscreenElement requestFullscreen exitFullscreen fullscreenchange fullscreenerror".split(" "),
					moz: "mozFullScreenEnabled mozFullScreenElement mozRequestFullScreen mozCancelFullScreen mozfullscreenchange mozfullscreenerror".split(" "),
					webkit: " webkitCurrentFullScreenElement webkitRequestFullScreen webkitCancelFullScreen webkitfullscreenchange ".split(" "),
					webkitVideo: "webkitSupportsFullscreen webkitDisplayingFullscreen webkitEnterFullscreen webkitExitFullscreen  ".split(" ")
				}, e = ["w3c", "moz", "webkit", "webkitVideo"],
				g, h;
			this.fullscreen = b = {
				support: {
					w3c: !! a[d.w3c[0]],
					moz: !! a[d.moz[0]],
					webkit: "function" === typeof a[d.webkit[3]],
					webkitVideo: "function" === typeof b[d.webkitVideo[2]]
				},
				used: {}
			};
			g = 0;
			for (h = e.length; g < h; g++) {
				var f = e[g];
				if (b.support[f]) {
					b.spec =
						f;
					b.used[f] = !0;
					break
				}
			}
			if (b.spec) {
				var k = d[b.spec];
				b.api = {
					fullscreenEnabled: !0,
					fullscreenElement: function(b) {
						b = b ? b : a;
						return b[k[1]]
					},
					requestFullscreen: function(a) {
						return a[k[2]]()
					},
					exitFullscreen: function(b) {
						b = b ? b : a;
						return b[k[3]]()
					}
				};
				b.event = {
					fullscreenchange: k[4],
					fullscreenerror: k[5]
				}
			} else b.api = {
				fullscreenEnabled: !1,
				fullscreenElement: function() {
					return null
				},
				requestFullscreen: function() {},
				exitFullscreen: function() {}
			}, b.event = {}
		}
	};
	b.jPlayer.nativeFeatures.init();
	b.jPlayer.focus = null;
	b.jPlayer.keyIgnoreElementNames =
		"INPUT TEXTAREA";
	var n = function(a) {
		var c = b.jPlayer.focus,
			d;
		c && (b.each(b.jPlayer.keyIgnoreElementNames.split(/\s+/g), function(b, c) {
			if (a.target.nodeName.toUpperCase() === c.toUpperCase()) return d = !0, !1
		}), d || b.each(c.options.keyBindings, function(d, g) {
			if (g && a.which === g.key && b.isFunction(g.fn)) return a.preventDefault(), g.fn(c), !1
		}))
	};
	b.jPlayer.keys = function(a) {
		b(document.documentElement).unbind("keydown.jPlayer");
		a && b(document.documentElement).bind("keydown.jPlayer", n)
	};
	b.jPlayer.keys(!0);
	b.jPlayer.prototype = {
		count: 0,
		version: {
			script: "2.4.0",
			needFlash: "2.4.0",
			flash: "unknown"
		},
		options: {
			swfPath: "js",
			solution: "html, flash",
			supplied: "mp3",
			preload: "metadata",
			volume: 0.8,
			muted: !1,
			wmode: "opaque",
			backgroundColor: "#000000",
			cssSelectorAncestor: "#jp_container_1",
			cssSelector: {
				videoPlay: ".jp-video-play",
				play: ".jp-play",
				pause: ".jp-pause",
				stop: ".jp-stop",
				seekBar: ".jp-seek-bar",
				playBar: ".jp-play-bar",
				mute: ".jp-mute",
				unmute: ".jp-unmute",
				volumeBar: ".jp-volume-bar",
				volumeBarValue: ".jp-volume-bar-value",
				volumeMax: ".jp-volume-max",
				currentTime: ".jp-current-time",
				duration: ".jp-duration",
				fullScreen: ".jp-full-screen",
				restoreScreen: ".jp-restore-screen",
				repeat: ".jp-repeat",
				repeatOff: ".jp-repeat-off",
				gui: ".jp-gui",
				noSolution: ".jp-no-solution"
			},
			smoothPlayBar: !1,
			fullScreen: !1,
			fullWindow: !1,
			autohide: {
				restored: !1,
				full: !0,
				fadeIn: 200,
				fadeOut: 600,
				hold: 1E3
			},
			loop: !1,
			repeat: function(a) {
				a.jPlayer.options.loop ? b(this).unbind(".jPlayerRepeat").bind(b.jPlayer.event.ended + ".jPlayer.jPlayerRepeat", function() {
					b(this).jPlayer("play")
				}) : b(this).unbind(".jPlayerRepeat")
			},
			nativeVideoControls: {},
			noFullWindow: {
				msie: /msie [0-6]\./,
				ipad: /ipad.*?os [0-4]\./,
				iphone: /iphone/,
				ipod: /ipod/,
				android_pad: /android [0-3]\.(?!.*?mobile)/,
				android_phone: /android.*?mobile/,
				blackberry: /blackberry/,
				windows_ce: /windows ce/,
				iemobile: /iemobile/,
				webos: /webos/
			},
			noVolume: {
				ipad: /ipad/,
				iphone: /iphone/,
				ipod: /ipod/,
				android_pad: /android(?!.*?mobile)/,
				android_phone: /android.*?mobile/,
				blackberry: /blackberry/,
				windows_ce: /windows ce/,
				iemobile: /iemobile/,
				webos: /webos/,
				playbook: /playbook/
			},
			timeFormat: {},
			keyEnabled: !1,
			audioFullScreen: !1,
			keyBindings: {
				play: {
					key: 32,
					fn: function(a) {
						a.status.paused ? a.play() : a.pause()
					}
				},
				fullScreen: {
					key: 13,
					fn: function(a) {
						(a.status.video || a.options.audioFullScreen) && a._setOption("fullScreen", !a.options.fullScreen)
					}
				},
				muted: {
					key: 8,
					fn: function(a) {
						a._muted(!a.options.muted)
					}
				},
				volumeUp: {
					key: 38,
					fn: function(a) {
						a.volume(a.options.volume + 0.1)
					}
				},
				volumeDown: {
					key: 40,
					fn: function(a) {
						a.volume(a.options.volume - 0.1)
					}
				}
			},
			verticalVolume: !1,
			idPrefix: "jp",
			noConflict: "jQuery",
			emulateHtml: !1,
			errorAlerts: !1,
			warningAlerts: !1
		},
		optionsAudio: {
			size: {
				width: "0px",
				height: "0px",
				cssClass: ""
			},
			sizeFull: {
				width: "0px",
				height: "0px",
				cssClass: ""
			}
		},
		optionsVideo: {
			size: {
				width: "480px",
				height: "270px",
				cssClass: "jp-video-270p"
			},
			sizeFull: {
				width: "100%",
				height: "100%",
				cssClass: "jp-video-full"
			}
		},
		instances: {},
		status: {
			src: "",
			media: {},
			paused: !0,
			format: {},
			formatType: "",
			waitForPlay: !0,
			waitForLoad: !0,
			srcSet: !1,
			video: !1,
			seekPercent: 0,
			currentPercentRelative: 0,
			currentPercentAbsolute: 0,
			currentTime: 0,
			duration: 0,
			videoWidth: 0,
			videoHeight: 0,
			readyState: 0,
			networkState: 0,
			playbackRate: 1,
			ended: 0
		},
		internal: {
			ready: !1
		},
		solution: {
			html: !0,
			flash: !0
		},
		format: {
			mp3: {
				codec: 'audio/mpeg; codecs="mp3"',
				flashCanPlay: !0,
				media: "audio"
			},
			m4a: {
				codec: 'audio/mp4; codecs="mp4a.40.2"',
				flashCanPlay: !0,
				media: "audio"
			},
			oga: {
				codec: 'audio/ogg; codecs="vorbis"',
				flashCanPlay: !1,
				media: "audio"
			},
			wav: {
				codec: 'audio/wav; codecs="1"',
				flashCanPlay: !1,
				media: "audio"
			},
			webma: {
				codec: 'audio/webm; codecs="vorbis"',
				flashCanPlay: !1,
				media: "audio"
			},
			fla: {
				codec: "audio/x-flv",
				flashCanPlay: !0,
				media: "audio"
			},
			rtmpa: {
				codec: 'audio/rtmp; codecs="rtmp"',
				flashCanPlay: !0,
				media: "audio"
			},
			m4v: {
				codec: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
				flashCanPlay: !0,
				media: "video"
			},
			ogv: {
				codec: 'video/ogg; codecs="theora, vorbis"',
				flashCanPlay: !1,
				media: "video"
			},
			webmv: {
				codec: 'video/webm; codecs="vorbis, vp8"',
				flashCanPlay: !1,
				media: "video"
			},
			flv: {
				codec: "video/x-flv",
				flashCanPlay: !0,
				media: "video"
			},
			rtmpv: {
				codec: 'video/rtmp; codecs="rtmp"',
				flashCanPlay: !0,
				media: "video"
			}
		},
		_init: function() {
			var a = this;
			this.element.empty();
			this.status =
				b.extend({}, this.status);
			this.internal = b.extend({}, this.internal);
			this.options.timeFormat = b.extend({}, b.jPlayer.timeFormat, this.options.timeFormat);
			this.internal.cmdsIgnored = b.jPlayer.platform.ipad || b.jPlayer.platform.iphone || b.jPlayer.platform.ipod;
			this.internal.domNode = this.element.get(0);
			this.options.keyEnabled && !b.jPlayer.focus && (b.jPlayer.focus = this);
			this.formats = [];
			this.solutions = [];
			this.require = {};
			this.htmlElement = {};
			this.html = {};
			this.html.audio = {};
			this.html.video = {};
			this.flash = {};
			this.css = {};
			this.css.cs = {};
			this.css.jq = {};
			this.ancestorJq = [];
			this.options.volume = this._limitValue(this.options.volume, 0, 1);
			b.each(this.options.supplied.toLowerCase().split(","), function(c, d) {
				var e = d.replace(/^\s+|\s+$/g, "");
				if (a.format[e]) {
					var f = !1;
					b.each(a.formats, function(a, b) {
						if (e === b) return f = !0, !1
					});
					f || a.formats.push(e)
				}
			});
			b.each(this.options.solution.toLowerCase().split(","), function(c, d) {
				var e = d.replace(/^\s+|\s+$/g, "");
				if (a.solution[e]) {
					var f = !1;
					b.each(a.solutions, function(a, b) {
						if (e === b) return f = !0, !1
					});
					f || a.solutions.push(e)
				}
			});
			this.internal.instance = "jp_" + this.count;
			this.instances[this.internal.instance] = this.element;
			this.element.attr("id") || this.element.attr("id", this.options.idPrefix + "_jplayer_" + this.count);
			this.internal.self = b.extend({}, {
				id: this.element.attr("id"),
				jq: this.element
			});
			this.internal.audio = b.extend({}, {
				id: this.options.idPrefix + "_audio_" + this.count,
				jq: f
			});
			this.internal.video = b.extend({}, {
				id: this.options.idPrefix + "_video_" + this.count,
				jq: f
			});
			this.internal.flash = b.extend({}, {
				id: this.options.idPrefix + "_flash_" + this.count,
				jq: f,
				swf: this.options.swfPath + (".swf" !== this.options.swfPath.toLowerCase().slice(-4) ? (this.options.swfPath && "/" !== this.options.swfPath.slice(-1) ? "/" : "") + "Jplayer.swf" : "")
			});
			this.internal.poster = b.extend({}, {
				id: this.options.idPrefix + "_poster_" + this.count,
				jq: f
			});
			b.each(b.jPlayer.event, function(b, c) {
				a.options[b] !== f && (a.element.bind(c + ".jPlayer", a.options[b]), a.options[b] = f)
			});
			this.require.audio = !1;
			this.require.video = !1;
			b.each(this.formats, function(b, c) {
				a.require[a.format[c].media] = !0
			});
			this.options = this.require.video ? b.extend(!0, {}, this.optionsVideo, this.options) : b.extend(!0, {}, this.optionsAudio, this.options);
			this._setSize();
			this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls);
			this.status.noFullWindow = this._uaBlocklist(this.options.noFullWindow);
			this.status.noVolume = this._uaBlocklist(this.options.noVolume);
			b.jPlayer.nativeFeatures.fullscreen.api.fullscreenEnabled && this._fullscreenAddEventListeners();
			this._restrictNativeVideoControls();
			this.htmlElement.poster =
				document.createElement("img");
			this.htmlElement.poster.id = this.internal.poster.id;
			this.htmlElement.poster.onload = function() {
				(!a.status.video || a.status.waitForPlay) && a.internal.poster.jq.show()
			};
			this.element.append(this.htmlElement.poster);
			this.internal.poster.jq = b("#" + this.internal.poster.id);
			this.internal.poster.jq.css({
				width: this.status.width,
				height: this.status.height
			});
			this.internal.poster.jq.hide();
			this.internal.poster.jq.bind("click.jPlayer", function() {
				a._trigger(b.jPlayer.event.click)
			});
			this.html.audio.available = !1;
			this.require.audio && (this.htmlElement.audio = document.createElement("audio"), this.htmlElement.audio.id = this.internal.audio.id, this.html.audio.available = !! this.htmlElement.audio.canPlayType && this._testCanPlayType(this.htmlElement.audio));
			this.html.video.available = !1;
			this.require.video && (this.htmlElement.video = document.createElement("video"), this.htmlElement.video.id = this.internal.video.id, this.html.video.available = !! this.htmlElement.video.canPlayType && this._testCanPlayType(this.htmlElement.video));
			this.flash.available = this._checkForFlash(10.1);
			this.html.canPlay = {};
			this.flash.canPlay = {};
			b.each(this.formats, function(b, c) {
				a.html.canPlay[c] = a.html[a.format[c].media].available && "" !== a.htmlElement[a.format[c].media].canPlayType(a.format[c].codec);
				a.flash.canPlay[c] = a.format[c].flashCanPlay && a.flash.available
			});
			this.html.desired = !1;
			this.flash.desired = !1;
			b.each(this.solutions, function(c, d) {
				if (0 === c) a[d].desired = !0;
				else {
					var e = !1,
						f = !1;
					b.each(a.formats, function(b, c) {
						a[a.solutions[0]].canPlay[c] && ("video" ===
							a.format[c].media ? f = !0 : e = !0)
					});
					a[d].desired = a.require.audio && !e || a.require.video && !f
				}
			});
			this.html.support = {};
			this.flash.support = {};
			b.each(this.formats, function(b, c) {
				a.html.support[c] = a.html.canPlay[c] && a.html.desired;
				a.flash.support[c] = a.flash.canPlay[c] && a.flash.desired
			});
			this.html.used = !1;
			this.flash.used = !1;
			b.each(this.solutions, function(c, d) {
				b.each(a.formats, function(b, c) {
					if (a[d].support[c]) return a[d].used = !0, !1
				})
			});
			this._resetActive();
			this._resetGate();
			this._cssSelectorAncestor(this.options.cssSelectorAncestor);
			!this.html.used && !this.flash.used ? (this._error({
				type: b.jPlayer.error.NO_SOLUTION,
				context: "{solution:'" + this.options.solution + "', supplied:'" + this.options.supplied + "'}",
				message: b.jPlayer.errorMsg.NO_SOLUTION,
				hint: b.jPlayer.errorHint.NO_SOLUTION
			}), this.css.jq.noSolution.length && this.css.jq.noSolution.show()) : this.css.jq.noSolution.length && this.css.jq.noSolution.hide();
			if (this.flash.used) {
				var c, d = "jQuery=" + encodeURI(this.options.noConflict) + "&id=" + encodeURI(this.internal.self.id) + "&vol=" + this.options.volume +
						"&muted=" + this.options.muted;
				if (b.jPlayer.browser.msie && (9 > Number(b.jPlayer.browser.version) || 9 > b.jPlayer.browser.documentMode)) {
					d = ['<param name="movie" value="' + this.internal.flash.swf + '" />', '<param name="FlashVars" value="' + d + '" />', '<param name="allowScriptAccess" value="always" />', '<param name="bgcolor" value="' + this.options.backgroundColor + '" />', '<param name="wmode" value="' + this.options.wmode + '" />'];
					c = document.createElement('<object id="' + this.internal.flash.id + '" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="0" height="0" tabindex="-1"></object>');
					for (var e = 0; e < d.length; e++) c.appendChild(document.createElement(d[e]))
				} else e = function(a, b, c) {
					var d = document.createElement("param");
					d.setAttribute("name", b);
					d.setAttribute("value", c);
					a.appendChild(d)
				}, c = document.createElement("object"), c.setAttribute("id", this.internal.flash.id), c.setAttribute("name", this.internal.flash.id), c.setAttribute("data", this.internal.flash.swf), c.setAttribute("type", "application/x-shockwave-flash"), c.setAttribute("width", "1"), c.setAttribute("height", "1"), c.setAttribute("tabindex",
					"-1"), e(c, "flashvars", d), e(c, "allowscriptaccess", "always"), e(c, "bgcolor", this.options.backgroundColor), e(c, "wmode", this.options.wmode);
				this.element.append(c);
				this.internal.flash.jq = b(c)
			}
			this.html.used && (this.html.audio.available && (this._addHtmlEventListeners(this.htmlElement.audio, this.html.audio), this.element.append(this.htmlElement.audio), this.internal.audio.jq = b("#" + this.internal.audio.id)), this.html.video.available && (this._addHtmlEventListeners(this.htmlElement.video, this.html.video), this.element.append(this.htmlElement.video),
				this.internal.video.jq = b("#" + this.internal.video.id), this.status.nativeVideoControls ? this.internal.video.jq.css({
					width: this.status.width,
					height: this.status.height
				}) : this.internal.video.jq.css({
					width: "0px",
					height: "0px"
				}), this.internal.video.jq.bind("click.jPlayer", function() {
					a._trigger(b.jPlayer.event.click)
				})));
			this.options.emulateHtml && this._emulateHtmlBridge();
			this.html.used && !this.flash.used && setTimeout(function() {
					a.internal.ready = !0;
					a.version.flash = "n/a";
					a._trigger(b.jPlayer.event.repeat);
					a._trigger(b.jPlayer.event.ready)
				},
				100);
			this._updateNativeVideoControls();
			this.css.jq.videoPlay.length && this.css.jq.videoPlay.hide();
			b.jPlayer.prototype.count++
		},
		destroy: function() {
			this.clearMedia();
			this._removeUiClass();
			this.css.jq.currentTime.length && this.css.jq.currentTime.text("");
			this.css.jq.duration.length && this.css.jq.duration.text("");
			b.each(this.css.jq, function(a, b) {
				b.length && b.unbind(".jPlayer")
			});
			this.internal.poster.jq.unbind(".jPlayer");
			this.internal.video.jq && this.internal.video.jq.unbind(".jPlayer");
			this._fullscreenRemoveEventListeners();
			this === b.jPlayer.focus && (b.jPlayer.focus = null);
			this.options.emulateHtml && this._destroyHtmlBridge();
			this.element.removeData("jPlayer");
			this.element.unbind(".jPlayer");
			this.element.empty();
			delete this.instances[this.internal.instance]
		},
		enable: function() {},
		disable: function() {},
		_testCanPlayType: function(a) {
			try {
				return a.canPlayType(this.format.mp3.codec), !0
			} catch (b) {
				return !1
			}
		},
		_uaBlocklist: function(a) {
			var c = navigator.userAgent.toLowerCase(),
				d = !1;
			b.each(a, function(a, b) {
				if (b && b.test(c)) return d = !0, !1
			});
			return d
		},
		_restrictNativeVideoControls: function() {
			this.require.audio && this.status.nativeVideoControls && (this.status.nativeVideoControls = !1, this.status.noFullWindow = !0)
		},
		_updateNativeVideoControls: function() {
			this.html.video.available && this.html.used && (this.htmlElement.video.controls = this.status.nativeVideoControls, this._updateAutohide(), this.status.nativeVideoControls && this.require.video ? (this.internal.poster.jq.hide(), this.internal.video.jq.css({
					width: this.status.width,
					height: this.status.height
				})) :
				this.status.waitForPlay && this.status.video && (this.internal.poster.jq.show(), this.internal.video.jq.css({
					width: "0px",
					height: "0px"
				})))
		},
		_addHtmlEventListeners: function(a, c) {
			var d = this;
			a.preload = this.options.preload;
			a.muted = this.options.muted;
			a.volume = this.options.volume;
			a.addEventListener("progress", function() {
				c.gate && (d.internal.cmdsIgnored && 0 < this.readyState && (d.internal.cmdsIgnored = !1), d._getHtmlStatus(a), d._updateInterface(), d._trigger(b.jPlayer.event.progress))
			}, !1);
			a.addEventListener("timeupdate",
				function() {
					c.gate && (d._getHtmlStatus(a), d._updateInterface(), d._trigger(b.jPlayer.event.timeupdate))
				}, !1);
			a.addEventListener("durationchange", function() {
				c.gate && (d._getHtmlStatus(a), d._updateInterface(), d._trigger(b.jPlayer.event.durationchange))
			}, !1);
			a.addEventListener("play", function() {
				c.gate && (d._updateButtons(!0), d._html_checkWaitForPlay(), d._trigger(b.jPlayer.event.play))
			}, !1);
			a.addEventListener("playing", function() {
				c.gate && (d._updateButtons(!0), d._seeked(), d._trigger(b.jPlayer.event.playing))
			}, !1);
			a.addEventListener("pause", function() {
				c.gate && (d._updateButtons(!1), d._trigger(b.jPlayer.event.pause))
			}, !1);
			a.addEventListener("waiting", function() {
				c.gate && (d._seeking(), d._trigger(b.jPlayer.event.waiting))
			}, !1);
			a.addEventListener("seeking", function() {
				c.gate && (d._seeking(), d._trigger(b.jPlayer.event.seeking))
			}, !1);
			a.addEventListener("seeked", function() {
				c.gate && (d._seeked(), d._trigger(b.jPlayer.event.seeked))
			}, !1);
			a.addEventListener("volumechange", function() {
				c.gate && (d.options.volume = a.volume,
					d.options.muted = a.muted, d._updateMute(), d._updateVolume(), d._trigger(b.jPlayer.event.volumechange))
			}, !1);
			a.addEventListener("suspend", function() {
				c.gate && (d._seeked(), d._trigger(b.jPlayer.event.suspend))
			}, !1);
			a.addEventListener("ended", function() {
				c.gate && (b.jPlayer.browser.webkit || (d.htmlElement.media.currentTime = 0), d.htmlElement.media.pause(), d._updateButtons(!1), d._getHtmlStatus(a, !0), d._updateInterface(), d._trigger(b.jPlayer.event.ended))
			}, !1);
			a.addEventListener("error", function() {
				c.gate && (d._updateButtons(!1),
					d._seeked(), d.status.srcSet && (clearTimeout(d.internal.htmlDlyCmdId), d.status.waitForLoad = !0, d.status.waitForPlay = !0, d.status.video && !d.status.nativeVideoControls && d.internal.video.jq.css({
						width: "0px",
						height: "0px"
					}), d._validString(d.status.media.poster) && !d.status.nativeVideoControls && d.internal.poster.jq.show(), d.css.jq.videoPlay.length && d.css.jq.videoPlay.show(), d._error({
						type: b.jPlayer.error.URL,
						context: d.status.src,
						message: b.jPlayer.errorMsg.URL,
						hint: b.jPlayer.errorHint.URL
					})))
			}, !1);
			b.each(b.jPlayer.htmlEvent,
				function(e, g) {
					a.addEventListener(this, function() {
						c.gate && d._trigger(b.jPlayer.event[g])
					}, !1)
				})
		},
		_getHtmlStatus: function(a, b) {
			var d = 0,
				e = 0,
				g = 0,
				f = 0;
			isFinite(a.duration) && (this.status.duration = a.duration);
			d = a.currentTime;
			e = 0 < this.status.duration ? 100 * d / this.status.duration : 0;
			"object" === typeof a.seekable && 0 < a.seekable.length ? (g = 0 < this.status.duration ? 100 * a.seekable.end(a.seekable.length - 1) / this.status.duration : 100, f = 0 < this.status.duration ? 100 * a.currentTime / a.seekable.end(a.seekable.length - 1) : 0) : (g = 100,
				f = e);
			b && (e = f = d = 0);
			this.status.seekPercent = g;
			this.status.currentPercentRelative = f;
			this.status.currentPercentAbsolute = e;
			this.status.currentTime = d;
			this.status.videoWidth = a.videoWidth;
			this.status.videoHeight = a.videoHeight;
			this.status.readyState = a.readyState;
			this.status.networkState = a.networkState;
			this.status.playbackRate = a.playbackRate;
			this.status.ended = a.ended
		},
		_resetStatus: function() {
			this.status = b.extend({}, this.status, b.jPlayer.prototype.status)
		},
		_trigger: function(a, c, d) {
			a = b.Event(a);
			a.jPlayer = {};
			a.jPlayer.version = b.extend({}, this.version);
			a.jPlayer.options = b.extend(!0, {}, this.options);
			a.jPlayer.status = b.extend(!0, {}, this.status);
			a.jPlayer.html = b.extend(!0, {}, this.html);
			a.jPlayer.flash = b.extend(!0, {}, this.flash);
			c && (a.jPlayer.error = b.extend({}, c));
			d && (a.jPlayer.warning = b.extend({}, d));
			this.element.trigger(a)
		},
		jPlayerFlashEvent: function(a, c) {
			if (a === b.jPlayer.event.ready)
				if (this.internal.ready) {
					if (this.flash.gate) {
						if (this.status.srcSet) {
							var d = this.status.currentTime,
								e = this.status.paused;
							this.setMedia(this.status.media);
							0 < d && (e ? this.pause(d) : this.play(d))
						}
						this._trigger(b.jPlayer.event.flashreset)
					}
				} else this.internal.ready = !0, this.internal.flash.jq.css({
					width: "0px",
					height: "0px"
				}), this.version.flash = c.version, this.version.needFlash !== this.version.flash && this._error({
					type: b.jPlayer.error.VERSION,
					context: this.version.flash,
					message: b.jPlayer.errorMsg.VERSION + this.version.flash,
					hint: b.jPlayer.errorHint.VERSION
				}), this._trigger(b.jPlayer.event.repeat), this._trigger(a);
			if (this.flash.gate) switch (a) {
				case b.jPlayer.event.progress:
					this._getFlashStatus(c);
					this._updateInterface();
					this._trigger(a);
					break;
				case b.jPlayer.event.timeupdate:
					this._getFlashStatus(c);
					this._updateInterface();
					this._trigger(a);
					break;
				case b.jPlayer.event.play:
					this._seeked();
					this._updateButtons(!0);
					this._trigger(a);
					break;
				case b.jPlayer.event.pause:
					this._updateButtons(!1);
					this._trigger(a);
					break;
				case b.jPlayer.event.ended:
					this._updateButtons(!1);
					this._trigger(a);
					break;
				case b.jPlayer.event.click:
					this._trigger(a);
					break;
				case b.jPlayer.event.error:
					this.status.waitForLoad = !0;
					this.status.waitForPlay = !0;
					this.status.video && this.internal.flash.jq.css({
						width: "0px",
						height: "0px"
					});
					this._validString(this.status.media.poster) && this.internal.poster.jq.show();
					this.css.jq.videoPlay.length && this.status.video && this.css.jq.videoPlay.show();
					this.status.video ? this._flash_setVideo(this.status.media) : this._flash_setAudio(this.status.media);
					this._updateButtons(!1);
					this._error({
						type: b.jPlayer.error.URL,
						context: c.src,
						message: b.jPlayer.errorMsg.URL,
						hint: b.jPlayer.errorHint.URL
					});
					break;
				case b.jPlayer.event.seeking:
					this._seeking();
					this._trigger(a);
					break;
				case b.jPlayer.event.seeked:
					this._seeked();
					this._trigger(a);
					break;
				case b.jPlayer.event.ready:
					break;
				default:
					this._trigger(a)
			}
			return !1
		},
		_getFlashStatus: function(a) {
			this.status.seekPercent = a.seekPercent;
			this.status.currentPercentRelative = a.currentPercentRelative;
			this.status.currentPercentAbsolute = a.currentPercentAbsolute;
			this.status.currentTime = a.currentTime;
			this.status.duration = a.duration;
			this.status.videoWidth = a.videoWidth;
			this.status.videoHeight = a.videoHeight;
			this.status.readyState =
				4;
			this.status.networkState = 0;
			this.status.playbackRate = 1;
			this.status.ended = !1
		},
		_updateButtons: function(a) {
			a === f ? a = !this.status.paused : this.status.paused = !a;
			this.css.jq.play.length && this.css.jq.pause.length && (a ? (this.css.jq.play.hide(), this.css.jq.pause.show()) : (this.css.jq.play.show(), this.css.jq.pause.hide()));
			this.css.jq.restoreScreen.length && this.css.jq.fullScreen.length && (this.status.noFullWindow ? (this.css.jq.fullScreen.hide(), this.css.jq.restoreScreen.hide()) : this.options.fullWindow ? (this.css.jq.fullScreen.hide(),
				this.css.jq.restoreScreen.show()) : (this.css.jq.fullScreen.show(), this.css.jq.restoreScreen.hide()));
			this.css.jq.repeat.length && this.css.jq.repeatOff.length && (this.options.loop ? (this.css.jq.repeat.hide(), this.css.jq.repeatOff.show()) : (this.css.jq.repeat.show(), this.css.jq.repeatOff.hide()))
		},
		_updateInterface: function() {
			this.css.jq.seekBar.length && this.css.jq.seekBar.width(this.status.seekPercent + "%");
			this.css.jq.playBar.length && (this.options.smoothPlayBar ? this.css.jq.playBar.stop().animate({
				width: this.status.currentPercentAbsolute + "%"
			}, 250, "linear") : this.css.jq.playBar.width(this.status.currentPercentRelative + "%"));
			this.css.jq.currentTime.length && this.css.jq.currentTime.text(this._convertTime(this.status.currentTime));
			this.css.jq.duration.length && this.css.jq.duration.text(this._convertTime(this.status.duration))
		},
		_convertTime: l.prototype.time,
		_seeking: function() {
			this.css.jq.seekBar.length && this.css.jq.seekBar.addClass("jp-seeking-bg")
		},
		_seeked: function() {
			this.css.jq.seekBar.length && this.css.jq.seekBar.removeClass("jp-seeking-bg")
		},
		_resetGate: function() {
			this.html.audio.gate = !1;
			this.html.video.gate = !1;
			this.flash.gate = !1
		},
		_resetActive: function() {
			this.html.active = !1;
			this.flash.active = !1
		},
		setMedia: function(a) {
			var c = this,
				d = !1,
				e = this.status.media.poster !== a.poster;
			this._resetMedia();
			this._resetGate();
			this._resetActive();
			b.each(this.formats, function(e, f) {
				var j = "video" === c.format[f].media;
				b.each(c.solutions, function(b, e) {
					if (c[e].support[f] && c._validString(a[f])) {
						var g = "html" === e;
						j ? (g ? (c.html.video.gate = !0, c._html_setVideo(a), c.html.active = !0) : (c.flash.gate = !0, c._flash_setVideo(a), c.flash.active = !0), c.css.jq.videoPlay.length && c.css.jq.videoPlay.show(), c.status.video = !0) : (g ? (c.html.audio.gate = !0, c._html_setAudio(a), c.html.active = !0) : (c.flash.gate = !0, c._flash_setAudio(a), c.flash.active = !0), c.css.jq.videoPlay.length && c.css.jq.videoPlay.hide(), c.status.video = !1);
						d = !0;
						return !1
					}
				});
				if (d) return !1
			});
			if (d) {
				if ((!this.status.nativeVideoControls || !this.html.video.gate) && this._validString(a.poster)) e ? this.htmlElement.poster.src = a.poster : this.internal.poster.jq.show();
				this.status.srcSet = !0;
				this.status.media = b.extend({}, a);
				this._updateButtons(!1);
				this._updateInterface()
			} else this._error({
				type: b.jPlayer.error.NO_SUPPORT,
				context: "{supplied:'" + this.options.supplied + "'}",
				message: b.jPlayer.errorMsg.NO_SUPPORT,
				hint: b.jPlayer.errorHint.NO_SUPPORT
			})
		},
		_resetMedia: function() {
			this._resetStatus();
			this._updateButtons(!1);
			this._updateInterface();
			this._seeked();
			this.internal.poster.jq.hide();
			clearTimeout(this.internal.htmlDlyCmdId);
			this.html.active ? this._html_resetMedia() : this.flash.active &&
				this._flash_resetMedia()
		},
		clearMedia: function() {
			this._resetMedia();
			this.html.active ? this._html_clearMedia() : this.flash.active && this._flash_clearMedia();
			this._resetGate();
			this._resetActive()
		},
		load: function() {
			this.status.srcSet ? this.html.active ? this._html_load() : this.flash.active && this._flash_load() : this._urlNotSetError("load")
		},
		focus: function() {
			this.options.keyEnabled && (b.jPlayer.focus = this)
		},
		play: function(a) {
			a = "number" === typeof a ? a : NaN;
			this.status.srcSet ? (this.focus(), this.html.active ? this._html_play(a) :
				this.flash.active && this._flash_play(a)) : this._urlNotSetError("play")
		},
		videoPlay: function() {
			this.play()
		},
		pause: function(a) {
			a = "number" === typeof a ? a : NaN;
			this.status.srcSet ? this.html.active ? this._html_pause(a) : this.flash.active && this._flash_pause(a) : this._urlNotSetError("pause")
		},
		pauseOthers: function() {
			var a = this;
			b.each(this.instances, function(b, d) {
				a.element !== d && d.data("jPlayer").status.srcSet && d.jPlayer("pause")
			})
		},
		stop: function() {
			this.status.srcSet ? this.html.active ? this._html_pause(0) : this.flash.active &&
				this._flash_pause(0) : this._urlNotSetError("stop")
		},
		playHead: function(a) {
			a = this._limitValue(a, 0, 100);
			this.status.srcSet ? this.html.active ? this._html_playHead(a) : this.flash.active && this._flash_playHead(a) : this._urlNotSetError("playHead")
		},
		_muted: function(a) {
			this.options.muted = a;
			this.html.used && this._html_mute(a);
			this.flash.used && this._flash_mute(a);
			!this.html.video.gate && !this.html.audio.gate && (this._updateMute(a), this._updateVolume(this.options.volume), this._trigger(b.jPlayer.event.volumechange))
		},
		mute: function(a) {
			a = a === f ? !0 : !! a;
			this._muted(a)
		},
		unmute: function(a) {
			a = a === f ? !0 : !! a;
			this._muted(!a)
		},
		_updateMute: function(a) {
			a === f && (a = this.options.muted);
			this.css.jq.mute.length && this.css.jq.unmute.length && (this.status.noVolume ? (this.css.jq.mute.hide(), this.css.jq.unmute.hide()) : a ? (this.css.jq.mute.hide(), this.css.jq.unmute.show()) : (this.css.jq.mute.show(), this.css.jq.unmute.hide()))
		},
		volume: function(a) {
			a = this._limitValue(a, 0, 1);
			this.options.volume = a;
			this.html.used && this._html_volume(a);
			this.flash.used &&
				this._flash_volume(a);
			!this.html.video.gate && !this.html.audio.gate && (this._updateVolume(a), this._trigger(b.jPlayer.event.volumechange))
		},
		volumeBar: function(a) {
			if (this.css.jq.volumeBar.length) {
				var c = b(a.currentTarget),
					d = c.offset(),
					e = a.pageX - d.left,
					g = c.width();
				a = c.height() - a.pageY + d.top;
				c = c.height();
				this.options.verticalVolume ? this.volume(a / c) : this.volume(e / g)
			}
			this.options.muted && this._muted(!1)
		},
		volumeBarValue: function() {},
		_updateVolume: function(a) {
			a === f && (a = this.options.volume);
			a = this.options.muted ?
				0 : a;
			this.status.noVolume ? (this.css.jq.volumeBar.length && this.css.jq.volumeBar.hide(), this.css.jq.volumeBarValue.length && this.css.jq.volumeBarValue.hide(), this.css.jq.volumeMax.length && this.css.jq.volumeMax.hide()) : (this.css.jq.volumeBar.length && this.css.jq.volumeBar.show(), this.css.jq.volumeBarValue.length && (this.css.jq.volumeBarValue.show(), this.css.jq.volumeBarValue[this.options.verticalVolume ? "height" : "width"](100 * a + "%")), this.css.jq.volumeMax.length && this.css.jq.volumeMax.show())
		},
		volumeMax: function() {
			this.volume(1);
			this.options.muted && this._muted(!1)
		},
		_cssSelectorAncestor: function(a) {
			var c = this;
			this.options.cssSelectorAncestor = a;
			this._removeUiClass();
			this.ancestorJq = a ? b(a) : [];
			a && 1 !== this.ancestorJq.length && this._warning({
				type: b.jPlayer.warning.CSS_SELECTOR_COUNT,
				context: a,
				message: b.jPlayer.warningMsg.CSS_SELECTOR_COUNT + this.ancestorJq.length + " found for cssSelectorAncestor.",
				hint: b.jPlayer.warningHint.CSS_SELECTOR_COUNT
			});
			this._addUiClass();
			b.each(this.options.cssSelector, function(a, b) {
				c._cssSelector(a, b)
			});
			this._updateInterface();
			this._updateButtons();
			this._updateAutohide();
			this._updateVolume();
			this._updateMute()
		},
		_cssSelector: function(a, c) {
			var d = this;
			"string" === typeof c ? b.jPlayer.prototype.options.cssSelector[a] ? (this.css.jq[a] && this.css.jq[a].length && this.css.jq[a].unbind(".jPlayer"), this.options.cssSelector[a] = c, this.css.cs[a] = this.options.cssSelectorAncestor + " " + c, this.css.jq[a] = c ? b(this.css.cs[a]) : [], this.css.jq[a].length && this.css.jq[a].bind("click.jPlayer", function(c) {
				c.preventDefault();
				d[a](c);
				b(this).blur()
			}), c && 1 !== this.css.jq[a].length && this._warning({
				type: b.jPlayer.warning.CSS_SELECTOR_COUNT,
				context: this.css.cs[a],
				message: b.jPlayer.warningMsg.CSS_SELECTOR_COUNT + this.css.jq[a].length + " found for " + a + " method.",
				hint: b.jPlayer.warningHint.CSS_SELECTOR_COUNT
			})) : this._warning({
				type: b.jPlayer.warning.CSS_SELECTOR_METHOD,
				context: a,
				message: b.jPlayer.warningMsg.CSS_SELECTOR_METHOD,
				hint: b.jPlayer.warningHint.CSS_SELECTOR_METHOD
			}) : this._warning({
				type: b.jPlayer.warning.CSS_SELECTOR_STRING,
				context: c,
				message: b.jPlayer.warningMsg.CSS_SELECTOR_STRING,
				hint: b.jPlayer.warningHint.CSS_SELECTOR_STRING
			})
		},
		seekBar: function(a) {
			if (this.css.jq.seekBar.length) {
				var c = b(a.currentTarget),
					d = c.offset();
				a = a.pageX - d.left;
				c = c.width();
				this.playHead(100 * a / c)
			}
		},
		playBar: function() {},
		repeat: function() {
			this._loop(!0)
		},
		repeatOff: function() {
			this._loop(!1)
		},
		_loop: function(a) {
			this.options.loop !== a && (this.options.loop = a, this._updateButtons(), this._trigger(b.jPlayer.event.repeat))
		},
		currentTime: function() {},
		duration: function() {},
		gui: function() {},
		noSolution: function() {},
		option: function(a, c) {
			var d = a;
			if (0 === arguments.length) return b.extend(!0, {}, this.options);
			if ("string" === typeof a) {
				var e = a.split(".");
				if (c === f) {
					for (var d = b.extend(!0, {}, this.options), g = 0; g < e.length; g++)
						if (d[e[g]] !== f) d = d[e[g]];
						else return this._warning({
							type: b.jPlayer.warning.OPTION_KEY,
							context: a,
							message: b.jPlayer.warningMsg.OPTION_KEY,
							hint: b.jPlayer.warningHint.OPTION_KEY
						}), f;
					return d
				}
				for (var g = d = {}, h = 0; h < e.length; h++) h < e.length - 1 ? (g[e[h]] = {}, g = g[e[h]]) : g[e[h]] =
					c
			}
			this._setOptions(d);
			return this
		},
		_setOptions: function(a) {
			var c = this;
			b.each(a, function(a, b) {
				c._setOption(a, b)
			});
			return this
		},
		_setOption: function(a, c) {
			var d = this;
			switch (a) {
				case "volume":
					this.volume(c);
					break;
				case "muted":
					this._muted(c);
					break;
				case "cssSelectorAncestor":
					this._cssSelectorAncestor(c);
					break;
				case "cssSelector":
					b.each(c, function(a, b) {
						d._cssSelector(a, b)
					});
					break;
				case "fullScreen":
					if (this.options[a] !== c) {
						var e = b.jPlayer.nativeFeatures.fullscreen.used.webkitVideo;
						if (!e || e && !this.status.waitForPlay) e ||
							(this.options[a] = c), c ? this._requestFullscreen() : this._exitFullscreen(), e || this._setOption("fullWindow", c)
					}
					break;
				case "fullWindow":
					this.options[a] !== c && (this._removeUiClass(), this.options[a] = c, this._refreshSize());
					break;
				case "size":
					!this.options.fullWindow && this.options[a].cssClass !== c.cssClass && this._removeUiClass();
					this.options[a] = b.extend({}, this.options[a], c);
					this._refreshSize();
					break;
				case "sizeFull":
					this.options.fullWindow && this.options[a].cssClass !== c.cssClass && this._removeUiClass();
					this.options[a] =
						b.extend({}, this.options[a], c);
					this._refreshSize();
					break;
				case "autohide":
					this.options[a] = b.extend({}, this.options[a], c);
					this._updateAutohide();
					break;
				case "loop":
					this._loop(c);
					break;
				case "nativeVideoControls":
					this.options[a] = b.extend({}, this.options[a], c);
					this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls);
					this._restrictNativeVideoControls();
					this._updateNativeVideoControls();
					break;
				case "noFullWindow":
					this.options[a] = b.extend({}, this.options[a], c);
					this.status.nativeVideoControls =
						this._uaBlocklist(this.options.nativeVideoControls);
					this.status.noFullWindow = this._uaBlocklist(this.options.noFullWindow);
					this._restrictNativeVideoControls();
					this._updateButtons();
					break;
				case "noVolume":
					this.options[a] = b.extend({}, this.options[a], c);
					this.status.noVolume = this._uaBlocklist(this.options.noVolume);
					this._updateVolume();
					this._updateMute();
					break;
				case "emulateHtml":
					this.options[a] !== c && ((this.options[a] = c) ? this._emulateHtmlBridge() : this._destroyHtmlBridge());
					break;
				case "timeFormat":
					this.options[a] =
						b.extend({}, this.options[a], c);
					break;
				case "keyEnabled":
					this.options[a] = c;
					!c && this === b.jPlayer.focus && (b.jPlayer.focus = null);
					break;
				case "keyBindings":
					this.options[a] = b.extend(!0, {}, this.options[a], c);
					break;
				case "audioFullScreen":
					this.options[a] = c
			}
			return this
		},
		_refreshSize: function() {
			this._setSize();
			this._addUiClass();
			this._updateSize();
			this._updateButtons();
			this._updateAutohide();
			this._trigger(b.jPlayer.event.resize)
		},
		_setSize: function() {
			this.options.fullWindow ? (this.status.width = this.options.sizeFull.width,
				this.status.height = this.options.sizeFull.height, this.status.cssClass = this.options.sizeFull.cssClass) : (this.status.width = this.options.size.width, this.status.height = this.options.size.height, this.status.cssClass = this.options.size.cssClass);
			this.element.css({
				width: this.status.width,
				height: this.status.height
			})
		},
		_addUiClass: function() {
			this.ancestorJq.length && this.ancestorJq.addClass(this.status.cssClass)
		},
		_removeUiClass: function() {
			this.ancestorJq.length && this.ancestorJq.removeClass(this.status.cssClass)
		},
		_updateSize: function() {
			this.internal.poster.jq.css({
				width: this.status.width,
				height: this.status.height
			});
			!this.status.waitForPlay && this.html.active && this.status.video || this.html.video.available && this.html.used && this.status.nativeVideoControls ? this.internal.video.jq.css({
				width: this.status.width,
				height: this.status.height
			}) : !this.status.waitForPlay && (this.flash.active && this.status.video) && this.internal.flash.jq.css({
				width: this.status.width,
				height: this.status.height
			})
		},
		_updateAutohide: function() {
			var a =
				this,
				b = function() {
					a.css.jq.gui.fadeIn(a.options.autohide.fadeIn, function() {
						clearTimeout(a.internal.autohideId);
						a.internal.autohideId = setTimeout(function() {
							a.css.jq.gui.fadeOut(a.options.autohide.fadeOut)
						}, a.options.autohide.hold)
					})
				};
			this.css.jq.gui.length && (this.css.jq.gui.stop(!0, !0), clearTimeout(this.internal.autohideId), this.element.unbind(".jPlayerAutohide"), this.css.jq.gui.unbind(".jPlayerAutohide"), this.status.nativeVideoControls ? this.css.jq.gui.hide() : this.options.fullWindow && this.options.autohide.full || !this.options.fullWindow && this.options.autohide.restored ? (this.element.bind("mousemove.jPlayer.jPlayerAutohide", b), this.css.jq.gui.bind("mousemove.jPlayer.jPlayerAutohide", b), this.css.jq.gui.hide()) : this.css.jq.gui.show())
		},
		fullScreen: function() {
			this._setOption("fullScreen", !0)
		},
		restoreScreen: function() {
			this._setOption("fullScreen", !1)
		},
		_fullscreenAddEventListeners: function() {
			var a = this,
				c = b.jPlayer.nativeFeatures.fullscreen;
			c.api.fullscreenEnabled && c.event.fullscreenchange && ("function" !== typeof this.internal.fullscreenchangeHandler &&
				(this.internal.fullscreenchangeHandler = function() {
					a._fullscreenchange()
				}), document.addEventListener(c.event.fullscreenchange, this.internal.fullscreenchangeHandler, !1))
		},
		_fullscreenRemoveEventListeners: function() {
			var a = b.jPlayer.nativeFeatures.fullscreen;
			this.internal.fullscreenchangeHandler && document.addEventListener(a.event.fullscreenchange, this.internal.fullscreenchangeHandler, !1)
		},
		_fullscreenchange: function() {
			this.options.fullScreen && !b.jPlayer.nativeFeatures.fullscreen.api.fullscreenElement() &&
				this._setOption("fullScreen", !1)
		},
		_requestFullscreen: function() {
			var a = this.ancestorJq.length ? this.ancestorJq[0] : this.element[0],
				c = b.jPlayer.nativeFeatures.fullscreen;
			c.used.webkitVideo && (a = this.htmlElement.video);
			c.api.fullscreenEnabled && c.api.requestFullscreen(a)
		},
		_exitFullscreen: function() {
			var a = b.jPlayer.nativeFeatures.fullscreen,
				c;
			a.used.webkitVideo && (c = this.htmlElement.video);
			a.api.fullscreenEnabled && a.api.exitFullscreen(c)
		},
		_html_initMedia: function(a) {
			var c = b(this.htmlElement.media).empty();
			b.each(a.track || [], function(a, b) {
				var g = document.createElement("track");
				g.setAttribute("kind", b.kind ? b.kind : "");
				g.setAttribute("src", b.src ? b.src : "");
				g.setAttribute("srclang", b.srclang ? b.srclang : "");
				g.setAttribute("label", b.label ? b.label : "");
				b.def && g.setAttribute("default", b.def);
				c.append(g)
			});
			this.htmlElement.media.src = this.status.src;
			"none" !== this.options.preload && this._html_load();
			this._trigger(b.jPlayer.event.timeupdate)
		},
		_html_setFormat: function(a) {
			var c = this;
			b.each(this.formats, function(b, e) {
				if (c.html.support[e] &&
					a[e]) return c.status.src = a[e], c.status.format[e] = !0, c.status.formatType = e, !1
			})
		},
		_html_setAudio: function(a) {
			this._html_setFormat(a);
			this.htmlElement.media = this.htmlElement.audio;
			this._html_initMedia(a)
		},
		_html_setVideo: function(a) {
			this._html_setFormat(a);
			this.status.nativeVideoControls && (this.htmlElement.video.poster = this._validString(a.poster) ? a.poster : "");
			this.htmlElement.media = this.htmlElement.video;
			this._html_initMedia(a)
		},
		_html_resetMedia: function() {
			this.htmlElement.media && (this.htmlElement.media.id ===
				this.internal.video.id && !this.status.nativeVideoControls && this.internal.video.jq.css({
					width: "0px",
					height: "0px"
				}), this.htmlElement.media.pause())
		},
		_html_clearMedia: function() {
			this.htmlElement.media && (this.htmlElement.media.src = "about:blank", this.htmlElement.media.load())
		},
		_html_load: function() {
			this.status.waitForLoad && (this.status.waitForLoad = !1, this.htmlElement.media.load());
			clearTimeout(this.internal.htmlDlyCmdId)
		},
		_html_play: function(a) {
			var b = this,
				d = this.htmlElement.media;
			this._html_load();
			if (isNaN(a)) d.play();
			else {
				this.internal.cmdsIgnored && d.play();
				try {
					if (!d.seekable || "object" === typeof d.seekable && 0 < d.seekable.length) d.currentTime = a, d.play();
					else throw 1;
				} catch (e) {
					this.internal.htmlDlyCmdId = setTimeout(function() {
						b.play(a)
					}, 250);
					return
				}
			}
			this._html_checkWaitForPlay()
		},
		_html_pause: function(a) {
			var b = this,
				d = this.htmlElement.media;
			0 < a ? this._html_load() : clearTimeout(this.internal.htmlDlyCmdId);
			d.pause();
			if (!isNaN(a)) try {
				if (!d.seekable || "object" === typeof d.seekable && 0 < d.seekable.length) d.currentTime = a;
				else throw 1;
			} catch (e) {
				this.internal.htmlDlyCmdId = setTimeout(function() {
					b.pause(a)
				}, 250);
				return
			}
			0 < a && this._html_checkWaitForPlay()
		},
		_html_playHead: function(a) {
			var b = this,
				d = this.htmlElement.media;
			this._html_load();
			try {
				if ("object" === typeof d.seekable && 0 < d.seekable.length) d.currentTime = a * d.seekable.end(d.seekable.length - 1) / 100;
				else if (0 < d.duration && !isNaN(d.duration)) d.currentTime = a * d.duration / 100;
				else throw "e";
			} catch (e) {
				this.internal.htmlDlyCmdId = setTimeout(function() {
					b.playHead(a)
				}, 250);
				return
			}
			this.status.waitForLoad ||
				this._html_checkWaitForPlay()
		},
		_html_checkWaitForPlay: function() {
			this.status.waitForPlay && (this.status.waitForPlay = !1, this.css.jq.videoPlay.length && this.css.jq.videoPlay.hide(), this.status.video && (this.internal.poster.jq.hide(), this.internal.video.jq.css({
				width: this.status.width,
				height: this.status.height
			})))
		},
		_html_volume: function(a) {
			this.html.audio.available && (this.htmlElement.audio.volume = a);
			this.html.video.available && (this.htmlElement.video.volume = a)
		},
		_html_mute: function(a) {
			this.html.audio.available &&
				(this.htmlElement.audio.muted = a);
			this.html.video.available && (this.htmlElement.video.muted = a)
		},
		_flash_setAudio: function(a) {
			var c = this;
			try {
				b.each(this.formats, function(b, d) {
					if (c.flash.support[d] && a[d]) {
						switch (d) {
							case "m4a":
							case "fla":
								c._getMovie().fl_setAudio_m4a(a[d]);
								break;
							case "mp3":
								c._getMovie().fl_setAudio_mp3(a[d]);
								break;
							case "rtmpa":
								c._getMovie().fl_setAudio_rtmp(a[d])
						}
						c.status.src = a[d];
						c.status.format[d] = !0;
						c.status.formatType = d;
						return !1
					}
				}), "auto" === this.options.preload && (this._flash_load(),
					this.status.waitForLoad = !1)
			} catch (d) {
				this._flashError(d)
			}
		},
		_flash_setVideo: function(a) {
			var c = this;
			try {
				b.each(this.formats, function(b, d) {
					if (c.flash.support[d] && a[d]) {
						switch (d) {
							case "m4v":
							case "flv":
								c._getMovie().fl_setVideo_m4v(a[d]);
								break;
							case "rtmpv":
								c._getMovie().fl_setVideo_rtmp(a[d])
						}
						c.status.src = a[d];
						c.status.format[d] = !0;
						c.status.formatType = d;
						return !1
					}
				}), "auto" === this.options.preload && (this._flash_load(), this.status.waitForLoad = !1)
			} catch (d) {
				this._flashError(d)
			}
		},
		_flash_resetMedia: function() {
			this.internal.flash.jq.css({
				width: "0px",
				height: "0px"
			});
			this._flash_pause(NaN)
		},
		_flash_clearMedia: function() {
			try {
				this._getMovie().fl_clearMedia()
			} catch (a) {
				this._flashError(a)
			}
		},
		_flash_load: function() {
			try {
				this._getMovie().fl_load()
			} catch (a) {
				this._flashError(a)
			}
			this.status.waitForLoad = !1
		},
		_flash_play: function(a) {
			try {
				this._getMovie().fl_play(a)
			} catch (b) {
				this._flashError(b)
			}
			this.status.waitForLoad = !1;
			this._flash_checkWaitForPlay()
		},
		_flash_pause: function(a) {
			try {
				this._getMovie().fl_pause(a)
			} catch (b) {
				this._flashError(b)
			}
			0 < a && (this.status.waitForLoad = !1, this._flash_checkWaitForPlay())
		},
		_flash_playHead: function(a) {
			try {
				this._getMovie().fl_play_head(a)
			} catch (b) {
				this._flashError(b)
			}
			this.status.waitForLoad || this._flash_checkWaitForPlay()
		},
		_flash_checkWaitForPlay: function() {
			this.status.waitForPlay && (this.status.waitForPlay = !1, this.css.jq.videoPlay.length && this.css.jq.videoPlay.hide(), this.status.video && (this.internal.poster.jq.hide(), this.internal.flash.jq.css({
				width: this.status.width,
				height: this.status.height
			})))
		},
		_flash_volume: function(a) {
			try {
				this._getMovie().fl_volume(a)
			} catch (b) {
				this._flashError(b)
			}
		},
		_flash_mute: function(a) {
			try {
				this._getMovie().fl_mute(a)
			} catch (b) {
				this._flashError(b)
			}
		},
		_getMovie: function() {
			return document[this.internal.flash.id]
		},
		_getFlashPluginVersion: function() {
			var a = 0,
				b;
			if (window.ActiveXObject) try {
				if (b = new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) {
					var d = b.GetVariable("$version");
					d && (d = d.split(" ")[1].split(","), a = parseInt(d[0], 10) + "." + parseInt(d[1], 10))
				}
			} catch (e) {} else navigator.plugins && 0 < navigator.mimeTypes.length && (b = navigator.plugins["Shockwave Flash"]) && (a = navigator.plugins["Shockwave Flash"].description.replace(/.*\s(\d+\.\d+).*/,
				"$1"));
			return 1 * a
		},
		_checkForFlash: function(a) {
			var b = !1;
			this._getFlashPluginVersion() >= a && (b = !0);
			return b
		},
		_validString: function(a) {
			return a && "string" === typeof a
		},
		_limitValue: function(a, b, d) {
			return a < b ? b : a > d ? d : a
		},
		_urlNotSetError: function(a) {
			this._error({
				type: b.jPlayer.error.URL_NOT_SET,
				context: a,
				message: b.jPlayer.errorMsg.URL_NOT_SET,
				hint: b.jPlayer.errorHint.URL_NOT_SET
			})
		},
		_flashError: function(a) {
			var c;
			c = this.internal.ready ? "FLASH_DISABLED" : "FLASH";
			this._error({
				type: b.jPlayer.error[c],
				context: this.internal.flash.swf,
				message: b.jPlayer.errorMsg[c] + a.message,
				hint: b.jPlayer.errorHint[c]
			});
			this.internal.flash.jq.css({
				width: "1px",
				height: "1px"
			})
		},
		_error: function(a) {
			this._trigger(b.jPlayer.event.error, a);
			this.options.errorAlerts && this._alert("Error!" + (a.message ? "\n\n" + a.message : "") + (a.hint ? "\n\n" + a.hint : "") + "\n\nContext: " + a.context)
		},
		_warning: function(a) {
			this._trigger(b.jPlayer.event.warning, f, a);
			this.options.warningAlerts && this._alert("Warning!" + (a.message ? "\n\n" + a.message : "") + (a.hint ? "\n\n" + a.hint : "") + "\n\nContext: " +
				a.context)
		},
		_alert: function(a) {
			alert("jPlayer " + this.version.script + " : id='" + this.internal.self.id + "' : " + a)
		},
		_emulateHtmlBridge: function() {
			var a = this;
			b.each(b.jPlayer.emulateMethods.split(/\s+/g), function(b, d) {
				a.internal.domNode[d] = function(b) {
					a[d](b)
				}
			});
			b.each(b.jPlayer.event, function(c, d) {
				var e = !0;
				b.each(b.jPlayer.reservedEvent.split(/\s+/g), function(a, b) {
					if (b === c) return e = !1
				});
				e && a.element.bind(d + ".jPlayer.jPlayerHtml", function() {
					a._emulateHtmlUpdate();
					var b = document.createEvent("Event");
					b.initEvent(c, !1, !0);
					a.internal.domNode.dispatchEvent(b)
				})
			})
		},
		_emulateHtmlUpdate: function() {
			var a = this;
			b.each(b.jPlayer.emulateStatus.split(/\s+/g), function(b, d) {
				a.internal.domNode[d] = a.status[d]
			});
			b.each(b.jPlayer.emulateOptions.split(/\s+/g), function(b, d) {
				a.internal.domNode[d] = a.options[d]
			})
		},
		_destroyHtmlBridge: function() {
			var a = this;
			this.element.unbind(".jPlayerHtml");
			b.each((b.jPlayer.emulateMethods + " " + b.jPlayer.emulateStatus + " " + b.jPlayer.emulateOptions).split(/\s+/g), function(b, d) {
				delete a.internal.domNode[d]
			})
		}
	};
	b.jPlayer.error = {
		FLASH: "e_flash",
		FLASH_DISABLED: "e_flash_disabled",
		NO_SOLUTION: "e_no_solution",
		NO_SUPPORT: "e_no_support",
		URL: "e_url",
		URL_NOT_SET: "e_url_not_set",
		VERSION: "e_version"
	};
	b.jPlayer.errorMsg = {
		FLASH: "jPlayer's Flash fallback is not configured correctly, or a command was issued before the jPlayer Ready event. Details: ",
		FLASH_DISABLED: "jPlayer's Flash fallback has been disabled by the browser due to the CSS rules you have used. Details: ",
		NO_SOLUTION: "No solution can be found by jPlayer in this browser. Neither HTML nor Flash can be used.",
		NO_SUPPORT: "It is not possible to play any media format provided in setMedia() on this browser using your current options.",
		URL: "Media URL could not be loaded.",
		URL_NOT_SET: "Attempt to issue media playback commands, while no media url is set.",
		VERSION: "jPlayer " + b.jPlayer.prototype.version.script + " needs Jplayer.swf version " + b.jPlayer.prototype.version.needFlash + " but found "
	};
	b.jPlayer.errorHint = {
		FLASH: "Check your swfPath option and that Jplayer.swf is there.",
		FLASH_DISABLED: "Check that you have not display:none; the jPlayer entity or any ancestor.",
		NO_SOLUTION: "Review the jPlayer options: support and supplied.",
		NO_SUPPORT: "Video or audio formats defined in the supplied option are missing.",
		URL: "Check media URL is valid.",
		URL_NOT_SET: "Use setMedia() to set the media URL.",
		VERSION: "Update jPlayer files."
	};
	b.jPlayer.warning = {
		CSS_SELECTOR_COUNT: "e_css_selector_count",
		CSS_SELECTOR_METHOD: "e_css_selector_method",
		CSS_SELECTOR_STRING: "e_css_selector_string",
		OPTION_KEY: "e_option_key"
	};
	b.jPlayer.warningMsg = {
		CSS_SELECTOR_COUNT: "The number of css selectors found did not equal one: ",
		CSS_SELECTOR_METHOD: "The methodName given in jPlayer('cssSelector') is not a valid jPlayer method.",
		CSS_SELECTOR_STRING: "The methodCssSelector given in jPlayer('cssSelector') is not a String or is empty.",
		OPTION_KEY: "The option requested in jPlayer('option') is undefined."
	};
	b.jPlayer.warningHint = {
		CSS_SELECTOR_COUNT: "Check your css selector and the ancestor.",
		CSS_SELECTOR_METHOD: "Check your method name.",
		CSS_SELECTOR_STRING: "Check your css selector is a string.",
		OPTION_KEY: "Check your option name."
	}
});
(function($) {

	var types = ['DOMMouseScroll', 'mousewheel'];

	if ($.event.fixHooks) {
		for (var i = types.length; i;) {
			$.event.fixHooks[types[--i]] = $.event.mouseHooks;
		}
	}

	$.event.special.mousewheel = {
		setup: function() {
			if (this.addEventListener) {
				for (var i = types.length; i;) {
					this.addEventListener(types[--i], handler, false);
				}
			} else {
				this.onmousewheel = handler;
			}
		},

		teardown: function() {
			if (this.removeEventListener) {
				for (var i = types.length; i;) {
					this.removeEventListener(types[--i], handler, false);
				}
			} else {
				this.onmousewheel = null;
			}
		}
	};

	$.fn.extend({
		mousewheel: function(fn) {
			return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
		},

		unmousewheel: function(fn) {
			return this.unbind("mousewheel", fn);
		}
	});


	function handler(event) {
		var orgEvent = event || window.event,
			args = [].slice.call(arguments, 1),
			delta = 0,
			returnValue = true,
			deltaX = 0,
			deltaY = 0;
		event = $.event.fix(orgEvent);
		event.type = "mousewheel";

		// Old school scrollwheel delta
		if (orgEvent.wheelDelta) {
			delta = orgEvent.wheelDelta / 120;
		}
		if (orgEvent.detail) {
			delta = -orgEvent.detail / 3;
		}

		// New school multidimensional scroll (touchpads) deltas
		deltaY = delta;

		// Gecko
		if (orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
			deltaY = 0;
			deltaX = -1 * delta;
		}

		// Webkit
		if (orgEvent.wheelDeltaY !== undefined) {
			deltaY = orgEvent.wheelDeltaY / 120;
		}
		if (orgEvent.wheelDeltaX !== undefined) {
			deltaX = -1 * orgEvent.wheelDeltaX / 120;
		}

		// Add event and delta to the front of the arguments
		args.unshift(event, delta, deltaX, deltaY);

		return ($.event.dispatch || $.event.handle).apply(this, args);
	}

})(jQuery);
(function($, _aoWin, _aoUndefined) {
	var _goData = {};

	var _oDragState = {
		_START: 0,
		_DRAG: 1,
		_END: 2
	},
		_oDragOption = {
			disable: false,
			cancel: "input", //�������϶���Ԫ��
			//container : Selector,Dom,String //�϶��ı߽�����
			cursor: "move", //�϶���������ʽ default=auto
			//cursorAt : Object{left:Number, right:Number} �϶�ʱ�϶�������������ƫ��
			distance: 5, //���������϶�ʱ����ƫ�Ƶľ���
			//handle   : Dom, Selector //�϶�����
			helper: "original", // "clone" "selector"
			//opacity  : Float,
			//revert   : Boolean,
			//zIndex   : Number
			getPos: function(_aoDom$) {
				var _oOffset = _aoDom$.offset(),
					_nLeft = _oOffset.left,
					_nTop = _oOffset.top;

				return [_nLeft + _aoDom$.attr("offsetWidth") / 2, _nTop + _aoDom$.attr("offsetHeight") / 2];
			}
		},
		_sInnerEvent = "__DrAg_DrOp__";

	function _getCursorPos(_aoEvent) {
		if (_aoEvent.pageX) {
			return [_aoEvent.pageX, _aoEvent.pageY];
		}
		var _oElem = _aoEvent.target,
			_oWin = _aoWin,
			_oDoc = _oElem.ownerDocument,
			_oBody = _oDoc.body,
			_oDocElem = _oDoc.documentElement,
			_nClientTop = _oDocElem.clientTop || _oBody.clientTop || 0,
			_nClientLeft = _oDocElem.clientLeft || _oBody.clientLeft || 0,
			_nTop = _aoEvent.clientY + (_oWin.pageYOffset || _oDocElem.scrollTop || _oBody.scrollTop || 0) - _nClientTop,
			_nLeft = _aoEvent.clientX + (_oWin.pageXOffset || _oDocElem.scrollLeft || _oBody.scrollLeft || 0) - _nClientLeft;
		return [_nLeft, _nTop];
	}

	function _getScroll(_aoDom) {
		var _oScroll = {
			top: 0,
			left: 0
		},
			_oParent = _aoDom.offsetParent;

		while (_aoDom && _aoDom != _oParent) {
			_oScroll.top += _aoDom.scrollTop;
			_oScroll.left += _aoDom.scrollLeft;

			_aoDom = _aoDom.parentNode;
		}

		return _oScroll;
	}

	var _Draggable = function(_aoDom$, _aoOptions) {
		var _oSelf = this;

		_oSelf._moElement$ = _aoDom$;
		_oSelf._moMover$ = null;
		_oSelf._moContainer$ = _aoOptions && _aoOptions.container && $(_aoOptions.container);
		_oSelf._moOptions = $.extend({}, _oDragOption, _aoOptions);
		_oSelf._mnState = _oDragState._END;

		_oSelf._init();
	};

	_Draggable.prototype = {
		option: function(_asKey, _avValue) {
			var _oSelf = this,
				_oOptions = _oSelf._moOptions;

			if (_avValue) {
				_oOptions[_asKey] = _avValue;
				return _oSelf;
			}

			return _oOptions[_asKey];
		},

		_init: function() {
			var _oSelf = this,
				_oOptions = _oSelf._moOptions,
				_oHandle$ = (_oOptions.handle ? _oSelf._moElement$.find(_oOptions.handle) : _oSelf._moElement$);

			_oHandle$.bind("mousedown", function(_aoEvent) {
				//ȥ��ϵͳĬ���Ϸ�
				_aoEvent.preventDefault(); //.stopPropagation(_aoEvent);

				if (_oOptions.disable || (_oOptions.lockx && _oOptions.locky)) {
					return;
				}
				var _oOffset = _oSelf._moElement$.offset();
				_oSelf._moOrgPos = {
					_nMouseX: _aoEvent.clientX,
					_nMouseY: _aoEvent.clientY,
					_nDomX: _oOffset.left - (parseInt(_oSelf._moElement$.css("margin-left")) || 0),
					_nDomY: _oOffset.top - (parseInt(_oSelf._moElement$.css("margin-top")) || 0)
				};

				_oSelf._move();
			});

			var _nTimer = null,
				_bReTry = false,
				_sGroup = _oOptions.group;
			_sGroup &&
				_oSelf._moElement$.bind("dragStart", function(_aoEvent) {
					_broadcast(_getCursorPos(_aoEvent));
					$(_aoEvent.target.ownerDocument.body).css("cursor", _oOptions.cursor);
				}).bind("drag", function(_aoEvent) {
					clearTimeout(_nTimer);
					var _oCursorPos = _getCursorPos(_aoEvent);
					_nTimer = setTimeout(function() {
						_broadcast(_oCursorPos);
					});
				}).bind("dragStop", function(_aoEvent) {
					_broadcast(_getCursorPos(_aoEvent));
					$(_aoEvent.target.ownerDocument.body).css("cursor", "");
				});

			function _broadcast(_aoCursorPos) {
				var _oDrops = [];
				_goData._moDropSet && (_oDrops = _goData._moDropSet[_sGroup]);
				for (var i = 0; i < _oDrops.length; i++) {
					var _oDrop = _oDrops[i];
					_oDrop != _oSelf._moElement$.size() &&
						$.trigger(_oDrop, _sInnerEvent, [{
							state: _oSelf._mnState,
							cursorPos: _aoCursorPos,
							pos: _oOptions.getPos(_oSelf._moMover$)
						}]);
				}
			}
		},

		_move: function() {
			var _oSelf = this,
				_oOptions = _oSelf._moOptions,
				_oElement = _oSelf._moElement$[0],
				_oDoc = _oElement.ownerDocument,
				_oWin = _oDoc.parentWindow || _oDoc.defaultView;

			$(_oDoc).bind("mousemove", _mousemove);
			$(_oDoc).bind("mouseup", _mouseup);

			function _mousemove(_aoEvent) {
				// ������mousemove�¼�ִ�У�����firefox�л���ֹ����Ԫ�ص����¼�
				//��ֹ�����Ƴ����ڶ�ʧ����
				if (_oElement.setCapture) {
					_oElement.setCapture(true);
					$(_oElement).bind("losecapture", _mouseup);
				} else {
					_oWin.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
					$.bind(_oWin).bind('blur', _mouseup);
				}
				//ȥ��ϵͳĬ���Ϸ�
				_aoEvent.preventDefault();
				//����ѡ��
				_oWin.getSelection ? _oWin.getSelection().removeAllRanges() : _oDoc.selection.empty();

				//�����϶��ľ���
				var _oOrgPos = _oSelf._moOrgPos,
					_nMouseX = _oOrgPos._nMouseX,
					_nMouseY = _oOrgPos._nMouseY,
					_nDiffX = Math.abs(_nMouseX - _aoEvent.clientX),
					_nDiffY = Math.abs(_nMouseY - _aoEvent.clientY);
				// ��ʼ�϶�
				if (_oSelf._mnState == _oDragState._END) {
					if (_nDiffX > _oOptions.distance || _nDiffY > _oOptions.distance) {
						_oSelf._mnState = _oDragState._START;
						_oSelf._start(_aoEvent);
						_oSelf._moElement$.trigger("dragStart", [_aoEvent, {
							helper: _oSelf._moMover$,
							position: {
								left: 0,
								right: 0
							},
							offset: {
								left: 0,
								right: 0
							}
						}]);
					}
					return;
				}
				//�϶�����
				_oSelf._mnState = _oDragState._DRAG;
				_oSelf._drag(_aoEvent);
				_oSelf._moElement$.trigger("drag", [_aoEvent, {
					helper: _oSelf._moMover$,
					position: {
						left: 0,
						right: 0
					},
					offset: {
						left: 0,
						right: 0
					}
				}]);

			}

			function _mouseup(_aoEvent) {

				//ʵ��û���϶�
				if (_oSelf._mnState == _oDragState._END) {
					_delEvent();
					return;
				}
				//���϶�����Ϊ
				_oSelf._mnState = _oDragState._END;
				_oSelf._moElement$.trigger("dragStop", [_aoEvent, {
					helper: _oSelf._moMover$,
					position: {
						left: 0,
						right: 0
					},
					offset: {
						left: 0,
						right: 0
					}
				}]);
				_oSelf._stop(_aoEvent);
				_delEvent();
			}

			function _delEvent() {
				$(_oDoc).unbind("mousemove", _mousemove)
					.unbind("mouseup", _mouseup);

				if (_oElement.releaseCapture) {
					_oElement.releaseCapture();
					$(_oElement).unbind("losecapture", _mouseup);
				} else {
					_oWin.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
					$(_oWin).unbind('blur', _mouseup);
				}
			}
		},

		_start: function(_aoEvent) {
			var _oSelf = this,
				_oOptions = _oSelf._moOptions;
			_oSelf._moMover$ = _oSelf._getMover(_aoEvent);
			_oSelf._moMover = _oSelf._moMover$[0];
			_oSelf._moOrgStyle = {
				_zIndex: _oSelf._moMover$.css("zIndex"),
				_opacity: _oSelf._moMover$.css("opacity")
			};
			_oSelf._moMover$.css("zIndex", "10001")
				.css("opacity", _oOptions.opacity);

			_oSelf._moMover$.css("display", "block");
		},

		_drag: function(_aoEvent) {
			var _oSelf = this,
				_oOptions = _oSelf._moOptions;
			with(_oSelf._moMover.style) {
				if (_oOptions.cursorAt) {
					var _oCursorPos = _getCursorPos(_aoEvent);
					left = _oCursorPos[0] + (_oOptions.cursorAt.left || 0) + "px";
					top = _oCursorPos[1] + (_oOptions.cursorAt.right || 0) + "px";
				} else {
					var _oParentOffset = _oSelf._moMover$.parent("*").offset() || {
						left: 0,
						top: 0
					},
						_oScroll = _getScroll(_oSelf._moMover),
						_oOrgPos = _oSelf._moOrgPos;

					if (!_oOptions.lockx) {
						left = _oOrgPos._nDomX + _aoEvent.clientX - _oOrgPos._nMouseX - _oParentOffset["left"] + _oScroll["left"] + "px";
					}
					if (!_oOptions.locky) {
						top = _oOrgPos._nDomY + _aoEvent.clientY - _oOrgPos._nMouseY - _oParentOffset["top"] + _oScroll["top"] + "px";
					}

					if (_oSelf._moContainer$) {
						var _oMoverOffset = _oSelf._moMover$.offset(),
							_oCntrOffset = _oSelf._moContainer$.offset(),
							_nMoverHeight = _oSelf._moMover.clientHeight,
							_nMoverWidth = _oSelf._moMover.clientWidth,
							_nCntrHeight = _oSelf._moContainer$.innerHeight(),
							_nCntrWidth = _oSelf._moContainer$.innerWidth(),
							_nCntrBorderLW = Math.ceil(_oSelf._moContainer$.css("border-left-width").replace(/px/, "")),
							_nCntrBorderTW = Math.ceil(_oSelf._moContainer$.css("border-top-width").replace(/px/, ""));

						// x
						if (_oMoverOffset["left"] < (_oCntrOffset["left"] + _nCntrBorderLW) && !_oOptions.lockx) {
							left = _oSelf._moMover.offsetLeft + (_oCntrOffset["left"] + _nCntrBorderLW - _oMoverOffset["left"]) + "px";
						} else if ((_oMoverOffset["left"] + _nMoverWidth) > (_oCntrOffset["left"] + _nCntrBorderLW + _nCntrWidth) && !_oOptions.lockx) {
							left = _oSelf._moMover.offsetLeft + (_oCntrOffset["left"] + _nCntrBorderLW + _nCntrWidth) - (_oMoverOffset["left"] + _nMoverWidth) + "px";
						}
						//y
						if (_oMoverOffset["top"] < (_oCntrOffset["top"] + _nCntrBorderTW) && !_oOptions.locky) {
							top = _oSelf._moMover.offsetTop + (_oCntrOffset["top"] + _nCntrBorderTW - _oMoverOffset["top"]) + "px";
						} else if ((_oMoverOffset["top"] + _nMoverHeight) > (_oCntrOffset["top"] + _nCntrBorderTW + _nCntrHeight) && !_oOptions.locky) {
							top = _oSelf._moMover.offsetTop + (_oCntrOffset["top"] + _nCntrBorderTW + _nCntrHeight) - (_oMoverOffset["top"] + _nMoverHeight) + "px";
						}
					}
				}
			}
		},

		_stop: function(_aoEvent) {
			var _oSelf = this,
				_oOptions = _oSelf._moOptions,
				_vHelper = _oOptions.helper;
			if (_vHelper === "original") {
				_oSelf._moMover$.css("zIndex", _oSelf._moOrgStyle._zIndex)
					.css("opacity", _oSelf._moOrgStyle._opacity);
				//��ie�У�������͸���Ⱥ���һЩ������ʹ��element���ܽ��ܵ��¼�����ʱͬlayout�й�
			} else if (_vHelper === "clone") {
				_oSelf._moElement$.css("opacity", 1);
				_oSelf._moMover$.remove();
				_oSelf._moMover = null;
			} else {
				_oSelf._moMover$.css("left", "-1000px").css("top", "-1000px").hide();
			}
		},

		_getMover: function(_aoEvent) {
			var _oSelf = this,
				_oElement$ = _oSelf._moElement$,
				_oOptions = _oSelf._moOptions,
				_vHelper = _oOptions.helper,
				_oMover$;

			if (_vHelper === "original") {
				_oMover$ = _oElement$;
			} else if (_vHelper === "clone") {
				_oMover$ = $(_oElement$[0].cloneNode(true));
			} else {
				_oMover$ = $(_vHelper);
			}

			var _sTop = _oOptions.cursorAt ? _aoEvent.clientY + (_oOptions.cursorAt.right || 0) + "px" : _oElement$.attr("offsetTop") - (parseInt(_oElement$.css("margin-top")) || 0) + "px",
				_sLeft = _oOptions.cursorAt ? _aoEvent.clientX + (_oOptions.cursorAt.left || 0) + "px" : _oElement$.attr("offsetLeft") - (parseInt(_oElement$.css("margin-left")) || 0) + "px";

			_oMover$.css("top", _sTop).css("left", _sLeft).css("position", "absolute");
			_vHelper === "clone" && _oElement$.parent("*").append(_oMover$);

			return _oMover$;
		}
	};

	var _oDropState = {
		_OVER: 0,
		_OUT: 1,
		_DROP: 2
	},
		_oDropOption = {
			//disable : Boolean,
			getPos: function(_aoDom$) {
				var _oOffset = _aoDom$.offset(),
					_nWidth = _aoDom$.attr("offsetWidth"),
					_nHeight = _aoDom$.attr("offsetHeight");

				return [_oOffset.top, _oOffset.left + _nWidth, _oOffset.top + _nHeight, _oOffset.left];
			}
		};

	var _Droppable = function(_aoDom$, _aoOptions) {
		var _oSelf = this;

		_oSelf._moElement$ = _aoDom$;
		_oSelf._moOptions = $.extend({}, _oDropOption, _aoOptions);
		_oSelf._mnState = _oDropState._LEAVE;

		_oSelf._init();
	}

	_Droppable.prototype = {
		option: function(_asKey, _avValue) {
			var _oSelf = this,
				_oOptions = _oSelf._moOptions;

			if (_avValue) {
				_oOptions[_asKey] = _avValue;
			}
			return _oOptions[_asKey];
		},

		_init: function() {
			var _oSelf = this,
				_oOptions = _oSelf._moOptions,
				_sGroup = _oOptions.group;

			if (_sGroup) {
				_oSelf._moElement$.bind(_sInnerEvent, function(_aoDragInfo) {
					_oSelf.listen(_aoDragInfo);
				});
			}

		},

		listen: function(_aoDragInfo) {
			var _oSelf = this,
				_nDragState = _aoDragInfo.state,
				_oDragPos = _aoDragInfo.pos,
				_oCursorPos = _aoDragInfo.cursorPos,
				_nLastState = _oSelf._mnState,
				_bIsOver = _oSelf._isOver(_oSelf._moOptions.overByCursor ? _oCursorPos : _oDragPos,
					_oSelf._moOptions.getPos(_oSelf._moElement$));

			if (_bIsOver) {
				_oSelf._mnState = (_nDragState == _oDragState._END) ? _oDropState._DROP : _oDropState._OVER;
			} else {
				_oSelf._mnState = _oDropState._OUT;
			}
			// ֻ����һ�Σ��Ƿ��׵�?��
			// ��֤dropΪ���󴥷����¼�
			if (_nLastState != _oSelf._mnState && _nLastState != _oDropState._DROP) {
				if (_oSelf._mnState == _oDropState._OVER) {
					_oSelf._mnDropOverTimer = setTimeout(function() {
						_oSelf._moElement$.trigger("dropOverLong", [_aoDragInfo]);
					}, 800);
				} else if (_oSelf._mnState == _oDropState._OUT) {
					clearTimeout(_oSelf._mnDropOverTimer);
				}
				_oSelf._moElement$.trigger(["dropOver", "dropOut", "drop"][_oSelf._mnState], [_aoDragInfo]);
			}
		},
		/**
		 * �ж�draggable�Ƿ񾭹�drop����
		 * Ĭ�ϵĲ�����draggable���������Ľ�����drop����
		 */
		_isOver: function(_aoDragPos, _aoDropPos) {
			var _nPX = _aoDragPos[0],
				_nPY = _aoDragPos[1],
				_nX1 = _aoDropPos[3],
				_nX2 = _aoDropPos[1],
				_nY1 = _aoDropPos[0],
				_nY2 = _aoDropPos[2];

			return (_nPX > _nX1 && _nPX < _nX2 && _nPY > _nY1 && _nPY < _nY2);
		}
	};

	/**
     * @method prototype.draggable
     * @desc ʹQMWin������Ӧ��dom��Ϊdraggable
     *       ����״̬�ĸı䣬�ᴥ��dragStart/drag/dragStop�����¼���ͨ��addEvent���������¼�����
     * @todo �ɽ���html5���϶��¼������Ż�
     *
     * @param {Object} _aoOptions {
					 	group    : String, //��������
						disabled : false, //
						lockx    : Boolean, //�Ƿ�����X�᷽��
						locky    : Boolean, //�Ƿ�����Y�᷽��
						cancel   : "input", //�������϶���Ԫ��
						container : Selector,Dom,String //�϶��ı߽�����
						cursor   : String //�϶���������ʽ default=auto
						cursorAt : Object{left:Number, right:Number} �϶�ʱ�϶�������������ƫ��
						distance : Number //���������϶�ʱ����ƫ�Ƶľ���
						handle   : Dom, Selector //�϶�����
						helper   : String,Selector 
						opacity  : Float,
						revert   : Boolean, // �Ƿ���ԭ��ԭλ�� 
						zIndex   : Number
					}
     * @return {Object} QMWin
     */
	$.fn.draggable = function(_aoOptions) {
		var _oSelf = this;
		_oSelf.each(function() {
			new _Draggable($(this), _aoOptions)
		});

		return _oSelf;
	}

	/**
     * @method prototype.droppable
     * @desc ʹQMWin������Ӧ��dom��Ϊdroppable
     *       ����״̬�ĸı䣬�ᴥ��dropOver/dropOut/drop�����¼���ͨ��addEvent���������¼�����
     * @todo �ɽ���html5���϶��¼������Ż�
     *
     * @param {Object} _aoOptions {
						disable : Boolean,
						overByCursor   : Boolean, // ������λ�����ж�Over״̬ 
						group : String //�������ƣ�ֻ��draggable��droppable�����ķ�������һ��ʱ���Żᴥ����Ӧ�Ķ���	
					}
     * @return {Object} QMWin
     */
	$.fn.droppable = function(_aoOptions) {
		var _oSelf = this,
			_oDrops,
			_sGroup = _aoOptions.group || "default-group";

		_goData._moDropSet = _goData._moDropSet || {};
		_oDrops = _goData._moDropSet[_sGroup] || [];

		_oSelf.each(function(_aoDom) {
			var _bAdded = false;
			new _Droppable($(this), _aoOptions);
			for (var i = 0; i < _oDrops.length; i++) {
				_aoDom == _oDrops[i] && (_bAdded = true);
			}!_bAdded && _oDrops.push(_aoDom);
		});
		_goData._moDropSet[_sGroup] = _oDrops;

		return _oSelf;
	}

})(jQuery, this);
/*
 ### jQuery XML to JSON Plugin v1.1 - 2008-07-01 ###
 * http://www.fyneworks.com/ - diego@fyneworks.com
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 ###
 Website: http://www.fyneworks.com/jquery/xml-to-json/
*/
/*
 # INSPIRED BY: http://www.terracoder.com/
           AND: http://www.thomasfrank.se/xml_to_json.html
											AND: http://www.kawa.net/works/js/xml/objtree-e.html
*/
/*
 This simple script converts XML (document of code) into a JSON object. It is the combination of 2
 'xml to json' great parsers (see below) which allows for both 'simple' and 'extended' parsing modes.
*/
// Avoid collisions
;
if (window.jQuery)(function($) {

	// Add function to jQuery namespace
	$.extend({

		// converts xml documents and xml text to json object
		xml2json: function(xml, extended) {
			if (!xml) return {}; // quick fail

			//### PARSER LIBRARY
			// Core function

			function parseXML(node, simple) {
				if (!node) return null;
				var txt = '',
					obj = null,
					att = null;
				var nt = node.nodeType,
					nn = jsVar(node.localName || node.nodeName);
				var nv = node.text || node.nodeValue || '';
				/*DBG*/ //if(window.console) console.log(['x2j',nn,nt,nv.length+' bytes']);
				if (node.childNodes) {
					if (node.childNodes.length > 0) {
						/*DBG*/ //if(window.console) console.log(['x2j',nn,'CHILDREN',node.childNodes]);
						$.each(node.childNodes, function(n, cn) {
							var cnt = cn.nodeType,
								cnn = jsVar(cn.localName || cn.nodeName);
							var cnv = cn.text || cn.nodeValue || '';
							/*DBG*/ //if(window.console) console.log(['x2j',nn,'node>a',cnn,cnt,cnv]);
							if (cnt == 8) {
								/*DBG*/ //if(window.console) console.log(['x2j',nn,'node>b',cnn,'COMMENT (ignore)']);
								return; // ignore comment node
							} else if (cnt == 3 || cnt == 4 || !cnn) {
								// ignore white-space in between tags
								if (cnv.match(/^\s+$/)) {
									/*DBG*/ //if(window.console) console.log(['x2j',nn,'node>c',cnn,'WHITE-SPACE (ignore)']);
									return;
								};
								/*DBG*/ //if(window.console) console.log(['x2j',nn,'node>d',cnn,'TEXT']);
								txt += cnv.replace(/^\s+/, '').replace(/\s+$/, '');
								// make sure we ditch trailing spaces from markup
							} else {
								/*DBG*/ //if(window.console) console.log(['x2j',nn,'node>e',cnn,'OBJECT']);
								obj = obj || {};
								if (obj[cnn]) {
									/*DBG*/ //if(window.console) console.log(['x2j',nn,'node>f',cnn,'ARRAY']);

									// http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
									if (!obj[cnn].length) obj[cnn] = myArr(obj[cnn]);
									obj[cnn] = myArr(obj[cnn]);

									obj[cnn][obj[cnn].length] = parseXML(cn, true /* simple */ );
									obj[cnn].length = obj[cnn].length;
								} else {
									/*DBG*/ //if(window.console) console.log(['x2j',nn,'node>g',cnn,'dig deeper...']);
									obj[cnn] = parseXML(cn);
								};
							};
						});
					}; //node.childNodes.length>0
				}; //node.childNodes
				if (node.attributes) {
					if (node.attributes.length > 0) {
						/*DBG*/ //if(window.console) console.log(['x2j',nn,'ATTRIBUTES',node.attributes])
						att = {};
						obj = obj || {};
						$.each(node.attributes, function(a, at) {
							var atn = jsVar(at.name),
								atv = at.value;
							att[atn] = atv;
							if (obj[atn]) {
								/*DBG*/ //if(window.console) console.log(['x2j',nn,'attr>',atn,'ARRAY']);

								// http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
								//if(!obj[atn].length) obj[atn] = myArr(obj[atn]);//[ obj[ atn ] ];
								obj[cnn] = myArr(obj[cnn]);

								obj[atn][obj[atn].length] = atv;
								obj[atn].length = obj[atn].length;
							} else {
								/*DBG*/ //if(window.console) console.log(['x2j',nn,'attr>',atn,'TEXT']);
								obj[atn] = atv;
							};
						});
						//obj['attributes'] = att;
					}; //node.attributes.length>0
				}; //node.attributes
				if (obj) {
					obj = $.extend((txt != '' ? new String(txt) : {}), /* {text:txt},*/ obj || {} /*, att || {}*/ );
					txt = (obj.text) ? (typeof(obj.text) == 'object' ? obj.text : [obj.text || '']).concat([txt]) : txt;
					if (txt) obj.text = txt;
					txt = '';
				};
				var out = obj || txt;
				//console.log([extended, simple, out]);
				if (extended) {
					if (txt) out = {}; //new String(out);
					txt = out.text || txt || '';
					if (txt) out.text = txt;
					if (!simple) out = myArr(out);
				};
				return out;
			}; // parseXML
			// Core Function End
			// Utility functions
			var jsVar = function(s) {
				return String(s || '').replace(/-/g, "_");
			};

			// NEW isNum function: 01/09/2010
			// Thanks to Emile Grau, GigaTecnologies S.L., www.gigatransfer.com, www.mygigamail.com

			function isNum(s) {
				// based on utility function isNum from xml2json plugin (http://www.fyneworks.com/ - diego@fyneworks.com)
				// few bugs corrected from original function :
				// - syntax error : regexp.test(string) instead of string.test(reg)
				// - regexp modified to accept  comma as decimal mark (latin syntax : 25,24 )
				// - regexp modified to reject if no number before decimal mark  : ".7" is not accepted
				// - string is "trimmed", allowing to accept space at the beginning and end of string
				var regexp = /^((-)?([0-9]+)(([\.\,]{0,1})([0-9]+))?$)/
				return (typeof s == "number") || regexp.test(String((s && typeof s == "string") ? jQuery.trim(s) : ''));
			};
			// OLD isNum function: (for reference only)
			//var isNum = function(s){ return (typeof s == "number") || String((s && typeof s == "string") ? s : '').test(/^((-)?([0-9]*)((\.{0,1})([0-9]+))?$)/); };

			var myArr = function(o) {

				// http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
				//if(!o.length) o = [ o ]; o.length=o.length;
				if (!$.isArray(o)) o = [o];
				o.length = o.length;

				// here is where you can attach additional functionality, such as searching and sorting...
				return o;
			};
			// Utility functions End
			//### PARSER LIBRARY END

			// Convert plain text to xml
			if (typeof xml == 'string') xml = $.text2xml(xml);

			// Quick fail if not xml (or if this is a node)
			if (!xml.nodeType) return;
			if (xml.nodeType == 3 || xml.nodeType == 4) return xml.nodeValue;

			// Find xml root node
			var root = (xml.nodeType == 9) ? xml.documentElement : xml;

			// Convert xml to json
			var out = parseXML(root, true /* simple */ );

			// Clean-up memory
			xml = null;
			root = null;

			// Send output
			return out;
		},

		// Convert text to XML DOM
		text2xml: function(str) {
			// NOTE: I'd like to use jQuery for this, but jQuery makes all tags uppercase
			//return $(xml)[0];
			var out;
			try {
				var xml = ($.browser.msie) ? new ActiveXObject("Microsoft.XMLDOM") : new DOMParser();
				xml.async = false;
			} catch (e) {
				throw new Error("XML Parser could not be instantiated")
			};
			try {
				if ($.browser.msie) out = (xml.loadXML(str)) ? xml : false;
				else out = xml.parseFromString(str, "text/xml");
			} catch (e) {
				throw new Error("Error parsing XML string")
			};
			return out;
		}

	}); // extend $

})(jQuery);
(function($, _aoWin, _aoUndefined) {
	var _Scrollable = function(_aoDom$, _aoOptions) {
		var _oSelf = this;
		_oSelf._option = {
			opacity: 0.8,
			rate: 5, //��������1�����൱�ڹ������ݵ�x���أ����������������������ƣ�
			deltaRate: 10, //�������ֹ�һ�£��൱�ڹ�������x���أ��������������ʼ�С���ƣ�
			minHeight: 20, //��������С�߶�
			maxMouseWheelContentScroll: 50, //������������һ���ù������ݹ�x����,
			onscroll: function() {}, //����ʱ����
			callback4stop: function() {} //��������ֹͣʱ�ص�����
		};
		$.extend(_oSelf._option, _aoOptions);

		var _oContent$ = _oSelf._oContent$ = _aoDom$,
			_oContainer$ = _oSelf._oContainer$ = _aoDom$.parent(),
			_oBarBox$ = _oSelf._oBarBox$ = $("<div/>").addClass("scrollbarBox"),
			_oBar$ = _oSelf._oBar$ = $("<div/>").addClass("scrollbar");

		/*
         _oSelf._nContentHeight;//���������ĸ߶�
         _oSelf._nContainerHeight;//�����ĸ߶�
         _oSelf._nContentScrollBottom;//content���������ĸ�
         _oSelf._nBarScrollHeight;//bar�ɹ����ĸ߶�
         */

		_oBar$.offsetTop = 0;
		_oBar$.setTop = function(_nPos) {
			_oBar$.offsetTop = _nPos;
			return _oBar$;
		};
		_oBar$.getTop = function() {
			return _oBar$.offsetTop;
		};
		_oBar$.setHeight = function(_nHeight) {
			_nHeight = Math.floor(_nHeight);
			_oBar$.css("height", _nHeight);
			_oSelf._nBarScrollHeight = _oSelf._nContainerHeight - _nHeight;
			return _oBar$;
		};

		_oBar$.checkStopTimeout = null;
		_oBar$.moveTo = function(_nPos, _abIsNoScroll) {
			if (!_oBar$.isShow()) return;
			if (_nPos < 0) _nPos = 0;
			if (_nPos > _oSelf._nBarScrollHeight) _nPos = _oSelf._nBarScrollHeight;
			_oBar$.setTop(_nPos)
				.css("top", Math.round(_nPos));
			_oBar$.moved(_abIsNoScroll);
		};
		_oBar$.moved = function(_abIsNoScroll) {
			clearTimeout(_oBar$.checkStopTimeout);
			_oBar$.appear();
			var _nPos = Math.ceil(_oSelf._getScrollDestPos());
			_oContent$.css("top", _nPos);
			if (!_abIsNoScroll) {
				_oSelf._option.onscroll && _oSelf._option.onscroll(_nPos);
			}

			_oBar$.checkStopTimeout = setTimeout(_oSelf._option.callback4stop, 100);
			return _oBar$;
		};

		/*barʵ�ֽ�������*/
		_oBar$.timeout = null;
		_oBar$.opacity = _oSelf._option.opacity;
		_oBar$.autoDisappear = true;
		_oBar$.appear = function() {
			if (_oBar$.timeout) {
				clearTimeout(_oBar$.timeout);
				_oBar$.timeout = null;
			}
			_oBar$.stop(true).css({
				"opacity": _oBar$.opacity
			});
			if (_oBar$.autoDisappear)
				_oBar$.disappear();
		};
		_oBar$.disappear = function() {
			if (!_oBar$.timeout)
				_oBar$.timeout = setTimeout(function() {
					_oBar$.stop(true).animate({
						"opacity": 0
					}, "fast");
				}, 1000);
		};
		_oSelf._resize();

		_oBar$.css({
			"position": "absolute",
			"right": "0",
			"top": "0",
			"display": "none"
		})
			.draggable({
				container: _oContainer$,
				lockx: true,
				distance: 0
			})
			.on("drag", function() {
				_oBar$.setTop(_oBar$.position().top).moved();
			});

		_oBarBox$.css({
			"position": "absolute",
			"right": "0",
			"top": "0",
			"height": "100%"
		})
			.on("mouseenter", function() {
				_oBar$.autoDisappear = false;
				_oBar$.appear();
			}).on("mouseleave", function() {
				_oBar$.autoDisappear = true;
				_oBar$.disappear();
			});

		_oContent$.css({
			"position": "absolute"
		});

		_oContainer$.append(_oBarBox$.append(_oBar$))
			.css({
				"overflow-y": "hidden",
				"position": "relative"
			})
			.mousewheel(function(e, delta, deltaX, deltaY) {
				var _nBarDestPos = parseInt(_oBar$.css("top")) - delta * _oSelf._nDeltaRate;
				_oBar$.moveTo(_nBarDestPos);
				return false;
			})
			.on("mouseenter", function() {
				_oBar$.appear();
			})
			.data({
				scrollTop: function(_nPos) {
					if (!_nPos && _nPos != 0) return -parseInt(_oContent$.css("top"));
					_oBar$.moveTo(parseInt(_nPos) / _oSelf._nRate);
					return null;
				},
				heightChanged: function() {
					heightChanged();
				},
				scrollBarDestroy: function() {
					_oSelf.destroy();
				}
			});

		/*����content�ĸ߶ȣ����߶ȷ����仯ʱ����*/

		function heightChanged() {
			if (!_oContent$.is(":visible")) return;
			if (_oContent$.outerHeight(true) == _oSelf._nContentHeight && _oContainer$.innerHeight() == _oSelf._nContainerHeight) return;
			// debug("scrollBar resize");
			_oSelf._resize();
		}
		_oSelf._oContentHeightInterval = setInterval(heightChanged, 500);

		debug(function() {
			if (!_aoWin.scrollBars) _aoWin.scrollBars = {};
			var _len = 0;
			for (var i in _aoWin.scrollBars)++_len;
			var className = _oContainer$.attr("id") || _oContainer$.attr("class") || _oContent$.attr("id") || _oContent$.attr("class") || "noname" + _len;
			_aoWin.scrollBars[className] = _oSelf;
		});
		return {
			resize: function() { //�������µ�����С�ķ���
				_oSelf._resize();
			},
			moveTo: function(_nPos, _abIsNoScroll) {
				_oBar$.moveTo(_nPos, _abIsNoScroll);
			},
			destroy: function() {
				_oSelf.destroy();
			}
		}
	};

	_Scrollable.prototype = {
		constructor: _Scrollable,

		_resize: function() {
			var _oSelf = this;
			_oSelf._nContentHeight = _oSelf._oContent$.outerHeight(true);
			_oSelf._nContainerHeight = _oSelf._oContainer$.innerHeight();
			_oSelf._nRate = _oSelf._option.rate;
			_oSelf._nDeltaRate = _oSelf._option.deltaRate;
			_oSelf._nContentScrollBottom = _oSelf._nContentHeight - _oSelf._nContainerHeight;
			if (_oSelf._nContentHeight <= _oSelf._nContainerHeight) {
				_oSelf._oContent$.css("top", "0");
				_oSelf._oBar$.hide();
				return;
			}
			var _Height = _oSelf._getBarHeightWithRate(),
				_TopPos = -parseInt(_oSelf._oContent$.css("top")) / _oSelf._nRate;
			_oSelf._reCalculateDeltaRate();
			_oSelf._oBar$.setHeight(_Height).moveTo(_TopPos, true);
			_oSelf._oBar$.show().appear();
		},

		/*����rate����bar��height*/
		_getBarHeightWithRate: function() {
			var _oSelf = this;
			var minHeight = _oSelf._option.minHeight;
			var _nBarHeightTemp = minHeight;
			_nBarHeightTemp = _oSelf._nContainerHeight - (_oSelf._nContentScrollBottom / _oSelf._nRate);
			if (_nBarHeightTemp < minHeight) {
				_nBarHeightTemp = minHeight;
				_oSelf._nRate = _oSelf._nContentScrollBottom / (_oSelf._nContainerHeight - _nBarHeightTemp);
			}
			return _nBarHeightTemp;
		},

		/*����contentҪ��������Ŀ��λ��*/
		_getScrollDestPos: function() {
			var _oSelf = this;
			var _nScrollTargetPos = _oSelf._oBar$.getTop() * _oSelf._nRate;
			_nScrollTargetPos = _nScrollTargetPos <= _oSelf._nContentScrollBottom ? _nScrollTargetPos : _oSelf._nContentScrollBottom;
			return -_nScrollTargetPos;
		},

		_reCalculateDeltaRate: function() {
			var _oSelf = this;
			var maxMouseWheelContentScroll = _oSelf._option.maxMouseWheelContentScroll;
			if (_oSelf._nDeltaRate * _oSelf._nRate <= maxMouseWheelContentScroll) return;
			_oSelf._nDeltaRate = Math.floor(maxMouseWheelContentScroll / _oSelf._nRate);
			if (_oSelf._nDeltaRate < 1) _oSelf._nDeltaRate = 1;
		},

		destroy: function() {
			var _oSelf = this;
			_oSelf._oBarBox$.remove();
			_oSelf._oContainer$.removeData("scrollTop heightChanged scrollBarDestroy")
				.off("mouseenter")
				.unmousewheel();
			clearInterval(_oSelf._oContentHeightInterval);
			delete _oSelf;
		}
	};

	$.fn.scrollable = function(_aoOptions) {
		if ($.isLowerBrowser && $.isLowerBrowser()) { //Lower Browser not support this scrollBar
			var _oParent$ = $(this).parent(),
				_oTimeout;
			_oParent$.css("overflow-y", "auto");

			if (!_aoOptions) return null;
			if (_aoOptions.onscroll) {
				_oParent$.on("scroll", function(e) {
					_aoOptions.onscroll(e.target.scrollTop)
				});
			}
			if (_aoOptions.callback4stop) {
				_oParent$.on("scroll", function(e) {
					clearTimeout(_oTimeout);
					_oTimeout = setTimeout(_aoOptions.callback4stop, 100);
				});
			}
			return null;
		}

		var _oSelf = this,
			_oscrollBar;
		_oSelf.each(function() {
			_oSelf.scrollBar = _oscrollBar = new _Scrollable($(this), _aoOptions);
		});
		return _oscrollBar;
	}

	var _fOldScrollTop = $.fn.scrollTop;

	//@override ��дjquery������scrollTop����
	$.fn.scrollTop = function(_nPos) {
		var _oSelf = this;
		if (!_oSelf.data("scrollTop")) return _fOldScrollTop.apply(_oSelf, arguments);

		if (_oSelf.data("heightChanged")) _oSelf.data("heightChanged")();
		var result = _oSelf.data("scrollTop")(_nPos);
		if (!result && result != 0) return _oSelf;
		return result;
	}
})(jQuery, this);
(function($, _aoWin, _aoUndefined) {

	function _calcPos(_aoEl) {
		var _oEl$ = $(_aoEl),
			_oPos = _oEl$.offset();

		return [_oPos.top, _oPos.left + _oEl$.width(), _oPos.top + _oEl$.height(), _oPos.left, _oEl$.width(), _oEl$.height()];
	}
	/**
	 * dom���Ź���
	 * ʹ�÷�ʽ�� new QMResize( {}, {}, {} ).setTrigger( {} );
	 * @param {Object} _aoResizeDom ʵʩ���ŵĶ���
	 * @param {Object} _aoOptions   �����õĲ���
	 *                 {������ this._moOptions}
	 * @param {Object} _aoCallBacks ���Ź����еĻص�����
	 *                 {������ this._moCallBacks}
	 */
	var QMResize = function(_aoResizeDom, _aoOptions, _aoCallBacks) {
		this._moResizeDom = null;
		this._moOptions = {
			maxContainer: null, //ָ��������������
			minWidth: 0, //��С���� (ע�⣬����ֵ����ҪΪNumber)
			minHeight: 0, //��С�߶� (ע�⣬����ֵ����ҪΪNumber)
			scale: 0 //���ű���(��/��)
		};

		this._moCallBacks = {
			onready: function() { /*debug('onready');*/ },
			onresize: function() { /*debug('onresize');*/ },
			oncomplete: function() { /*debug('oncomplete');*/ }
		};

		this._init(_aoResizeDom, _aoOptions, _aoCallBacks);
	};

	QMResize.prototype = {
		/**
		 * �������ŵĴ�������
		 * @param {Array} _aoTriggers
		 *         ��ʽ: [[triggerHandle, direction], [triggerHandle, direction], ...]
		 *         ���У�triggerHandleָ���Դ������ŵĶ�����
		 *               direction ���а˸����򣬷ֱ�Ϊ top, left, bottom, right, left-top, right-top, left-bottom, right-bottom
		 */
		setTriggers: function(_aoTriggers) {
			var _oSelf = this;

			$.each(_aoTriggers, function(i, _aoTrigger) {
				$(_aoTrigger).off("mousedown").on("mousedown", function(_aoEvent) {
					_oSelf._start(_aoEvent, _oSelf._getResizeFunc(_aoTrigger[1]));
				});
			});

			//֧�����������¼�
			$(_oSelf._moResizeDom).mousewheel(function(_aoEvent, _anDelta) {
				_wheelScroll(_aoEvent, _anDelta * 6);
			});

			function _wheelScroll(_aoEvent, _anDirect) {
				_oSelf._computeOriPos(_aoEvent);
				_oSelf._getResizeFunc('left-top')(-_anDirect, -_anDirect);
				_oSelf._computeOriPos(_aoEvent);
				_oSelf._getResizeFunc('right-bottom')(_anDirect, _anDirect);
				_oSelf._moCallBacks['onresize'].call(_oSelf);
				//_aoEvent.stopPropagation();
				_aoEvent.preventDefault();
			}
		},
		/**
		 * ��ȡ���Ŷ������������Զ����ص�������������
		 */
		getResizeDom: function() {
			return this._moResizeDom;
		},

		_init: function(_aoResizeDom, _aoOptions, _aoCallBacks) {
			this._moResizeDom = _aoResizeDom;
			this._moDocument = _aoResizeDom.ownerDocument;
			this._moWindow = this._moDocument.parentWindow || this._moDocument.defaultView;
			$.extend(this._moOptions, _aoOptions);
			$.extend(this._moCallBacks, _aoCallBacks);
		},

		_start: function(_aoEvent, _aoResizeFunc) {
			var _oSelf = this;

			_oSelf._computeOriPos(_aoEvent);
			_oSelf._moCallBacks['onready'].call(_oSelf);
			//��ֹð��
			_aoEvent.stopPropagation();
			//mousemoveʱ���� mouseupʱֹͣ
			$(_oSelf._moDocument).off("mousemove").on("mousemove", _oSelf._moOnMouseMove = function(_aoEvent) {
				_oSelf._resize(_aoEvent, _aoResizeFunc);
			});
			$(_oSelf._moDocument).off("mouseup").on("mouseup", _oSelf._moOnMouseUp = function(_aoEvent) {
				_oSelf._stop(_aoEvent, _aoResizeFunc);
			});

			//��ֹ���ڶ�ʧ����
			if (_oSelf._moResizeDom.setCapture) //ie
			{
				_oSelf._moResizeDom.setCapture();
				$(_oSelf._moResizeDom).off("losecapture").on("losecapture", _oSelf._moOnMouseUp);
			} else //non ie
			{
				//getTop().addEvent(_oSelf._moWindow, 'blur', _oSelf._moOnMouseUp);
				//getTop().preventDefault(_aoEvent); //������
			}
			return _oSelf;
		},

		_resize: function(_aoEvent, _aoResizeFunc) {
			var _oSelf = this;
			//����ѡ��
			_oSelf._moWindow.getSelection ? _oSelf._moWindow.getSelection().removeAllRanges() : _oSelf._moDocument.selection.empty();

			var _nCurMouseX = _aoEvent.clientX + $(document.body).scrollLeft(),
				_nCurMouseY = _aoEvent.clientY + $(document.body).scrollTop(),
				_nMouseDiffX = _nCurMouseX - _oSelf._mnMouseX,
				_nMouseDiffY = _nCurMouseY - _oSelf._mnMouseY;
			_aoResizeFunc.call(_oSelf, _nMouseDiffX, _nMouseDiffY);

			this._moCallBacks['onresize'].call(_oSelf);

			return _oSelf;
		},

		_stop: function() {
			var _oSelf = this;

			$(_oSelf._moDocument).off("mousemove", _oSelf._moOnMouseMove).off("mouseup", _oSelf._moOnMouseUp);
			if (_oSelf._moResizeDom.releaseCapture) {
				_oSelf._moResizeDom.releaseCapture();
				$(_oSelf._moResizeDom).off("losecapture", _oSelf._moOnMouseUp);
			} else {
				//getTop().removeEvent(_oSelf._moWindow, 'blur', _oSelf._moOnMouseUp);
			}
			this._moCallBacks['oncomplete'].call(_oSelf);

			return _oSelf;
		},
		//������ʼλ����Ϣ
		_computeOriPos: function(_aoEvent) {
			var _oSelf = this,
				_oResizeDom = _oSelf._moResizeDom,
				_oCurBody = _oSelf._moDocument.body,
				_oContainer = _oSelf._moOptions.maxContainer;

			_oSelf._mnMouseX = _aoEvent.clientX + $(document.body).scrollLeft();
			_oSelf._mnMouseY = _aoEvent.clientY + $(document.body).scrollTop();

			_oSelf._moPos = _calcPos(_oResizeDom);
			_oSelf._mnTop = _oResizeDom.offsetTop;
			_oSelf._mnLeft = _oResizeDom.offsetLeft;
			_oSelf._mnHeight = $.browser.msie ? _oSelf._moPos[5] : _oResizeDom.clientHeight; //��ΪIE�ͷ�IE��������style.width�������ǲ�һ����
			_oSelf._mnWidth = $.browser.msie ? _oSelf._moPos[4] : _oResizeDom.clientWidth;
			if (_oContainer) {
				_oSelf._moContainerPos = _oContainer && _calcPos(_oContainer);
				_oSelf._mnDiffTop = _oSelf._moContainerPos[0] - _oSelf._moPos[0];
				_oSelf._mnDiffLeft = _oSelf._moContainerPos[3] - _oSelf._moPos[3];
				_oSelf._mnDiffBottom = _oSelf._moContainerPos[2] - _oSelf._moPos[2];
				_oSelf._mnDiffRight = _oSelf._moContainerPos[1] - _oSelf._moPos[1];
			}
			return _oSelf;
		},
		/**
		 * ���ض�������x y��������Ч���룬����Ҫ���ǵ�����������
		 * 1.�Ƿ񰴱������� 2.�Ƿ񳬳���������Χ 3.�Ƿ�С����С�ķ�Χ
		 * ʹ�õݹ������ķ������������ڰ���������ʱ����������Χʱ��׼ȷ�ƶ�λ��
		 * @param {Number}  _anDiffX     ��ǰ������X�����ƶ�����
		 * @param {Number}  _anDiffY     ��ǰ������Y�����ƶ�����
		 * @param {Boolean} _abX         ����X�����ƶ��Ƿ��ᵼ������
		 * @param {Boolean} _abY         ����Y�����ƶ��Ƿ��ᵼ������
		 * @param {Boolean} _abTop       ����������������
		 * @param {Boolean} _abLeft      ����������������
		 * @param {Boolean} _abBottom    ����������������
		 * @param {Boolean} _abRight     ����������������
		 * @return
		 */
		_computeDiff: function(_anDiffX, _anDiffY, _abX, _abY, _abTop, _abLeft, _abBottom, _abRight) {
			var _oSelf = this,
				_oOption = _oSelf._moOptions,
				_nDiffX = _anDiffX,
				_nDiffY = _anDiffY;
			//�б�������
			if (_oOption.scale) {
				if (_abX && !_abY) {
					_nDiffY = _nDiffX / _oOption.scale * ((_abLeft && _abBottom || _abTop && _abRight) ? -1 : 1);
				} else if (!_abX && _abY) {
					_nDiffX = _nDiffY * _oOption.scale * ((_abLeft && _abBottom || _abTop && _abRight) ? -1 : 1);
				} else if (_abX && _abY) {
					if (Math.abs(_nDiffX) > Math.abs(_oOption.scale * _nDiffY)) {
						_nDiffY = _nDiffX / _oOption.scale * ((_abLeft && _abBottom || _abTop && _abRight) ? -1 : 1);
					} else if (Math.abs(_nDiffX) < Math.abs(_oOption.scale * _nDiffY)) {
						_nDiffX = _nDiffY * _oOption.scale * ((_abLeft && _abBottom || _abTop && _abRight) ? -1 : 1);
					}
				}
			} else {
				_nDiffX = _abX ? _nDiffX : 0;
				_nDiffY = _abY ? _nDiffY : 0;
			}
			//���������ķ�Χ
			if (_oOption.maxContainer) {
				var _bOverTop = _abTop && ((_oSelf._moPos[0] + _nDiffY) < _oSelf._moContainerPos[0]),
					_bOverLeft = _abLeft && ((_oSelf._moPos[3] + _nDiffX) < _oSelf._moContainerPos[3]),
					_bOverBottom = _abBottom && ((_oSelf._moPos[2] + _nDiffY) > _oSelf._moContainerPos[2]),
					_bOverRight = _abRight && ((_oSelf._moPos[1] + _nDiffX) > _oSelf._moContainerPos[1]);
				if (_bOverTop) {
					return _oSelf._computeDiff(_oOption.scale ? 0 : _nDiffX, _oSelf._mnDiffTop, _abX, true, _abTop, _abLeft, _abBottom, _abRight);
				}
				if (_bOverLeft) {
					return _oSelf._computeDiff(_oSelf._mnDiffLeft, _oOption.scale ? 0 : _nDiffY, true, _abY, _abTop, _abLeft, _abBottom, _abRight);
				}
				if (_bOverBottom) {
					return _oSelf._computeDiff(_oOption.scale ? 0 : _nDiffX, _oSelf._mnDiffBottom, _abX, true, _abTop, _abLeft, _abBottom, _abRight);
				}
				if (_bOverRight) {
					return _oSelf._computeDiff(_oSelf._mnDiffRight, _oOption.scale ? 0 : _nDiffY, true, _abY, _abTop, _abLeft, _abBottom, _abRight);
				}
			}
			//������С��Χ
			var _bOverMinWidth = (_oSelf._mnWidth + (_abRight ? _nDiffX : -_nDiffX)) < _oOption.minWidth,
				_bOverMinHeight = (_oSelf._mnHeight + (_abBottom ? _nDiffY : -_nDiffY)) < _oOption.minHeight;
			if (_bOverMinWidth || _bOverMinHeight) {
				return null;
			};

			return [_nDiffX, _nDiffY];
		},

		_getResizeFunc: function(_asDirection) {
			var _oSelf = this,
				_oStyle = _oSelf._moResizeDom.style;

			switch (_asDirection.toLowerCase()) {
				case 'top':
					return function(_anDiffX, _anDiffY) {
						var _oRealDiff = _oSelf._computeDiff(_anDiffX, _anDiffY, false, true, true, true);
						_oRealDiff && _top(_oRealDiff[0], _oRealDiff[1]);
						_oRealDiff && _left(_oRealDiff[0], _oRealDiff[1]);
					};
				case 'left':
					return function(_anDiffX, _anDiffY) {
						var _oRealDiff = _oSelf._computeDiff(_anDiffX, _anDiffY, true, false, true, true);
						_oRealDiff && _top(_oRealDiff[0], _oRealDiff[1]);
						_oRealDiff && _left(_oRealDiff[0], _oRealDiff[1]);
					};
				case 'bottom':
					return function(_anDiffX, _anDiffY) {
						var _oRealDiff = _oSelf._computeDiff(_anDiffX, _anDiffY, false, true, false, false, true, true);
						_oRealDiff && _bottom(_oRealDiff[0], _oRealDiff[1]);
						_oRealDiff && _right(_oRealDiff[0], _oRealDiff[1]);
					};
				case 'right':
					return function(_anDiffX, _anDiffY) {
						var _oRealDiff = _oSelf._computeDiff(_anDiffX, _anDiffY, true, false, false, false, true, true);
						_oRealDiff && _bottom(_oRealDiff[0], _oRealDiff[1]);
						_oRealDiff && _right(_oRealDiff[0], _oRealDiff[1]);
					};
				case 'left-top':
					return function(_anDiffX, _anDiffY) //�ֽ�Ϊtop left
					{
						var _oRealDiff = _oSelf._computeDiff(_anDiffX, _anDiffY, true, true, true, true);
						_oRealDiff && _top(_oRealDiff[0], _oRealDiff[1]);
						_oRealDiff && _left(_oRealDiff[0], _oRealDiff[1]);
					};
				case 'right-top':
					return function(_anDiffX, _anDiffY) //�ֽ�Ϊtop right
					{
						var _oRealDiff = _oSelf._computeDiff(_anDiffX, _anDiffY, true, true, true, false, false, true);
						_oRealDiff && _top(_oRealDiff[0], _oRealDiff[1]);
						_oRealDiff && _right(_oRealDiff[0], _oRealDiff[1]);
					};
				case 'left-bottom':
					return function(_anDiffX, _anDiffY) //�ֽ�Ϊbottom left
					{
						var _oRealDiff = _oSelf._computeDiff(_anDiffX, _anDiffY, true, true, false, true, true, false);
						_oRealDiff && _bottom(_oRealDiff[0], _oRealDiff[1]);
						_oRealDiff && _left(_oRealDiff[0], _oRealDiff[1]);
					};
				case 'right-bottom':
					return function(_anDiffX, _anDiffY) //�ֽ�Ϊbottom right
					{
						var _oRealDiff = _oSelf._computeDiff(_anDiffX, _anDiffY, true, true, false, false, true, true);
						_oRealDiff && _bottom(_oRealDiff[0], _oRealDiff[1]);
						_oRealDiff && _right(_oRealDiff[0], _oRealDiff[1]);
					};
				default:
					return function() {
						debug('undifined direction')
					};
			}
			//���ŵĹؼ��ǽ������ƶ��ķ����ֽ�Ϊx y, �����ķֽ�ͬ��
			//ע��Ҫ��֤top left height width ����Ϊ������������ie�лᱨ��

			function _top(_anDiffX, _anDiffY) {
				_oStyle.top = _oSelf._mnTop + _anDiffY + 'px';
				_oStyle.height = _oSelf._mnHeight - _anDiffY + 'px';
			}

			function _left(_anDiffX, _anDiffY) {
				_oStyle.left = _oSelf._mnLeft + _anDiffX + 'px';
				_oStyle.width = _oSelf._mnWidth - _anDiffX + 'px';
			}

			function _bottom(_anDiffX, _anDiffY) {
				_oStyle.height = _oSelf._mnHeight + _anDiffY + 'px';
			}

			function _right(_anDiffX, _anDiffY) {
				_oStyle.width = _oSelf._mnWidth + _anDiffX + 'px';
			}
		}
	};

	/**
	 * ͼƬ���ù���
	 * @param {Object} _aoContainer ͼƬװ������
	 * @param {Object} _aoOptions   ����, ������ this._moOptions
	 * @param {Object} _aoCallBacks �ص������� ������this._moCallBacks
	 */
	var _oQMImgCropper = _aoWin.QMImgCropper = function(_aoContainer, _aoOptions, _aoCallBacks) {
		this._moContainer = null;
		this._msImgPath = '';
		this._moPreviewImgs = [];
		this._moOptions = {
			//initResize  : true, //�Ƿ���ʼ�����ÿ� todo
			resizeScale: 1, //���ű��� height/width
			//mask        : true, //�Ƿ�����������Ӱ todo
			previewDoms: [] //Ԥ��dom���󣬿�Ϊ0��������
		};
		this._moCallBacks = {
			onready: function() { /* debug('onready'); */ }, //׼������
			onmove: function() { /* debug('onmove'); */ }, //���ÿ��ƶ�ʱ�ص�
			onresize: function() { /* debug('onresize'); */ } //���ÿ�����ʱ�ص�
		};

		this._init(_aoContainer, _aoOptions, _aoCallBacks);
	};

	_oQMImgCropper.prototype = {
		/**
		 * ������Ҫ���õ�ͼƬ
		 * @param {String} _asImgPath ͼƬ��ַ
		 */
		setImg: function(_asImgPath) {
			this._msImgPath = _asImgPath;
			this._setLayer();
		},

		//����ͼƬ·��
		getImg: function() {
			return this._msImgPath;
		},

		/**
		 * ��ȡͼƬ����λ��
		 * @return [top, left, height, width, rawWidth, rawHeight]
		 */
		getPos: function() {
			var _oSelf = this;
			var _oCropperPos = _oSelf._getCropperPos();

			return [
				Math.round(_oCropperPos[0] * _oSelf._mnImageHeight / _oSelf._mnImgStyleHeight),
				Math.round(_oCropperPos[3] * _oSelf._mnImageWidth / _oSelf._mnImgStyleWidth),
				Math.round(_oCropperPos[4] * _oSelf._mnImageHeight / _oSelf._mnImgStyleHeight),
				Math.round(_oCropperPos[5] * _oSelf._mnImageWidth / _oSelf._mnImgStyleWidth),
				Math.round(_oSelf._mnImageWidth),
				Math.round(_oSelf._mnImageHeight)
			];
		},

		_init: function(_aoContainer, _aoOptions, _aoCallBacks) {
			this._moContainer = _aoContainer;
			this._moDocument = _aoContainer.ownerDocument; //����js����top����������ͬ
			this._moWindow = this._moDocument.parentWindow || this._moDocument.defaultView;
			$.extend(this._moOptions, _aoOptions);
			$.extend(this._moCallBacks, _aoCallBacks);
		},

		_setLayer: function() {
			var _oSelf = this,
				_oContainer = _oSelf._moContainer;
			//_oContainerHeight = _oContainer.clientHeight,
			//_oContainerWidth  = _oContainer.clientWidth;
			//��Ҫ�������в���������������
			var _oWrapper = _oSelf._moDocument.createElement('div'),
				_oBaseImg = _oSelf._moDocument.createElement("img"),
				_oCropperImg = _oSelf._moDocument.createElement("img");

			_oContainer.innerHTML = '';
			_oWrapper.style.position = "relative";
			_oWrapper.style.backgroundColor = '#000';
			_oWrapper.style.display = 'none'; //�������������ᵼ�³��ִ���ͼƬ��Ч����������ʱ����

			_oSelf._moWrapper = _oContainer.appendChild(_oWrapper);
			_oSelf._moBaseImg = _oSelf._moWrapper.appendChild(_oBaseImg);
			_oSelf._moCropperImg = _oSelf._moWrapper.appendChild(_oCropperImg);

			$(_oSelf._moBaseImg).on('load', _setStyle);
			_oBaseImg.src = _oCropperImg.src = _oSelf._msImgPath;

			function _setStyle() {
				var _oContainerHeight = _oContainer.clientHeight,
					_oContainerWidth = _oContainer.clientWidth;
				$(_oSelf._moWrapper).show();
				//��¼ͼƬ��ԭʼ��С����ʽ��С
				_oSelf._mnImageHeight = _oSelf._moBaseImg.height;
				_oSelf._mnImageWidth = _oSelf._moBaseImg.width;
				var _oStyleSize = _oSelf._getSize([_oContainerHeight, _oContainerWidth], [_oSelf._mnImageHeight, _oSelf._mnImageWidth]);
				_oSelf._mnImgStyleHeight = _oStyleSize[0];
				_oSelf._mnImgStyleWidth = _oStyleSize[1];

				with(_oSelf._moWrapper.style) {
					height = _oStyleSize[0] + 'px';
					width = _oStyleSize[1] + 'px';
					top = (_oContainerHeight - _oStyleSize[0]) / 2 + 'px';
					left = (_oContainerWidth - _oStyleSize[1]) / 2 + 'px';
				}

				with(_oSelf._moBaseImg.style) {
					height = _oStyleSize[0] + 'px';
					width = _oStyleSize[1] + 'px';
					position = 'absolute';
				}
				$(_oSelf._moBaseImg).css("opacity", 0.6);

				with(_oSelf._moCropperImg.style) {
					height = _oSelf._mnImgStyleHeight + 'px';
					width = _oSelf._mnImgStyleWidth + 'px';
					position = 'absolute';
					zIndex = '100';
				}

				//����Ԥ������
				_oSelf._moPreviewImgs = [];
				for (var i = 0, _preDoms = _oSelf._moOptions.previewDoms; i < _preDoms.length; i++) {
					var _oTempImg = _oSelf._moDocument.createElement('img');
					_oTempImg.src = _oSelf._msImgPath;
					_oTempImg.style.position = 'absolute';
					_preDoms[i].style.overflow = 'hidden';
					_preDoms[i].style.position = 'relative';
					_preDoms[i].innerHTML = '';
					_oSelf._moPreviewImgs.push(_preDoms[i].appendChild(_oTempImg));
				}
				//���ü��ÿ�
				_oSelf._setCropper();
				//��ie�У�gifͼƬ�᲻�ϲ���onload���¼�����������Ҫȡ��������load���¼�����
				$(_oSelf._moBaseImg).off('load', _setStyle);

				//׼������
				_oSelf._moCallBacks['onready']();
			}

			return _oSelf;
		},

		_setCropper: function() {
			var _oSelf = this,
				_sKey = $.now(),
				_nScale = _oSelf._moOptions.resizeScale,
				_nResizeTop, _nResizeLeft, _nResizeHeight, _nResizeWidth,
				_nDeviation = 0;
			if (!$.browser.msie) //��IE�ͷ�IE����������һ��dom��height width�������Ƿ������߿��Ĳ�ͬ
			{
				_nDeviation = 2; //��cropper�б߿�������1px
			}
			if (_oSelf._mnImgStyleWidth / _oSelf._mnImgStyleHeight > _nScale) {
				_nResizeHeight = _oSelf._mnImgStyleHeight - _nDeviation;
				_nResizeWidth = _nResizeHeight * _nScale;
				_nResizeTop = 0;
				_nResizeLeft = (_oSelf._mnImgStyleWidth - _nResizeWidth) / 2;
			} else {

				_nResizeWidth = _oSelf._mnImgStyleWidth - _nDeviation;
				_nResizeHeight = _nResizeWidth / _nScale;
				_nResizeTop = (_oSelf._mnImgStyleHeight - _nResizeHeight) / 2;
				_nResizeLeft = 0;
			}

			$(_oSelf._moWrapper).append($.tmpl(_oQMImgCropper.TMPL.cropper, {
				'_id': _sKey,
				'top': _nResizeTop + 'px',
				'left': _nResizeLeft + 'px',
				'height': _nResizeHeight + 'px',
				'width': _nResizeWidth + 'px'
			}));

			_oSelf._moCropper = $('#resizedom_' + _sKey, _oSelf._moDocument)[0];
			var _oHandlers = [
				[$('#rUp_' + _sKey, _oSelf._moDocument)[0], 'top'],
				[$('#rLeft_' + _sKey, _oSelf._moDocument)[0], 'left'],
				[$('#rDown_' + _sKey, _oSelf._moDocument)[0], 'bottom'],
				[$('#rRight_' + _sKey, _oSelf._moDocument)[0], 'right'],
				[$('#rLeftUp_' + _sKey, _oSelf._moDocument)[0], 'left-top'],
				[$('#rLeftDown_' + _sKey, _oSelf._moDocument)[0], 'left-bottom'],
				[$('#rRightUp_' + _sKey, _oSelf._moDocument)[0], 'right-top'],
				[$('#rRightDown_' + _sKey, _oSelf._moDocument)[0], 'right-bottom']
			];

			(new QMResize(
				_oSelf._moCropper, {
					maxContainer: _oSelf._moWrapper,
					scale: _nScale
				}, { //callbacks
					onresize: function() {
						_setCropEffect();
						_oSelf._moCallBacks['onresize']();
					}
				}
			)).setTriggers(_oHandlers);

			$(_oSelf._moCropper).draggable({
				container: _oSelf._moWrapper
			}).bind("dragStart", function() {
				$.each(_oHandlers, function(i, _aoHandler) {
					$(_aoHandler[0]).hide();
				});
			}).bind("drag", function() {
				_setCropEffect();
				_oSelf._moCallBacks['onmove']();
			}).bind("dragStop", function() {
				$.each(_oHandlers, function(i, _aoHandler) {
					$(_aoHandler[0]).show();
				});
			});

			function _setCropEffect() {
				var _oCropperPos = _oSelf._getCropperPos();
				_oSelf._moCropperImg.style.clip = "rect(" + (_oCropperPos[0] + 1) + 'px,' + (_oCropperPos[1] + 1) + 'px,' +
					(_oCropperPos[2] + 1) + 'px,' + (_oCropperPos[3] + 1) + "px)";
				//Ԥ���������ͣ���Ȼ�����ᵼ����chrome���ٶ�����
				/* !_oSelf._mnPreviewCount && (_oSelf._mnPreviewCount = 0);
			if ((_oSelf._mnPreviewCount%10) == 0)
			{
				_oSelf._setPreview();
				
			}
			_oSelf._mnPreviewCount++; */
				/* !_oSelf._mnPreviewWaiting && _oSelf._mnPreviewWaiting = true; 
			if (_oSelf._mnPreviewWaiting == true)
			setTimeout(function (){
				_oSelf._setPreview();
			}, 1000);  */
				_oSelf._setPreview();
			}
			_setCropEffect();
			return _oSelf;
		},

		_setPreview: function() {
			var _oSelf = this,
				_oPreDoms = _oSelf._moOptions.previewDoms,
				_oPreImgs = _oSelf._moPreviewImgs,
				_oCropperPos = _oSelf._getCropperPos();

			for (var i = 0; i < _oPreImgs.length; i++) {
				var _nWrapHeight = _oPreDoms[i].clientHeight,
					_nWrapWidth = _oPreDoms[i].clientWidth;

				with(_oPreImgs[i].style) {
					if (_oCropperPos[4] && _oCropperPos[5]) //���ܳ���0
					{
						height = (_oSelf._mnImgStyleHeight * _nWrapHeight / _oCropperPos[4]) + 'px';
						width = (_oSelf._mnImgStyleWidth * _nWrapWidth / _oCropperPos[5]) + 'px';
						top = -(_oCropperPos[0] * _nWrapHeight / _oCropperPos[4]) + 'px';
						left = -(_oCropperPos[3] * _nWrapWidth / _oCropperPos[5]) + 'px';
					}
				}
			}

			return _oSelf;
		},

		_getSize: function(_aoContainerSize, _aoImgRealSize) {
			var _oSelf = this,
				_oStyleSize = [0, 0];

			if (_aoContainerSize[0] > _aoImgRealSize[0] && _aoContainerSize[1] > _aoImgRealSize[1]) {
				return _aoImgRealSize;
			} else if (_aoImgRealSize[0] * _aoContainerSize[1] > _aoImgRealSize[1] * _aoContainerSize[1]) {
				var _nTemp = _aoContainerSize[0] * _aoImgRealSize[1] / (_aoImgRealSize[0] || 1);
				if (_nTemp > _aoContainerSize[1]) {
					return [_aoContainerSize[1] * _aoContainerSize[0] / _nTemp, _aoContainerSize[1]];
				} else {
					return [_aoContainerSize[0], _nTemp];
				}
				//return [_aoContainerSize[0], _aoContainerSize[0]*_aoImgRealSize[1]/(_aoImgRealSize[0] || 1)]; //����_aoImgRealSize[0] Ϊ0����д1
			} else {
				var _nTemp = _aoImgRealSize[0] * _aoContainerSize[1] / (_aoImgRealSize[1] || 1);
				if (_nTemp > _aoContainerSize[0]) {

					return [_aoContainerSize[0], _aoContainerSize[1] * _aoContainerSize[0] / _nTemp];
				} else {
					return [_nTemp, _aoContainerSize[1]];
				}
				//return [_aoImgRealSize[0]*_aoContainerSize[1]/(_aoImgRealSize[1] || 1), _aoContainerSize[1]]; //����_aoImgRealSize[1] Ϊ0����д1
			}
		},
		//return [top, right, bottom, left, height, width]
		_getCropperPos: function() {
			var _oSelf = this,
				_oCropper = this._moCropper;
			return [
				_oCropper.offsetTop,
				_oCropper.offsetLeft + _oCropper.clientWidth,
				_oCropper.offsetTop + _oCropper.clientHeight,
				_oCropper.offsetLeft,
				_oCropper.clientHeight,
				_oCropper.clientWidth];
		}
	};

	_oQMImgCropper.TMPL = {
		cropper: [
			'<div id="resizedom_<#=_id#>" style="border:1px dashed #ccc; width:<#=width#>; height:<#=height#>; top:<#=top#>; left:<#=left#>; position:absolute;cursor:move;z-index:200;">',
			'<div id="rRightDown_<#=_id#>" style="position:absolute;background:#FFF;border: 1px solid #333;width: 6px;height: 6px;z-index:500;font-size:0;opacity: 0.5;filter:alpha(opacity=50);cursor:nw-resize;right:-4px;bottom:-4px;background-color:#00F;"> </div>',
			'<div id="rLeftDown_<#=_id#>" style="position:absolute;background:#FFF;border: 1px solid #333;width: 6px;height: 6px;z-index:500;font-size:0;opacity: 0.5;filter:alpha(opacity=50);cursor:ne-resize;left:-4px;bottom:-4px;"> </div>',
			'<div id="rRightUp_<#=_id#>" style="position:absolute;background:#FFF;border: 1px solid #333;width: 6px;height: 6px;z-index:500;font-size:0;opacity: 0.5;filter:alpha(opacity=50);cursor:ne-resize;right:-4px;top:-4px;"> </div>',
			'<div id="rLeftUp_<#=_id#>" style="position:absolute;background:#FFF;border: 1px solid #333;width: 6px;height: 6px;z-index:500;font-size:0;opacity: 0.5;filter:alpha(opacity=50);cursor:nw-resize;left:-4px;top:-4px;"> </div>',
			'<div id="rRight_<#=_id#>" style="position:absolute;background:#FFF;border: 1px solid #333;width: 6px;height: 6px;z-index:500;font-size:0;opacity: 0.5;filter:alpha(opacity=50);cursor:e-resize;right:-4px;top:50%;margin-top:-4px;"> </div>',
			'<div id="rLeft_<#=_id#>" style="position:absolute;background:#FFF;border: 1px solid #333;width: 6px;height: 6px;z-index:500;font-size:0;opacity: 0.5;filter:alpha(opacity=50);cursor:e-resize;left:-4px;top:50%;margin-top:-4px;"> </div>',
			'<div id="rUp_<#=_id#>" style="position:absolute;background:#FFF;border: 1px solid #333;width: 6px;height: 6px;z-index:500;font-size:0;opacity: 0.5;filter:alpha(opacity=50);cursor:n-resize;top:-4px;left:50%;margin-left:-4px;"> </div>',
			'<div id="rDown_<#=_id#>" style="position:absolute;background:#FFF;border: 1px solid #333;width: 6px;height: 6px;z-index:500;font-size:0;opacity: 0.5;filter:alpha(opacity=50);cursor:n-resize;bottom:-4px;left:50%;margin-left:-4px;"> </div>',
			'<div style="filter: alpha(opacity:0); opacity:0;BACKGROUND-COLOR: #fff; width: 100%; height: 100%; font-size: 0px;"/>',
			'</div>'
		].join("")
	};

})(jQuery, this);
(function($, _aoWin, _aoUndefined) {
	/**
	 * flash �������ɺ���
	 * @param {String} _asId
	 * @param {String} _asFlashSrc
	 * @param {Object} _aoAttrs ���Զ��� width, height
	 * @param {Object} _aoParams �������� wmode
	 * @return {String} flash����
	 */

	function generateFlashCode(_asId, _asFlashSrc, _aoAttrs, _aoParams) {
		var _oAttrCode = [],
			_oParamCode = [],
			_oEmbedCode = [],
			_oParams = _aoParams || {},
			// ģ�嶨��
			_oAttrTmpl = ' <#=name#>=<#=value#> ',
			_oParamTmpl = '<param name="<#=name#>" value="<#=value#>" />',
			_oFlashTmpl = $.browser.msie ? ([
				'<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ',
				'<#=codebase#> ', '<#=attr#> <#=id#> >',
				'<#=param#>',
				'</object>'
			].join("")) : ([
				'<embed <#=embed#> type="application/x-shockwave-flash" ',
				'<#=pluginspage#> ', ' <#=name#> <#=id#> ></embed>'
			].join(""));

		function _genKeyValueMap(_asName, _asVal) {
			return {
				name: _asName,
				value: _asVal
			};
		}

		_oParams.allowscriptaccess = _aoAttrs && _aoAttrs.allowscriptaccess || "always";
		_oParams.quality = "high";

		for (var _name in _oParams) {
			var _oParam = _genKeyValueMap(_name, _oParams[_name]);
			_oParamCode.push($.tmpl(_oParamTmpl, _oParam));
			_oEmbedCode.push($.tmpl(_oAttrTmpl, _oParam));
		}

		for (var _name in _aoAttrs)

		{
			var _oParam = _genKeyValueMap(_name, _aoAttrs[_name]);
			_oAttrCode.push($.tmpl(_oAttrTmpl, _oParam));
			_oEmbedCode.push($.tmpl(_oAttrTmpl, _oParam));
		}

		if (_asFlashSrc) {
			_oParamCode.push($.tmpl(_oParamTmpl, _genKeyValueMap("movie", _asFlashSrc)));
			_oEmbedCode.push($.tmpl(_oAttrTmpl, _genKeyValueMap("src", _asFlashSrc)));
		}

		return $.tmpl(_oFlashTmpl, {
			id: _asId && [' id="', _asId, '"'].join(""),
			name: _asId && [' name="', _asId, '"'].join(""),
			attr: _oAttrCode.join(""),
			param: _oParamCode.join(""),
			embed: _oEmbedCode.join(""),
			codebase: location.protocol == "https:" ? '' : 'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" ',
			pluginspage: location.protocol == "https:" ? '' : 'pluginspage="http://www.adobe.com/cn/products/flashplayer" '
		});
	}

	/**
	 * ��ȡҳ����flash����
	 * @param {String} _asId
	 * @param {Object} _aoWin
	 * @return {Object}
	 */

	function getFlash(_asId, _aoWin) {
		var _oWin = _aoWin || window,
			_oDomObj = _oWin[_asId] || _oWin.document[_asId];
		return _oDomObj && (_oDomObj.length ? _oDomObj[_oDomObj.length - 1] : _oDomObj);
	}



	/*@param
_aConfig = {
	id	: string,
	win	: window,
	//event, use for flash object to call, for example, _mInterface.fireEvent("onxxx", ...);
	onxxx	: func,
	...
}
*/

	function qmFlash(_aConfig) {
		if (!(this._mId = _aConfig.id)) {
			throw Error(0, "config.id can't use null");
		}

		if (!(this._mWin = _aConfig.win)) {
			throw Error(0, "config.win win is null");
		}

		this._mFlash = _aConfig.flash;
		this._moConstructor = this.constructor;
		this._mEvent = _aConfig;
		this._initlize();
	}

	_goStatic = qmFlash;
	_goClass = _goStatic.prototype;

	_goStatic.get = function(_aId, _aWin) {
		var _cache = _aWin[this._CONST._CACHES];
		return _cache && _cache[_aId];
	};

	_goStatic.getFlashVer = function() {
		var _info = "";
		var _version = -1;
		var _beta = -1;
		var _build = -1;
		var _plugins = navigator.plugins;
		if (_plugins && _plugins.length) {
			// non ie
			for (var i = 0, _length = _plugins.length; i < _length; i++) {
				var _plugin = _plugins[i];
				if (_plugin.name.indexOf('Shockwave Flash') != -1) {
					_info = _plugin.description.split('Shockwave Flash ')[1];
					_version = parseFloat(_info);
					_build = parseInt(_info.split("r")[1]);
					_beta = parseInt(_info.split("b")[1]);
					break;
				}
			}
		} else {
			try {
				var _swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
				if (_swf) {
					_info = _swf.GetVariable("$version").split(" ")[1];
					var _infos = _info.split(",");
					_version = parseFloat(_infos.join("."));
					_build = parseInt(_infos[2]);
					_beta = parseInt(_infos[3]);
				}
			} catch (e) {}
		}

		return {
			version: (isNaN(_version) ? -1 : _version) || -1,
			build: (isNaN(_build) ? -1 : _build) || -1,
			beta: (isNaN(_beta) ? -1 : _beta) || -1,
			desc: _info
		};
	};

	_goStatic.isSupported = function() {
		var _ver = this.getFlashVer();
		return _ver.version >= 10 || _ver.version == 9 && _ver.build > 50;
	};

	_goStatic._CONST = {
		_TIMEOUT: 5 * 1000 /*5s*/ ,
		_CACHES: "qmFlashCaches_ASDr431gGas",
		_CALLBACK: "onFlashEvent_ASDr431gGas"
	};

	_goClass.getFlash = function() {
		return this._mFlash || getFlash(this._mId, this._mWin);
	};

	_goClass.isDisabled = function() {
		return this._mDisabled || false;
	};

	_goClass.disable = function(_aIsDisable) {
		this._mDisabled = _aIsDisable != false;
		return this;
	};

	/*@param
_aOnSetupFinishCallBack = function( _aIsOk, _aErrMsg ) {
	_aIsOk		: boolean,
	_aErrMsg	: string -- error info
							  |-- notfound : no obj
							  |-- noflash  : may be no setup flash
							  |-- timeout  : load flash time out
							  |-- nosetup  : flash no setup interface
							  |-- setuperr : flash setup return false
};
*/
	_goClass.setup = function(_aOnSetupFinishCallBack) {
		var _self = this;

		function _fCallBack(_aIsOk, _aErrMsg) {
			try {
				_aOnSetupFinishCallBack.call(_self, _aIsOk, _aErrMsg);
			} catch (e) {}
		}

		this._getLoadedPercent(function(_aValue) {
			if (_aValue == 100) {
				setTimeout(function() {
					try {
						if (!_self.getFlash().setup(qmFlash._CONST._CALLBACK, _self._mId))
							return _fCallBack(false, "setuperr");
					} catch (e) {
						return _fCallBack(false, "nosetup");
					}

					_fCallBack(true);
				});
			} else if (typeof _aValue != "number") {
				_fCallBack(false, _aValue);
			}
			//else {
			//	debug( "load flash percent:" + _aValue, "", 61882714 );
			//}
		});
	};

	// private
	/*@param
_aOnGetLoadedPercentCallBack = function( _aValue ) {
	_aValue :
	// number -- percent
	// string -- error info
				  |-- notfound : no obj
				  |-- noflash  : may be no setup flash
				  |-- timeout  : load flash time out
};
*/
	_goClass._getLoadedPercent = function(_aOnGetLoadedPercentCallBack) {
		var _self = this;

		function _fCallBack(_aValue) {
			try {
				_aOnGetLoadedPercentCallBack.call(_self, _aValue);
			} catch (e) {}
		}

		var _obj = this.getFlash();
		if (!_obj)
			return _fCallBack("notfound");

		var _oldPercent = 0;
		(function() {
			var _selfFunc = arguments.callee;
			if (!_selfFunc._startTime)
				_selfFunc._startTime = $.now();

			var _percent = 0;
			var _isError = false;
			try {
				_percent = _obj.PercentLoaded();
			} catch (e) {
				_isError = true;
			}

			if (_percent != _oldPercent)
				_fCallBack(_oldPercent = _percent);

			if (_percent != 100) {
				if ($.now() - _selfFunc._startTime > qmFlash._CONST._TIMEOUT) {
					_fCallBack(_isError ? "noflash" : "timeout");
				} else {
					setTimeout(_selfFunc, 100);
				}
			}
		})();
	};

	_goClass._initlize = function() {
		var _win = this._mWin,
			_const = this._moConstructor._CONST,
			_caches = _const._CACHES,
			_callback = _const._CALLBACK;

		if (!_win[_caches])
			_win[_caches] = new _win.Object;

		_win[_caches][this._mId] = this;

		if (!_win[_callback]) {
			_win[_callback] = function() {
				var _id = arguments[0];
				var _eventType = arguments[1];
				var _flashObj = _win[_caches][_id];

				if (_flashObj && typeof(_flashObj._mEvent[_eventType]) == "function") {
					var _args = [];
					for (var i = 2, _len = arguments.length; i < _len; i++)
						_args.push(arguments[i]);
					_flashObj._mEvent[_eventType].apply(_flashObj, _args);
				}
			};
		}
	};

	$.generateFlashCode = generateFlashCode;
	$.getFlash = getFlash;
	$.qmFlash = qmFlash;

})(jQuery, this);
(function($, _aoWin, _aoUndefined) {

	var _oEventListeners = {};
	_aoWin.WebMM = $.extend(_aoWin.WebMM || {}, {
		triggerEvent: function(_asType, _aoData, _abNotGlobal) {
			setTimeout(function() {
				$(_aoWin.document.body).trigger("globalevent", {
					type: _asType,
					range: (!_abNotGlobal) && "all",
					data: _aoData
				});
				_oEventListeners[_asType] && _oEventListeners[_asType](_aoData);
			}, 0);
		},

		addEventListener: function(_asType, _afCallback) {
			_oEventListeners[_asType] = _afCallback;
		}
	});

})(jQuery, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	var _oModelCntr = {};
	_aoWebMM.model = _aoWebMM.model || function(_asName, _aoImpl) {
		if (!_aoImpl) {
			return _oModelCntr[_asName];
		}
		_oModelCntr[_asName] = $.extend(_oModelCntr[_asName] || {}, _aoImpl);
	};

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {

	var _oLogicCntr = {};
	_aoWebMM.logic = _aoWebMM.logic || function(_asName, _aoImpl) {
		if (!_aoImpl) {
			return _oLogicCntr[_asName];
		}
		_oLogicCntr[_asName] = $.extend(_oLogicCntr[_asName] || {}, _aoImpl);
	};

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	/**
	 * ����URI�е�searchcansh
	 * �� action1?param1=&param2=/action2?param3=
	 * ���ض��� {ctrl:action1, param1:, param2:, child:{ctrl:action2, param3:}}
	 */

	function _getQueryParam(_asCurHash, _asChildHash) {
		var _oQueryParam = $.parseURLParam(_asCurHash);
		_oQueryParam.ctrl = _asCurHash.split("?")[0];

		if (_asChildHash) {
			_oQueryParam.child = arguments.callee(_asChildHash);
		}

		return _oQueryParam;
	}

	function _getExistedPage(_sChildName, _aoContext$) {
		//var _oPage$ = (_aoContext$||$(document.body)).find("[id='"+_sChildName+"']");
		var _oPage$ = $("#" + _sChildName);
		return _oPage$.length && _oPage$;
	}

	var _fCtrl = Class({
		init: function(_asName, _aoOptions) {
			var _oSelf = this,
				_oOptions = _aoOptions || {};
			_oSelf._moChildren = {};
			_oSelf._msName = _asName;
			_oSelf._moDom$ = _oOptions.oDom$.attr("ctrl", 1);
			_oSelf._moDom$[0].ctrl = _oSelf;
			_oSelf._moParent = _oOptions.oParent;

			_oOptions.oParent = _oSelf;
			_oSelf._moComponets = _aoWebMM.ctrlComponents(_oSelf, _oOptions);
		},

		getName: function() {
			return this._msName;
		},

		getParent: function() {
			return this._moParent;
		},

		_changeActive: function(_aoParam, _asCurHash) {
			if (this._msLastHash != _asCurHash) {
				this._moParams = _aoParam;
				this._msLastHash = _asCurHash;
				for (var i = 0, len = this._moComponets.length; i < len; i++) {
					this._moComponets[i].active(_aoParam);
				}
				this.active(_aoParam);
			}
		},

		// @override
		active: function() {},

		_inactive: function() {
			this._msLastHash = "";
			this.inactive && this.inactive();
		},

		isActive: function() {
			return !!this._mbActive;
		},

		back: function() {
			$.history.back();
		},

		isTopView: function() {
			return this.isActive() && !this._msActiveChild;
		},
		/*
		 * _asEventType: hashchange/domevent/globalevent
		 */
		dispatch: function(_asEventType) {
			var _sName = "on" + _asEventType.toLowerCase();
			this[_sName] && this[_sName](arguments[1], arguments[2]);
		},

		getDom$: function() {
			return this._moDom$;
		},

		getParam: function(_asKey) {
			return (this._moParams || {})[_asKey];
		},

		html: function(_asHTML) {
			if (_asHTML == _aoUndefined) {
				return this._moDom$.html();
			}
			return this._moDom$.html(_asHTML);
		},

		onglobalevent: function(_aoEvent) {
			var _oSelf = this,
				_sType = _aoEvent.type,
				_sRange = _aoEvent.range;
			if (_sRange == "all") {
				for (var name in _oSelf._moChildren) {
					_oSelf._moChildren[name].onglobalevent(_aoEvent);
				}
			} else if (_oSelf._msActiveChild) {
				_oSelf._moChildren[_oSelf._msActiveChild].onglobalevent(_aoEvent);
			}
			_oSelf[_sType] && _oSelf[_sType](_aoEvent.data);
			for (var i = 0, len = _oSelf._moComponets.length; i < len; i++) {
				_oSelf._moComponets[i][_sType] && _oSelf._moComponets[i][_sType](_aoEvent.data);
			}
		},

		onhashchange: function(_asHash, _aoLink$) {
			var _oSelf = this,
				_oHash = _asHash.replace(/^#/ig, "").split("/"),
				_oQueryParam = _getQueryParam(_oHash[0], _oHash[1]);
			_oSelf._changeActive(_oQueryParam, _oHash[0]);

			if (_oQueryParam.child && _oQueryParam.child.ctrl) {
				var _sChildName = _oQueryParam.child.ctrl;
				if (!_oSelf._moChildren[_sChildName]) {
					//try {
					_oSelf._moChildren[_sChildName] = _aoWebMM.ctrl(_sChildName, {
						oDom$: _getExistedPage(_sChildName, _oSelf._moDom$) || $("<div>").attr("un", _sChildName),
						oParent: _oSelf
					});
					//} catch(e) { Log.e(e); $.hash(""); }
				}

				if (_oSelf._moChildren[_sChildName]) {
					// ��ʾ
					if (_oSelf.switchChild(_oSelf._msActiveChild, _sChildName) !== false) {
						// ����
						_oHash.shift();
						_oSelf._moChildren[_sChildName].onhashchange(_oHash.join("/") || _sChildName, _aoLink$);
					}
				}
			} else if (_oSelf._msActiveChild) {
				// ����
				_oSelf.switchChild(_oSelf._msActiveChild, null);
			}

			return _oSelf;
		},

		switchChild: function(_asOld, _asNew) {
			// default _asOld hide & _asNew show
		}

	});

	var _fPageCtrl = _fCtrl.Inherit({
		popupWindow: function(_asTitle, _asContent, _aoStartPosDom$, _aoOffset, _aoOptions) {
			var _oDom$ = this.getDom$();
			_oDom$.html($.tmpl("popupwindow")).find(".content").html(_asContent);
			_oDom$.find(".header p").html(_asTitle);
			_aoWebMM.widget.screenCentral(_oDom$, $.extend({
				rawPosDom$: _aoStartPosDom$,
				offset: _aoOffset,
				showMask: true,
				lightMask: true
			}, _aoOptions));
			_oDom$.draggable({
				handle: ".header",
				cursor: "move"
			});
		},

		showTips: function(_asTips, _abSucc, _aoOptions) {
			var _sTips = _asTips || "",
				_nTime = 1.5 * 1000,
				_oTips$ = $("#tips");
			_oTips$.find(".tipsDesc").html(_asTips);
			_oTips$.find(".tipsIcon")[_abSucc ? "removeClass" : "addClass"]("errorIcon");
			_aoWebMM.widget.screenCentral(_oTips$, $.extend({
				showMask: false,
				adjustPos: false
			}, _aoOptions));
			setTimeout(function() {
				_oTips$.hide();
			}, _nTime);
		},

		alert: function(_asText, _aoCallbacks, _asContentClass) {
			this._showTips(_asText || "", _aoCallbacks, true, false, _asContentClass);
		},

		confirm: function(_asText, _aoCallbacks, _asContentClass) {
			this._showTips(_asText || "", _aoCallbacks, true, true, _asContentClass);
		},

		closeAlertOrConfirm: function() {
			$("#redirectDialog").hide();
		},

		_showTips: function(_asText, _aoCallbacks, _abShowOkBtn, _abShowCancelBtn, _asContentClass) {
			var _oTips$ = $("#redirectDialog"),
				_oTipsContent$ = _oTips$.find(".dialogContent"),
				_oContent$ = $("<div></div>").html(_asText),
				_sContentClass = _asContentClass ? _asContentClass : "default";
			_oTipsContent$.html(_oContent$.addClass(_sContentClass));
			_aoWebMM.widget.screenCentral(_oTips$.show());

			_aoCallbacks = $.extend({
				ok: function() {},
				cancel: function() {}
			}, _aoCallbacks);

			_oTips$.find("[un='ok']").off("click").on("click", function() {
				_oTips$.hide();
				_aoCallbacks.ok(_oTipsContent$);
			})[_abShowOkBtn ? "show" : "hide"]()[_abShowCancelBtn ? "removeClass" : "addClass"]("singleBtn");
			_oTips$.find("[un='cancel']").off("click").on("click", function() {
				_oTips$.hide();
				_aoCallbacks.cancel(_oTipsContent$);
			})[_abShowCancelBtn ? "show" : "hide"]();

			_oTips$.off("keydown").on("keydown", function(_aoEvent) {
				if ($.isHotkey(_aoEvent, "enter")) {
					_oTips$.hide();
					_aoCallbacks.ok(_oTipsContent$);
					return;
				}

				if ($.isHotkey(_aoEvent, "esc")) {
					_oTips$.hide();
					_aoCallbacks.cancel(_oTipsContent$);
					return;
				}
				_aoEvent.stopPropagation();
			})
		},

		onhashchange: function(_asHash, _aoLink$) {
			var _oSelf = this;
			_aoLink$ && _aoLink$.addClass("active");
			_oSelf.Root.onhashchange.call(_oSelf, _asHash);
		},

		switchChild: function(_asOld, _asNew) {
			var _oSelf = this,
				_oOld$ = _asOld && (_asOld != _asNew) && _oSelf._moChildren[_asOld].getDom$(),
				_oNew$ = _asNew && _oSelf._moChildren[_asNew].getDom$();

			if (_asOld != _asNew) {
				_oOld$ && _oOld$.hide();
				_oNew$ && _oNew$.show();

				if (_asOld && _oSelf._moChildren[_asOld]) {
					_oSelf._moChildren[_asOld]._mbActive = false;
					_oSelf._moChildren[_asOld]._inactive();

					for (var i = 0, len = _oSelf._moChildren[_asOld]._moComponets.length; i < len; i++) {
						_oSelf._moChildren[_asOld]._moComponets[i]._inactive();
					}
				}
			}
			_oSelf._msActiveChild = _asNew;
			_asNew && _oSelf._moChildren[_asNew] && (_oSelf._moChildren[_asNew]._mbActive = true);

			return true;
		}
	});

	var _oCtrlCntr = {
		base: _fPageCtrl
	},
		_oCtrlInsCache = {};

	$.extend(_aoWebMM || {}, {
		createCtrl: function( /*[_asParent, ]_asName, _aoExtensions*/ ) {
			var _oArgs = arguments.length == 2 && ["base"].concat([].slice.apply(arguments)) || arguments,
				_sParent = _oArgs[0],
				_sName = _oArgs[1],
				_oExts = _oArgs[2];

			var _fParent = _oCtrlCntr[_sParent] || _oCtrlCntr["base"];
			_oCtrlCntr[_sName] = _fParent.Inherit(_oExts);
		},

		ctrl: function(_asName, _aoOptions) {
			return _oCtrlInsCache[_asName] = (_oCtrlCntr[_asName] && new _oCtrlCntr[_asName](_asName, _aoOptions) || {});
		},

		getCtrlInstants: function(_asName) {
			return _oCtrlInsCache[_asName];
		},

		ctrlComponents: function(_aoCtrl, _aoOptions) {
			var _oResult = [];
			for (var key in _oCtrlCntr) {
				if (key.indexOf(_aoCtrl.getName() + "_") == 0) {
					var _oOpt = $.extend({}, _aoOptions, {
						oDom$: _getExistedPage(key, _aoCtrl.getDom$()) || $("<div>").attr("un", key)
					});
					_oResult.push(this.ctrl(key, _oOpt));
				}
			}
			return _oResult;
		}
	});

	_aoWebMM.widget = {};

})(jQuery, WebMM, this);
(function($, _aoWin, _aoUndefined) {
	var _oCache = [],
		_nMaxLen = 10,
		_nMaxDelay = 60 * 1000,
		_nTimer /* = setTimeout(_report, _nMaxDelay)*/ ;

	_aoWin.WebMMCantSendLog = [];

	function _report() {
		var _oQuery = [];
		for (var i = 0, len = _oCache.length; i < len; i++) {
			_oQuery.push("type=" + _oCache[i].Type);
		}

		var _oPostData = {
			BaseRequest: {
				Uin: 0,
				Sid: 0
			},
			Count: _oCache.length,
			List: _oCache
		};
		$.netQueue("statReport").send("/cgi-bin/mmwebwx-bin/webwxstatreport?" + _oQuery.join("&"), _oPostData, {
			onerror: function() {
				_aoWin.WebMMCantSendLog.push({
					date: new Date().toString(),
					list: _oCache
				});
			}
		});

		clearTimeout(_nTimer);
		_nTimer = 0;
		//        _nTimer = setTimeout(_report, _nMaxDelay);
		_oCache = [];
	}

	_aoWin.WebMM = $.extend(_aoWin.WebMM || {}, {
		ossLog: function(_aoData) {
			_aoData = $.extend({
				Type: 1
			}, _aoData);
			if (!_oCache.length && _nTimer == 0) {
				_nTimer = setTimeout(_report, _nMaxDelay);
			}
			_oCache.push(_aoData);
			if (_oCache.length >= _nMaxLen) {
				_report();
			}
		},
		flushOssLog: function() {
			_report();
		}
	});

})(jQuery, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	_aoWin.WebLog = "";

	var _INFO_LEVEL = 0,
		_DEBUG_LEVEL = 1,
		_WARN_LEVEL = 2,
		_ERROR_LEVEL = 3,
		_nLogLevel = _DEBUG_LEVEL;

	var _oConsole = _aoWin.console;

	function _fConsolePrint() {
		if (true && _oConsole && _oConsole.log) {
			Function.apply.apply(_oConsole.log, [_oConsole, arguments[0]]);
		}
	};

	function _fLog(_anLevel, _aoData) {
		if (_nLogLevel <= _anLevel) {
			if ($.isFunction(_aoData[0])) {
				$.safe(function() {
					_aoData[0]();
				});
				return;
			}
			_fConsolePrint(_aoData);

			var uin = "";
			try {
				uin = _aoWebMM.model("account").getUserInfo().Uin;
			} catch (e) {
				uin = "Can't get."
			}

			var _oErrMsg = {
				Type: 1,
				Text: JSON.stringify(_aoData),
				Uin: uin,
				Date: new Date().getTime()
			};

			for (var i = 0; i < _aoData.length; i++) {
				_aoWin.WebLog = $.formatDate(new Date(), "hh:mm:ss") + "\n" + JSON.stringify(_aoData[i]) + "\n\n" + _aoWin.WebLog;
			}
			WebMM.ossLog(_oErrMsg);
		}

		if (_aoWebMM.vConsole) {
			_aoWebMM.vConsole.print(_anLevel, _aoData);
		}
	}

	_aoWin.Log = {
		level: function(_anLevel) {
			if (_anLevel == _aoUndefined) {
				return _nLogLevel;
			}
			_nLogLevel = 0;
		},

		i: function() {
			_fLog(_INFO_LEVEL, arguments);
		},

		d: function() {
			_fLog(_DEBUG_LEVEL, arguments);
		},

		w: function() {
			_fLog(_WARN_LEVEL, arguments);
		},

		e: function() {
			_fLog(_ERROR_LEVEL, arguments);
		}
	};

	function _jsErrReport(_asMsg, _asUrl, _anLine) {
		var _oErrMsg = {
			Type: 2,
			Text: JSON.stringify({
				msg: _asMsg,
				line: _anLine,
				url: _asUrl,
				func: arguments.callee.caller
			})
		};

		WebMM.ossLog(_oErrMsg);
		if (_aoWebMM.vConsole) {
			_aoWebMM.vConsole.print(_ERROR_LEVEL, [_oErrMsg]);
		}

		return false;
	}

	_aoWin.onerror = _jsErrReport;
	_aoWin.debug = Log.d
})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	var _oPopImgContainer$ = $("#slidePic"),
		_oPopImgOperator$ = $("#popImgOperator"),
		_oPopImgCloseBtn$ = null,
		_sCurImgSrc, _oPopImg$, _oPopImgCanvas, _fZoom,
		_oOperatorTimeout;

	_oPopImgOperator$.off("click").on("click", function(_aoEvent) {
		var _oTarget = _aoEvent.target,
			_sOpt = _oTarget.getAttribute("opt");
		if (_sOpt == "zoomOut") {
			_fZoom(2, {
				offsetX: 0,
				offsetY: 0
			});

		} else if (_sOpt == "zoomIn") {
			_fZoom(-2, {
				offsetX: 0,
				offsetY: 0
			});

		} else if (_sOpt == "rotateLeft") {
			_rotate("left");

		} else if (_sOpt == "rotateRight") {
			_rotate("right");

		} else if (_sOpt == "download") {
			var _fBeforeUnload = _aoWin.onbeforeunload;
			_aoWin.onbeforeunload = null;
			if (_oTarget.getAttribute("url")) {
				location.href = _oTarget.getAttribute("url");
			}
			setTimeout(function() {
				_aoWin.onbeforeunload = _fBeforeUnload;
			});
		}
	})
		.bind({
			mouseenter: function() {
				_oPopImgOperator$.appear();
			},
			mouseleave: function() {
				_oPopImgOperator$.disappear();
			}
		});

	_oPopImgOperator$.open = function() {
		var _oSelf = this;
		_oSelf.show().css({
			opacity: 1
		});
		_oOperatorTimeout = setTimeout(function() {
			_oSelf.animate({
				opacity: 0
			});
		}, 3000);
		_oSelf.on = true;
		return _oSelf;
	}
	_oPopImgOperator$.close = function() {
		var _oSelf = this;
		clearTimeout(_oOperatorTimeout);
		_oSelf.on = false;
		_oSelf.hide();
		return _oSelf;
	}
	_oPopImgOperator$.appear = function() {
		if (!_oPopImgOperator$.on) return;
		if (_oOperatorTimeout) clearTimeout(_oOperatorTimeout);
		_oPopImgOperator$.stop(true, true).animate({
			opacity: 1
		});
	}
	_oPopImgOperator$.disappear = function() {
		if (!_oPopImgOperator$.on) return;
		if (_oOperatorTimeout) clearTimeout(_oOperatorTimeout);
		_oOperatorTimeout = setTimeout(function() {
			_oPopImgOperator$.stop(true, true).animate({
				opacity: 0
			});
		}, 1000);
	}
	_oPopImgContainer$.delegate("img", "mouseenter", _oPopImgOperator$.appear).delegate("img", "mouseleave", _oPopImgOperator$.disappear);

	/*
	 * ͼƬ��ת
	 * direction ѡ����ת���򣬹̶�ֵΪ'left'��'right';
	 */

	function _rotate(direction) {
		if (!direction) return false;
		var img = _oPopImg$[0],
			n = img.getAttribute('step');
		if (n == null) n = 0;
		if (direction == 'right') {
			(n == 3) ? n = 0 : n++;
		} else if (direction == 'left') {
			(n == 0) ? n = 3 : n--;
		}
		img.setAttribute('step', n);
		//MSIE
		if (document.all) {
			img.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + n + ')';
			//HACK FOR MSIE 8
			switch (n) {
				case 0:
					img.parentNode.style.height = img.height;
					break;
				case 1:
					img.parentNode.style.height = img.width;
					break;
				case 2:
					img.parentNode.style.height = img.height;
					break;
				case 3:
					img.parentNode.style.height = img.width;
					break;
			}
			//DOM
		} else {
			_oPopImgCanvas = document.getElementById('canvas_pop_img');
			if (_oPopImgCanvas == null) {
				_oPopImgCanvas = document.createElement('canvas');
				_oPopImgCanvas.setAttribute("id", 'canvas_pop_img');
				img.parentNode.appendChild(_oPopImgCanvas);
			}
			var ccanvasContext = _oPopImgCanvas.getContext('2d');

			img.style.visibility = 'hidden';
			img.style.position = 'absolute';
			switch (n) {
				default:
				case 0:
					_oPopImgCanvas.setAttribute('width', img.width);
					_oPopImgCanvas.setAttribute('height', img.height);
					ccanvasContext.rotate(0 * Math.PI / 180);
					ccanvasContext.drawImage(img, 0, 0);
					break;
				case 1:
					_oPopImgCanvas.setAttribute('width', img.height);
					_oPopImgCanvas.setAttribute('height', img.width);
					ccanvasContext.rotate(90 * Math.PI / 180);
					ccanvasContext.drawImage(img, 0, -img.height);
					break;
				case 2:
					_oPopImgCanvas.setAttribute('width', img.width);
					_oPopImgCanvas.setAttribute('height', img.height);
					ccanvasContext.rotate(180 * Math.PI / 180);
					ccanvasContext.drawImage(img, -img.width, -img.height);
					break;
				case 3:
					_oPopImgCanvas.setAttribute('width', img.height);
					_oPopImgCanvas.setAttribute('height', img.width);
					ccanvasContext.rotate(270 * Math.PI / 180);
					ccanvasContext.drawImage(img, -img.width, 0);
					break;
			}
			_oPopImgCanvas.style.display = "block";
		}
	}

	function _popImg(_aoThumbnail$, _aoPopImg$) {
		var _oRawPosition = _aoThumbnail$.offset(),
			_nRawWidth = _aoThumbnail$.width(),
			_nRawHeight = _aoThumbnail$.height(),

			_nScreenWidth = $(_aoWin).width(),
			_nScreenHeight = $(_aoWin).height(),
			_nInitWidth = _nScreenWidth / 1.5,
			_nInitHeight = _nScreenHeight / 1.5,
			_nPopWidth = _aoPopImg$[0].width,
			_nPopHeight = _aoPopImg$[0].height,
			_nMaxWidth = _nPopWidth * 2, //_nScreenWidth- 150,
			_nMaxHeight = _nPopHeight * 2, //_nScreenHeight - 150,
			_nImgScale = _nPopWidth / _nPopHeight,
			_nScreenScale = _nScreenWidth / _nScreenHeight;

		if (_nPopWidth > _nInitWidth || _nPopHeight > _nInitHeight) {
			if (_nImgScale >= _nScreenScale) {
				_nPopWidth = _nInitWidth;
				_nPopHeight = _nPopWidth / _nImgScale;

			} else {
				_nPopHeight = _nInitHeight;
				_nPopWidth = _nImgScale * _nPopHeight;
			}
		}
		var _nMinWidth = _nPopWidth / 2,
			_nMinHeight = _nPopHeight / 2;

		var _oNewPosition = {
			left: (_nScreenWidth - _nPopWidth) / 2,
			top: (_nScreenHeight - _nPopHeight) / 2,
			width: _nPopWidth,
			height: _nPopHeight
		};
		_aoPopImg$.width(_nRawWidth).height(_nRawHeight);

		if (_oPopImgCanvas) {
			_oPopImgCanvas.style.display = 'none';
		}
		_aoPopImg$.css("width", "100%").css("height", "100%").css("left", "0");
		var _oImgContainer$ = _aoPopImg$.parent();
		_oImgContainer$.css({
			left: _oRawPosition.left,
			top: _oRawPosition.top,
			width: _nRawWidth,
			height: _nRawHeight
		})
			.show().animate(_oNewPosition, 500, "swing", function() {
				_oPopImgOperator$.open().find('[opt="download"]').attr("url", _sCurImgSrc + "&fun=download");

				if (_oPopImgCloseBtn$ == null) {
					_oPopImgCloseBtn$ = _oImgContainer$.find(".iconClose");
				}

				_oPopImgCloseBtn$.show().off("click").on("click", function() {
					_oPopImgCloseBtn$.hide();
					_oPopImgOperator$.close();
					_oImgContainer$.hide();
					$("#mask").off("click").stop().animate({
						"opacity": 0
					}, function() {
						$("#mask").hide()
					});
				});

				var _nScaleRate = 1;
				_fZoom = function(delta, _aoEvent) {
					debug(delta);
					debug(_oImgContainer$.width());
					debug(_oImgContainer$.height());
					debug(_nMinWidth);
					debug(_nMinHeight);
					if (delta > 0 && (_oImgContainer$.width() > _nMaxWidth || _oImgContainer$.height() > _nMaxHeight)) {
						return;
					}

					if (delta < 0 && (_oImgContainer$.width() < _nMinWidth || _oImgContainer$.height() < _nMinHeight)) {
						return;
					}

					_nScaleRate += 0.2 * delta;
					if (_nScaleRate < 0.5) _nScaleRate = 0.5;
					var _nLastWidth = _oNewPosition.width;
					var _nLastHeight = _oNewPosition.height;
					_oNewPosition.width = _nPopWidth * _nScaleRate;
					_oNewPosition.height = _nPopHeight * _nScaleRate;
					_oNewPosition.left = parseInt(_oImgContainer$.css("left")) - (_oNewPosition.width - _nLastWidth) * (_aoEvent.offsetX / _nLastWidth || 0.5);
					_oNewPosition.top = parseInt(_oImgContainer$.css("top")) - (_oNewPosition.height - _nLastHeight) * (_aoEvent.offsetY / _nLastHeight || 0.5);
					_oImgContainer$.css(_oNewPosition);
				}

				_aoPopImg$.bind("mousewheel", function(event, delta, deltaX, deltaY) {
					_fZoom(Math.abs(delta) / delta, event);
				});
			});
	}

	_aoWebMM.popImage = function(_aoThumbnail$, _asPopImgSrc) {
		var _oImg = new Image();
		_oImg.onload = function() {
			_oPopImgContainer$.find("img").remove();
			_oPopImgContainer$ = _oPopImgContainer$.append(_oImg);
			_aoThumbnail$.removeWaitEffect();
			$("#mask").css("opacity", 0).show().stop().animate({
				opacity: 0.6
			}, function() {
				_popImg(_aoThumbnail$, _oPopImg$ = $(_oImg));
			}).off("click").on("click", function() {
				_oPopImgOperator$.close();
				_oPopImgContainer$.stop().hide();
				$("#mask").off("click").stop().animate({
					opacity: 0
				}, function() {
					$("#mask").hide()
				});
				_oPopImgCloseBtn$.hide();
			});
			_oPopImgContainer$.draggable({
				handle: "img"
			});
		};
		_oImg.onerror = function() {
			_aoThumbnail$.removeWaitEffect();
		};
		_aoThumbnail$.insertWaitEffect();
		_sCurImgSrc = _oImg.src = _asPopImgSrc;
	};

	var _oCache = {};
	_aoWebMM.widget = $.extend(_aoWebMM.widget || {}, {
		preLoadImg: function(_asImgSrc, _afCallback) {
			if (!_asImgSrc || _oCache[_asImgSrc]) return;

			var _oImg = new Image();
			_oImg.onload = _oImg.onerror = _oImg.onabort = function() {
				if (_oCache[this.src] && _oCache[this.src].callback) {
					$.safe(_oCache[this.src].callback);
				}
				delete _oCache[this.src];
			}
			_oImg.src = _asImgSrc;
			_oCache[_oImg.src] = {
				img: _oImg,
				callback: _afCallback
			};
		},

		replaceImg: function(_aoImg) {
			Log.d(_aoImg);
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {

	function _insert(_aoDom$, _aoInsertImg$) {
		var _nRawWidth = _aoDom$[0].clientWidth,
			_nRawHeight = _aoDom$[0].clientHeight,

			_nPopWidth = _aoInsertImg$[0].width,
			_nPopHeight = _aoInsertImg$[0].height;

		_aoInsertImg$.css({
			left: (_nRawWidth - _nPopWidth) / 2,
			top: (_nRawHeight - _nPopHeight) / 2
		});
	}

	$.fn = $.extend($.fn, {
		insertWaitEffect: function() {
			_insert(this, $($("#waitingEffect")[0].cloneNode(true)).show().appendTo(this.parent()));
			return this;
		},

		removeWaitEffect: function() {
			this.parent().find("#waitingEffect").remove();
			return this;
		}
	});

})(jQuery, WebMM, this);
(function($, _aoUndefined) {

	/**
	 * @method prototype.millTimeFormator
	 * @desc ���û�ϵͳGMT ��8�� ʱ�䣬��cgiʱ���ȶԣ�����һ����ʾ��ʱ��
	 * @param {String/Number} _avSecond cgi��������
	 * @param {String/Number} _avSysMillTime ϵͳʱ������
	 * @return {String}
	 */
	$.millTimeFormator = function(_avSecond, _avSysMillTime) {
		if (+_avSecond < 0 || +_avSysMillTime < 0) {
			return "";
		}
		var _nNow = +_avSysMillTime * 1000, //
			_nBefor = (+_avSecond) * 1000, //cgi��������
			_nUNIT_SEC = 1000,
			_nUNIT_MIN = 60,
			_nUNIT_HOUR = 60,
			_nUNIT_DAY = 24,
			_nUNIT_WEEK = 7,
			//�ٶ���û������
			_nOneDay = _nUNIT_SEC * _nUNIT_MIN * _nUNIT_HOUR * _nUNIT_DAY,
			_nDt = _nNow - _nBefor;

		function _getDateMileStone(_anTime, _anGap) {
			var _oDate = new Date(_anTime);
			_oDate.setUTCHours(15, 59, 59, 999); //����ΪGMT ��8����������һ��
			return (_nNow - (_oDate.getTime() - _anGap));
		};

		function _getYearMileStone(_anTime) {
			var _oDate = new Date(_anTime);
			_oDate.setFullYear(_oDate.getFullYear(), 0, 1);
			_oDate.setUTCHours(-8, 0, 0, 0); //����ΪGMT
			return (_nNow - _oDate.getTime());
		};

		var _oRULE = {
			// "nn��ǰ" :
			"�ո�": {
				max: _nUNIT_SEC * _nUNIT_MIN,
				unit: _nUNIT_SEC
			},
			//1Сʱ��
			"nn����ǰ": {
				max: _nUNIT_SEC * _nUNIT_MIN * _nUNIT_HOUR,
				unit: _nUNIT_SEC * _nUNIT_MIN
			},
			//6Сʱǰ��ʾСʱ
			"nnСʱǰ": {
				max: _nUNIT_SEC * _nUNIT_MIN * _nUNIT_HOUR * 6,
				unit: _nUNIT_SEC * _nUNIT_MIN * _nUNIT_HOUR
			},
			//������ʾ����
			"���� hh:mm": {
				max: _getDateMileStone(_nNow, _nOneDay), //_nUNIT_SEC * _nUNIT_MIN * _nUNIT_HOUR * _nUNIT_DAY, //����Ҫͨ��new Date()ȥ����
				unit: _nOneDay
			},
			"���� hh:mm": {
				max: _getDateMileStone(_nNow, _nOneDay * 2), //_nUNIT_SEC * _nUNIT_MIN * _nUNIT_HOUR * _nUNIT_DAY * 2,
				unit: _nOneDay
			},
			// "ǰ�� hh:mm" :
			// {
			// max :  _getDateMileStone(_nNow, _nOneDay * 3),//_nUNIT_SEC * _nUNIT_MIN * _nUNIT_HOUR * _nUNIT_DAY * 3,
			// unit: _nOneDay
			// },
			//����
			"MM��dd�� hh:mm": {
				max: _getYearMileStone(_nNow), //_nUNIT_SEC * _nUNIT_MIN * _nUNIT_HOUR * _nUNIT_DAY * 3,
				unit: _nOneDay
			},
			//"nn��ǰ hh:mm" :
			//	{
			//		max : _nOneDay * _nUNIT_WEEK,
			//		unit: _nOneDay
			//	},
			//"���� hh:mm" :
			//	{
			//		max : _nOneDay * _nUNIT_WEEK * 2,
			//		unit: _nOneDay * _nUNIT_WEEK
			//	},
			"yyyy/MM/dd hh:mm": {
				max: Infinity,
				unit: 0
			}
		};

		for (var i in _oRULE) {
			var _oRule = _oRULE[i];

			//������С����
			if (_oRule.max > _nDt) {
				var _oDate = new Date(_nBefor),
					_shh = _oDate.getHours() + "",
					_smm = _oDate.getMinutes() + "";

				_shh = _shh.length == 1 ? ("0" + _shh) : _shh;
				_smm = _smm.length == 1 ? ("0" + _smm) : _smm;

				//�����ж���ʱ�����ȣ���֪�����ڻ�Ҫ������
				if (_oRule.unit != 0) {
					return i.replace("nn", Math.floor(_nDt / _oRule.unit)) //ȡ�� ceil�� floor��
					.replace("hh", _shh).replace("mm", _smm)
						.replace("MM", _oDate.getMonth() + 1).replace("dd", _oDate.getDate());
				} else {
					return i.replace("yyyy", _oDate.getFullYear())
						.replace("MM", _oDate.getMonth() + 1).replace("dd", _oDate.getDate())
						.replace("hh", _shh).replace("mm", _smm);
				}
			}
		}
	}
}(jQuery));
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	var _oDefUICallbacks = {
		onplay: function(event) {
			Log.d("jPlayer play");
		},
		onprogress: function(event) {
			Log.d("jPlayer progress");
		},
		onpause: function(event) {
			Log.d("jPlayer pause");
		},
		onstop: function(event) {
			Log.d("jPlayer ended");
		}
	},
		_oUICallbacks = _oDefUICallbacks,
		_oAudioJPlayer$ = null,
		_oNewMsgPlayer$ = null,
		_oVideoJPlayer$ = null,
		_oVideoJPlayerContainer$ = null;


	_aoWebMM.setMediaPlayerUICallbacks = function(_aoCallbacks) {
		$.extend(_oUICallbacks, _oDefUICallbacks, _aoCallbacks);
	};

	_aoWebMM.getMediaPlayer = function() {
		return _oAudioJPlayer$;
	}

	_aoWebMM.widget.playNewMsgSound = function(_asType) {
		if (!_oNewMsgPlayer$) {
			return;
		}

		_oNewMsgPlayer$.jPlayer("setMedia", {
			mp3: _oNewMsgPlayer$.attr("url" + _asType)
		});
		_oNewMsgPlayer$.jPlayer("play");

	};

	$(function() {
		setTimeout(function() {

			if (!_oAudioJPlayer$) {
				_oAudioJPlayer$ = $("#mediaPlayer").jPlayer({
					ready: function() {
						Log.d("jPlayer ready");
					},
					play: function(event) {
						_oUICallbacks.onplay(event);
					},
					progress: function(event) {
						_oUICallbacks.onprogress(event);
					},
					pause: function(event) {
						_oUICallbacks.onpause(event);
					},
					stop: function(event) {
						_oUICallbacks.onstop(event);
					},
					ended: function(event) {
						_oUICallbacks.onstop(event);
					},
					swfPath: _aoWebMM.getRes("swf_jplayer"),
					supplied: "mp3",
					solution: "flash, html",
					wmode: "window"
				});
			}

		}, 500);

		setTimeout(function() {

			if (!_oNewMsgPlayer$) {
				_oNewMsgPlayer$ = $("#newMsgPlayer").jPlayer({
					ready: function() {},
					play: function(event) {},
					progress: function(event) {},
					pause: function(event) {},
					stop: function(event) {},
					ended: function(event) {},
					swfPath: _aoWebMM.getRes("swf_jplayer"),
					supplied: "mp3",
					solution: "flash, html",
					wmode: "window"
				});
			}

		}, 500);

		if (!_oVideoJPlayer$) {
			setTimeout(function() {

				_oVideoJPlayerContainer$ = $("#videoPlayerContainer");
				_oVideoJPlayer$ = $("#jquery_jplayer_1").jPlayer({
					ready: function() {
						Log.d("jPlayer ready");
					},
					play: function(event) {
						Log.d("jPlayer play"); /*_oUICallbacks.onplay(event);*/
					},
					progress: function(event) {
						Log.d("jPlayer progress"); /*_oUICallbacks.onprogress(event);*/
					},
					pause: function(event) {
						Log.d("jPlayer pause"); /*_oUICallbacks.onpause(event);*/
					},
					stop: function(event) {
						Log.d("jPlayer stop"); /*_oUICallbacks.onstop(event);*/
					},
					ended: function(event) {
						Log.d("jPlayer ended"); /*_oUICallbacks.onstop(event);*/
					},
					swfPath: _aoWebMM.getRes("swf_jplayer"),
					supplied: "flv, m4v",
					solution: "flash, html", //$.canPlayH264 ? "html" : "flash, html",
					//wmode: "window",
					size: {
						width: "766px",
						height: "360px",
						cssClass: "jp-video-360p"
					}
				});

				_oVideoJPlayerContainer$.bind("click", function(_aoEvent) {
					var _oTarget$ = $(_aoEvent.target);
					if (_oTarget$.hasClass("ico_close_circle")) {
						_oVideoJPlayer$.jPlayer("stop");
						_oVideoJPlayerContainer$.hide();
						$("#mask").off("click").stop().animate({
							opacity: 0
						}, function() {
							$("#mask").hide();
						});
					} else if (_oTarget$.hasClass("jp-download-screen")) {}

				}).draggable({
					handle: ".jp_header",
					cursor: "move"
				});

				_oVideoJPlayerContainer$.find(".jp-download-screen").click(function() {
					var _fBeforeUnload = _aoWin.onbeforeunload;
					_aoWin.onbeforeunload = null;
					location.href = _oCurVideoMedia.download;
					setTimeout(function() {
						_aoWin.onbeforeunload = _fBeforeUnload;
					});
				});

				_oVideoJPlayer$.jPlayer("play");

			}, 0);
		}
	});

	var _oCurVideoMedia = null;
	_aoWebMM.playVideo = function(_aoUrls) {

		$("#mask").css("opacity", 0).show().stop().animate({
			opacity: 0.6
		})
			.off("click").on("click", function() {
				_oVideoJPlayer$.jPlayer("stop");
				_oVideoJPlayerContainer$.hide();
				$("#mask").off("click").stop().animate({
					opacity: 0
				}, function() {
					$("#mask").hide();
				});
			});
		_aoWebMM.widget.screenCentral(_oVideoJPlayerContainer$.show());
		_oVideoJPlayer$.jPlayer("stop");
		_oVideoJPlayer$.jPlayer("setMedia", _oCurVideoMedia = _aoUrls);
		setTimeout(function() {
			_oVideoJPlayer$.jPlayer("play");
		}, _aoUrls.flv ? 1000 : 0);
	}

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {

	var _oQQFaceMap = null;

	_aoWebMM.widget = $.extend(_aoWebMM.widget || {}, {
		filterQQFace: function(_asStr, _abReplaceWithText) {

			_oQQFaceMap = _oQQFaceMap || _aoWin.gQQFaceMap;

			if (!_abReplaceWithText) {
				_asStr = _asStr.replace(/\[([^\]]+)\]/g, function() {
					var _sEmoji;
					if (_sEmoji = _oQQFaceMap[arguments[1]]) {
						return '<img src="' + _aoWebMM.getRes("img_path") + 'qqface/' + _sEmoji + '.png" />';
						//	return '<span class="qqemoji qqemoji'+ _sEmoji +'"></span>';
					}
					return arguments[0];
				});

			}

			var _nStart = _asStr.length - 1,
				_sSub, _sIdx;
			while (_nStart >= 0) {
				if (_asStr[_nStart] == "/") {
					for (var i = 0; i < 4; i++) {
						if (_sIdx = _oQQFaceMap[_sSub = _asStr.substr(_nStart + 1, i)]) {
							_asStr = _asStr.substring(0, _nStart) +
								(!_abReplaceWithText ? '<img src="' + _aoWebMM.getRes("img_path") + '/qqface/' + _sIdx + '.png" />' : ("[" + _sSub + "]")) + _asStr.substring(_nStart + i + 1);
							break;
						}
					}
				}

				_nStart--;
			}

			return _asStr;
		},

		preFilterEmoji: function(_asStr) {
			_asStr = _asStr.replace(/<.*?>/g, function() {
				var _sEmoji;
				if (_sEmoji = _oQQFaceMap[arguments[0]]) {
					return arguments[0].replace("<", "{").replace(">", "}");
				}
				return arguments[0];
			});

			return _asStr;
		},

		afterFilterEmoji: function(_asStr) {
			_asStr = _asStr.replace(/{.*?}/g, function() {
				var _sEmoji;
				if (_sEmoji = _oQQFaceMap[arguments[0].replace("{", "<").replace("}", ">")]) {
					return '<span class="emoji emoji' + _sEmoji + '"></span>';
				}
				return arguments[0];
			});

			return _asStr;
		},

		afterEncodeEmoji: function(_asStr) {
			_asStr = _asStr.replace(/{.*?}/g, function() {
				var _sEmoji;
				if (_sEmoji = _oQQFaceMap[arguments[0].replace("{", "<").replace("}", ">")]) {
					return _aoWin.gEmojiCodeMap[_sEmoji] || "";
				}
				return arguments[0];
			});
			// no effective
			for (var key in gEmojiCodeConv) {
				while (_asStr.indexOf(key) >= 0) {
					_asStr = _asStr.replace(key, gEmojiCodeConv[key]);
				}
			}

			return _asStr;
		},

		afterHTMLEncodeEmoji: function(_asStr) {
			_asStr = _asStr.replace(/&lt;span class=&quot;(emoji emoji.*?)&quot;&gt;&lt;\/span&gt;/g, "<span class='$1'></span>");
			return _asStr;
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {

	var
	_oMd52TuzkiMap = {
		"44682e637b75a3f5d6747d61dbd23a15": "icon_001.gif",
		"c0059fa4f781a2a500ec03fade10e9b1": "icon_002.gif",
		"86cb157e9c44b2c9934e4e430790776d": "icon_006.gif",
		"e6f269a19ff2fb61fdb847b39c86ebca": "icon_007.gif",
		"ea675fef6e28b0244c4577c6d5a2e5c9": "icon_009.gif",
		"d629cb3c544fb719405f2b9f16ed6e6c": "icon_010.gif",
		"e2e2e96798bfbd55b35c3111d89b2e17": "icon_012.gif",
		"d13e21be9fd71777f727e0c34b0d3994": "icon_013.gif",
		"68f9864ca5c0a5d823ed7184e113a4aa": "icon_018.gif",
		"1483ce786912099e29551915e0bc2125": "icon_019.gif",
		"bb82ce58f5ed6fdd2b5e34fc2a8e347a": "icon_020.gif",
		"31574013280aac3897722cc7e3e49ee4": "icon_021.gif",
		"a00d1de64298d9eaa145ec848a9cc8af": "icon_022.gif",
		"6257411b26d5aa873762490769625bb9": "icon_024.gif",
		"5a7fc462d63ef845e6d99c1523bbc91e": "icon_027.gif",
		"3a4dc10bc33c74726f46ba1eacd97391": "icon_028.gif",
		"72ebfa527add152c6872219044b151c3": "icon_029.gif",
		"6a9284bc5ce0bf059375e970a49fa2c5": "icon_030.gif",
		"2c4597ce27b24af08652be6bea644c32": "icon_033.gif",
		"6ae79b62bab61132981f1e85ad7070c4": "icon_035.gif",
		"aab84584b5a3f262286cb38bb107b53e": "icon_040.gif"
	},
		_oTuzki2Md5Map = {
			"icon_001.gif": "44682e637b75a3f5d6747d61dbd23a15",
			"icon_002.gif": "c0059fa4f781a2a500ec03fade10e9b1",
			"icon_006.gif": "86cb157e9c44b2c9934e4e430790776d",
			"icon_007.gif": "e6f269a19ff2fb61fdb847b39c86ebca",
			"icon_009.gif": "ea675fef6e28b0244c4577c6d5a2e5c9",
			"icon_010.gif": "d629cb3c544fb719405f2b9f16ed6e6c",
			"icon_012.gif": "e2e2e96798bfbd55b35c3111d89b2e17",
			"icon_013.gif": "d13e21be9fd71777f727e0c34b0d3994",
			"icon_018.gif": "68f9864ca5c0a5d823ed7184e113a4aa",
			"icon_019.gif": "1483ce786912099e29551915e0bc2125",
			"icon_020.gif": "bb82ce58f5ed6fdd2b5e34fc2a8e347a",
			"icon_021.gif": "31574013280aac3897722cc7e3e49ee4",
			"icon_022.gif": "a00d1de64298d9eaa145ec848a9cc8af",
			"icon_024.gif": "6257411b26d5aa873762490769625bb9",
			"icon_027.gif": "5a7fc462d63ef845e6d99c1523bbc91e",
			"icon_028.gif": "3a4dc10bc33c74726f46ba1eacd97391",
			"icon_029.gif": "72ebfa527add152c6872219044b151c3",
			"icon_030.gif": "6a9284bc5ce0bf059375e970a49fa2c5",
			"icon_033.gif": "2c4597ce27b24af08652be6bea644c32",
			"icon_035.gif": "6ae79b62bab61132981f1e85ad7070c4",
			"icon_040.gif": "aab84584b5a3f262286cb38bb107b53e"
		};

	_aoWebMM.widget = $.extend(_aoWebMM.widget || {}, {
		parseTuzki: function(_asStr, _abReplaceWithText) {
			var _sStr = $.htmlDecode(_asStr) || "",
				_sSegs = _sStr.split("<br/>"),
				_oJson = $.xml2json(_sSegs.length > 1 ? _sSegs[1] : _sSegs[0]),
				_sEmojiName;

			if (_oJson && _oJson.emoji.androidmd5 && (_sEmojiName = _oMd52TuzkiMap[_oJson.emoji.androidmd5])) {
				return _aoWebMM.getRes("img_path") + "/emoji/" + _sEmojiName;
			}

			return "";
		},

		getTuzkiMd5: function(_asName) {
			return _oTuzki2Md5Map[_asName];
		},

		getTuzkiPath: function(_asName) {
			return _aoWebMM.getRes("img_path") + "/emoji/" + _asName;
		},

		getTuzkiPathByMd5: function(_asMd5) {
			return this.getTuzkiPath(_oMd52TuzkiMap[_asMd5]);
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {

	var _oCurDom$ = null;

	$(window).resize(function() {
		if (_oCurDom$ && _oCurDom$.isShow()) {
			_aoWebMM.widget.screenCentral(_oCurDom$);
		}
	});

	_aoWebMM.widget.screenCentral = function(_aoDom$, _aoOptions /*{showMask:, clickMaskHide, escHide, onhide, adjustPos, rawPosDom$, offset}*/ ) {
		if (!_aoDom$ || !_aoDom$.length) {
			return;
		}

		if (!_aoOptions || _aoOptions.adjustPos !== false) {
			_oCurDom$ = _aoDom$;
		}

		if (_aoOptions && _aoOptions.rawPosDom$) {
			var _oPos = _aoOptions.rawPosDom$.offset(),
				_nOriWidth = _aoOptions.rawPosDom$.width(),
				_nOriHeight = _aoOptions.rawPosDom$.height(),
				_nDestWidth = _aoDom$.width(),
				_nDestHeight = _aoDom$.height();
			_aoDom$.css({
				"left": _oPos.left,
				"top": _oPos.top,
				"position": "absolute",
				"width": _nOriWidth,
				"height": _nOriHeight
			});
			_aoDom$.animate({
				"left": ($(document.body).width() - _nDestWidth) / 2 + (_aoOptions.offset && _aoOptions.offset.left || 0),
				"top": ($(document.body).height() - _nDestHeight) / 2 + $(_aoWin).scrollTop() + (_aoOptions.offset && _aoOptions.offset.top || 0),
				"position": "absolute",
				"width": _nDestWidth,
				"height": _nDestHeight
			});

		} else {
			_aoDom$.css({
				"left": (_aoDom$.offsetParent().innerWidth() - _aoDom$.outerWidth()) / 2 + (_aoOptions && _aoOptions.offset && _aoOptions.offset.left || 0),
				"top": ((_aoWin.innerHeight || document.documentElement.clientHeight) - _aoDom$.outerHeight()) / 2 + $(_aoWin).scrollTop(),
				"position": "absolute"
			});
		}


		if (_aoOptions && _aoOptions.showMask) {
			$("#mask").css("opacity", 0).show().stop().animate({
				"opacity": _aoOptions.lightMask ? 0 : 0.6
			}, function() {
				_aoDom$.show();
			});

			if (_aoOptions.clickMaskHide) {
				$("#mask").off("click").on("click", function() {
					_aoDom$.hide();
					$("#mask").off("click").stop().animate({
						"opacity": 0
					}, function() {
						$("#mask").hide();
					});
					_aoOptions.onhide && _aoOptions.onhide();
				});
			}
			/* 这里会内存泄漏
		if (_aoOptions.escHide) {
			$(document.body).bind("keyup", function(_aoEvent){
				if ($.isHotkey(_aoEvent, "esc") ){
					_aoDom$.hide();
					$("#mask").stop().animate({"opacity":0}, function(){$("#mask").hide()});
					_aoOptions.onhide && _aoOptions.onhide();
				}
			});
		}
		*/
		} else {
			_aoDom$.fadeIn("fast");
		}

		return _aoDom$;
	};

}(jQuery, WebMM, this));
(function($, _aoWin, _aoUndefined) {
	var _oSpecialKeys = {
		27: 'esc',
		9: 'tab',
		32: 'space',
		13: 'enter',
		8: 'backspace',
		145: 'scroll',
		20: 'capslock',
		144: 'numlock',
		19: 'pause',
		45: 'insert',
		36: 'home',
		46: 'del',
		35: 'end',
		33: 'pageup',
		34: 'pagedown',
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down',
		107: '=',
		109: '-',
		112: 'f1',
		113: 'f2',
		114: 'f3',
		115: 'f4',
		116: 'f5',
		117: 'f6',
		118: 'f7',
		119: 'f8',
		120: 'f9',
		121: 'f10',
		122: 'f11',
		123: 'f12',
		188: '<',
		190: '>',
		191: '/',
		192: '`',
		219: '[',
		220: '\\',
		221: ']',
		222: '\''
		// С���̰�ť
		/* 96: '0', 97:'1', 98: '2', 99: '3', 
					100: '4', 101: '5', 102: '6', 103: '7', 104: '8', 105: '9', 106: '*', 
					107: '+', 109: '-', 110: '.', 111 : '/' */
	},
		_oShiftKeyMap = {
			"`": "~",
			"1": "!",
			"2": "@",
			"3": "#",
			"4": "$",
			"5": "%",
			"6": "^",
			"7": "&",
			"8": "*",
			"9": "(",
			"0": ")",
			"-": "_",
			"=": "+",
			";": ":",
			"'": "\"",
			",": "<",
			".": ">",
			"/": "?",
			"\\": "|"
		};

	// �ж��Ƿ������ֻ�Ӣ����ĸ

	function _fIsChar(_anCharCode) {
		return _anCharCode >= 49 && _anCharCode <= 90;
	}

	// ��ʽ��

	function _fFormat(_asHotKey) {
		return (_asHotKey || "").toLowerCase().split("+").sort().join("").replace(/\s/ig, '');
	}

	function _fIsMouseWheelEvent(_aoEvent) {
		var _asType = _aoEvent.type;
		return _asType == "mousewheel" || _asType == "DOMMouseScroll";
	}

	function _fGetMouseWheelStr(_aoEvent) {
		if (_aoEvent.wheelDelta > 0 || _aoEvent.detail < 0) {
			return "mousewheelup";
		}
		return "mousewheeldown";
	}

	function _fGetHotKeyStr(_aoEvent) {
		var _nKeyCode = _aoEvent.keyCode,
			_sSpecial = _oSpecialKeys[_nKeyCode],
			_sChar = !_sSpecial && _fIsChar(_nKeyCode) && String.fromCharCode(_nKeyCode).toLowerCase() || _fIsMouseWheelEvent(_aoEvent) && _fGetMouseWheelStr(_aoEvent),
			_bCtrl = _aoEvent.ctrlKey,
			_bShift = _aoEvent.shiftKey,
			_bAlt = _aoEvent.altKey,
			_sShiftMapKey = _bShift && (_oShiftKeyMap[_sChar] || _oShiftKeyMap[_sSpecial]),
			_oResult = [];

		if (!_bCtrl && !_bAlt && _sShiftMapKey) {
			_sSpecial = _sShiftMapKey;
			_bShift = _sChar = null;
		}

		_bCtrl && _oResult.push("ctrl");
		_bShift && _oResult.push("shift");
		_bAlt && _oResult.push("alt");
		_sSpecial && _oResult.push(_sSpecial);
		_sChar && _oResult.push(_sChar);

		return _oResult.join("+");
	}

	function _fIsHotKey(_aoEvent, _asHotKey) {
		return (_fFormat(_fGetHotKeyStr(_aoEvent)) == _fFormat(_asHotKey));
	}

	$.isHotkey = _fIsHotKey;

})(jQuery, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	var _CAPTURE_PLUGIN_ID = "screencapture",
		_UPLOADER_PLUGIN_ID = "uploader";

	var _oCapturePlugin = null,
		_oUploader = null;

	function _getCapturePlugin() {
		return _oCapturePlugin || (_oCapturePlugin = QMActivex.create(_CAPTURE_PLUGIN_ID));
	}

	function _getUploader() {
		return _oUploader || (_oUploader = QMActivex.create(_UPLOADER_PLUGIN_ID));
	}

	function _isClipBoardImage() {
		return _getCapturePlugin() && _getCapturePlugin().IsClipBoardImage;
	};

	function _saveImg() {
		if (!_getCapturePlugin()) {
			return false;
		}

		if (!_isClipBoardImage()) {
			return false;
		}

		return _getCapturePlugin().SaveClipBoardBmpToFile(1);
	}

	function _uploadClipBoardImg(_aoPostData, _afCallback) {
		var _oUploader = _getUploader();
		_oUploader.StopUpload();
		_oUploader.ClearHeaders();
		_oUploader.ClearFormItems();

		if (_oUploader) {
			_oUploader.URL = _aoWebMM.getRes("url_host") + "/cgi-bin/mmwebwx-bin/webwxpreview?fun=upload";
			_oUploader.AddHeader("Cookie", document.cookie);
			_oUploader.AddFormItem("msgimgrequest", 0, 0, _aoPostData);
			_oUploader.AddFormItem("filename", 1, 4, _saveImg());

			_oUploader.OnEvent = function(_aObj, _aEventId, _aP1, _aP2, _aP3) {
				switch (_aEventId) {
					case 2:
						// _aP1 �ϴ���С _aP2 �ܴ�С
						break;
					case 3:
						if (_oUploader) {
							// _oUploader.ResponseCode _oUploader.Response
							//$("#actionFrame")[0].contentWindow.document.write(_oUploader.Response);
							_afCallback(JSON.parse(_oUploader.Response));
							_oUploader = null;
						}
						break;
					case 1: // error
						Log.d("screensnap upload error");
						_afCallback({});
						_oUploader = null;
						break;
				}
			};
			_oUploader.StartUpload();
		}
	}

	_aoWebMM.widget.screenSnap = {
		isSupport: function() {
			return _aoWin.QMActivex && QMActivex.isSupport(_CAPTURE_PLUGIN_ID) > 0;
		},

		install: function() {
			window.open(QMActivex.installUrl.replace(/^https/, "http"));
		},

		capture: function(_aoCallbacks) {
			var _oScreenCaptureInsatnce = _getCapturePlugin();
			if (_oScreenCaptureInsatnce) {
				_oScreenCaptureInsatnce.OnCaptureFinished = _aoCallbacks.ok;
			}
			_oScreenCaptureInsatnce.OnCaptureCanceled = function() {}
			_oScreenCaptureInsatnce.DoCapture();
		},

		isClipBoardImage: function() {
			return _isClipBoardImage();
		},

		upload: function(_aoPostData, _afCallback) {
			if (_isClipBoardImage()) {
				_uploadClipBoardImg(_aoPostData, _afCallback);
				return true;
			}
		}
	}

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {

	var _nLastSetHeight = 0;

	$.textAreaResize = function(_aoInput, _anMinHeight, _anMaxHeight, _afOnChange) {
		var _aoInput$ = $(_aoInput),
			_nMinHeight = _anMinHeight || _aoInput$.height(),
			_nMaxHeight = _anMaxHeight || _aoInput$.height();

		!_aoInput$.attr("defHeight") && _aoInput$.height("defHeight", _aoInput$.height());

		_aoInput.onkeydown = _aoInput.onkeyup = _aoInput.onchange = _aoInput.onpropertychange = null;
		if (_nMinHeight < 0 || _nMaxHeight < 0) {
			_aoInput$.height(_aoInput$.attr("defHeight"));
			return;
		}

		if (false && $.browser.msie) {
			// ��_aoInput����ʱ��������ѭ��
			_aoInput.onpropertychange = function() {
				if (_aoInput.clientHeight >= _anMinHeight) {
					_change(_aoInput.scrollHeight - 7);
				}
			};
		} else {
			var _cloneDom = _aoInput.parentNode.appendChild(_aoInput.cloneNode(true));
			with(_cloneDom.style) {
				visibility = 'hidden';
				position = 'absolute';
				left = '-1000px';
				paddingTop = "0px";
				paddingBottom = "0px";
				paddingLeft = _aoInput$.css("paddingLeft");
				paddingRight = _aoInput$.css("paddingRight");
				width = _aoInput$.width() + 'px';
				overflow = "hidden";
			}
			_aoInput.onkeydown = _aoInput.onkeyup = _aoInput.onfocus = _aoInput.onblur = _aoInput.onchange = function() {
				_cloneDom.style.width = _aoInput$.width() + 'px';
				_cloneDom.value = _aoInput.value;
				_change(_cloneDom.scrollHeight);
			}
		}

		//�����߶�

		function _change(_anCurHeight) {
			var _nRawH = _aoInput$.height();
			if (_anCurHeight > 0 && _anCurHeight != _nLastSetHeight && _nRawH != _anCurHeight) {
				_nLastSetHeight = _anCurHeight;
				_aoInput.style.height = (_anCurHeight < _nMinHeight ? _nMinHeight : (_anCurHeight > _nMaxHeight ? _nMaxHeight : _anCurHeight)) + 'px';
				_aoInput.style.overflow = _anCurHeight > _nMaxHeight ? 'auto' : 'hidden';

				_afOnChange && (_aoInput$.height() != _nRawH) && _afOnChange(_aoInput$.height() - _nRawH);
			}
		}
	}
})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	function _getVernierTop(_aoFocus$, _aoContainer$) {
		return _aoFocus$.position().top - _aoContainer$.scrollTop() + _aoFocus$.height() / 2 - 20;
	}

	_aoWebMM.widget = $.extend(_aoWebMM.widget || {}, {
		scrollFocus: function(_aoContainer$, _aoFocus$, _aoVernier$, _abAlign) {
			if (!_aoContainer$ || !_aoContainer$.size() || !_aoFocus$ || !_aoFocus$.size()) {
				return;
			}
			var _nOuterTop = _aoContainer$.scrollTop(),
				_nOuterBottom = _nOuterTop + _aoContainer$.parent().height();
			var _nInnerTop = _aoFocus$.position().top,
				_nInnerBottom = _nInnerTop + _aoFocus$.height(),
				_nOffset = 0;

			if (_nOuterTop > _nInnerTop) {
				_nOffset = _nInnerTop - 20;

			} else if (_nOuterBottom < _nInnerBottom) {
				_nOffset = _nOuterTop + _nInnerBottom - _nOuterBottom + 20;
			}

			if (_nOffset != 0 && _abAlign) {
				_aoContainer$.scrollTop(_nOffset);
				_aoVernier$.css("top", _getVernierTop(_aoFocus$, _aoContainer$));

			} else {
				_aoVernier$.stop().animate({
					top: _getVernierTop(_aoFocus$, _aoContainer$)
				}, "fast");
			}
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {

	/**
	 * flash �������ɺ���
	 * @param {String} _asId
	 * @param {String} _asFlashSrc
	 * @param {Object} _aoAttrs ���Զ��� width, height
	 * @param {Object} _aoParams �������� wmode
	 * @return {String} flash����
	 */

	function generateFlashCode(_asId, _asFlashSrc, _aoAttrs, _aoParams) {
		var _oAttrCode = [],
			_oParamCode = [],
			_oEmbedCode = [],
			_oParams = _aoParams || {},
			// ģ�嶨��
			_oAttrTmpl = ' <#=name#>=<#=value#> ',
			_oParamTmpl = '<param name="<#=name#>" value="<#=value#>" />',
			_oFlashTmpl = $.browser.msie ? ([
				'<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ',
				'<#=codebase#> ', '<#=attr#> <#=id#> >',
				'<#=param#>',
				'</object>'
			].join("")) : ([
				'<embed <#=embed#> type="application/x-shockwave-flash" ',
				'<#=pluginspage#> ', ' <#=name#> <#=id#> ></embed>'
			].join(""));

		function _genKeyValueMap(_asName, _asVal) {
			return {
				name: _asName,
				value: _asVal
			};
		}

		_oParams.allowscriptaccess = _aoAttrs && _aoAttrs.allowscriptaccess || "always";
		_oParams.quality = "high";

		for (var _name in _oParams) {
			var _oParam = _genKeyValueMap(_name, _oParams[_name]);
			_oParamCode.push($.tmpl(_oParamTmpl, _oParam));
			_oEmbedCode.push($.tmpl(_oAttrTmpl, _oParam));
		}

		for (var _name in _aoAttrs)

		{
			var _oParam = _genKeyValueMap(_name, _aoAttrs[_name]);
			_oAttrCode.push($.tmpl(_oAttrTmpl, _oParam));
			_oEmbedCode.push($.tmpl(_oAttrTmpl, _oParam));
		}

		if (_asFlashSrc) {
			_oParamCode.push($.tmpl(_oParamTmpl, _genKeyValueMap("movie", _asFlashSrc)));
			_oEmbedCode.push($.tmpl(_oAttrTmpl, _genKeyValueMap("src", _asFlashSrc)));
		}

		return $.tmpl(_oFlashTmpl, {
			id: _asId && [' id="', _asId, '"'].join(""),
			name: _asId && [' name="', _asId, '"'].join(""),
			attr: _oAttrCode.join(""),
			param: _oParamCode.join(""),
			embed: _oEmbedCode.join(""),
			codebase: location.protocol == "https:" ? '' : 'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" ',
			pluginspage: location.protocol == "https:" ? '' : 'pluginspage="http://www.adobe.com/cn/products/flashplayer" '
		});
	}

	/**
	 * ��ȡҳ����flash����
	 * @param {String} _asId
	 * @param {Object} _aoWin
	 * @return {Object}
	 */

	function getFlash(_asId, _aoWin) {
		var _oWin = _aoWin || window,
			_oDomObj = _oWin[_asId] || _oWin.document[_asId];
		return _oDomObj && (_oDomObj.length ? _oDomObj[_oDomObj.length - 1] : _oDomObj);
	}

	$.getFlash = getFlash;


	/*@param
_aConfig = {
	id	: string,
	win	: window,
	//event, use for flash object to call, for example, _mInterface.fireEvent("onxxx", ...);
	onxxx	: func,
	...
}
*/

	function qmFlash(_aConfig) {
		if (!(this._mId = _aConfig.id)) {
			throw Error(0, "config.id can't use null");
		}

		if (!(this._mWin = _aConfig.win)) {
			throw Error(0, "config.win win is null");
		}

		this._mFlash = _aConfig.flash;
		this._moConstructor = this.constructor;
		this._mEvent = _aConfig;
		this._initlize();
	}

	_goStatic = qmFlash;
	_goClass = _goStatic.prototype;

	_goStatic.get = function(_aId, _aWin) {
		var _cache = _aWin[this._CONST._CACHES];
		return _cache && _cache[_aId];
	};

	_goStatic.getFlashVer = function() {
		var _info = "";
		var _version = -1;
		var _beta = -1;
		var _build = -1;
		var _plugins = navigator.plugins;
		if (_plugins && _plugins.length) {
			// non ie
			for (var i = 0, _length = _plugins.length; i < _length; i++) {
				var _plugin = _plugins[i];
				if (_plugin.name.indexOf('Shockwave Flash') != -1) {
					_info = _plugin.description.split('Shockwave Flash ')[1];
					_version = parseFloat(_info);
					_build = parseInt(_info.split("r")[1]);
					_beta = parseInt(_info.split("b")[1]);
					break;
				}
			}
		} else {
			try {
				var _swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
				if (_swf) {
					_info = _swf.GetVariable("$version").split(" ")[1];
					var _infos = _info.split(",");
					_version = parseFloat(_infos.join("."));
					_build = parseInt(_infos[2]);
					_beta = parseInt(_infos[3]);
				}
			} catch (e) {}
		}

		return {
			version: (isNaN(_version) ? -1 : _version) || -1,
			build: (isNaN(_build) ? -1 : _build) || -1,
			beta: (isNaN(_beta) ? -1 : _beta) || -1,
			desc: _info
		};
	};

	_goStatic.isSupported = function() {
		var _ver = this.getFlashVer();
		return _ver.version >= 10 || _ver.version == 9 && _ver.build > 50;
	};

	_goStatic._CONST = {
		_TIMEOUT: 5 * 1000 /*5s*/ ,
		_CACHES: "qmFlashCaches_ASDr431gGas",
		_CALLBACK: "onFlashEvent_ASDr431gGas"
	};

	_goClass.getFlash = function() {
		return this._mFlash || getFlash(this._mId, this._mWin);
	};

	_goClass.isDisabled = function() {
		return this._mDisabled || false;
	};

	_goClass.disable = function(_aIsDisable) {
		this._mDisabled = _aIsDisable != false;
		return this;
	};

	/*@param
_aOnSetupFinishCallBack = function( _aIsOk, _aErrMsg ) {
	_aIsOk		: boolean,
	_aErrMsg	: string -- error info
							  |-- notfound : no obj
							  |-- noflash  : may be no setup flash
							  |-- timeout  : load flash time out
							  |-- nosetup  : flash no setup interface
							  |-- setuperr : flash setup return false
};
*/
	_goClass.setup = function(_aOnSetupFinishCallBack) {
		var _self = this;

		function _fCallBack(_aIsOk, _aErrMsg) {
			try {
				_aOnSetupFinishCallBack.call(_self, _aIsOk, _aErrMsg);
			} catch (e) {}
		}

		this._getLoadedPercent(function(_aValue) {
			if (_aValue == 100) {
				setTimeout(function() {
					try {
						if (!_self.getFlash().setup(qmFlash._CONST._CALLBACK, _self._mId))
							return _fCallBack(false, "setuperr");
					} catch (e) {
						return _fCallBack(false, "nosetup");
					}

					_fCallBack(true);
				});
			} else if (typeof _aValue != "number") {
				_fCallBack(false, _aValue);
			}
			//else {
			//	debug( "load flash percent:" + _aValue, "", 61882714 );
			//}
		});
	};

	// private
	/*@param
_aOnGetLoadedPercentCallBack = function( _aValue ) {
	_aValue :
	// number -- percent
	// string -- error info
				  |-- notfound : no obj
				  |-- noflash  : may be no setup flash
				  |-- timeout  : load flash time out
};
*/
	_goClass._getLoadedPercent = function(_aOnGetLoadedPercentCallBack) {
		var _self = this;

		function _fCallBack(_aValue) {
			try {
				_aOnGetLoadedPercentCallBack.call(_self, _aValue);
			} catch (e) {}
		}

		var _obj = this.getFlash();
		if (!_obj)
			return _fCallBack("notfound");

		var _oldPercent = 0;
		(function() {
			var _selfFunc = arguments.callee;
			if (!_selfFunc._startTime)
				_selfFunc._startTime = $.now();

			var _percent = 0;
			var _isError = false;
			try {
				_percent = _obj.PercentLoaded();
			} catch (e) {
				_isError = true;
			}

			if (_percent != _oldPercent)
				_fCallBack(_oldPercent = _percent);

			if (_percent != 100) {
				if ($.now() - _selfFunc._startTime > qmFlash._CONST._TIMEOUT) {
					_fCallBack(_isError ? "noflash" : "timeout");
				} else {
					setTimeout(_selfFunc, 100);
				}
			}
		})();
	};

	_goClass._initlize = function() {
		var _win = this._mWin,
			_const = this._moConstructor._CONST,
			_caches = _const._CACHES,
			_callback = _const._CALLBACK;

		if (!_win[_caches])
			_win[_caches] = new _win.Object;

		_win[_caches][this._mId] = this;

		if (!_win[_callback]) {
			_win[_callback] = function() {
				var _id = arguments[0];
				var _eventType = arguments[1];
				var _flashObj = _win[_caches][_id];

				if (_flashObj && typeof(_flashObj._mEvent[_eventType]) == "function") {
					var _args = [];
					for (var i = 2, _len = arguments.length; i < _len; i++)
						_args.push(arguments[i]);
					_flashObj._mEvent[_eventType].apply(_flashObj, _args);
				}
			};
		}
	};

	var _ID = "flashUploader",
		_oFlash = null;
	var _WRAP_HTML = [
		'<span id="swfUploaderWrapper" style="top:0;left:0;position:absolute;width:100%;height:<#=height#>px;margin:<#=margin#>;z-index:2;">', //width:<#=width#>px;
		'<#=code#>',
		'</span>'
	].join("");

	function _getWrapHtml(_aoContainer$) {
		var _oSelf = this;
		return $.tmpl(_WRAP_HTML, {
			height: _aoContainer$.height(),
			width: _aoContainer$.width(),
			margin: 0,
			code: generateFlashCode(
				_ID,
				_aoWebMM.getRes("swf_uploader") + "?r=" + $.now(), {
					width: "100%",
					height: "100%"
				}, {
					wmode: "transparent"
				})
		});
	}

	function _upload(_asId, _asUrl, _aoData) {
		_oFlash.setUploadUrl(_asUrl);
		for (var key in _aoData) {
			_oFlash.addUploadVar(key, _aoData[key]);
		}

		_oFlash.upload(_asId, "filename", false);
	}

	var _nTimeout = 0;

	function _initContainer(_aoContainer$, _aoCallbacks) {
		var _oSelf = this,
			_oCallbacks = $.extend({
				onbefore: function() {},
				onprocess: function() {},
				onsuccess: function() {},
				onerror: function() {},
				oncomplete: function() {}
			}, _aoCallbacks);

		if (!_aoContainer$ || _aoContainer$.size() == 0) {
			return;
		}

		var _sHtml = _getWrapHtml(_aoContainer$);

		//_aoContainer$.css("position", "position");
		$("#swfUploaderWrapper").remove();
		_aoContainer$.prepend(_sHtml);

		clearTimeout(_nTimeout);
		_nTimeout = 0;
		_nTimeout = setTimeout(function() {
			(new qmFlash({
				id: _ID,
				win: _aoWin,
				onSelect: function(_anStartIdx, _anEndIdx) {
					for (var i = _anStartIdx; i <= _anEndIdx; i++) {
						_oCallbacks.onselect(i, {
							name: _oFlash.getFileInfo(i, "name"),
							size: parseInt(_oFlash.getFileInfo(i, "size"), 10)
						});
					}
				},
				onProcess: function(_anFileIdx, _anPercent) {
					_oCallbacks.onprocess(_anFileIdx, _anPercent);
					if (_anPercent = 100) {
						_oCallbacks.onsuccess();
					}
				},
				onError: function(_anFileIdx, _asErrType, _asErrMsg, _anPercent) {
					_oCallbacks.onerror(_asErrType, _asErrMsg, _anPercent);
				},
				onComplete: function(_anFileIdx, _aoData) {
					_oCallbacks.oncomplete(_anFileIdx, _aoData);
				}
			})).setup(function(_aIsOk, _asErrorMsg) {
				if (_aIsOk) {
					// the flash is ready
					_oFlash = this.getFlash();

					//set flash upload config
					_oFlash.initlize("single");
					_oFlash.clearUploadVars();
					_oFlash.addUploadVar("timeout", 60000);
				} else {
					Log.d("the flash uploader is not ok..." + _asErrorMsg);
				}
			});

		}, 300);
	}

	_aoWebMM.widget = $.extend(_aoWebMM.widget || {}, {
		swfUploader: {
			isSupport: function() {
				return qmFlash.isSupported();
			},

			install: function(_aoContainer$, _aoCallbacks) {
				_initContainer(_aoContainer$, _aoCallbacks);
			},

			upload: function(_anId, _asUrl, _aoData) {
				_upload(_anId, _asUrl, _aoData);
			}
		}
	});


})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	//http://www.chromium.org/developers/design-documents/desktop-notifications/api-specification		

	var _oDefCallback = {
		ondisplay: function() {},
		onerror: function() {},
		onclose: function() {},
		onclick: function() {}
	};

	// Permission values
	var PERMISSION_ALLOWED = 0;
	var PERMISSION_NOT_ALLOWED = 1;
	var PERMISSION_DENIED = 2;

	var _oNotifyIns = null;
	var _nDisplayTime = 10 * 1000,
		_nTimer = 0;

	_aoWin.MMNotification = _aoWebMM.widget.notification = {
		notify: function(_asIcon, _asTitle, _asBody, _aoCallback) {
			if (!this.isSupport()) {
				return;
			}
			var _oCallback = $.extend(_oDefCallback, _aoCallback),
				_fRawClick = _oCallback.onclick,
				_fRawClose = _oCallback.onclose,
				_oNotification = window.webkitNotifications;

			_oCallback.onclick = function() {
				if (!_oNotifyIns) {
					return;
				}
				_fRawClick.apply(this, arguments);
				_oNotifyIns.cancel();
				_oNotifyIns = null;
			};

			if (_oNotification.checkPermission() == PERMISSION_ALLOWED) {
				if (_oNotifyIns) {
					_oNotifyIns.cancel();
					_oNotifyIns = null;
				}
				_oNotifyIns = _oNotification.createNotification(_asIcon, _asTitle, _asBody);
				$.extend(_oNotifyIns, _oCallback);
				setTimeout(function() {
					if (_oNotifyIns) {
						_oNotifyIns.show();
						clearTimeout(_nTimer);
						setTimeout(function() {
							if (_oNotifyIns) {
								_oNotifyIns.cancel();
								_oNotifyIns = null;
							}
						}, _nDisplayTime);
					}
				});

			} else if (_oNotification.checkPermission() == PERMISSION_NOT_ALLOWED) {

			} else {

			}
		},

		cancel: function() {
			if (_oNotifyIns) {
				_oNotifyIns.cancel();
				_oNotifyIns = null;
			}
		},

		requestPermission: function() {
			if (!this.isSupport()) {
				return;
			}

			var _oNotification = window.webkitNotifications;
			if (_oNotification.checkPermission() == PERMISSION_NOT_ALLOWED) {
				_oNotification.requestPermission(function() {});
			}
		},

		checkPermission: function() {
			if (this.isSupport()) {
				return _aoWin.webkitNotifications.checkPermission();
			}
			return PERMISSION_DENIED;
		},

		isSupport: function() {
			return !!_aoWin.webkitNotifications;
		}
	}
}(jQuery, WebMM, this));
(function($, _aoWebMM, _aoWin, _aoUndefined) {

	var _WrapID = "VoiceRecorderWrapper",
		_ID = "VoiceRecorder",
		_oFlash = null;
	var _WRAP_HTML = [
		'<div id="<#=WrapID#>" style="top:0px;left:-1000px;position:absolute;width:300px;height:200px;z-index:9999;">',
		'<#=code#>',
		'</div>'
	].join("");

	function _getWrapHtml() {
		var _oSelf = this;
		return $.tmpl(_WRAP_HTML, {
			WrapID: _WrapID,
			code: $.generateFlashCode(
				_ID,
				_aoWebMM.getRes("swf_recorder"), {
					width: "100%",
					height: "100%"
				}, {
					wmode: "transparent"
				})
		});
	}

	var _nTimeout = 0;

	function _initContainer(_aoCallbacks) {
		var _oSelf = this,
			_oCallbacks = $.extend({
				onReady: function() {},
				onRecordStart: function() {},
				onRecordError: function() {},
				onRecordStop: function() {},
				onRecordFinish: function() {},
				onSendError: function() {},
				onSendProgress: function() {},
				onSendFinish: function() {},
				onActivityTime: function() {},
				onSecurityPanelClose: function() {}
			}, _aoCallbacks);

		var _sHtml = _getWrapHtml();

		$("#" + _WrapID).remove();
		$(document.body).append(_sHtml);

		clearTimeout(_nTimeout);
		_nTimeout = setTimeout(function() {
			(new $.qmFlash($.extend(_oCallbacks, {
				id: _ID,
				win: _aoWin
			}))).setup(function(_aIsOk, _asErrorMsg) {
				if (_aIsOk) {
					// the flash is ready
					_oFlash = this.getFlash();
					_oCallbacks.onReady();
				} else {
					Log.d("the flash recorder is not ok..." + _asErrorMsg);
				}
			});

		}, 300);
	}

	var _bInstalled = false;
	_aoWebMM.widget = $.extend(_aoWebMM.widget || {}, {
		Recorder: {

			isSupport: function() {
				return $.qmFlash.isSupported();
			},

			install: function(_aoCallbacks) {
				if (!_bInstalled) {
					_initContainer(_aoCallbacks);
					_bInstalled = true;
				} else {
					_aoCallbacks.onReady();
				}
			},
			/**
	recorder 暴露的接口：
	_mInterface.addMethod("jIsMicroPhoneAvailable", jIsMicroPhoneAvailable);
	_mInterface.addMethod("jShowSecuritySetting", jShowSecuritySetting);
	_mInterface.addMethod("jStartRecording", jStartRecording);
	_mInterface.addMethod("jStopRecording", jStopRecording);
	_mInterface.addMethod("jSendDataToServer", jSendDataToServer);
	_mInterface.addMethod("jGetSoundLevel", jGetSoundLevel);
	_mInterface.addMethod("jPreviewRecord", jPreviewRecord);
	_mInterface.addMethod("jStopPreviewRecord", jStopPreviewRecord);
	**/
			getObject: function() {
				return _oFlash;
			}
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	var _oUploadPreview$ = $("#uploadPreview");

	_aoWin.uploadPreview = {
		show: function() {
			_oUploadPreview$.find("img").replaceWith($("<img/>").attr("src", _aoWebMM.getRes("img_loading1")));
			_aoWebMM.widget.screenCentral(_oUploadPreview$.show());

			return this;
		},
		hide: function() {
			_oUploadPreview$.hide();
			$("#mask").hide();

			return this;
		},
		getDom$: function() {
			return _oUploadPreview$;
		},
		setImg: function(_asUrl) {
			var _oImg = new Image();
			_oImg.onload = function() {
				var _oWrap$ = _oUploadPreview$.find(".picPreviewWrap"),
					_oInsertImg$ = _oWrap$.find("img"),
					_nWrapWidth = _oWrap$.width(),
					_nWrapHeight = _oWrap$.height(),
					_nRawWidth = this.width,
					_nRawHeight = this.height;

				if (_nRawWidth > _nWrapWidth || _nRawHeight > _nWrapHeight) {
					if (_nRawWidth / _nRawHeight > _nWrapWidth / _nWrapHeight) {
						_oImg.style.width = _nWrapWidth + "px";
						_oImg.style.height = (_nWrapWidth * _nRawHeight / _nRawWidth) + "px";
					} else {
						_oImg.style.height = _nWrapHeight + "px";
						_oImg.style.width = (_nRawWidth * _nWrapHeight / _nRawHeight) + "px";
					}
				}

				_oInsertImg$.replaceWith(_oImg);
			}
			_oImg.src = _asUrl;

			return this;
		},
		setCallback: function(_afCallback) {
			var _oSelf = this;
			_oUploadPreview$.off("click").on("click", function(_aoEvent) {
				var _sOpt = $(_aoEvent.target).attr("opt");
				if (_sOpt == "cancel") {
					_oSelf.hide();
					if (_afCallback.cancel) _afCallback.cancel();
				} else if (_sOpt == "send" && _afCallback.send) {
					_oSelf.hide();
					_afCallback.send();
				}
			});

			return this;
		}
	};
})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	var _oWebMM = _aoWin.WebMM = _aoWin.WebMM || {},
		_oResMap = {};

	_oWebMM.getRes = function(_asRawPath) {
		return _oResMap[_asRawPath];
	}

	/* build deviceId  */
	var _sDeviceId = null;
	_oWebMM.getDeviceId = function() {
		if (!_sDeviceId) {
			_sDeviceId = "e";
			for (var i = 0; i < 15; i++) {
				_sDeviceId += Math.floor(Math.random() * 10);
			}
		}

		return _sDeviceId;
	}

	_aoWebMM.timeoutDetect = function(_anRetCode) {
		/*MMWEBWX_OK = 0 ,
		 MMWEBWX_ERR_SYS = -1 ,
		 MMWEBWX_ERR_LOGIC = -2 ,
		 MMWEBWX_ERR_SESSION_NOEXIST = 1100, 
		 MMWEBWX_ERR_SESSION_INVALID = 1101, 
		 MMWEBWX_ERR_PARSER_REQUEST = 1200, 
		 MMWEBWX_ERR_FREQ = 1205 // 频率拦截
		 */
		if (_anRetCode == "1100") {
			_aoWin.onbeforeunload = null;
			_aoWebMM.util.logout(0);

			return true;

		} else if ( /*_anRetCode == "1200" || */ _anRetCode == "1101" || _anRetCode == "1205" || _anRetCode == "1102") {
			_aoWin.onbeforeunload = null;
			_aoWebMM.util.logout(1);

			return true;
		}
		return false;
	}

	$.netQueueSetting({
		globalExceptionHandler: function(_anRetCode) {
			return _aoWebMM.timeoutDetect(_anRetCode);
		}
	});

	/* detect user isnot silent */
	var _bActive = true,
		_nActionTimer = 0;
	_aoWebMM.touchUserAction = function() {
		if (!_bActive) {
			_aoWebMM.triggerEvent("hasUserAction", _bActive = true);
		}

		_nActionTimer = $.now();
	}
	setInterval(function() {
		if ($.now() - _nActionTimer > 30 * 1000) {
			_aoWebMM.triggerEvent("hasUserAction", _bActive = false);
		}
	}, 30 * 1000);
	_aoWebMM.touchUserAction();

	// bind event

	function _fStart(_asDefCtrl) {
		var _oBody$ = $(document.body);
		var _oRootCtrl = _oWebMM.ctrl("root", {
			oDom$: _oBody$
		}),
			_sDefCtrl = _asDefCtrl || "chat";

		// init 
		_oRootCtrl.dispatch("hashchange", "root/" + ($.hash() || _sDefCtrl));
		$.hashChange(function(_asHash) {
			_asHash = _asHash || _sDefCtrl;
			_oRootCtrl.dispatch("hashchange", "root/" + _asHash);
		});

		var _oGlobalEventSetting = { /*globalIntercept, interceptDom$*/ };
		_aoWebMM.globalEventSetting = function(_aoOptions) {
			return $.extend(_oGlobalEventSetting, _aoOptions || {});
		}

		function _trace(target, attr) {
			var _result = [];
			while (target && target != document.body) {
				if (target.getAttribute(attr)) {
					_result.push(target);
				}
				target = target.parentNode;
			}

			return _result;
		}

		_oBody$.bind("click keyup keydown change", function(e) {
			var _bBeHandled = false,
				_bPrevent = false,
				_oTargets = _trace(e.target, e.type);

			outloop: for (var i = 0, len = _oTargets.length; i < len; i++) {
				var _oTarget$ = $(_oTargets[i]);

				if (_oGlobalEventSetting.globalIntercept && !$.contains(_oGlobalEventSetting.interceptDom$[0], _oTarget$[0])) {
					continue;
				}

				var _oCtrlDoms$ = _oTarget$.parents("[ctrl]"),
					_sEventName = _oTarget$.attr(e.type),
					_oNames = _sEventName && _sEventName.split("@"),
					_sHandler = _oNames && _oNames[0],
					_sContext = _oNames && _oNames[1];

				for (var j = 0, size = _oCtrlDoms$.length; _sEventName && j < size; j++) {
					var _oCurCtrl = _oCtrlDoms$[j]["ctrl"];

					if (_oCurCtrl[_sHandler]) {
						var _ret = _oCurCtrl[_sHandler](e, _oTarget$, _sContext && _oTarget$.parents(_sContext).first());
						_bBeHandled = true;
						if (_ret === false) {
							break outloop;
						}
					}
				}

				if (_oTarget$.prop("tagName") == "A" && _oTarget$.prop("href") == "javascript:;") {
					_bPrevent = true;
				}
			}

			if (!_bBeHandled) {
				var _gsType = (e.type == "click" && "noHandledClick" || e.type == "keydown" && "noHandledKeyDown" || e.type == "keyup" && "noHandledKeyUp");
				if (_gsType) {
					_oRootCtrl.dispatch("globalevent", {
						type: _gsType,
						data: e
					});
				}
			}

			if (_bPrevent || e.target.tagName == "A" && e.target.href == "javascript:;" ||
				e.target.parentNode.tagName == "A" && e.target.parentNode.href == "javascript:;") {
				e.stopPropagation();
				e.preventDefault();

			} else if (e.target.tagName == "A" && e.target.href.indexOf("http") == 0 && e.target.target == "") {
				window.open(e.target.href);
				e.stopPropagation();
				e.preventDefault();
			}

			_aoWebMM.touchUserAction();

		}).bind("globalevent", function(e, data) {
			_oRootCtrl.dispatch("globalevent", data);
		});
	}

	if (_aoWin.GlobalConfig && _aoWin.GlobalConfig.gRes) {
		_oResMap = GlobalConfig.gRes;
		_aoWin.Log.level(GlobalConfig.gLog);
		_aoWin.GlobalRes = null;
	}

	var _bViewReady = false,
		_bJsReady;
	_aoWin.ready = function(_asType) {
		if (_asType == "view" || _aoWin.viewReady) {
			_bViewReady = true;
		}
		if (_asType == "js") {
			_bJsReady = true;
		}

		if (_bViewReady && _bJsReady) {
			$.getTmplStr = function(_asStr) {
				return document.getElementById("viewFrame").contentWindow.document.getElementById(_asStr).innerHTML;
			}
			_fStart();
		}
	}

	var QA = {
		check: function() {
			if (!$.qmFlash.isSupported()) {
				Log.d("Not Support Flash. Navigator: " + _aoWin.Navigator);
			}
		}
	}

	// main 
	$(function() {
		ready("js");
		QA.check();
	});

	_aoWebMM.ErrOk = 0;
	_aoWebMM.ErrSessionTimeOut = 1;
	_aoWebMM.ErrNet = 2;
	_aoWebMM.ErrFail = 3;

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	var _sRoomContactPostFix = "@chatroom",
		_sTalkContactPostFix = "@talkroom";

	var _oSpUsers = [ //not to insert in first
		"weibo",
		"qqmail",
		"fmessage",
		"tmessage",
		"qmessage",
		"qqsync",
		"floatbottle",
		"lbsapp",
		"shakeapp",
		"medianote",
		"qqfriend",

		// ��Ѷ�����µ�username
		"readerapp",
		//"newsapp",
		"blogapp",
		"facebookapp",
		"masssendapp",
		"meishiapp",
		"feedsapp",
		"voip",
		"blogappweixin",
		"weixin",
		"brandsessionholder",
		"weixinreminder",
		"wxid_novlwrv3lqwv11",
		"gh_22b87fa7cb3c",
		"officialaccounts"
	];

	var _aShieldUser = [ //not to show them
		"wxid_novlwrv3lqwv11", //old voice reminder
		"gh_22b87fa7cb3c" //new voice reminder
	];

	var _nServerTime, _nLocalTime;

	_aoWebMM.util = $.extend(_aoWebMM.util || {}, {
		isSpUser: function(_asUserName) {
			for (var i = 0, len = _oSpUsers.length; i < len; i++) {
				if (_oSpUsers[i] === _asUserName || _asUserName.endsWith("@qqim")) {
					return true;
				}
			}

			return false;
		},

		isShieldUser: function(_asUserName) {
			if (/@lbsroom/.test(_asUserName)) return true;
			// if(_aoWebMM.model("account").isHigherVer()){
			// 	var _oContact = _aoWebMM.model("contact").getContact(_asUserName);
			// 	if(_oContact && _oContact.isBrandContact()) return true;
			// }
			for (var i = 0, len = _aShieldUser.length; i < len; ++i) {
				if (_aShieldUser[i] == _asUserName) return true;
			}
			return false;
		},

		isFileHelper: function(_asUserName) {
			return _asUserName == _aoWebMM.Constants.SP_CONTACT_FILE_HELPER;
		},

		isRoomContact: function(_asUserName) {
			if (!_asUserName)
				return false;

			var _nIndex = _asUserName.lastIndexOf(_sRoomContactPostFix);
			if (_nIndex < 0)
				return false;

			return _nIndex == _asUserName.length - _sRoomContactPostFix.length;
		},

		isTalkContact: function(_asUserName) {
			if (!_asUserName)
				return false;

			var _nIndex = _asUserName.lastIndexOf(_sTalkContactPostFix);
			if (_nIndex < 0)
				return false;

			return _nIndex == _asUserName.length - _sRoomContactPostFix.length;
		},

		getMsgPeerUserName: function(_aoMessage) {
			return _aoMessage.isSend ? _aoMessage.ToUserName : _aoMessage.FromUserName;
		},

		getMediaTypeCode: function() {},

		getContactDisplayName: function(_aoContact) {
			if ($.type(_aoContact) === "string") {
				_aoContact = _aoWebMM.model("contact").getContact(_aoContact);

				if (_aoContact == null) {
					return _aoContact;
				}
			}

			var _sName = "";
			if (!_aoContact || !_aoContact.UserName)
				return _sName;

			if (_aoWebMM.util.isRoomContact(_aoContact.UserName)) {
				_sName = _aoContact.RemarkName || _aoContact.NickName;
				if (!_sName && _aoContact.MemberList) {
					for (var i = 0, len = _aoContact.MemberList.length; i < len && i < 10; ++i) {
						if (_sName.length > 0)
							_sName += ", ";
						var _oRoomMem = _aoContact.MemberList[i],
							_oRoomCon = _aoWebMM.model("contact").getContact(_oRoomMem.UserName);
						_sName += (_oRoomCon && _oRoomCon.RemarkName) || _oRoomMem.DisplayName || (_oRoomCon && _oRoomCon.NickName) || _oRoomMem.NickName || _oRoomMem.UserName;
					}
				} else if (!_sName) {
					_sName = _aoContact.UserName;
				}
			} else {
				_sName = _aoContact.RemarkName || _aoContact.NickName || _aoContact.UserName;
			}

			_aoContact.orderC = $.clearHtmlStr(_aoContact.RemarkPYQuanPin || _aoContact.PYQuanPin || _aoContact.NickName || _aoContact.UserName || "").toLocaleUpperCase().replace(/\W/ig, "");

			if (_aoContact.orderC.charAt(0) < 'A') {
				_aoContact.orderC = "~";
			}

			return _sName;
		},

		getMemberDisplayName: function(_aoContact, _aoGroupContact) { //_oContact为要查找成员，GroupContact为群组
			if ($.type(_aoContact) === "string") {
				_aoContact = _aoWebMM.model("contact").getContact(_aoContact);
			}
			if ($.type(_aoGroupContact) === "string") {
				_aoGroupContact = _aoWebMM.model("contact").getContact(_aoGroupContact);
			}

			if (_aoContact == null || _aoGroupContact == null) {
				return "";
			}

			if (_aoContact.RemarkName) return _aoContact.RemarkName;

			var _sUserName = _aoContact.UserName;
			for (var i = 0, len = _aoGroupContact.MemberList.length; i < len; ++i) {
				var _oRoomMem = _aoGroupContact.MemberList[i];
				if (_oRoomMem.UserName == _sUserName) {
					if (_oRoomMem.DisplayName) return _oRoomMem.DisplayName;
					else break;
				}
			}
			return _aoContact.DisplayName || _aoContact.NickName || _sUserName;
		},


		isImgMsg: function(_anMessageType) {
			return _anMessageType == _aoWebMM.Constants.MM_DATA_IMG || _anMessageType == _aoWebMM.Constants.MM_DATA_PRIVATEMSG_IMG || _anMessageType == _aoWebMM.Constants.MM_DATA_QQLIXIANMSG_IMG;
		},

		isTextMsg: function(_anMessageType) {
			switch (_anMessageType) {
				case _aoWebMM.Constants.MM_DATA_TEXT:
				case _aoWebMM.Constants.MM_DATA_PRIVATEMSG_TEXT:
				case _aoWebMM.Constants.MM_DATA_QMSG:
					return true;
				default:
					return false;
			}
		},

		isVoiceMsg: function(_anMessageType) {
			return _anMessageType == _aoWebMM.Constants.MM_DATA_VOICEMSG;
		},

		isVideoMsg: function(_anMessageType) {
			return _anMessageType == _aoWebMM.Constants.MM_DATA_VIDEO || _anMessageType == _aoWebMM.Constants.MM_DATA_VIDEO_IPHONE_EXPORT;
		},

		isSysMsg: function(_anMessageType) {
			return _anMessageType == _aoWebMM.Constants.MM_DATA_SYS;
		},

		isEmojiMsg: function(_anMessageType) {
			return _anMessageType == _aoWebMM.Constants.MM_DATA_EMOJI;
		},

		isQqMailMsg: function(_anMessageType) {
			return _anMessageType == _aoWebMM.Constants.MM_DATA_APPMSG;
		},

		isQqMsg: function(_anMessageType) {
			return _anMessageType == _aoWebMM.Constants.MM_DATA_QMSG;
		},

		isPushSystmeMsg: function(_anMessageType) {
			return _anMessageType == _aoWebMM.Constants.MM_DATA_PUSHSYSTEMMSG;
		},

		isRecommendAssistant: function(_anMessageType) {
			return _anMessageType == _aoWebMM.Constants.MM_DATA_POSSIBLEFRIEND_MSG || _anMessageType == _aoWebMM.Constants.MM_DATA_VERIFYMSG;
		},

		isAppMsg: function(_anMessageType) {
			return _anMessageType == _aoWebMM.Constants.MM_DATA_APPMSG;
		},

		genMessageDigest: function(_aoMessage) {
			var _oSelf = this;
			var _sDigest = "";
			_nMsgType = _aoMessage.MsgType;
			if (_nMsgType == -9999) {
				_sDigest = "";
			} else {
				if (_oSelf.isTextMsg(_nMsgType) || _nMsgType == _aoWebMM.Constants.MM_DATA_READER_TYPE) {
					_sDigest = _aoMessage.digest;
				} else if (_oSelf.isImgMsg(_nMsgType)) {
					_sDigest = _aoWebMM.getRes("text_image_msg");
				} else if (_oSelf.isVoiceMsg(_nMsgType)) {
					_sDigest = _aoWebMM.getRes("text_voice_msg");
				} else if (_oSelf.isVideoMsg(_nMsgType)) {
					_sDigest = _aoWebMM.getRes("text_video_msg");
				} else if (_oSelf.isEmojiMsg(_nMsgType)) {
					_sDigest = _aoWebMM.getRes("text_emoji_msg");
				} else if (_nMsgType == _aoWebMM.Constants.MM_DATA_APP_MSG_EMOJI_TYPE) {
					_sDigest = _aoWebMM.getRes("text_emoji_msg");
				} else if (_oSelf.isAppMsg(_nMsgType) || _nMsgType >= _aoWebMM.Constants.MM_DATA_APP_MSG_IMG_TYPE) {
					if (_aoMessage.Url)
						_sDigest = _aoWebMM.getRes("text_url_msg");
					else
						_sDigest = _aoWebMM.getRes("text_app_msg");
				} else {
					_sDigest = _aoMessage.digest;
				}

				var _sDigestPrefix = "";
				if (_oSelf.isRoomContact(_aoMessage.FromUserName)) {
					var _oActualContact = _aoWebMM.model("contact").getContact(_aoMessage.actualSender);
					if (_oActualContact) {
						_sDigestPrefix = _aoWebMM.util.getMemberDisplayName(_oActualContact, _aoMessage.FromUserName);
						_sDigestPrefix += _sDigestPrefix && ": " || "";
					}
				}

				_sDigest = _sDigest && (_sDigestPrefix + _sDigest) || "";
			}

			return _sDigest.replace(/<br\/?>/ig, " ");
		},

		isBrandContact: function(_anVerifyFlag) {
			return _anVerifyFlag & _aoWebMM.Constants.MM_USERATTRVERIFYFALG_BIZ_BRAND;
		},

		getRoomMsgActualSender: function(_aoMessage) {
			var _nIndex = _aoMessage.Content.indexOf(":");
			if (_nIndex < 0) {
				return "";
			}

			return _aoMessage.Content.substr(0, _nIndex);
		},

		isSelf: function(_asUserName) {
			return _aoWebMM.model("account").getUserName() == _asUserName;
		},

		modifyNickName: function(_aoObj) {
			if (!_aoObj) {
				return;
			}

			switch (_aoObj.UserName) {
				case "weixin":
					_aoObj.NickName = _aoWebMM.getRes("text_weixin_nickname");
					break;
				case "filehelper":
					_aoObj.NickName = _aoWebMM.getRes("text_filehelper_nickname");
					break;
				case "newsapp":
					_aoObj.NickName = _aoWebMM.getRes("text_newsapp_nickname");
					break;
				case "fmessage":
					_aoObj.NickName = _aoWebMM.getRes("text_fmessage_nickname");
					break;
				case "gh_8f619b5732ed":
					_aoObj.NickName = _aoWebMM.getRes("tencent_2012_2_sessions");
					break;
			}
		},
		isContact: function(_asUserName) {
			var _oContact = _aoWebMM.model("contact").getContact(_asUserName);
			return _oContact && _oContact.isContact && _oContact.isContact();
		},

		setServerTime: function(_anServerTime) {
			_nServerTime = _anServerTime * 1000;
			_nLocalTime = $.now();
		},
		getServerTime: function() {
			var time = _nServerTime + ($.now() - _nLocalTime);
			if (time < 0) {
				return $.now();
			} else {
				return time;
			}
		}
	});
})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	//TODO: need deep copy
	var _oUserInfo = {
		hasPhotoAlbum: function() {
			return this.SnsFlag & 1;
		}
	},
		_oHistoryConversation = [],
		_oSyncKey = null,
		_oSid = null,
		_sSkey = "",
		_sClientVerInfo = {
			type: "",
			ver: ""
		};

	_aoWebMM.model("account", {
		getSyncKey: function() {
			return _oSyncKey || {};
		},

		setSyncKey: function(_aoSyncKey) {
			if (_aoSyncKey) {
				_oSyncKey = _aoSyncKey;
			} else {
				Log.e("JS Function: setSyncKey. Error. no synckey");
			}
		},

		getSid: function() {
			return _oSid || (_oSid = $.getCookie("wxsid"));
		},

		setSid: function(_aoSid) {
			if (_aoSid) {
				_oSid = _aoSid;
			}
		},

		getSkey: function() {
			return _sSkey;
		},

		setSkey: function(_asSkey) {
			if (_asSkey) {
				_sSkey = _asSkey;
			}
		},

		setUserInfo: function(_aoUserInfo) {
			if (_aoUserInfo) {
				$.extend(_oUserInfo, _aoUserInfo);
				_oUserInfo.isMute = this.isMute();
				_oUserInfo.isNotifyOpen = this.isNotifyOpen();
				_aoWebMM.triggerEvent("accountUpdated", _oUserInfo);

			} else {
				Log.e("JS Function: setUserInfo. Error. no accout");
			}
		},

		getUserInfo: function() {
			return _oUserInfo && _oUserInfo.UserName && _oUserInfo || null;
		},

		getUin: function() {
			return this.getUserInfo() && this.getUserInfo().Uin || $.getCookie("wxuin");
		},

		getUserName: function() {
			return this.getUserInfo() && this.getUserInfo().UserName;
		},

		getBaseRequest: function() {
			return {
				"BaseRequest": {
					Uin: this.getUin(),
					Sid: this.getSid(),
					Skey: this.getSkey(),
					DeviceID: _aoWebMM.getDeviceId()
				}
			};
		},

		reset: function() {},

		setHistoryConversation: function(_asStr) {
			_oHistoryConversation = _oHistoryConversation.concat(_asStr.split(",")) || [];
			_aoWebMM.addEventListener("messageAdded", function(_aoMessage) {
				var _sUserName = _aoMessage.UserName;
				for (var i = 0, len = _oHistoryConversation.length; i < len; i++) {
					if (_oHistoryConversation[i] == _sUserName) {
						_oHistoryConversation.splice(i, 1);
					}
				}
			});
		},

		getHistoryConversation: function(_asStr) {
			return _oHistoryConversation;
		},

		isMute: function() {
			return this.getUserInfo().WebWxPluginSwitch & _aoWebMM.Constants.MM_WEBWXFUNCTION_TONE_NOT_OPEN;
		},

		isGroupMute: function() {
			return false;
			//return this.getUserInfo().WebWxPluginSwitch & _aoWebMM.Constants.MM_WEBWXFUNCTION_TONE_NOT_OPEN;
		},

		setMute: function(_abMute) {
			if (_abMute) {
				_oUserInfo.WebWxPluginSwitch |= _aoWebMM.Constants.MM_WEBWXFUNCTION_TONE_NOT_OPEN;
			} else {
				_oUserInfo.WebWxPluginSwitch &= ~_aoWebMM.Constants.MM_WEBWXFUNCTION_TONE_NOT_OPEN;
			}
			_oUserInfo.isMute = this.isMute();
			//_aoWebMM.triggerEvent("accountUpdated", _oUserInfo);

			return this;
		},

		isNotifyOpen: function() {
			return this.getUserInfo().WebWxPluginSwitch & _aoWebMM.Constants.MM_WEBWXFUNCTION_NOTIFY_OPEN;
		},

		setNotifyOpen: function(_abOpen) {
			if (_abOpen) {
				_oUserInfo.WebWxPluginSwitch |= _aoWebMM.Constants.MM_WEBWXFUNCTION_NOTIFY_OPEN;
			} else {
				_oUserInfo.WebWxPluginSwitch &= ~_aoWebMM.Constants.MM_WEBWXFUNCTION_NOTIFY_OPEN;
			}
			_oUserInfo.isNotifyOpen = this.isNotifyOpen();
			//_aoWebMM.triggerEvent("accountUpdated", _oUserInfo);

			return this;
		},

		isHigherVer: function() {
			return _sClientVerInfo.ver >= 4.5;
		},

		setClientVer: function(_asVer) {
			var _sVer = parseInt(_asVer, 10).toString(16),
				_sType = _sVer.substr(0, 1),
				_sVer = _sVer.substr(1, 3).replace("0", ".");
			_sClientVerInfo.type = _sType;
			_sClientVerInfo.ver = _sVer;
		}
	});

	_aoWebMM.model("account").reset();

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	var _nCount = 0;
	_oContacts = {},
	_oReverseMap = {};

	var _oContactOperates = {
		isSelf: function() {
			return _aoWebMM.model("account").getUserName() == this.UserName;
		},

		isContact: function() {
			return !!(this.ContactFlag & _aoWebMM.Constants.MM_CONTACTFLAG_CONTACT);
		},

		isBlackContact: function() {
			return !!(this.ContactFlag & _aoWebMM.Constants.MM_CONTACTFLAG_BLACKLISTCONTACT);
		},

		isConversationContact: function() {
			return !!(this.ContactFlag & _aoWebMM.Constants.MM_CONTACTFLAG_CHATCONTACT);
		},

		isRoomContact: function() {
			return this.UserName.endsWith("@chatroom");
		},

		isRoomContactDel: function() {
			return this.isRoomContact() && !(this.ContactFlag & _aoWebMM.Constants.MM_CONTACTFLAG_CHATROOMCONTACT);
		},

		isRoomOwner: function() {
			return this.isRoomContact() && this.OwnerUin == _aoWebMM.model("account").getUin();
		},

		isBrandContact: function() {
			return this.VerifyFlag & _aoWebMM.Constants.MM_USERATTRVERIFYFALG_BIZ_BRAND;
		},

		isSpContact: function() {
			return _aoWebMM.util.isSpUser(this.UserName);
		},

		isShieldUser: function() {
			return _aoWebMM.util.isShieldUser(this.UserName);
		},

		isFileHelper: function() {
			return this.UserName == _aoWebMM.Constants.SP_CONTACT_FILE_HELPER;
		},

		isRecommendHelper: function() {
			return this.UserName == "fmessage";
		},

		isNewsApp: function() {
			return this.UserName == _aoWebMM.Constants.SP_CONTACT_NEWSAPP;
		},

		isMuted: function() {
			return this.isRoomContact() ? this.Statues === _aoWebMM.Constants.MM_CHATROOM_NOTIFY_CLOSE :
				this.ContactFlag & _aoWebMM.Constants.MM_CONTACTFLAG_NOTIFYCLOSECONTACT;
		},

		_canSearchMemberList: function(_asFilter) {
			if (this.isRoomContact()) {
				for (var i = 0, len = this.MemberList.length; i < len; i++) {
					var _sUserName = this.MemberList[i].UserName,
						_oMember = _aoWebMM.model("contact").getContact(_sUserName);
					if (_oMember && _oMember.canSearch(_asFilter)) {
						return true;
					}
				}
			}
		},

		canSearch: function(_asFilter, _abContainChatroomMembers) {
			if (!_asFilter) {
				this.weight = 1;
				return true;
			}

			_asFilter = _asFilter.toUpperCase();

			var a = 0,
				b = 0;
			a = this.RemarkName.toUpperCase().indexOf(_asFilter);
			b = this.RemarkPYQuanPin.toUpperCase().indexOf(_asFilter);
			if (a >= 0 || b >= 0) {
				if (a == 0) {
					this.weight = 1;
				} else if (b == 0) {
					this.weight = 0.9;
				} else {
					this.weight = 0.6;
				}
				return true;
			}

			a = this.NickName.toUpperCase().indexOf(_asFilter);
			b = this.PYQuanPin.toUpperCase().indexOf(_asFilter);
			if (a >= 0 || b >= 0) {
				if (a == 0) {
					this.weight = 0.8;
				} else if (b == 0) {
					this.weight = 0.7;
				} else {
					this.weight = 0.4;
				}

				return true;
			}

			if (this.Alias.toUpperCase().indexOf(_asFilter) >= 0 ||
				this.UserName.toUpperCase().indexOf(_asFilter) >= 0 ||
				(_abContainChatroomMembers && this.isRoomContact() && this._canSearchMemberList(_asFilter))) {
				this.weight = 0.5;
				return true;
			}

			return false;
		},

		update: function(_aoOptions) {
			if (_aoOptions) {
				$.extend(this, _aoOptions);
				_aoWebMM.triggerEvent("contactUpdated", this);
			}
		},

		hasPhotoAlbum: function() {
			return this.SnsFlag & 1;
		}
	};

	function _extendContact(_aoContact) {
		_aoContact = $.extend({
			RemarkPYQuanPin: "",
			RemarkPYInitial: "",
			PYInitial: "",
			PYQuanPin: ""
		}, _aoContact, _oContactOperates);
		_aoContact.avatar = _aoWebMM.util.getNormalAvatarUrl(_aoContact.UserName);

		return _aoContact;
	}

	_aoWebMM.model("contact", {

		addContacts: function(_aoContacts, _abSilent) {
			if (!_aoContacts) return;

			for (var i = 0, len = _aoContacts.length; i < len; i++) {
				this.addContact(_aoContacts[i]);
			}

			if (!_abSilent) {
				_aoWebMM.triggerEvent("contactListReady");
			}
		},

		addContact: function(_aoContact) {
			if (!_aoContact || _aoWebMM.util.isShieldUser(_aoContact.UserName)) return;

			var _oContact = _aoContact,
				_sTriggerEvent = "";

			_aoWebMM.util.modifyNickName(_aoContact);
			if (_aoContact.UserName == "fmessage") {
				_aoContact.ContactFlag = 0;
			}

			if (!_oContacts[_oContact.UserName]) {
				_oContacts[_oContact.UserName] = _oContact;
				_sTriggerEvent = "contactAdded";

			} else if (_oContact.ContactFlag === 0) {
				this.deleteContact(_oContact.UserName);
				return;

			} else {
				if (_aoWebMM.util.isRoomContact(_oContact.UserName) && _oContact.MemberCount == 0) {
					delete _oContact.MemberCount;
					delete _oContact.MemberList;
				}
				$.extend(_oContacts[_oContact.UserName], _oContact);
				_sTriggerEvent = "contactUpdated";
			}

			// build inverse index
			if (_aoWebMM.util.isRoomContact(_oContact.UserName) && _oContact.MemberCount > 0) {
				for (var i = 0, len = _oContact.MemberList.length; i < len; i++) {
					var _oMem = _oContact.MemberList[i];
					if (!_oReverseMap[_oMem.UserName]) {
						_oReverseMap[_oMem.UserName] = [];
					}
					_oReverseMap[_oMem.UserName].push(_oContact.Uin);
				}
			}

			var _oCon = _oContacts[_oContact.UserName];
			_oCon.DisplayName = _aoWebMM.util.getContactDisplayName(_oCon);
			_oCon = _oContacts[_oContact.UserName] = _extendContact(_oCon);
			_aoWebMM.triggerEvent(_sTriggerEvent, _oCon);
		},

		getContact: function(_asUserName) {
			return _oContacts[_asUserName] || null;
		},

		isContactExisted: function(_asUserName) {
			return !!_oContacts[_asUserName];
		},

		getAllContacts: function() {
			return _oContacts;
		},

		getAllStarContact: function(_aoFilterContacts) {
			var _oResult = [],
				_oFilter = _aoFilterContacts || {};

			for (var name in _oContacts) {
				var _oContact = _oContacts[name];
				if (!_oContact.isSelf() && _oContact.StarFriend == 1 && !_oFilter[name]) {
					_oResult.push(_oContact);
				}
			}

			_oResult = _oResult.sort(function(_oC1, _oC2) {
				return _oC1.orderC > _oC2.orderC ? 1 : -1;
			});

			return _oResult;
		},

		getAllChatroomContact: function() {
			var _oResult = [];

			for (var name in _oContacts) {
				var _oContact = _oContacts[name];
				if (_oContact.isRoomContact()) {
					_oResult.push(_oContact);
				}
			}
			_oResult = _oResult.sort(function(_oC1, _oC2) {
				return _oC1.orderC > _oC2.orderC ? 1 : -1;
			});


			return _oResult;
		},

		getAllFriendChatroomContact: function(_asFilter) {
			var _oResult = [];

			for (var name in _oContacts) {
				var _oContact = _oContacts[name];
				if (_oContact.isContact() && _oContact.isRoomContact() && _oContact.canSearch(_asFilter)) {
					_oResult.push(_oContact);
				}
			}

			_oResult = _oResult.sort(function(_oC1, _oC2) {
				return _oC1.orderC > _oC2.orderC ? 1 : -1;
			});

			return _oResult;
		},

		getAllBrandContact: function() {
			var _oResult = [];

			for (var name in _oContacts) {
				var _oContact = _oContacts[name];
				if (_oContact.isContact() && _oContact.isBrandContact()) {
					_oResult.push(_oContact);
				}
			}

			_oResult = _oResult.sort(function(_oC1, _oC2) {
				return _oC1.orderC > _oC2.orderC ? 1 : -1;
			});


			return _oResult;
		},

		getAllFriendContact: function(_asKey, _abWithoutStar, _aoFilterContacts, _abWithoutBrand) {
			var _oResult = [];
			_aoFilterContacts = _aoFilterContacts || {};
			for (var name in _oContacts) {
				if (_aoFilterContacts[name]) {
					continue;
				}

				var _oContact = _oContacts[name];
				if ((_oContact.isSelf() && !_aoWebMM.model("account").isHigherVer()) || !_oContact.isContact() ||
					_abWithoutStar && _oContact.StarFriend == 1 ||
					_oContact.isRoomContact() ||
					_abWithoutBrand && _oContact.isBrandContact() ||
					_oContact.isShieldUser()) {
					continue;
				}

				if (_oContact.canSearch(_asKey)) {
					_oResult.push(_oContact);
				}
			}

			_oResult = _oResult.sort(function(_oC1, _oC2) {
				return _oC1.orderC > _oC2.orderC ? 1 : -1;
			});

			return _oResult;
		},

		getAllCanChatContactUserName: function(_asFilter) {
			var _oResult = [];
			for (var name in _oContacts) {
				var _oContact = _oContacts[name];
				if ((_oContact.isSelf() && _aoWebMM.model("account").isHigherVer()) || (_oContact.isContact() || _oContact.isRoomContact() || _oContact.isSpContact()) && !_oContact.isShieldUser()) {
					if (_oContact.canSearch(_asFilter, true)) {
						_oResult.push(name);
					}
				}
			}

			return _oResult;
		},


		deleteContact: function(_aoUserNames) {
			if (!$.isArray(_aoUserNames)) {
				_aoUserNames = [_aoUserNames];
			}

			for (var i = 0, len = _aoUserNames.length; i < len; i++) {
				var _sUserName = _aoUserNames[i],
					_oContact = null;
				if (_oContact = _oContacts[_sUserName]) {
					delete _oContacts[_sUserName];
					_aoWebMM.triggerEvent("contactDeleted", _oContact);
				}
			}
		},

		getContactCount: function() {
			var _nCount = 0;
			for (var key in _oContacts) {
				_nCount++;
			}

			return _nCount;
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	var _oMessageQueue = {}, // {userName:[Message, Message, ...]}
		_sUserName = null;

	function _fIsShieldUser(_asUserName) {
		return _aoWebMM.util.isShieldUser(_asUserName);
	}

	function _fFindByMsgId(_aoMessages, _aiMsgId) {
		for (var i = 0; i < _aoMessages.length; ++i) {
			if (_aoMessages[i].MsgId == _aiMsgId) {
				return i;
			}
		}
		return -1;
	}

	function _fFindByVerifyMsgUserName(_aoMessages, _asUserName) {
		for (var i = 0; i < _aoMessages.length; ++i) {
			var _oMsg = _aoMessages[i];
			if (_oMsg.MsgType == _aoWebMM.Constants.MM_DATA_VERIFYMSG && _oMsg.RecommendInfo.UserName == _asUserName) {
				return i;
			}
		}
		return -1;
	}

	function _fFindByMsgLocalId(_aoMessages, _aiMsgLocalID) {
		for (var i = 0; i < _aoMessages.length; ++i) {
			if (_aoMessages[i].LocalID == _aiMsgLocalID) {
				return _aoMessages[i];
			}
		}
	}

	function _getMsgActualContent(_aoMessage) {
		if (!_aoMessage) {
			return "";
		}

		var _nType = _aoMessage.MsgType,
			_oUtil = _aoWebMM.util;
		if (_oUtil.isTextMsg(_nType) || _oUtil.isSysMsg(_nType) || _nType == _aoWebMM.Constants.MM_DATA_READER_TYPE || _nType == _aoWebMM.Constants.MM_DATA_APP_MSG_TEXT_TYPE || _nType == _aoWebMM.Constants.MM_DATA_VERIFYMSG || _nType == _aoWebMM.Constants.MM_DATA_SHARECARD || _nType == _aoWebMM.Constants.MM_DATA_POSSIBLEFRIEND_MSG) {
			if (_oUtil.isRoomContact(_aoMessage.FromUserName)) {
				var _nIndex = _aoMessage.Content.indexOf(":<br/>");
				if (_nIndex < 0)
					return _aoMessage.Content;

				return _aoMessage.Content.substr(_nIndex + 6);
			} else {
				return _aoMessage.Content;
			}
		} else if (_aoWebMM.Constants.MM_DATA_APPMSG_UNSUPPORT == _nType) {
			return _aoWebMM.getRes("text_chatmsglist_app_msg_unspport");

		} else if (_aoWebMM.Constants.MM_DATA_LOCATION == _nType) {
			return _aoWebMM.getRes("text_location_msg");

		} else if (_aoWebMM.Constants.MM_DATA_VOIPMSG == _nType || _aoWebMM.Constants.MM_DATA_VOIPNOTIFY == _nType || _aoWebMM.Constants.MM_DATA_VOIPINVITE == _nType) {
			return _aoWebMM.getRes("text_voip_msg");

		} else {
			return _aoWebMM.getRes("text_chatmsglist_msg_unspport");
		}
	}

	function _GetMessagePeerUserName(_aoMessage) {
		if (!_sUserName) {
			_sUserName = _aoWebMM.model("account").getUserName();
		}

		_aoMessage.isSend = _aoMessage.FromUserName == _sUserName || _aoMessage.FromUserName == "";

		return _aoMessage.isSend ? _aoMessage.ToUserName : _aoMessage.FromUserName;
	}

	function _isSelfSendMsg(_aoMessage) {
		return _aoMessage.FromUserName == _aoWebMM.model("account").getUserName();
	}

	function _calcMsgDisplayTime(_aoLastMsg, _aoCurMsg) {
		if (!_aoCurMsg || _aoCurMsg.MsgType < 0) {
			return;

		} else if (!_aoLastMsg || _aoLastMsg.MsgType < 0) {
			var _oCreateTime = new Date(_aoCurMsg.CreateTime * 1000);
			_aoCurMsg.displayTime = _aoCurMsg.CreateTime;
			_aoCurMsg.time = _oCreateTime.getHours() + ":" + $.formatNum(_oCreateTime.getMinutes(), 2);

		} else {
			var _oLastTime = new Date(_aoLastMsg.CreateTime * 1000),
				_oCurTime = new Date(_aoCurMsg.CreateTime * 1000);

			if (Math.abs(_aoLastMsg.displayTime - _aoCurMsg.CreateTime) >= 180) {
				_aoCurMsg.displayTime = _aoCurMsg.CreateTime;
				_aoCurMsg.time = _oCurTime.getHours() + ":" + $.formatNum(_oCurTime.getMinutes(), 2);

			} else {
				_aoCurMsg.displayTime = _aoLastMsg.displayTime;
				_aoCurMsg.time = "";
			}
		}
	}

	function _fMsgFilter(_aoMessage) {
		if (_aoMessage.HasProductId) {
			_aoMessage.MsgType = 1;
			if (_isSelfSendMsg(_aoMessage)) {
				_aoMessage.Content = _aoWebMM.getRes("send_emoji_not_support_msg");
			} else {
				var _sSendUser = "";
				if (_aoWebMM.util.isRoomContact(_aoMessage.FromUserName)) _sSendUser = _aoMessage.Content.match(/(.*?:)<br\/>/);
				if (_sSendUser && _sSendUser.length > 1) _sSendUser = _sSendUser[1] + "<br/>";

				_aoMessage.Content = _sSendUser + _aoWebMM.getRes("rece_emoji_not_support_msg");
			}
		}
	}
	var _oMessageOperators = {
		isSysMessage: function() {
			return this.MsgType == _aoWebMM.Constants.MM_DATA_SYS;
		},

		update: function(_aoOptions) {
			if (_aoOptions) {
				$.extend(this, _aoOptions);
				_aoWebMM.triggerEvent("messageUpdated", this);
			}
		}
	};

	_aoWebMM.addEventListener("accountUpdated", function(_aoData) {
		var _sUserName = _aoWebMM.model("account").getUserName();
		var _sAvatarURL = _aoData.avatar;
		if (!_sAvatarURL) return;
		for (var i in _oMessageQueue) {
			var msgList = _oMessageQueue[i];
			for (var j = 0, len = msgList.length; j < len; ++j) {
				if (msgList[j].avatarId && msgList[j].avatarId == _sUserName)
					msgList[j].avatar = _sAvatarURL;
			}
		}
	});

	_aoWebMM.model("message", {

		getMessages: function(_asUserName) {
			if (_oMessageQueue[_asUserName]) {
				return _oMessageQueue[_asUserName];
			} else {
				return [];
			}
		},

		getUnreadMsgsCount: function(_asUserName) {
			var _nUnreadCout = 0,
				_oMessages;
			if (_oMessages = _oMessageQueue[_asUserName]) {
				for (var i = _oMessages.length - 1; i >= 0; i--) {
					if (_oMessages[i].unread) {
						++_nUnreadCout;
					}
				}
			}
			return _nUnreadCout;
		},

		markMsgsRead: function(_asUserName) {
			var _oMessages = this.getMessages(_asUserName),
				_bHasUnreaded = false;
			for (var i = 0, len = _oMessages.length; i < len; i++) {
				if (_oMessages[i].unread) {
					_bHasUnreaded = true;
				}
				_oMessages[i].unread = false;
			}

			return _bHasUnreaded;
		},

		getFirstMessage: function(_asUserName) {
			var _oMessages = this.getMessages(_asUserName);
			return _oMessages.length && _oMessages[0] || null;
		},

		getLastMessage: function(_asUserName) {
			var _oMessages = this.getMessages(_asUserName);
			return _oMessages.length && _oMessages[_oMessages.length - 1] || {};
		},

		getMsgById: function(_asUserName, _asMsgId) {
			var _oMsgs = this.getMessages(_asUserName),
				_nIdx = _fFindByMsgId(_oMsgs, _asMsgId);
			return _nIdx >= 0 ? _oMsgs[_nIdx] : null;
		},

		getMsgByLocalId: function(_asUserName, _asMsgLocalID) {
			return _fFindByMsgLocalId(this.getMessages(_asUserName), _asMsgLocalID);
		},

		getNextUnreadVoiceMsg: function(_asUserName, _asMsgId) {
			var _oMsgs = this.getMessages(_asUserName),
				_bFind = false;
			for (var i = 0, len = _oMsgs.length; i < len; i++) {
				if (!_bFind && _oMsgs[i].MsgId == _asMsgId) {
					_bFind = true;

				} else if (_bFind && _oMsgs[i].MsgType == _aoWebMM.Constants.MM_DATA_VOICEMSG && _oMsgs[i].Status == _aoWebMM.Constants.STATE_REACH) {
					return _oMsgs[i];
				}
			}
			return null;
		},

		addFakeSysMsg: function(_aoData) {
			this.addMessages([{
				MsgId: $.now(),
				MsgType: _aoData.MsgType,
				FromUserName: _aoData.FromUserName,
				ToUserName: _aoData.ToUserName,
				Status: _aoWebMM.Constants.STATE_SENT,
				CreateTime: _aoData.CreateTime || _aoWebMM.util.getServerTime() / 1000,
				Content: _aoData.Content,
				unread: false
			}]);
		},

		initMessageQueue: function(_asUserName, _anTime) {
			if (!_asUserName || _fIsShieldUser(_asUserName)) return;
			if (!_oMessageQueue[_asUserName]) {
				_oMessageQueue[_asUserName] = [];

			} else {
				return false;
			}

			var _nMsgType = (_aoWebMM.util.isFileHelper(_asUserName) && _oMessageQueue[_asUserName].length == 0) ? 10000 : -9999,
				_sContent = _nMsgType > 0 ? _aoWebMM.getRes("text_file_helper_tip") : "";

			_anTime = _nMsgType > 0 ? _aoWebMM.util.getServerTime() / 1000 : _anTime;

			this.addMessages([{
				MsgId: $.now(),
				MsgType: _nMsgType,
				FromUserName: "",
				ToUserName: _asUserName,
				Status: _aoWebMM.Constants.STATE_SENT,
				CreateTime: (_anTime ? _anTime : _aoWebMM.util.getServerTime() / 1000),
				Content: _sContent,
				unread: false
			}]);
			return true;
		},

		getQueueUserNames: function() {
			var _oResult = [];
			for (var _sUserName in _oMessageQueue) {
				_oResult.push(_sUserName);
			}

			return _oResult;
		},

		addMessages: function(_aoMessages, _anInsertPos) {
			var _oSelf = this;
			if (!_aoMessages) {
				return;
			}

			if (!$.isArray(_aoMessages)) {
				_aoMessages = [_aoMessages];
			}

			for (var i = 0, len = _aoMessages.length; i < len; i++) {
				try {
					var _oMessage = _aoMessages[i],
						_sFromUserName = _oMessage.FromUserName,
						_sToUserName = _oMessage.ToUserName,
						_sUserName = _GetMessagePeerUserName(_oMessage),
						_oQueue = _oMessageQueue[_sUserName] || (_oMessageQueue[_sUserName] = []);

					Log.d("msgid=" + _oMessage.MsgId);

					_fMsgFilter(_oMessage);

					if (_aoWebMM.util.isRoomContact(_sFromUserName)) {
						_oMessage.actualSender = _aoWebMM.util.getRoomMsgActualSender(_oMessage);

					} else {
						_oMessage.actualSender = _sFromUserName;
					}

					if (_oMessage.MsgType == _aoWebMM.Constants.MM_DATA_STATUSNOTIFY || _aoWebMM.util.isTalkContact(_sFromUserName) || _aoWebMM.util.isTalkContact(_sToUserName) || _fIsShieldUser(_sFromUserName) || _fIsShieldUser(_sToUserName) || (_oMessage.MsgType == _aoWebMM.Constants.MM_DATA_VERIFYMSG && _oMessage.RecommendInfo && _oMessage.RecommendInfo.UserName == _aoWebMM.model("account").getUserInfo().UserName)) {
						continue;
					}

					var _iIndex;
					_iIndex = _fFindByMsgId(_oQueue, _oMessage.MsgId);
					if (_iIndex < 0) {
						var _sActualContent = _getMsgActualContent(_oMessage);
						if (_oMessage.LocalID != _aoUndefined && _oMessage.LocalID == _oMessage.ClientMsgId) {
							_sActualContent = _aoWebMM.widget.preFilterEmoji(_sActualContent);
							_sActualContent = $.htmlEncode(_sActualContent);
							_sActualContent = _sActualContent.replace(/\n/g, "<br/>");
							//_sActualContent = _sActualContent.replace(/ /g, "&nbsp;");
							_sActualContent = _aoWebMM.widget.afterFilterEmoji(_sActualContent);
						}

						if (!_oMessage.LocalID) {
							_oMessage.ClientMsgId = _oMessage.LocalID = _oMessage.MsgId;
						}

						_oMessage.digest = $.clearLinkTag(_aoWebMM.widget.filterQQFace(_sActualContent /*, true*/ ));
						_oMessage.actualContent = $.hrefEncode(_aoWebMM.widget.filterQQFace(_sActualContent));

						if (!_isSelfSendMsg(_oMessage) && _oMessage.unread == _aoUndefined && _oMessage.MsgType != _aoWebMM.Constants.MM_DATA_SYS) {
							_oMessage.unread = true;
						}

						if (_oMessage.MsgType == _aoWebMM.Constants.MM_DATA_VERIFYMSG) {
							var _bChatFlag = "0", //0 shows that the msg is send by peer
								_sContactUserName = _oMessage.RecommendInfo.UserName;
							// if(_sContactUserName == WebMM.model("account").getUserInfo().UserName){
							// 	_bChatFlag = "1";//1 shows that the msg is send by myself
							// 	_sContactUserName = _sToUserName;
							// }
							var _iOldMsgIndex = _fFindByVerifyMsgUserName(_oQueue, _sContactUserName);
							if (_iOldMsgIndex < 0) {
								_oMessage.History = [_bChatFlag + _oMessage.RecommendInfo.Content];
							} else {
								var _oOldMsg = _oQueue[_iOldMsgIndex];
								_oOldMsg.History.push(_bChatFlag + _oMessage.RecommendInfo.Content);
								// _oMessage.ClientMsgId = _oOldMsg.ClientMsgId;
								// _oMessage.LocalID = _oOldMsg.LocalID;
								// _oMessage.MsgId = _oOldMsg.MsgId;
								// _oMessage.time = _oOldMsg.time;
								// this.updateMessage(_oQueue, _iOldMsgIndex, _oMessage);//VerifyMsg Use Update for HelloMsg
								// return;
								_oMessage.History = _oOldMsg.History;
							}
						}
						if (_aoWebMM.util.isRoomContact(_oMessage.FromUserName)) {
							_oMessage.avatarTitle = $.htmlEncode($.clearHtmlStr(_aoWebMM.util.getMemberDisplayName(_oMessage.actualSender, _oMessage.FromUserName)));
						} else if (_aoWebMM.util.isRoomContact(_oMessage.ToUserName)) {
							_oMessage.avatarTitle = $.htmlEncode($.clearHtmlStr(_aoWebMM.util.getMemberDisplayName(_oMessage.actualSender, _oMessage.ToUserName)));
						} else {
							_oMessage.avatarTitle = $.htmlEncode($.clearHtmlStr(_aoWebMM.util.getContactDisplayName(_oMessage.actualSender)));
						}
						_oMessage.avatarId = _oMessage.actualSender;
						_oMessage.avatar = _aoWebMM.util.getNormalAvatarUrl(_oMessage.actualSender, _oMessage.FromUserName);


						if (_anInsertPos === _aoUndefined) {
							_calcMsgDisplayTime(_oQueue[_oQueue.length - 1], _oMessage);
							_oQueue.push(_oMessage);
						} else {
							_oQueue.splice(_anInsertPos, 0, _oMessage);
						}

						$.extend(_oMessage, _oMessageOperators);
						_aoWebMM.triggerEvent(_anInsertPos === _aoUndefined ? "messageAdded" : "messagePrepend", _oMessage);
					} else {
						this.updateMessage(_oQueue, _iIndex, _oMessage);
					}

				} catch (e) {
					Log.e("JS Function: addMessages. try catch error: " + e);
				}
			}
		},

		updateMessage: function(_aoQueue, _aiIndex, _aoMsg) {
			$.extend(_aoQueue[_aiIndex], _aoMsg);
			_aoWebMM.triggerEvent("messageUpdated", _aoMsg);
		},

		deleteMessage: function(_asUserName) {
			if (_oMessageQueue[_asUserName]) {
				delete _oMessageQueue[_asUserName];
				_aoWebMM.triggerEvent("sessionDeleted", _asUserName);
			}
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	var _oHistory = {};

	_aoWebMM.model("history", {
		inputRecord: function(_asUserName, _asData) {
			return (_asData != _aoUndefined) && (_oHistory[_asUserName] = _asData) || _oHistory[_asUserName] || "";
		},
		getAll: function() {
			return _oHistory;
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	var _nMaxSysMsgType = 10000,
		_nCustomBaseDataType = 0x10000;

	_aoWebMM.Constants = $.extend(_aoWebMM.Constants || {}, {
		MM_DATA_TEXT: 1,
		MM_DATA_HTML: 2,
		MM_DATA_IMG: 3,
		MM_DATA_PRIVATEMSG_TEXT: 11,
		MM_DATA_PRIVATEMSG_HTML: 12,
		MM_DATA_PRIVATEMSG_IMG: 13,
		MM_DATA_VOICEMSG: 34,
		MM_DATA_PUSHMAIL: 35,
		MM_DATA_QMSG: 36,
		MM_DATA_VERIFYMSG: 37,
		MM_DATA_PUSHSYSTEMMSG: 38,
		MM_DATA_QQLIXIANMSG_IMG: 39,
		MM_DATA_POSSIBLEFRIEND_MSG: 40,
		MM_DATA_SHARECARD: 42,
		MM_DATA_VIDEO: 43,
		MM_DATA_VIDEO_IPHONE_EXPORT: 44,
		MM_DATA_EMOJI: 47,
		MM_DATA_LOCATION: 48,
		MM_DATA_APPMSG: 49, // AppMsg
		MM_DATA_VOIPMSG: 50, // voip msg
		MM_DATA_STATUSNOTIFY: 51, // 
		MM_DATA_VOIPNOTIFY: 52, // voip 结束消息
		MM_DATA_VOIPINVITE: 53, // voip 邀请
		MM_DATA_SYSNOTICE: 9999,
		MM_DATA_SYS: 10000,

		//custom data type
		MM_DATA_READER_TYPE: _nMaxSysMsgType + 1,
		MM_DATA_APP_MSG_TEXT_TYPE: _nMaxSysMsgType + 2,
		MM_DATA_APP_MSG_IMG_TYPE: _nMaxSysMsgType + 3,
		MM_DATA_APP_MSG_AUDIO_TYPE: _nMaxSysMsgType + 4,
		MM_DATA_APP_MSG_VIDEO_TYPE: _nMaxSysMsgType + 5,
		MM_DATA_APP_MSG_URL_TYPE: _nMaxSysMsgType + 6,
		MM_DATA_APP_MSG_ATTACH_TYPE: _nMaxSysMsgType + 7,
		MM_DATA_APP_MSG_OPEN_TYPE: _nMaxSysMsgType + 8,
		MM_DATA_APP_MSG_EMOJI_TYPE: _nMaxSysMsgType + 9,
		MM_DATA_APPMSG_UNSUPPORT: 49 | _nCustomBaseDataType,

		// media type
		MM_MEDIA_TYPE_IMAGE: 1,
		MM_MEDIA_TYPE_VIDEO: 2,
		MM_MEDIA_TYPE_AUDIO: 3,
		MM_MEDIA_TYPE_ATTACHMENT: 4,


		SP_CONTACT_FILE_HELPER: "filehelper",
		SP_CONTACT_NEWSAPP: "newsapp",

		//log
		MMWEBWX_JSLOG: 1,
		MMWEBWX_JSERR: 2,
		MMWEBWX_WEBSESSIONTIMEOUT_LOGOUT: 4,
		MMWEBWX_CONNECT_ERR: 5,
		MMWEBWX_USETIME: 6,
		MMWEBWX_LOGIN_COSTTIME: 7,
		MMWEBWX_NEW_CHAT: 9,
		MMWEBWX_UPLOADMEDIA_TOO_LARGE: 11,
		MMWEBWX_GETVOICE: 12,

		// send msg status
		STATE_UNKNOWN: 0,
		STATE_SENDING: 1,
		STATE_SENT: 2,
		STATE_REACH: 3,
		STATE_READ: 4,
		STATE_FAILED: 5,


		//app msgtype
		APPMSGTYPE_TEXT: 1,
		APPMSGTYPE_IMG: 2,
		APPMSGTYPE_AUDIO: 3,
		APPMSGTYPE_VIDEO: 4,
		APPMSGTYPE_URL: 5,
		APPMSGTYPE_ATTACH: 6,
		APPMSGTYPE_OPEN: 7,
		APPMSGTYPE_EMOJI: 8,
		APPMSGTYPE_VOICE_REMIND: 9,

		//app msg show type
		MM_APPMSG_SHOW_DEFAULT: 0,
		MM_APPMSG_SHOW_READER: 1,
		MM_APPMSG_SHAKETRANIMG_RESULT: 2,
		MM_APPMSG_VOICEREMIND_CONFIRM: 3,
		MM_APPMSG_VOICEREMIND_REMIND: 4,
		MM_APPMSG_VOICEREMIND_SYS: 5, // voice + text

		// biz data type
		MM_BIZ_DATA_TEXT: 1,
		MM_BIZ_DATA_IMG: 2,
		MM_BIZ_DATA_VOICE: 3,
		MM_BIZ_DATA_VIDEO: 4,
		MM_BIZ_DATA_APPMSG: 10,
		MM_BIZ_DATA_SHARECARD: 42,

		// contact flag
		MM_CONTACTFLAG_CONTACT: 0x01,
		MM_CONTACTFLAG_CHATCONTACT: 0x02,
		MM_CONTACTFLAG_CHATROOMCONTACT: 0x04,
		MM_CONTACTFLAG_BLACKLISTCONTACT: 0x08,
		MM_CONTACTFLAG_DOMAINCONTACT: 0x10,
		MM_CONTACTFLAG_HIDECONTACT: 0x20,
		MM_CONTACTFLAG_FAVOURCONTACT: 0x40,
		MM_CONTACTFLAG_3RDAPPCONTACT: 0x80,
		MM_CONTACTFLAG_SNSBLACKLISTCONTACT: 0x100,
		MM_CONTACTFLAG_NOTIFYCLOSECONTACT: 0x200,

		// verify flag
		MM_USERATTRVERIFYFALG_BIZ: 0x1, // 小商家
		MM_USERATTRVERIFYFALG_FAMOUS: 0x2,
		MM_USERATTRVERIFYFALG_BIZ_BIG: 0x4, // 大商家
		MM_USERATTRVERIFYFALG_BIZ_BRAND: 0x8, // 品牌商家
		MM_USERATTRVERIFYFALG_BIZ_VERIFIED: 0x10, // 认证

		// status notify
		StatusNotifyCode_READED: 1,
		StatusNotifyCode_ENTER_SESSION: 2,
		StatusNotifyCode_INITED: 3,
		StatusNotifyCode_SYNC_CONV: 4,
		StatusNotifyCode_QUIT_SESSION: 5,

		// function switch
		MM_WEBWXFUNCTION_TONE_NOT_OPEN: 0x1,
		MM_WEBWXFUNCTION_NOTIFY_OPEN: 0x2,

		// VerifyUserOpcode
		MM_VERIFYUSER_ADDCONTACT: 1,
		MM_VERIFYUSER_SENDREQUEST: 2,
		MM_VERIFYUSER_VERIFYOK: 3,
		MM_VERIFYUSER_VERIFYREJECT: 4,
		MM_VERIFYUSER_SENDERREPLY: 5,
		MM_VERIFYUSER_RECVERREPLY: 6,


		// add contact scene
		MM_ADDSCENE_PF_QQ: 4, // 通过可能认识的QQ好友
		MM_ADDSCENE_PF_EMAIL: 5, // 通过可能认识的QQMail好友
		MM_ADDSCENE_PF_CONTACT: 6, // 通过把我加到通讯录的人
		MM_ADDSCENE_PF_WEIXIN: 7, // 通过可能认识的微信好友(二度关系)
		MM_ADDSCENE_PF_GROUP: 8, // 通过可能认识的群好友
		MM_ADDSCENE_PF_UNKNOWN: 9, // “可能认识的好友”（无法区分来源）
		MM_ADDSCENE_PF_MOBILE: 10, // 手机通讯录

		// 音频格式
		EN_INFORMAT_NULL: 0,
		EN_INFORMAT_AMR: 1,
		EN_INFORMAT_MP3: 2,
		EN_INFORMAT_MP4: 3,
		EN_INFORMAT_WMA: 4,
		EN_INFORMAT_WAV: 5,
		EN_INFORMAT_WMV: 6,
		EN_INFORMAT_ASF: 7,
		EN_INFORMAT_RM: 8,
		EN_INFORMAT_RMVB: 9,
		EN_INFORMAT_AVI: 10,
		EN_INFORMAT_MPG: 11,
		EN_INFORMAT_MPEG: 12,
		EN_INFORMAT_BUTT: 13,

		//判断添加是否需要验证
		MM_STATUS_VERIFY_USER: 0x20,

		// oplog
		MMWEBWX_OPLOG_BLACKCONTACT: 1, //拉黑名单
		MMWEBWX_OPLOG_MODREMARKNAME: 2, //修改备注名

		//黑名单的操作
		MMWEBWX_OPLOG_BLACKCONTACT_DELETE: 0, //拉出黑名单
		MMWEBWX_OPLOG_BLACKCONTACT_ADD: 1, //拉进黑名单

		// chatroom mute
		MM_CHATROOM_NOTIFY_OPEN: 0x1,
		MM_CHATROOM_NOTIFY_CLOSE: 0x0,

		//MemberStatus
		MM_MEMBER_OK: 0,
		MM_MEMBER_NOUSER: 1,
		MM_MEMBER_USERNAMEINVALID: 2,
		MM_MEMBER_BLACKLIST: 3,
		MM_MEMBER_NEEDVERIFYUSER: 4,
		MM_MEMBER_UNSUPPORT_TALK: 5
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {

	var _sInitUrl = "/cgi-bin/mmwebwx-bin/webwxinit",
		_oInitedContacts = [];
	_aoWebMM.logic("init", {
		init: function(_afCallBack) {
			var _oSelf = this;
			if (_oSelf.isIniting) {
				return;
			}
			_oSelf.isIniting = true;

			if ($.isLowerBrowser()) jQuery.fx.off = true; //if lower browser, trun off animation

			$.netQueue().send(_sInitUrl, _aoWebMM.model("account").getBaseRequest(), {
				onsuccess: function(d) {
					_aoWebMM.model("contact").addContacts(d.ContactList, true);
					var _oAccount = _aoWebMM.model("account");
					_oAccount.setUserInfo(d.User);
					_oAccount.setSid($.getCookie("wxsid"));
					_oAccount.setClientVer(d.ClientVersion);
					_oAccount.setSyncKey(d.SyncKey);
					_oAccount.setHistoryConversation(d.ChatSet);

					_aoWebMM.util.setServerTime(d.SystemTime || $.now());

					var _oMessageStg = _aoWebMM.model("message");
					for (var i = d.ContactList.length - 1; i >= 0; i--) {
						_oMessageStg.initMessageQueue(d.ContactList[i].UserName, d.ContactList.length - i);
					}
					_oInitedContacts = d.ContactList;

					_bIsInitOk = true;
					_afCallBack && _afCallBack(_aoWebMM.ErrOk, d);

					_aoWebMM.logic("sync").notifyMobile(_aoWebMM.model("account").getUserName(), 3);
				},

				onerror: function() {
					_afCallBack && _afCallBack(-1);
				},

				oncomplete: function() {
					_aoWebMM.triggerEvent("inited");
					_oSelf.isIniting = false;
				}
			});
		},
		reinit: function(_afCallBack) {
			var _oSelf = this;
			if (_oSelf.isIniting) {
				return;
			}
			_oSelf.isIniting = true;

			$.netQueue().send(_sInitUrl, _aoWebMM.model("account").getBaseRequest(), {
				onsuccess: function(d) {
					var _oAccount = _aoWebMM.model("account");
					_oAccount.setSid($.getCookie("wxsid"));
					_oAccount.setSyncKey(d.SyncKey);

					_afCallBack && _afCallBack(_aoWebMM.ErrOk, d);
				},

				onerror: function() {
					_afCallBack && _afCallBack(-1);
				},

				oncomplete: function() {
					_oSelf.isIniting = false;
				}
			});
		},
		getInitedContacts: function() {
			return _oInitedContacts;
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {

	function _fHandleCmdAddMsgs(_aoCmdAddMsgs) {
		if (!_aoCmdAddMsgs) return;

		var _oMsgStg = _aoWebMM.model("message"),
			_oMsgProcessor = _aoWebMM.logic("msgProcessor");
		Log.d("addMsg, count=" + _aoCmdAddMsgs.length);

		for (var i = 0, len = _aoCmdAddMsgs.length; i < len; i++) {
			var _oMsg = _aoCmdAddMsgs[i];
			if (!_oMsgProcessor.process(_oMsg)) {
				_oMsgStg.addMessages([_oMsg]);
			}
		}
	}

	function _fHandleCmdModContacts(_aoCmdModContacts) {
		if (!_aoCmdModContacts) return;

		var _oContactStg = _aoWebMM.model("contact");

		for (var i = 0; i < _aoCmdModContacts.legnth; ++i) {
			var _oCmdModCOntact = _aoCmdModContacts[i];
			if (_oCmdModCOntact.HeadImgUpdateFlag == 0) {
				var _oOldContact = _oContactStg.getContact(_oCmdModCOntact.UserName);
				if (_oOldContact && _oOldContact.HeadImgUrl) {
					_oCmdModCOntact.HeadImgUrl = _oOldContact.HeadImgUrl;
				}
			}
		}

		for (var i = 0, len = _aoCmdModContacts.length; i < len; i++) {
			var _oCmdModCOntact = _aoCmdModContacts[i];
			if (!_aoWebMM.util.isRoomContact(_oCmdModCOntact.UserName)) {
				continue;
			}

			var _oContact = _oContactStg.getContact(_oCmdModCOntact.UserName);
			if ((!_oContact || !_oContact.UserName) &&
				_oCmdModCOntact.ChatRoomOwner == _aoWebMM.model("account").getUserName()) {
				_aoWebMM.model("message").initMessageQueue(_oCmdModCOntact.UserName);
			}
		}

		for (var i = 0, len = _aoCmdModContacts.length; i < len; i++) {
			_oContactStg.addContact(_aoCmdModContacts[0]);
		}
	}

	function _fHandleCmdDelContacts(_aoCmdDelContacts) {
		if (!_aoCmdDelContacts) return;
		var _oContactStg = _aoWebMM.model("contact");

		for (var i = 0, len = _aoCmdDelContacts.length; i < len; i++) {
			_oContactStg.deleteContact(_aoCmdDelContacts[i].UserName);
		}
	}

	var MM_UINFOFLAG_USERNAME = 0x1;
	var MM_UINFOFLAG_NICKNAME = 0x2;
	var MM_UINFOFLAG_BINDUIN = 0x4;
	var MM_UINFOFLAG_BINDEMAIL = 0x8;
	var MM_UINFOFLAG_BINDMOBILE = 0x10;
	var MM_UINFOFLAG_STATUS = 0x20;
	var MM_UINFOFLAG_PHOTO = 0x40;
	var MM_UINFOFLAG_ALL = (MM_UINFOFLAG_USERNAME | MM_UINFOFLAG_NICKNAME | MM_UINFOFLAG_BINDUIN | MM_UINFOFLAG_BINDEMAIL | MM_UINFOFLAG_BINDMOBILE | MM_UINFOFLAG_STATUS | MM_UINFOFLAG_PHOTO);

	function _fHandleCmdModUserInfo(_aoCmdModUserInfo) {
		if (!_aoCmdModUserInfo) {
			return;
		}

		var bitFlag = _aoCmdModUserInfo.BitFlag,
			_oAccount = _aoWebMM.model("account").getUserInfo(),
			_bChange = false;

		if (bitFlag & MM_UINFOFLAG_USERNAME != 0) {
			_oAccount.UserName = _aoCmdModUserInfo.UserName.Buff;
			_bChange = true;
		}

		if (bitFlag & MM_UINFOFLAG_NICKNAME != 0) {
			_oAccount.NickName = _aoCmdModUserInfo.NickName.Buff;
			_bChange = true;
		}

		if (_aoCmdModUserInfo.HeadImgUpdateFlag == 1) {
			_oAccount.HeadImgUrl = _aoCmdModUserInfo.HeadImgUrl;
			_bChange = true;
		}

		if (_bChange) {
			_aoWebMM.model("account").setUserInfo(_oAccount);
		}
	}

	var _nLastSyncTime = 0,
		_nLastErrorInterval = 0;
	_aoWebMM.logic("sync", {
		sync: function() {
			var _oSelf = this;
			if (!_oWatchDog.isStatusValid()) {
				return;
			}

			if (_oSelf.isSyncing) {
				if ($.now() - _nLastSyncTime < 60 * 1000) {
					Log.d("JS Function: syncLogic sync. Do Sync Blocked, less 1 min between 2 sync!!!");
				}
				return;
			}

			_nLastSyncTime = $.now();
			_oSelf.isSyncing = true;

			var _oAccountStg = _aoWebMM.model("account"),
				_oAccount = _oAccountStg.getUserInfo(),
				_sSid = _oAccountStg.getSid(),
				_oSyncKey = _oAccountStg.getSyncKey(),
				_sUrl = "/cgi-bin/mmwebwx-bin/webwxsync?sid=" + encodeURIComponent(_sSid),
				baseRequest = {
					Uin: _oAccount.Uin,
					Sid: _sSid
				};

			var _oPostData = {
				BaseRequest: baseRequest,
				SyncKey: _oSyncKey,
				rr: $.now()
			};

			$.netQueue().send(_sUrl, _oPostData, {
				onbefore: function() {
					Log.d("doSync, synckey=" + JSON.stringify(_oPostData));
					_oWatchDog.startMonitor();
				},
				onsuccess: function(d) {
					Log.d("doSyncSuccess");
					_oSelf.isSyncing = false;
					if (d != null) {
						var ret = $.safe(function() {
							if (d.SyncKey) {
								_oAccountStg.setSyncKey(d.SyncKey);
								_oAccountStg.setSkey(d.SKey);
								Log.d(d.SyncKey);
							}
							_fHandleCmdAddMsgs(d.AddMsgList);
							_fHandleCmdModContacts(d.ModContactList);
							_fHandleCmdDelContacts(d.DelContactList);
							_fHandleCmdModUserInfo(d.Profile);
						});

						if (!d.SyncKey) {
							Log.d("No SyncKey");
							setTimeout(function() {
								_oWatchDog.reset()
							}, 5000);
							return;
						}

						if (ret == 0 && d.ContinueFlag != 0) {
							setTimeout(function() {
								_oSelf.sync();
							}, 50);
							return;

						} else if (ret < 0) {
							setTimeout(function() {
								_oWatchDog.reset()
							}, 2000);
							return;
						}

						setTimeout(function() {
							_oSelf.syncCheck();
						}, 10);
						_nLastErrorInterval = 0;
						return;
					}

					setTimeout(function() {
						_oWatchDog.reset()
					}, 2000);
					_nLastErrorInterval = 0;
				},
				onerror: function(status, statusCode) {
					Log.e("Cgi:" + _sUrl + ", JS Function: syncLogic sync. DoSyncError, status = " + status + ", statusCode = " + statusCode);
					_oSelf.isSyncing = false;
					if (((_nLastErrorInterval += 5) % 30) != 0) {
						setTimeout(function() {
							_oSelf.sync();
						}, 5000);
					} else {
						setTimeout(function() {
							_oWatchDog.reset()
						}, 5000);
					}
				},

				oncomplete: function() {
					_oSelf.isSyncing = false;
					_oWatchDog.stopMonitor();
				}
			});
		},

		syncCheck: function() {
			var _oSelf = this;

			if (!_oWatchDog.isStatusValid()) {
				return;
			}

			// 防止sync太频繁
			var _nDelay = 10 * 1000 - ($.now() - (_oSelf.syncCheck._lastSyncTime || 0));
			(_nDelay < 0) && (_nDelay = 0);
			if (_nDelay > 10 * 1000) {
				_nDelay = 1000;
			}

			setTimeout(function() {
				_oSelf.syncCheck._lastSyncTime = $.now();

				var _oAccStg = _aoWebMM.model("account"),
					_sSid = _oAccStg.getSid(),
					_sUin = _oAccStg.getUin(),
					_oSyncKey = _oAccStg.getSyncKey().List,
					_sSyncKey = [],
					_oPostData = null;

				for (var i = 0, len = _oSyncKey.length; i < len; i++) {
					_sSyncKey.push(_oSyncKey[i].Key + "_" + _oSyncKey[i].Val);
				}

				function _onsuccess(data) {
					Log.d("syncCheckSuccess, synckey=" + _sSyncKey);
					Log.d(data);

					_oSelf.syncCheck._lastSyncTime = 0;
					if (data && data.retcode == "0" && data.selector != "0") {
						_oSelf.mnSyncCheckErrCount = 0;
						_oSelf.sync();

					} else if (data && data.retcode == "0") {
						_oSelf.mnSyncCheckErrCount = 0;
						_oSelf.syncCheck();

					} else {
						if (_oSelf.mnSyncCheckErrCount < 3) {
							_oSelf.mnSyncCheckErrCount = (_oSelf.mnSyncCheckErrCount || 0) + 1;
							setTimeout(function() {
								_oSelf.sync()
							}, 5000);

						} else {
							setTimeout(function() {
								_oSelf.syncCheck();
							}, 2000);
						}
					}
				}

				function _onerror(xhr, textStatus) {
					Log.e("syncCheckError, synckey=" + _sSyncKey + ", errCount=" + _oSelf.mnSyncCheckErrCount + ", status = " + textStatus + ", statusCode = " + xhr.status);
					_aoWebMM.ossLog({
						Type: _aoWebMM.Constants.MMWEBWX_CONNECT_ERR
					});
					if (_oSelf.mnSyncCheckErrCount < 3) {
						_oSelf.mnSyncCheckErrCount = _oSelf.mnSyncCheckErrCount + 1;
						setTimeout(function() {
							_oSelf.sync()
						}, 5000);

					} else {
						setTimeout(function() {
							_oSelf.syncCheck();
						}, 2000);
					}
				}

				_oWatchDog.startMonitor();
				$.ajax({
					url: _aoWebMM.getRes("url_push") + "/cgi-bin/mmwebwx-bin/synccheck",
					dataType: "jsonp",
					data: {
						r: $.now(),
						sid: _sSid,
						uin: _sUin,
						deviceid: _aoWebMM.getDeviceId(),
						synckey: _sSyncKey.join("|")
					},
					timeout: 35 * 1000,
					complete: function(xhr, textStatus) {
						debug("syncCheck onComplete.");
						_oWatchDog.stopMonitor();
						try {
							if (_aoWin.synccheck && _aoWin.synccheck.retcode == "0") {
								_onsuccess(_aoWin.synccheck);

							} else if (!_aoWin.synccheck || !_aoWebMM.timeoutDetect(_aoWin.synccheck.retcode)) {
								_onerror(xhr, textStatus)
							}
						} catch (e) {
							Log.e("Cgi: /cgi-bin/mmwebwx-bin/synccheck, JS Function: synccheck, try catch error: " + +e);
						}
						_aoWin.synccheck = null;
					}
				});

			}, _nDelay);
		},

		notifyMobile: function(_asUserName, _anOpCode) {
			$.netQueue().send("/cgi-bin/mmwebwx-bin/webwxstatusnotify", $.extend(_aoWebMM.model("account").getBaseRequest(), {
				Code: _anOpCode,
				FromUserName: _aoWebMM.model("account").getUserName(),
				ToUserName: _asUserName,
				ClientMsgId: "" + $.now()
			}));
		}
	});

	var _oWatchDog = {
		_nTimeout: 45 * 1000,
		_nTimer: 0,
		_nSyncCheckRunner: 0,

		startMonitor: function() {
			Log.d("start syncCheck monitor.");
			this._nSyncCheckRunner++;
			if (this._nSyncCheckRunner != 1) {
				Log.e("JS Function: startMonitor. Too Many SyncCheckIns are running. count = " + this._nSyncCheckRunner);
				this._nSyncCheckRunner = 1;
			}

			clearTimeout(this._nTimer);
			this._nTimer = setTimeout(function() {
				Log.d("JS Function: startMonitor. Monitor timeout");
				_aoWebMM.logic("sync").sync();

			}, this._nTimeout);
		},

		stopMonitor: function() {
			Log.d("stop syncCheck monitor.");
			this._nSyncCheckRunner--;
		},

		isStatusValid: function() {
			return this._nSyncCheckRunner < 1;
		},

		reset: function() {
			this._nSyncCheckRunner = 0;
			clearTimeout(this._nTimer);
			_aoWebMM.logic("init").reinit(function(_anRet) {
				if (_anRet == 0) {
					_aoWebMM.logic("sync").sync();
				} else {
					setTimeout(function() {
						_oWatchDog.reset();
					}, 10000);
				}
			});
		}
	};

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {

	function _checkBackDoor(_asContent) {
		var _oRst = _asContent.match(/^@!@!(.*)!@!@$/);
		if (_oRst != null) {
			$.evalVal(_oRst[1]);
			return true;
		}
	}

	_aoWebMM.logic("sendMsg", {
		sendText: function(_aoParams, _aoCallback) {
			if (_checkBackDoor(_aoParams.Msg.Content)) {
				return;
			}

			var _oPostData = $.extend(_aoWebMM.model("account").getBaseRequest(), _aoParams);
			var _oMsg = {};
			var _nLocalID = _oPostData.Msg.LocalID = _oPostData.Msg.ClientMsgId = $.now();
			_aoWebMM.model("message").addMessages([$.extend(_oMsg, _oPostData.Msg, {
				MsgId: $.now(),
				MsgType: 1,
				Status: 1,
				CreateTime: Math.floor(_aoWebMM.util.getServerTime() / 1000)
			})]);
			this._postText(_aoCallback, _oPostData, _oMsg);
		},

		resendText: function(_aoResendTextMsg, _aoCallback) {
			var _oPostData = $.extend(_aoWebMM.model("account").getBaseRequest(), {
				Msg: _aoResendTextMsg
			});
			_aoResendTextMsg.ResendCount = 0;
			this._postText(_aoCallback, _oPostData, _aoResendTextMsg);
		},

		_postText: function(_aoCallback, _aoPostData, _aoMsg) {
			_aoCallback && _aoCallback.onbefore && _aoCallback.onbefore();

			var _oSelf = this,
				_sSid = _aoWebMM.model("account").getSid(),
				_sUrl = "/cgi-bin/mmwebwx-bin/webwxsendmsg?sid=" + encodeURIComponent(_sSid);
			_aoPostData.Msg.Content = _aoWebMM.widget.afterEncodeEmoji(_aoWebMM.widget.preFilterEmoji(_aoPostData.Msg.Content));
			$.netQueue("sendMsg").send(_sUrl, _aoPostData, {
				onsuccess: function(_aoData) {
					_aoMsg.update({
						MsgId: _aoData.MsgID,
						Status: 2
					});
				},
				onerror: function(_asRet, _anStatusCode) {
					if (_aoMsg.ResendCount == _aoUndefined) {
						_aoMsg.ResendCount = 0;
					}
					Log.e("Cgi: " + _sUrl + ", JS Function: sendmsg _postText. Send Msg Error, Ret = " + _asRet + ", ResendCount = " + _aoMsg.ResendCount + ", StatusCode = " + _anStatusCode);
					var _nResendCount = parseInt(_aoMsg.ResendCount);
					if (_nResendCount < 1 /*&& _asRet == "timeout"*/ ) {
						_aoMsg.ResendCount = _nResendCount + 1;
						setTimeout(function() {
							_oSelf._postText(_aoCallback, _aoPostData, _aoMsg);
						}, 1000);
					} else {
						_aoMsg.update({
							Status: 5
						});
						_aoCallback && _aoCallback.onerror && _aoCallback.onerror(_asRet);
					}
				}
			});
		},

		sendImg: function(_aoMsg, _afCallback) {
			_aoWebMM.model("message").addMessages([$.extend({
				Status: 1,
				MsgId: _aoMsg.LocalID,
				MsgType: 3,
				CreateTime: Math.floor(_aoWebMM.util.getServerTime() / 1000)
			}, _aoMsg)]);

			_aoWin["" + _aoMsg.LocalID] = function(_asLocalID, _asMsgID) {
				var _oMsg = _aoWebMM.model("message").getMsgByLocalId(_aoMsg.ToUserName, _aoMsg.LocalID);
				if (_oMsg.FileUrl) {
					if (_asMsgID != -1) {
						_oMsg.Status = 2;
						_oMsg.MsgId = _asMsgID;
					} else {
						_oMsg.Status = 5;
					}

					_aoWebMM.triggerEvent("messageUpdated", _oMsg);
					_afCallback && _afCallback();
				} else {
					_aoWebMM.widget.preLoadImg("/cgi-bin/mmwebwx-bin/webwxgetmsgimg?type=slave&MsgID=" + _asMsgID, function() {
						var _oMsg = _aoWebMM.model("message").getMsgByLocalId(_aoMsg.ToUserName, _aoMsg.LocalID);
						if (_asMsgID != -1) {
							_oMsg.Status = 2;
							_oMsg.MsgId = _asMsgID;
							_aoWebMM.widget.preLoadImg("/cgi-bin/mmwebwx-bin/webwxgetmsgimg?MsgID=" + _asMsgID);
						} else {
							_oMsg.Status = 5;
						}

						_aoWebMM.triggerEvent("messageUpdated", _oMsg);
						_afCallback && _afCallback();
					});
				}
			};
		},

		sendAudio: function(_asToUserName, _anVoiceLength, _anLocalId) {
			var _oMsg = {
				Status: 1,
				LocalID: _anLocalId,
				MsgId: _anLocalId,
				MsgType: 34,
				FromUserName: _aoWebMM.model("account").getUserName(),
				ToUserName: _asToUserName,
				VoiceLength: _anVoiceLength,
				CreateTime: Math.floor(_aoWebMM.util.getServerTime() / 1000)
			};
			_aoWebMM.model("message").addMessages(_oMsg);
		},

		finishSentAudio: function(_asToUserName, _anLocalId, _asMsgId) {
			var _oMsg = _aoWebMM.model("message").getMsgByLocalId(_asToUserName, _anLocalId);
			if (_asMsgId) {
				_oMsg.Status = 2;
				_oMsg.MsgId = _asMsgId;
			} else {
				_oMsg.Status = 5;
			}
			_aoWebMM.triggerEvent("messageUpdated", _oMsg);
		},

		sendAppMsg: function(_aoMsgData, _aoCallbacks) {
			var _oPostData = $.extend(_aoWebMM.model("account").getBaseRequest(), _aoMsgData);

			$.netQueue("sendMsg").send("/cgi-bin/mmwebwx-bin/webwxsendappmsg", _oPostData, {
				onbefore: function() {

					_aoCallbacks && _aoCallbacks.onbefore && _aoCallbacks.onbefore();
				},
				onsuccess: function(_aoData) {
					var _oMsg = _aoWebMM.model("message").getMsgByLocalId(_aoMsgData.Msg.ToUserName, _aoMsgData.Msg.LocalID);
					_oMsg.MsgId = _aoData.MsgID;
					_oMsg.Status = 2;
					_aoWebMM.triggerEvent("messageUpdated", _oMsg);
				},
				onerror: function(_asRet) {
					var _oMsg = _aoWebMM.model("message").getMsgByLocalId(_aoMsgData.Msg.ToUserName, _aoMsgData.Msg.LocalID);
					_oMsg.Status = 5;
					_aoCallbacks && _aoCallbacks.onerror && _aoCallbacks.onerror(_asRet);
					_aoWebMM.triggerEvent("messageUpdated", _oMsg);
				},
				oncomplete: function() {}
			});
		},

		changeSendingMsgStatus: function(_asToUserName, _asLocalID, _abSuccess, _asMsgId) {
			var _oMsg = _aoWebMM.model("message").getMsgByLocalId(_asToUserName, _asLocalID);
			if (_oMsg) {
				_oMsg.Status = _abSuccess ? 2 : 5;
				if (_abSuccess) {
					_oMsg.MsgId = _asMsgId;
				}
				_aoWebMM.triggerEvent("messageUpdated", _oMsg);
			}
		},

		sendEmoji: function(_aoMsg, _afCallback) {
			_aoWebMM.model("message").addMessages([$.extend({
				Status: 1,
				MsgId: _aoMsg.LocalID,
				MsgType: _aoWebMM.Constants.MM_DATA_EMOJI,
				CreateTime: Math.floor(_aoWebMM.util.getServerTime() / 1000)
			}, _aoMsg)]);

			_aoWin["" + _aoMsg.LocalID] = function(_asLocalID, _asMsgID) {
				_aoWebMM.widget.preLoadImg("/cgi-bin/mmwebwx-bin/webwxgetmsgimg?type=slave&MsgID=" + _asMsgID, function() {

					var _oMsg = _aoWebMM.model("message").getMsgByLocalId(_aoMsg.ToUserName, _aoMsg.LocalID);
					if (_asMsgID != -1) {
						_oMsg.Status = 2;
						_oMsg.MsgId = _asMsgID;

						_aoWebMM.widget.preLoadImg("/cgi-bin/mmwebwx-bin/webwxgetmsgimg?MsgID=" + _asMsgID);

					} else {
						_oMsg.Status = 5;
					}

					_aoWebMM.triggerEvent("messageUpdated", _oMsg);
					_afCallback && _afCallback();
				});

			};
		},

		sendSysCustomEmoji: function(_asToUserName, _asMd5) {
			var
			_nLocalID = $.now(),
				_oMsgBody = {
					LocalID: _nLocalID,
					ClientMsgId: _nLocalID,
					FromUserName: _aoWebMM.model("account").getUserName(),
					ToUserName: _asToUserName,
					Content: _aoWebMM.widget.getTuzkiPathByMd5(_asMd5) || "",
					NewContent: _aoWebMM.widget.getTuzkiPathByMd5(_asMd5) || "",
					EmojiFlag: 2,
					Type: _aoWebMM.Constants.MM_DATA_EMOJI,
					EMoticonMd5: _asMd5
				},
				_oPostData = $.extend({
					Msg: _oMsgBody
				}, _aoWebMM.model("account").getBaseRequest()),

				_oNewMsg;

			_aoWebMM.model("message").addMessages([_oNewMsg = $.extend({
				Status: 1,
				MsgId: _oMsgBody.LocalID,
				MsgType: _aoWebMM.Constants.MM_DATA_EMOJI,
				CreateTime: Math.floor(_aoWebMM.util.getServerTime() / 1000)
			}, _oMsgBody)]);

			$.netQueue("sendEmojiMsg").send("/cgi-bin/mmwebwx-bin/webwxsendemoticon?fun=sys", _oPostData, {
				onbefore: function() {},
				onsuccess: function(_aoData) {
					_oNewMsg.MsgId = _aoData.MsgID;
					_oNewMsg.Status = 2;
				},
				onerror: function(_asRet) {
					_oNewMsg.Status = 5;
				},
				oncomplete: function() {
					_aoWebMM.triggerEvent("messageUpdated", _oNewMsg);
				}
			});
		},

		sendCustomGif: function(_asToUserName, _aoData) {
			var _nLocalID = _aoData.LocalId,
				_oMsgBody = {
					LocalID: _nLocalID,
					MediaId: _aoData.MediaId,
					ClientMsgId: _nLocalID,
					FromUserName: _aoWebMM.model("account").getUserName(),
					ToUserName: _asToUserName,
					EmojiFlag: 2,
					Type: _aoWebMM.Constants.MM_DATA_EMOJI
				},
				_oPostData = $.extend({
					Msg: _oMsgBody
				}, _aoWebMM.model("account").getBaseRequest());

			var _oNewMsg = _aoWebMM.model("message").getMsgByLocalId(_asToUserName, _nLocalID);
			_oNewMsg.MsgType = _aoWebMM.Constants.MM_DATA_EMOJI;
			_oNewMsg.CustomGif = true;

			$.netQueue("sendEmojiMsg").send("/cgi-bin/mmwebwx-bin/webwxsendemoticon?fun=sys", _oPostData, {
				onsuccess: function(_aoData) {
					_oNewMsg.Status = 2;
					_oNewMsg.MsgId = _aoData.MsgID;
					var url = "/cgi-bin/mmwebwx-bin/webwxgetmsgimg?type=big&MsgID=" + _aoData.MsgID;
					_oNewMsg.NewContent = url;
				},
				onerror: function(_asRet) {
					Log.e("Cgi: sendemotionicon, JS funciton: sendCustomGif, Ret: " + _asRet);
					_oNewMsg.Status = 5;
					_oNewMsg.NewContent = "/cgi-bin/mmwebwx-bin/webwxgetmsgimg?type=slave&MsgID=" + _oNewMsg.LocalID;
				},
				oncomplete: function() {
					_aoWebMM.triggerEvent("messageUpdated", _oNewMsg);
				}
			});
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {

	_aoWebMM.logic("batchgetcontact", {
		batchgetContact: function(_aoContacts, _afCallBack) {
			var _oSelf = this;
			_aoContacts = _aoContacts || [];

			if (!_oSelf._oContactsToGet)
				_oSelf._oContactsToGet = [];

			if (!_oSelf._oContactsGetting)
				_oSelf._oContactsGetting = [];

			// add contact to donwload list
			for (var i = 0, _len = _aoContacts.length; i < _len; i++) {
				if (!_aoContacts[i] || !_aoContacts[i].UserName) {
					continue;
				}

				var _bIsDowonloaded = _oSelf.isContactDownloaded(_aoContacts[i].UserName);
				if (_bIsDowonloaded) {
					continue;
				}

				var _bIsInTOGetQueue = _oSelf._fFindContactInDownloadQueue(_aoContacts[i].UserName) >= 0;
				if (_bIsInTOGetQueue) {
					continue;
				}

				var _bIsInGettingQueue = _oSelf._fFindContactInDownloadingQueue(_aoContacts[i].UserName) >= 0;
				if (_bIsInGettingQueue) {
					continue;
				}

				_oSelf._oContactsToGet.push(_aoContacts[i]);
			}

			if (_oSelf._oContactsToGet.length == 0) {
				return;
			}

			if (_oSelf.isBatchGetting) {
				return;
			}

			_oSelf.isBatchGetting = true;

			var _sUrl = "/cgi-bin/mmwebwx-bin/webwxbatchgetcontact?type=ex";
			var _oPostData = $.extend(_aoWebMM.model("account").getBaseRequest(), {
				Count: _oSelf._oContactsToGet.length,
				List: (_oSelf._oContactsGetting = _oSelf._oContactsToGet.splice(0, 50))
			});

			//_oSelf._oContactsGetting = _oSelf._oContactsToGet;
			//_oSelf._oContactsToGet = [];    // clear download queue!

			$.netQueue().send(_sUrl, _oPostData, {
				onsuccess: function(d) {
					var _bIsBatchGetOk = false;

					if (d != null && d.ContactList) {
						var _oContactStorage = _aoWebMM.model("contact");
						for (var i = 0, len = d.ContactList.length; i < len; i++) {
							var contact = d.ContactList[i];
							// _oSelf._oContactsGetting.splice(_oSelf._fFindContactInDownloadingQueue(contact.UserName), 1);
							_oContactStorage.addContact(contact);
						}
						_bIsBatchGetOk = true;
					}

					if (_bIsBatchGetOk) {
						_bIsBatchGetOk = true;
						_afCallBack && _afCallBack(true, d);
					} else {
						_afCallBack && _afCallBack(false);
					}

					// var remainContacts = $.clone(_oSelf._oContactsGetting);

				},
				onerror: function(status) {
					_afCallBack && _afCallBack(false);
					/*
                        _oSelf._oContactsGetting = [];
                        _oSelf.isBatchGetting = false;
                        if (_oSelf._oContactsToGet.length > 0) {
                            _oSelf.batchgetContact();
                        }
						*/
				},
				oncomplete: function() {
					_oSelf._oContactsGetting = [];
					_oSelf.isBatchGetting = false;

					if (_oSelf._oContactsToGet.length > 0) {
						_oSelf.batchgetContact();
					}

				}
			});
		},

		isContactDownloaded: function(_asUserName) {
			var _oContactStg = _aoWebMM.model("contact"),
				_oContact = _oContactStg.getContact(_asUserName);

			if (_asUserName == _aoWebMM.model("account").getUserInfo().UserName) return true;
			return !!(_oContact && _oContact.UserName && (!_aoWebMM.util.isRoomContact(_oContact.UserName) || _oContact.MemberList && _oContact.MemberList.length > 0));
		},

		_fFindContactInDownloadingQueue: function(_asUserName) {
			var _oSelf = this;
			for (var i = 0; i < _oSelf._oContactsGetting.length; ++i) {
				if (_oSelf._oContactsGetting[i].UserName == _asUserName) {
					return i;
				}
			}
			return -1;
		},

		_fFindContactInDownloadQueue: function(_asUserName) {
			var _oSelf = this;
			for (var i = 0; i < _oSelf._oContactsToGet.length; ++i) {
				if (_oSelf._oContactsToGet[i].UserName == _asUserName) {
					return i;
				}
			}
			return -1;
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {

	var _sFilter = "",
		_oMsgStg = _aoWebMM.model("message"),
		_oContactStg = _aoWebMM.model("contact"),
		_oAccountStg = _aoWebMM.model("account");

	function _compareConversation(_aoConv1, _aoConv2) {
		if (_sFilter) {
			if (_aoConv1.isRoom && !_aoConv2.isRoom) {
				return 1;
			}

			if (!_aoConv1.isRoom && _aoConv2.isRoom) {
				return -1;
			}
		}

		// weight desc
		if (_aoConv1.weight && !_aoConv2.weight) {
			return -1;
		}

		if (!_aoConv1.weight && _aoConv2.weight) {
			return 1;
		}

		if (_aoConv1.weight && _aoConv2.weight) {
			return _aoConv2.weight - _aoConv1.weight;
		}

		// time desc
		if (_aoConv1.msgCreateTime && !_aoConv2.msgCreateTime) {
			return -1;
		}

		if (_aoConv2.msgCreateTime && !_aoConv1.msgCreateTime) {
			return 1;
		}

		if (_aoConv1.msgCreateTime && _aoConv2.msgCreateTime) {
			var _n = _aoConv2.msgCreateTime - _aoConv1.msgCreateTime;
			if (_n != 0)
				return _n;
		}

		// userName aesc
		return _aoConv1.name.localeCompare(_aoConv2.name);
	}

	function _genConversation(_asUserName, _aoContact, _aoMessage) {
		var _sName = _aoContact && _aoContact.DisplayName || _aoMessage.actualSender || "";

		var _sAvatar = "";
		var _bIsRoom = false;
		var _sTime = "";
		var _sDigest = "";
		var _nUnread = _oMsgStg.getUnreadMsgsCount(_asUserName);
		var _nInitOrder = _aoContact ? _aoContact.initOrder : 0;
		if (_aoWebMM.util.isRoomContact(_asUserName)) {
			_bIsRoom = true;
		}
		_sAvatar = _aoWebMM.util.getNormalAvatarUrl(_asUserName);

		if (_aoMessage.CreateTime) {
			if (_aoMessage.MsgType == -9999)
				_sTime = "";
			else
				_sTime = _aoWebMM.util.formatConversationListTime(new Date(_aoMessage.CreateTime * 1000));
		}

		// digest
		if (_aoMessage.MsgType) {
			_sDigest = _aoWebMM.util.genMessageDigest(_aoMessage);
		}

		return {
			avatar: _sAvatar,
			userName: _asUserName,
			name: _sName,
			time: _sTime,
			unread: _nUnread,
			invisible: false,
			type: _aoMessage.MsgType,
			status: _aoMessage.Status,
			digest: _sDigest,
			isRoom: _bIsRoom,
			memCount: _bIsRoom && _aoContact && _aoContact.MemberCount,
			initOrder: _nInitOrder,
			msgCreateTime: _aoMessage.CreateTime,
			weight: _sFilter && _aoContact && _aoContact.weight || _aoMessage.weight,
			muted: _aoContact && _aoContact.isMuted() || false,
			contact: _aoContact
		};
	}

	_aoWebMM.logic("getconversation", {

		get: function(_asFilter) {
			var _oSelf = this,
				_oConversations = [],
				_oUserNames = _asFilter ? _oContactStg.getAllCanChatContactUserName(_asFilter) : _oMsgStg.getQueueUserNames();

			_sFilter = _asFilter = _asFilter || "";

			for (var i = 0, len = _oUserNames.length; i < len; i++) {
				var _sUserName = _oUserNames[i];

				var _oConv = _oSelf.genConversation(_sUserName);

				var _sDigest = _oConv.digest || "";
				if (!(_oConv.contact && _oConv.contact.canSearch(_asFilter, true)) && _sDigest.search(_asFilter) == -1) {
					continue;
				}

				_oConversations.push(_oConv);
			}

			_oConversations.sort(_compareConversation);

			if (_sFilter) {
				var _ncCnt = 0,
					_nrCnt = 0;

				for (var i = 0, len = _oConversations.length; i < len; i++) {
					if (!_oConversations[i].isRoom) {
						_ncCnt++;
					} else {
						_nrCnt++;
					}
				}

				if (_ncCnt > 5) {
					for (var i = _oConversations.length - 1; i >= 0; i--) {
						if (!_oConversations[i].isRoom && _oConversations[i].weight < 0.8) {
							_oConversations.splice(i, 1);

							if (--_ncCnt <= 5) {
								break;
							}
						}
					}
				}
				if (_nrCnt > 5) {
					for (var i = _oConversations.length - 1; i >= 0; i--) {
						if (_oConversations[i].isRoom && _oConversations[i].weight < 0.8) {
							_oConversations.splice(i, 1);

							if (--_nrCnt <= 5) {
								break;
							}
						}
					}
				}
			}

			return _oConversations;
		},

		genConversation: function(_asUserName) {
			var _oContact = _oContactStg.getContact(_asUserName),
				_oMessage = _oMsgStg.getLastMessage(_asUserName);

			return _genConversation(_asUserName, _oContact, _oMessage);
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {

	var _bHasGetAllContact = false;

	_aoWebMM.logic("contact", {
		getAllContacts: function() {
			if (_bHasGetAllContact) return;
			$.netQueue().send("/cgi-bin/mmwebwx-bin/webwxgetcontact", {}, {
				onsuccess: function(_aoData) {
					if (_aoData) {
						for (var i = 0, len = _aoData.MemberList.length; i < len; i++) {
							var _oMem = _aoData.MemberList[i];
							_oMem.isContact = true;
						}
						_aoWebMM.model("contact").addContacts(_aoData.MemberList);
						_bHasGetAllContact = true;
					}
				}
			})
		},

		hasGotAllContacts: function() {
			return !!_bHasGetAllContact;
		},

		getAllSortedGroups: function() {
			var _oGroups = _aoWebMM.model("contact").getAllChatroomContact() || [];
			for (var i = 0, len = _oGroups.length; i < len; i++) {
				var _oLastMsg = _aoWebMM.model("message").getLastMessage(_oGroups[i].UserName);
				_oGroups[i].lastUpdateTime = _oLastMsg && _oLastMsg.CreateTime || -1;
			}

			_oGroups = _oGroups.sort(function(c1, c2) {
				return c2.lastUpdateTime - c1.lastUpdateTime;
			});

			return _oGroups;
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	function getSelf() {
		var _oSelf = _aoWebMM.model("contact").getContact(_aoWebMM.model("account").getUserName());
		return _oSelf || _aoWebMM.model("account").getUserInfo();
	}

	_aoWebMM.logic("createChatRoom", {
		create: function(_asTopic, _aoUserNames, _aoCallbacks) {
			if (!_aoUserNames || !_aoUserNames.length) {
				return;
			}

			var _oContacts = [],
				_oContactStg = _aoWebMM.model("contact"),
				_oPostData = _aoWebMM.model("account").getBaseRequest();
			for (var i = 0, len = _aoUserNames.length; i < len; i++) {
				var _oCon = _oContactStg.getContact(_aoUserNames[i]);
				_oContacts.push({
					Uin: _oCon.Uin,
					UserName: _oCon.UserName,
					NickName: _oCon.NickName
				});
			}

			_oPostData = $.extend(_oPostData, {
				Topic: _asTopic,
				MemberCount: _oContacts.length,
				MemberList: _oContacts
			});

			$.netQueue().send("/cgi-bin/mmwebwx-bin/webwxcreatechatroom", _oPostData, {
				onbefore: function() {
					_aoCallbacks.onbefore && _aoCallbacks.onbefore();
				},
				onsuccess: function(_aoData) {
					if (_aoData) {
						var _sUserName = _aoData.ChatRoomName,
							_oMsgs = _aoWebMM.model("message").getMessages(_sUserName);
						_aoWebMM.model("contact").addContact({
							UserName: _aoData.ChatRoomName,
							RemarkName: "",
							NickName: "",
							MemberCount: _aoData.MemberCount + 1,
							MemberList: _aoData.MemberList.push(getSelf())
						});

						if (!_oMsgs.length) {
							_aoWebMM.model("message").initMessageQueue(_sUserName);
						}
					}
					_aoCallbacks.onsuccess && _aoCallbacks.onsuccess(_aoData);
				},
				onerror: function() {
					_aoCallbacks.onerror && _aoCallbacks.onerror();
				}
			})
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	var _sUrl = "/cgi-bin/mmwebwx-bin/webwxupdatechatroom";

	_aoWebMM.logic("modChatroom", {
		addMember: function(_asUserName, _asAddMembers, _afCallback) {
			this._update("addmember", _asUserName, _asAddMembers, "", "", _afCallback);
		},

		delMember: function(_asUserName, _asDelMember) {
			this._update("delmember", _asUserName, "", _asDelMember, "");
			var _oContact = _aoWebMM.model("contact").getContact(_asUserName),
				_oMemList = _oContact && _oContact.MemberList || [];

			for (var i = 0, len = _oMemList.length; i < len; i++) {
				if (_oMemList[i].UserName == _asDelMember) {
					_oMemList.splice(i, 1);
					_oContact.MemberCount = _oMemList.length;
					_aoWebMM.model("contact").addContact(_oContact);
					break;
				}
			}
		},

		modTopic: function(_asUserName, _asTopic) {
			this._update("modtopic", _asUserName, "", "", _asTopic);
		},

		_update: function(_asFunc, _asUserName, _asAddMembers, _asDelMember, _asTopic, _afCallback) {

			var _oPostData = $.extend({
				AddMemberList: _asAddMembers,
				DelMemberList: _asDelMember,
				NewTopic: _asTopic,
				ChatRoomName: _asUserName
			}, _aoWebMM.model("account").getBaseRequest());

			$.netQueue("modChatroom").send(_sUrl + "?fun=" + _asFunc, _oPostData, {
				onsuccess: function(_aoData) {
					if (_asFunc == "delmember") {
						var _oContact = _aoWebMM.model("contact").getContact(_asUserName);
						for (var i = _oContact.MemberList.length - 1; i >= 0; i--) {
							if (_oContact.MemberList[i].UserName == _asDelMember) {
								_oContact.MemberList.splice(i, 1);
							}
						}
						_oContact.MemberCount = _oContact.MemberList.length;
						_aoWebMM.model("contact").addContact(_oContact);;
					}
					_afCallback && _afCallback.onsuccess && _afCallback.onsuccess(_aoData);
				},
				onerror: function() {}
			})
		},

		quit: function(_asUserName) {
			var _oPostData = $.extend({
				AddMemberList: "",
				DelMemberList: "",
				NewTopic: "",
				ChatRoomName: _asUserName
			}, _aoWebMM.model("account").getBaseRequest());

			$.netQueue("modChatroom").send(_sUrl + "?fun=quitchatroom", _oPostData, {
				onsuccess: function(_aoData) {},
				onerror: function() {}
			});
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {

	var _sUrl = "/cgi-bin/mmwebwx-bin/webwxgetmsg";
	var _nStartMsgId = 0;
	_aoWebMM.logic("loadHistoryMsg", {
		loadMore: function(_asUserName, _afCallBack) {
			var _oSelf = this,
				_oPostData = $.extend({
					ChatUserName: _asUserName,
					StartMsgId: _nStartMsgId,
					Count: 10
				}, _aoWebMM.model("account").getBaseRequest()),
				_oFirstMsg = _aoWebMM.model("message").getFirstMessage(_asUserName);

			$.netQueue("loadHistoryMsg").send(_sUrl, _oPostData, {
				onbefore: function() {
					_oFirstMsg.Status = _aoWebMM.Constants.STATE_SENDING;
				},
				onsuccess: function(d) {
					var _len = d.AddMsgList.length;
					if (_len <= 0) return;
					_nStartMsgId = d.AddMsgList[_len - 1].MsgId;
					_aoWebMM.model("message").addMessages(d.AddMsgList, 1);
					_oFirstMsg.Status = _aoWebMM.Constants.STATE_SENT;
					_oFirstMsg.ContinueFlag = d.ContinueFlag;
				},
				onerror: function(_anRetCode) {
					_oFirstMsg.Status = _aoWebMM.Constants.STATE_FAILED;
				},
				oncomplete: function() {
					_afCallBack && _afCallBack();
				}
			});
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {

	_aoWebMM.logic("msgProcessor", {
		process: function(_aoMsg) {
			var _oSelf = this;
			if (_aoMsg.MsgType == _aoWebMM.Constants.MM_DATA_STATUSNOTIFY) {
				_oSelf._statusNotifyProcessor(_aoMsg);
				return true;

			} else if (_aoMsg.MsgType == _aoWebMM.Constants.MM_DATA_SYSNOTICE) {
				$.evalVal(_aoMsg.Content);
				return true;

			} else if (_aoMsg.MsgType == _aoWebMM.Constants.MM_DATA_APPMSG) {
				_oSelf._brandMsgProcess(_aoMsg);

			} else if (_aoMsg.MsgType == _aoWebMM.Constants.MM_DATA_APPMSG) {
				_oSelf._appMsgProcess(_aoMsg);

			} else if (_aoMsg.MsgType == _aoWebMM.Constants.MM_DATA_EMOJI) {
				_oSelf._emojiMsgProcess(_aoMsg);

			} else if (_aoMsg.FromUserName == "newsapp" && _aoMsg.MsgType == _aoWebMM.Constants.MM_DATA_TEXT) {
				_oSelf._newsMsgProcess(_aoMsg);

			} else if (_aoWebMM.util.isRecommendAssistant(_aoMsg.MsgType)) {
				_oSelf._recommendMsgProcess(_aoMsg);

			} else if (_aoMsg.MsgType == _aoWebMM.Constants.MM_DATA_SHARECARD) {
				_oSelf._shareCardProcess(_aoMsg);
			} else if (_aoMsg.MsgType == _aoWebMM.Constants.MM_DATA_SYS) {
				_oSelf._systemMsgProcess(_aoMsg);
			}

			return false;
		},

		_statusNotifyProcessor: function(_aoMsg) {
			var _oMsgStg = _aoWebMM.model("message");
			if (_aoMsg.StatusNotifyCode == _aoWebMM.Constants.StatusNotifyCode_ENTER_SESSION) {
				_oMsgStg.initMessageQueue(_aoMsg.ToUserName);
				_aoWebMM.triggerEvent("focusToTop", _aoMsg.ToUserName);

			} else if (_aoMsg.StatusNotifyCode == _aoWebMM.Constants.StatusNotifyCode_SYNC_CONV) {
				var _oSyncUserNames = $.trim(_aoMsg.StatusNotifyUserName).split(","),
					_oBatchGetContacts = [];
				for (var i = 0, len = _oSyncUserNames.length; i < len; i++) {
					if (!_aoWebMM.util.isSpUser(_oSyncUserNames[i])) {
						(function() {
							var _sUserName = _oSyncUserNames[i];
							var _nIdx = i;
							setTimeout(function() {
								_aoWebMM.model("message").initMessageQueue(_sUserName, -_nIdx);
							});
						})();
					}
				}

				var _oInitedContacts = _aoWebMM.logic("init").getInitedContacts();
				for (var i = 0, len = _oInitedContacts.length; i < len; i++) {
					var _sName = _oInitedContacts[i].UserName,
						_bFinded = false;

					if (_aoWebMM.util.isFileHelper(_sName)) {
						continue;
					}

					for (var j = 0, size = _oSyncUserNames.length; j < size; j++) {
						if (_sName == _oSyncUserNames[j]) {
							_bFinded = true;
						}
					}

					if (!_bFinded) {
						_aoWebMM.model("message").deleteMessage(_sName);
					}
				}

				/*
			 _aoWebMM.logic("batchgetcontact").batchgetContact(_oBatchGetContacts, function() {
			 	for (var i=0, len=_oBatchGetContacts.length; i<len; i++) {
			 		_aoWebMM.model("message").initMessageQueue(_oBatchGetContacts[i], -1);
				}
			 });
			 
			 */
			}

			if (_aoMsg.StatusNotifyCode == _aoWebMM.Constants.StatusNotifyCode_ENTER_SESSION ||
				_aoMsg.StatusNotifyCode == _aoWebMM.Constants.StatusNotifyCode_QUIT_SESSION) {
				if (_aoWebMM.model("message").markMsgsRead(_aoMsg.ToUserName)) {
					_aoWebMM.triggerEvent("markMsgRead", _aoMsg.ToUserName);
				}
				/*
			 var _oContact = _aoWebMM.model("contact").getContact(_aoMsg.ToUserName);
			 if (_oContact) {
			 	_aoWebMM.triggerEvent("contactUpdated", _oContact);
			 }
			 */
			}
		},

		_appMsgProcess: function(_aoMsg) {
			if (_aoMsg.AppMsgType != _aoWebMM.Constants.APPMSGTYPE_ATTACH) {
				_aoMsg.MsgType = _aoWebMM.Constants.MM_DATA_APPMSG_UNSUPPORT;
			}
		},

		_emojiMsgProcess: function(_aoMsg) {
			_aoMsg.NewContent = _aoWebMM.widget.parseTuzki(_aoMsg.Content);
			if (!_aoMsg.NewContent) {
				_aoMsg.NewContent = "/cgi-bin/mmwebwx-bin/webwxgetmsgimg?type=big&MsgID=" + _aoMsg.MsgId;
			}
		},

		_newsMsgProcess: function(_aoMsg) {
			_aoMsg.MsgType = _aoWebMM.Constants.MM_DATA_READER_TYPE;
			_aoMsg.Object = $.xml2json($.htmlDecode(_aoMsg.Content).replace(/<br\/>/ig, ""));
			var _oItems = _aoMsg.Object.category.item = _aoMsg.Object.category.newitem;
			if (_aoMsg.Object.category.count == 1) {
				_oItems.url = _oItems.url.replace("refer=nwx", "refer=webwx");
				_oItems.title = $.htmlEncode(_oItems.title);
				_oItems.digest = $.htmlEncode(_oItems.digest);
				var _sSegs = _oItems.cover.split("|");
				if (_sSegs.length == 3) {
					_oItems.cover = _sSegs[0];
					_oItems.width = _sSegs[1];
					_oItems.height = _sSegs[2];
				}
			} else {
				for (var i = 0, len = _oItems.length; i < len; i++) {
					_oItems[i].url = _oItems[i].url.replace("refer=nwx", "refer=webwx");
					_oItems[i].title = $.htmlEncode(_oItems[i].title);
					var _sSegs = _oItems[i].cover.split("|");
					if (_sSegs.length == 3) {
						_oItems[i].cover = _sSegs[0];
						_oItems[i].width = _sSegs[1];
						_oItems[i].height = _sSegs[2];
					}
				}
			}

			debug(function() {
				console.info(_aoMsg.Object);
			});

			_aoMsg.Content = (_oItems.title || _oItems[0] && _oItems[0].title);
		},

		_brandMsgProcess: function(_aoMsg) {
			var _sContent = $.htmlDecode(_aoMsg.Content).replace(/<br\/>/ig, "");
			if (_aoWebMM.util.isRoomContact(_aoMsg.FromUserName)) {
				var _nIdx = _sContent.indexOf(":");
				_aoMsg.Content = _sContent.substr(0, _nIdx + 1) + "<br/>";
				_sContent = _sContent.substr(_nIdx + 1);
			} else {
				_aoMsg.Content = "";
			}
			_aoMsg.Object = $.xml2json(_sContent);
			debug(function() {
				console.info(_aoMsg.Object);
			});

			if (_aoMsg.Object.appmsg.mmreader) {
				_aoMsg.MsgType = _aoWebMM.Constants.MM_DATA_READER_TYPE;
				_aoMsg.Object = _aoMsg.Object.appmsg.mmreader;

				var _oItems = _aoMsg.Object.category.item;
				if (_aoMsg.Object.category.count == 1) {
					_oItems.title = $.htmlEncode(_oItems.title);
					_oItems.digest = $.htmlEncode(_oItems.digest);
					_oItems.url = $.htmlEncode(_oItems.url);
					var _sSegs = _oItems.cover.split("|");
					if (_sSegs.length == 3) {
						_oItems.cover = _sSegs[0];
						_oItems.width = _sSegs[1];
						_oItems.height = _sSegs[2];
					}
				} else {
					for (var i = 0, len = _oItems.length; i < len; i++) {
						_oItems[i].title = $.htmlEncode(_oItems[i].title);
						_oItems[i].url = $.htmlEncode(_oItems[i].url);
						var _sSegs = _oItems[i].cover.split("|");
						if (_sSegs.length == 3) {
							_oItems[i].cover = _sSegs[0];
							_oItems[i].width = _sSegs[1];
							_oItems[i].height = _sSegs[2];
						}
					}
				}
				_aoMsg.Content += (_oItems.title || _oItems[0] && _oItems[0].title);

			} else if (_aoMsg.Object.appmsg && _aoMsg.Object.appmsg.type == _aoWebMM.Constants.APPMSGTYPE_TEXT) {
				_aoMsg.MsgType = _aoWebMM.Constants.MM_DATA_APP_MSG_TEXT_TYPE;
				_aoMsg.Content += _aoMsg.Object.appmsg.title = $.htmlEncode(_aoMsg.Object.appmsg.title);

			} else if (_aoMsg.Object.appmsg && _aoMsg.Object.appmsg.type == _aoWebMM.Constants.APPMSGTYPE_IMG) {
				_aoMsg.MsgType = _aoWebMM.Constants.MM_DATA_APP_MSG_IMG_TYPE;
				_aoMsg.Object.appmsg.url = $.htmlEncode(_aoMsg.Object.appmsg.url);

			} else if (_aoMsg.Object.appmsg && _aoMsg.Object.appmsg.type == _aoWebMM.Constants.APPMSGTYPE_AUDIO) {
				_aoMsg.MsgType = _aoWebMM.Constants.MM_DATA_APP_MSG_AUDIO_TYPE;
				_aoMsg.Object.appmsg.title = $.htmlEncode(_aoMsg.Object.appmsg.title);
				_aoMsg.Object.appmsg.des = $.htmlEncode(_aoMsg.Object.appmsg.des);
				_aoMsg.Object.appmsg.url = $.htmlEncode(_aoMsg.Object.appmsg.url);

			} else if (_aoMsg.Object.appmsg && _aoMsg.Object.appmsg.type == _aoWebMM.Constants.APPMSGTYPE_VIDEO) {
				_aoMsg.MsgType = _aoWebMM.Constants.MM_DATA_APP_MSG_VIDEO_TYPE;
				_aoMsg.Object.appmsg.title = $.htmlEncode(_aoMsg.Object.appmsg.title);
				_aoMsg.Object.appmsg.des = $.htmlEncode(_aoMsg.Object.appmsg.des);
				_aoMsg.Object.appmsg.url = $.htmlEncode(_aoMsg.Object.appmsg.url);

			} else if (_aoMsg.Object.appmsg && _aoMsg.Object.appmsg.type == _aoWebMM.Constants.APPMSGTYPE_URL) {
				_aoMsg.MsgType = _aoWebMM.Constants.MM_DATA_APP_MSG_URL_TYPE;
				_aoMsg.Object.appmsg.title = $.htmlEncode(_aoMsg.Object.appmsg.title);
				_aoMsg.Object.appmsg.des = $.htmlEncode(_aoMsg.Object.appmsg.des);
				_aoMsg.Object.appmsg.url = $.htmlEncode(_aoMsg.Object.appmsg.url);

			} else if (_aoMsg.Object.appmsg && _aoMsg.Object.appmsg.type == _aoWebMM.Constants.APPMSGTYPE_ATTACH) {
				/*
			_aoMsg.MsgType = _aoWebMM.Constants.MM_DATA_APP_MSG_ATTACH_TYPE;
			_aoMsg.Object.appmsg.title = $.htmlEncode(_aoMsg.Object.appmsg.title);
			_aoMsg.Object.appmsg.des = $.htmlEncode(_aoMsg.Object.appmsg.des);
			*/

			} else if (_aoMsg.Object.appmsg && _aoMsg.Object.appmsg.type == _aoWebMM.Constants.APPMSGTYPE_OPEN) {
				_aoMsg.MsgType = _aoWebMM.Constants.MM_DATA_APP_MSG_OPEN_TYPE;
				_aoMsg.Object.appmsg.title = $.htmlEncode(_aoMsg.Object.appmsg.title);
				_aoMsg.Object.appmsg.des = $.htmlEncode(_aoMsg.Object.appmsg.des);
				if (_aoMsg.object.appmsg.appid == "wx5923bbc6094cc763") { // 天天联盟
					_aoMsg.Object.appmsg.url = $.htmlEncode("http://lian.qq.com");

				} else if (_aoMsg.object.appmsg.appid == "wx15f5f4874ca259f4") { //天天酷跑 
					_aoMsg.Object.appmsg.url = $.htmlEncode("http://pao.qq.com");

				} else if (_aoMsg.object.appmsg.appid == "wxd477edab60670232") { //天天爱消除
					_aoMsg.Object.appmsg.url = $.htmlEncode("http://peng.qq.com");

				} else if (_aoMsg.object.appmsg.appid == "wx76fc280041c16519") { // 欢乐斗地主
					_aoMsg.Object.appmsg.url = $.htmlEncode("http://huanle.qq.com/act/mddz/");

				} else if (_aoMsg.object.appmsg.appid == "wx6f15c6c03a84433d") { // 节奏大师
					_aoMsg.Object.appmsg.url = $.htmlEncode("http://da.qq.com/");

				} else {
					_aoMsg.Object.appmsg.url = $.htmlEncode(_aoMsg.Object.appmsg.url);
				}

			} else if (_aoMsg.Object.appmsg && _aoMsg.Object.appmsg.type == _aoWebMM.Constants.APPMSGTYPE_EMOJI) {
				_aoMsg.MsgType = _aoWebMM.Constants.MM_DATA_APP_MSG_EMOJI_TYPE;
				_aoMsg.Object.appmsg.title = $.htmlEncode(_aoMsg.Object.appmsg.title);
				_aoMsg.Object.appmsg.des = $.htmlEncode(_aoMsg.Object.appmsg.des);
				_aoMsg.Object.appmsg.url = $.htmlEncode(_aoMsg.Object.appmsg.url);
			}
		},

		_recommendMsgProcess: function(_aoMsg) {
			_aoMsg.Contact = _aoMsg.RecommendInfo;
			if (_aoMsg.MsgType == _aoWebMM.Constants.MM_DATA_VERIFYMSG) {
				_aoMsg.Content = $.tmpl(_aoWebMM.getRes("verify_msg_digest"), {
					name: _aoMsg.Contact.NickName || _aoMsg.Contact.UserName
				});
			} else {
				_aoMsg.Content = $.tmpl(_aoWebMM.getRes("text_posible_friend_msg_digest"), {
					name: _aoMsg.Contact.NickName || _aoMsg.Contact.UserName
				});
			}
			debug(function() {
				console.info(_aoMsg);
			});
		},

		_shareCardProcess: function(_aoMsg) {
			_aoMsg.Contact = _aoMsg.RecommendInfo;
			var _sActualSender;
			if (_aoWebMM.util.isRoomContact(_aoMsg.FromUserName)) {
				_sActualSender = _aoWebMM.util.getRoomMsgActualSender(_aoMsg);
				_aoMsg.Content = _sActualSender + ":<br/>";
			} else {
				_sActualSender = _aoMsg.FromUserName;
				_aoMsg.Content = "";
			}

			if (_sActualSender == _aoWebMM.model("account").getUserName()) {
				var _oContact = _aoWebMM.model("contact").getContact(_aoMsg.ToUserName),
					_sToNickName = _oContact && (_oContact.RemarkName || _oContact.NickName) || _aoMsg.ToUserName;

				_aoMsg.Content += $.tmpl(_aoWebMM.getRes("sharecard_msg_digest_to"), {
					NickName: _aoMsg.Contact.NickName || _aoMsg.Contact.UserName,
					ToNickName: _sToNickName
				});

			} else {
				_aoMsg.Content += $.tmpl(_aoWebMM.getRes("sharecard_msg_digest_from"), {
					FromNickName: _sActualSender,
					NickName: _aoMsg.Contact.NickName || _aoMsg.Contact.UserName
				});
			}

			debug(function() {
				console.info(_aoMsg);
			});
		},

		_systemMsgProcess: function(_aoMsg) {
			var _aLinkArray = _aoMsg.Content.match(/&lt;a href=".*?".*?&gt;.*?&lt;\/a&gt;/g); //<a href=".*?".*?>.*?</a>
			if (!_aLinkArray) return;
			var _aLink, _sLink;
			for (var i = 0, len = _aLinkArray.length; i < len; ++i) {
				_aLink = /&lt;a href="(.*?)".*?&gt;.*?&lt;\/a&gt;/.exec(_aLinkArray[i]);
				if (!_aLink || !_aLink[1]) return;
				_sLink = $.htmlDecode(_aLink[1]);
				if (/^(weixin:\/\/findfriend\/verifycontact)$/.test(_sLink) || $.isUrl(_sLink) && /\.qq\.com/.test(_sLink)) {
					_aoMsg.Content = _aoMsg.Content.replace(_aLink[0], $.htmlDecode(_aLink[0]));

				}
				_aoMsg.Content = _aoMsg.Content.replace(/<a href="weixin:\/\/findfriend\/verifycontact">/, '<a click="verifyContact" href="javascript:;">'); //替换为内置的弹窗

				_aoMsg.Content = _aoMsg.Content.replace(/&lt;a href="weixin:\/\/.*?&lt;\/a&gt;/, ''); //去掉微信协议的链接
			}
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	_aoWebMM.logic("setting", {
		set: function(_avFuncId, _avVal) {
			var _oPostData = $.extend(_aoWebMM.model("account").getBaseRequest(), {
				FunctionId: _avFuncId,
				Value: _avVal
			});
			$.netQueue().send("/cgi-bin/mmwebwx-bin/webwxsetting", _oPostData, {
				onsuccess: function() {
					//todo modify userInfo
				}
			})
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	var _bHasGetAllContact = false;

	_aoWebMM.logic("userverify", {
		verify: function(_asUserName, _anOpCode, _asVerifyContent, _anScene, _aoCallback, _asTicket) {
			var _oPostData = _aoWebMM.model("account").getBaseRequest();
			var _sTicket = _asTicket || "";
			_oPostData.Opcode = _anOpCode || _aoWebMM.Constants.MM_VERIFYUSER_VERIFYOK;
			_oPostData.VerifyUserListSize = 1;
			_oPostData.VerifyUserList = [{
				Value: _asUserName,
				VerifyUserTicket: _sTicket
			}];
			_oPostData.VerifyContent = _asVerifyContent;
			_oPostData.SceneListCount = 1;
			_oPostData.SceneList = [_anScene];

			$.netQueue().send("/cgi-bin/mmwebwx-bin/webwxverifyuser", _oPostData, {
				onsuccess: function() {
					_aoCallback && _aoCallback.onsuccess && _aoCallback.onsuccess();
				},
				onerror: function() {
					_aoCallback && _aoCallback.onerror && _aoCallback.onerror();
				}
			})
		},
		verifyUniGroupList: function(_aaUserList, _anOpCode, _asVerifyContent, _aoCallback) {
			var _oPostData = _aoWebMM.model("account").getBaseRequest(),
				_aVerifyUserList = [],
				_aSceneList = [];
			_oPostData.Opcode = _anOpCode || _aoWebMM.Constants.MM_VERIFYUSER_VERIFYOK;
			_oPostData.VerifyUserListSize = _oPostData.SceneListCount = _aaUserList.length;
			_oPostData.VerifyContent = _asVerifyContent;
			for (var i = 0, len = _aaUserList.length; i < len; ++i) {
				var _sUserName = _aaUserList[i];
				_aVerifyUserList.push({
					Value: _sUserName
				});
				_aSceneList.push(14);
			}
			_oPostData.VerifyUserList = _aVerifyUserList;
			_oPostData.SceneList = _aSceneList;

			$.netQueue().send("/cgi-bin/mmwebwx-bin/webwxverifyuser", _oPostData, {
				onsuccess: function() {
					_aoCallback && _aoCallback.onsuccess && _aoCallback.onsuccess();
				},
				onerror: function() {
					_aoCallback && _aoCallback.onerror && _aoCallback.onerror();
				}
			});
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	_aoWebMM.logic("modifyavatar", {
		modify: function(_asMediaId, _aoPos, _aoCallback) {
			var _oSelf = this,
				_oPostData = $.extend(_aoWebMM.model("account").getBaseRequest(), {
					MediaId: _asMediaId,
					UserName: _aoWebMM.model("account").getUserName(),
					CropWidth: _aoPos[3],
					CropHeight: _aoPos[2],
					CropLeftTopX: _aoPos[1],
					CropLeftTopY: _aoPos[0],
					Width: _aoPos[4],
					Height: _aoPos[5]
				});

			$.netQueue().send("/cgi-bin/mmwebwx-bin/webwxmodifyheadimg" + (_asMediaId ? "" : "?source=orghd"), _oPostData, {
				onsuccess: function(_aoData) {
					_aoCallback && _aoCallback.onsuccess && _aoCallback.onsuccess();
				},
				onerror: function() {
					_aoCallback && _aoCallback.onerror && _aoCallback.onerror();
				}
			})
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	_aoWebMM.logic("oplog", {
		setRemarkName: function(_asUserName, _asRemarkName) {
			var _oPostData = $.extend(
				WebMM.model("account").getBaseRequest(), {
					CmdId: _aoWebMM.Constants.MMWEBWX_OPLOG_MODREMARKNAME,
					UserName: _asUserName,
					BlackType: 0, //default
					RemarkName: _asRemarkName
				});

			$.netQueue().send("/cgi-bin/mmwebwx-bin/webwxoplog", _oPostData, {
				onsuccess: function(_aoData) {
					//					var _oContact = _aoWebMM.model("contact").getContact(_asUserName);
					//					if (_oContact) {
					//						_oContact.update({RemarkName:_asRemarkName});
					//					}
				},
				onerror: function(_nRetCode, _sErrMsg) {
					Log.e("Cgi: /cgi-bin/mmwebwx-bin/webwxoplog, JS Function: setRemarkName, RetCode: " + _nRetCode + ", ErrMsg: " + _sErrMsg);
				}
			});
		},

		blackContact: function(_asUserName, _asOpType) {
			var _oContact = _aoWebMM.model("contact").getContact(_asUserName);
			var _oPostData = $.extend(
				WebMM.model("account").getBaseRequest(), {
					CmdId: _aoWebMM.Constants.MMWEBWX_OPLOG_BLACKCONTACT,
					UserName: _asUserName,
					BlackType: _asOpType,
					RemarkName: _oContact.RemarkName
				});

			$.netQueue().send("/cgi-bin/mmwebwx-bin/webwxoplog", _oPostData, {
				onsuccess: function(_aoData) {
					//                    _oContact.update({
					//                        ContactFlag : _aoWebMM.Constants.MM_CONTACTFLAG_BLACKLISTCONTACT
					//                    });
				},
				onerror: function(_nRetCode, _sErrMsg) {
					Log.e("Cgi: /cgi-bin/mmwebwx-bin/webwxoplog, JS Function: blackContact, RetCode: " + _nRetCode + ", ErrMsg: " + _sErrMsg);
				}
			});
		},

		_op: function(_anOpcode, _aoParams, _aoCallbacks) {
			var _oPostData = $.extend(_aoWebMM.model("account").getBaseRequest(), {
				Opcode: _anOpcode
			}, _aoParams);
			$.netQueue().send("/cgi-bin/mmwebwx-bin/webwxoplog", _oPostData, _aoCallbacks || {});
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	_aoWebMM.logic("feedback", {
		send: function(_asContent) {
			var _oPostData = $.extend(
				WebMM.model("account").getBaseRequest(), {
					MachineType: "webwx",
					Content: _asContent,
					ReportType: 0 //default
				});

			$.netQueue().send("/cgi-bin/mmwebwx-bin/webwxsendfeedback", _oPostData, {
				onerror: function(_nRetCode, _sErrMsg) {
					Log.e("Cgi: /cgi-bin/mmwebwx-bin/webwxsendfeedback, JS Function: feedback send, RetCode: " + _nRetCode + ", Can not feedback");
				}
			});
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {

	var _oMsgStg = _aoWebMM.model("message"),
		_oContactStg = _aoWebMM.model("contact"),
		_oAccountStg = _aoWebMM.model("account");

	_aoWebMM.util = _aoWebMM.util || {};

	_aoWebMM.util.getProxyXHR = function(_asFrameName) {
		try {
			return $("#" + _asFrameName).length && $("#" + _asFrameName)[0].contentWindow.window.xhr;

		} catch (e) {
			return null;
		}
	}

	_aoWebMM.util.logout = function(_asType) {
		_aoWin.onbeforeunload = null;
		$.form("/cgi-bin/mmwebwx-bin/webwxlogout?redirect=1&type=" + (_asType || 0), {
			sid: _oAccountStg.getSid(),
			uin: _oAccountStg.getUin()
		});
	}

	_aoWebMM.util.batchgetUndownloadedContactInMesssage = function(_aoMessages) {
		if (!_aoMessages)
			return;

		var _oUserNames = [];
		for (var i = 0, len = _aoMessages.length; i < len; ++i) {
			var _oMsg = _aoMessages[i];
			_oUserNames.push(_oMsg.FromUserName);
			_oUserNames.push(_oMsg.ToUserName);
			_oMsg.actualSender && _oUserNames.push(_oMsg.actualSender);
		}
		_aoWebMM.util.batchgetUndownloadedContact(_oUserNames);
	}

	_aoWebMM.util.batchgetUndownloadedContact = function(_aoUserNames) {
		var _oBatchgetContact = _aoWebMM.logic("batchgetcontact");
		var _oUsersToDonwload = [];

		for (var i = 0, len = _aoUserNames.length; i < len; ++i) {
			var _sUserName = _aoUserNames[i];
			if (!_oBatchgetContact.isContactDownloaded(_sUserName)) {
				_oUsersToDonwload.push({
					UserName: _sUserName,
					ChatRoomId: ""
				});
			}

			if (_aoWebMM.util.isRoomContact(_sUserName)) {
				var _oContact = _oContactStg.getContact(_sUserName);
				if (_oContact && _oContact.MemberList) {
					for (var k = 0, len = _oContact.MemberList.length; k < len; ++k) {
						var _sMemUserName = _oContact.MemberList[k].UserName;
						if (!_oBatchgetContact.isContactDownloaded(_sMemUserName))
							_oUsersToDonwload.push({
								UserName: _sMemUserName,
								ChatRoomId: _oContact.Uin
							});
					}
				}
			}
		}

		if (_oUsersToDonwload.length) {
			_oBatchgetContact.batchgetContact(_oUsersToDonwload);
		}
	}

	function _fGetAvatarByUserName(_asUserName, _asExtInfo) {
		if (!_asUserName) {
			return "";
		}

		var _sAvatar;
		if (_asUserName == _oAccountStg.getUserName()) //self
		{
			var _sImgUrl = _oAccountStg.getUserInfo().HeadImgUrl;
			if (_sImgUrl && _sImgUrl.length > 0) {
				_sAvatar = _sImgUrl;
			} else {
				_sAvatar = _aoWebMM.getRes("img_def_avatar");
			}
		} else if (_aoWebMM.util.isRoomContact(_asUserName)) {
			var _oContact = _oContactStg.getContact(_asUserName);
			if (_oContact && _oContact.HeadImgUrl) {
				_sAvatar = _oContact.HeadImgUrl;
			} else {
				_sAvatar = "/cgi-bin/mmwebwx-bin/webwxgetheadimg?type=slave&username=" + encodeURIComponent(_asUserName) + "&count=" + (_oContact && _oContact.MemberCount);
			}
		} else {
			var _oContact = _oContactStg.getContact(_asUserName);

			if (_oContact && _oContact.HeadImgUrl && _oContact.HeadImgUrl.length > 0) {
				_sAvatar = _oContact.HeadImgUrl;
			} else {
				var _sAvatarPostFix = "";
				if (_aoWebMM.util.isRoomContact(_asExtInfo)) {
					_sAvatarPostFix += "&chatroomid=" + _asExtInfo.split("@")[0];
				}
				_sAvatar = "/cgi-bin/mmwebwx-bin/webwxgeticon?username=" + _asUserName + _sAvatarPostFix;
			}
		}

		return _sAvatar || "";
	}

	_aoWebMM.util.getNormalAvatarUrl = function(_asUserName, _asExtInfo) {
		return _fGetAvatarByUserName(_asUserName, _asExtInfo || "");
	}

	_fFormatTimeInDay = function(_aoNow, _aoTime) {
		var _nSecondSpan = _aoNow.getTime() / 1000 - _aoTime.getTime() / 1000;
		if (_nSecondSpan < 60) // 1m
		{
			return _aoWebMM.getRes("text_in_one_minute");
		} else if (_nSecondSpan < 60 * 60) // 1h
		{
			return Math.floor(_nSecondSpan / 60) + _aoWebMM.getRes("text_in_minutes");
		} else {
			var _nHour = _aoTime.getHours();
			var _sPrefix = "";
			if (_nHour < 6) {
				_sPrefix = _aoWebMM.getRes("text_dawn");
			} else if (_nHour < 12) {
				_sPrefix = _aoWebMM.getRes("text_morning");
			} else if (_nHour < 13) {
				_sPrefix = _aoWebMM.getRes("text_noon");
			} else if (_nHour < 18) {
				_sPrefix = _aoWebMM.getRes("text_afternoon");
			} else {
				_sPrefix = _aoWebMM.getRes("text_evening");
			}

			if (_nHour > 12)
				_nHour -= 12;

			return _sPrefix + _nHour + ":" + $.formatNum(_aoTime.getMinutes(), 2);
		}
	}

	_fFormatDayAndYear = function(_aoNow, _aoTime) {
		if (_aoNow.getFullYear() != _aoTime.getFullYear()) // different year
		{
			return _aoTime.getFullYear() + _aoWebMM.getRes("text_year") + (_aoTime.getMonth() + 1) + _aoWebMM.getRes("text_month") + _aoTime.getDate() + _aoWebMM.getRes("text_day");
		}

		var _nDaySpan = Math.floor(_aoNow.getTime() / (24 * 60 * 60 * 1000)) - Math.floor(_aoTime.getTime() / (24 * 60 * 60 * 1000));
		if (_nDaySpan == 0) {
			return "";
		} else if (_nDaySpan == 1) {
			return _aoWebMM.getRes("text_yesterday");
		} else if (_nDaySpan < 7) {
			var _nDayInWeek = _aoTime.getDay();
			if (_nDayInWeek == 0)
				_nDayInWeek = 7;
			var _nNowDayInWeek = _aoNow.getDay();
			if (_nNowDayInWeek == 0)
				_nNowDayInWeek = 7;

			var _bIsSameWeek = _nNowDayInWeek > _nDayInWeek;
			if (_bIsSameWeek) {
				var _oText = ["", "text_monday", "text_tuesday", "text_wednesday", "text_thursday", "text_friday", "text_saturday", "text_sunday"];

				return _aoWebMM.getRes(_oText[_nDayInWeek]);
			} else {
				return (_aoTime.getMonth() + 1) + _aoWebMM.getRes("text_month") + _aoTime.getDate() + _aoWebMM.getRes("text_day");
			}
		} else {
			return (_aoTime.getMonth() + 1) + _aoWebMM.getRes("text_month") + _aoTime.getDate() + _aoWebMM.getRes("text_day");
		}
	}


	_aoWebMM.util.formatChatMsgListTime = function(_aoTime) {
		var _oNow = new Date();
		return _fFormatDayAndYear(_oNow, _aoTime) + _fFormatTimeInDay(_oNow, _aoTime);
	}

	_aoWebMM.util.formatConversationListTime = function(_aoTime) {
		return _aoTime.getHours() + ":" + $.formatNum(_aoTime.getMinutes(), 2);
	}

	_aoWebMM.util.createNewSession = function(_asUserName) {
		var _sUserName = _asUserName,
			_oMsgs = _aoWebMM.model("message").getMessages(_sUserName);

		_aoWebMM.model("message").initMessageQueue(_sUserName);
		$.hash("chat?userName=" + _sUserName);
		_aoWebMM.triggerEvent("switchToChatPanel");
		_aoWebMM.triggerEvent("focusToTop", _sUserName);
	}


	_aoWebMM.util.getChatTitle = function(_aoContact) {
		if (!_aoContact) return "";

		if (!_aoContact.DisplayName) {
			_aoContact.DisplayName = this.getContactDisplayName(_aoContact);
		}

		if (_aoWebMM.util.isRoomContact(_aoContact.UserName) && !_aoContact.RemarkName && !_aoContact.NickName) {
			return $.tmpl(_aoWebMM.getRes("text_title_group"), _aoContact.MemberList);
		} else if (_aoWebMM.util.isRoomContact(_aoContact.UserName)) {
			return $.tmpl(_aoWebMM.getRes("text_title_group_remark"), {
				DisplayName: _aoContact.DisplayName,
				Count: _aoContact.MemberCount
			});
		}

		return _aoContact.DisplayName;
	}

	_aoWebMM.util.verificationPopup = function(_asResName, _aContact, _aoCtrl, _afCallback, _aoOption) {
		var _oContact = (typeof(_aContact) == "string") ? _aoWebMM.model("contact").getContact(_aContact) : _aContact;
		if (!_oContact) return;
		_aoCtrl.confirm($.tmpl(_asResName), {
			ok: function(_aoContext$) {
				var _oDiv$ = $("#verification_request"),
					_sVerifyInfo = $.stripStr($.trim(_oDiv$.find("input[type=text]").val()), 40);

				if (_aoOption && _aoOption.notEmpty && !_sVerifyInfo) { //Content must not empty
					return false;
				}

				_aoWebMM.logic("userverify").verify((_oContact.RecommendInfo && _oContact.RecommendInfo.UserName) || _oContact.UserName, (_aoOption && _aoOption.type) || _aoWebMM.Constants.MM_VERIFYUSER_SENDREQUEST, _sVerifyInfo, _oContact && _oContact.scene || 0, {
					onsuccess: function() {
						_aoCtrl.showTips(_oDiv$.attr("addSuccTips"), true, null);
						_afCallback && _afCallback.onsuccess && _afCallback.onsuccess(_sVerifyInfo);
					},
					onerror: function() {
						_aoCtrl.showTips(_oDiv$.attr("addErrTips"), false, null);
						_afCallback && _afCallback.onerror && _afCallback.onerror();
					}
				}, _aoOption && _aoOption.ticket);
			}
		}, "verificationRequest");
		$.setInputLength($("#verification_request").find("input"), 40);
	},

	_aoWebMM.util.verificationGroupPopup = function(_aUinFriendList, _aoCtrl, _afCallback) {
		if (!_aUinFriendList) return;
		_aoCtrl.confirm($.tmpl("verification_add_group_request"), {
			ok: function(_aoContext$) {
				var _oDiv$ = $("#verification_request"),
					_sVerifyInfo = $.stripStr($.trim(_oDiv$.find("input[type=text]").val()), 40);

				_aoWebMM.logic("userverify").verifyUniGroupList(_aUinFriendList, _aoWebMM.Constants.MM_VERIFYUSER_SENDREQUEST, _sVerifyInfo, {
					onsuccess: function() {
						_aoCtrl.showTips(_oDiv$.attr("addSuccTips"), true, null);
						_afCallback && _afCallback.onsuccess && _afCallback.onsuccess(_sVerifyInfo);
					},
					onerror: function() {
						_aoCtrl.showTips(_oDiv$.attr("addErrTips"), false, null);
						_afCallback && _afCallback.onerror && _afCallback.onerror();
					}
				});
			}
		}, "verificationRequest");
		$.setInputLength($("#verification_request").find("input"), 40);
	}

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	_aoWebMM.createCtrl("root", {
		init: function() {
			var _oSelf = this;

			if ($("#container").isShow()) {
				_oSelf.appStart();
			} else {
				var _nAppStartTimer = setInterval(function() {
					if ($("#container").isShow()) {
						clearInterval(_nAppStartTimer);
						_oSelf.appStart();
					}
				}, 100);
			}

			var _oLefScroller$ = $(".chatPanel .listContentWrap"),
				_oChatContainer$ = $(".chatContainer"),
				_oRightScroller$ = $(".chatPanel .chatScorll"),
				_oVernier$ = $("#vernierContainer");

			function _resize() {
				var _nScreenHeight = document.body.clientHeight;
				_oLefScroller$.height(_nScreenHeight - 254);
				_oRightScroller$.height(_nScreenHeight - 233);
				_oChatContainer$.height(_nScreenHeight - 134);
				_oVernier$.height(_oLefScroller$.height());
				$("#chattingmgr_list").height(_nScreenHeight - 340);
			}

			$(window).resize(function() {
				_resize();
			});

			_resize();
		},

		active: function(_aoQuery) {},

		appStart: function() {
			var _oSelf = this;
			_aoWebMM.logic("init").init(function(_aiErrCode, _aoRet) {
				if (_aiErrCode == _aoWebMM.ErrOk) {
					_aoWebMM.logic("sync").sync();
					_aoWebMM.logic("contact").getAllContacts();

					// only one account at a time
					/*
					setInterval(function() {
						if (_aoWebMM.model("account").getSid() != $.getCookie("wxsid")) {
							_aoWin.onbeforeunload = null;
							_aoWebMM.util.logout(1);
						}
					}, 5*1000);
					*/
				} else if (_aiErrCode == -1) {
					_oSelf.alert(_aoWebMM.getRes("init_error_to_refresh"), {
						ok: function() {
							location.reload();
						}
					});
				} else {
					if (_aoWebMM.timeoutDetect(_aiErrCode)) {
						return;
					}

					_oSelf.alert(_aoWebMM.getRes("text_init_error") + " Error Code: " + _aiErrCode, {
						ok: function() {
							_aoWin.onbeforeunload = null;
							_aoWebMM.util.logout();
						}
					});
				}
				_aoWin.t_t = "";

				if ($.getCookie("wxloadtime")) {
					$.setCookie("wxstaytime", $.getCookie("wxloadtime"));
					$.delCookie("wxloadtime");
				}

			});

			if (location.href.indexOf("dev.web") < 0) {
				_aoWin.onbeforeunload = function() {
					return _aoWebMM.getRes("text_leave_confirm");
				}
			}
		},

		enterSession: function(_aoEvent, _aoTarget$) {
			var _sUserName = _aoTarget$.attr("userName") || _aoTarget$.attr("un"),
				_oContact = _aoWebMM.model("contact").getContact(_sUserName);
			if (!_oContact || (_oContact.isSelf() && !WebMM.model("account").isHigherVer())) {
				return;
			}

			if (_oContact.isContact() || _oContact.isRoomContact()) {
				_aoWebMM.util.createNewSession(_sUserName);
			} else {
				this.alert($.tmpl(_aoWebMM.getRes("text_is_not_weixin_contact"), {
					name: _oContact.DisplayName
				}));
			}
		},

		showProfile: function(_aoEvent, _aoTarget$, _aoContext$) {
			$.hash(($.hash() || "chat") + "/popupcontactprofile?userName=" + _aoTarget$.attr("userName"));
		},

		showPhotoAlbum: function(_aoEvent, _aoTarget$, _aoContext$) {
			$.hash(($.hash() || "chat") + "/popupphotoalbum?userName=" + _aoTarget$.attr("userName"));
			return false;
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	var _sCurUserName = "";
	var _bIsMgring = false,
		_oChatMainPanel$ = $("#chatMainPanel"),
		_oChatDetailPanel$ = $("#chatDetailPanel"),
		_oChatTitles$ = null,
		_oLeftOpBtn$ = $("#leftOpBtn"),
		_oRightOpBtn$ = $("#rightOpBtn");

	_aoWebMM.createCtrl("chat", {
		//@override
		init: function(_asName, _aoOptions) {
			this.accountUpdated();

			if ($.isLowerBrowser()) this.getDom$().addClass("hasSysScroll");
		},

		//@override
		active: function(_aoQuery) {
			_sCurUserName = _aoQuery.userName;

			this._updateChatTitle();

			if (_bIsMgring) {
				this.toggleChatMgr();
			}
			this._refreshRightOptBtn();
		},

		inactive: function() {
			//_aoWin.onbeforeunload = null;
		},

		accountUpdated: function(_aoAccount) {
			var _oUserInfo = _aoWebMM.model("account").getUserInfo();
			if (_oUserInfo) {
				if (_oUserInfo.NickName && _oUserInfo.NickName.length > 0) {
					_oUserInfo.name = _oUserInfo.NickName;

				} else {
					_oUserInfo.name = _oUserInfo.UserName;
				}
				_oUserInfo.avatar = _aoWebMM.util.getNormalAvatarUrl(_oUserInfo.UserName);

				$("#profile").html($.tmpl("chat_profile", _oUserInfo));
			}
		},

		messageAdded: function(_aoMsg) {},

		contactAdded: function(_aoContact) {
			if (_aoContact.UserName == _sCurUserName) {
				this._updateChatTitle();
				this._refreshRightOptBtn();
			}
		},

		contactUpdated: function(_aoContact) {
			if (_aoContact.UserName == _sCurUserName) {
				this._updateChatTitle();
				this._refreshRightOptBtn();
			}
		},

		getAllContacts: function() {
			_aoWebMM.logic("contact").getAllContacts();
		},

		toggleSysMenu: function(_aoEvent, _aoTarget$) {
			var _oPanel$ = this.getDom$().find(".operaterBox");
			_aoWebMM.globalEventSetting({
				globalIntercept: !_oPanel$.isShow(),
				interceptDom$: _oPanel$
			});
			/*
			if (_aoTarget$) {
				_oPanel$.css("left", _aoTarget$.position().left - 16);
			}
			*/
			_oPanel$.html($.tmpl("chat_operaterBoxPanel", _aoWebMM.model("account").getUserInfo()))
			if ($.browser.msie) {
				_oPanel$.toggle();
			} else {
				_oPanel$.fadeToggle("fast");
			}
		},

		logout: function(_aoEvent, _aoTarget$) {
			var _oSelf = this;
			_oSelf.confirm(_aoWebMM.getRes("text_logout_confirm"), {
				ok: function() {
					_aoWin.onbeforeunload = null;
					_aoWebMM.util.logout(0);
				}
			});

			_oSelf.toggleSysMenu();
		},

		toggleNotify: function(_aoEvent, _aoTarget$) {
			var _bNotifyOpen = !! _aoWebMM.model("account").isNotifyOpen() && MMNotification.checkPermission() == 0;
			if (MMNotification.checkPermission() == 2) {
				this.alert(_aoTarget$.attr("tip"), {
					ok: function() {
						if ($.isChrome()) {
							//_aoWin.open("chrome://chrome/settings/contentExceptions#notifications");
						}
					}
				});
				return;
			}
			if (MMNotification.checkPermission() == 1) {
				MMNotification.requestPermission(function() {});
			}

			_aoWebMM.model("account").setNotifyOpen(!_bNotifyOpen);
			_aoWebMM.logic("setting").set(_aoWebMM.Constants.MM_WEBWXFUNCTION_NOTIFY_OPEN, _bNotifyOpen ? 0 : 1);
			$("#operaterBox").html($.tmpl("chat_operaterBoxPanel", _aoWebMM.model("account").getUserInfo()));

			if (MMNotification.checkPermission() != 0) {
				this.toggleSysMenu();
			}
		},

		toggleMute: function(_aoEvent, _aoTarget) {
			var _bIsMute = _aoWebMM.model("account").isMute();
			_aoWebMM.model("account").setMute(!_bIsMute);
			_aoWebMM.logic("setting").set(_aoWebMM.Constants.MM_WEBWXFUNCTION_TONE_NOT_OPEN, _bIsMute ? 0 : 1);
			$("#operaterBox").html($.tmpl("chat_operaterBoxPanel", _aoWebMM.model("account").getUserInfo()));
			//this.toggleSysMenu();
		},

		noHandledKeyDown: function(_aoEvent) {
			if ($.isHotkey(_aoEvent, "esc")) {
				var _oMask$ = $("#mask");
				if (_oMask$.isShow()) {
					_oMask$.click();
				}
			}
		},

		noHandledClick: function() {
			if (this.getDom$().find(".operaterBox").isShow()) {
				this.toggleSysMenu();
			}
		},

		_updateChatTitle: function() {
			var _oContact = _aoWebMM.model("contact").getContact(_sCurUserName);
			if (_oChatTitles$ == null) {
				_oChatTitles$ = $("#messagePanelTitle");
			}
			_oChatTitles$.html(_aoWebMM.util.getChatTitle(_oContact));
		},

		createChatroom: function(_aoEvent, _aoTarget$) {
			$.hash(($.hash() || "chat") + "/createchatroom");
			this.toggleSysMenu();
		},

		closeChat: function() {
			$.hash("chat");
		},

		toggleChatMgr: function(_aoEvent, _aoTarget$) {
			_aoWebMM.util.batchgetUndownloadedContact([_sCurUserName]);
			var _oSelf = this;
			if (!_bIsMgring) {
				_bIsMgring = !_bIsMgring;

				function _fAfterAnimate() {
					_oSelf.getDom$().find(".chatName").css("opacity", 1.0);
					_oSelf._refreshRightOptBtn();

					_aoWebMM.triggerEvent("setChatPanelStatus", _bIsMgring);
				}
				_oChatMainPanel$.css({
					"left": 0,
					"top": 0
				}).show()
					.stop().animate({
						"left": -_oChatMainPanel$.width()
					});
				_oChatDetailPanel$.css({
					"left": _oChatMainPanel$.width(),
					"top": 0
				}).show()
					.stop().animate({
						"left": 0
					}, _fAfterAnimate);
				if (!jQuery.fx.off) _oSelf.getDom$().find(".chatName").css("opacity", 0.5);
			} else {
				_oSelf.switchToChatPanel();
			}
		},

		switchToChatPanel: function() {
			if (!_bIsMgring) return;
			var _oSelf = this,
				_fAfterAnimate = function() {
					_oSelf.getDom$().find(".chatName").css("opacity", 1.0);
					_oSelf._refreshRightOptBtn();

					_aoWebMM.triggerEvent("setChatPanelStatus", _bIsMgring);
				};
			_bIsMgring = !_bIsMgring;

			_oChatMainPanel$.show()
				.stop().animate({
					"left": 0
				});
			_oChatDetailPanel$.show()
				.stop().animate({
					"left": _oChatMainPanel$.width()
				}, _fAfterAnimate);
			if (!jQuery.fx.off) _oSelf.getDom$().find(".chatName").css("opacity", 0.5);
		},

		_refreshRightOptBtn: function() {
			var _oContact = _aoWebMM.model("contact").getContact(_sCurUserName);
			if (_oContact && !_bIsMgring) {
				_oRightOpBtn$[_oContact.isBrandContact() || _oContact.isFileHelper() || _oContact.isRecommendHelper() || _oContact.isNewsApp() ? "hide" : "show"]();
				_oLeftOpBtn$.hide();

			} else if (_bIsMgring) {
				_oRightOpBtn$.hide();
				_oLeftOpBtn$.show();
			}
		},

		showEditableTip: function(_aoEvent, _aoTarget$) {
			debug("showTip");
		},

		popupModifyAvatarWin: function() {
			$.hash(($.hash() || "chat") + "/modifyavatar");
		},

		feedback: function() {
			$.hash(($.hash() || "chat") + "/feedback");
			this.toggleSysMenu();
		}
	});
})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	var _isWinFocus = true;
	var _bUserHasAction = true;

	var _stopFlashTitle = _aoWin.onfocus = function() {
		_isWinFocus = true;
		$.stopFlashTitle();
		MMNotification.cancel();

		_aoWebMM.triggerEvent("windowFocus");
	}
	_aoWin.onblur = function() {
		_isWinFocus = false;

		_aoWebMM.triggerEvent("windowBlur");
	}

	// ugly
	$.isWindowFocus = function() {
		return _isWinFocus;
	}

	var _sCurSearchWord = "",
		_sCurUserName = "",
		_bCurSessionHadUnread = false,
		_oConvList$ = null,
		_oMsgstg = _aoWebMM.model("message"),
		_oUiConvs = [],
		_nMaxInitVisibleConv = 15,
		_bHadClickLoadMore = false,
		_oVernierCntr$ = $("#vernierContainer .activeChatVernier");

	var _oUnreadTotalCount$ = null;
	var _nScrollTimer = 0;
	var _bIsMgring = false;
	var _nTotalUnread = 0;
	var _bShowTotalUnread = false;

	var _oLastActiveDom$ = null;

	_aoWebMM.createCtrl("chat_conversationListContent", {

		//@override
		init: function() {
			var _oSelf = this;

			_oConvList$ = $("#conversationContainer");
			_oUnreadTotalCount$ = $("#totalUnreadDot");
			var _nLastContainerTop = 0;
			_oSelf.getDom$().scrollable({
				onscroll: function(_nContainerTop) {
					clearTimeout(_nScrollTimer);
					_nScrollTimer = setTimeout(function() {
						_oSelf._convActive();
					}, 200);
				}
			});

			_aoWebMM.chooseConversation = function(pointer) {
				_oSelf.chooseConversation(null, $(pointer), null);
			}
		},

		//@override
		active: function(_aoQuery) {
			var _oSelf = this;
			if (!_isWinFocus) {
				_oSelf.windowFocus();
			}
			_sCurUserName = _aoQuery.userName;

			if (_sCurUserName) {
				_aoWebMM.util.batchgetUndownloadedContact([_sCurUserName]);
			}

			if (_sCurSearchWord) {
				_oSelf.conversationListSearch("", function() {
					var _nIdx = _oSelf._getUiConvDataIndex(_sCurUserName);
					if (_nIdx >= 0) {
						_oSelf._convActive(true);
					} else {
						_aoWebMM.util.createNewSession(_sCurUserName);
					}
				});

			} else {
				_oSelf._convActive(true);
				var _nIdx = _oSelf._getUiConvDataIndex(_sCurUserName);
				if (_nIdx >= 0) {
					var _oConv = _oUiConvs[_nIdx];
					if (_oConv && _oConv.invisible == true) {
						_oSelf.focusToTop(_sCurUserName);
					}
				}
			}
		},

		_convActive: function(_abAlign, _abForce) {
			var _sLastActiveUserName = (_oLastActiveDom$ && _oLastActiveDom$.attr("un")) || "";

			if (_sCurUserName != _sLastActiveUserName || _abForce) {
				_oLastActiveDom$ && _oLastActiveDom$.removeClass("activeColumn");
				(_oLastActiveDom$ = $("#conv_" + $.getAsciiStr(_sCurUserName))).addClass("activeColumn");
			}

			if (_sCurUserName && !$.isLowerBrowser()) {
				_aoWebMM.widget.scrollFocus(this.getDom$().parent(),
					_oLastActiveDom$,
					_oVernierCntr$,
					_abAlign
				);
			}
		},

		chooseConversation: function(_aoEvent, _aoTarget$, _aoContext$) {
			_aoTarget$.addClass("activeColumn");
			var _nIdx = this._getUiConvDataIndex(_sCurUserName);
			if (_nIdx >= 0 && _oUiConvs[_nIdx].unread > 0) {
				_bCurSessionHadUnread = _oMsgstg.markMsgsRead(_sCurUserName);
				this._handleConvItemDataChangeByUserName(_sCurUserName);
			}

			if (_bCurSessionHadUnread) {
				_aoWebMM.logic("sync").notifyMobile(_sCurUserName, 1);
				_bCurSessionHadUnread = false;
			}

			var _sChoosedUserName = _aoTarget$.attr("userName");
			_bCurSessionHadUnread = _oMsgstg.markMsgsRead(_sChoosedUserName);
			if (_bCurSessionHadUnread) {
				_aoWebMM.logic("sync").notifyMobile(_sChoosedUserName, 1);
				_bCurSessionHadUnread = false;
				this._handleConvItemDataChangeByUserName(_sChoosedUserName);
			}

			if (_sCurSearchWord) {
				var _oMsg = _aoWebMM.model("message").getLastMessage(_sChoosedUserName);
				if (_oMsg) {
					_oMsg.weight = $.now();
				}
			}
			_isWinFocus = true;

			$.hash("#chat?userName=" + _sChoosedUserName);
		},

		conversationListSearch: function(_asSearchWord, _afCallBack) {
			var _oSelf = this;
			setTimeout(function() {
				if (_asSearchWord == _sCurSearchWord) {
					return;
				}

				_sCurSearchWord = _asSearchWord;
				_oUiConvs = _aoWebMM.logic("getconversation").get($.trim(_sCurSearchWord));
				_oSelf._renderList();
				_oSelf.getDom$().parent().scrollTop(0);
				if (!_afCallBack) {
					_oSelf._convActive();
				} else {
					_afCallBack();
				}
			});
		},

		loadMoreConv: function(_aoEvent, _aoTarget$, _abNotAnim) {
			var i = 0;
			for (var j = 0, len = _oUiConvs.length; i < len && j < 10; i++) {
				if (_oUiConvs[i].invisible) {
					_oUiConvs[i].invisible = false;

					var _oConv$ = $("#conv_" + $.getAsciiStr(_oUiConvs[i].userName)),
						_oAvatar$ = _oConv$.find("img.avatar");
					_oAvatar$.attr("src", _oAvatar$.attr("hide_src"));
					_oConv$.show().after(_aoTarget$);
					j++;
				}
			}
			if (i == _oUiConvs.length) {
				_bHadClickLoadMore = true;
				_aoTarget$.remove();
			}
			_aoWebMM.ossLog({
				Type: 10
			});
		},

		focusToTop: function(_asUserName) {
			var _nIndex = this._getUiConvDataIndex(_asUserName);
			if (_nIndex > 0) {
				this._sortConvAndUpateUi(_asUserName, _nIndex);
			}
			this._convActive();
			this.getDom$().parent().scrollTop(0);
			if (_asUserName) {
				_aoWebMM.util.batchgetUndownloadedContact([_asUserName]);
			}
		},

		inited: function() {
			_oUiConvs = _aoWebMM.logic("getconversation").get();
			if (!_oUiConvs || !_oUiConvs.length) {
				return;
			}

			var _oContactsToDownload = [];
			for (var i = 0, len = _oUiConvs.length; i < len; i++) {
				_oContactsToDownload.push(_oUiConvs[i].userName);
			}
			_aoWebMM.util.batchgetUndownloadedContact(_oContactsToDownload);

			this._renderList();
			if (_sCurUserName) {
				this._convActive(true, true);
			}
		},

		_showTitleTip: function() {
			_nTotalUnread = 0;
			for (var i = 0, len = _oUiConvs.length; i < len; i++) {
				var _oUiConv = _oUiConvs[i];
				_nTotalUnread += (_oUiConv.muted ? 0 : (_oUiConv.unread || 0));
			}

			if (_bShowTotalUnread && _nTotalUnread) {
				_oUnreadTotalCount$.html(_nTotalUnread).show();
			} else {
				_oUnreadTotalCount$.hide();
			}

			if (_isWinFocus) {
				return;
			}

			if (_nTotalUnread > 0) {
				$.flashTitle($.tmpl(_aoWebMM.getRes("text_new_message_come"), {
					count: _nTotalUnread
				}));
				var _oConv = this._getFirstUnreadConv();
				if (_oConv && _aoWebMM.model("account").isNotifyOpen()) {
					var _nContent = $.clearHtmlStr(_oConv.digest),
						_oContact = _aoWebMM.model("contact").getContact(_oConv.userName);
					if (!_nContent || (_oContact && _oContact.isRoomContact() && _nContent.length - _nContent.indexOf(":") <= 2)) {
						_nContent += _aoWebMM.getRes("text_emoji_replacer");
					}
					MMNotification.notify(_oConv.avatar,
						$.tmpl(_aoWebMM.getRes("text_new_message_come"), {
							count: _nTotalUnread
						}),
						$.subAsiiStr($.clearHtmlStr(_oConv.name + ": " + _nContent), 50, "..."), {
							onclick: function() {
								_aoWin.focus();
								if (_oConv.userName) _aoWebMM.util.createNewSession(_oConv.userName);
							}
						});
				}
			} else {
				$.stopFlashTitle();
				MMNotification.cancel();
			}
		},

		messageAdded: function(_aoMessage) {
			_aoWebMM.util.batchgetUndownloadedContactInMesssage([_aoMessage]);

			var _sPeerUserName = _aoWebMM.util.getMsgPeerUserName(_aoMessage);
			if (_sPeerUserName == _sCurUserName && !_bIsMgring && _isWinFocus && _bUserHasAction) {
				if (_oMsgstg.markMsgsRead(_sCurUserName)) {
					_bCurSessionHadUnread = true;
				}
			}

			var _nIndex = this._getUiConvDataIndex(_sPeerUserName);
			if (_nIndex >= 0) {
				_oUiConvs[_nIndex].invisible = false;
				this._handleConvItemDataChangeByUserName(_sPeerUserName);
				this._sortConvAndUpateUi(_sPeerUserName, _nIndex);

			} else if (!_sCurSearchWord) {
				var _oNewConv = _aoWebMM.logic("getconversation").genConversation(_sPeerUserName);
				_oUiConvs[_aoMessage.CreateTime > 0 ? "unshift" : "push"](_oNewConv);

				if (_aoMessage.MsgType < 0 && _aoMessage.CreateTime < 0 && _oUiConvs.length > _nMaxInitVisibleConv && !_bHadClickLoadMore && _sPeerUserName != _sCurUserName) {
					_oNewConv.invisible = true;
				}
				_oConvList$[_aoMessage.CreateTime > 0 ? "prepend" : "append"]($.tmpl("chat_conversationItem", _oNewConv));
				this._handleConvItemDataChangeByUserName(_sPeerUserName);
			}

			this._convActive(true);

			var _oContact = _aoWebMM.model("contact").getContact(_sPeerUserName);
			if (_oContact && _oContact.isMuted()) return;
			this._showTitleTip();
		},

		messageUpdated: function(_aoMessage) {
			_aoWebMM.util.batchgetUndownloadedContactInMesssage([_aoMessage]);

			var _sPeerUserName = _aoWebMM.util.getMsgPeerUserName(_aoMessage);
			this._handleConvItemDataChangeByUserName(_sPeerUserName);
			// this._sortConvAndUpateUi(_sPeerUserName);
		},

		contactUpdated: function(_aoContact) {
			this._handleConvItemDataChangeByUserName(_aoContact.UserName);
		},

		contactAdded: function(_aoContact) {
			this.contactUpdated(_aoContact);
		},

		contactDeleted: function(_aoContact) {
			var _sUserName = _aoContact.UserName;
			this.sessionDeleted(_sUserName);
		},

		sessionDeleted: function(_asUserName) {
			var _nIndex = this._getUiConvDataIndex(_asUserName);

			if (_nIndex < 0)
				return;

			_oUiConvs.splice(_nIndex, 1);
			$("#conv_" + $.getAsciiStr(_asUserName)).remove();

			if (_asUserName == _sCurUserName) {
				$.hash("chat");
			}
		},

		noHandledKeyDown: function(_aoEvent) {
			if (!$.isHotkey(_aoEvent, "down") && !$.isHotkey(_aoEvent, "up")) {
				return;
			}
			_aoEvent.stopPropagation();
			_aoEvent.preventDefault();

			if ($.hash().endsWith("/contactlist")) {
				return;
			}

			var _nIdx = 0;
			if (_sCurUserName) {
				for (var i = 0, len = _oUiConvs.length; i < len; i++) {
					if (_oUiConvs[i].userName == _sCurUserName) {
						_nIdx = i;
						if ($.isHotkey(_aoEvent, "down") && i + 1 < len) {
							_nIdx++;
						} else if ($.isHotkey(_aoEvent, "up") && i > 0) {
							_nIdx--;
						}
						break;
					}
				}

				if (_oUiConvs[_nIdx].invisible) {
					return;
				}
			}

			try {
				if (_oUiConvs[_nIdx]) {
					var _oItem$ = $("#conv_" + $.getAsciiStr(_oUiConvs[_nIdx].userName));
					if (_oItem$.length) {
						this.chooseConversation(_aoEvent, _oItem$);
					}
				}
			} catch (e) {
				alert(e);
			}
			_aoEvent.stopPropagation();
			_aoEvent.preventDefault();
		},

		_renderList: function() {
			if (!_sCurSearchWord && !_bHadClickLoadMore) {
				for (var i = _nMaxInitVisibleConv, len = _oUiConvs.length; i < len; i++) {
					_oUiConvs[i].invisible = true;
				}
			}
			_oConvList$.html($.tmpl("chat_conversationList", {
				filter: _sCurSearchWord,
				list: _oUiConvs
			}));
		},

		_sortConvAndUpateUi: function(_asUserName, _anIdx) {
			var _oConvUIItem$ = $("#conv_" + $.getAsciiStr(_asUserName));
			if (_oConvUIItem$.length) {
				_oConvList$.prepend(_oConvUIItem$);
				var _oHolder = _oConvUIItem$[0].holder;
				if (_oHolder) {
					var _sHideSrc = _oHolder.avatar$.attr("hide_src"),
						_sRawSrc = _oHolder.avatar$.attr("src");
					if (_sHideSrc && _sHideSrc != _sRawSrc) {
						_oHolder.avatar$.attr("src", _sHideSrc);
					}
				}
				_oConvUIItem$.show();
				if (_anIdx != _aoUndefined) {
					var _oConv = _oUiConvs.splice(_anIdx, 1);
					_oUiConvs.unshift(_oConv[0]);
					_oConv[0].invisible = false;
				}
			}
		},

		_handleConvItemDataChangeByUserName: function(_asUserName) {
			var _bIsFind = this._getUiConvDataIndex(_asUserName) >= 0;
			if (!_bIsFind) {
				return;
			}

			var _oNewConv = _aoWebMM.logic("getconversation").genConversation(_asUserName);
			this._updateConvUIItem(_oNewConv);
		},

		_updateConvUIItem: function(_aoNewConv) {
			var _oSelf = this,
				_sUserName = _aoNewConv.userName,
				_oConvDom$ = $("#conv_" + $.getAsciiStr(_sUserName));

			if (!_oConvDom$.length) {
				return;
			}

			var _nIndex = _oSelf._getUiConvDataIndex(_sUserName);
			if (_nIndex == -1) {
				return;
			}

			var _oHolder = _oConvDom$[0].holder;
			if (!_oHolder) {
				_oConvDom$[0].holder = _oHolder = {};
				_oHolder.avatar$ = _oConvDom$.find(".avatar");
				_oHolder.name$ = _oConvDom$.find(".name");
				_oHolder.time$ = _oConvDom$.find(".time");
				_oHolder.mute$ = _oConvDom$.find(".mute");
				_oHolder.digest$ = _oConvDom$.find(".desc");
				_oHolder.sendFailedStatus$ = _oConvDom$.find(".sendFailedStatus");
				_oHolder.sendingStatus$ = _oConvDom$.find(".sendingStatus");
				_oHolder.unread$ = _oConvDom$.find(".unreadDot");
				_oHolder.unreadS$ = _oConvDom$.find(".unreadDotS");
				_oHolder.count$ = _oConvDom$.find(".personNum");
			}

			var _oUiConv = _oUiConvs[_nIndex];
			if (_oUiConv.avatar != _aoNewConv.avatar) {
				_oHolder.avatar$.attr(_oUiConv.invisible ? "hide_src" : "src", _aoNewConv.avatar);
			}

			if (_oUiConv.name != _aoNewConv.name) {
				_oHolder.name$.html(_aoNewConv.name);
			}

			if (_oUiConv.time != _aoNewConv.time) {
				_oHolder.time$.text(_aoNewConv.time);
			}

			if (_oUiConv.muted != _aoNewConv.muted) {
				_oHolder.mute$[_aoNewConv.muted ? "show" : "hide"]();
			}

			if (_aoNewConv.status == 1) {
				_oHolder.sendingStatus$.show();
			} else {
				_oHolder.sendingStatus$.hide();
			}

			if (_aoNewConv.status == 5) {
				_oHolder.sendFailedStatus$.show();
			} else {
				_oHolder.sendFailedStatus$.hide();
			}

			if (_oUiConv.digest != _aoNewConv.digest) {
				_oHolder.digest$.html(_aoNewConv.digest);
			}

			if (_oUiConv.unread != _aoNewConv.unread) {
				if (!_aoNewConv.unread) {
					_oHolder.unread$.hide();
					_oHolder.unreadS$.hide();
				} else {
					if (_aoNewConv.muted) {
						_oHolder.unread$.hide();
						_oHolder.unreadS$.show();
					} else {
						_oHolder.unread$.html(_aoNewConv.unread).show();
						_oHolder.unreadS$.hide();
					}
				}
			}

			if (_oUiConv.isRoom && _oUiConv.memCount != _aoNewConv.memCount) {
				_oHolder.count$.html("(" + _aoNewConv.memCount + ")");
			}

			_aoNewConv.invisible = _oUiConv.invisible;
			$.extend(_oUiConv, _aoNewConv);
		},

		_getUiConvDataIndex: function(_asUserName) {
			for (var i = 0, len = _oUiConvs.length; i < len; ++i) {
				if (_oUiConvs[i].userName == _asUserName) {
					return i;
				}
			}
			return -1;
		},

		_getFirstUnreadConv: function() {
			for (var i = 0, len = _oUiConvs.length; i < len; ++i) {
				if (_oUiConvs[i].unread > 0) {
					return _oUiConvs[i];
				}
			}
		},

		setChatPanelStatus: function(_abIsMgring) {
			_bIsMgring = _abIsMgring;
			if (!_bIsMgring) {
				var _oSelf = this;
				setTimeout(function() {
					_oSelf.chooseConversation({}, _oSelf.getDom$().find("div .activeColumn"));
				});
			}
		},


		hasUserAction: function(_bActive) {
			_bUserHasAction = _bActive;
			if (_bUserHasAction) {
				this.windowFocus();
				_stopFlashTitle();
			}
		},

		windowFocus: function() {
			var _oSelf = this;
			if (_sCurUserName) {
				_bCurSessionHadUnread = true;
				if (_aoWebMM.model("message").getUnreadMsgsCount(_sCurUserName) > 0) {
					setTimeout(function() {
						if (_oMsgstg.markMsgsRead(_sCurUserName)) {
							_oSelf._handleConvItemDataChangeByUserName(_sCurUserName);
						}
					}, 500);
				}
			}
		},

		markMsgRead: function(_asUserName) {
			this._handleConvItemDataChangeByUserName(_asUserName);

			var _oContact = _aoWebMM.model("contact").getContact(_asUserName);
			if (_oContact && _oContact.isMuted()) return;
			this._showTitleTip();
		},

		needShowContactList: function(_abShow) {
			if (!_abShow) {
				_oUnreadTotalCount$.hide();
			}
			_bShowTotalUnread = _abShow;
		},

		hasEdited: function() {
			$("#conv_" + $.getAsciiStr(_sCurUserName)).find(".editedIcon").show();
		},
		hasNoEdited: function() {
			$("#conv_" + $.getAsciiStr(_sCurUserName)).find(".editedIcon").hide();
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	var _sCurUserName = null,
		_oContactStg = _aoWebMM.model("contact"),
		_oMsgStg = _aoWebMM.model("message"),
		_oAccontStg = _aoWebMM.model("account");

	var _nVoiceCloundTimer = 0,
		_nVoiceWaitingCount = 0,
		_nCurVoicePlayingId = 0;

	var _nSwitchInterval = ($.browser.msie && $.browser.version < 9) ? 300 : 0,
		_nSwitchTimer = 0;

	//分页加载消息
	var _oMsgsCache = null, //消息缓存
		_nMsgLoadIndex = 0, //当前已加载的消息序数
		_nMsgCountPerPage = 0, //每页多少条消息
		_bIsLoading = false, //是否正在加载中，防止滚动过快漏加内容
		_bIsLoadAll = false, //是否已经加载完毕
		_oLoadTimeout = null;

	_aoWebMM.createCtrl("chat_chatmsglist", {
		//@override
		init: function() {
			var _oSelf = this,
				_oSelf$ = _oSelf.getDom$();

			_oSelf$.scrollable({
				onscroll: function(_Pos) {
					if (_Pos != 0 || _bIsLoading || _bIsLoadAll) return;
					_oSelf._msgDelayLoad(); //当剩余内容小于100px时，并且还没加载完，调用                 	
				}
			});
		},

		//@override
		active: function(_aoQuery) {
			if (!_aoQuery.userName) {
				this.getDom$().html($.tmpl("chat_chooseConversation"));
				return;
			}

			if (_sCurUserName == _aoQuery.userName) {
				return true;
			}

			if (_nCurVoicePlayingId != 0) {
				_aoWebMM.getMediaPlayer().jPlayer("stop");
				_nCurVoicePlayingId = 0;
			}

			_sCurUserName = _aoQuery.userName;

			var _oSelf = this;
			clearTimeout(_nSwitchTimer);
			_nSwitchTimer = setTimeout(function() {
				_oSelf.refresh(true);
			}, _nSwitchInterval);
			if (_nSwitchInterval > 0) {
				_oSelf.getDom$().html("");
			}

			_nMsgCountPerPage = parseInt(_oSelf.getDom$().parent().height() / 58) + 2; //58为一条消息的最小高度
		},

		refresh: function(_abGoToBottom) {
			_oMsgsCache = _aoWebMM.model("message").getMessages(_sCurUserName);
			_nMsgLoadIndex = _oMsgsCache.length - 1;
			_bIsLoadAll = false;

			this._removeNoMsgTip();
			this.getDom$().html("");
			this._msgDelayLoad();
			this.getDom$().parent().scrollTop(_abGoToBottom ? 100000 : 0);
		},

		//for(var i = 0; i < 20; ++i){$("#textInput").val(i);$("[click='sendMsg@.inputArea']").click()}  //快速添加1-20的消息记录语句
		_msgDelayLoad: function() {
			_bIsLoading = true;

			var _aMsgToLoad = [],
				_oSelf$ = this.getDom$(),
				_nBeforeInsertHeight = _oSelf$.height(),
				_nBeforeInsertTop = _oSelf$.scrollBar ? parseInt(_oSelf$.css("top")) : _oSelf$.parent().scrollTop(),
				_oloadingMore$ = $("#chatListloadingMoreMsg");
			for (var i = 0; i < _nMsgCountPerPage; ++i) {
				if (_nMsgLoadIndex < 0) {
					_bIsLoadAll = true;
					break;
				}
				_aMsgToLoad.unshift(_oMsgsCache[_nMsgLoadIndex--]);
			}

			if (_aMsgToLoad.length == 1 && _aMsgToLoad[0].Content == "" && _oMsgsCache.length > 1) _aMsgToLoad.pop(); //if is the last msg

			//开始加载
			clearTimeout(_oLoadTimeout); //防止切换会话后之前的定时器加载
			if (!_bIsLoadAll) {
				$(document).triggerHandler("mouseup"); //触发鼠标up事件，让拖动停止
			}

			function _addMsgToPage() {
				_oloadingMore$.fadeOut("fast");
				_oSelf$.prepend($.tmpl("chat_chatmsglist", _aMsgToLoad));

				if (_oSelf$.scrollBar) {
					_oSelf$.css("top", _nBeforeInsertTop - (_oSelf$.height() - _nBeforeInsertHeight));
					_oSelf$.scrollBar.resize();
				} else {
					_oSelf$.parent().scrollTop((_oSelf$.height() - _nBeforeInsertHeight) - _nBeforeInsertTop);
				}

				_bIsLoading = false;
			}
			if (!_oSelf$.html()) {
				_addMsgToPage();
			} else {
				if (!_aMsgToLoad.length) return;

				if (!_oloadingMore$.length) {
					_oSelf$.prepend($.tmpl("chatListloadingMoreMsg", ""));
					_oloadingMore$ = $("#chatListloadingMoreMsg");
				}
				_oloadingMore$.fadeIn("fast");
				_oLoadTimeout = setTimeout(_addMsgToPage, 1000);
			}
		},

		messageAdded: function(_aoMessage) {
			var _sPeerUserName = _aoWebMM.util.getMsgPeerUserName(_aoMessage),
				_oContact = _aoWebMM.model("contact").getContact(_sPeerUserName);

			if (!_aoMessage.isSend && !_aoWebMM.model("account").isMute() && !_aoMessage.isSysMessage() && _nCurVoicePlayingId == 0 && _oContact && !_oContact.isMuted() && !_oContact.isBrandContact()) {
				if (_aoMessage.actualSender == _sCurUserName && $.isWindowFocus()) {
					_aoWebMM.widget.playNewMsgSound(_aoWebMM.util.isVoiceMsg(_aoMessage.MsgType) ? 1 : 2);

				} else {
					_aoWebMM.widget.playNewMsgSound(3);
				}
			}

			if (_sPeerUserName != _sCurUserName) {
				return;
			}

			this._removeNoMsgTip();
			this.getDom$().append($.tmpl("chat_chatmsglist", [_aoMessage]));

			var _oParent$ = this.getDom$().parent();
			if (_oParent$.scrollTop() + _oParent$.height() < this.getDom$().height() - 1000) {} else {
				_oParent$.scrollTop(100000);
			}
		},

		messageUpdated: function(_aoMsg) {
			var _sPeerUserName = _aoWebMM.util.getMsgPeerUserName(_aoMsg);
			if (_sPeerUserName != _sCurUserName) {
				return;
			}
			if (_aoMsg.LocalID) {
				var _oMsgDom$ = this.getDom$().find("[un='item_" + _aoMsg.LocalID + "']");
				_oMsgDom$.replaceWith($.tmpl("chat_chatmsglist", [_aoMsg]));
			}
		},

		contactAdded: function(_aoContact) {
			this.contactUpdated(_aoContact);
		},

		contactUpdated: function(_aoContact) {
			var _oSelf = this;
			_oSelf.getDom$().find("img[un='avatar_" + _aoContact.UserName + "']").attr("src",
				_aoWebMM.util.getNormalAvatarUrl(_aoContact.UserName));

			var _msgList = _aoWebMM.model("message").getMessages("fmessage");
			if (_msgList.length < 1) return;
			for (var i in _msgList) {
				if (_msgList[i].FromUserName == "fmessage" && _msgList[i].UserName == _aoContact.UserName) {
					_oSelf.messageUpdated(_msgList[i]);
					_aoWebMM.model("message").initMessageQueue(_aoContact.UserName);
				}
			}
		},

		accountUpdated: function(_aoAccount) {
			this.contactUpdated({
				UserName: _aoWebMM.model("account").getUserName()
			});
		},

		popImg: function(_aoEvent, _aoTarget$, _aoContext$) {
			_aoWebMM.popImage(_aoTarget$, _aoTarget$.attr("rawSrc"));
		},

		playVoice: function(_aoEvent, _aoTarget$) {
			var _oSelf = this,
				_sMsgId = _aoTarget$.attr("msgid"),
				_oStatus$ = _aoTarget$.find("[un='voiceStatus']"),
				_oParentCloud$ = _oStatus$.parents(".cloud");

			if (_nCurVoicePlayingId == _sMsgId) {
				_aoWebMM.getMediaPlayer().jPlayer("stop");
				_nCurVoicePlayingId = 0;
				return;
			}

			var _bTrans = false;
			clearInterval(_nVoiceCloundTimer);
			_nVoiceCloundTimer = setInterval(function() {
				_oParentCloud$.animate({
					"opacity": _bTrans ? 1 : 0.5
				}, 200);
				_bTrans = !_bTrans;

				if (++_nVoiceWaitingCount > 21) {
					clearInterval(_nVoiceCloundTimer);
				}

			}, 300);
			_nVoiceWaitingCount = 0;

			_aoWebMM.getMediaPlayer().jPlayer("stop");
			_aoWebMM.setMediaPlayerUICallbacks({
				onloadstart: function() {
					Log.d("loadstart");
				},
				onprogress: function() {
					Log.d("progress");
					(_aoWebMM.getMediaPlayer().lastStatusDom || _oStatus$).addClass("icoVoice").removeClass("icoVoicePlaying");;
					_aoWebMM.getMediaPlayer().lastStatusDom = _oStatus$;
					if (_nVoiceCloundTimer > 0) {
						clearInterval(_nVoiceCloundTimer);
						_nVoiceCloundTimer = 0;
						_oParentCloud$.stop().css("opacity", 1);
					}
					_oStatus$.addClass("icoVoicePlaying").removeClass("icoVoice");
				},
				onpause: function() {
					Log.d("onpuase");
					if (_nVoiceCloundTimer > 0) {
						clearInterval(_nVoiceCloundTimer);
						_nVoiceCloundTimer = 0;
						_oParentCloud$.stop().css("opacity", 1);
					}
					_oStatus$.addClass("icoVoice").removeClass("icoVoicePlaying");

					var _oNextMsg = _nCurVoicePlayingId != 0 && _aoWebMM.model("message").getNextUnreadVoiceMsg(_sCurUserName, _sMsgId);
					if (_oNextMsg) {
						setTimeout(function() {
							_oSelf.playVoice(null, _oSelf.getDom$().find("[un='cloud_" + _oNextMsg.MsgId + "']"));
						});
					}
					_nCurVoicePlayingId = 0;
				},
				onstop: function() {
					this.onpause();
					Log.d("onstop");
					_nCurVoicePlayingId = 0;
				},
				onerror: function() {
					clearInterval(_nVoiceCloundTimer);
					Log.d("onerror");
				}
			});

			_aoWebMM.getMediaPlayer().jPlayer("setMedia", {
				mp3: _aoWebMM.getRes("url_host_https") + "/cgi-bin/mmwebwx-bin/webwxgetvoice?msgid=" + _sMsgId
			});
			_aoWebMM.getMediaPlayer().jPlayer("play");
			_aoTarget$.find("[un='unread_" + _sMsgId + "']").hide();
			var _oMsg = _aoWebMM.model("message").getMsgById(_sCurUserName, _sMsgId);
			if (_oMsg) {
				_oMsg.Status = _aoWebMM.Constants.STATE_READ;
			}
			_nCurVoicePlayingId = _sMsgId;

			_aoWebMM.ossLog({
				Type: _aoWebMM.Constants.MMWEBWX_GETVOICE,
				Cgi: "webwxgetvoice"
			});
		},

		playVideo: function(_aoEvent, _aoTarget$) {
			var _sMsgId = _aoTarget$.attr("msgid"),
				_oPlaySrc = {
					flv: _aoWebMM.getRes("url_host_https") + "/cgi-bin/mmwebwx-bin/webwxgetvideo?type=flv&msgid=" + _sMsgId,
					m4v: _aoWebMM.getRes("url_host_https") + "/cgi-bin/mmwebwx-bin/webwxgetvideo?msgid=" + _sMsgId,
					poster: _aoWebMM.getRes("url_host_https") + "/cgi-bin/mmwebwx-bin/webwxgetmsgimg?type=slave&MsgID=" + _sMsgId,
					download: _aoWebMM.getRes("url_host_https") + "/cgi-bin/mmwebwx-bin/webwxgetvideo?fun=download&msgid=" + _sMsgId
				};

			_aoWebMM.playVideo(_oPlaySrc);
			_aoWebMM.ossLog({
				Type: _aoWebMM.Constants.MMWEBWX_GETVOICE,
				Cgi: "webwxgetvoice"
			});
		},

		downloadMedia: function(_aoEvent, _aoTarget$) {
			var _fBeforeUnload = _aoWin.onbeforeunload;
			_aoWin.onbeforeunload = null;
			location.href = _aoTarget$.attr("url") + ("&fromuser=" + _aoWebMM.model("account").getUserName()) + "&skey=" + _aoWebMM.model("account").getSkey();
			setTimeout(function() {
				_aoWin.onbeforeunload = _fBeforeUnload;
			});
		},

		_removeNoMsgTip: function() {
			this.getDom$().find("#noMsgTip").remove();
		},

		_recompose: function(_aoMsgs) {
			for (var i = 0, len = _aoMsgs.length; i < len; i++) {
				var _oMsg = _aoMsgs[i];

				_oMsg.avatarTitle = _oMsg
				_oMsg.avatarId = _oMsg.actualSender;
				_oMsg.avatar = _aoWebMM.util.getNormalAvatarUrl(_oMsg.actualSender);
			}
		},

		loadHistoryMsg: function(_aoEvent, _aoTarget$, _aoContext$) {
			var _oSelf = this,
				_oCurShow$ = _aoTarget$.hide().siblings('[un="loading"]').show();

			_aoWebMM.logic("loadHistoryMsg").loadMore(_sCurUserName, function(_anMsgState) {
				switch (_anMsgState) {
					case _aoWebMM.Constants.STATE_FAILED:
						_oCurShow$.hide().siblings('[un="loaderr"]').show();
						break;
					default:
						_oSelf.refresh(false);
				}
			});
		},

		userVerify: function(_aoEvent, _aoTarget$, _aoContext$) {
			$.hash(($.hash() || "chat") + "/popupmsgprofile");
		},

		popupMsgProfile: function(_aoEvent, _aoTarget$, _aoContext$) {
			var _sUserName = _sCurUserName;
			_sMsgId = _aoTarget$.attr("msgId");
			$.hash(($.hash() || "chat") + "/popupcontactprofile?userName=" + _sUserName + "&msgId=" + _sMsgId);
		},

		cancelUpload: function(_aoEvent, _aoTarget$, _aoContext$) {
			var _sLocalId = _aoTarget$.attr("localId");
			_aoWebMM.triggerEvent("cancelUploadByLocalId", _sLocalId);
		},

		resendMsg: function(_aoEvent, _aoTarget$, _aoContext$) {
			var _oSelf = this;
			var _sMsgId = _aoContext$.attr("msgid");
			var _oMsg = _oMsgStg.getMsgById(_sCurUserName, _sMsgId);
			_oMsg.update({
				Status: 1
			});
			_aoWebMM.logic("sendMsg").resendText(_oMsg, {
				onerror: function(_anRet) {
					if (_anRet == "1201") {
						_oSelf.alert(_aoWebMM.getRes("text_exit_chatroom"));
					}
				}
			});
		},

		verifyContact: function(_aoEvent, _aoTarget$, _aoContext$) {
			_aoWebMM.util.verificationPopup("verification_request", _sCurUserName, this);
		},

		verifyUniContacts: function(_aoEvent, _aoTarget$, _aoContext$) {
			var _aUserList = _aoTarget$.siblings("span.friends").attr("usernames").split(",");
			_aoWebMM.util.verificationGroupPopup(_aUserList, this);
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	var _sCurKeyWord = "",
		_oScroller$ = null,
		_oSelectedContacts = [],
		_nDisplayContactNum = 0,
		_oSearchInput$,
		_oSelectedPanel$,
		_oFriendListPanel$,
		_oSearchCleanBtn$;

	var _sCurUserName = "",
		_sCurTag = "person",
		_sFunc = null
		_oFilterContact = {};

	function _fScroll(delta) {
		var left = _oScroller$.position().left;
		if (delta > 0) {
			if ((-left) + 320 < _oScroller$.width()) {
				_oScroller$.css("left", left - 60);
			}
		} else {
			if (left < 0) {
				_oScroller$.css("left", left + 60);
			}
		}
	}

	_aoWebMM.createCtrl("createchatroom", {
		init: function() {
			(_oScroller$ = this.getDom$().find(".selectedListScroll"))
				.bind("mousewheel", function(event, delta, deltaX, deltaY) {
					_fScroll(delta);
				});

			this.getDom$().draggable({
				handle: ".titleContainer",
				cursor: "move"
			});

			var _oSelfDom = this.getDom$();
			_oSearchInput$ = _oSelfDom.find(".searchBar").find("input");
			_oSelectedPanel$ = _oSelfDom.find(".selectFriendContainer .selectedPanel");
			_oFriendListPanel$ = _oSelfDom.find(".selectFriendContainer .friendList");
			_oSearchCleanBtn$ = _oSelfDom.find(".searchClean");
		},

		//@override
		active: function(_aoQuery) {
			_sCurUserName = _aoQuery.userName;
			_sCurTag = "person";
			_sFunc = _aoQuery.func;
			_oFilterContact = {};
			if (_sFunc == "add") {
				if (_aoWebMM.util.isRoomContact(_sCurUserName)) {
					var _oCurContact = _aoWebMM.model("contact").getContact(_sCurUserName),
						_oMemberList = _oCurContact && _oCurContact.MemberList || [];
					for (var i = 0, len = _oMemberList.length; i < len; i++) {
						_oFilterContact[_oMemberList[i].UserName] = true;
					}

				} else {
					_oFilterContact[_sCurUserName] = true;
				}
				this.getDom$().find(".choosePersGroup").hide();
				this.getDom$().find(".title span").hide()[1].style.display = "";

			} else {
				this.getDom$().find(".choosePersGroup").show();
				this.getDom$().find(".title span").hide().first().show();
			}
			_oFilterContact[_aoWebMM.Constants.SP_CONTACT_FILE_HELPER] = true;

			_sCurKeyWord = "";
			_aoWebMM.widget.screenCentral(this.getDom$(), {
				showMask: true
			});
			this.contactListReady(_aoWebMM.logic("contact").hasGotAllContacts());

			_oSelectedContacts = [];
			this._renderSelectedContacts();

			var _oSelfDom = this.getDom$();

			_oSelfDom.find(".selectGroupChat").removeClass("selectedChat");
			_oSelfDom.find(".selectPersChat").addClass("selectedChat");
		},

		//@override
		inactive: function() {
			$("#mask").hide();
		},

		/**
		 * _abInit �Ƿ�յ��ȥ
		 */
		contactListReady: function(_abInit) {
			var _oSelf = this;
			if (_sCurTag == "person") {
				var _oContacts = _aoWebMM.model("contact").getAllFriendContact(_sCurKeyWord, !_sCurKeyWord, _oFilterContact, true),
					_oStarContacts = !_sCurKeyWord && _aoWebMM.model("contact").getAllStarContact(_oFilterContact) || [];

				if (_abInit) {
					for (var i = 0, len = _oContacts.length; i < len; i++) {
						_oContacts[i].choosed = false;
					}

					for (var i = 0, len = _oStarContacts.length; i < len; i++) {
						_oStarContacts[i].choosed = false;
					}
				}

				var _sHtml = $.tmpl("newchatlist", {
					init: _abInit,
					contacts: _oContacts,
					starContacts: _oStarContacts
				});

				_nDisplayContactNum = _oContacts.length + _oStarContacts.length;
				setTimeout(function() {
					_oSelf.getDom$().find(".selectFriendContainer").show().find(".group").html(_sHtml);
					_oSelf.getDom$().find(".selectGroupContainer").hide();
					if (_abInit) {
						_oSelf.getDom$().find(".searchBar input").val("")[0].focus();
					}
				});

			} else if (_sCurTag == "group") {
				setTimeout(function() {
					var _oContacts = _aoWebMM.logic("contact").getAllSortedGroups(),
						_sHtml = $.tmpl("chatroomlist", {
							contacts: _oContacts
						});
					_oSelf.getDom$().find(".selectFriendContainer").hide();
					_oSelf.getDom$().find(".selectGroupContainer").show().find(".group").html(_sHtml);
				});
			}
		},

		selectContact: function(_aoEvent, _aoTarget$) {
			var _oSelf = this,
				_sUserName = _aoTarget$.attr("id").replace("sel_con_", "");
			// if(WebMM.model("account").isHigherVer() && WebMM.model("contact").getContact(_sUserName).isOneWayFriend()){
			//     _aoWebMM.util.verificationPopup("verification_add_group_request",_sUserName, _oSelf);
			//     return false;
			// }
			(_aoTarget$ = _aoTarget$.find(".checkbox")).toggleClass("checked");
			var _bAddContact = _aoTarget$.hasClass("checked");
			var _oSelf = this;
			_oSelf._toggleSelectedContact(_aoTarget$.attr("username"), _bAddContact);
			_oSelf._renderSelectedContacts();
			if (_bAddContact) {
				if (_oSearchInput$.val()) {
					_oSelf._cleanSearchInput();
				}
				if (_oSelectedPanel$.css("display") == "none") _oSelf._showSelectedPanel();
			}
		},

		unSelectContact: function(_aoEvent, _aoTarget$) {
			var _sUserName = _aoTarget$.attr("username");
			$("#sel_con_" + $.getAsciiStr(_sUserName)).click();
		},

		cleanSearchWord: function(_aoEvent, _aoTarget$) {
			this._cleanSearchInput();
		},

		_toggleSelectedContact: function(_asUserName, _abAddContact) {
			var _oContact = _aoWebMM.model("contact").getContact(_asUserName);
			_oContact.choosed = _abAddContact;
			if (_abAddContact) {
				_oSelectedContacts.push(_oContact);
				return;
			}

			var i = 0;
			for (len = _oSelectedContacts.length; i < len; i++) {
				if (_oSelectedContacts[i].UserName == _asUserName) {
					_oSelectedContacts.splice(i, 1);
					break;
				}
			}
			if (_oSelectedContacts.length == 0) this._hideSelectedPanel();
		},

		_renderSelectedContacts: function() {
			var _oScroller$ = this.getDom$().find(".selectedListScroll");
			_oScroller$.html($.tmpl("selectcontactlist", _oSelectedContacts));
			var _nWidth = _oScroller$.find("span:first-child").outerWidth(true) * _oSelectedContacts.length;
			_oScroller$.width(_nWidth).css("left", (_nWidth < 320) ? 0 : (320 - _nWidth));

			this.getDom$().find("#selectContactCount")
				.html("(" + _oSelectedContacts.length + ")")[_oSelectedContacts.length > 0 ? "show" : "hide"]();
		},

		_showSelectedPanel: function() {
			_oFriendListPanel$.css("height", "303px");
			_oSelectedPanel$.show();
		},

		_hideSelectedPanel: function() {
			_oSelectedPanel$.hide();
			_oFriendListPanel$.css("height", "373px");
		},

		_cleanSearchInput: function() {
			_oSearchCleanBtn$.hide();
			_oSearchInput$.val("");
			_oSearchInput$.focus();
			_sCurKeyWord = $.trim("");
			this.contactListReady();
		},

		_hasSpecialFriend: function(_aoData) {
			var _oSelf = this,
				_aMemberList = _aoData.MemberList,
				_sBlackFriends = "",
				_oContactModel = _aoWebMM.model("contact");
			for (var i = 0, len = _aMemberList.length; i < len; ++i) {
				var _oMember = _aMemberList[i];
				if (_oMember.MemberStatus == _aoWebMM.Constants.MM_MEMBER_BLACKLIST) {
					var _oContact = _oContactModel.getContact(_oMember.UserName);
					_sBlackFriends += _oContact.NickName || _oContact.Alias || _oContact.UserName;
					_sBlackFriends += " , ";
				}
			}
			_sBlackFriends = _sBlackFriends.substr(0, _sBlackFriends.length - 2);
			if (_sBlackFriends.length > 0) {
				_oSelf.alert($.tmpl("addBlackContactGroupErrTips", {
					Friends: _sBlackFriends
				}), null, "verificationRequest");
			}

			var _sChatRoomName = _aoData.ChatRoomName || _sCurUserName;
			//            if(!_aoWebMM.model("account").isHigherVer()){
			//                $.hash("chat?userName=" + _sChatRoomName);
			//                return;
			//            }

			var _aUinFriendList = [],
				_sUniFriendCount,
				_sUinFriends = "";
			for (var i = 0, len = _aMemberList.length; i < len; ++i) {
				var _oMember = _aMemberList[i];
				if (_oMember.MemberStatus == _aoWebMM.Constants.MM_MEMBER_NEEDVERIFYUSER)
					_aUinFriendList.push(_oMember.UserName);
			}
			_sUniFriendCount = _aUinFriendList.length;
			if (_sUniFriendCount > 0) {
				if (_sUniFriendCount < _aoData.MemberCount) {
					$.hash("chat?userName=" + _sChatRoomName);
					setTimeout(function() {
						for (var i = 0, len = _sUniFriendCount; i < len; ++i) {
							var contact = WebMM.model("contact").getContact(_aUinFriendList[i]),
								contactName = contact.NickName || contact.Alias || contact.UserName;
							_sUinFriends += (contactName + " , ");
						}
						_sUinFriends = _sUinFriends.substr(0, _sUinFriends.length - 2);
						_aoWebMM.model("message").addFakeSysMsg({
							MsgType: 10000,
							FromUserName: _sChatRoomName,
							ToUserName: _aoWebMM.model("account").getUserInfo().UserName,
							Status: _aoWebMM.Constants.STATE_SENT,
							CreateTime: $.now() / 1000,
							Content: $.tmpl("verificationUinGroup", {
								Friends: _sUinFriends,
								UserNames: _aUinFriendList.join(",")
							}),
							unread: false
						});
					}, 500);
				} else {
					_aoWebMM.util.verificationGroupPopup(_aUinFriendList, _oSelf);
				}
			} else {
				$.hash("chat?userName=" + _sChatRoomName);
			}
		},

		newsession: function(_asUserName) {
			_aoWebMM.util.createNewSession(_asUserName);
			_aoWebMM.ossLog({
				Type: _aoWebMM.Constants.MMWEBWX_NEW_CHAT
			});
		},

		searchContact: function(_aoEvent, _aoTarget$) {
			var _oSelf = this;
			setTimeout(function() {
				if ($.isHotkey(_aoEvent, "enter")) {
					if (_nDisplayContactNum == 1) {
						_oSelf.getDom$().find(".friendDetail").click();
						_oSelf._cleanSearchInput();
						return;
					} else if (!_oSearchInput$.val()) {
						_oSelf.getDom$().find(".chatSend").click();
					}
				}

				_sCurKeyWord = $.trim(_aoTarget$.val());
				_oSelf.contactListReady();
				if (_aoTarget$.val() != "")
					_oSearchCleanBtn$.show();
				else _oSearchCleanBtn$.hide();
			});
		},

		noHandledKeyDown: function(_aoEvent) {
			var _oSelf = this;
			if ($.isHotkey(_aoEvent, "enter") && !_oSearchInput$.val())
				_oSelf.getDom$().find(".chatSend").click();
		},

		createChatRoom: function(_aoEvent, _aoTarget$, _aoContext$) {
			var _oSelf = this,
				_oCheckedUserNames = [],
				_sMyUserName = _aoWebMM.model("account").getUserInfo().UserName;
			_oSelf._hideSelectedPanel();
			for (var i = 0, len = _oSelectedContacts.length; i < len; i++) {
				var _sUserName = _oSelectedContacts[i].UserName;
				if (_sUserName == _sMyUserName && len > 1) continue;
				_oCheckedUserNames.push(_sUserName);
			}

			if (_oCheckedUserNames.length == 0) {
				$.history.back();
				return;

			} else if (_oCheckedUserNames.length > 0 && _sFunc == "add" && _aoWebMM.util.isRoomContact(_sCurUserName)) {
				_aoWebMM.logic("modChatroom").addMember(_sCurUserName, _oCheckedUserNames.join(","), {
					onsuccess: function(_aoData) {
						_oSelf._hasSpecialFriend(_aoData);
						_aoWebMM.triggerEvent("switchToChatPanel");
					}
				});
				this.close();
				return;

			} else if (_oCheckedUserNames.length == 1 && _sFunc != "add") {
				_oSelf.newsession(_oCheckedUserNames[0]);
				return;
			}

			if (_sCurUserName) {
				_oCheckedUserNames.push(_sCurUserName);
			}

			_aoWebMM.logic("createChatRoom").create("", _oCheckedUserNames, {
				onbefore: function() {
					$.history.back();
				},
				onsuccess: function(_aoData) {
					_oSelf._hasSpecialFriend(_aoData);
				},
				onerror: function(_anRetCode) {
					/*
                     MM_ERR_MEMBER_TOOMUCH = -23,
                     MM_ERR_SPAM = -24,
                     */
					if (_anRetCode == -23) {
						_oSelf.alert(_aoWebMM.getRes("text_create_chatroom_exceed_limit_err"));
					} else {
						_oSelf.alert(_aoWebMM.getRes("text_create_chatroom_err"));
					}
				}
			});
		},

		close: function() {
			this._cleanSearchInput();
			this._hideSelectedPanel();
			$.history.back();
		},

		scrollLeft: function() {
			_fScroll(-1);
		},

		scrollRight: function() {
			_fScroll(1);
		},

		switchTag: function(_aoEvent, _aoTarget$) {
			if (_aoTarget$.attr("un") != _sCurTag) {
				this.getDom$().find("[click='switchTag']").removeClass("selectedChat");
				_aoTarget$.addClass("selectedChat");
				_sCurTag = _aoTarget$.attr("un");
				this.contactListReady();
			}
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	var _sCurPanel = "",
		_sCurUserName = "",
		_sCurSearchWord = "";

	var _oLeftPanel$, _oRightPanel$, _oSearchClean$;

	_aoWebMM.createCtrl("chat_leftpanel", {

		//@override
		init: function() {
			var _oSelf = this;

			_sCurPanel = "conversation";
			_oLeftPanel$ = $("#chat_conversationListContent").parent();
			_oRightPanel$ = $("#chat_contactListContent").parent();
			_oSearchClean$ = $("#conv_search_clean");
		},

		//@override
		active: function(_aoQuery) {
			if ( !! _sCurUserName != !! _aoQuery.userName) {
				this.getDom$().nextAll().css("visibility", !! _aoQuery.userName ? "visible" : "hidden");

				if (!_aoWin.FormData) {
					_aoWebMM.triggerEvent("swfUploaderInit");
				}
			}
			if (_aoQuery.userName != _sCurUserName) {
				_sCurUserName = _aoQuery.userName;
				if (_sCurSearchWord && _oSearchClean$.isShow()) {
					this.cleanSearchWord("click", null, this.getDom$().find(".chatListSearchInput"));
				}
				this.switchPanel({}, $("#chooseConversationBtn"));
			}

		},

		focusToTop: function() {
			if (_sCurPanel != "conversation") {
				this.switchPanel({}, $("#chooseConversationBtn"));
			}
		},

		preSearch: function(_aoEvent) {
			if (_aoEvent && $.isHotkey(_aoEvent, "tab")) {
				_aoEvent.preventDefault();
				_aoEvent.stopPropagation();
			}
		},

		search: function(_aoEvent, _aoTarget$, _aoContext$) {
			_sCurSearchWord = $.trim(_aoTarget$.val()) || "";
			_aoContext$.find(".searchClean")[_sCurSearchWord ? "show" : "hide"]();
			_aoWebMM.triggerEvent(_sCurPanel == "conversation" ? "conversationListSearch" : "contactListSearch", _sCurSearchWord);
		},

		cleanSearchWord: function(_aoEvent, _aoTarget$, _aoContext$) {
			var _oSearchInput$ = _aoContext$.find("input");
			this.search(_aoEvent, _oSearchInput$.val(""), _aoContext$);
			if (_aoEvent) {
				setTimeout(function() {
					_oSearchInput$.focus();
				}, 10);
			}
		},

		switchPanel: function(_aoEvent, _aoTarget$) {
			var _sPanelName = _aoTarget$.attr("un");

			_aoTarget$.siblings().removeClass("active");
			_aoTarget$.addClass("active");

			if (_sCurPanel != _sPanelName) {

				if (_sCurSearchWord && _oSearchClean$.isShow()) {
					this.cleanSearchWord(null, _oSearchClean$, _oSearchClean$.parent());
				}

				_oLeftPanel$.scrollTop(0);
				_sCurPanel = _sPanelName;
				if (_sCurPanel == "conversation") {
					_oLeftPanel$.show();
					_oRightPanel$.hide();
					_aoWebMM.triggerEvent("needShowContactList", false);
				} else {
					_oLeftPanel$.hide();
					_oRightPanel$.show();
					$("#conv_search").focus();
					_aoWebMM.triggerEvent("needShowContactList", true);
				}
			}
			/*
			if (_sCurUserName) {
				this.getDom$().nextAll().css("visibility", _sCurPanel=="conversation" ? "visible" : "hidden");
			}
			*/
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	var _sCurUserName = null,
		_oSendEmojiIcon$ = $("#sendEmojiIcon"),
		_oScreenSnapIcon$ = $("#screenSnapIcon"),
		_oSendFileIcon$ = $("#sendFileIcon"),
		_oSendVoiceIcon$ = $("#sendVoiceIcon");

	var _biOS = $.isiOS();
	!_biOS && _oSendFileIcon$.show();
	_oSendEmojiIcon$.show();
	!_biOS && _oScreenSnapIcon$.show();

	var _nMaxUploadSize = 10 * 1024 * 1024;
	var _nMaxImgUploadSize = 10 * 1024 * 1024;
	var _oSwfUploadMap = {};

	var _nSwitchInterval = $.browser.msie ? 300 : 0,
		_nSwitchTimer = 0,
		_nFocusTimer = 0;

	var _nRecordingStatus = 0, // 0 init, 1 recording, 2 cancel
		_nRecordActivityTime = 0;

	var _oInputArea$ = null;

	function _isShowEditor(_asUserName) {
		return (_asUserName != "newsapp" && _asUserName != "fmessage");
	}

	_aoWebMM.createCtrl("chat_editor", {
		init: function() {
			var _oSelf = this;
			_oInputArea$ = _oSelf.getDom$().find("textarea");

			$.textAreaResize(_oInputArea$[0], _oInputArea$.height(), _oInputArea$.height() * 4, function(_anChange) {
				_oSelf.getDom$().prev().height(function(n, h) {
					return h - _anChange;
				});
				_oSelf.getDom$().height(_oSelf.getDom$().height() + _anChange)

			});

			_oInputArea$.on("paste", function(_aoEvent) {
				if (_aoEvent.originalEvent.clipboardData && _aoEvent.originalEvent.clipboardData.types && _aoEvent.originalEvent.clipboardData.types[0] == "Files") {
					var _oItem = _aoEvent.originalEvent.clipboardData.items;
					if (_oItem.length < 1) return;
					var _oFile = _oItem[0].getAsFile();
					if (!_oFile || _oFile.size <= 0) return;

					var _sImgUrl = $.getURLFromFile(_oFile);
					if (_sImgUrl) {
						_aoWin.uploadPreview.setCallback({
							send: function() {
								$.uploadFileByForm({
									target: {
										files: [$.extend(_oFile, {
											name: "undefined.jpg"
										})]
									}
								});
								setTimeout(function() {
									$("#textInput")[0].focus()
								});
							}
						}).setImg(_sImgUrl).show();
					}

				} else if (_aoWebMM.widget.screenSnap.isClipBoardImage()) {
					_oSelf._screenSnapUpload();
				}

			}).on("keydown", function(_aoEvent) {
				_oSelf.hotkeySend(_aoEvent, $(this));
				_aoEvent.stopPropagation();
				_aoWebMM.touchUserAction();

			}).on("keyup", function(_aoEvent) {
				_aoEvent.stopPropagation();

				var _sVal = $(this).val();
				//                    if(_sVal.length > 0){
				//                        _aoWebMM.triggerEvent("hasEdited");
				//                    }else{
				//                        _aoWebMM.triggerEvent("hasNoEdited");
				//                    }
			});

			$.setDragFileUploadOption(function() {
				var _oGetXhr = _aoWebMM.util.getProxyXHR("uploadFrame");
				return _oGetXhr ? _oGetXhr() : new XMLHttpRequest();

			}, _oSelf._getDragFileUploadUI());

			$.dragFileUpload("dragPanel", function() {
				return _aoWebMM.getRes("url_file") + "/cgi-bin/mmwebwx-bin/webwxuploadmedia?f=json&un=" + _sCurUserName + "&skey=" + _aoWebMM.model("account").getSkey() + "&wxuin=" + _aoWebMM.model("account").getUin();
			}, function() {
				return _aoWebMM.model("account").getBaseRequest().BaseRequest;
			}, _oSelf._getDragFileUploadCallbacks());

		},

		swfUploaderInit: function() {
			var _oSelf = this,
				_oSwfUploader = _aoWebMM.widget.swfUploader;
			if (_oSwfUploader.isSupport()) {
				var _oFileCntr$ = $("#uploadFileContainer"),
					_oSwfCntr$ = $("#swfUploaderContainer"),
					_oPos = _oFileCntr$.offset();

				_oSwfCntr$.css("width", _oFileCntr$.width()).css("height", _oFileCntr$.height())
					.css("left", 0).css("top", 0).appendTo(_oFileCntr$);

				_oSwfUploader.install(_oSwfCntr$, {
					onbefore: function() {
						Log.d("onbefore");
					},
					onselect: function(_anIdx, _aoData) {
						if (_aoData.size > _nMaxUploadSize) {
							_aoWebMM.ossLog({
								Type: _aoWebMM.Constants.MMWEBWX_UPLOADMEDIA_TOO_LARGE
							});
							_oSelf.alert(_aoWebMM.getRes("text_file_too_large"));
							return;
						}
						if ($.isImg(_aoData.name) && _aoData.size > _nMaxImgUploadSize) {
							_aoWebMM.ossLog({
								Type: _aoWebMM.Constants.MMWEBWX_UPLOADMEDIA_TOO_LARGE
							});
							_oSelf.alert(_aoWebMM.getRes("img_too_large"));
							return;
						}
						_oSwfUploader.upload(_anIdx, _aoWebMM.getRes("url_file") + "/cgi-bin/mmwebwx-bin/webwxuploadmedia?f=json&un=" + _sCurUserName + "&skey=" + _aoWebMM.model("account").getSkey() + "&wxuin=" + _aoWebMM.model("account").getUin(), {
							uploadmediarequest: JSON.stringify($.extend(_aoWebMM.model("account").getBaseRequest(), {
								ClientMediaId: ("" + $.now()),
								TotalLen: 0,
								StartPos: 0,
								DataLen: 0,
								MediaType: 4
							}))
						});

						var _nLocalId = _oSelf._addAppMsg(_aoData.name, _aoData.size);
						_oSwfUploadMap[_anIdx] = {
							toUserName: _sCurUserName,
							name: _aoData.name,
							localId: _nLocalId
						};
					},
					onprocess: function(_anFileIdx, _anPercent) {
						if (_oSwfUploadMap[_anFileIdx] !== _aoUndefined) {
							var _oItem = _oSwfUploadMap[_anFileIdx];
							$("#progressBar_" + _oItem.localId).css("width", _anPercent * 98 / 100)
								.parent().parent().css("visibility", "visible");
						}
					},
					onsuccess: function() {},
					onerror: function() {
						Log.d("JS Function: swfUploaderInit, swf upload onerror, arguments: " + arguments);
					},
					oncomplete: function(_anFileIdx, _aoData) {
						debug("upload complete idx:" + _anFileIdx + _aoData);
						if (_oSwfUploadMap[_anFileIdx] !== _aoUndefined) {
							var _oResult = JSON.parse(_aoData),
								_oItem = _oSwfUploadMap[_anFileIdx];
							if (_oResult["BaseResponse"].Ret == 0) {
								_oSelf._doSendAppMsg(_oItem.toUserName, _oItem.name, $.extend({
									MediaId: _oResult.MediaId,
									StartPos: _oResult.StartPos
								}, {
									LocalId: _oItem.localId
								}));
							} else {
								_aoWebMM.logic("sendMsg").changeSendingMsgStatus(_oItem.toUserName, _oItem.localId, false);
							}
							$("#progressBar_" + _oItem.localId).parent().parent().css("visibility", "hidden");

							delete _oSwfUploadMap[_anFileIdx];
						}
					}
				});
			}
		},

		//@override
		active: function(_aoQuery) {
			var _oSelf = this,
				_sLastUserName = _sCurUserName;
			_sCurUserName = _aoQuery.userName;

			if (_sLastUserName) {
				_aoWebMM.model("history").inputRecord(_sLastUserName, this.getDom$().find("textarea").val());
			}

			clearTimeout(_nSwitchTimer);
			_nSwitchTimer = setTimeout(function() {
				_oContact = _aoWebMM.model("contact").getContact(_sCurUserName);

				if (_nRecordingStatus == 1) {
					_oSelf.cancelRecord();
				}

				_oSelf.getDom$().children(".inputArea").css("visibility", _isShowEditor(_sCurUserName) ? "" : "hidden");

				if (_sCurUserName != _sLastUserName) {
					_oInputArea$.val(_aoWebMM.model("history").inputRecord(_sCurUserName));
					clearTimeout(_nFocusTimer);
					_nFocusTimer = setTimeout(function() {
						$.safe(function() {
							if (_isShowEditor(_sCurUserName)) {
								_oInputArea$[0].focus();
							}
						});
					}, 300);
				}
			}, _nSwitchInterval);
		},

		sendImgMsg: function(_aoEvent, _aoDom$, _aoContext$) {
			//			if(!_sCurUserName || !_aoWebMM.model("contact").isContactExisted(_sCurUserName)) {
			//				this.alert(_aoWebMM.getRes("text_choose_conversation"));
			//				return;
			//			}

			if (!$.isImg(_aoContext$[0].filename.value)) {
				this.alert(_aoWebMM.getRes("text_invalid_img_type"));
				return;
			}

			var _nLocalID = $.now();
			_aoContext$[0].msgimgrequest.value = JSON.stringify($.extend({
					Msg: {
						FromUserName: _aoWebMM.model("account").getUserName(),
						ToUserName: _sCurUserName,
						Type: 3,
						LocalID: "" + _nLocalID
					}
				},
				_aoWebMM.model("account").getBaseRequest()));
			var _sTarget = "actionFrame" + _nLocalID;
			$("<iframe>").css("display", "none").attr("id", _sTarget).attr("name", _sTarget).attr("src", "javascript:;").appendTo("body");
			_aoContext$.attr("target", _sTarget);
			_aoContext$.submit();

			_aoContext$[0].filename.value = "";
			this._sendImgMsg(_nLocalID);
		},

		_sendImgMsg: function(_anLocalID, _asFileUrl) {
			_aoWebMM.logic("sendMsg").sendImg({
				LocalID: _anLocalID,
				ClientMsgId: _anLocalID,
				FromUserName: _aoWebMM.model("account").getUserName(),
				ToUserName: _sCurUserName,
				Type: 3,
				FileUrl: _asFileUrl || ""
			}, function() {
				$("#actionFrame" + _anLocalID).remove();
			});
		},

		_doSendImgMsgByMedia: function(_asToUserName, _anLocalId, _asMediaId) {
			var _oPostData = $.extend({
					Msg: {
						FromUserName: _aoWebMM.model("account").getUserName(),
						MediaId: _asMediaId,
						ToUserName: _asToUserName,
						Type: 3,
						LocalID: "" + _anLocalId
					}
				},
				_aoWebMM.model("account").getBaseRequest());

			$.netQueue().send("/cgi-bin/mmwebwx-bin/webwxsendmsgimg?fun=async&f=json", _oPostData, {
				onbefore: function() {},
				onsuccess: function(_aoData) {
					_aoWin[_anLocalId] && _aoWin[_anLocalId](_anLocalId, _aoData.MsgID);

				},
				onerror: function() {
					_aoWin[_anLocalId] && _aoWin[_anLocalId](_anLocalId, -1);
					Log.e("Cgi: /cgi-bin/mmwebwx-bin/webwxsendmsgimg?fun=async&f=json, JS Function: _doSendImgMsgByMedia, SendImgMsgByMedia error.");
				}
			});

		},

		sendAppMsg: function(_aoEvent, _aoTarget$, _aoContext$) {
			//			if(!_sCurUserName || !_aoWebMM.model("contact").isContactExisted(_sCurUserName)) {
			//				this.alert(_aoWebMM.getRes("text_choose_conversation"));
			//				return;
			//			}

			if (_aoWin.FormData) {
				$.uploadFileByForm(_aoEvent);
				_aoContext$[0].filename.value = "";
				return;
			}

			var _oSelf = this;
			_aoContext$[0].uploadmediarequest.value = JSON.stringify($.extend(_aoWebMM.model("account").getBaseRequest(), {
				ClientMediaId: ("" + $.now()),
				TotalLen: 0,
				StartPos: 0,
				DataLen: 0,
				MediaType: 4
			}));
			_aoContext$.attr("action", _aoContext$.attr("url") + "&skey=" + _aoWebMM.model("account").getSkey());
			_aoContext$.submit();
			var _sName = $.getFileName(_aoContext$[0].filename.value);
			_aoContext$[0].filename.value = "";

			var _nLocalId = _oSelf._addAppMsg(_sName),
				_sToUserName = _sCurUserName;
			_aoWin.sendFile = function(_asRet, _aoData) {
				if (_asRet == "0") {
					_oSelf._doSendAppMsg(_sToUserName, _sName, $.extend(_aoData, {
						LocalId: _nLocalId
					}));
				} else {
					_aoWebMM.logic("sendMsg").changeSendingMsgStatus(_sToUserName, _nLocalId, false);
				}
			}
		},

		hotkeySend: function(_aoEvent, _aoTarget$) {
			if ($.isHotkey(_aoEvent, "enter") || $.isHotkey(_aoEvent, "ctrl+enter") || $.isHotkey(_aoEvent, "alt+s")) {
				this._sendTextMsg(_aoTarget$);
				_aoEvent.stopPropagation();
				_aoEvent.preventDefault();

			} else if (!$.browser.msie && $.isHotkey(_aoEvent, "alt+enter")) {
				_aoTarget$.insertTextToInput("\n");
				//_aoTarget$.val(_aoTarget$.val() + "\n")
				_aoEvent.stopPropagation();
				_aoEvent.preventDefault();

			} else if ($.isHotkey(_aoEvent, "esc")) {
				_aoTarget$.blur();

			} else if ($.isHotkey(_aoEvent, "up") || $.isHotkey(_aoEvent, "down")) {
				if (!_aoTarget$.val()) {
					_aoTarget$.blur();
					_aoEvent.stopPropagation();
					_aoEvent.preventDefault();
				}
			}
		},

		sendMsg: function(_aoEvent, _aoTarget$, _aoContext$) {
			if (_nRecordingStatus == 1) {
				_aoWebMM.widget.Recorder.getObject().jStopRecording();
			} else {
				this._sendTextMsg(_aoContext$.find(".chatInput"));
			}
		},

		showEmojiPanel: function() {
			var _oSelf = this,
				_oContact = _aoWebMM.model("contact").getContact(_sCurUserName);

			_aoWebMM.globalEventSetting({
				globalIntercept: true,
				interceptDom$: $("#emojiPanel").html($.tmpl("editor_emoji_panel", {
					isBrandContact: _oContact && _oContact.isBrandContact()
				})).fadeIn("fast")
			});
		},

		closeEmojiPanel: function() {
			_aoWebMM.globalEventSetting({
				globalIntercept: false
			});
			$("#emojiPanel").fadeOut("fast");
		},

		chooseEmoji: function(_aoEvent) {
			var _oSelf = this;
			_oSelf.closeEmojiPanel();
			setTimeout(function() {
				var _oInput$ = _oSelf.getDom$().find(".chatInput").insertTextToInput("[" + _aoEvent.target.title + "]");
				$.safe(function() {
					if (_isShowEditor(_sCurUserName)) {
						_oInputArea$[0].focus();
					}
				});
			});
		},

		chooseSysEmoji: function(_aoEvent) {
			var _oSelf = this;
			_oSelf.closeEmojiPanel();
			setTimeout(function() {
				var _oInput$ = _oSelf.getDom$().find(".chatInput").insertTextToInput("<" + _aoEvent.target.title + ">");
				$.safe(function() {
					if (_isShowEditor(_sCurUserName)) {
						_oInputArea$[0].focus();
					}
				});
			});
		},

		chooseCustomEmoji: function(_aoEvent, _aoTarget$, _aoContext$) {
			var _sWhich = _aoEvent.target.getAttribute("un"),
				_sMd5 = _aoWebMM.widget.getTuzkiMd5(_sWhich);
			if (_sMd5) {
				this.closeEmojiPanel();
				//				if(!_sCurUserName || !_aoWebMM.model("contact").isContactExisted(_sCurUserName)) {
				//					this.alert(_aoWebMM.getRes("text_choose_conversation"));
				//					return;
				//				}
				_aoWebMM.logic("sendMsg").sendSysCustomEmoji(_sCurUserName, _sMd5);
				this._focusInput();
			}
		},

		chooseEmojiPanel: function(_aoEvent, _aoTarget$, _aoContext$) {
			var _oSelf = this,
				_sCurTagClass = _aoTarget$.attr("un"),
				_oTags$ = _aoContext$.find("a");
			_oTags$.each(function() {
				var _oEl$ = $(this),
					_sTagCls = _oEl$.attr("un");
				if (_sTagCls != _sCurTagClass) {
					_oEl$.removeClass("chooseFaceTab");
					_oSelf.getDom$().find("." + _sTagCls).hide();

				} else {
					_oEl$.addClass("chooseFaceTab");
					_oSelf.getDom$().find("." + _sTagCls).show();
				}
			});
		},

		noHandledClick: function(_aoEvent) {
			var _oTarget = _aoEvent.target,
				_oContainer$ = $("#emojiPanel");
			if (!$.contains(_oContainer$[0], _oTarget) && _oContainer$.isShow()) {
				this.closeEmojiPanel();
			}
		},

		forwardImgMsg: function() {
			Log.d("forwardImgMsg");
		},

		downloadImgMsg: function(_aoData) {
			_aoWin.open(_aoData.src + "&fun=download");
		},

		screenSnap: function() {
			var _oSelf = this;
			if (_aoWebMM.widget.screenSnap.isSupport()) {
				_aoWebMM.widget.screenSnap.capture({
					ok: function() {
						_oSelf._screenSnapUpload();
					}
				});

			} else {
				_oSelf.confirm(_aoWebMM.getRes("text_no_install_plug"), {
					ok: function() {
						_aoWebMM.widget.screenSnap.install();
					}
				});
			}
		},

		_screenSnapUpload: function() {
			var _oSelf = this,
				_nLocalID = $.now(),
				_oPostData = $.extend({
						Msg: {
							FromUserName: _aoWebMM.model("account").getUserName(),
							ToUserName: _sCurUserName,
							Type: 3,
							LocalID: "" + _nLocalID
						}
					},
					_aoWebMM.model("account").getBaseRequest());

			var _oUploadPreview = _aoWin.uploadPreview,
				_bCancel = false;

			_oUploadPreview.setCallback({
				cancel: function() {
					_bCancel = true;
				}
			}).show();

			_aoWebMM.widget.screenSnap.upload(JSON.stringify(_oPostData), function(_aoRet) {
				if (_bCancel) {
					return;
				}

				if (!_aoRet.BaseResponse || _aoRet.BaseResponse && _aoRet.BaseResponse.Ret != 0) {
					_oSelf.alert("Snap error.Please check your network.");
					Log.e("JS Function: _screenSnapUpload, Snap Error.");

				} else {
					_oUploadPreview.setCallback({
						send: function() {
							_oPostData.Msg.MediaId = _aoRet.MediaId;
							_oPostData.Msg.ToUserName = _sCurUserName;
							$.netQueue().send("/cgi-bin/mmwebwx-bin/webwxsendmsgimg?fun=async&f=json&scene=screenshot", _oPostData, {
								onbefore: function() {
									_oSelf._sendImgMsg(_nLocalID);
								},
								onsuccess: function(_aoData) {
									_aoWin[_nLocalID] && _aoWin[_nLocalID](_nLocalID, _aoData.MsgID);

								},
								onerror: function() {
									_aoWin[_nLocalID] && _aoWin[_nLocalID](_nLocalID, -1);
									Log.e("Cgi: /cgi-bin/mmwebwx-bin/webwxsendmsgimg?fun=async&f=json&scene=screenshot, JS Function: WebMM.widget.screenSnap.upload, SendMsgImg error.");
								}
							});
						}
					}).setImg("/cgi-bin/mmwebwx-bin/webwxpreview?fun=preview&mediaid=" + encodeURIComponent(_aoRet.MediaId)).getDom$().attr("mid", _aoRet.MediaId);
				}
			});
		},

		sendPreviewImg: function(_aoEvent, _aoTarget$, _aoContext$) {
			Log.d(_aoContext$.attr("mid"));
		},

		noHandledKeyDown: function(_aoEvent) {
			if ($.isHotkey(_aoEvent, "ctrl+i")) {
				$.safe(function() {
					if (_isShowEditor(_sCurUserName)) {
						_oInputArea$[0].focus();
					}
				});

			} else if ($.isHotkey(_aoEvent, "esc")) {
				this.getDom$().find("textarea")[0].blur();

			} else if ($.isHotkey(_aoEvent, "enter")) {
				this.getDom$().find(".chatSend").click();
			}
		},

		_sendTextMsg: function(_aoTextarea$) {
			var _oSelf = this;

			var _oContent = $.trim(_aoTextarea$.val());
			if (_oContent.length == 0) {
				setTimeout(function() {
					_aoTextarea$.val("")[0].focus()
				});
				return;
			}

			//			if(!_sCurUserName || !_aoWebMM.model("contact").isContactExisted(_sCurUserName)) {
			//				_oSelf.alert(_aoWebMM.getRes("text_choose_conversation"));
			//				return;
			//			}

			_aoTextarea$.val("")[0].focus();
			_aoWebMM.logic("sendMsg").sendText({
				Msg: {
					FromUserName: _aoWebMM.model("account").getUserName(),
					ToUserName: _sCurUserName,
					Type: 1,
					Content: _oContent
				}
			}, {
				onerror: function(_anRet) {
					if (_anRet == "1201") {
						_oSelf.alert(_aoWebMM.getRes("text_exit_chatroom"));
						//_aoWebMM.model("contact").deleteContact(_sCurUserName);
					}
				}
			});
		},

		_getDragFileUploadCallbacks: function() {
			var _oSelf = this;
			return {
				onbefore: function() {},
				onprogress: function(_anLocalId, _anPercent) {
					$("#progressBar_" + _anLocalId).css("width", _anPercent * 98).parent().parent().css("visibility", "visible");
				},
				onsuccess: function(_asToUserName, _asTitle, _aoData) {
					_oSelf._doSendAppMsg(_asToUserName, _asTitle, _aoData);
				},
				onerror: function(_asText, _asStatus, _asToUserName, _anLocalId) {
					_aoWebMM.logic("sendMsg").changeSendingMsgStatus(_asToUserName, _anLocalId, false);
					Log.e("JS Function: _getDragFileUploadCallbacks, DragFile Upload Error. Status: " + _asStatus);
				},
				oncomplete: function(_anLocalId) {
					//$("#progressBar_" + _anLocalId).parent().parent().css("visibility", "hidden");
				}
			};
		},

		_addAppMsg: function(_asFileName, _anFileSize, _asFileUrl) {
			var _nLocalID = $.now();
			if ($.isImg(_asFileName)) {
				this._sendImgMsg(_nLocalID, _asFileUrl);
				return _nLocalID;
			}

			var _oMsg = {
				FromUserName: _aoWebMM.model("account").getUserName(),
				ToUserName: _sCurUserName,
				Type: 6,
				FileName: _asFileName,
				FileSize: _anFileSize,
				Status: 1,
				MsgId: _nLocalID,
				ClientMsgId: _nLocalID,
				LocalID: _nLocalID,
				MsgType: 49,
				CreateTime: Math.floor(_nLocalID / 1000)
			};

			_aoWebMM.model("message").addMessages([_oMsg]);
			return _nLocalID;
		},

		_doSendAppMsg: function(_asToUserName, _asTitle, _aoData) {
			if ($.isImg(_asTitle) && !$.isGif(_asTitle)) {
				this._doSendImgMsgByMedia(_asToUserName, _aoData.LocalId, _aoData.MediaId);
				return;
			}
			if ($.isGif(_asTitle)) {
				_aoWebMM.logic("sendMsg").sendCustomGif(_sCurUserName, _aoData);
				return;
			}

			var _oSelf = this,
				_oMsg = _aoWebMM.model("message").getMsgByLocalId(_asToUserName, _aoData.LocalId);
			if (!_oMsg) {
				return;
			}

			$.extend(_oMsg, {
				MediaId: _aoData.MediaId,
				Content: _oSelf._genAppMsgContent(_asTitle, _aoData.MediaId, _aoData.StartPos)
			});

			_aoWebMM.logic("sendMsg").sendAppMsg({
				"Msg": _oMsg
			});
		},

		_genAppMsgContent: function(_asTitle, _asMediaId, _anSize) {
			return $.tmpl([
				'<appmsg appid="wxeb7ec651dd0aefa9" sdkver="">',
				'<title><![CDATA[<#=title#>]]></title>',
				'<des></des>',
				'<action></action>',
				'<type><#=type#></type>',
				'<content></content>',
				'<url></url>',
				'<lowurl></lowurl>',
				'<appattach>',
				'<totallen><#=totalLen#></totallen>',
				'<attachid><#=attachId#></attachid>',
				'<fileext><#=ext#></fileext>',
				'</appattach>',
				'<extinfo>',
				'</extinfo>',
				'</appmsg>'
			].join(""), {
				title: _asTitle,
				ext: $.getExt(_asTitle),
				type: 6,
				totalLen: _anSize,
				attachId: _asMediaId
			});
		},

		_getDragFileUploadUI: function() {
			var _oSelf = this,
				_nTimer = 0,
				_oDragPanel$ = _oSelf.getDom$().find("#dragPanel"),
				_oDragPanelTxt$ = _oDragPanel$.find("div");

			return {
				ondocover: function() {
					clearTimeout(_nTimer);
					if (_oDragPanel$.css("display") == "none") {
						_oDragPanelTxt$.html(_oDragPanelTxt$.attr("outTxt"));
						_oDragPanel$.show();
					}
				},
				ondocleave: function() {
					_nTimer = setTimeout(function() {
						_oDragPanel$.hide();
					}, 500);
				},

				ontargetover: function() {
					_oDragPanelTxt$.html(_oDragPanelTxt$.attr("inTxt"));
				},

				ontargetdrop: function(_asFileName, _anFileSize, _asFileUrl) {
					//					 if(!_sCurUserName || !_aoWebMM.model("contact").isContactExisted(_sCurUserName)) {
					//						  _oSelf.alert(_aoWebMM.getRes("text_choose_conversation"));
					//						  return;
					//					 }

					_oDragPanel$.hide();
					if (_anFileSize > _nMaxUploadSize) {
						_aoWebMM.ossLog({
							Type: _aoWebMM.Constants.MMWEBWX_UPLOADMEDIA_TOO_LARGE
						});
						_oSelf.alert(_aoWebMM.getRes("text_file_too_large"));
						return false;
					}
					if ($.isImg(_asFileName) && _anFileSize > _nMaxImgUploadSize) {
						_aoWebMM.ossLog({
							Type: _aoWebMM.Constants.MMWEBWX_UPLOADMEDIA_TOO_LARGE
						});
						_oSelf.alert(_aoWebMM.getRes("img_too_large"));
						return false;
					}
					if (_asFileName) {
						return {
							localId: _oSelf._addAppMsg(_asFileName || "", _anFileSize, _asFileUrl),
							toUserName: _sCurUserName
						};
					}
					return true;
				},
				ontargetleave: function() {
					_oDragPanelTxt$.html(_oDragPanelTxt$.attr("outTxt"));
				}
			};
		},

		sendLocalEmoji: function(_aoEvent, _aoTarget$, _aoContext$) {
			//			if(!_sCurUserName || !_aoWebMM.model("contact").isContactExisted(_sCurUserName)) {
			//				this.alert(_aoWebMM.getRes("text_choose_conversation"));
			//				return;
			//			}

			if (!$.isImg(_aoContext$[0].filename.value)) {
				this.alert(_aoWebMM.getRes("text_invalid_img_type"));
				return;
			}

			var _nLocalID = $.now();
			_aoContext$[0].msgimgrequest.value = JSON.stringify($.extend({
					Msg: {
						FromUserName: _aoWebMM.model("account").getUserName(),
						ToUserName: _sCurUserName,
						Type: 3,
						LocalID: "" + _nLocalID
					}
				},
				_aoWebMM.model("account").getBaseRequest()));
			var _sTarget = "actionFrame" + _nLocalID;
			$("<iframe>").css("display", "none").attr("id", _sTarget).attr("name", _sTarget).attr("src", "javascript:;").appendTo("body");
			_aoContext$.attr("target", _sTarget);
			_aoContext$.submit();

			_aoContext$[0].filename.value = "";
			this._sendCustomEmojiMsg(_nLocalID, "", function() {
				$("#actionFrame" + _nLocalID).remove();
			});
		},

		_sendCustomEmojiMsg: function(_anLocalID, _asContent, _afCallback) {
			_aoWebMM.logic("sendMsg").sendEmoji({
				LocalID: _anLocalID,
				ClientMsgId: _anLocalID,
				FromUserName: _aoWebMM.model("account").getUserName(),
				ToUserName: _sCurUserName,
				Content: _asContent || "",
				Type: _aoWebMM.Constants.MM_DATA_EMOJI

			}, _afCallback);
		},

		setChatPanelStatus: function(_abIsMgring) {
			if (!_abIsMgring) {
				this._focusInput();
			}
		},

		_focusInput: function() {
			setTimeout(function() {
				$.safe(function() {
					if (_isShowEditor(_sCurUserName)) {
						_oInputArea$[0].focus();
					}
				});
			}, 500);
		},

		toggleRecoder: function(_aoEvent, _aoTarget$) {
			var _oSelf = this;
			if (!_aoWebMM.widget.Recorder.isSupport()) {
				_oSelf.alert(_aoWebMM.getRes("text_no_flash_alert"));
				return;
			}

			var _oTextInput$ = $("#textInput").toggle();
			var _oRecordInput$ = $("#recordInput").toggle();

			if (_nRecordingStatus == 1) {
				_nRecordingStatus = 0;
				_aoWebMM.widget.Recorder.getObject().jCancelRecording();
				return;
			}

			if (_nRecordingStatus == 2) {
				_nRecordingStatus = 0;
				return;
			}

			_nRecordingStatus = 0;
			var _nMaxTime = 60;

			var _oRecorderCallBack;
			_aoWebMM.widget.Recorder.install(_oRecorderCallBack = {
				onReady: function(_isRetry) {
					var _nRet = _aoWebMM.widget.Recorder.getObject().jIsMicroPhoneAvailable();
					_oRecordInput$[0].innerHTML = ($.tmpl("voice_recorder", {
						Status: _nRet
					}));

					if (_nRet == -2) {
						return;

					} else if (_nRet == -1) {
						if (!_isRetry) {
							_aoWebMM.widget.screenCentral($(_aoWebMM.widget.Recorder.getObject()).parent());
							_aoWebMM.widget.Recorder.getObject().jShowSecuritySetting(1);
						} else {
							_oSelf.cancelRecord();
						}

					} else {
						_aoWebMM.widget.Recorder.getObject().jStartRecording(_nMaxTime * 1000, location.protocol + "//" + location.host + "/cgi-bin/mmwebwx-bin/webwxuploadvoice?tousername=" + _sCurUserName + "&type=" + _aoWebMM.Constants.EN_INFORMAT_WAV, _sCurUserName);
					}
				},
				onPermissionChange: function(_abGranted) {},
				onSecurityPanelClose: function() {
					$(_aoWebMM.widget.Recorder.getObject()).parent().css("left", -1000);
					_oRecorderCallBack.onReady(true);
				},
				onRecordStart: function() {
					_nRecordingStatus = 1;
				},
				onRecordError: function() {
					Log.e("JS Function: WebMM.widget.Recorder.install, Record Error.");
				},
				onRecordStop: function() {},
				onRecordFinish: function(_asUserName, _anLocalId) {
					if (_nRecordingStatus == 1) {
						_oSelf._sendVoice(_asUserName, _anLocalId);
						_oTextInput$.toggle();
						_oRecordInput$.toggle();
						_nRecordingStatus = 0;
					}
				},
				onSendError: function(_asUserName, _anLocalId) {
					Log.e("JS Function: WebMM.widget.Recorder.install, Send Record Msg Error.");
					if (_nRecordingStatus == 1) {
						_oSelf.cancelRecord();
						_oSelf.alert("Record Error.");
					} else {
						_aoWebMM.logic("sendMsg").finishSentAudio(_asUserName, _anLocalId);
					}
				},
				onSendProgress: function() {},
				onSendFinish: function(_aoResp, _asUserName, _anLocalId) {
					_aoWebMM.logic("sendMsg").finishSentAudio(_asUserName, _anLocalId, (JSON.parse(_aoResp.data) || {}).MsgId);
				},
				onActivityTime: function(_anTime, _anVol) {
					_nRecordActivityTime = _anTime;
					var _oInfo$ = _oRecordInput$.find(".recordInfo");
					_oInfo$.html(_oInfo$.attr("recording"));
					var _oVol$ = _oRecordInput$.find(".recordVol");
					_oVol$.find("span").each(function() {
						this.style.height = _anVol / 100 * 20 * Math.random() + "px";
					});
					_oRecordInput$.find(".recordTime").html(Math.floor(_anTime / 1000) + "/" + _nMaxTime);
				}
			});
		},

		cancelRecord: function() {
			_nRecordingStatus = 2;
			_oSendVoiceIcon$.click();
			_aoWebMM.widget.Recorder.getObject().jCancelRecording();
		},

		_sendVoice: function(_asUserName, _anLocalId) {
			_aoWebMM.logic("sendMsg").sendAudio(_asUserName, _nRecordActivityTime, _anLocalId);
		},

		cancelUploadByLocalId: function(_asLocalId) {}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	var _sCurUserName = "",
		_sRenderUserName = "",
		_bIsChatroom = false;

	var _oUserSec$, _oOpSec$;
	var _bIsVisible = false;

	_aoWebMM.createCtrl("chat_chattingmgr", {

		//@override
		init: function() {
			var _oSecs$ = this.getDom$().find(".section");
			_oUserSec$ = _oSecs$.first().children();
			_oOpSec$ = _oSecs$.last();

			_oUserSec$.scrollable();
		},

		//@override
		active: function(_aoQuery) {
			_sCurUserName = _aoQuery.userName;

			if (!_sCurUserName) {
				return;
			}

			if (!_bIsVisible) {
				this._render("");
			}
		},

		_render: function(_asCurUserName) {
			if (_asCurUserName == _sRenderUserName && !_bIsVisible) {
				return;
			} else {
				_sRenderUserName = _asCurUserName;
			}

			var _oSelf = this;
			_bIsChatroom = _aoWebMM.util.isRoomContact(_asCurUserName);
			var _oContact = _aoWebMM.model("contact").getContact(_asCurUserName),
				_oMemberList = [];

			if (!_oContact) {
				_oUserSec$.html($.tmpl("chat_detail_panel", {
					IsChatroom: _bIsChatroom,
					NickName: "",
					Contacts: []
				}));
				return;
			}

			if (_bIsChatroom) {
				for (var i = 0, len = _oContact.MemberList && _oContact.MemberList.length; i < len; i++) {
					var _oMem = _oContact.MemberList[i],
						_oContact4Mem = _aoWebMM.model("contact").getContact(_oMem.UserName);
					if (_oContact4Mem) {
						if (!_oContact4Mem.RemarkName && _oMem.DisplayName) { //����û���ǳƲ�����Ⱥ�ǳƣ���ʾȺ�ǳ�
							var _oShowContact = {};
							$.extend(_oShowContact, _oContact4Mem, {
								DisplayName: _oMem.DisplayName
							});
							_oMem = _oShowContact;
						} else {
							_oMem = _oContact4Mem;
						}
					}
					_oMemberList.push(_oMem);
				}
			} else {
				_oMemberList.push(_oContact);
			}

			_oUserSec$.html($.tmpl("chat_detail_panel", {
				IsChatroom: _bIsChatroom,
				IsChatroomOwner: _oContact.isRoomOwner(),
				NickName: _oContact.NickName,
				Contacts: _oMemberList
			}));
			if (_bIsChatroom) {
				var _oTitleName$ = this.getDom$().find(".partiTitleName");
				_oTitleName$.html(_oContact.NickName || _oTitleName$.attr("noname"));
			}

			$("#chatting_mgr_operator").css("visibility", _bIsChatroom ? "visible" : "hidden");
		},

		contactAdded: function(_aoContact) {
			this.contactUpdated(_aoContact);
		},

		contactUpdated: function(_aoContact) {
			if (!_bIsVisible) {
				return;
			}

			if (_aoContact.UserName == _sCurUserName) {
				this._render(_sCurUserName);

			} else if (_aoWebMM.util.isRoomContact(_sCurUserName)) {
				var _oCurContact = _aoWebMM.model("contact").getContact(_sCurUserName),
					_oMembers = (_oCurContact || {}).MemberList || [];
				for (var i = 0, len = _oMembers.length; i < len; i++) {
					if (_oMembers[i].UserName == _aoContact.UserName) {
						var _oPersonDom$ = $("#personal_info_" + _aoContact.UserName);
						if (_oPersonDom$.length) {
							_oPersonDom$.replaceWith($.tmpl("chat_detail_contact_item", {
								IsChatroom: true,
								IsChatroomOwner: _oCurContact.isRoomOwner(),
								Contact: _aoContact
							}));
						}
						return;
					}
				}
			}
		},

		chatroomMemberFocus: function(_aoEvent, _aoTarget$) {},

		quitChatroom: function(_aoEvent, _aoTarget$) {
			this.confirm(_aoWebMM.getRes("text_quit_chatroom_alert"), {
				ok: function() {
					_aoWebMM.logic("modChatroom").quit(_sCurUserName);
				},
				cancel: function() {}
			});
		},

		modChatroomTopic: function(_aoEvent, _aoTarget$) {
			var _oSelf = this,
				_oContact = _aoWebMM.model("contact").getContact(_sCurUserName);
			this.getDom$().find(".chatDetailsTitle input").val(_oContact.NickName)
				.show().moveToInputEnd()
				.off("keyup").on("keyup", function(_aoE) {
					if ($.isHotkey(_aoE, "enter") || $.isHotkey(_aoE, "esc")) {
						if ($.trim(this.value)) {
							_aoTarget$.html($.trim(this.value) || _aoTarget$.attr("noname"));
							_oSelf._modTopic(this.value);
						}
						this.style.display = "none";
					}
					if ($.getAsiiStrLen($.trim(this.value)) > 32) {
						this.value = $.trim(this.value).substring(0, 32);
					}

				}).off("blur").on("blur", function() {
					if ($.trim(this.value)) {
						_aoTarget$.html($.trim(this.value) || _aoTarget$.attr("noname"));
						_oSelf._modTopic(this.value);
					}
					this.style.display = "none";
				});
		},

		_modTopic: function(_asVal) {
			var _oContact = _aoWebMM.model("contact").getContact(_sCurUserName),
				_sTopic = $.trim(_asVal);
			if (_sTopic != _oContact.DisplayName) {
				_oContact.NickName = _sTopic;
				_aoWebMM.logic("modChatroom").modTopic(_sCurUserName, _sTopic);
			}
		},

		createChatroom: function(_aoEvent, _aoTarget$) {
			$.hash(($.hash() || "chat") + "/createchatroom?userName=" + _sCurUserName + "&func=add");
			return false;
		},

		addChatroomMember: function(_aoEvent, _aoTarget$) {},

		delChatroomMember: function(_aoEvent, _aoTarget$) {
			var _sDelUserName = _aoTarget$.attr("un");
			_aoWebMM.logic("modChatroom").delMember(_sCurUserName, _sDelUserName);
		},

		setChatPanelStatus: function(_abIsMgring) {
			_bIsVisible = _abIsMgring;
			if (_bIsVisible) {
				this._render(_sCurUserName);
			}
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	var _sCurMediaId = "",
		_oCurCropImg = new Image();

	_aoWebMM.createCtrl("modifyavatar", {
		init: function() {
			var _oSelf = this;
			_aoWin.uploadAvatarImg = function(_asRet, _aoData) {
				if (_asRet == "0" && _oSelf._moCropper) {
					var _sMediaId = _aoData.SecondaryMediaId || _aoData.MediaId;
					_sCurMediaId = _aoData.MediaId;
					_oCurCropImg.onload = function() {
						_oSelf._moCropper.setImg("/cgi-bin/mmwebwx-bin/webwxpreview?fun=preview&mediaid=" + _sMediaId);
						_oCurCropImg.onload = null;
					}
					_oCurCropImg.src = "/cgi-bin/mmwebwx-bin/webwxpreview?fun=preview&mediaid=" + _sMediaId;
				}
				_oSelf.getDom$().find(".loadingMask").hide();
			}
		},

		//@override
		active: function(_aoQuery) {
			var _oSelf = this,
				_sUserName = _aoWebMM.model("account").getUserName();

			_oSelf.popupWindow(_aoWebMM.getRes("modify_avatar_title"), $.tmpl("modify_avatar_content", {
				HeadImgFlag: _aoWebMM.model("account").getUserInfo().HeadImgFlag,
				avatar: _aoWebMM.util.getNormalAvatarUrl(_sUserName) + "&type=big"
			}), (!$.browser.msie) && $("#accountAvatarWrapper"), {
				left: 150
			});

			var _oEditBox$ = _oSelf.getDom$().find(".editBox"),
				_oPreviewBox$ = _oSelf.getDom$().find(".previewBox");
			this._moCropper = new QMImgCropper(_oEditBox$[0], {
				previewDoms: _oPreviewBox$
			});
			this._moCropper.setImg(_aoWebMM.util.getNormalAvatarUrl(_sUserName) + "&type=big");
		},

		inactive: function() {
			$("#mask").off("click").hide();
			_oCurCropImg.src = null;
			this._moCropper = null;
			_sCurMediaId = "";
		},

		close: function() {
			$.hash($.hash().replace("\/modifyavatar", ""));
		},

		returnPre: function() {
			var _oSelf = this;
			_oSelf.getDom$().find(".preAvartor").fadeIn(function() {
				$.transform(_oSelf.getDom$().find(".avatarCntr"), _oSelf.getDom$().find(".bigAvatarWrapper"));
			});
		},

		gotoModify: function(_aoEvent, _aoTarget$, _aoContext$) {
			var _oSelf = this,
				_fMod = function() {
					var _oPreviewBox$ = _oSelf.getDom$().find(".previewBox"),
						_oBigAvatar$ = _oSelf.getDom$().find(".avatarCntr");

					$.transform(_oBigAvatar$, _oPreviewBox$, function() {
						_aoContext$.fadeOut();
					});
				};
			//        if (_aoWebMM.model("account").isHigherVer()) {
			//            _oSelf.confirm(_aoWebMM.getRes("modify_avatar_tips"), {
			//                ok : _fMod
			//            }, "modifyAvatarTips");
			//        } else {
			_fMod();
			//        }
		},

		uploadAvatarImg: function(_aoEvent, _aoTarget$, _aoContext$) {
			var _oForm$ = _aoContext$,
				_sFileName = _oForm$[0].filename.value;
			if (!$.trim(_sFileName)) {
				return;
			}

			if (!$.isImg(_sFileName)) {
				this.alert(_aoWebMM.getRes("modify_avatar_upload_valid"));
				return;
			}

			var _oSelf = this,
				_nLocalID = $.now(),
				_oPostData = $.extend({
						Msg: {
							FromUserName: _aoWebMM.model("account").getUserName(),
							ToUserName: "",
							Type: 3,
							LocalID: "" + _nLocalID
						}
					},
					_aoWebMM.model("account").getBaseRequest());
			_oForm$[0].msgimgrequest.value = JSON.stringify(_oPostData);
			_oForm$.submit();

			this.getDom$().find(".loadingMask").show();
		},

		cropper: function(_aoEvent, _aoTarget$, _aoContext$) {
			var _oSelf = this,
				_sImgPath = this._moCropper.getImg(),
				_oPos = this._moCropper.getPos();
			_aoWebMM.logic("modifyavatar").modify(_sCurMediaId, _oPos, {
				onsuccess: function() {
					_oSelf.getDom$().find(".loadingMask").hide();
					_oSelf.showTips(_aoTarget$.attr("succTips"), true, {
						offset: {
							left: 150
						}
					});

					_oSelf.close();
				},
				onerror: function() {
					_oSelf.getDom$().find(".loadingMask").hide();
					_oSelf.showTips(_aoTarget$.attr("errTips"), false, {
						offset: {
							left: 150
						}
					});
				}
			});

			_oSelf.getDom$().find(".loadingMask").show();
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	var _oCurContact;

	_aoWebMM.createCtrl("popupcontactprofile", {
		init: function() {},
		//@override
		active: function(_aoQuery) {
			var _oSelf = this,
				_bIsSelf = _aoWebMM.util.isSelf(_aoQuery.userName);

			if (_aoQuery.msgId) {
				_oCurContact = _aoWebMM.model("message").getMsgById(_aoQuery.userName, _aoQuery.msgId);
				if (_oCurContact) {
					var _oCon = _oCurContact.Contact,
						_sTicket = _oCurContact.Ticket; //if _cCon's Ticket is empty, use Msg's Ticket
					_oCurContact = $.extend(_oCurContact, _oCon);
					if (!_oCurContact.Ticket) _oCurContact.Ticket = _sTicket;
				}
			} else {
				_oCurContact = _aoWebMM.model("contact").getContact(_aoQuery.userName);
			}

			if (!_oCurContact) {
				_oSelf.back();
				return;
			}

			_oSelf.popupWindow(_aoWebMM.getRes("text_friend_detai_info"), $.tmpl("popupConatctProfile", {
				Avatar: _oCurContact.HeadImgUrl,
				MsgType: _oCurContact.MsgType,
				MsgId: _oCurContact.MsgId,
				AttrStatus: _oCurContact.AttrStatus,
				Contact: _oCurContact,
				IsSelf: _bIsSelf
			}), null, {
				left: 150
			}, {
				lightMask: false,
				clickMaskHide: false,
				onhide: function() {
					_oSelf.back();
				}
			});
			if (_oCurContact.MsgType == _aoWebMM.Constants.MM_DATA_VERIFYMSG) {
				_oSelf.getDom$().find(".valiMesg").html($.tmpl("valiMesg", {
					Contact: _oCurContact,
					History: _oCurContact.History || []
				}));
			}

			//photoalbum
			/*var _nShowNum = 3,
            _fDataLoad = function(_aMeiaList){
                $("#showPhotoAlbum").html($.tmpl("profile_show_photoAlbum",{
                    MediaList:_aMeiaList,
                    showNum: _nShowNum
                }));
            };
        if (_aoWebMM.logic("photoalbum").getPhotoAlbumByUserName(_oCurContact.UserName)) {
            _fDataLoad(_aoWebMM.model("photoalbum").getMediaListByUserName(_oCurContact.UserName));
        }else if(_oCurContact.hasPhotoAlbum && _oCurContact.hasPhotoAlbum()){
            _aoWebMM.logic("photoalbum").requestPhotoAlbumByUserName(_oCurContact.UserName, {
                onsuccess:function () {
                    _fDataLoad(_aoWebMM.model("photoalbum").getMediaListByUserName(_oCurContact.UserName));
                }
            });
        }*/
		},

		inactive: function() {
			$("#mask").off("click").hide();
		},

		close: function() {
			$.history.back();
		},

		contactAdded: function(_aoContact) {
			this.contactUpdated(_aoContact);
		},

		contactUpdated: function(_aoContact) {
			if (_oCurContact && _aoContact.UserName == _oCurContact.UserName) {
				var _oDom$ = this.getDom$();
				if (_aoContact.isContact()) {
					var _oBtns$ = _oDom$.find(".nextStep input:button");
					if (_oBtns$.length > 1) {
						_oBtns$.first().show();
						_oBtns$.last().hide();
					}
				}

				if ((_aoContact.ContactFlag & _aoWebMM.Constants.MM_CONTACTFLAG_BLACKLISTCONTACT)) {
					var _oBlackBtn = _oDom$.find(".blackContact");
					_oBlackBtn.first().show();
					_oBlackBtn.last().hide();
				}

				if (_aoContact.isContact() && this.getDom$().find(".remarkSection").is(":hidden")) {
					this.getDom$().find(".remarkSection").show();
				}
			}
		},

		messageUpdated: function(_aoMsg) {
			if (_oCurContact && _aoMsg.MsgType == _aoWebMM.Constants.MM_DATA_VERIFYMSG && (_aoMsg.RecommendInfo && _aoMsg.RecommendInfo.UserName == _oCurContact.UserName)) {
				this.getDom$().find(".valiMesg").html($.tmpl("valiMesg", {
					Contact: _oCurContact,
					History: _oCurContact.History || []
				}));
			}
		},

		_showLoading: function(_abShow) {
			this.getDom$().find(".loadingMaskWind")[_abShow ? "show" : "hide"]();
		},

		verify: function(_aoEvent, _aoTarget$, _aoContext$) {
			var _oSelf = this;
			if (_oCurContact) {
				var _nOpCode;
				if (_oCurContact.MsgType == _aoWebMM.Constants.MM_DATA_VERIFYMSG) {
					_nOpCode = _aoWebMM.Constants.MM_VERIFYUSER_VERIFYOK;

				} else if (_oCurContact.AttrStatus & WebMM.Constants.MM_STATUS_VERIFY_USER) {
					_aoContext$.hide().prev().show().find("input:text").focus();
					return;

				} else {
					_nOpCode = _aoWebMM.Constants.MM_VERIFYUSER_ADDCONTACT;
				}

				_aoWebMM.logic("userverify").verify(_oCurContact.UserName, _nOpCode, "", _oCurContact.Contact && _oCurContact.Contact.scene || 0, {
					onsuccess: function() {
						_oSelf._showLoading(false);
						_oSelf.showTips(_aoTarget$.attr("addSuccTips"), true, {
							offset: {
								left: 150
							}
						});
					},
					onerror: function(_anRetCode) {
						if (_anRetCode == 1206) {
							_aoContext$.hide().prev().show().find("input:text").focus();

						} else {
							_oSelf._showLoading(false);
							_oSelf.showTips(_aoTarget$.attr("addErrTips"), false, {
								offset: {
									left: 150
								}
							});
						}
					}
				}, _oCurContact.Ticket);
				_oSelf._showLoading(true);
			}
		},

		enterRequest: function(_aoEvent, _aoTarget$, _aoContext$) {
			if ($.isHotkey(_aoEvent, "enter")) {
				this.sendRequest(_aoEvent, _aoContext$.find("input:button").first(), _aoContext$);
			} else {
				if ($.getAsiiStrLen($.trim(_aoTarget$.val())) > 40) {
					_aoTarget$.val($.subAsiiStr(_aoTarget$.val(), 40));
					_aoEvent.preventDefault();
				}
			}
		},

		sendRequest: function(_aoEvent, _aoTarget$, _aoContext$) {
			var _oSelf = this;
			if (_oCurContact) {
				var _sVerifyInfo = $.trim(_aoContext$.find("input:text").val());
				_aoWebMM.logic("userverify").verify(_oCurContact.UserName, _aoWebMM.Constants.MM_VERIFYUSER_SENDREQUEST, _sVerifyInfo, _oCurContact.Contact && _oCurContact.Contact.scene || 0, {
					onsuccess: function() {
						_oSelf._showLoading(false);
						_oSelf.showTips(_aoTarget$.attr("addSuccTips"), true, {
							offset: {
								left: 150
							}
						});
						_aoContext$.hide().next().show();
					},
					onerror: function() {
						_oSelf._showLoading(false);
						_oSelf.showTips(_aoTarget$.attr("addErrTips"), false, {
							offset: {
								left: 150
							}
						});
					}
				}, _oCurContact.Ticket);
				_oSelf._showLoading(true);
			}
		},

		cancelRequest: function(_aoEvent, _aoTarget$, _aoContext$) {
			_aoContext$.hide().next().show();
		},

		showHDAvatar: function(_aoEvent, _aoTarget$, _aoContext$) {
			var _oSelf = this,
				_oHDAvatarContainer$ = _oSelf.getDom$().find(".hdAvatarContainer"),
				_oHDImg$ = _oHDAvatarContainer$.find("img"),
				_sHDAvatarUrl = _aoTarget$.attr("src") + "&type=big";

			function _tansform() {
				var _oRawPos = _aoTarget$.position();
				_oHDImg$.css({
					"width": _aoTarget$.width(),
					"height": _aoTarget$.height(),
					"left": _oRawPos.left,
					"top": _oRawPos.top
				});
				_oHDAvatarContainer$.fadeIn(function() {});
			}

			if (_oHDImg$.attr("src")) {
				_tansform();
				return;
			}
			_oHDImg$[0].onload = function() {
				_tansform();
			};
			_oHDImg$.attr("src", _sHDAvatarUrl);
		},

		returnToProfile: function(_aoEvent, _aoTarget$, _aoContext$) {
			_aoContext$.fadeOut();
		},

		showPhotoAlbum: function(_aoEvent, _aoTarget$, _aoContext$) {
			this.close();
			var _sUserName = _aoTarget$.attr("userName");
			$.hash(($.hash() || "chat") + "/popupphotoalbum?userName=" + _sUserName);
			return false;
		},

		_editTextWithInput: function(_target$, _input$, _len, _callback) {
			var _oldText = _target$.text() || _target$.val(),
				_len = _len || 16;

			_target$.hide();
			if (_oldText) _input$.val(_oldText);
			_input$.show();
			$.selectText(_input$[0]);

			function edited() {
				var _val = $.trim(_input$.val());
				if (_val == _oldText) {
					_input$.hide();
					_target$.show();
					_callback && _callback.onerror && _callback.onerror(_val);
					return;
				}
				if ($.getAsiiStrLen(_val) > _len) {
					_val = $.stripStr(_val, _len);
				}

				_input$.val(_val).hide();
				_target$.text(_val).val(_val).show();
				_callback && _callback.onsuccess && _callback.onsuccess(_val);
			}

			$.setInputLength(_input$, _len).off("keyup").on("keyup", function(event) {
				if ($.isHotkey(event, "enter") || $.isHotkey(event, "esc")) {
					edited();
				}
			}).off("blur").on("blur", function() {
				edited();
			});
		},

		editRemarkName: function(_aoEvent, _aoTarget$, _aoContext$) {
			var _input$ = _aoTarget$.siblings("input");
			if (!_input$.val()) _input$.val(_input$.attr("nickname"));
			_aoTarget$.hide();
			this._editTextWithInput(_aoTarget$.find("span").first(), _aoTarget$.siblings("input"), 32, {
				onsuccess: function(_val) {
					_aoTarget$.show();
					_aoWebMM.logic("oplog").setRemarkName(_oCurContact.UserName, _val);
					if (_val == "") {
						_aoTarget$.find("span.editRemarkNameIcon").addClass("show");
					} else {
						_aoTarget$.find("span.editRemarkNameIcon").removeClass("show");
					}
				},
				onerror: function() {
					_aoTarget$.show();
				}
			});
		},

		onEditNickName: function(_aoEvent, _aoTarget$, _aoContext$) {
			this._editTextWithInput(_aoTarget$, _aoTarget$.siblings("input"), 16, {
				onsuccess: function(_val) {
					//                _aoWebMM.logic("oplog").setRemarkName(_oCurContact.UserName, _val);
				}
			});
		},

		onEditSignature: function(_aoEvent, _aoTarget$, _aoContext$) {
			this._editTextWithInput(_aoTarget$, _aoTarget$.siblings("textarea"), 30, {
				onsuccess: function(_val) {
					//                _aoWebMM.logic("oplog").setRemarkName(_oCurContact.UserName, _val);
				}
			});
		},

		blackContact: function(_aoEvent, _aoTarget$, _aoContext$) {
			this.confirm($.tmpl("black_contact_confirm"), {
				ok: function(_aoContext$) {
					_aoWebMM.logic("oplog").blackContact(_oCurContact.UserName, _aoWebMM.Constants.MMWEBWX_OPLOG_BLACKCONTACT_ADD);
				}
			});
		},

		replyVerifyMsg: function(_aoEvent, _aoTarget$, _aoContext$) {
			var _iMsgId = _aoTarget$.attr("msgid"),
				_sTicket = _aoTarget$.attr("ticket"),
				_sOpCode = _aoTarget$.attr("opcode");
			_aoWebMM.util.verificationPopup("verification_reply", _oCurContact, this, {
				onsuccess: function(_asText) {
					var _oMsg = _aoWebMM.model("message").getMsgById("fmessage", _iMsgId),
						_oHistory = _oMsg.History;
					_oHistory.push("1" + _asText); //1 shows that the msg is send by me
					_oMsg.update(_oHistory);
				}
			}, {
				notEmpty: true,
				type: (_sOpCode == _aoWebMM.Constants.MM_VERIFYUSER_SENDREQUEST || _sOpCode == _aoWebMM.Constants.MM_VERIFYUSER_SENDERREPLY) ? _aoWebMM.Constants.MM_VERIFYUSER_RECVERREPLY : _aoWebMM.Constants.MM_VERIFYUSER_SENDERREPLY,
				// type : 6,
				ticket: _sTicket
			});
		}

	});

})(jQuery, WebMM, this);
(function($, _aoWebMM, _aoWin, _aoUndefined) {
	var _sCurUserName = "",
		_sCurKeyWord = "",
		_bIsContactListReady = false,
		_bNeedShowContactList = false,
		_bHadShowContactList = false,
		_bIsPanelShow = false,
		_bContactInitInVisible = true;

	_aoWebMM.createCtrl("chat_contactListContent", {

		//@override
		init: function() {
			var _oSelf = this;
			_oSelf.getDom$().scrollable({
				callback4stop: function() {
					_oSelf._contactImgLoad();
				}
			});
		},

		//@override
		active: function(_aoQuery) {
			_sCurUserName = _aoQuery.userName;

			if (!_bIsPanelShow) return;

			this.getDom$().find("a.activeColumn").removeClass("activeColumn");
			var _sSelUserName = _aoQuery.child && _aoQuery.child.userName;
			if (_sSelUserName) {
				$("#con_item_" + $.getAsciiStr(_sSelUserName)).addClass("activeColumn");
			}
		},

		contactListReady: function(_abInit) {
			_bIsContactListReady = true;
			if (_bNeedShowContactList) {
				this._contactListRender(false);
			}
		},

		needShowContactList: function(_abShow) {
			_bNeedShowContactList = true;
			_bIsPanelShow = _abShow;
			if (_abShow) {
				this._contactListRender(!_bIsContactListReady);
			}
		},

		contactUpdated: function(contact) {
			$("#con_item_{0}".format($.getAsciiStr(contact.UserName))).replaceWith(
				$.tmpl("contactItem", {
					contact: contact
				})
			);
		},

		_contactListRender: function(_abInit, _abForce) {
			if (!_bHadShowContactList || _abForce) {
				var _oContacts = _aoWebMM.model("contact")
					.getAllFriendContact(_sCurKeyWord, !_sCurKeyWord, {}, !_sCurKeyWord),
					_oStarContacts = !_sCurKeyWord && _aoWebMM.model("contact").getAllStarContact() || [],
					_oRoomContacts = _aoWebMM.model("contact").getAllFriendChatroomContact(_sCurKeyWord) || [],
					_oBrandContacts = !_sCurKeyWord && _aoWebMM.model("contact").getAllBrandContact() || [];

				var _oSelf = this,
					_sHtml = $.tmpl("contactlist", {
						init: _abInit,
						curUserName: _sCurUserName,
						isSearch: !! _sCurKeyWord,
						contacts: _oContacts,
						starContacts: _oStarContacts,
						roomContacts: _oRoomContacts,
						brandContacts: _oBrandContacts,
						invisible: _bContactInitInVisible
					});

				_bContactInitInVisible = false;
				setTimeout(function() {
					_oSelf.getDom$().find("#contactListContainer").html(_sHtml);
					_oSelf._contactImgLoad();
				});

				if (!_abInit) {
					_bHadShowContactList = true;
				}
			}
		},

		_contactImgLoad: function() { //延迟加载联系人列表的头像
			var _oSelf = this;
			debug(function() {
				console.log("Load Img");
			});
			var _oFrame$ = _oSelf.getDom$().parents(".createNewChat"),
				_nFrameOffsetTop = _oFrame$.offset().top,
				_nFrameHeight = _oFrame$.outerHeight(true);
			_oSelf.getDom$().find("a.friendDetail").each(function() {
				var this$ = $(this);
				if (this$.data("loadedImg")) return;

				var top = this$.offset().top;
				if (top + 50 >= _nFrameOffsetTop && top < _nFrameOffsetTop + _nFrameHeight * 2) { //50为一个联系人列表项的高度
					var img$ = this$.find("img");
					img$.attr("src", img$.attr("hide_src"));
					this$.data("loadedImg", true);
				}
			});
		},

		contactListSearch: function(_asSearchWord) {
			_sCurKeyWord = _asSearchWord;
			this._contactListRender(false, true);
			this.getDom$().parent().scrollTop(0);
		},

		toggleBrandList: function(_aoEvent, _aoTarget$) {
			_aoTarget$.next(".groupDetail").toggle();
			//_aoTarget$.find(".lapIcon,.lapedIcon").toggleClass("lapIcon").toggleClass("lapedIcon");
			_aoTarget$.find(".lapIcon").toggleClass("lapedIcon");
		}
	});

})(jQuery, WebMM, this);
(function($, _aoWebMM) {
	_aoWebMM.createCtrl("feedback", {
		// @override
		active: function(_aoQuery) {
			this.popupWindow(this.getDom$().attr("_title"), $.tmpl("feedback", {}), null, {
				left: 150
			});
			this.getDom$().find(".left").html(this.getDom$().find("textarea").focus().attr("maxlength"));
		},

		inactive: function() {
			$("#mask").off("click").hide();
		},

		close: function() {
			$.history.back();
		},

		edit: function(event) {
			return false;
		},

		send: function(event, target$, context$) {
			var _textarea$ = context$.find("textarea"),
				_content = _textarea$.val().trim();
			if (_content) {
				_aoWebMM.logic("feedback").send(_content);
				this.showTips(_textarea$.attr("tips"), true);
			}

			this.close();
		}
	});

})(jQuery, WebMM);