# cop4331-group1-small
COP4331 group 1's small project repository.

Slack Channel:

	cop4331-group1.slack.com

TODOs:

	1. Larger search bar.
	2. Smaller sort buttons.
	3. Protect against SQL injection.
	

COMPLETED:

	1. Decide type of stack. LAMP, MEAN, WISA, etc.
	2. Invite everyone to Slack channel.
	3. Determine roles.
	4. Document API.
	4. Edit & delete contacts.

RUN:

	Preliminaries:
		- Install NodeJs, current or LTS version is acceptable. https://nodejs.org/en/

	Instructions:
		1. Open terminal or console and navigate to the cop4331-group1-small directory.
		2. Once inside, type: node server.js
		3. Execute command. If done correctly, the output should read: "Server started on port: <PORT#>"
		4. Server is now running on http://localhost:<PORT#>
		5. Visit webpage or Curl API (see below documentation).
		6. To stop the server, press ctrl + c.


API:

	To CURL the web server's API, use an application that sends different types of HTTP requests. Our 
	recommendation is Postman (https://www.getpostman.com/). Other viable options include 
	Insomnia (https://insomnia.rest/), a web browser extension, or CURL Unix command from a terminal/console.
	It does not really matter which program you choose as they all perform similar functions. 
	
	Server only supports POST operations. However, a GET request to the server (without a path) will return the 
	homepage.

	Public User API:

		Login -- POST
		localhost:8080/users/login
		SampleInput:
		{
    		"user_name": "admin",
    		"password": "f4dcc3b5aa765d61d8327deb882cf99 5"    		
		}

		Submit User -- POST
		localhost:8080/submituser
		SampleInput:
		{
        	"user_name": "admin",
        	"password": "5f4dcc3b5aa765d61d8327deb882cf99",
        	"first_name": "john",
        	"last_name": "doe",
        	"email": "jdoe@aol.com"
    	}

	Public Contact API:

		View All Contacts -- POST
		localhost:8080/contacts/allcontacts
		{
     	   "user_id": "5a5ffa7467d8f7bef4623040"
    	}

    	Add Contact -- POST
    	localhost:8080/contacts/addcontact
    	{
	        "user_id": "5a5ffa7467d8f7bef4623040",
	        "first_name": "john",
	        "last_name": "doe",
	        "phone_number": 4"07-867-5309",
	        "street": "123 Park Ave.",
	        "city": "Winter Park",
	        "state": "Florida",
	        "zip": "32789"
	    }
	    
	    Delete Contact -- POST
        localhost:8080/contacts/deleteContact
        {
           "user_id": "5a5ffa7467d8f7bef4623040".
           "contactId": "5a6152357b2e0604b452d615"
        }

