at.view.deleteActivity = {

  setupUserInterface: function () {
    var formEl = document.forms['Activity'],
        deleteButton = formEl.commit,
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
        var objectStore = db.transaction(["activities"], "readonly").objectStore("activities");
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

    deleteButton.addEventListener("click", 
        at.view.deleteActivity.handleDeleteButtonClickEvent);
  },

  // save updated data
  handleDeleteButtonClickEvent: function () {
    var selectedActivity = null;
    var formEl = document.forms['Activity'];
    var record = { time: Number(formEl.time.value), 
        type: formEl.type.value, 
    };

    Activity.delete(record);

    formEl.reset();

  }
}; 