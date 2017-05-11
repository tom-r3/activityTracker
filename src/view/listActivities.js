 at.view.listActivities = {
  setupUserInterface: function () {
    var tableBodyEl = document.querySelector("table#activities>tbody");

    function addRow(time, type) {
      var table = document.getElementById("activitiesTable");
      var row = table.insertRow(-1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      cell1.innerHTML = type;
      cell2.innerHTML = time;
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
          addRow(cursor.value.time, cursor.value.type);
          console.log("found");
          cursor.continue();
        }
        else {
          //do nothing
        }
      };
    };
  }
};