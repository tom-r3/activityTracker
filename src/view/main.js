at.view.main = {
  setupUserInterface: function () {
    // firebase event listener
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        
        // open a connection to the database and read all activities
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref('users/' + userId + '/types/').once('value').then(function(snapshot) {
          snapshot.forEach(function(typeSnapshot) {
              // get type from database
              var type = typeSnapshot.val().type;
              
              // create button with each type
              var btn = document.createElement("BUTTON");        // Create a <button> element

              // set onclick to add the activity
              btn.onclick = function(){
                Activity.add(type);
              };

              // add text
              var t = document.createTextNode(type);
              btn.appendChild(t);

              // add button to menu
              var menu = document.getElementById("buttonmenu");
              menu.appendChild(btn); 
          });
        })

      } else {
        console.log("user is signed out");
        window.location = "/index.html";
      }
    });
  }
};

