at.view.settings = {
  setupUserInterface: function () {
    var saveButton = document.forms['Activity'].commit;

    // Set an event handler for the save/submit button
    saveButton.addEventListener("click", 
        at.view.settings.handleSaveButtonClickEvent);
  },
  
  handleSaveButtonClickEvent: function () {
    var formEl = document.forms['Activity'];
    addType(formEl.type.value);
    formEl.reset();
  }
};