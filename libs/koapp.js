const koApp = new class {
	constructor() {
		this._instance	= '';
		this._debug		= location.hash == '#debug';
		this._config	= __koApp__||{};
		this._selector	= {
			header: $(this._config.selector.header),
			main: $(this._config.selector.main),
			footer: $(this._config.selector.footer),
		};

		this._$style	= $('<style/>');
		this._$resource	= $('<div id="__resource__"/>');
		this._$modal	= $('<div class="__modal__"/>');
		this._$bottomSheet	= $('<div class="__bottom-sheet__"/>');
		$('head').append(this._$style.append(this._config.style||''))
		$('body').append(this._$resource.append(this._$bottomSheet).append(this._$modal))
	}

	// properties
	// ============================== //
	get selector() {
		return this._selector
	}
	get resource() {
		return {
			root: this._$resource,
			modal: this._$modal,
			bottomSheet: this._$bottomSheet
		}
	}
	get config() {
		return this._config;
	}
	set config(v) {
		this._config;
	}

	// methods
	// ============================== //
	log(...p) {
		this._debug && console && console.log(...p)
	}
	help() {
		window.open('_blank')
	}
	dimmed() {
		const dim = $(`<div class="__dimmed__"/>`).css({
			height: $('body').height() + 100
		});
		this._$modal.find('.__dimmed__').remove();
		this._$modal.children().last().before(dim);
	}
	loadingBar(show=true, msg) {
		if(show && this._$modal.find('.__loading__').length) return;

		const bar = $('<div class="__loading__"/>').append(this._config.loadingBar);
		show ? this._$modal.append(bar) : this._$modal.find('.__loading__').remove();
	}
	instance(v) {
		if(v) {
			this._instance = v
		} else {
			return this._instance
		}
	}
};


//
//==========
class App {
	constructor(name, tpl) {
		if(!name) throw `${this.constructor.name} is invalid name`;

		this._call	= {};
		this._name	= name;
		this._tpl	= tpl;
		this._qry	= `data-${this.constructor.name.toLowerCase()}`;
		this._$dom	= $(`<div ${this._qry}="${name}"/>`);
	}

	// properties
	// ============================== //
	set visible(b) {
		b ? this._$dom.show() : this._$dom.hide()
	}
	set vo(o) {
		Object.entries(o).forEach(([k,v])=>{
			this._vo[k] = typeof v == 'object' ? ko.observableArray(v) : ko.observable(v)
		})
	}
	get vo() {
		return this._vo;
	}
	get call() {
		return this._call;
	}
	get param() {
		return JSON.parse('{"'+location.search.replace('?','').replace(/&/g,'","').replace(/=/g,'":"')+'"}');
	}

	// methods
	// ============================== //
	render(prm, fn) {
		this._vo = {};
		this._onLoad && this._onLoad(prm)

		App.http().text(typeof this._tpl == 'string' && this._tpl).then(txt=>{
			this._rendAppend
			? this._$dom.append(typeof this._tpl == 'string' ? txt : this._tpl)
			: this._$dom.html(typeof this._tpl == 'string' ? txt : this._tpl);
			this.uiUpdate();

			ko.cleanNode(this._$dom.get(0));
			ko.applyBindings(this._vo, this._$dom.get(0));
			fn && fn();
		})
	}
	uiUpdate() {
		setTimeout(x=>{
				componentHandler.upgradeElements(this._$dom.find('.mdl-button'))
				componentHandler.upgradeElements(this._$dom.find('.mdl-radio'))
				componentHandler.upgradeElements(this._$dom.find('.mdl-menu'))
				componentHandler.upgradeElements(this._$dom.find('.mdl-textfield'))
				componentHandler.upgradeElements(this._$dom.find('.mdl-progress'))
				componentHandler.upgradeElements(this._$dom.find('.mdl-tabs'))
//				componentHandler.upgradeElements(this._$dom.find('.mdl-data-table'))
		}, 10)
	}

	// events
	// ============================== //
	set onLoad(fn) {
		this._onLoad = fn;
	}
	set loadAfter(fn) {
		this._loadAfter = fn;
	}
	get loadAfter() {
		return this._loadAfter;
	}

	// static
	// ============================== //
	static log(...p) {
		koApp.log(...p);
	}
	static http(server, loading=true) {
		server = server || koApp.config.server || '';
		return {text, submit, json}

		// get text
		function text(url) {
			const df = $.Deferred();
			url ? $.ajax({
				type: 'get',
				contentType: 'text/html',
				url: `${url}?v=${Date.now()}`,
				success: r => df.resolve(r),
				error: r => r.status==200 ? df.resolve(r.responseText) : df.reject(r)
			}) : df.resolve()

			return df.promise();
		}
		// get json
		function json(url, prm={}) {
			const df = $.Deferred();
			koApp.loadingBar();
			koApp.log(`%c${url}\n`, 'color:#00f;', prm)

			$.ajax({
				type: 'post',
				contentType: 'application/json',
				url: `${server}${url}?v=${Date.now()}`,
				data: prm,
				success: r => {
					koApp.log(`%c${url}\n`, 'color:#f00;', r)
					loading && koApp.loadingBar(false)
					df.resolve(r);
				},
				error: (r,st, er) => {
					loading && koApp.loadingBar(false)
					r.status==200 ? df.resolve(r.responseText) : Modal.alert('통신 실패').then(x=>df.reject(r))
				}
        	});

			return df.promise();
		}
		// form submit (Access-Control-Allow)
		function submit(url, prm={}) {
			const df = $.Deferred();
			koApp.loadingBar();
			koApp.log(`%c${url}\n`, 'color:#00f;', prm, koApp.config.server)

			$.ajax({
				type: 'post',
				contentType: 'application/x-www-form-urlencoded;charset=utf-8',
				xhrFields: {
					withCredentials:true
				},
				url: server + url,
				data: 'json='+encodeURIComponent(JSON.stringify(prm))+'&inst='+koApp.instance(),
				success: r => {
					koApp.log(`%c${url}\n`, 'color:#f00;', r);
					loading && koApp.loadingBar(false);
					r.inst && koApp.instance(r.inst);
					df.resolve(r);
				},
				error: (r,st,er) => {
					koApp.log(`%c${url}\n`, 'color:#f00;', r)
					loading && koApp.loadingBar(false)
					if(r.status==200) {
						const v = JSON.parse(r.responseText);
						v.inst && koApp.instance(v.inst);
						df.resolve(v)
					} else {
						Modal.alert('통신 실패').then(x=>df.reject(r))
					}
				}
        	});

			return df.promise();
		}
	}
}

class View extends App {
	constructor(name, tpl, single='') {
		super(name, tpl)

		this._single = single;
		const {main} = koApp.selector;
		main.append(this._$dom);
	}

	// methods
	// ============================== //
	load(prm) {
		this.render(prm);

		if(this._single == 'single') {
			$(`[${this._qry}]`).hide();
			this._$dom.show();
		}
	}
}

class Modal extends App {
	constructor(name, tpl) {
		super(name, tpl)
	}

	// methods
	// ============================== //
	load(prm) {
		const {modal} = koApp.resource;

		this._$df = $.Deferred();
		this.render(prm, x=>{
			this._$dom.removeClass('ani-modal-off').addClass('ani-modal-on')
			this._$dom.off('animationend').on('animationend', e=>{
				this._loadAfter && this._loadAfter();
			});

			modal.append(this._$dom)
			koApp.dimmed();

			this._$dom.find('.modal-box').css({
				'max-height': window.innerHeight * 0.6,
			});
			this._$dom.css({
				'margin-top': (window.innerHeight - this._$dom.height()) * 0.3,
				'margin-left': (window.innerWidth - this._$dom.width()) * 0.5
			}).show();
			$('body').css({overflow:'hidden'});
		});
		return this._$df.promise();
	}
	close(v) {
		this._$dom.removeClass('ani-modal-on');
		this._$df.resolve(v)
		this._$dom.fadeOut(e=>{
			this._$dom.remove();
			koApp.dimmed();
			$('body').css({overflow:'auto'});
		})
	}

	// static
	// ============================== //
	static alert(msg) {
		const modal = new Modal('alert', $(`
			<div class="modal-box" data-bind="html:message"></div>
			<div class="modal-bar">
				${koApp.config.modal.alertClose}
			</div>
		`));
		modal.onLoad = prm=>{
			modal.vo = prm;
			modal.vo.close = x=>modal.close();
		}
		return modal.load({message:msg});
	}
	static confirm(msg) {
		const modal = new Modal('confirm', $(`
			<div class="modal-box" data-bind="html:message"></div>
			<div class="modal-bar">
				${koApp.config.modal.confirmOk}
				${koApp.config.modal.confirmCalcel}
			</div>
		`));
		modal.onLoad = prm=>{
			modal.vo = prm;
			modal.vo.ok = x=>modal.close(true);
			modal.vo.cancel = x=>modal.close(false);
		}
		return modal.load({message:msg});
	}
	static yesno(msg) {
		const modal = new Modal('yesno', $(`
			<div class="modal-box" data-bind="html:message"></div>
			<div class="modal-bar">
				${koApp.config.modal.yesnoYes}
				${koApp.config.modal.yesnoNo}
			</div>
		`));
		modal.onLoad = prm=>{
			modal.vo = prm;
			modal.vo.yes = x=>modal.close(true);
			modal.vo.no = x=>modal.close(false);
		}
		return modal.load({message:msg});
	}
}

class BottomSheet extends App {
	constructor(tpl) {
		super('bottomSheet', tpl)
	}

	// methods
	// ============================== //
	load(prm) {
		const {bottomSheet} = koApp.resource;
		this._$close = $(koApp.config.bottomSheet.sheetClose).on('click', e=>{
			bottomSheet.slideUp(x=>{
				this._$close.off('click')
				$('#__bottom-sheet-height__').remove();
			})
		})
		this.render(prm, x=>{
			bottomSheet.html($('<div class="sheet-box"/>').append(this._$dom)).append(this._$close)

			const wh = window.innerHeight;
			const ht = $('#__bottom-sheet-height__').length
				? $('#__bottom-sheet-height__') : $('<div id="__bottom-sheet-height__"/>');
			bottomSheet.find('.sheet-box').css({
				'max-height': window.innerHeight * 0.6,
			});

			// mobile bottom space
			window.innerWidth < 700 && $('body').append(ht.css({
				height: (this._$dom.height() > window.innerHeight * 0.6
					? window.innerHeight * 0.6
					: this._$dom.height()) + 50
			}));

			bottomSheet.slideDown(x=>this._loadAfter && this._loadAfter())
		});

		return x=>this._$close.hide()
	}
	close(v) {
		this._$close.trigger('click')
	}

	// static
	// ============================== //
	static toast(msg, interval=2000) {
		const sheet = new BottomSheet($(`
			<div class="sheet-box" data-bind="html:message"></div>
		`));
		sheet.onLoad = (prm)=>{
			sheet.vo = prm;
			sheet.loadAfter(x=>setTimeout(x=>sheet.close(), interval))
		}
		sheet.load({message:msg})()
	}
}


class SelectOut extends App {
	constructor(name, tpl) {
		super(name, tpl)
		this._$dom = $('#'+name);
	}

	load(prm) {
		this.render(prm);
	}
}

class SelectAppend extends SelectOut {
	constructor(name, tpl) {
		super(name, tpl)
		this._rendAppend = true;
	}
}
