'use strict';

Template.autocompleteUsers.onCreated(function () {
    var template = this, data, text, activeCourse;
    Session.set('autocompleteUsers', null);

    template.users = new ReactiveVar();

    this.autorun(function () {
        data = Session.get('autocompleteUsers');
        text = data && data.text || false;
        activeCourse = Session.get('activeCourseId');

        if (text) {
            Meteor.call('getAutocompleteUsers', text, activeCourse, function (err, users) {
                if (!err) {
                    template.users.set(users);
                } else {
                    template.users.set();
                }
            });
        } else {
            template.users.set();
        }
    });
});

Template.autocompleteUsers.helpers({
    getUsers: function () {
        var template = Template.instance();
        return template.users.get();
    }
});
