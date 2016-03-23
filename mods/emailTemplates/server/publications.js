'use strict';

Meteor.publish('emailTemplates', function (courseId) {
    check(courseId, String);
    return EmailTemplates.find({courseId: courseId});
});

Meteor.publish('emailDrafts', function (courseId) {
    check(courseId, String);
    if (!Roles.userIsInRole(this.userId, ['global_admin', 'global_community_admin'])) {
        return [];
    }
    return EmailDrafts.find({courseId: courseId});
});
