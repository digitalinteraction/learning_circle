'use strict';

Template.consoleViewSyllabusTab.onCreated(function () {
    var currentCourseId;
    var self = this;
    self.autorun(function () {
        currentCourseId = Session.get('activeCourseId');
        self.subscribe('course', currentCourseId);
    });
    Session.set('currentScheduleLectureState', false);
});

Template.consoleViewSyllabusTab.helpers({
    course: function () {
        var currentCourseId = Session.get('activeCourseId');
        var course = Colls.Courses.findOne({_id: currentCourseId}, {fields: {
            title: 1,
            description: 1,
            syllabus: 1
        }});
        return course;
    },
    schedulesLectureList: function () {
        var courseId = Session.get('activeCourseId');
        if (courseId && Roles.userIsInRole(Meteor.userId(), 'global_admin')) {
            return Colls.Schedules.find({courseId: courseId, lectureType: true});
        }
    },
    shedulesLectureEditMode: function () {
        return Session.get('currentScheduleLectureState');
    }
});

Template.consoleViewSyllabusTab.events({
    'click .js-edit-lecture': function (e) {
        e.preventDefault();
        var scheduleId = this._id;
        Session.set('currentScheduleLectureState', true);
        $(window).scrollTop($('#schedules-lecture-form').offset().top - 150);
        Session.set('currentScheduleLectureId', scheduleId);
    }
});

Template.consoleViewSylabusContent.onCreated(function () {
    this.isInEditModeVar = new ReactiveVar(false);
});

Template.consoleViewSylabusContent.helpers({
    isInEditMode: function () {
        return Template.instance().isInEditModeVar.get();
    }
});

Template.consoleViewSylabusContent.events({
    'click .js-edit-syllabus-content': function (e, tmpl) {
        e.preventDefault();
        var courseId = Session.get('activeCourseId');
        var state = tmpl.isInEditModeVar.get();
        if (state && courseId) {
            Colls.Courses.update({_id: courseId}, {$set: {syllabus: $('#syllabus-editable').html()}});
        }
        tmpl.isInEditModeVar.set(!state);
    }
});
