at.view.updateActivity = {
  setupUserInterface: function () {
    var formEl = document.forms['Activity'],
        saveButton = formEl.commit,
        selectActivityEl = formEl.selectActivity;
    var i=0, key="", keys=[], activity=null, optionEl=null;
    // load all objects
    Activity.loadAll();
    // populate the selection list
    keys = Object.keys( Activity.instances);
    for (i=0; i < keys.length; i++) {
      key = keys[i];
      activity = Activity.instances[key];
      optionEl = document.createElement("option");
      optionEl.text = activity.time;
      optionEl.value = activity.time;
      selectActivityEl.add( optionEl, null);
    }
    // when an activity is selected, populate the form with the activity data
    selectActivityEl.addEventListener("change", function () {
        var activity=null, key = selectActivityEl.value;
        if (key) {
          activity = Activity.instances[key];
          formEl.time.value = activity.time;
          formEl.type.value = activity.type;
        } else {
          formEl.time.value = "";
          formEl.type.value = "";
        }
    });
    saveButton.addEventListener("click", 
        at.view.updateActivity.handleUpdateButtonClickEvent);
    window.addEventListener("beforeunload", function () {
        Activity.saveAll(); 
    });
  },
  // save updated data
  handleUpdateButtonClickEvent: function () {
    var formEl = document.forms['Activity'];
    var record = { time: formEl.time.value, 
        type: formEl.type.value, 
    };
    Activity.update( record);
    formEl.reset();
  }
}; 