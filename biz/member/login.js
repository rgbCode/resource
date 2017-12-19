const v01 = new View('v01', '/biz/k0u/account-v01.html');
const p01 = new Modal('p01', '/biz/k0u/account-p01.html');

// start---
header.load().then(x=>{
	header.call.setTitle('ShinhanCard');
	v01.load();
});

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
		Modal.confirm('----')
//		getList().then(r=>r.json.forEach(v=>v01.vo.list.push(v)));
	};
//10.85.3.25
	//
	getList().then(r=>v01.vo.list(r.json));

	// local
	// ====================
	function getList() {
		return App.http().submit('/data/k0u/account/list.jsp', {});
	}
};

// 거래입력
//====================
p01.onLoad = function() {
};