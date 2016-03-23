'use strict';

Template.reportModal.events({
    'form-submit-success': function () {
        UniUI.closeModal();
    }
});
