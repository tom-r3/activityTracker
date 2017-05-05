function Activity( record) {
  this.type = record.type;

/*
  var currentTime = new Date();
  this.year = currentTime.getFullYear();
  this.month = currentTime.getMonth();
  this.day = currentTime.getDay();
  this.hour = currentTime.getHours();
  this.minute = currentTime.getMinutes();
 */

  this.time = record.time;

};

Activity.instances = {}; //to keep track of all activities

Activity.loadAll = function () {
  var i=0, key="", keys=[], activityTableString="", activityTable={};  
  try {
    if (localStorage["activityTable"]) {
      activityTableString = localStorage["activityTable"];
    }
  } catch (e) {
    alert("Error when reading from Local Storage\n" + e);
  }
  if (activityTableString) {
    activityTable = JSON.parse( activityTableString);
    keys = Object.keys( activityTable);
    console.log( keys.length +" activities loaded.");
    for (i=0; i < keys.length; i++) {
      key = keys[i];
      Activity.instances[key] = Activity.convertRow2Obj( activityTable[key]);
    }
  }
};

Activity.saveAll = function () {
  Activity.loadAll(); //this is loading the previous entry after the update, stopping update from working************

  var activityTableString = "", error = false,
      nmrOfActivities = Object.keys( Activity.instances).length;  
  try {
    activityTableString = JSON.stringify( Activity.instances);
    localStorage["activityTable"] = activityTableString;
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
    error = true;
  }
  if (!error) console.log( nmrOfActivities + " activies saved.");
};

Activity.add = function (record) {
  var activity = new Activity( record);
  Activity.instances[activity.time] = activity;
  console.log("Activity " + activity.type + " started at " + activity.time);
};

Activity.update = function (record) {
  var activity = Activity.instances[record.time];
  var type = record.type;
  if (activity.type !== record.type) { activity.type = record.type;}
  console.log("Activity " + record.time + " modified!");

  Activity.saveAll();
};

Activity.delete = function (time) {
  if (Activity.instances[time]) {
    console.log("Activity " + time + " deleted");
    delete Activity.instances[time];
  } else {
    console.log("There is no activity with time " + time + " in the database!");
  }
}; 

Activity.createTestData = function () { //this is loading activities at the same time which causes some not to save
  Activity.add({type:"travel", time:Date.now()});
  Activity.add({type:"cook", time:Date.now()+1});
  Activity.add({type:"sleep", time:Date.now()+2});

  Activity.saveAll();
};

Activity.clearData = function () {
  if (confirm("Do you really want to delete all book data?")) {
    localStorage["activityTable"] = "{}";
  }
};

Activity.convertRow2Obj = function (activityRow) {
  var activity = new Activity( activityRow); //this is creating a new time stamp on every load!
  return activity;
};
