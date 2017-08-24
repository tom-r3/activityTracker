function addType(type) {
  // create database instance
  var database = firebase.database();
  var typeListRef = database.ref('types/' + type);  

  // add new activity to database
  typeListRef.set({
      type: type
  });
}

function deleteType(type) {
  // create database instance
  var database = firebase.database();
  var typeDeleteRef = database.ref('types/' + type);  

  // delete activity
  typeDeleteRef.remove();
}