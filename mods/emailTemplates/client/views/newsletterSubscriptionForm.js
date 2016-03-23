'use strict';

Template.newsletterSubscriptionForm.helpers({
    getSchema: function () {
        return new SimpleSchema({
            scheduler: {
                type: String,
                optional: true,
                label: '',
                autoform: {
                    options: [
                        {value: 'minutely', label: 'Real time'},
                        {value: 'daily', label: 'Daily'},
                        {value: 'weekly', label: 'Weekly'}
                    ]
                }
            }
        });
    },
    getNewsletterSubscription: function () {
        try {
            return Meteor.user().newsletterSubscriptions[Session.get('activeCourseId')];
        } catch (e) {
            return null;
        }
    }
});

//Template.newsletterSubscriptionForm.events({
//    'click .js-submit': function (e, tmpl) {
//        var val = tmpl.$('[name=scheduler]').val();
//        Meteor.call('subscribeToNewsletter', val, Session.get('activeCourseId'));
//    }
//});
