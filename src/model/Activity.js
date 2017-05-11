

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

Activity.add = function (record) {
  var activity = new Activity( record);
  console.log("Activity " + activity.type + " started at " + activity.time);

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
  
};

Activity.update = function (record) {
    var openRequest = window.indexedDB.open('myDB', 1);

    openRequest.onerror = function (event) {
        console.log(openRequest.errorCode);
    };

    openRequest.onsuccess = function (event) {
        // Database is open and initialized - we're good to proceed.
        db = openRequest.result;

        var objectStore = db.transaction(["activities"], "readwrite").objectStore("activities");
        var request = objectStore.get(record.time);
        request.onerror = function(event) {
          // Handle errors!
        };
        request.onsuccess = function(event) {
          // Get the old value that we want to update
          var data = event.target.result;
          
          // update the value(s) in the object that you want to change
          data.type = record.type;

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

Activity.delete = function (record) {
    var openRequest = window.indexedDB.open('myDB', 1);

    openRequest.onerror = function (event) {
        console.log(openRequest.errorCode);
    };

    openRequest.onsuccess = function (event) {
        // Database is open and initialized - we're good to proceed.
        db = openRequest.result;
        var request = db.transaction(["activities"], "readwrite")
                        .objectStore("activities")
                        .delete(record.time);
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

Activity.createTestData = function () { //this is loading activities at the same time which causes some not to save
  Activity.add({type:"travel", time:Date.now()});
  Activity.add({type:"cook", time:Date.now()+1});
  Activity.add({type:"sleep", time:Date.now()+2});
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