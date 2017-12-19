!function(){
window.app = (x=>{
	const _o={};
	const _svc={}, _vi={}, _pop={}, _debug=true;
	$('head').append(`<style>
		@-webkit-keyframes progressbar {
			0% {width:0; margin-left:0}
			80% {width:100%; margin-left:0}
			100% {margin-left:100%}
		}
		@keyframes progressbar {
			0% {width:0; margin-left:0}
			80% {width:100%; margin-left:0}
			100% {width:100%; margin-left:100%}
		}

		[data-bind-view] {display:none;}
		#__resource__ {position:fixed; top:0; left:0; width:100%; z-index:99999}
		#__resource__ .__dimmed__ {position:absolute; top:0; left:0; width:100%; background:#000; opacity:.2;}
		#__resource__ .__progress__ {position:fixed; top:0; left:0; width:100%; background:#fff; text-align:center;}
		#__resource__ .__progress__ .msg {padding:5px; color:#fff; background-color:#555;}
		#__resource__ .__progress__ .bar {height:5px; border-radius:2px; background-color:#aaa; animation:progressbar 10s infinite; -webkit-animation:progressbar 10s infinite;}
		#__resource__ .__popup__ {position:absolute; left:5%; width:90%; background:#fff; border-radius:3px; box-shadow:1px 1px 10px 1px #ccc; display:none;}
		#__resource__ .__popup__ >div {padding:10px;}
		#__resource__ .__popup__ .title {padding-right:18px; font-weight:bold; border-bottom:1px solid #ccc; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; display:none;}
		#__resource__ .__popup__ .content {overflow-y:auto;}
		#__resource__ .__popup__ .bottom {border-top:1px solid #ccc; text-align:right; display:none;}
		#__resource__ .__popup__ .bottom button {margin-left:10px; padding:0 10px 0 10px;}
	</style>`);
	return {log, mode, service, resource, view, popup};

	function log(...p) {
		_debug && console && console.log(...p)
	}
	function mode(m) {
		_debug = m
	}
	function service(nm,fn) {
		if(!fn) return _svc[nm]();
		_svc[nm] = fn;
	}
	function resource(nm, ...p) {
		const rc = $('#__resource__').length ? $('#__resource__') : $('<div id="__resource__"/>');
		const node = $('#__resource__ .__nodes__').length ? $('#__resource__ .__nodes__') : $('<div class="__nodes__"/>');
		!$('#__resource__').length && $('body').append(rc.append(node));
		rc.height($('body').height())

		const fn = {dimmed, progressOn, progressOff, popupOpen, popupClose};
		return fn[nm] && fn[nm](...p);

		// resource local
		function dimmed() {
			const dim = $('<div class="__dimmed__"/>');
			dim.height($('body').height());

			node.find('.__dimmed__').remove();
			if(node.children().length) {
				node.children().last().before(dim);
				rc.show();
			} else {
				$('body').css({overflow:'auto'});				
				rc.hide();
			}
		}
		function progressOn(msg='') {
			if(node.find('.__progress__').length) return;

			node.append(`<div class="__progress__">
				<div class="msg">
					<div class="bar"></div>
					${msg}
				</div>
			</div>`);

			dimmed();
		}
		function progressOff() {
			node.find('.__progress__').remove()
			dimmed();
		}
		function popupOpen() {
			const popup = $(`<div class="__popup__"/>`).css({
				top: `${$(window).height()*0.1}px`
			});
			const title = $('<div class="title"/>');
			const content = $('<div class="content"/>').css({
				'max-height': `${$(window).height()*0.6}px`
			});
			const bottom = $(`<div class="bottom"></div>`);

			popup.append(title).append(
				$('<div/>').append(content)
			).append(bottom)
			node.append(popup);
			dimmed();
			return {popup, title, content, bottom};
		}
		function popupClose() {
			node.find('.__popup__').last().remove();
			dimmed();
		}
	}
	function view(nm, fn) {
		const view = $(`[data-bind-view=${nm}]`)
		if(fn) {
			_vi[nm]={fn, vo:{}, on:{}, vl:{}};
			$(view).hide();
		}
		return {load, visible};

		// view local
		function load(pm, url) {
			_vi[nm]['fn'] && _vi[nm]['fn'](nm, _vi[nm]['vo'], pm);
			app.service('http').text(url).then(tpl=>{
				url && view.html(tpl);
				ko.cleanNode(view.get(0));
				ko.applyBindings(_vi[nm]['vo'], view.get(0));
				view.find('.mdl-button').each((k,v)=>{
					componentHandler.upgradeElement(v);
				})
				setTimeout(x=>{view.show()}, 1)
			});
		}
		function visible(b) {
			b ? view.show() : view.hide()
		}
	}
	function popup(nm, fn) {
		if(fn) {
			_pop[nm] = {fn, vo:{}, df:{}};
		}
		return {open, close};

		function open(pm, url) {
			$('body').css({overflow:'hidden'});
			const {popup, title, content, bottom} = resource('popupOpen');
			const btnClass = 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect';
			defPopup({
				alert: `<button class="${btnClass} mdl-button--colored" data-bind="click:ok">확 인</button>`,
				confirm: `<button class="${btnClass} mdl-button--colored" data-bind="click:ok">확 인</button>
					<button class="${btnClass}" data-bind="click:cancel">취 소</button>`,
				yesno: `<button class="${btnClass} mdl-button--colored" data-bind="click:ok">예</button>
					<button class="${btnClass}" data-bind="click:cancel">아니오</button>`
			}[nm]);

			_pop[nm]['fn'] && _pop[nm]['fn'](nm, _pop[nm]['vo'], pm)
			app.service('http').text(url).then(tpl=>{
				url && content.html(tpl);
				ko.cleanNode(popup.get(0));
				ko.applyBindings(_pop[nm]['vo'], popup.get(0));
				popup.find('.mdl-button').each((k,v)=>{
					componentHandler.upgradeElement(v);
				})
				popup.show();
			});
			
			_pop[nm]['df'] = $.Deferred();
			return _pop[nm]['df'].promise();

			function defPopup(btn) {
				if(!btn) return;
				content.html('<div data-bind="html:msg"/>').css({
					padding: '20px 10px 20px 10px',
					'text-align': 'center',
				});
				bottom.html(btn).show();
			}
		}
		function close(ro) {
			resource('popupClose');
			_pop[nm]['df'].resolve(ro)
		}
	}
})();

// default object
// ------------------------------
app.service('http', x=>{
	return {text, ajax, submit};

	function text(url) {
		return (p => {
			url ? $.ajax({
				type: 'get',
				contentType: 'text/html',
				url: `${url}?v=${Date.now()}`,
				success: r => p.resolve(r),
				error: r => r.status==200 ? p.resolve(r.responseText) : p.reject(r)
			}) : p.resolve()
			return p.promise()
		})($.Deferred());
	}
	function ajax() {
	}
	function submit(url, prm={}, bProg=true) {
		bProg && app.resource('progressOn');
        return (p=>{
        	$.ajax({
				type: 'post',
				dataType: 'json',
				contentType: 'application/x-www-form-urlencoded;charset=utf-8',
				xhrFields: {withCredentials:true},
				url: url,
				data: Object.entries(prm).map((v)=>encodeURIComponent(v.join('='))).join('&'),
				success: r => {return bProg && app.resource('progressOff'), p.resolve(r)},
				error: r => r.status==200 ? p.resolve(r.responseText) : p.reject(r)
        	})
			return p.promise()
        })($.Deferred());
	}
});
app.popup('alert', (nm, vo, pm)=>{
	vo.msg = ko.observable(pm);
	vo.ok = x => app.popup(nm).close(true);
})
app.popup('confirm', (nm, vo, pm)=>{
	vo.msg = ko.observable(pm);
	vo.ok = x => app.popup(nm).close(true);
	vo.cancel = x => app.popup(nm).close(false);
})
app.popup('yesno', (nm, vo, pm)=>{
	vo.msg = ko.observable(pm);
	vo.ok = x => app.popup(nm).close(true);
	vo.cancel = x => app.popup(nm).close(false);
})
}();

/*
// test
//--------------------------------------------------
$(document).ready(x=>{
//	app.service('http').text('/conts/html/myPage/limitService/MOBFM054/MOBFM054C0902.html')
//	.then(x=>{
//		app.log('-', x)
//		return app.service('http').submit('http://127.0.0.1:8080/mob/MOBFM054N/MOBFM054C0101.ajax', {mbw_json:'{"a":"2"}', aa:''})
//	}).then(x=>{
//		app.log('-', x)
//	});

	app.view('MOBFM054C05', (nm, vo, pm)=>{
		vo.t = ko.observable("중고차판매점 이용가능");
		vo.a = e=>{
			app.log(nm, pm);
			app.popup('mobfmTest').open({pop:'t'}, '/conts/html/myPage/limitService/MOBFM054/MOBFM054C0902.html');

//			app.resource('progressOn');
//			setTimeout(x=>{
//				app.resource('progressOff');
//			}, 2000)
		};
	});
	app.view('MOBFM054C05').load({a:'----'}, '');
//	app.view('MOBFM054C05').load({a:'----'}, '/conts/html/myPage/limitService/MOBFM054/MOBFM054C0902.html');

	app.popup('mobfmTest', (nm, vo, pm)=>{
		app.log(nm, pm)
		vo.xxx = ko.observable("중고차판매점 이용가능22");
		vo.zzz = e=>{
			app.popup('alert').open('aaaa').then(x=>{
//				app.popup(nm).close()
			})
		};
		vo.kkk = e=>{
			app.popup(nm).close()
		};
	});
});
*/