
function Activity(type) {
  this.type = type;

  var currentTime = new Date();
  this.year = currentTime.getFullYear();
  this.month = currentTime.getMonth();
  this.day = currentTime.getDate();
  this.hour = currentTime.getHours();
  this.minute = currentTime.getMinutes();

  var time = Number(Date.now());
  this.time = time;

  this.duration = 0;

};

Activity.add = function (type) {

  // create new activity
  var activity = new Activity(type);

  // create database instance
  var database = firebase.database();
  var userId = firebase.auth().currentUser.uid;
  var activityListRef = database.ref('users/' + userId + '/activities/');  

  // add new activity to database
  var newActivityRef = activityListRef.push();
    newActivityRef.set({
      type: type,
      year: activity.year,
      month: activity.month,
      day: activity.day,
      hour: activity.hour,
      minute: activity.minute,
      duration: activity.duration,
      time: activity.time
  });

  // order list by one most recent
  var recentActivityRef = activityListRef.limitToLast(2);

  // attach value observer to get two most recent entries
  var mostRecents = [];
  recentActivityRef.once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      mostRecents.push(childSnapshot.val());
      mostRecents.push(childSnapshot.key);
    });

    // check for undefined, so the firts activity added does not throw an error
    if (typeof mostRecents[2] != 'undefined') {
      // calculate the duration
      var duration = mostRecents[2].time - mostRecents[0].time;
      
      // update the most recent entry with its duration
      database.ref('users/' + userId + '/activities/' + mostRecents[1]).update({ duration: duration });
    }
  });
};

Activity.listActivities = function () {
  var userId = firebase.auth().currentUser.uid;
  firebase.database().ref('users/' + userId + '/activities/').once('value').then(function(snapshot) {
    var activities = snapshot.val();
    return activities;
  });

}