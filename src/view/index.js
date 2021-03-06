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
    var logButton = document.forms['indexform'].commit;

    // Set an event handler for the save/submit button
    logButton.addEventListener("click", 
        at.view.index.handleLogButtonClickEvent);
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