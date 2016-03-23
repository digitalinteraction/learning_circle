'use strict';

// read more on readme.wiki
//
Colls.StripePayments = new UniCollection('StripePayments');
Colls.StripePaymentsErrors = new UniCollection('StripePaymentsErrors');

// you need to change it to secret key 'live' not 'test'
var stripeSecretKey = 'sk_test_QxcN3GF28gCm4YWy0sA2vqSS';

Meteor.methods({
    'stripeChargeCard': function (stripeToken, course, customerEmail) {

        /**
         * Stripe charge card method.
         * @param {string} stripeToken - Stripe token.
         * @param {string} course - Course id for which is the payment.
         * @param {string} customerEmail - Current user/customer e-mail address
         */

        check(stripeToken, String);
        check(course, String);
        check(customerEmail, String);

        var Stripe = StripeAPI(stripeSecretKey);
        var getCourse = Colls.Courses.findOne({_id: course});
        var coursePrice = getCourse && getCourse.price;
        coursePrice = coursePrice * 100;

        if (this.userId && coursePrice) {
            Stripe.customers.create({
                source: stripeToken,
                email: customerEmail
            }).then(function (customer) {
                return Stripe.charges.create({
                    amount: coursePrice,
                    currency: 'usd',
                    customer: customer.id
                });
            }).then(Meteor.bindEnvironment(function (charge) { // charge
                // without card informations
                Colls.StripePayments.insert(_.omit(charge, 'source'));
            }), Meteor.bindEnvironment(function (err) {
                Colls.StripePaymentsErrors.insert(err);
            }));
        }
    }
});
