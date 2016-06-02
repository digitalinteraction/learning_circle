'use strict';

var scheduleAction = function (data, type) {
    if (data && data._id && type) {
        Meteor.call('attendencesUpdate', data._id, type);
    }
};

Template.consoleViewScheduleItem.events({
    'click .js-attendence-yes': function () {
        scheduleAction(Template.currentData(), 'yes');
    },
    'click .js-attendence-no': function () {
        scheduleAction(Template.currentData(), 'no');
    },
    'click .js-attendence-reschedule': function () {
        var data = {
            userId: Meteor.userId,
            courseId: Template.currentData().courseId
        };
        UniUI.openModal('rescheduleRequestModal', data);
    }
});

var attendenceState = function () {
    var attendences = this.attendences;
    var att = _.where(attendences, {userId: Meteor.userId()});
    return att && att[0] && att[0].state;
};

Template.consoleViewScheduleItem.helpers({
    attendenceState: attendenceState
});

Template.consoleViewLectureScheduleItem.helpers({
    attendenceState: attendenceState,
    getTime: function () {
        if (this.time) {
            return this.time;
        }
        return moment(this.date).format('HH:mm');
    }
});

Template.consoleViewLectureScheduleItem.events({
    'click .js-attendence-yes': function () {
        scheduleAction(Template.currentData(), 'yes');
    },
    'click .js-attendence-no': function () {
        scheduleAction(Template.currentData(), 'no');
    },
    'click .js-attendence-later': function () {
        scheduleAction(Template.currentData(), 'later');
    }
});

Template.registerHelper('getMovieTitle', function (link) {
    if (link.match(/youtu\.?be/gi)) {
        return 'YouTube';
    }
    return 'Hangout'
});
