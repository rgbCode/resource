var __koApp__ = {
	server: 'https://rgb-code.000webhostapp.com',
	style: [
		'a {text-decoration:none}',
		'#__resource__ {z-index:33;}',
		'#__resource__ .ani-modal-on {display:block; animation:modalOn 1s 1;}',
		'#__resource__ {position:fixed; top:0; left:0; width:100%;}',
		'#__resource__ .__dimmed__ {position:absolute; top:0; left:0; width:100%; background:#aaa; opacity:.6; z-index:10}',
		'#__resource__ [data-modal] {position:absolute; width:80%; background:#fff; box-shadow:3px 3px 10px 0 #666; display:none; z-index:10}',
		'#__resource__ [data-modal] .modal-box {padding:12px; overflow-y:auto;}',
		'#__resource__ [data-modal] .modal-bar {padding:8px; border-top:1px solid #eee; text-align:right;}',
		'#__resource__ .__bottom-sheet__ {position:fixed; bottom:0; background:#fff; width:100%; box-shadow:1px 1px 10px 1px #aaa; display:none;}',
		'#__resource__ .__bottom-sheet__ .sheet-close {position:absolute; top:-25px; right:25px;}',
		'#__resource__ .__bottom-sheet__ .sheet-box {padding:12px; overflow-y:auto;}',
		'.rgb-table {width:100%; border-collapse:collapse; border-radius:3px;}',
		'.rgb-table td, .rgb-table th {padding:8px;}',
		'.rgb-table .line {border-top:1px solid #ddd;}',
		'.rgb-table .cell {border:1px solid #ddd;}',
		'.rgb-table .num {text-align:right;}',
		'.rgb-list-form {list-style:none; margin:0; padding:0;}',
		'@keyframes modalOn {',
		'	0% {margin-top:-10%;}',
		'}',
		'@media (min-width: 700px) {',
			'#__resource__ [data-modal] {width:600px;}',
			'#__resource__ [data-modal=pAuth] {width:450px;}',
			'#__resource__ .__bottom-sheet__ {left:15%; width:70%;}',
		'}',
	].join(''),
	selector: {
		header: '#rgbHeader',
		main: '#rgbMain',
		footer: '#shcFoot',
	},
	loadingBar: [
		'<div style="position:fixed; top:0; left:0; width:100%; height:100%; background:#000; opacity:.1;"></div>',
		'<div class="mdl-progress mdl-js-progress mdl-progress__indeterminate" style="width:100%;"></div>',
		'<script>componentHandler.upgradeElements(document.querySelector(\'.mdl-progress\'))</script>'
	].join(''),
	modal: {
		alertClose: '<button class="mdl-button mdl-js-button mdl-button--accent mdl-button--icon" data-bind="click:close"><i class="material-icons">done</i></button>',
		confirmOk: '<button class="mdl-button mdl-js-button mdl-button--accent mdl-button--icon" data-bind="click:ok"><i class="material-icons">done</i></button>',
		confirmCalcel: '<button class="mdl-button mdl-js-button mdl-button--colored mdl-button--icon" data-bind="click:cancel"><i class="material-icons">close</i></button>',
		yesnoYes: '<button class="mdl-button mdl-button--raised mdl-button--accent mdl-js-button mdl-js-ripple-effect" data-bind="click:yes">예</button>',
		yesnoNo: '<button class="mdl-button mdl-button--raised button--colored mdl-js-button mdl-js-ripple-effect" data-bind="click:no">아니오</button>'
	},
	bottomSheet: {
		sheetClose: '<button class="sheet-close mdl-button mdl-button--fab mdl-button--colored mdl-js-button  mdl-js-ripple-effect"><i class="material-icons">clear</i></button>'
	}
};
