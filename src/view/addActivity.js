at.view.addActivity = {
  setupUserInterface: function () {
    var saveButton = document.forms['Activity'].commit;

    // Set an event handler for the save/submit button
    saveButton.addEventListener("click", 
        at.view.addActivity.handleSaveButtonClickEvent);
  },
  
  handleSaveButtonClickEvent: function () {
    var formEl = document.forms['Activity'];
    Activity.add(formEl.type.value);
    formEl.reset();
  }
};