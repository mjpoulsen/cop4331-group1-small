var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {

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

	$scope.createUser = function () {
        hideOrShow( "loggedInDiv", false);
        hideOrShow( "accessUIDiv", false);
        hideOrShow( "loginDiv", false);
        hideOrShow( "createUserDiv", true);

        document.getElementById("newUserName").innerHTML = "";
        document.getElementById("newUserPassword").innerHTML = "";
        document.getElementById("newUserFirstName").innerHTML = "";
        document.getElementById("newUserLastName").innerHTML = "";
        document.getElementById("newUserEmail").innerHTML = "";
    }

    $scope.submitUser = function () {
        var user_name = document.getElementById("newUserName").value;
        var md5password = md5(document.getElementById("newUserPassword").value);
        var first_name = document.getElementById("newUserFirstName").value;
        var last_name = document.getElementById("newUserLastName").value;
        var email = document.getElementById("newUserEmail").value;


        $http.post('/users/submituser', {
            "user_name": user_name,
            "password" : md5password,
            "first_name" : first_name,
            "last_name" : last_name,
            "email" : email
        })
        .then(function(response) {
            if (response.status == 201) {

                document.getElementById("loginName").value = "";
                document.getElementById("loginPassword").value = "";
                document.getElementById("loginResult").innerHTML = "Please login with your user name and password.";

                hideOrShow( "loggedInDiv", false);
                hideOrShow( "accessUIDiv", false);
                hideOrShow( "loginDiv", true);
                hideOrShow( "createUserDiv", false);
                hideOrShow( "viewContactsUIDiv", false);
            } else {
                document.getElementById("newUserError").innerHTML = "Please verify a User Name and Password was submitted.";
                return;
            }
        });
    }


	$scope.doLogin = function()
	{
		userId = 0;
		firstName = "";
		lastName = "";
		
		var login = document.getElementById("loginName").value;
		// var password = document.getElementById("loginPassword").value;
		var md5password = md5(document.getElementById("loginPassword").value);
		document.getElementById("loginResult").innerHTML = "";

		$http.post('/users/login', {
			"user_name": login,
			"password" : md5password
		})
		.then(function(response) {
			if (response.status == 200) {
                var jsonObject = response.data;
                firstName = jsonObject.first_name;
                lastName = jsonObject.last_name;
                userId = jsonObject._id;

                document.getElementById("userName").innerHTML = firstName + " " + lastName;

                document.getElementById("loginName").value = "";
                document.getElementById("loginPassword").value = "";

                getUsersContacts(userId);

                hideOrShow( "loggedInDiv", true);
                hideOrShow( "accessUIDiv", false);
                hideOrShow( "loginDiv", false);
                hideOrShow( "createUserDiv", false);
                hideOrShow( "viewContactsUIDiv", true);
			} else {
				document.getElementById("loginResult").innerHTML = "User/Password combination incorrect.";
				return;
			}
		});
	};

    function getUsersContacts(userId) {
        $http.post('/contacts/allcontacts', {
            "user_id": userId
        })
        .then(function(response) {
            if (response.status == 200) {
                var jsonObject = response.data;
                var retContacts = jsonObject.returnedContact;
                var size = 0, key;
                for (key in retContacts) {
                    if (retContacts.hasOwnProperty(key)) size++;
                }

                document.getElementById("contactList").innerHTML = size.toString();

                var contactTable = document.getElementById("contactTable")
                var i, contact, row, firstNameCell, lastNameCell, phoneCell;
                for (i = 0; i < size; i++) {
                    // Obtain contact.
                    contact = retContacts[i];

                    // Create new row.
                    row = contactTable.insertRow(i + 1);
                    firstNameCell = row.insertCell(0);
                    lastNameCell = row.insertCell(1);
                    phoneCell = row.insertCell(2);

                    // Add contact information to row.
                    firstNameCell.innerHTML = contact.first_name;
                    lastNameCell.innerHTML = contact.last_name;
                    phoneCell.innerHTML = contact.phone_number;
                }

            } else {
                // TODO Path is not taken. Should server side adjust to allow this path to be taken?
                document.getElementById("contactListMessage").innerHTML = "No contacts could be found for your account.";
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
        hideOrShow( "createUserDiv", false);
        hideOrShow( "viewContactsUIDiv", false);
	};

	

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
	};

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