'use strict';

// you need to change it to publishable key 'live' not 'test'
var stripePublishableKey = Meteor.settings.public.stripePublicKey;

Meteor.startup(function () {

    // reset session var
    Session.set('StripePaymentActualCourseId');

    Stripe.setPublishableKey(stripePublishableKey);

    App.StripeHandler = StripeCheckout.configure({
        key: stripePublishableKey,
        token: function (token) {
            var course;
            var customerEmail;
            var currentUser = Meteor.user();
            if (token && token.id) {
                // we need it to pass course id - we need it to check the price of the course on the server
                course = Session.get('StripePaymentActualCourseId');
                customerEmail = currentUser && currentUser.emails[0] && currentUser.emails[0].address;
                if (course && customerEmail) {
                    Meteor.call('stripeChargeCard', token.id, course, customerEmail);
                } else {
                    console.log('Payment error!');
                }
            }
        }
    });

});
