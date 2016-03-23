'use strict';

Template['static.contact'].events({
    'submit #contactform': function (e) {
        var arr = $(e.target).serializeArray();
        var data = _.object(_.pluck(arr, 'name'), _.pluck(arr, 'value'));

        e.preventDefault();
        e.target.reset();

        Meteor.call('sendContactEmail', data);
    }
});
