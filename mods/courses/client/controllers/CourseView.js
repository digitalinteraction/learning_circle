'use strict';

RouteCtrls.CourseView = RouteCtrls.Basic.extend({
    subscriptions: function () {
        return [
            Meteor.subscribe('course', this.params.courseId),
            Meteor.subscribe('otherCourses', this.params.courseId),
            Meteor.subscribe('tasksList', this.params.courseId)
        ];
    },
    data: function () {
        return {
            course: Colls.Courses.findOne({_id: this.params.courseId})
        };
    },
    onAfterAction: function () {
        var course = Colls.Courses.findOne({_id: this.params.courseId});
        var imageURL, image;

        if (course) {
            image = App.courseImagesCollection.findOne({_id: course.image});
            if (image) {
                imageURL = image.url();
            }
            SEO.set({
                meta: {
                    description: course.brief
                },
                og: {
                    'title': course.title,
                    'description': course.brief,
                    'image': window.location.origin + imageURL
                }
            });
        }
    }
});
