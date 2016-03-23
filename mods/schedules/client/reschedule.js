'use strict';

Template.rescheduleRequestModal.helpers({
    getSchema: function () {
        return new SimpleSchema({
            message: {
                type: String,
                autoform: {
                    placeholder: i18n('schedules.placeYourRequestHere')
                }
            },
            userId: {
                type: String
            },
            courseId: {
                type: String
            },
            groupId: {
                type: String,
                autoform: {
                    placeholder: i18n('schedules.placeYourRequestHere')
                }
            }
        });
    },
    groupOptions: function () {
        var currentCourseContextId = Session.get('activeCourseId');
        return Colls.Groups.find({course: currentCourseContextId}, {sort: {title: 1}}).map(function (g) {
            return {label: g.title, value: g._id};
        });
    }
});

Template.rescheduleRequestModal.events({
    'form-submit-success': function () {
        UniUI.closeModal();
    }
});
