at.view.addButton = {
  setupUserInterface: function () {
    var saveButton = document.forms['Activity'].commit;

    // Set an event handler for the save/submit button
    saveButton.addEventListener("click", 
        at.view.addButton.handleSaveButtonClickEvent);
  },
  
  handleSaveButtonClickEvent: function () {
    var formEl = document.forms['Activity'];
    addButton(formEl.type.value);
    formEl.reset();
  }
};