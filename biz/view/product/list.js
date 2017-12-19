!function(){
app.view('prodList', (nm, vo, pm)=>{
	vo.x = ko.observable('');
	vo.dl = ko.observable('');
	vo.list = ko.observableArray([
		{img: '/resource/images/not-found.png', name:'a1'},
		{img: '/resource/images/not-found.png', name:'a2'},
		{img: '/resource/images/not-found.png', name:'a3'},
		{img: '/resource/images/not-found.png', name:'a4'},
		{img: '/resource/images/not-found.png', name:'a5'}
	]);
	vo.order = function(){
		app.popup('confirm').open(this.name)
	};
	vo.more=function(){
		app.log('----', this)
		// vo.list.push({img: '/resource/images/not-found.png'});
		app.popup('confirm').open('----')
		// vo.dl(`
		// <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" style="margin-top:12px; width:100%; font-weight:bold;" data-bind="click:more">더 보 기</button>
		// <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" style="margin-top:12px; width:100%; font-weight:bold;" data-bind="click:more">더 보 기</button>
		// `);

		// setTimeout(x=>{
		// 	_.each($('.mdl-button'), v=>{
		// 		app.log(v.outerText);
		// 		componentHandler.upgradeElement(v);
		// 	})
		// }, 2000)
	};
})
app.view('prodList').load();
}();
