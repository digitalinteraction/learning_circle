'use strict';

Template.projectAdd.onCreated(function () {
    this.autorun(function () {
        var taskId = Iron.controller().getParams().query.taskId;
        if (taskId) {
            Meteor.subscribe('singleTask', taskId);
        }
    });
});

Template.projectAdd.helpers({
    currentTask: function () {
        return Colls.Tasks.findOne();
    },
    getTaskId: function () {
        try {
            return Iron.controller().getParams().query.taskId || null;
        } catch (e) {
            return null;
        }
    },
    getCourseId: function () {
        return Session.get('activeCourseId');
    }
});

Template.projectAdd.events({
    'click .js-cancel': function () {
        Router.go('/project');
    },
    'click .js-save': function (e, t) {
        t.$('form').submit();
    },
    'click .js-save-and-publish': function (e, t) {
        t.$('input[name="status"]').val('published');
        t.$('form').submit();
    }
});
