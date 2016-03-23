'use strict';

//todo: denormalize this
Template.registerHelper('getCommunityTitleForCourseId', function (courseId) {
    var course = Colls.Courses.findOne(courseId, {fields: {community_id: 1}});
    var community;
    if (course) {
        community = Colls.Communities.findOne(course.community_id);
        return community && community.title;
    }
    return false;
});

Template.registerHelper('getCommunityUrl', function (courseId) {
    var course = Colls.Courses.findOne(courseId, {fields: {community_id: 1}});
    return '/community/' + course.community_id;
});


Template.registerHelper('isAdminCommunities', function () {
    return Roles.userIsInRole(Meteor.userId(), ['global_admin', 'global_community_admin']);
});
Template.registerHelper('isGlobalStudent', function () {
    return Roles.userIsInRole(Meteor.userId(), 'global_student');
});
