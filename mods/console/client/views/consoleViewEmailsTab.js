'use strict';

Template.consoleViewGlobalEmailsTab.onCreated(function () {
    this.subscribe('emailTemplates', EmailTemplates.GLOBAL);
});
Template.consoleViewGlobalEmailsTab.helpers({
    getTriggers: function () {
        if (!Template.instance().subscriptionsReady()) {
            return [];
        }
        return EmailTemplates.triggersList.map(function (trigger) {
            return {
                triggerId: trigger.id,
                courseId: EmailTemplates.GLOBAL
            };
        });
    },
    getCourseId: function () {
        return EmailTemplates.GLOBAL;
    }
});

Template.consoleViewCourseEmailsTab.onCreated(function () {
    this.autorun(function () {
        this.subscribe('emailTemplates', Session.get('activeCourseId'));
    }.bind(this));
});
Template.consoleViewCourseEmailsTab.helpers({
    getTriggers: function () {
        if (!Template.instance().subscriptionsReady()) {
            return [];
        }
        return EmailTemplates.triggersList.map(function (trigger) {
            return {
                triggerId: trigger.id,
                courseId: Session.get('activeCourseId')
            };
        });
    },
    getCourseId: function () {
        return Session.get('activeCourseId');
    }
});
