function addType(type) {
  // create database instance
  var database = firebase.database();
  var typeListRef = database.ref('types/');  

  // add new activity to database
  var newTypeRef = typeListRef.push();
    newTypeRef.set({
      type: type
  });
}


function addButton(type) {
    var list = document.createElement("LI");
    var button = document.createElement('button');
    button.setAttribute('content', 'test content');
    button.setAttribute('class', 'buttons');
    button.setAttribute('onclick', 'Activity.add("test activity")')
    button.innerHTML = 'add test activity';
    list.appendChild(button);

    var wrapper = document.getElementById("activityButtons");
    wrapper.appendChild(list);
  };