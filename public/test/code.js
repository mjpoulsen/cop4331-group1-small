var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
	var urlBase = 'http://COP4331-2.com/LAMPAPI';
	var extension = "php";

	var userId = 0;
	var firstName = "";
	var lastName = "";
	function hideOrShow( elementId, showState )
	{
		var vis = "visible";
		var dis = "block";
		if( !showState )
		{
			vis = "hidden";
			dis = "none";
		}
		
		document.getElementById( elementId ).style.visibility = vis;
		document.getElementById( elementId ).style.display = dis;
	}

	$scope.doLogin = function()
	{
		userId = 0;
		firstName = "";
		lastName = "";
		
		var login = document.getElementById("loginName").value;
		var password = document.getElementById("loginPassword").value;
		
		document.getElementById("loginResult").innerHTML = "";
		
		var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
		var url = urlBase + '/Login.' + extension;
		$http.post('/login', {
			"login": login,
			"password" : password
		})
		.then(function(response) {
			if (response.data != 'failed') {
				var jsonObject = response.data;
				firstName = jsonObject.FirstName;
				lastName = jsonObject.LastName;
				userId = jsonObject._id;

				document.getElementById("userName").innerHTML = firstName + " " + lastName;
				
				document.getElementById("loginName").value = "";
				document.getElementById("loginPassword").value = "";
				
				hideOrShow( "loggedInDiv", true);
				hideOrShow( "accessUIDiv", true);
				hideOrShow( "loginDiv", false);
			} else {
				document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
				return;
			}
		});
	}


	$scope.doLogout = function()
	{
		userId = 0;
		firstName = "";
		lastName = "";	

		hideOrShow( "loggedInDiv", false);
		hideOrShow( "accessUIDiv", false);
		hideOrShow( "loginDiv", true);
	}

	

	$scope.addColor = function()
	{
		var newColor = document.getElementById("colorText").value;
		document.getElementById("colorAddResult").innerHTML = "";
		
		var jsonPayload = '{"color" : "' + newColor + '", "userId" : ' + userId + '}';
		var url = urlBase + '/AddColor.' + extension;
		
		$http.post('/AddColor', {
			"color": newColor,
			"userId" : userId
		}).then(function(response) {
			if (response.data == 'success') {
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			} else {
				document.getElementById("colorAddResult").innerHTML = response.data;
			}
		});
	}

	$scope.searchColor = function()
	{
		var srch = document.getElementById("searchText").value;
		document.getElementById("colorSearchResult").innerHTML = "";
		
		var colorList = document.getElementById("colorList");
		colorList.innerHTML = "";
		
		var jsonPayload = '{"search" : "' + srch + '"}';
		var url = urlBase + '/SearchColors.' + extension;
		$http.post('/SearchColors', {
			"search": srch
		}).then(function(response) {
			if (response.data != 'failed') {
				hideOrShow( "colorList", true );
					
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				var jsonObject = response.data;
				var i;
				for( i=0; i<jsonObject.length; i++ )
				{
					var opt = document.createElement("option");
					opt.text = jsonObject[i].Name;
					opt.value = "";
					colorList.options.add(opt);
				}
			} else {
				document.getElementById("colorSearchResult").innerHTML = response.data;
			}
		});
	}
});