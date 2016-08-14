// ==UserScript==
// @name        UoPeople Moodle enhancer
// @author      Ignas Poklad (Ignas2526)
// @namespace   ignas2526_uopeople_moodle_enhancer
// @description Enhances UoPeople Moodle
// @include     http://my.uopeople.edu/*
// @include     https://my.uopeople.edu/*
// @version     0.0.2
// @grant       GM_xmlhttpRequest
// @grant       GM_log
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @run-at document-start
// @downloadURL https://raw.githubusercontent.com/Ignas2526/UoP-Enahncer/master/UoP-ehancer.user.js
// @updateURL https://raw.githubusercontent.com/Ignas2526/UoP-Enahncer/master/UoP-ehancer.meta.js
// ==/UserScript==

/*
	This file is part of UoPeople Moodle Enhancer by Ignas Poklad (Ignas2526).
	UoPeople Moodle Enhancer is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	UoPeople Moodle Enhancer is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with UoPeople Moodle Enhancer. If not, see <http://www.gnu.org/licenses/>.
*/

/*
 * Changelog
 *
 * 0.0.2 2016.08.xx
 * Greatly improved log-in functionality
 * More detailed log-In messages
 * Added sesskey patching
 * Improved Grammarly responce displaying
 * Added Automatic Update support
 *
 * 0.0.1 2016.08.12
 * Initial realease 
 */

/*
 * TODO
 * ADD https://www.paperrater.com/plagiarism_checker
function callback(e) {
    var e = window.e || e;

    if (e.target.tagName !== 'A')
        return;

    // Do something
}

if (document.addEventListener)
    document.addEventListener('click', callback, false);
else
    document.attachEvent('onclick', callback);

Sync clock to UoPeople one. Chicago Illinois
https://maps.googleapis.com/maps/api/timezone/json?location=41.8337329,-87.7321555&timestamp=1433848622
*/

/*
	iWin class is part of iWin JS library by Ignas Poklad (Ignas2526).
	iWin JS library is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	iWin JS library is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with iWin JS library. If not, see <http://www.gnu.org/licenses/>.
*/
var iWin = {};

iWin.init = function()
{
	iWin.win = {};
	iWin.dragwID = null;
	iWin.dragObj = -1;
	iWin.dragSTop = null;
	iWin.dragSleft = null;
	iWin.dragMouseX = null;
	iWin.dragMouseY = null;

	iWin.dragWindowLimitX = 0;
	iWin.dragWindowLimitY = 40;

	iWin.resizeWidth = null;
	iWin.resizeHeight = null;

	iWin.zwin = [];
	iWin.zindex = 99;

	iWin.scroll_length = 0;
	iWin.contentMaxAutoWidth = 810;
	iWin.contentMaxAutoHeight = 610;


	var tmpDiv = document.createElement('div');
	tmpDiv.style.cssText = 'position:aboslute;top:-99px;left:-99px;width:70px;height:70px;overflow:scroll;border:0;margin:0;padding:0';
	document.body.appendChild(tmpDiv);
	iWin.scroll_length = tmpDiv.offsetWidth - tmpDiv.clientWidth;
	document.body.removeChild(tmpDiv);
}

iWin.create = function(param, wID)
{
	if (typeof iWin.win[wID] != 'undefined') return false;
	
	iWin.win[wID] = {};
	iWin.win[wID].wID = wID;
	iWin.win[wID].obj = document.createElement('div');
	iWin.win[wID].obj.className = "winb";
	iWin.win[wID].obj.style.cssText = "display:none;top:50px;left:20px;";
	iWin.win[wID].obj.innerHTML = '<div class="winbt"><i class="fa fa-times" style="color:red"></i><u></u></div><div class="winbb" style="display:none"></div><div class="winbc"></div>' +
	'<div style="cursor:nwse-resize;width:20px;height:20px;position:absolute;right:-7px;bottom:-7px;"> </div>';
	//'<div style="display:none;position:absolute;width:100%;height:100%;top:0;"></div>';// for modal window lock
	/*"<img src=\"/img/refresh.png\" onclick=\"bref('"+id+"')\" /> "+*/
	document.body.appendChild(iWin.win[wID].obj);
	
	iWin.win[wID].onshow = typeof param.onshow == 'function' ? param.onshow : function(){};
	iWin.win[wID].onhide = typeof param.onhide == 'function' ? param.onhide : function(){};
	iWin.win[wID].onclose = typeof param.onclose == 'function' ? param.onclose : function(){};
	iWin.win[wID].onrefresh = typeof param.onrefresh == 'function' ? param.onrefresh : function(){};

	iWin.win[wID].obj.addEventListener('mousedown', function(e) {iWin.toFront(wID);}, 0);
	iWin.win[wID].obj.children[0].addEventListener('mousedown', function(e) {iWin.drag(wID, e);}, 0);
	iWin.win[wID].obj.children[0].children[0].addEventListener('mousedown', function(e) {iWin.win[wID].onclose(wID, e);}, 0);
	iWin.win[wID].obj.children[3].addEventListener('mousedown', function(e) {iWin.resize(wID, e);}, 0);

	iWin.win[wID].contentWidth = 0;
	iWin.win[wID].contentHeight = 0;
	iWin.win[wID].contentScroll = false;

	iWin.setTitle(param.title, wID);
	return true;
}

iWin.destroy = function(wID)
{
	if (typeof iWin.win[wID] == 'undefined') return false;
	iWin.zRemove(wID);
	document.body.removeChild(iWin.win[wID].obj);
	delete iWin.win[wID];
	if (typeof event != 'undefined') event.stopPropagation();
	return true;
}

iWin.show = function(wID)
{
	if (iWin.win[wID].obj.style.display == 'block') return false;
	iWin.win[wID].obj.style.display = 'block';
	iWin.zAdd(wID);
	iWin.win[wID].onshow(wID);
	return true;
}

iWin.hide = function(wID)
{
	if (iWin.win[wID].obj.style.display == 'none') return false;
	iWin.win[wID].onhide(wID);
	iWin.win[wID].obj.style.display = 'none';
	iWin.zRemove(wID);
	return true;
}

iWin.refresh = function(wID)
{
	iWin.win[wID].onrefresh(wID);
	return true;
}

iWin.setTitle = function(title, wID)
{
	if (typeof title == 'undefined' || !title.length) {
		iWin.win[wID].titlebar = false;
		iWin.win[wID].obj.children[0].style.display = 'none';
	} else { 
		iWin.win[wID].titlebar = true;
		iWin.win[wID].obj.children[0].style.display = 'block';
		iWin.win[wID].obj.children[0].children[1].innerHTML = title;
	}
	return true;
}

iWin.setContent = function(content, autoSize, wID)
{
	iWin.win[wID].obj.children[2].innerHTML = content;

	if (autoSize) iWin.setContentDimensionsAuto(wID)
	return true;
}

iWin.setContentDimensions = function(width, height, wID)
{
	iWin.win[wID].contentWidth = parseInt(width, 10);
	iWin.win[wID].contentHeight = parseInt(height, 10);

	iWin.win[wID].obj.children[2].style.width = (iWin.win[wID].contentWidth + (iWin.win[wID].contentScroll ? iWin.scroll_length : 0)) + 'px';
	iWin.win[wID].obj.children[2].style.height = iWin.win[wID].contentHeight + 'px';

	return true;
}

iWin.setContentScroll = function(scroll, wID)
{
	iWin.win[wID].contentScroll = scroll ? true : false;

	if (iWin.win[wID].contentScroll) {
		iWin.win[wID].obj.children[2].style.overflowY = 'scroll';
		iWin.win[wID].obj.children[2].style.width = (iWin.win[wID].contentWidth + iWin.scroll_length) + 'px';
	}

	return true;
}

iWin.setPosition = function(top, left, wID)
{
	iWin.win[wID].obj.style.top = parseInt(top, 10) + 'px';
	iWin.win[wID].obj.style.left = parseInt(left, 10) + 'px';
	return true;
}

iWin.setContentDimensionsAuto = function(wID)
{
	// The order of operations is important

	var posTop = iWin.win[wID].obj.offsetTop, posLeft = iWin.win[wID].obj.offsetLeft;
	
	iWin.win[wID].obj.style.top = '-9999px';
	iWin.win[wID].obj.style.left = '-9999px';

	var isHidden = iWin.show(wID);

	iWin.win[wID].obj.children[2].style.width = 'auto';
	iWin.win[wID].obj.children[2].style.height = 'auto';
	iWin.win[wID].obj.children[2].style.overflow = '';
	
	iWin.win[wID].contentWidth = iWin.win[wID].obj.children[2].scrollWidth;
	if (iWin.win[wID].contentWidth < 10) iWin.win[wID].contentWidth = 10;
	else if (iWin.win[wID].contentWidth > iWin.contentMaxAutoWidth) iWin.win[wID].contentWidth = iWin.contentMaxAutoWidth;

	iWin.win[wID].obj.children[2].style.width = iWin.win[wID].contentWidth + 'px';
	
	iWin.win[wID].contentHeight = iWin.win[wID].obj.children[2].scrollHeight;
	if (iWin.win[wID].contentHeight > iWin.contentMaxAutoHeight) {
		iWin.win[wID].contentHeight = iWin.contentMaxAutoHeight;
		iWin.win[wID].contentScroll = true;
	} else if (iWin.win[wID].contentHeight < 10) iWin.win[wID].contentHeight = 10;

	if (iWin.win[wID].contentScroll) {
		iWin.win[wID].obj.children[2].style.overflowY = 'scroll';
		iWin.win[wID].obj.children[2].style.width = (iWin.win[wID].contentWidth + iWin.scroll_length) + 'px';
	}
	iWin.win[wID].obj.children[2].style.height = iWin.win[wID].contentHeight + 'px';

	iWin.win[wID].obj.style.top = posTop + 'px';
	iWin.win[wID].obj.style.left = posLeft + 'px';

	if (isHidden) iWin.hide(wID);

	return true;
}


iWin.showTab = function(tID, wID)
{
	for (var i = 0; i < iWin.win[wID].obj.children[2].children.length; i++) {
		if (iWin.win[wID].obj.children[2].children[i].getAttribute('data-id') == tID)
			iWin.win[wID].obj.children[2].children[i].style.display = 'block';
		else
			iWin.win[wID].obj.children[2].children[i].style.display = 'none';
	}
	return true;
}

iWin.setTabs = function(tabs, wID)
{
	var html = '', first = '';
	for (var id in tabs) {
		if (!first.length) {first = id;}
		html += '<div class="winbbt" onclick="iWin.showTab(\'' + id + '\',\'' + wID + '\')">' + tabs[id] + '</div>';
	}
	if (html != '') {
		iWin.win[wID].obj.children[1].innerHTML = html;
		iWin.win[wID].obj.children[1].style.display = 'block';
		iWin.showTab(first, wID);
	} else {
		iWin.win[wID].obj.children[1].style.display = 'none';
	}
	return true;
}

iWin.zAdd = function(wID)
{
	iWin.zindex++;
	iWin.win[wID].obj.style.zIndex = iWin.zindex;
	iWin.zwin[iWin.zindex] = iWin.win[wID].obj;
	return true;
}

iWin.zRemove = function(wID)
{
	var zID = parseInt(iWin.win[wID].obj.style.zIndex, 10);
	for (var i = zID + 1; i < iWin.zindex + 1; i++) {iWin.zwin[i - 1] = iWin.zwin[i]; iWin.zwin[i].style.zIndex = i - 1;}
	delete iWin.zwin[iWin.zindex];
	iWin.zindex--;
	return true;
}

iWin.toFront = function(wID)
{
	var zID = parseInt(iWin.win[wID].obj.style.zIndex, 10);
	if (zID != iWin.zindex) {
		for (var i = zID + 1; i < iWin.zindex + 1; i++) {
			iWin.zwin[i - 1] = iWin.zwin[i];
			iWin.zwin[i].style.zIndex = i - 1;
		}
		iWin.zwin[iWin.zindex] = iWin.win[wID].obj;
		iWin.win[wID].obj.style.zIndex = iWin.zindex;
	}
	return true;
}

iWin.drag = function(wID, e)
{
	if (iWin.dragObj != -1) iWin.MoveStop(); // prevent multiple drags
	iWin.dragwID = wID;
	iWin.dragObj = iWin.win[wID].obj;
	
	iWin.dragMouseX = e.clientX; iWin.dragMouseY = e.clientY;
    iWin.dragSTop = iWin.dragObj.offsetTop; iWin.dragSLeft = iWin.dragObj.offsetLeft;

	document.body.className = 'nse';
	document.addEventListener('mousemove', iWin.dragM);
	document.addEventListener('mouseup', iWin.MoveStop);
	document.addEventListener('blur', iWin.MoveStop);
	document.addEventListener('mouseout', iWin.MoveStop2);
	return true;
}

iWin.resize = function(wID, e)
{
	if (iWin.dragObj != -1) iWin.MoveStop(); // prevent multiple drags
	iWin.dragwID = wID;
	iWin.dragObj = iWin.win[wID].obj;

	iWin.dragMouseX = e.clientX; iWin.dragMouseY = e.clientY;
	iWin.resizeWidth = iWin.win[wID].contentWidth + (iWin.win[wID].contentScroll ? iWin.scroll_length : 0);
  iWin.resizeHeight = iWin.win[wID].contentHeight;

	document.body.className = 'nse';
	document.addEventListener('mousemove', iWin.resizeM);
	document.addEventListener('mouseup', iWin.MoveStop);
	document.addEventListener('blur', iWin.MoveStop);
	document.addEventListener('mouseout', iWin.MoveStop2);
	return true;
}

iWin.resizeM = function(e)
{
	var wID = iWin.dragwID;
	
	iWin.win[wID].contentWidth = iWin.resizeWidth + e.clientX - iWin.dragMouseX;
	if (iWin.win[wID].contentWidth < 100) iWin.win[wID].contentWidth = 100;
	iWin.win[wID].obj.children[2].style.width = iWin.win[wID].contentWidth + 'px';

	iWin.win[wID].contentHeight = iWin.resizeHeight + e.clientY - iWin.dragMouseY;
	if (iWin.win[wID].contentHeight < 20) iWin.win[wID].contentHeight = 20;
	iWin.win[wID].obj.children[2].style.height = iWin.win[wID].contentHeight + 'px';
}

iWin.dragM = function(e)
{
	var NewWindowY = iWin.dragSTop + e.clientY - iWin.dragMouseY;
	var NewWindowX = iWin.dragSLeft + e.clientX - iWin.dragMouseX;

	if (NewWindowY < iWin.dragWindowLimitY) NewWindowY = iWin.dragWindowLimitY;
	if (NewWindowY > (window.innerHeight - 10)) NewWindowY = window.innerHeight - 10;
	
	if (NewWindowX < iWin.dragWindowLimitX) NewWindowX = iWin.dragWindowLimitX;
	// TODO: add proper limit config if (e.clientX < 5) NewWindowX = iWin.dragSLeft + 5 - iWin.dragMouseX;
	if (NewWindowX > (window.innerWidth - 10)) NewWindowX = window.innerWidth - 10;

	iWin.dragObj.style.top = NewWindowY + 'px'; iWin.dragObj.style.left = NewWindowX + 'px';
};

iWin.MoveStop2 = function(e)
{
	if ((e.pageY >= 0 && e.pageY <= window.innerHeight) && (e.pageX >= 0 && e.pageX <= window.innerWidth)) return;
	iWin.MoveStop();
};

iWin.MoveStop = function()
{
	document.body.className = '';
	document.removeEventListener('mousemove', iWin.resizeM);
	document.removeEventListener('mousemove', iWin.dragM);
	document.removeEventListener('mouseup', iWin.MoveStop);
	document.removeEventListener('blur', iWin.MoveStop);
	document.removeEventListener('mouseout', iWin.MoveStop2);
	iWin.dragObj = -1;

	if (document.selection && document.selection.empty) {document.selection.empty();}else if (window.getSelection) {window.getSelection().removeAllRanges();}
};

iWin.messageBox = function(msg, params, _wID)
{
	// TOOD: _wID will be used in future for modal messageBox
	var wID = 'iAlert' + new Date().getTime();
	iWin.create({title: params.title, onclose:function(){iWin.destroy(wID);}}, wID);
	iWin.setContent(msg, true, wID);
	iWin.setPosition(60, (window.innerWidth / 2) - 20, wID);
	iWin.show(wID);
	iWin.toFront(wID);
	iWin.show(wID);
	if (typeof params.timeout != 'undefined')
		setTimeout(function(){iWin.destroy(wID);}, parseInt(params.timeout, 10));
	return true;
};

var v0id = {};

v0id.init = function()
{
  GM_addStyle(
    ".v0id_m{position:fixed;margin:0;padding:3px;display:block;top:0;right:0;cursor:pointer;z-index:100;" +
    "border-radius:2px;font-size:20px;color:#fff;background:rgba(0,0,0,.7);}" +
    ".v0id_m > *{cursor:pointer}" +
    ".v0id_mt{text-align:right}" +
    ".v0id_mm{display:none}" +
    ".v0id_m:hover .v0id_mm{display:block;}" +
    ".ume-invisible-overlay{position:fixed;width:100%;height:100%;left:0;top:0;}"
  );
  var omenu = document.createElement('div'); 
  omenu.className="v0id_m";
  omenu.innerHTML = '<div class="v0id_mt">UoP Enhancer</div><div class=\"v0id_mm\">'+
      '<div>Login?</div>'+
      '<div>Grammarly Checker</div>'+
      '<div>Settings</div>'+
      '</div>';
        /*'<div>Time</div>'+
      '<div>Notes</div>'+*/
  document.body.appendChild(omenu);
  
  // TODO: make this whole thing less ugly.
  omenu.children[1].children[0].onclick = check_login_uopeople;
  omenu.children[1].children[1].onclick = open_plagiarism_window;
  omenu.children[1].children[2].onclick = open_settings_window;
}

/*
 * The functions below deal with UoP log-in
*/
var log_in_in_process = false; // Prevent parallel log-in
function check_login_uopeople()
{
  if (!settings.uop_login[0].length || !settings.uop_login.length) {
      iWin.messageBox('You did not provide UoP Enhancer with your UoP username and password.', {title:'Auto Log-In', timeout:5000});
      return;
  }
  if (log_in_in_process) return;
  log_in_in_process = true;
  var sesskey_patch_success_msg = 'sesskey was found and patched.';
  var sesskey_patch_failure_msg = '<span style="color:red">sesskey was not patched!<br>Back-up form data, if any!</span>';
  GM_xmlhttpRequest({
    method: "GET",
    url: "http://my.uopeople.edu/",
    onload: function(response) {
      if (response.responseText.indexOf('Log in to the site') > 0) {
          GM_xmlhttpRequest({
          method: "POST",
          url: "https://my.uopeople.edu/login/index.php",
          data: "username=" +settings.uop_login[0]+ "&password=" +settings.uop_login[1]+ "&rememberusername=1",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Referer": "https://my.uopeople.edu/login/index.php"

          },
          onload: function(response) {
            if (response.responseText.indexOf('Log in to the site') == -1) {
                var msg = 'Successfully logged in.<br>';
                var sesskey = response.responseText.match(/"sesskey":"([^"]+)"/);
                if (sesskey.length == 2) {
                    log_in_patch_sesskey(sesskey[1]);
                    msg += sesskey_patch_success_msg;
                } else {
                    msg += sesskey_patch_failure_msg;
                }
                iWin.messageBox(msg, {title:'Auto Log-In', timeout:5000});
                log_in_in_process = false;
            } else {
                iWin.messageBox('<span style="color:red">Failed to log-in!</span>', {title:'Auto Log-In', timeout:5000});
                log_in_in_process = false;
            }
          }
        });
      } else {
        var msg = 'Already logged in.<br>';
        var sesskey = response.responseText.match(/"sesskey":"([^"]+)"/);
        if (sesskey.length == 2) {
            log_in_patch_sesskey(sesskey[1]);
            msg += sesskey_patch_success_msg;
        } else {
            msg += sesskey_patch_failure_msg;
        }
        iWin.messageBox(msg, {title:'Auto Log-In', timeout:5000});
        log_in_in_process = false;
      }
    }
  });
}

/*
 * After we logged in, we need to patch sesskey on the current page.
 * We can do that by replacing it with the one we found in the responce page after log-in.
 * Without patching the sesskey, submittig form on the current page will cause invalid sesskey error.
 * There are couple other places where we could patch the sesskey such as log-out link, however,
 * we don't really care that much about them.
 */
function log_in_patch_sesskey(sesskey)
{
    M.cfg.sesskey = sesskey;
    var el = document.querySelectorAll('input[name="sesskey"]');
    for (var i = 0; i < el.length; i++) {
        el[i].value = sesskey;
    }
}



function open_plagiarism_window()
{
  var wID = 'grammarlyWindowID';
  var window_exists = !iWin.create({title: 'Grammarly Text Check', onclose:function(){iWin.destroy(wID);}}, wID);
  iWin.setContent('<div id="plagiarism_check_responce" style="overflow-y:scroll"><strong>Plagiarism</strong><br><strong>Contextual Spelling</strong><br><strong>Grammar</strong><br><strong>Punctuation</strong><br><strong>Sentence Structure</strong><br><strong>Style</strong><br><strong>Vocabulary enhancement</strong><br>' +
                  '</div><textarea rows="8" cols="50" id="plagiarism_check_text"></textarea><br>' +
                  '<input type="button" id="plagiarism_check" value="Check">', true, wID);
  iWin.setPosition(60, (window.innerWidth / 2) - 20, wID);

  iWin.show(wID);
  if (!window_exists) {
    document.getElementById('plagiarism_check').onclick = plagiarism_check;
  }
}

var grammarly_in_process = false;
function plagiarism_check()
{
  if (grammarly_in_process) return;
  grammarly_in_process = true;
  data = document.getElementById('plagiarism_check_text').value;
  GM_xmlhttpRequest({
    method: "POST",
    url: "https://capi.grammarly.com/api/check",
    data: data,
    headers: {
      "Content-Type": "text/plain",
      "Accept": "application/json",
      "Accept-Language": "en-US,en;q=0.5",
      "Origin": "https://www.grammarly.com",
      "Referer": "https://www.grammarly.com/plagiarism?q=plagiarism"
    },
    onload: function(response) {
      /*console.log(
        response.status,
        response.statusText,
        response.readyState,
        response.responseHeaders,
        response.responseText,
        response.finalUrl
      );*/

      if (response.responseText) {
        var jsonResp = JSON.parse(response.responseText);
        var out = '';
          // TODO: add word count: a.replace(/\W+/g, " ").split(' ').length
          // TODO: that word count doesn't work with-a-word-like-that
          // TODO: plagiarsim count is the percentage of the words which are plagiarized
        var plag_count = grammarly_find_value('Plagiarism', 'Plagiarism', jsonResp);
        out += '<strong>Plagiarism</strong> ' + plag_count + '% of words<br>';
        for (var i = 0; i < grammarly_check_values.length; i++) {
          out += '<strong>' + grammarly_check_values[i].name+ '</strong>';
          for (var j = 0; j < grammarly_check_values[i].items.length; j++) {
              var count = grammarly_find_value(grammarly_check_values[i].key, grammarly_check_values[i].items[j].key, jsonResp);
              if (count) {
                  out += '&nbsp;&nbsp;' + count + ' ' + grammarly_check_values[i].items[j].name;
              }
          }
          out += '<br>';
        }
        document.getElementById('plagiarism_check_responce').innerHTML = out;
        grammarly_in_process = false;
      }
    }
  });
}

function grammarly_find_value(group, category, obj)
{
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].group == group && obj[i].category == category) return obj[i].count;
    }
    return 0;
}

var grammarly_check_values = [{
    name: "Contextual Spelling",
    key: "ContextualSpelling",
    items: [
        {key: "AccidentallyConfused", name: "Confused Words"},
        {key: "BritishVsAmerican", name: "Mixed Dialects of English"},
        {key: "CommonlyConfused", name: "Commonly Confused Words"},
        {key: "Misspelled", name: "Misspelled Words"},
        {key: "Unknown", name: "Unknown Words"}
    ]
}, {
    name: "Grammar",
    key: "Grammar",
    items: [
        {key: "Determiners",name: "Determiner Use (a/an/the/this, etc.)"},
        {key: "Conditional", name: "Conditional Sentences"},
        {key: "Conjunctions", name: "Conjunction Use"},
        {key: "Modals", name: "Modal Verbs"},
        {key: "Modifiers", name: "Misuse of Modifiers"},
        {key: "Nouns", name: "Incorrect Noun Number"},
        {key: "Numerals", name: "Numeral Use"},
        {key: "Prepositions", name: "Wrong or Missing Prepositions"},
        {key: "Pronouns", name: "Pronoun Use"},
        {key: "Quantifiers", name: "Misuse of Quantifiers"},
        {key: "SVA", name: "Faulty Subject-Verb Agreement"},
        {key: "Verbs", name: "Incorrect Verb Forms"},
        {key: "Tenses", name: "Faulty Tense Sequence"},
        {key: "Lexical", name: "Incorrect Phrasing"}
    ]
}, {
    name: "Punctuation",
    key: "Punctuation",
    items: [
        {key: "BasicPunct", name: "Comma Misuse within Clauses"},
        {key: "ClosingPunct", name: "Closing Punctuation"},
        {key: "CompPunct", name: "Punctuation in Compound/Complex Sentences"},
        {key: "SpecialCharacters", name: "Misuse of Semicolons, Quotation Marks, etc."}
   ]
}, {
    name: "Sentence Structure",
    key: "SentenceStructure",
    items: [
        {key: "Fragment",name: "Incomplete Sentences"},
        {key: "Parallelism", name: "Faulty Parallelism"},
        {key: "WordOrder", name: "Misplaced Words or Phrases"}
    ]
}, {
    name: "Style",
    key: "Style",
    items: [
        {key: "Colloquial", name: "Inappropriate Colloquialisms"},
        {key: "Formatting", name: "Improper Formatting"},
        {key: "OldWords", name: "Outdated Language"},
        {key: "PassiveVoice", name: "Passive Voice Misuse"},
        {key: "ToneCheck", name: "Politically Incorrect or Offensive Language"},
        {key: "TooFormal", name: "Inappropriate Formality"},
        {key: "Wordiness", name: "Wordy Sentences"},
        {key: "Clarity", name: "Unclear Reference"}
    ]
}, {
    name: "Vocabulary enhancement",
    key: "Enhancement",
    items:
    [
        {key: "_WordChoice", name: "Word Choice"}
    ]
}];

window.addEventListener('DOMContentLoaded', function()
{
  v0id.init();
  
  GM_addStyle(
    ".nse{-moz-user-select:-moz-none;-moz-user-select:none;-o-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;user-select:none}"+
    ".winb{overflow:hidden;position:fixed;border:1px solid #003;border-radius:2px;background:#FDFDFD;}"+
    ".winbt{border:solid #003;border-width:0px 0px 1px 0px;font-size:15px;cursor:move}"+
    ".winbt>img{margin:0px 1px -2px 1px;cursor:pointer}"+
    ".winbc{white-space:nowrap;padding:5px}"+
    ".winbt u{text-decoration:none;vertical-align:top;}"
  );
  iWin.init();
  
  log_out_handler_init();
  
  /*
   * Reorder the course assignment on the main course page so that current week is at the top of the page
   * Also remove the big logo
   * http://my.uopeople.edu/course/view.php?id=XXX
   */
  if (top.location.toString().indexOf('course/view.php')) {
    var sections = [];
    for (var i = 0; i < 10; i++) {
      var section = document.getElementById('section-' + i);
      if (section == null) break;
      sections[i] = section;
    }

    if (sections.length > 2) {
     for (var i = 2; i < sections.length; i++) {
       sections[0].parentNode.insertBefore(sections[i],sections[i -1]);
     }
    }
    
    
    //Remove logo
    var logo_img = document.querySelectorAll('#section-0 .summary img');
    if (logo_img && logo_img[0]) {
      logo_img[0].parentElement.removeChild(logo_img[0]);
    }
  }
}, 0);


window.onbeforeunload = function ()
{
  return null;
};

var possibly_logged_out_after = 90 * 60; //1h 30min in seconds
var invisible_overlay = null;
var time_when_page_loaded = new Date().getTime()/1000; // Unix timestamp

function log_out_handler_init()
{
  invisible_overlay = document.createElement('div');
  invisible_overlay.className = 'ume-invisible-overlay';
  invisible_overlay.style.display = 'none';
  invisible_overlay.onclick = show_possibly_logged_out_warning;
  document.body.appendChild(invisible_overlay);
}

function show_possibly_logged_out_warning()
{
  invisible_overlay.style.display = 'none';
  time_when_page_loaded = new Date().getTime()/1000;
  
  var wID = 'inactivityWarn';
  iWin.create({title: 'Warning', onclose:function(){iWin.destroy(wID);}}, wID);
  iWin.setContent('You had this page open for more than 1h and 30min.<br>'+
                  'If you are writting a comment, learning journal entry or assignmnet,<br>'+
                  'back it up before clicking submit or navigating to other page.', true, wID);
  iWin.setPosition(60, (window.innerWidth / 2) - 20, wID);

  iWin.show(wID);
}

function is_possibly_logged_out()
{
    var current_time = new Date().getTime()/1000;
    
    // If page was loaded for less than hour, we are should still be logged in.
    if ((current_time - time_when_page_loaded) < possibly_logged_out_after) return;

    invisible_overlay.style.display = 'block';
}

window.onfocus = function()
{
  is_possibly_logged_out();
}

setTimeout(function(){
  is_possibly_logged_out();
}, possibly_logged_out_after * 1000);

var settings = null;

{
    try {
    var settings_string = GM_getValue('settings');
    if (settings_string !== null) {
        settings = JSON.parse(settings_string);
    }
    } catch(e){}
    if (settings == null)
       settings = {}; 
    if (!settings.uop_login || settings.uop_login.length != 2) {
        settings.uop_login = ['', ''];
    }
}
function open_settings_window() {
  var wID = 'UoPE-Settings';
  iWin.create({title: 'UoP Enhancer Settings', onclose:function(){iWin.destroy(wID);}}, wID);
  iWin.setContent('<strong>One-Click Log-In</strong><br>'+
                  'Warning: do not use this feature on a non-private computer.<br>'+
                  'Your username and pasword will be stored in the browser.<br>'+
                  'The creator of this script will take <strong>no responsibility</strong><br>'+
                  'if something happens to your UoP account!<br>'+
                  'User: <input id="uope-s-user" type="text"><br>'+
                  'Pass: <input id="uope-s-pass" type="password"><br>'+
                  '<input id="uope-s-save" type="button" value="Save">', true, wID);
  iWin.setPosition(60, (window.innerWidth / 2) - 20, wID);
  iWin.show(wID);
    
  document.getElementById('uope-s-save').onclick = settings_save;
}

function settings_save() {
    var wID = 'UoPE-Settings';
    var uope_user_obj = document.getElementById('uope-s-user');
    var uope_pass_obj = document.getElementById('uope-s-pass');
    settings.uop_login = [uope_user_obj.value, uope_pass_obj.value];
    uope_pass_obj.value = '';
    
    var settings_string = JSON.stringify(settings);
    GM_setValue('settings', settings_string);
    iWin.hide(wID);
}
