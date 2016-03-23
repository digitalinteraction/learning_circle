'use strict';

Template.consoleViewAttendenceTab.events({
    'change .js-choose-group': function (e) {
        e.preventDefault();
        var groupId = $(e.target).val();
        var groupLabel = $(e.target).find('option[value="' + groupId + '"]').text();
        if (groupId && groupLabel) {
            Session.set('activeGroupId', groupId);
            Session.set('activeGroupLabel', groupLabel);
        }
    },
    'click .js-student-is-present': function (e) {
        var data = this;
        var userId = $(e.target).data('user-id');
        var scheduleId = data && data._id;
        if ($(e.target).is(':checked')) {
            Colls.Schedules.update({_id: scheduleId}, {$addToSet: {present: userId}});
        } else {
            Colls.Schedules.update({_id: scheduleId}, {$pull: {present: userId}});
        }
    },
    'click .js-create-schedules': function (e) {
        e.preventDefault();
        var courseId = Session.get('activeCourseId');
        var loggedInUser = Meteor.user();
        if (courseId) {
            Meteor.call('createSchedulesForGroupsInCourse', courseId);
            if (loggedInUser && loggedInUser.canCreateHangouts) {
                Meteor.call('createGoogleCalendarEvents', courseId);
            }
        }
    }
});

Template.consoleViewAttendenceTab.helpers({
    isSchedulesInCourse: function () {
        var courseId = Session.get('activeCourseId');
        return Colls.Schedules.findOne({courseId: courseId, lectureType: {$ne: true}});
    },
    getAllSchedulesInGroup: function () {
        var courseId = Session.get('activeCourseId');
        var groupId = Session.get('activeGroupId');
        if (courseId && groupId) {
            return Colls.Schedules.find({courseId: courseId, groupId: groupId}, {sort: {date: 1}});
        }
        return false;
    },
    getDateInTimezone: function () {
        var weekDay = this.sessionDay;
        var weekHour = this.sessionHour;
        var weekTimezone = this.sessionTimezone;
        var date = this.date;
        var scheduleLabel = App.calcTzSessionsTime(weekDay, weekHour, weekTimezone, date, 'DD.MM');
        return scheduleLabel;
    },
    isPresent: function () {
        var userData = Template.parentData(1);
        var userId = userData && userData._id;
        var present = this.present;
        return _.isArray(present) && present.indexOf(userId) !== -1;
    }
});

Template.registerHelper('groupsExists', function () {
    var courseId = Session.get('activeCourseId');
    if (courseId) {
        return Colls.Groups.findOne({course: courseId});
    }
});
