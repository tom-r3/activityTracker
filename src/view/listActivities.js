 google.charts.load("current", {packages:["corechart"]});
 
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
      var cell6 = row.insertCell(5);
      cell1.innerHTML = activity.type;
      cell2.innerHTML = activity.month;
      cell3.innerHTML = activity.day;
      cell4.innerHTML = activity.hour;
      cell5.innerHTML = activity.minute;
      cell6.innerHTML = activity.duration;
    }

  var openRequest = window.indexedDB.open('myDB', 1);

    openRequest.onerror = function (event) {
        console.log(openRequest.errorCode);
    };

    openRequest.onsuccess = function (event) {
        // Database is open and initialized - we're good to proceed.
        db = openRequest.result;
        var objectStore = db.transaction(["activities"], "readonly").objectStore("activities");
        var data = new Array();
        var i = 0;
      objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;

        if (cursor) {
          addRow(cursor.value);
          var obj ={};
          var activity = cursor.value.type;
          var duration = cursor.value.duration;
          obj = {activity, duration};
          
          
          data[i] = obj;
          i++;
          
          cursor.continue();
          
        }

        else {
          showInfo(data);
        }

        
        
      };
      




      function showInfo(data){
        
        var doubles = data.map(function(data){

          var src = {};
          src = [data.activity, Number(data.duration)]
          return src;
        });
        
        drawChart(doubles);
        
        
        
      }; 
     


      

      google.charts.setOnLoadCallback(drawChart);



      function drawChart(dataStuff) {

        
       // Create the data table.
       console.log(dataStuff);
        var data = new google.visualization.DataTable();

        data.addColumn('string', 'Activity');
        data.addColumn('number', 'Duration');
        data.addRows(dataStuff);
        


        var options = {
          title: 'How you spent your time this week:',
          legend: 'none',
          pieSliceText: 'label',
          slices: {  4: {offset: 0.2},
                    12: {offset: 0.3},
                    14: {offset: 0.4},
                    15: {offset: 0.5},
          },
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data, options);
      };
    };
  }
};