'use strict';

Meteor.publish('courseGroups', function (courseId) {
    if (Roles.userIsInRole(this.userId, ['global_student', 'global_mentor', 'global_admin', 'global_community_admin'], courseId)) {
        return Colls.Groups.find({course: courseId});
    }
    return [];
});

Meteor.publish('courseMembers', function (courseId) {
    if (Roles.userIsInRole(this.userId, ['global_student', 'global_mentor', 'global_admin', 'global_community_admin'], courseId)) {
        var users = Meteor.users.find({$or:[{courses: courseId},{mentorshipCourses: courseId}]});
        return [
            users,
            ProfileAvatar.find({'metadata.owner':{$in: users.map(function(u){ return u._id; })}})
        ];
    }
    return [];
});
