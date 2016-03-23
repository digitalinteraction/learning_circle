'use strict';

AutoForm.addHooks(null, {
    onSuccess: function (method, id) {
        var $form = this.template.$('form');
        $form.trigger('form-submit-success', {
            method: method,
            id: id
        });
    }
});
