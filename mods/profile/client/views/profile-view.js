'use strict';

Template.profileEditableFieldsList.events({
    'blur .js-save-profile-field': function (e) {
        e.preventDefault();
        var value = $(e.currentTarget).val();
        var field = $(e.currentTarget).attr('name');
        if (value && field) {
            Meteor.call('updateProfileField', field, value);
        }
    }
});

Template.profileEditableFieldsList.helpers({
    getTimezone: function () {
        return '';
    },
    isAllowed: function (profileUserId) {
        return profileUserId === Meteor.userId();
    }
});

Template.reportedBtns.helpers({
    isGlobalAdminOrMentor: function () {
        return Roles.userIsInRole(Meteor.userId(), ['global_mentor', 'global_admin']);
    }
});

Template.reportedBtns.events({
    'click .js-reported-posts': function (e) {
        e.preventDefault();
        Router.go('/reportedPosts');
    },
    'click .js-reported-projects': function (e) {
        e.preventDefault();
        Router.go('/reportedProjects');
    }
});
