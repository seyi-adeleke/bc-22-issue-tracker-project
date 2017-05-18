$(document).ready(function(){
	$('.updateIssue').on('click', updateIssue);
});

function updateIssue(){
	var confirmation = confirm('Are You sure you want to close the Issue?');
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
	var confirmation = confirm('Are You sure you want to close the Issue?');
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
	$('.pending').on('click', pending);
});

function pending(){
	var confirmation = confirm('Are You sure the issue is pending?');
	if (confirmation){
		$.ajax({
			type: 'POST',
			url: '/update2/'+$(this).data('id')
		}).done(function(response){
			window.location.replace('/allIssues');
		});
		window.location.replace('/allIssues');
	} else {
		return false;
	}
}

$(document).ready(function(){
	$('.pending2').on('click', pending2);
});

function pending2(){
	var confirmation = confirm('Are You sure the issue is pending?');
	if (confirmation){
		$.ajax({
			type: 'POST',
			url: '/update2/'+$(this).data('id')
		}).done(function(response){
			window.location.replace('/deptIssues');
		});
		window.location.replace('/deptIssues');
	} else {
		return false;
	}
}