'use strict';

UniUsers.helpers({
    isParticipating: function () {
        if (Meteor.isServer) {
            return this && this.participate;
        }
        var currentCourseId = Session.get('activeCourseId');
        return this && Roles.userIsInRole(this, ['community_admin', 'global_admin', 'course_student', 'course_mentor', 'global_mentor'], currentCourseId);

    },
    isAdminOrParticipating: function () {
        if (Meteor.isServer) {
            return (this && Roles.userIsInRole(this, 'global_admin')) || (this && !!this.participate);
        }
        var currentCourseId = Session.get('activeCourseId');
        return (this && Roles.userIsInRole(this, ['community_admin', 'global_admin', 'course_student', 'course_mentor', 'global_mentor'], currentCourseId));
    },
    getLastSeenCourseName: function () {
        var lastSeenCourseId = this && UniUtils.get(this, 'lastSeenCourse');
        var course;

        // set up first default course id for admin
        if (Roles.userIsInRole(this, 'global_admin') && !lastSeenCourseId) {
            course = Colls.Courses.findOne({}, {fields: {title: 1}});
            if (course) {
                Session.setDefault('activeCourseId', course._id);
                return course.title;
            }
            return false;
        }

        course = Colls.Courses.findOne({_id: lastSeenCourseId}, {fields: {title: 1}});
        if (course) {
            Session.setDefault('activeCourseId', course._id);
            return course.title;
        }

    },
    getUserCoursesTitles: function (mentor) {
        var courseField;
        if (_.isString(mentor) && mentor === 'mentor') {
            courseField = 'mentorshipCourses';
        } else {
            courseField = 'courses';
        }
        var userCoursesIds = this && UniUtils.get(this, courseField);
        if (Roles.userIsInRole(this, 'global_admin')) {
            return Colls.Courses.find({}, {fields: {title: 1}});
        }
        if (_.isArray(userCoursesIds)) {
            return Colls.Courses.find({_id: {$in: userCoursesIds}}, {fields: {title: 1}});
        }
    }
});
