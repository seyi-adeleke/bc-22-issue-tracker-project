$(document).ready(function(){
	$('.updateIssue').on('click', updateIssue);
});

function updateIssue(){
	var confirmation = confirm('Are you sure the issue has been resolved?');
	if (confirmation){
		$.ajax({
			type: 'POST',
			url: '/update/'+$(this).data('id')
		}).done(function(response){
			window.location.replace('/allIssues');
		});
		window.location.replace('/allIssues');
	} else {
		return false;
	}
}

$(document).ready(function(){
	$('.updateIssue2').on('click', updateIssue2);
});

function updateIssue2(){
	var confirmation = confirm('Are you sure the issue has been resolved?');
	if (confirmation){
		$.ajax({
			type: 'POST',
			url: '/update/'+$(this).data('id')
		}).done(function(response){
			window.location.replace('/deptIssues');
		});
		window.location.replace('/deptIssues');
	} else {
		return false;
	}
}

$(document).ready(function(){
	$('.assign').on('click', assign);
});

function assign(){
	var confirmation = confirm('Are You sure You want to assign this issue to someone?');
	if (confirmation){
		$.ajax({
			type: 'POST',
			url: '/assign/'+$(this).data('id')
		}).done(function(response){
			window.location.replace('/assignIssues');
		});
		window.location.replace('/assignIssues');
	} else {
		return false;
	}
}