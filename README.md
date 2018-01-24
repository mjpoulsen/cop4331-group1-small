# cop4331-group1-small
COP4331 group 1's small project repository.

Slack Channel:

	cop4331-group1.slack.com

TODOs:

	1. Determine roles.
	2. Document entry API.
	3. Edit & delete contacts functions.
	4. Larger search bar
	5. Smaller sort buttons
	

SOLVED:

	1. Decide type of stack. LAMP, MEAN, WISA, etc.
	2. Invite everyone to Slack channel.

RUN:

	Preliminaries:
		- Install NodeJs, current or LTS version is acceptable. https://nodejs.org/en/

	Instructions:
		1. Open terminal or console and navigate to the cop4331-group1-small/myapp directory.
		2. Once inside, type: node server.js
		3. Execute command. If done correctly, the output should read: "Server started on port: 8080"
		4. Server is now running on http://localhost:8080
		5. Curl API -- see below documentation.
		6. To quit, press ctrl + c.


API:

	To send web request to the server, I use an application that sends different types of curl requests. I use Postman (https://www.getpostman.com/). Some people like Insomnia (https://insomnia.rest/), and our professor mentioned a Chrome extension. It does not really matter which program you choose as they all perform similar. 
	
	Supports: GET and POST

	User API:

		Login
		localhost:8080/users/login
		SampleInput:
		{
    		"user_name": "admin",
    		"password": "f4dcc3b5aa765d61d8327deb882cf99 5"    		
		}

		Submit User
		localhost:8080/submituser
		SampleInput:
		{
        	"user_name": "admin",
        	"password": "5f4dcc3b5aa765d61d8327deb882cf99",
        	"first_name": "john",
        	"last_name": "doe",
        	"email": "jdoe@aol.com"
    	}

	Contact API:

		View All Contacts
		localhost:8080/contacts/allcontacts
		{
     	   "user_id": "5a5ffa7467d8f7bef4623040"
    	}

    	Add Contact
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
