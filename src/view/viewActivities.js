 google.charts.load("current", {packages:["corechart"]});
 
 at.view.viewActivities = {
  setupUserInterface: function () {
    // firebase event listener
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // open a connection to the database and read all activities
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref('users/' + userId + '/activities/').once('value').then(function(snapshot) {
          snapshot.forEach(function(activitySnapshot) {
              var activity = activitySnapshot.val();
              // set up table
              addRow(activity);

              // set up chart
              var type = activity.type;
              var duration = activity.duration;
              var obj = {type, duration};
              data[i] = obj;

              // increment i
              i = i+1;
          });

          // show chart
          showInfo(data);
        });

      } else {
        console.log("user is signed out");
        window.location = "/index.html";
      }
    });

    // set up table
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

    // set up array for chart
    var data = new Array();
    var i=0;

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

      // Create the data table
      var data = new google.visualization.DataTable();

      data.addColumn('string', 'Activity');
      data.addColumn('number', 'Duration');
      console.log(dataStuff); 
      data.addRows(dataStuff); //why is this throwing an error?
      
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

    }
  }
};