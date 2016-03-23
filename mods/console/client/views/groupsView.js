'use strict';

var checkUserRole = function (user, roles) {
    var currentCourseId = Session.get('activeCourseId');
    if (user && _.isArray(roles) && currentCourseId) {
        return Roles.userIsInRole(user, roles, currentCourseId);
    }
};

// TODO: refactor
Template.groupsView.onRendered(function () {
    var groupId;
    var groupLabel;
    this.autorun(function () {
        if (Session.get('activeCourseId')) {
            Meteor.defer(function () {
                groupId = this.$('.js-choose-group').val();
                groupLabel = this.$('.js-choose-group').find('option[value="' + groupId + '"]').text();
                if (groupId && groupLabel) {
                    Session.set('activeGroupId', groupId);
                    Session.set('activeGroupLabel', groupLabel);
                }
            }.bind(this));
        }
    }.bind(this));
});

Template.groupsView.helpers({
    isStudentChair: function () {
        return checkUserRole(this, ['course_student-chair']);
    },
    waitingForApproval: function () {
        return !checkUserRole(UniUsers.getLoggedIn(), ['course_student', 'course_mentor', 'course_student-chair', 'global_admin']);
    },
    canGrantStudentChair: function () {
        return checkUserRole(UniUsers.getLoggedIn(), ['course_student-chair', 'course_mentor', 'global_admin']);
    }
});

Template.groupsView.events({
    'change .js-choose-group': function (e) {
        e.preventDefault();
        var groupId = $(e.target).val();
        var groupLabel = $(e.target).find('option[value="' + groupId + '"]').text();
        if (groupId && groupLabel) {
            Session.set('activeGroupId', groupId);
            Session.set('activeGroupLabel', groupLabel);
        }
    },
    'click .js-create-groups': function (e) {
        e.preventDefault();
        var courseId = Session.get('activeCourseId');
        if (courseId) {
            // for live testing (was 'formStudentsGroups')
            // Meteor.call('createOneGroupForLiveVersionTesting', courseId);
            Meteor.call('formStudentsGroups', courseId);
        }
    }
});

Template.groupsViewUserItem.helpers({
    isStudentChair: function () {
        return checkUserRole(this, ['course_student-chair']);
    },
    waitingForApproval: function () {
        return !checkUserRole(UniUsers.getLoggedIn(), ['course_student', 'course_mentor', 'course_student-chair', 'global_admin']);
    },
    canGrantStudentChair: function () {
        return checkUserRole(UniUsers.getLoggedIn(), ['course_student-chair', 'course_mentor', 'global_admin']);
    }
});

Template.groupsViewUserItem.events({
    'click .js-grant-student-chair-role': function (e) {
        e.preventDefault();
        var targetUserId = this._id;
        var currentCourseId = Session.get('activeCourseId');
        if (_.isString(targetUserId) && _.isString(currentCourseId)) {
            Meteor.call('grantStudentChairRole', targetUserId, currentCourseId);
        }
    },
    'click .js-cancel-student-chair-role': function (e) {
        e.preventDefault();
        var targetUserId = this._id;
        var currentCourseId = Session.get('activeCourseId');
        if (_.isString(targetUserId) && _.isString(currentCourseId)) {
            Meteor.call('cancelStudentChairRole', targetUserId, currentCourseId);
        }
    }
});


Template.groupsViewUserMentorItem.helpers({
    isStudentChair: function () {
        return checkUserRole(this, ['course_student-chair']);
    },
    waitingForApproval: function () {
        return !checkUserRole(UniUsers.getLoggedIn(), ['course_student', 'course_mentor', 'course_student-chair', 'global_admin']);
    },
    canGrantStudentChair: function () {
        return checkUserRole(UniUsers.getLoggedIn(), ['course_student-chair', 'course_mentor', 'global_admin']);
    }
});

Template.groupsViewUserMentorItem.events({
    'click .js-grant-student-chair-role': function (e) {
        e.preventDefault();
        var targetUserId = this._id;
        var currentCourseId = Session.get('activeCourseId');
        if (_.isString(targetUserId) && _.isString(currentCourseId)) {
            Meteor.call('grantStudentChairRole', targetUserId, currentCourseId);
        }
    },
    'click .js-cancel-student-chair-role': function (e) {
        e.preventDefault();
        var targetUserId = this._id;
        var currentCourseId = Session.get('activeCourseId');
        if (_.isString(targetUserId) && _.isString(currentCourseId)) {
            Meteor.call('cancelStudentChairRole', targetUserId, currentCourseId);
        }
    }
});
