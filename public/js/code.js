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

        clearElements();
    }

    $scope.submitUser = function () {
        var user_name = document.getElementById("newUserName").value;
        var md5password = md5(document.getElementById("newUserPassword").value);
        firstName = document.getElementById("newUserFirstName").value;
        lastName = document.getElementById("newUserLastName").value;
        var email = document.getElementById("newUserEmail").value;


        $http.post('/users/submituser', {
            "user_name": user_name,
            "password" : md5password,
            "first_name" : firstName,
            "last_name" : lastName,
            "email" : email
        })
        .then(function(response) {
            if (response.status == 201) {

                clearElements();
                document.getElementById("loginResult").innerHTML = "Please login with your user name and password.";

                hideOrShow( "loggedInDiv", false);
                hideOrShow( "accessUIDiv", false);
                hideOrShow( "loginDiv", true);
                hideOrShow( "createUserDiv", false);
                hideOrShow( "viewContactsUIDiv", false);
            } else {
                document.getElementById("newUserError").innerHTML = "Please verify  a User Name and Password was submitted.";
                return;
            }
        });
    }

    $scope.submitContact = function () {

        var first_name = document.getElementById("newContactFirstName").value;
        var last_name = document.getElementById("newContactLastName").value;
        var phone = document.getElementById("newContactPhone").value;
        var street = document.getElementById("newContactStreet").value;
        var city = document.getElementById("newContactCity").value;
        var state = document.getElementById("newContactState").value;
        var zip = document.getElementById("newContactZip").value;


        $http.post('/contacts/addcontact', {
            "user_id": userId,
            "first_name" : first_name,
            "last_name" : last_name,
            "phone_number" : phone,
            "street" : street,
            "city" : city,
            "state" : state,
            "zip" : zip
        })
        .then(function(response) {
            if (response.status == 201) {

                clearElements();
                getUsersContacts();

                hideOrShow( "loggedInDiv", true);
                hideOrShow( "accessUIDiv", false);
                hideOrShow( "loginDiv", false);
                hideOrShow( "createUserDiv", false);
                hideOrShow( "viewContactsUIDiv", true);
                hideOrShow( "addContactDiv", false);
            } else {
                document.getElementById("newContactError").innerHTML = "Please verify all * attributes are submitted." + userId;
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

                clearElements();
                getUsersContacts();

                hideOrShow( "loggedInDiv", true);
                hideOrShow( "accessUIDiv", false);
                hideOrShow( "loginDiv", false);
                hideOrShow( "createUserDiv", false);
                hideOrShow( "viewContactsUIDiv", true);
                hideOrShow( "addContactDiv", false);
			} else {
				document.getElementById("loginResult").innerHTML = "User/Password combination incorrect.";
				return;
			}
		});
	};

    function getUsersContacts() {
        $http.post('/contacts/allcontacts', {
            "user_id": userId
        })
        .then(function(response) {
            if (response.status == 200) {
                //Clear table
                var tableSize =  document.getElementById("contactTable").rows.length;
                for (i = tableSize.valueOf() - 1; i > 0; i--) {
                    document.getElementById("contactTable").deleteRow(i);
                }


                var jsonObject = response.data;
                var retContacts = jsonObject.returnedContact;
                var size = 0, key;
                for (key in retContacts) {
                    if (retContacts.hasOwnProperty(key)) size++;
                }


                
                var contactIds = new Array(size);

                document.getElementById("contactList").innerHTML = size.toString();

                var contactTable = document.getElementById("contactTable");
                var i, contact, row;
                var firstNameCell, lastNameCell, phoneCell, streetCell, cityCell, stateCell, zipCell;
                for (i = 0; i < size; i++) {
                    // Obtain contact.
                    contact = retContacts[i];

                    // Create new row.
                    row = contactTable.insertRow(i + 1);
                    firstNameCell = row.insertCell(0);
                    lastNameCell = row.insertCell(1);
                    phoneCell = row.insertCell(2);
                    streetCell = row.insertCell(3);
                    cityCell = row.insertCell(4);
                    stateCell = row.insertCell(5);
                    zipCell = row.insertCell(6);


                    // Add contact information to row.
                    contactIds[i + 1] = contact._id;
                    firstNameCell.innerHTML = contact.first_name;
                    lastNameCell.innerHTML = contact.last_name;
                    phoneCell.innerHTML = contact.phone_number;
                    streetCell.innerHTML = contact.street;
                    cityCell.innerHTML = contact.city;
                    stateCell.innerHTML = contact.state;
                    zipCell.innerHTML = contact.zip;
                }

            }
        });
    }



    // User types search tags into search bar, separated by spaces.
    // For each contact, combine all contact fields into a single string separated by spaces.
    // If the contact's combined string contains all tags entered by user, add the contact to the cleared table.
    // Continue looping through contacts to check for others that contain all the search tags.
    $scope.search = function(){
        $http.post('/contacts/allcontacts', {
            "user_id": userId
        })
        .then(function(response) {
            if (response.status == 200)
            {
                //Clear table
                var tableSize =  document.getElementById("contactTable").rows.length;
                for (i = tableSize.valueOf() - 1; i > 0; i--)
                {
                    document.getElementById("contactTable").deleteRow(i);
                }

                var jsonObject = response.data;
                var retContacts = jsonObject.returnedContact;
                var size = 0, key;

                for (key in retContacts)
                {
                    if (retContacts.hasOwnProperty(key)) size++;
                }

                var contactIds = new Array(size);
                document.getElementById("contactList").innerHTML = size.toString();
                var contactTable = document.getElementById("contactTable");
                var i, contact, row;
                var firstNameCell, lastNameCell, phoneCell, streetCell, cityCell, stateCell, zipCell;
                var contactIndex = 0;

                for (i = 0; i < size; i++)
                {
                    contact = retContacts[i];

                    id = contact._id;
                    fName = contact.first_name;
                    lName = contact.last_name;
                    pNum = contact.phone_number;
                    street = contact.street;
                    city = contact.city;
                    state = contact.state;
                    zip = contact.zip;

                    var combinedStr = fName + " " + lName + " " + pNum + " " + street + " " + city + " " + state + " " + zip;

                    // Eliminate any character that isn't a letter, digit, or space (useful for inconsistent phone # formats)
                    var contactString = combinedStr.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();

                    var searchInput = document.getElementById("searchBar").value.toLowerCase();


                    // This returns a tokenized array of character groups (strings) that are alphanumeric or underscore.
                    var searchTags = searchInput.match(/\w+/g);
                    // var searchTags = searchInput.match(/\b\w+\b/g);

                    var contactMatches = true;
                    var tag;
                    var tagIndex;

                    // If any of the search tags are not in a contact's data, the contact is not a match
                    for(tagIndex = 0; tagIndex < searchTags.length; tagIndex++)
                    {
                        tag = searchTags[tagIndex];
                        if (contactString.includes(tag) == false)
                        {
                            contactMatches = false;
                            break;
                        }
                    }

                    // If the contact contains all search tags, then it's a match so it's added to the list
                    if (contactMatches)
                    {
                        // Create new row.
                        row = contactTable.insertRow(contactIndex + 1);
                        firstNameCell = row.insertCell(0);
                        lastNameCell = row.insertCell(1);
                        phoneCell = row.insertCell(2);
                        streetCell = row.insertCell(3);
                        cityCell = row.insertCell(4);
                        stateCell = row.insertCell(5);
                        zipCell = row.insertCell(6);

                        // Add contact information to row.
                        contactIds[contactIndex + 1] = contact._id;
                        firstNameCell.innerHTML = contact.first_name;
                        lastNameCell.innerHTML = contact.last_name;
                        phoneCell.innerHTML = contact.phone_number;
                        streetCell.innerHTML = contact.street;
                        cityCell.innerHTML = contact.city;
                        stateCell.innerHTML = contact.state;
                        zipCell.innerHTML = contact.zip;

                        contactIndex += 1;
                    }
                }
            }
        });
    }

    $scope.clearSearch = function()
    {
        getUsersContacts();
    }


    $scope.home = function () {
        hideOrShow( "loggedInDiv", false);
        hideOrShow( "accessUIDiv", false);
        hideOrShow( "loginDiv", true);
        hideOrShow( "createUserDiv", false);
        hideOrShow( "viewContactsUIDiv", false);
        hideOrShow( "addContactDiv", false);
    }

    $scope.contacts = function () {
        clearElements();

        hideOrShow( "loggedInDiv", true);
        hideOrShow( "accessUIDiv", false);
        hideOrShow( "loginDiv", false);
        hideOrShow( "createUserDiv", false);
        hideOrShow( "viewContactsUIDiv", true);
        hideOrShow( "addContactDiv", false);
    }

    $scope.addContact = function () {

        clearElements();

        hideOrShow( "loggedInDiv", true);
        hideOrShow( "accessUIDiv", false);
        hideOrShow( "loginDiv", false);
        hideOrShow( "createUserDiv", false);
        hideOrShow( "viewContactsUIDiv", false);
        hideOrShow( "addContactDiv", true);
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

    function clearElements() {

        console.log("Clearing elements...")

        document.getElementById("loginName").value = "";
        document.getElementById("loginPassword").value = "";

        document.getElementById("newContactFirstName").value = "";
        document.getElementById("newContactLastName").value = "";
        document.getElementById("newContactPhone").value = "";
        document.getElementById("newContactStreet").value = "";
        document.getElementById("newContactCity").value = "";
        document.getElementById("newContactState").value = "";
        document.getElementById("newContactZip").value = "";

        document.getElementById("newUserName").value = "";
        document.getElementById("newUserPassword").value = "";
        document.getElementById("newUserFirstName").value = "";
        document.getElementById("newUserLastName").value = "";
        document.getElementById("newUserEmail").value = "";
    }

});