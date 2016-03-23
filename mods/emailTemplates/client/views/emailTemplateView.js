'use strict';

Template.emailTemplateView.helpers({
    getTriggerTitle: function () {
        return i18n('emails.triggers.' + this.triggerId);
    },
    getTriggerFields: function (triggerId) {
        try {
            return _(EmailTemplates.triggersList)
                .find(function (trigger) {
                    return trigger.id === triggerId;
                })
                .fields
                .map(function (field) {
                    return {
                        field: field,
                        description: i18n('emails.fields.' + field)
                    };
                });
        } catch (e) {
            return [];
        }
    },
    getDoc: function () {
        return EmailTemplates.findOne({
            triggerId: this.triggerId,
            courseId: this.courseId
        });
    }
});
Template.emailTemplateView.events({
    'click .js-create-template': function () {
        Meteor.call('createEmailTemplate', this.triggerId, this.courseId);
    }
});
