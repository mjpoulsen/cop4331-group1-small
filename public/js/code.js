var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {

	var userId = 0;
	var firstName = "";
	var lastName = "";

	// Hides or Shows a Div.
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

	// Shows create user view.
	$scope.createUser = function () {
        hideOrShow( "loggedInDiv", false);
        hideOrShow( "accessUIDiv", false);
        hideOrShow( "loginDiv", false);
        hideOrShow( "createUserDiv", true);

        clearElements();
    };

    // Shows home page view.
    $scope.home = function () {
        hideOrShow( "loggedInDiv", false);
        hideOrShow( "accessUIDiv", false);
        hideOrShow( "loginDiv", true);
        hideOrShow( "createUserDiv", false);
        hideOrShow( "viewContactsUIDiv", false);
        hideOrShow( "addContactDiv", false);
    };

    // Shows contacts view.
    $scope.contacts = function () {
        clearElements();

        hideOrShow( "loggedInDiv", true);
        hideOrShow( "accessUIDiv", false);
        hideOrShow( "loginDiv", false);
        hideOrShow( "createUserDiv", false);
        hideOrShow( "viewContactsUIDiv", true);
        hideOrShow( "addContactDiv", false);
    };

    // Shows add contact view.
    $scope.addContact = function () {

        clearElements();

        hideOrShow( "loggedInDiv", true);
        hideOrShow( "accessUIDiv", false);
        hideOrShow( "loginDiv", false);
        hideOrShow( "createUserDiv", false);
        hideOrShow( "viewContactsUIDiv", false);
        hideOrShow( "addContactDiv", true);
    };

    // Logs the current user out of the web page's session.
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

    // Submits a new user's information to the server, where it will be stored within its database.
    $scope.submitUser = function () {
        // Obtains user's input.
        var user_name = document.getElementById("newUserName").value;
        var md5password = md5(document.getElementById("newUserPassword").value);
        firstName = document.getElementById("newUserFirstName").value;
        lastName = document.getElementById("newUserLastName").value;
        var email = document.getElementById("newUserEmail").value;

        // Sends request to the server.
        $http.post('/users/submituser', {
            "user_name": user_name,
            "password" : md5password,
            "first_name" : firstName,
            "last_name" : lastName,
            "email" : email
        })
        .then(function(response) {
            // If user's information was successfully added, status code will be 201.
            if (response.status === 201) {

                clearElements();
                document.getElementById("loginResult").innerHTML = "Please login with your user name and password.";

                hideOrShow("loggedInDiv", false);
                hideOrShow("accessUIDiv", false);
                hideOrShow("loginDiv", true);
                hideOrShow("createUserDiv", false);
                hideOrShow("viewContactsUIDiv", false);
            } else {
                document.getElementById("newUserError").innerHTML = "Please verify a User Name and Password was submitted.";
            }
        });
    };

    //
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
            if (response.status === 201) {

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
            }
        });
    };


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
			if (response.status === 200) {
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
		hideOrShow("deleteContactDiv", false);
			} else {
				document.getElementById("loginResult").innerHTML = "User/Password combination incorrect.";
			}
		});
	};

    function getUsersContacts() {
        $http.post('/contacts/allcontacts', {
            "user_id": userId
        })
        .then(function(response) {
            if (response.status === 200) {
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

                document.getElementById("contactList").innerHTML = size.toString();

                var contactTable = document.getElementById("contactTable");
                var i, contact, row;
                var firstNameCell, lastNameCell, phoneCell, streetCell, cityCell, stateCell, zipCell, idCell;
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
					idCell = row.insertCell(7);
					idCell.setAttribute('id', 'row'+(i+1)+'cell7');
                    idCell.style.display = 'none';
					
					


                    // Add contact information to row.
                    firstNameCell.innerHTML = contact.first_name;
                    lastNameCell.innerHTML = contact.last_name;
                    phoneCell.innerHTML = contact.phone_number;
                    streetCell.innerHTML = contact.street;
                    cityCell.innerHTML = contact.city;
                    stateCell.innerHTML = contact.state;
                    zipCell.innerHTML = contact.zip;
					idCell.innerHTML = contact._id;
					firstNameCell.setAttribute('id', 'row'+(i+1)+'cell0');
					lastNameCell.setAttribute('id', 'row'+(i+1)+'cell1');
                }

            }
        });
    }

	
	$scope.deleteContact = function()
	{
		hideOrShow("deleteContactDiv", true);
	};
	$scope.removeFromList = function()
	{
		var fName = document.getElementById('deletedContactFirstName').value;
		var lName = document.getElementById('deletedContactLastName').value;

        var firstName = fName.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
        var lastName = lName.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();

		var table = document.getElementById('contactTable');

		for(var i = 1, row; row = table.rows[i]; i++)
		{
			var contact_id = document.getElementById('row'+i+'cell7').innerHTML;
			if((document.getElementById('row'+(i)+'cell0').innerHTML.toLowerCase() == firstName) &&
			(document.getElementById('row'+(i)+'cell1').innerHTML.toLowerCase() == lastName))
            {
                var data =
                {
                   "user_Id": userId,
                   "contactId": contact_id
                };

                $http.post('/contacts/deleteContact', JSON.stringify(data))
                .then(function(response)
                {
                    if (response.status === 200) {
					    console.log("deleted");
					    getUsersContacts();
			   		    hideOrShow("deleteContactDiv", false);
					    clearElements();
                    } else {
                        console.log(response.status);
                    }
                });
			}
		}
		hideOrShow("deleteContactDiv", false);
		clearElements();
	};

    // User types search tags into search bar, separated by spaces.
    // For each contact, combine all contact fields into a single string separated by spaces.
    // If the contact's combined string contains all tags entered by user, add the contact to the cleared table.
    // Continue looping through contacts to check for others that contain all the search tags.
    $scope.search = function(){
        $http.post('/contacts/allcontacts', {
            "user_id": userId
        })
        .then(function(response) {
            if (response.status === 200)
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

                    var fName = contact.first_name;
                    var lName = contact.last_name;
                    var pNum = contact.phone_number;
                    var street = contact.street;
                    var city = contact.city;
                    var state = contact.state;
                    var zip = contact.zip;

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
                        if (contactString.includes(tag) === false)
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
                        firstNameCell.innerHTML = fName;
                        lastNameCell.innerHTML = lName;
                        phoneCell.innerHTML = pNum;
                        streetCell.innerHTML = street;
                        cityCell.innerHTML = city;
                        stateCell.innerHTML = state;
                        zipCell.innerHTML = zip;

                        contactIndex += 1;
                    }
                }
            }
        });
    };

    $scope.clearSearch = function()
    {
        getUsersContacts();
    };


    // Given 2 contacts' data for some field (2 first names, 2 streets, etc.) determine which order they should go in when sorting
    function compareContacts(a, b)
    {
        // Remove characters that aren't alphanumeric, digits, or space.
        // Capital letters could affect the order when sorting.
        var contactA = a.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
        var contactB = b.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();

        // a comes first
        if (contactA < contactB)
            return -1;

        // b comes first
        if (contactA > contactB)
            return 1;

        // a and b are equal, order doesn't matter
        return 0;
    }


    // Use Selection Sort to sort table in ascending order by the given column (column 0 = first name, 1 = last name, 2 = phone #, etc.)
    $scope.sortContacts = function(column) {
        $http.post('/contacts/allcontacts',
            {
                "user_id": userId
            })
            .then(function (response) {
                if (response.status === 200) {
                    var contactTable = document.getElementById("contactTable");
                    var tableSize = contactTable.rows.length;

                    // If there is only 1 contact in the table (or empty table) it doesn't need to be sorted
                    if (tableSize <= 2) {
                        return;
                    }

                    // Selection Sort
                    for (var row = 1; row < tableSize.valueOf(); row++) {
                        var minRow = row;

                        // Find the row below of the current row that has the lowest value for the column we're checking.
                        // This is the row that will trade positions with the current row.
                        for (var laterRow = row + 1; laterRow < tableSize.valueOf(); laterRow++) {
                            if (compareContacts(contactTable.rows[minRow].cells[column].innerHTML, contactTable.rows[laterRow].cells[column].innerHTML) > 0) {
                                minRow = laterRow;
                            }
                        }

                        // Swap current row with a row below it that has the lowest value, if it is also lower than the current row's value.
                        if (minRow !== row) {
                            // Swap 2 rows one cell at a time
                            for (var col = 0; col < contactTable.rows[row].cells.length.valueOf(); col++) {
                                var temp = contactTable.rows[row].cells[col].innerHTML;
                                contactTable.rows[row].cells[col].innerHTML = contactTable.rows[minRow].cells[col].innerHTML;
                                contactTable.rows[minRow].cells[col].innerHTML = temp;
                            }
                        }
                    }
                }
            });
    };

    function clearElements() {

        console.log("Clearing elements...");

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
		document.getElementById("deletedContactFirstName").value = "";
		document.getElementById("deletedContactLastName").value = "";
    }
	
	$scope.cancelDelete = function()
	{
		document.getElementById("deletedContactFirstName").value = "";
		document.getElementById("deletedContactLastName").value = "";
		hideOrShow("deleteContactDiv", false);
	};

});
