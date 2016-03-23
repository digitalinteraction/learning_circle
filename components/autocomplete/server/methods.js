'use strict';

Meteor.methods({
    'getAutocompleteUsers': function (searchText, activeCourse) {
        check(this.userId, String);
        check(searchText, String);
        check(activeCourse, String);

        var text = searchText.replace(/\s/g, '\\s');
        var regex = new RegExp(text, 'i');
        var userId = this.userId;

        return Meteor.users.aggregate([{
            $project: {
                fullname: {
                    $concat: ['$name', ' ', '$surname']
                },
                courses: 1,
                mentorshipCourses: 1,
                _id: 1
            }
        }, {
            $match: {
                fullname: regex,
                $or: [
                    {courses: activeCourse},
                    {mentorshipCourses: activeCourse}
                ],
                _id: {$ne: userId}
            }
        }, {
            $limit: 10
        }]);
    }
});
