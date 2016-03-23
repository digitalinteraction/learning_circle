'use strict';

// TODO: roles and groups

// all courses listing (visibility - all)
Meteor.publish('courses', function () {
    var courses = Colls.Courses.find({}, {
        fields: {
            title: 1,
            description: 1,
            startDate: 1,
            endDate: 1,
            image: 1,
            community_id: 1
        }
    });
    return [
        courses,
        App.courseImagesCollection.find({
            _id: {
                $in: courses.map(function (course) {
                    if (course.image) {
                        return course.image;
                    }
                })
            }
        })
    ];
});

Meteor.publish('otherCourses', function (courseId) {
    check(courseId, String);
    var courses = Colls.Courses.find({_id: {$ne: courseId}}, {
        limit: 4,
        fields: {
            title: 1,
            image: 1,
            community_id: 1
        }
    });
    return [
        courses,
        App.courseImagesCollection.find({
            _id: {
                $in: courses.map(function (course) {
                    if (course.image) {
                        return course.image;
                    }
                })
            }
        })
    ];
});

// users courses titles in main menu (only courses by logged in user)
Meteor.publish('userCoursesTitles', function (coursesArr) {
    if (this.userId && Roles.userIsInRole(this.userId, 'global_admin')) {
        return Colls.Courses.find({}, {fields: {title: 1, image: 1}});
    }
    if (this.userId && _.isArray(coursesArr) && coursesArr.length > 0) {
        return Colls.Courses.find({_id: {$in: coursesArr}}, {fields: {title: 1, image: 1}});
    }
    this.ready();
});

// community admin courses titles in main menu
Meteor.publish('communityAdminCoursesTitles', function () {
    if (!this.userId || !Roles.userIsInRole(this.userId, 'global_community_admin')) {
        return [];
    }
    var communityIds = Colls.Communities
        .find({community_admins: this.userId}, {fields: {_id: 1}})
        .map(function (community) {
            return community._id;
        });

    return Colls.Courses.find({community_id: {$in: communityIds}}, {fields: {title: 1}});
});

// single course view (visibility - all)
Meteor.publish('course', function (courseId) {
    var courses;
    if (_.isString(courseId)) {
        courses = Colls.Courses.find({_id: courseId});
        return [
            courses,
            App.courseImagesCollection.find({
                _id: {
                    $in: courses.map(function (course) {
                        if (course.image) {
                            return course.image;
                        }
                    })
                }
            })
        ];
    }
    this.ready();
});

// homepage courses block (visibility - all)
Meteor.publish('homepageCourses', function () {
    var courses = Colls.Courses.find({}, {
        fields: {
            title: 1,
            description: 1,
            startDate: 1,
            endDate: 1,
            image: 1,
            community_id: 1
        }, limit: 2
    });
    return [
        courses,
        App.courseImagesCollection.find({
            _id: {
                $in: courses.map(function (course) {
                    if (course.image) {
                        return course.image;
                    }
                })
            }
        })
    ];
});
