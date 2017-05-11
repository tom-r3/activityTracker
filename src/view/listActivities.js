 at.view.listActivities = {
  setupUserInterface: function () {
    var tableBodyEl = document.querySelector("table#activities>tbody");

    function addRow(activity) {
      var table = document.getElementById("activitiesTable");
      var row = table.insertRow(-1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);
      cell1.innerHTML = activity.type;
      cell2.innerHTML = activity.day;
      cell3.innerHTML = activity.hour;
      cell4.innerHTML = activity.minute;
      cell5.innerHTML = activity.duration;
    }

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
          console.log(cursor.value);
          cursor.continue();
        }
        else {
          //do nothing
        }
      };
    };
  }
};