'use strict';

Template.courseListingItem.helpers({
    canApply: function () {
        var user = UniUsers.getLoggedIn();
        // if not logged in - display button, but there is auto redirect to login/register page
        if (!user) {
            return true;
        }
        // check if student is a course member
        var courses = UniUtils.get(user.findSelf(), 'courses');
        if (courses && courses.indexOf(this._id) !== -1) {
            return false;
        }
        // check if course is not started
        if (moment(new Date(this.startDate)).isAfter(new Date()) &&
            moment(new Date(this.endDate)).isAfter(new Date())) {
            return true;
        }
        return false;
    },
    startsInValue: function () {
        var startDate = this.startDate;
        var momentValue;
        if (startDate) {
            momentValue = moment(startDate).diff(moment(), 'hours');
            if (momentValue > 24) {
                return moment(startDate).diff(moment(), 'days') + ' ' + i18n('courses.dateDaysLabel');
            }
            return momentValue + ' ' + i18n('courses.dateHoursLabel');
        }
    }
});

// count course participants on the courses list
// non reactive for now, refresh only on template creation
// if we need to make it reactive we should add paricipants data on Courses (I think..)

Template.participantsCount.created = function () {
    var self = this;
    var courseId = this.data && this.data._id;
    self.courseParticipantCount = new ReactiveVar(0);
    if (_.isString(courseId)) {
        Meteor.call('getCourseParticipantsCount', courseId, function (err, result) {
            if (!err) {
                self.courseParticipantCount.set(result);
            }
        });
    }
};

Template.participantsCount.helpers({
    participantCountValue: function () {
        return Template.instance().courseParticipantCount.get();
    }
});
