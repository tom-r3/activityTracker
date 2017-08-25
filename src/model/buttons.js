function addType(type) {
  // create database instance
  var database = firebase.database();
  var userId = firebase.auth().currentUser.uid;
  var typeListRef = database.ref('users/' + userId + '/types/' + type);  

  // add new activity to database
  typeListRef.set({
      type: type
  });
}

function deleteType(type) {
  // create database instance
  var database = firebase.database();
  var userId = firebase.auth().currentUser.uid;
  var typeDeleteRef = database.ref('users/' + userId + '/types/' + type);  

  // delete activity
  typeDeleteRef.remove();
}