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

/*$(document).ready(function(){
	$('.user').on('click', user);
});

function user(){
	//var confirmation = confirm('Are You sure you want to close the Issue?');
	//if (confirmation){
		$.ajax({
			type: 'POST',
			url: '/user/'+$(this).data('id')
		}).done(function(response){
			window.location.replace('/allIssues');
		});
		window.location.replace('/allIssues');
	//} else {
		return false;
	//}
}*/