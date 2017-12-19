const launcher = new SelectAppend('rgbHeader', '/resource/biz/cmm/run-header.html');
const pLaunAuth = new Modal('pAuth', '/resource/biz/cmm/run-pAuth.html');
const pLaunMypage = new Modal('pMypage', '/resource/biz/cmm/run-pMypage.html');

launcher.onLoad = function() {
	launcher.vo = {
		title: 'ShinhanCard',
		login: false,
		navis: []
	};
	launcher.vo.auth = function() {
		App.log('login', launcher.vo.login())

		if(launcher.vo.login()) {
		} else {
			pLaunAuth.load().then(rs=>{
				if(rs) {
					launcher.vo.login(true),
					launcher.loadAfter && launcher.loadAfter()
				}
			})
		}
	};

	// onInit
	// ----------
	App.http().submit('/data/member/touch.json').then(rs=>{
		rs.cno && launcher.vo.login(true);
		launcher.loadAfter && launcher.loadAfter();
	});
};
launcher.load();

pLaunAuth.onLoad = function(p) {
	pLaunAuth.vo = {
		isJoin: false
	};

	pLaunAuth.vo.join = function() {
		pLaunAuth.vo.isJoin(true);
		pLaunAuth.uiUpdate();
	};
	pLaunAuth.vo.google = function() {
		App.http().submit('/data/member/auth.jsp').then(rs=>{
			pLaunAuth.close(true)
		});
	};
};
