// ==UserScript==
// @name        UoPeople Moodle enhancer
// @author      Ignas Poklad (Ignas2526)
// @namespace   ignas2526_uopeople_moodle_enhancer
// @description Enhances UoPeople Moodle
// @version     0.3.0
// @downloadURL https://raw.githubusercontent.com/Ignas2526/UoPeople-Enahncer/raw/master/UoPeople-ehancer.user.js
// @updateURL https://raw.githubusercontent.com/Ignas2526/UoPeople-Enahncer/master/UoPeople-ehancer.meta.js
// @run-at document-start
// @include     http://my.uopeople.edu/*
// @include     https://my.uopeople.edu/*
// @connect     my.uopeople.edu
// @connect     capi.grammarly.com
// @connect     paperrater.com
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @grant       GM_log
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_openInTab
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
 * 0.3.0 2016.09.07
 * Added PaperRater.
 * Fixes in Student Data gathering.
 * Fixes and visual improvements in embedded Forums.
 * Inactivity alert will not show up after 2 hours and 30 minutes instead of 2 hours.
 * One click login now properly handles bad responces like those during Moodle maintenance.
 * Other minor improvements.
 *
 * 0.2.0 2016.08.31
 * Added Student data in settings.
 * Current courses will be shown at the top of the menu.
 * Better request error handling in the Log-In and Gramarly.
 * Other minor improvements.
 * 
 * 0.1.0 2016.08.18
 * Added Events window
 * Last 2 week's forums are embedded into the main course page.
 * Possibly logged-out message is now shown after 2 hours of inactivity.
 * Possibly logged-out message now tells how much time had passed.
 * Other minor script improvements.
 *
 * 0.0.2 2016.08.14
 * Greatly improved log-in functionality
 * More detailed log-In messages
 * Added sesskey patching
 * Improved Grammarly response displaying
 * Added Automatic Update support
 *
 * 0.0.1 2016.08.12
 * Initial realease 
 */

/*
 * TODO
 * ADD https://www.paperrater.com/plagiarism_checker
 http://paperrater.com/free_paper_grader
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
};

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
	var first = '';
	iWin.win[wID].obj.children[1].innerHTML = '';
	for (var id in tabs) {
		if (typeof(id) == 'undefined') continue;
		
		if (!first.length) {first = id;}
		
		var obj = document.createElement('div');
		obj.className = 'winbbt';
		(function(id, wID){obj.onclick = function(){iWin.showTab(id, wID);};})(id, wID);
		obj.innerHTML = tabs[id];
		
		iWin.win[wID].obj.children[1].appendChild(obj);
	}
	
	if (first.length) {
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
	var evt = e || window.event;
	if (iWin.dragObj != -1) iWin.MoveStop(); // prevent multiple drags
	iWin.dragwID = wID;
	iWin.dragObj = iWin.win[wID].obj;
	
	iWin.dragMouseX = evt.clientX; iWin.dragMouseY = evt.clientY;
	iWin.dragSTop = iWin.dragObj.offsetTop; iWin.dragSLeft = iWin.dragObj.offsetLeft;

	document.body.classList.add('nse');
	document.addEventListener('mousemove', iWin.dragM);
	document.addEventListener('mouseup', iWin.MoveStop);
	document.addEventListener('blur', iWin.MoveStop);
	document.addEventListener('mouseout', iWin.MoveStop2);
	return true;
}

iWin.resize = function(wID, e)
{
	var evt = e || window.event;
	if (iWin.dragObj != -1) iWin.MoveStop(); // prevent multiple drags
	iWin.dragwID = wID;
	iWin.dragObj = iWin.win[wID].obj;

	iWin.dragMouseX = evt.clientX; iWin.dragMouseY = evt.clientY;
	iWin.resizeWidth = iWin.win[wID].contentWidth + (iWin.win[wID].contentScroll ? iWin.scroll_length : 0);
	iWin.resizeHeight = iWin.win[wID].contentHeight;

	document.body.classList.add('nse');
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
	document.body.classList.remove('nse');
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

window.addEventListener('DOMContentLoaded', function()
{
	UoPE_menu_init();
	setTimeout(UoP_cosmetic_improvements, 0);
	uop_time_init();

	GM_addStyle(
		".winb, .winbt, .winbb, .winbbt, .winbc{box-sizing:border-box;}"+
		".nse{-moz-user-select:-moz-none;-moz-user-select:none;-o-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;user-select:none}"+
		".winb{overflow:hidden;position:fixed;border:1px solid #003;border-radius:2px;background:#FDFDFD;}"+
    	".winbt{display:block;border:solid #003;border-width:0px 0px 1px 0px;font-size:15px;cursor:move}"+
		".winbt>img{margin:0px 1px -2px 1px;cursor:pointer}"+
		".winbb{display:block;border:solid #003;border-width:0px 0px 1px 0px;font-size:15px;}"+
		".winbbt{display:inline-block;padding:1px 2px;border:solid #003;border-width: 0px 1px 0px 0px;cursor:pointer}"+
		".winbc{display:block;white-space:nowrap;padding:5px}"+
		".winbt u{text-decoration:none;vertical-align:top;}"+
		
		".winbc h1, .winbc h2, .winbc h3, .winbc h4, .winbc h5, .winbc h6{margin:0;line-height:1.5;}"
	);
	iWin.init();

	log_out_handler_init();

	uop_time_init();

}, 0);

window.onfocus = function()
{
  is_possibly_logged_out();
};

function UoPE_menu_init()
{
	GM_addStyle(
		"#uope_menu{position:fixed; margin:0; padding:3px 4px; display:block; top:0; right:0; cursor:pointer; z-index:100;" +
		"border-radius:2px;font-size:20px;color:#fff;background:rgba(0,0,0,.7);}" +
		"#uope_menu > *{cursor:pointer}" +
		".uope_menu_mt{text-align:right}" +
		".uope_menu_mm{display:none}" +
		".uope_menu_mm a {display:block; color:#fff}" +
		"#uope_menu:hover .uope_menu_mm{display:block;}" +
		".ume-invisible-overlay{position:fixed;width:100%;height:100%;left:0;top:0;}"
	);
	var menu = document.createElement('div');
	menu.id = 'uope_menu';
	menu.innerHTML = '<div class="uope_menu_mt"><i class="fa fa-bars"> </i></div><div class=\"uope_menu_mm\"></div>';
	document.body.appendChild(menu);
	
	var menu_itm;
	
	if (settings.student_data.profileId) {
		for (var i = 0; i < settings.student_data.courses.length; i++) {
			menu_itm = document.createElement('a');
			menu_itm.innerText = settings.student_data.courses[i].name;
			menu_itm.href = 'http://my.uopeople.edu/course/view.php?id='  + settings.student_data.courses[i].id;
			menu.children[1].appendChild(menu_itm);
		}
	}
	
	menu_itm = document.createElement('div');
	menu_itm.innerText = 'Log me in';
	menu_itm.onclick = do_uop_login;
	menu.children[1].appendChild(menu_itm);
	
	menu_itm = document.createElement('div');
	menu_itm.innerText = 'Grammarly';
	menu_itm.onclick = open_grammarly_window;
	menu.children[1].appendChild(menu_itm);
	
	menu_itm = document.createElement('div');
	menu_itm.innerText = 'Paperrater';
	menu_itm.onclick = open_paperrater_window;
	menu.children[1].appendChild(menu_itm);
	
	menu_itm = document.createElement('div');
	menu_itm.innerText = 'Events';
	menu_itm.onclick = open_events_window;
	menu.children[1].appendChild(menu_itm);
	
	menu_itm = document.createElement('div');
	menu_itm.innerText = 'Settings';
	menu_itm.onclick = open_settings_window;
	menu.children[1].appendChild(menu_itm);
}

function UoP_cosmetic_improvements()
{
	/*
	 * Changes for the main course page
   	 * http://my.uopeople.edu/course/view.php?id=XXX
	 */
	if (top.location.toString().indexOf('course/view.php') != -1) {
		GM_addStyle('.forumheaderlist thead,.forumheaderlist{border:1px solid black;width:100%}td .unread{margin:0 !important} .author,.replies,.lastpost{text-align:center}');
		
		// Remove big UoP logo at the top
		var logo_img = document.querySelectorAll('#section-0 .summary img');
		if (logo_img && logo_img[0]) {
			logo_img[0].parentElement.removeChild(logo_img[0]);
		}
		
		// Reverse order the weeks so that current week is at the top of the page and so on
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

		// Proper last week: sections[sections.length - 1]
		// Currently we show for last two weeks
		var limit = sections.length > 2 ? sections.length - 2 : sections.length - 1;
		for (i = sections.length; i >= limit; i--) {
			console.log(i % sections.length);
			var latest_week_obj = sections[i % sections.length];
			var forum_obj = latest_week_obj.querySelectorAll('.forum');
			for (var j = 0; j < forum_obj.length; j++) {
				var href = forum_obj[j].children[0].children[0].children[1].children[0].children[0].href;
				if (!href) continue;
				(function(j, href,forum_obj){
					GM_xmlhttpRequest({
						method: "GET",
						url: href,
						onload: function(response) {
							if (response.responseText) {
								var forum = response.responseText.match(/<table[\s\S]*<\/table>/);
								if (forum !== null) {
									forum = forum[0].replace(/<td class="picture">.*<\/td>/gi, '<td> </td>');
									forum = forum.replace(/<th class="header group" scope="col">Group<\/th>/gi, '');
									forum = forum.replace(/<td class="picture group">.*<\/td>/gi, '');
									forum = forum.replace(/<a href="([^"]*)">.*\(Instructor\)/gi, '<a href="$1">(Instructor)');
									forum_obj[j].innerHTML += forum;
								}

							}
						}
					});
				})(j, href,forum_obj);
			}
		}
		
	}
}
/*
 * The functions below deal with UoP log-in
*/

var in_process_login = false; // Prevent parallel log-in
function do_uop_login()
{
	if (in_process_login) return;
	
	if (!settings.uop_login[0].length || !settings.uop_login.length) {
		iWin.messageBox('You did not provide UoP Enhancer with your UoP username and password.', {title:'Auto Log-In', timeout:5000});
		return;
	}
	in_process_login = true;
	var sesskey_patch_success_msg = 'sesskey was found and patched.';
	var sesskey_patch_failure_msg = '<span style="color:red">sesskey was not patched!<br>Back-up form data, if any!</span>';
	GM_xmlhttpRequest({
		method: "GET",
		url: "http://my.uopeople.edu/",
		onload: function(response) {
			if (response.responseText.indexOf('Log in to the site') != -1) {
				GM_xmlhttpRequest({
					method: "POST",
					url: "https://my.uopeople.edu/login/index.php",
					data: "username=" +settings.uop_login[0]+ "&password=" +settings.uop_login[1]+ "&rememberusername=1",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						"Referer": "https://my.uopeople.edu/login/index.php"

					},
					onload: function(response)
					{
						if (response.responseText.indexOf('You are logged in as') != -1) {
							var msg = 'Successfully logged in.<br>';
							var sesskey = response.responseText.match(/"sesskey":"([^"]+)"/);
							if (sesskey.length == 2) {
								log_in_patch_sesskey(sesskey[1]);
								msg += sesskey_patch_success_msg;
							} else {
								msg += sesskey_patch_failure_msg;
							}
							iWin.messageBox(msg, {title:'Auto Log-In', timeout:5000});
							in_process_login = false;
						} else {
							iWin.messageBox('<span style="color:red">Error:</span> Moodle returned weird responce.<br>Perhaps there\'s maintenance?', {title:'Auto Log-In'});
							in_process_login = false;
						}
					},
					onerror: function(response)
					{
						iWin.messageBox('<span style="color:red">Failed to Log-In!</span><br>Request error.', {title:'Auto Log-In', timeout:5000});
						in_process_login = false;
					}
				});
			} else if (response.responseText.indexOf('You are logged in as') != -1) {
				var msg = 'Already logged in.<br>';
				var sesskey = response.responseText.match(/"sesskey":"([^"]+)"/);
				if (sesskey !== null && sesskey.length == 2) {
					log_in_patch_sesskey(sesskey[1]);
					msg += sesskey_patch_success_msg;
				} else {
					msg += sesskey_patch_failure_msg;
				}
				iWin.messageBox(msg, {title:'Auto Log-In', timeout:5000});
				in_process_login = false;
			} else {
				iWin.messageBox('<span style="color:red">Error:</span> Moodle returned weird responce.<br>Perhaps there\'s maintenance?', {title:'Auto Log-In'});
				in_process_login = false;
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
    if (typeof window.M != 'undefined') {
		window.M.cfg.sesskey = sesskey;
	} else if (typeof unsafeWindow.M != 'undefined') {
		unsafeWindow.M.cfg.sesskey = sesskey;
	}
    var el = document.querySelectorAll('input[name="sesskey"]');
    for (var i = 0; i < el.length; i++) {
        el[i].value = sesskey;
    }
}

var possibly_logged_out_after = (2 * 60 + 30) * 60 * 1000; //2h 30min in milliseconds
var invisible_overlay_obj = null;
var time_when_page_loaded = new Date().getTime(); // Unix timestamp

function log_out_handler_init()
{
  invisible_overlay_obj = document.createElement('div');
  invisible_overlay_obj.className = 'ume-invisible-overlay';
  invisible_overlay_obj.style.display = 'none';
  invisible_overlay_obj.onclick = show_possibly_logged_out_warning;
  document.body.appendChild(invisible_overlay_obj);
}

function show_possibly_logged_out_warning()
{
  invisible_overlay_obj.style.display = 'none';
  var wID = 'inactivityWarn';
  iWin.create({title: 'Inactivity Warning', onclose:function(){iWin.destroy(wID);}}, wID);
  iWin.setContent('You had this page open for ' + format_time_period(new Date().getTime() - time_when_page_loaded, false) + '.<br>' +
                  'There\'s a chance that Moodle logged you out automatically.<br>' +
				  'If you are in any form (e.g. learning journal, forum reply, PM),<br>' +
				  'you should click on "Log me in" in the UoP ehancher menu,<br>' +
				  'or backup you work and log back in manually,<br>' +
				  '<b>before</b> you try to submit the form.', true, wID);
  iWin.setPosition(60, (window.innerWidth / 2) - 20, wID);

  iWin.show(wID);
  time_when_page_loaded = new Date().getTime();
}

function is_possibly_logged_out()
{
    var inactive_for = new Date().getTime() - time_when_page_loaded;
    // If page was loaded for less than hour, we are should still be logged in.
    if (inactive_for < possibly_logged_out_after) return;

    invisible_overlay_obj.style.display = 'block';
}

setTimeout(function(){
  is_possibly_logged_out();
}, possibly_logged_out_after);

function open_grammarly_window()
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

var in_process_grammarly = false;
function plagiarism_check()
{
	if (in_process_grammarly) return;
	in_process_grammarly = true;

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
			if (response.responseText) {
				var jsonResp = JSON.parse(response.responseText);
				var out = '';
				// TODO: add word count: a.replace(/\W+/g, " ").split(' ').length
				// TODO: that word count doesn't work with-a-word-like-that
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
			} else {
				iWin.messageBox('<span style="color:red">Request to Grammarly API had failed</span>', {title:'Grammarly', timeout:5000});
			}
			in_process_grammarly = false;
		},
		onerror: function(response)
		{
			iWin.messageBox('<span style="color:red">Request to Grammarly API had failed</span>', {title:'Grammarly', timeout:5000});
			in_process_grammarly = false;
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

/*
 * Paper Rater functions
 */

function open_paperrater_window()
{
  var wID = 'paperraterWindowID';
  var window_exists = !iWin.create({title: 'PaperRater Check', onclose:function(){iWin.destroy(wID);}}, wID);
  iWin.setContent('<textarea rows="8" cols="50" id="paperrater-text"></textarea><br>' +
                  '<input type="button" id="paperrater-analyze" value="Check">', true, wID);
  iWin.setPosition(60, (window.innerWidth / 2) - 20, wID);

  iWin.show(wID);
  if (!window_exists) {
    document.getElementById('paperrater-analyze').onclick = paperrater_check;
  }
}

var in_process_paperrater = false;
function paperrater_check()
{
	if (in_process_paperrater) return;
	in_process_paperrater = true;

	GM_xmlhttpRequest({
		method: "GET",
		url: "http://paperrater.com/free_paper_grader",
		headers: {
			"Accept-Language": "en-US,en;q=0.8",
			"Origin": "http://paperrater.com",
		},
		onload: function(response) {
			if (response.responseText) {
				var csrf_token = response.responseText.match(/name="authenticity_token" type="hidden" value="([^"]*)"/);
				if (csrf_token.length != 2) {
					iWin.messageBox('<span style="color:red">Request to PaperRater API had failed</span>', {title:'PaperRater Check', timeout:5000});
					in_process_paperrater = false;
					return;
				}
				csrf_token = csrf_token[1];
				data = document.getElementById('paperrater-text').value;
				GM_xmlhttpRequest({
					method: "POST",
					url: 'http://paperrater.com/site/submit_paper',
					// %5B is [ %5D is ]
					data: 'utf8=%E2%9C%93' +
					'&authenticity_token=' + encodeURIComponent(csrf_token) + 
					'&submission%5Bpaper%5D=' + encodeURIComponent(data) +
					'&submission%5Bworks_cited%5D=' +
					'&submission%5Beducation_level%5D=14' +
					'&submission%5Bpaper_type%5D=' +
					'&submission%5Boriginality_option%5D=skip' +
					'&terms=on',
					headers: {
						'Accept':'*/*;q=0.5, text/javascript, application/javascript, application/ecmascript, application/x-ecmascript',
						'Content-Type':'application/x-www-form-urlencoded',
						'Origin':'http://paperrater.com',
						'Referer':'http://paperrater.com/free_paper_grader',
						'X-Csrf-Token': csrf_token,
						'X-Requested-With':'XMLHttpRequest',
					},
					onload: function(response) {
						if (response.responseText) {
							var ticket_id = response.responseText.match(/style=\\"display:none\\">([^<]*)</);
							if (ticket_id === null || ticket_id.length != 2) {
								iWin.messageBox('<span style="color:red">Request to PaperRater API had failed</span>', {title:'PaperRater Check', timeout:5000});
								in_process_paperrater = false;
								return;
							}
							ticket_id = ticket_id[1];
							
							// Orignial PaperRater waits at least 8 seconds or so. We will wait 2 seconds before checking the status of submission.
							setTimeout(function(){plagiarism_check_status_check(csrf_token, ticket_id);}, 3000);
						} else {
							iWin.messageBox('<span style="color:red">Request to PaperRater API had failed</span>', {title:'PaperRater Check', timeout:5000});
						}
						in_process_paperrater = false;
					},
					onerror: function(response)
					{
						iWin.messageBox('<span style="color:red">Request to PaperRater API had failed</span>', {title:'PaperRater Check', timeout:5000});
						in_process_paperrater = false;
					}
				});
			} else {
				iWin.messageBox('<span style="color:red">Request to PaperRater API had failed</span>', {title:'PaperRater Check', timeout:5000});
			}
			in_process_paperrater = false;
		},
		onerror: function(response)
		{
			iWin.messageBox('<span style="color:red">Request to PaperRater API had failed</span>', {title:'PaperRater Check', timeout:5000});
			in_process_paperrater = false;
		}
	});

}

function plagiarism_check_status_check(csrf_token, ticket_id)
{
	console.log(csrf_token, ticket_id);
	GM_xmlhttpRequest({
		method: "GET",
		url: 'http://paperrater.com/ticket/' + ticket_id,
		headers: {
			'Referer':'http://paperrater.com/free_paper_grader',
		},
		onload: function(response) {
			if (response.responseText) {
				if (response.responseText.indexOf('Submission was blank') != -1) {
					setTimeout(function(){plagiarism_check_status_check(csrf_token, ticket_id);}, 2000);
				} else {
					GM_openInTab('http://paperrater.com/ticket/' + ticket_id, 1);
				}
			} else {
				iWin.messageBox('<span style="color:red">Request to PaperRater API had failed</span>', {title:'PaperRater Check', timeout:5000});
			}
			in_process_paperrater = false;
		},
		onerror: function(response)
		{
			iWin.messageBox('<span style="color:red">Request to PaperRater API had failed</span>', {title:'PaperRater Check', timeout:5000});
			in_process_paperrater = false;
		}
	});
}

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
	if (!settings.student_data) {
		settings.student_data = {};
		settings.student_data.name = "";
		settings.student_data.profileId = 0;
		settings.student_data.courses = [];
	}
}

function open_settings_window()
{
	var wID = 'UoPE-Settings';
	iWin.create({title: 'UoP Enhancer Settings', onclose:function(){iWin.destroy(wID);}}, wID);
	iWin.setContent('<div data-id=\"login\"><strong>One Click Login</strong><br>'+
					'Warning: do not use this feature on a non-private computer.<br>'+
					'Your username and pasword will be stored in the browser.<br>'+
					'The creator of this script will take <strong>no responsibility</strong><br>'+
					'if something happens to your UoP account!<br>'+
					'User: <input id="uope-s-user" type="text"><br>'+
					'Pass: <input id="uope-s-pass" type="password"><br>'+
					'<input id="uope-s-save" type="button" value="Save"></div>'+
					'<div data-id=\"student-data\"><input id="uope-s-gather" type="button" value="Gather Student Data"><div id="uope-s-student-data-status"> </div><br><div id="uope-s-student-data" style="width:300px;height:300px"> </div>', true, wID);
	iWin.setTabs({'login': 'Log-In', 'student-data': 'Student Data'}, wID);
	iWin.setPosition(60, (window.innerWidth / 2) - 20, wID);
	iWin.show(wID);
	render_student_data();
	document.getElementById('uope-s-save').onclick = settings_save;
	document.getElementById('uope-s-gather').onclick = gather_course_data;
}

function settings_save()
{
    var wID = 'UoPE-Settings';
    var uope_user_obj = document.getElementById('uope-s-user');
    var uope_pass_obj = document.getElementById('uope-s-pass');
    settings.uop_login = [uope_user_obj.value, uope_pass_obj.value];
    uope_pass_obj.value = '';
    
    var settings_string = JSON.stringify(settings);
    GM_setValue('settings', settings_string);
    iWin.hide(wID);
}

function render_student_data()
{
	var obj = document.getElementById('uope-s-student-data');
	var out = '';
	out += 'Name: ' + settings.student_data.name + '<br>';
	out += 'Profile ID: ' + settings.student_data.profileId + '<br>';
	if (settings.uop_login[0].length)
		out += 'Student ID: ' + settings.uop_login[0] + '<br>';
	out += '<h2>Courses</h2>';
	for (var i = 0;  i < settings.student_data.courses.length; i++) {
		var instructors_profile_url = 'http://my.uopeople.edu/user/view.php?id=' + settings.student_data.courses[i].instructorId + '&course=' + settings.student_data.courses[i].id;
		var instructors_pm_url = 'http://my.uopeople.edu/message/index.php?id=' + settings.student_data.courses[i].instructorId + '&viewing=course_' + settings.student_data.courses[i].id;
		out += '<h3>' + settings.student_data.courses[i].name + '</h3>';
		out += 'Course ID: ' + settings.student_data.courses[i].id + '<br>';
		out += 'Group ' + settings.student_data.courses[i].group + '<br>';
		out += '<h5>Instructor</h5>';
		out += settings.student_data.courses[i].instructorName + '<br>';
		out += '<a href="' + instructors_profile_url + '">Profile</a>  ';
		out += '<a href="' + instructors_pm_url + '">PM</a><br>';
		out += '<a href="mailto:' + settings.student_data.courses[i].instructorEmail + '">' + settings.student_data.courses[i].instructorEmail + '</a><br>';
	}
	document.getElementById('uope-s-student-data').innerHTML = out;
}

var in_process_gather_student_datagather_course_data_in_process = false;
function gather_course_data()
{
	document.getElementById('uope-s-student-data-status').innerText = 'Gathering Data...';
	in_process_gather_student_datagather_course_data_in_process = true;
	// Reset settings
	settings.student_data = {};
	settings.student_data.name = "";
	settings.student_data.profileId = 0;
	settings.student_data.courses = [];
	gather_course_data_general();
}

function gather_course_data_general()
{
	// Firstly, we scan Moodle homepage for courses
	GM_xmlhttpRequest({
		method: "GET",
		url: 'http://my.uopeople.edu/my/',
		onload: function(response)
		{
			if (!response.responseText) {
				in_process_gather_student_data = false;
				return;
			}
			// Extract course id and name from the menu
			// The Online Student Writing Center and Peer Assessment Office will be excluded because their names contain brackets ( and )
			var courses = response.responseText.match(/:\/\/my.uopeople.edu\/course\/view.php\?id=([\d]*)">([ \dA-Za-z\-,]*)<\/a><li>/g);
			var course_data = [];
			for (var i = 0; i < courses.length; i++) {
				var id = parseInt(courses[i].match(/id=([\d]+)/)[1], 10);
				var name = courses[i].match(/>([A-Za-z]+ [\d]+)/)[1];
				settings.student_data.courses.push({id:id, name:name, group:'', instructorId:0, instructorName:'', instructorEmail:'', possibleInstructors:[]});
			}
			// Extract student's name and profile id
			var student = response.responseText.match(/id=([\d]+)" title="View profile">([A-Za-z ]+)<\/a>/);
			if (student.length == 3) {
				settings.student_data.name = student[2];
				settings.student_data.profileId = parseInt(student[1], 10);
			}
			gather_course_data_course(0);
		},
		onerror: function(response)
		{
			iWin.messageBox('<span style="color:red">Failed To gather student data!</span><br>Request to UoP Moodle failed.', {title:'Student Data Gathering Error', timeout:5000});
			in_process_gather_student_data = false;
		}
	});
}

function gather_course_data_course(i)
{
	// Visit Course specific student's profile page to find the group
	GM_xmlhttpRequest({
		method: "GET",
		url: 'http://my.uopeople.edu/user/view.php?id=' + settings.student_data.profile_id + '&course=' + settings.student_data.courses[i].id,
		onload: function(response) {
			if (!response.responseText) {
				in_process_gather_student_data = false;
				return;
			}
			var group = response.responseText.match(/Group ([A-Z])(?:<\/a>)?<\/dd>/);
			if (group != null && group.length == 2) {
				settings.student_data.courses[i].group = group[1];
			}
			if ((i + 1) < settings.student_data.courses.length) {
				gather_course_data_course(i + 1);
			} else {
				gather_course_data_find_possible_instructors(0);
			}
		},
		onerror: function(response)
		{
			iWin.messageBox('<span style="color:red">Failed To gather student data!</span><br>Request to UoP Moodle failed.', {title:'Student Data Gathering Error', timeout:5000});
			in_process_gather_student_data = false;
		}
	});
}

function gather_course_data_find_possible_instructors(course_i)
{
	// Visit Course specific student's profile to find group
	GM_xmlhttpRequest({
		method: "GET",
		url: 'http://my.uopeople.edu/user/index.php?roleid=4&id=' + settings.student_data.courses[course_i].id,
		onload: function(response) {
			if (!response.responseText) {
				in_process_gather_student_data = false;
				return;
			}
			gather_course_data_find_user_ids(response.responseText, course_i);

			GM_xmlhttpRequest({
				method: "GET",
				url: 'http://my.uopeople.edu/user/index.php?roleid=3&id=' + settings.student_data.courses[course_i].id,
				onload: function(response) {
					if (!response.responseText) {
						in_process_gather_student_data = false;
						return;
					}
					gather_course_data_find_user_ids(response.responseText, course_i);

					if ((course_i + 1) < settings.student_data.courses.length) {
						gather_course_data_find_possible_instructors(course_i + 1);
					} else {
						gather_course_data_find_instructor(0, 0);
					}

				},
				onerror: function(response)
				{
					iWin.messageBox('<span style="color:red">Failed To gather student data!</span><br>Request to UoP Moodle failed.', {title:'Student Data Gathering Error', timeout:5000});
					in_process_gather_student_data = false;
				}
			});
		},
		onerror: function(response)
		{
			iWin.messageBox('<span style="color:red">Failed To gather student data!</span><br>Request to UoP Moodle failed.', {title:'Student Data Gathering Error', timeout:5000});
			in_process_gather_student_data = false;
		}
	});
}

function gather_course_data_find_user_ids(text, course_i)
{
	var user_ids_raw = text.match(/:\/\/my.uopeople.edu\/user\/view.php\?id=([\d]+)/g);
	for (var i = 0; i < user_ids_raw.length; i++) {
		var user_id = parseInt(user_ids_raw[i].match(/[\d]+/)[0], 10);
		
		// Exclude own student's profile id
		if (user_id == settings.student_data.profileId) continue;
		
		if (settings.student_data.courses[course_i].possibleInstructors.indexOf(user_id) == -1)
			settings.student_data.courses[course_i].possibleInstructors.push(user_id);
	}
}

function gather_course_data_find_instructor(course_i, posibleInstructor_i)
{
	GM_xmlhttpRequest({
		method: "GET",
		url: 'http://my.uopeople.edu/user/view.php?id=' + settings.student_data.courses[course_i].possibleInstructors[posibleInstructor_i] + '&course=' + settings.student_data.courses[course_i].id,
		onload: function(response) {
			if (!response.responseText) {
				in_process_gather_student_data = false;
				return;
			}
				
			var instructor_group = response.responseText.match(/Group ([A-Z])(?:<\/a>)?<\/dd>/);
			if (instructor_group.length != 2) {return;}// error

			// If instructor of a course where student is enroled is in the same group as the student, it means that it is this student's instructor
			if (instructor_group[1] == settings.student_data.courses[course_i].group) {
				settings.student_data.courses[course_i].instructorId = settings.student_data.courses[course_i].possibleInstructors[posibleInstructor_i];
				var instructor_name = response.responseText.match(/Personal profile:([ A-Za-z]+)/);
				// Remove space before and after the name
				instructor_name = instructor_name[1].substr(1, instructor_name[1].length - 2);
				var instructor_email = response.responseText.match(/Email address<\/dt><dd><a href="([^"]+)">/);
				instructor_email = decodeURI(instructor_email[1]);
				instructor_email = instructor_email.substr(instructor_email.indexOf(':') + 1);
				settings.student_data.courses[course_i].instructorName = instructor_name;
				settings.student_data.courses[course_i].instructorEmail = instructor_email;

				if ((course_i + 1) < settings.student_data.courses.length) {
					gather_course_data_find_instructor(course_i + 1, 0);
				} else {
					in_process_gather_student_data = false;
					var settings_string = JSON.stringify(settings);
					GM_setValue('settings', settings_string);
					render_student_data();
				}

				delete settings.student_data.courses[course_i].possibleInstructors;
			} else {
				if ((posibleInstructor_i + 1) < settings.student_data.courses[course_i].possibleInstructors.length) {
					gather_course_data_find_instructor(course_i, posibleInstructor_i + 1);
				}
			}
		},
		onerror: function(response)
		{
			iWin.messageBox('<span style="color:red">Failed To gather student data!</span><br>Request to UoP Moodle failed.', {title:'Student Data Gathering Error', timeout:5000});
			in_process_gather_student_data = false;
		}
	});
}

// Mentioned many times throughout the Student Handbook, UoP Time is (GMT -5)
var uop_time_sec_offset = -5 * 60 * 60;
function uop_time_init()
{
    var uop_date = new Date();
    uop_date.setTime(uop_date.getTime() + uop_date.getTimezoneOffset() * 60000 + uop_time_sec_offset * 1000);
    
    // Generate events
    for (var t = 0; t < uop_terms.length; t++) {
        var week_beginning = new Date(uop_terms[t][1]);
        // Subtract timezone offset and add 5 min, since week starts 5 min after day had started
        week_beginning.setTime(week_beginning.getTime() + week_beginning.getTimezoneOffset() * 60000 + (5 * 60) * 1000);
        for (var w = 0; w < 8; w++) {
            uop_events.push(['Term '+ uop_terms[t][0] + ' Week '+ (w + 1) + ' Starts', new Date(week_beginning.getTime())]);
            // Week ends 5min before the beginning of the next week's day
            week_beginning.setTime(week_beginning.getTime() + (6 * 24 * 60 * 60) * 1000 + (23 * 60 * 60) * 1000 + (50 * 60) * 1000);
            uop_events.push(['Term '+ uop_terms[t][0] + ' Week '+ (w + 1) + ' Ends', new Date(week_beginning.getTime())]);
            week_beginning.setTime(week_beginning.getTime() + (10 * 60) * 1000);
        }
        uop_events.push(['Term '+ uop_terms[t][0] + ' Exam Starts', new Date(week_beginning.getTime())]);
        week_beginning.setTime(week_beginning.getTime() + (3 * 24 * 60 * 60) * 1000 + (23 * 60 * 60) * 1000 + (50 * 60) * 1000);
        uop_events.push(['Term '+ uop_terms[t][0] + ' Exam Ends', new Date(week_beginning.getTime())]);
    }
    
}

var uop_terms = [[5, '2016-06-16'], [1, '2016-09-01'], [2, '2016-11-10']] , uop_events = [];

var time_window_interval;
function format_time_period(time, color = true)
{
    // convert milliseconds into seconds
    time = Math.ceil(time / 1000);
    
    var s, m, h, d;
    s = time % 60; time = (time - s) / 60;
    m = time % 60; time = (time - m) / 60;
    h = time % 24; time = (time - h) / 24;
    d = time;
	
    if (d) {
		h = Math.round(h + m / 60 + s / 60 / 60);
        if (h == 24) {d++; h = 0;}
		
		var ret = '';
		if (d == 1) ret += '1 day'; else ret += ' ' + d + ' days';
		if (h == 1) ret += ' 1 hour'; else if (h > 1) ret += ' ' + h + ' hours';
		
        return ret;
    } else if (h) {
        m = Math.round(m + s / 60);
        if (m == 60) {h++; m = 0;}
		
		var ret = (color ? '<span style="color:#DD0">' : '');
		if (h == 1) ret += ' 1 hour'; else ret += ' ' + h + ' hours';
		if (m == 1) ret += ' 1 minute'; else if (m > 1) ret += ' ' + m + ' minutes';	
		ret += (color ? '</span>' : '');
		
		return ret;
    } else {
		var ret = (color ? '<span style="color:#D00">' : '');
		
		if (m == 1) ret += ' 1 minute'; else ret += ' ' + m + ' minutes';
		if (s == 1) ret += ' 1 second'; else if (s > 1) ret += ' ' + s + ' seconds';
		
		ret += (color ? '</span>' : '');
		return ret;
    }
}
function time_window_output_date(date)
{
    return date.getFullYear() + ' ' + (date.getMonth() + 1) + ' ' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}
function time_window_update()
{
    var plan = '';
    var uop_time_current = new Date();
    uop_time_current.setTime(uop_time_current.getTime() + uop_time_current.getTimezoneOffset() * 60000 + uop_time_sec_offset * 1000);
    
    for (var i = uop_events.length - 1; i > -1; i--) {
        if (uop_events[i][1].getTime() < uop_time_current.getTime()) {
            plan += uop_events[i][0] + '   ' + time_window_output_date(uop_events[i][1]) + '<br>';
            plan += 'Current UoP time: ' + time_window_output_date(uop_time_current) + '<br>';
            if ((i + 1) < uop_events.length) {
                i++;
                plan += uop_events[i][0] + '   ' + time_window_output_date(uop_events[i][1]) + '  in ' + format_time_period(uop_events[i][1] - uop_time_current.getTime()) + '<br>';
            }
            break;
        }
    }
    
    var plan_obj = document.getElementById('uope-time-plan').innerHTML = plan;
}
function open_events_window()
{
  var wID = 'UoPE-Events';
  iWin.create({title: 'Events', onclose:function(){window.clearInterval(time_window_interval);iWin.destroy(wID);}}, wID);
  iWin.setContent('<div id="uope-time-plan" style="min-width:400px;min-height:50px"></div>', true, wID);
  iWin.setPosition(60, (window.innerWidth / 2) - 20, wID);
  time_window_update();
  time_window_interval = window.setInterval(time_window_update, 1000);
  iWin.show(wID);
}
