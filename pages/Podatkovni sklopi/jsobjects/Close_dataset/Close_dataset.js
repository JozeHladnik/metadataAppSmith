{{
  if (JSONForm1.hasChanges) {
    showAlert("You have unsaved changes! Please click Confirm to save, or clear the form to exit.", "warning");
  } else {
    closeModal('View_modal');
  }
}}