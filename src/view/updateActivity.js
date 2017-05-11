at.view.updateActivity = {

  setupUserInterface: function () {
    var formEl = document.forms['Activity'],
        saveButton = formEl.commit,
        selectActivityEl = formEl.selectActivity;
    var activity=null, optionEl=null;

    //function used to populate form
    function addRow(activity) {
      optionEl = document.createElement("option");
      optionEl.text = activity.type;
      optionEl.value = activity.time;
      selectActivityEl.add(optionEl, null);
    }

    //load all activities
    var openRequest = window.indexedDB.open('myDB', 1);

    openRequest.onerror = function (event) {
        console.log(openRequest.errorCode);
    };

    openRequest.onsuccess = function (event) {
        // Database is open and initialized - we're good to proceed.
        db = openRequest.result;
        var objectStore = db.transaction(["activities"], "readonly").objectStore("activities");

      objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          addRow(cursor.value);
          console.log("found");
          cursor.continue();
        }
        else {
          //do nothing
        }
      };
    };

    // when an activity is selected, populate the form with the activity data
    selectActivityEl.addEventListener("change", function () {
        var selectedActivity = null;
        var objectStore = db.transaction(["activities"], "readwrite").objectStore("activities");
        selectedActivity = Number(selectActivityEl.value);
        var request = objectStore.get(selectedActivity);
        request.onerror = function(event) {
          formEl.time.value = "";
          formEl.type.value = "";
        };
        request.onsuccess = function(event) {
          // Get the old value to populate the form
          selectedActivity = event.target.result;
          formEl.time.value = selectedActivity.time;
          formEl.type.value = selectedActivity.type;
        };
    });

    saveButton.addEventListener("click", 
        at.view.updateActivity.handleUpdateButtonClickEvent);
  },

  // save updated data
  handleUpdateButtonClickEvent: function () {
    var selectedActivity = null;
    var formEl = document.forms['Activity'];
    var record = { time: formEl.time.value, 
        type: formEl.type.value, 
    };

    var objectStore = db.transaction(["activities"], "readwrite").objectStore("activities");
    selectedActivity = Number(formEl.time.value);
    var request = objectStore.get(selectedActivity);
    request.onerror = function(event) {
      // Handle errors!
    };
    request.onsuccess = function(event) {
      // Get the old value that we want to update
      var data = event.target.result;
      
      // update the value(s) in the object that you want to change
      data.type = record.type;

      console.log(data);

      // Put this updated object back into the database.
      var requestUpdate = objectStore.put(data);
       requestUpdate.onerror = function(event) {
         // Do something with the error
       };
       requestUpdate.onsuccess = function(event) {
         console.log("updated");
       };
    };

    formEl.reset();

  }
}; 