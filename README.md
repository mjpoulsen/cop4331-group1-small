# cop4331-group1-small
COP4331 group 1's small project repository.

Slack Channel:

	cop4331-group1.slack.com

TODOs:

	1. Determine roles.
	2. Document entry API.
	

SOLVED:

	1. Decide type of stack. LAMP, MEAN, WISA, etc.
		Solution: MEAN
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

	PublicAPI:

		GetProductById
		localhost:8080/products/5a5ffa7467d8f7bef4623040
		Output:
		{
    		"_id": "5a5ffa7467d8f7bef4623040",
    		"name": "Harry Potter 5",
    		"price": 12.99,
    		"__v": 0
		}

		InsertProduct
		localhost:8080/products
		SampleInput:
		{
			"name": "Harry Potter 5",
			"price": "12.99"
		}
		Output:
		{
    		"message": "Handling POST requests to /products",
    		"createdProduct": {
        		"_id": "5a5ffa7467d8f7bef4623040",
        		"name": "Harry Potter 5",
        		"price": 12.99
    		}
		}