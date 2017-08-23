
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

  var openRequest = window.indexedDB.open('myDB', 1);

  openRequest.onerror = function (event) {
      console.log(openRequest.errorCode);
  };

  openRequest.onsuccess = function (event) {
      // Database is open and initialized - we're good to proceed.
      db = openRequest.result;

      var objectStore = db.transaction(["activities"], "readwrite").objectStore("activities");
      
      objectStore.openCursor(null, 'prev').onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor) {
          if (Number(cursor.value.time) == time) { //this is the current value, skip it
            cursor.continue();
          }
          else{ //this is the previous value, update duration
            var activeLength = time - cursor.value.time;
            cursor.value.duration = activeLength;

            var requestUpdate = objectStore.put(cursor.value);
             requestUpdate.onerror = function(event) {
               // Do something with the error
             };
             requestUpdate.onsuccess = function(event) {
             };
          }
        }
        else{
          //do nothing, the db is empty 
        }
      };
    };
};

Activity.add = function (type) {

  // create new activity
  var activity = new Activity(type);
  console.log("Activity " + activity.type + " started at " + activity.time);

  // create database instance
  var database = firebase.database();
  var activityListRef = database.ref('activities/');  

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

    // calculate the duration
    var duration = mostRecents[2].time - mostRecents[0].time;
    console.log(duration)
    
    // update the most recent entry with its duration
    database.ref('activities/' + mostRecents[1]).update({ duration: duration });
  });

};

Activity.update = function (type, time) {
    var openRequest = window.indexedDB.open('myDB', 1);

    openRequest.onerror = function (event) {
        console.log(openRequest.errorCode);
    };

    openRequest.onsuccess = function (event) {
        // Database is open and initialized - we're good to proceed.
        db = openRequest.result;

        var objectStore = db.transaction(["activities"], "readwrite").objectStore("activities");
        var request = objectStore.get(time);
        request.onerror = function(event) {
          // Handle errors!
        };
        request.onsuccess = function(event) {
          // Get the old value that we want to update
          var data = event.target.result;
          
          // update the value(s) in the object that you want to change
          data.type = type;

          // Put this updated object back into the database.
          var requestUpdate = objectStore.put(data);
           requestUpdate.onerror = function(event) {
             // Do something with the error
           };
           requestUpdate.onsuccess = function(event) {
             console.log("activity updated");
           };
        };
    };
};

Activity.delete = function (time) {
    var openRequest = window.indexedDB.open('myDB', 1);

    openRequest.onerror = function (event) {
        console.log(openRequest.errorCode);
    };

    openRequest.onsuccess = function (event) {
        // Database is open and initialized - we're good to proceed.
        db = openRequest.result;
        var request = db.transaction(["activities"], "readwrite")
                        .objectStore("activities")
                        .delete(time);
        request.onsuccess = function(event) {
          console.log("activity deleted");
        };
    };
  }; 

Activity.deleteAll = function () {
	var openRequest = window.indexedDB.open('myDB', 1);

    openRequest.onerror = function (event) {
        console.log(openRequest.errorCode);
    };

    openRequest.onsuccess = function (event) {
        // Database is open and initialized - we're good to proceed.
        db = openRequest.result;
        var objectStore = db.transaction(["activities"], "readwrite").objectStore("activities");

		objectStore.clear();
		};
};

Activity.createTestData = function () {
  var activity = new Activity("activity");

  for(var i=0; i<5; i++) {
      activity.type = "activity " + i;
      activity.time++;

      var transaction = db.transaction(["activities"], "readwrite");
      // Do something when all the data is added to the database.
      transaction.oncomplete = function(event) {
      };

      transaction.onerror = function(event) {
        // Don't forget to handle errors!
        console.log("error: " + event);
      };

      var objectStore = transaction.objectStore("activities");
        var request = objectStore.add(activity);
        request.onsuccess = function(event) {
        };
  }
};

Activity.clearData = function () {
  if (confirm("Do you really want to delete all book data?")) {
    Activity.deleteAll();
  }
};

function openDB(){
    var openRequest = window.indexedDB.open('myDB', 1);

    openRequest.onerror = function (event) {
        console.log(openRequest.errorCode);
    };

    openRequest.onsuccess = function (event) {
        // Database is open and initialized - we're good to proceed.
        db = openRequest.result;
    };

    openRequest.onupgradeneeded = function (event) {
        // This is either a newly created database, or a new version number
        // has been submitted to the open() call.
        db = event.target.result;
        db.onerror = function () {
            console.log(db.errorCode);
        };

        // Create an object store and indexes. A key is a data value used to organize
        // and retrieve values in the object store. The keyPath option identifies where
        // the key is stored. If a key path is specified, the store can only contain
        // JavaScript objects, and each object stored must have a property with the
        // same name as the key path (unless the autoIncrement option is true).
        var store = db.createObjectStore('activities', { keyPath: 'time' });

        // Define an index to search activities by type
        // syntax: store.createIndex(indexName, keyPath[, parameters]);
        store.createIndex('type', 'type', { unique: false });

        // Once the store is created, populate it
        store.transaction.oncomplete = function (event) {
            console.log("Store created successfully.")
        };
    };
};

openDB();