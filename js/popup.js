$(function(){
	$('#visit_code').click(e => {
		chrome.tabs.create({url: 'https://github.com/liuzhen153/chrome-week-plan-plugin'});
	})
	
})