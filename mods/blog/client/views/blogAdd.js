'use strict';

Template.blogAdd.onCreated(function () {
    this.autorun(function () {
        var taskId = Iron.controller().getParams().query.taskId;
        if (taskId) {
            Meteor.subscribe('singleTask', taskId);
        }
    });
});

Template.blogAdd.helpers({
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

Template.blogAdd.events({
    'click .js-cancel': function () {
        Router.go('/blog');
    },
    'click .js-save-and-publish': function (e, t) {
        t.$('input[name="status"]').val('published');
    }
});
