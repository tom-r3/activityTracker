 at.view.listActivities = {
  setupUserInterface: function () {
    var tableBodyEl = document.querySelector("table#activities>tbody");
    var i=0, keys=[], key="", row={};
    // load all activity objects
    Activity.loadAll();
    keys = Object.keys( Activity.instances);
    // for each activity, create a table row with a cell for each attribute
    for (i=0; i < keys.length; i++) {
      key = keys[i];
      row = tableBodyEl.insertRow();
      row.insertCell(-1).textContent = Activity.instances[key].type;      
      row.insertCell(-1).textContent = Activity.instances[key].time;  
    }
  }
};