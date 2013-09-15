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

var myWin = (function(){
    var a;
    try {
        a = unsafeWindow === window ? false : unsafeWindow;
    } finally {
        return a || (function(){
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

var MsgMgr=null;
	$$.msg = {
		getWeChatUserList: function() {
			return MsgMgr.getQueueUserNames();
		},
		getKeyMsgs: function(userList) {
			// var keywords ="web";
			var keywords = $$.storage.get("popo_wechat_keyword");
			if (!keywords) return;
			var keywordArr = keywords.split("|"),
				keyMsgs = [];
			for (var i = 0, len = userList.length; i < len; i++) {
				var msgs = MsgMgr.getMessages(userList[i]);
				for (var msgLen = msgs.length, j = msgLen - 1; j > 0; j--) {
					// if ( ! msgs[j].unread) {
					// 	break;
					// }
					for (var k = 0; k < keywordArr.length; k++) {
						if (!!msgs[j].unread && msgs[j].Content.indexOf(keywordArr[k]) >= 0) {
							keyMsgs.push(msgs[j]);
							break;
						}
					}
				}
			}
			return keyMsgs;
		},
		init: function() {
			var titleTimer=null,tt=document.title
			if(!myWin.WebMM){
				setTimeout($$.msg.init,5000);
				return;
			}
			MsgMgr = myWin.WebMM.model("message");
			var userlist = $$.msg.getWeChatUserList();
			if(userlist.length ==0){
				setTimeout($$.msg.init,5000);
				return;
			}
			setInterval(function() {
				var keyMsgs = $$.msg.getKeyMsgs(userlist);
				if (!!keyMsgs && keyMsgs.length > 0) {
					clearInterval(titleTimer);
					titleTimer=null;
					console.log("发现关键语句 " + keyMsgs.length + " 条");
					$.each(keyMsgs,function(k,v){
						$("[msgid='"+k.MsgId+"'] .cloudContent").css("background","#ffff77").css("borderColor","#ffff77")
					});
					titleTimer=setInterval(function() {
						document.title = (document.title =="发现关键词"?"微信网页版":"发现关键词");
					}, 400);
				}
				else{
					clearInterval(titleTimer);
					titleTimer=null;
					document.title = "微信网页版";
				}
			}, 5000);
		}
	}

$$.msg.init();