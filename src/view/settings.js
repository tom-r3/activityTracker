at.view.settings = {
  setupUserInterface: function () {
    //login listener
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        //load all types
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref('users/' + userId + '/types/').once('value').then(function(snapshot) {
          snapshot.forEach(function(typeSnapshot) {
            addRow(typeSnapshot.val().type);
          }
    )})
      } else {
        console.log("user is signed out");
        window.location = "/index.html";
      }
    });

    // set up delete drop down
    var formEl = document.forms['deleteType'],
        deleteButton = formEl.commit,
        selectActivityEl = formEl.selectActivity;
    var activity=null, optionEl=null;

    //function used to populate form
    function addRow(type) {
      optionEl = document.createElement("option");
      optionEl.text = type;
      optionEl.value = type;
      selectActivityEl.add(optionEl, null);
    }

    // listener for select event
    selectActivityEl.addEventListener("change", function () {
        var selectedActivity = selectActivityEl.value;
        formEl.value = selectedActivity;

    });


    // get variables for save buttons
    var addSaveButton = document.forms['addType'].commit;
    var deleteSaveButton = document.forms['deleteType'].commit;

    // Set an event handler for the save/submit buttons
    addSaveButton.addEventListener("click", 
        at.view.settings.handleAddSaveButtonClickEvent);
    deleteSaveButton.addEventListener("click", 
        at.view.settings.handleDeleteSaveButtonClickEvent);

    // handle logout button
    var logoutButton = document.getElementById("logout");
    logoutButton.addEventListener("click", 
        at.view.settings.handleLogoutButtonClickEvent);
  },
  
  handleAddSaveButtonClickEvent: function () {
    var formEl = document.forms['addType'];
    addType(formEl.type.value);
    formEl.reset();
    // update the delete dropdown
    window.location.replace("/settings.html");
  },

  handleDeleteSaveButtonClickEvent: function () {
    var selectedActivity = null;
    var formEl = document.forms['deleteType'];
    deleteType(formEl.value);
    formEl.reset();
    // update the delete dropdown
    window.location.replace("/settings.html");
  },

  handleLogoutButtonClickEvent: function () {
    firebase.auth().signOut();
  }
};