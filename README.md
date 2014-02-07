# bddlib

A Behavior Driven Development library for Casperjs


### Motivation

- Tests should be easy to write
- Tests should be easy to read
- Tests should explain intention, not logic
- Relieves boilerplate pain
- Asynchronous is normal, I don't what to right another callback


### Dependencies

- [casperjs](http://docs.casperjs.org/en/latest/quickstart.html)
- [phantomjs](http://phantomjs.org/)


### Intallation

This assumes you have a working casperjs test environnement

copy bddlib to your test folder (yes, bower is comming)


### Getting Started

1. You must include bddlib.js in you includes file when you call casperjs

		casperjs test [my_project] --includes=bddlib.js[,mysetup.js]
	
2. Import scenarios and scenario in your test file

		var scenarios = bddLib.scenarios;
		var scenario =  bddLib.scenario;
		
3. When you create a scenarios, you need to define a callback with all the scenario inside. The name of the parameter doesn't matter. But following the convention will make test easier to read

		scenarios("http://mywebsite.com", 
			function (I, Given, When, And, Then) {
		});


### E.G.


		scenarios("http://mywebsite.com", 
			function (I, Given, When, And, Then) {
			    "use strict";
			    
			 	scenario("1 - Go to the login page ",
			   	 	Given(I.am('on the homepage', 'a[href="/login/"]')),
		    		When(I.click('on the login button', 'a[href="/login/"]')),
				    Then(I.am('that I am redirect the login page', 'a[href="/login/"]')
				   );
			   
			   	scenario("2 - Login",
				    Given(I.am('on the login page', 'a[href="/login/"]')),
				    When(I.fill("the login form", 'form[id="login-form"]',
    	    	       {"username": "itsme",
        	    	    "password": "1234"})
			    	),
				    Then(I.find('that I am redirect to my hub',
    		    	    "button[ng-click=\"go('/account')\"]"))
				   );
		});



### License

See LICENSE file
