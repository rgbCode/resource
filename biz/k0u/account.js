const v01 = new View('v01', '/resource/biz/k0u/account-v01.html');
const p01 = new Modal('p01', '/resource/biz/k0u/account-p01.html');

launcher.loadAfter = x=>{
	launcher.vo.title('account list');
	if(!launcher.vo.login()) return launcher.vo.auth();

	v01.load();
};

// v01 view
// ====================
v01.onLoad = function() {
	v01.vo = {
		list: [],
		regAmtValid: []
	};

	// event
	// ====================
	v01.vo.reg = e=>{
		p01.load()
	};
	v01.vo.regSubmit = e=>{
		App.log('--')
		v01.vo.regAmtValid({'is-valid':true})
	};
	v01.vo.more = e=>{
		getList().then(r=>r.json.forEach(v=>v01.vo.list.push(v)));
	};
	//
	getList().then(r=>v01.vo.list(r.json));

	// local
	// ====================
	function getList() {
		return App.http().submit('/data/member/list.json', {});
	}
};

// 거래입력
//====================
p01.onLoad = function() {
	p01.vo.close = e=>{
		p01.close()
	};
};