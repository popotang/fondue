// ==UserScript==
// @name			微信关键字提醒
// @namespace		http://weibo.com/tangshuang
// @license			MIT License
// @description		微信网页版聊天关键字提醒，当出现关键字的时候标题栏强提示
// @version			1.0
// @author			@popotang
// @grant			unsafeWindow
// @grant			GM_getValue
// @grant			GM_setValue
// @include			https://wx.qq.com/
// @run-at document-end
// ==/UserScript==

var myWin = (function() {
	var a;
	try {
		a = unsafeWindow === window ? false : unsafeWindow;
	} finally {
		return a || (function() {
			var e = document.createElement('p');
			e.setAttribute('onclick', 'return window;');
			return e.onclick();
		}());
	}
}());

var $ = myWin.$;
var $$ = {};
$$.storage = {};

if (!GM_getValue || (GM_getValue.toString && GM_getValue.toString().indexOf("not supported") > -1)) {
	$$.storage.get = function(name, defaultValue) {
		return localStorage.getItem(name) || defaultValue;
	};
	$$.storage.save = function(name, value) {
		localStorage.setItem(name, value);
		return this;
	};
	$$.storage.remove = function(name) {
		localStorage.removeItem(name);
		return this;
	}
} else {
	$$.storage.get = function(name, defaultValue) {
		return GM_getValue(name, defaultValue);
	};
	$$.storage.save = function(name, value) {
		GM_setValue(name, value);
		return this;
	};
	$$.storage.remove = function(name) {
		GM_deleteValue(name);
		return this;
	}
}

var msgModel = null;
$$.msg = {
	messageList: {},
	keywords: (function() {
		return $$.storage.get("popo_wechat_keyword");
	})(),
	getKeyMsgs: function(userList) {
		// var keywords ="web";
		if (!$$.msg.keywords) return;
		var keywordArr = $$.msg.keywords.split("|"),
			keyMsgs = [];
		for (var i = 0, len = userList.length; i < len; i++) {
			var msgs = msgModel.getMessages(userList[i]);
			for (var msgLen = msgs.length, j = msgLen - 1; j > 0; j--) {
				for (var k = 0; k < keywordArr.length; k++) {
					if ( !! msgs[j].unread && msgs[j].Content.indexOf(keywordArr[k]) >= 0) {
						if (typeof $$.msg.messageList[msgs[j].FromUserName] == "undefined") {
							$$.msg.messageList[msgs[j].FromUserName] = [];
						}
						$$.msg.messageList[msgs[j].FromUserName].push(msgs[j]);
						keyMsgs.push(msgs[j]);
						break;
					}
				}
			}
		}
		return keyMsgs;
	},
	init: function() {
		var titleTimer = null;
		if (!myWin.WebMM) {
			setTimeout($$.msg.init, 5000);
			return;
		}


		msgModel = myWin.WebMM.model("message");
		var userlist = msgModel.getQueueUserNames();
		if (userlist.length == 0) {
			setTimeout($$.msg.init, 5000);
			return;
		}
		$$.dom.addConfigBtn();
		setInterval(function() {
			var keyMsgs = $$.msg.getKeyMsgs(userlist);
			if ( !! keyMsgs && keyMsgs.length > 0) {
				clearInterval(titleTimer);
				titleTimer = null;
				console.log("发现关键语句 " + keyMsgs.length + " 条");
				$.each(keyMsgs, function(k, v) {
					$("[msgid='" + k.MsgId + "'] .cloudContent").css("background", "#ffff77").css("borderColor", "#ffff77")
				});
				titleTimer = setInterval(function() {
					document.title = (document.title == "发现关键词" ? "微信网页版" : "发现关键词");
				}, 400);
			} else {
				clearInterval(titleTimer);
				titleTimer = null;
				document.title = "微信网页版";
			}
		}, 5000);
	}
}


$$.dom = {
	addConfigBtn: function() {
		var $configBtn = $('<a href="javascript:;" style="color:#ffffff;font-size:14px;margin-left:4px;">提醒关键字</a>').appendTo($("#profile .info"));
		$configBtn.on("click", function() {
			var str = prompt("请输入监听关键字，多个关键字用|符号隔开", $$.msg.keywords);
			if ( !! str && str.length > 0) {
				$$.storage.save("popo_wechat_keyword", str);
			}
		})
	}
}

$$.msg.init();