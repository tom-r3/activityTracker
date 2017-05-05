at.view.addActivity = {
  setupUserInterface: function () {
    var saveButton = document.forms['Activity'].commit;
    // load all objects
    Activity.loadAll();
    // Set an event handler for the save/submit button
    saveButton.addEventListener("click", 
        at.view.addActivity.handleSaveButtonClickEvent);
    window.addEventListener("beforeunload", function () {
        Activity.saveAll(); 
    });
  },
  handleSaveButtonClickEvent: function () {
    var formEl = document.forms['Activity'];
    var record = { type: formEl.type.value, 
                   time: Date.now()};
    Activity.add( record);
    formEl.reset();
  }
};