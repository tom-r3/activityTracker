at.view.index = {
  setupUserInterface: function () {
  	// firebase event listener
    firebase.auth().onAuthStateChanged(function(user) {
	    if (user) {
	      // User is signed in.
	      console.log(user);
	      window.location = "main.html";
	      // ...
	    } else {
	      console.log("user is signed out");    
	  }
    });

    // get variables for buttons
    var regButton = document.forms['indexform'].register;
    var logButton = document.forms['indexform'].login;

    // Set an event handler for the save/submit button
    regButton.addEventListener("click", 
        at.view.index.handleRegButtonClickEvent);
    logButton.addEventListener("click", 
        at.view.index.handleLogButtonClickEvent);
  },
  
  handleRegButtonClickEvent: function () {
  	// obtain form info
  	var formEl = document.forms['indexform'];
    var email = formEl.email.value;
    var password = formEl.password.value;

    // log user in
  	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // ...
	});

    formEl.reset();
  },

  handleLogButtonClickEvent: function () {
  	// obtain form info
  	var formEl = document.forms['indexform'];
  	var email = formEl.email.value;
    var password = formEl.password.value;

    // log user in
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // ...
	});

    formEl.reset();
  }
};