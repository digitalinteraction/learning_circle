'use strict';

AutoForm.hooks({
    insertTasksForm: {
        formToDoc: function (doc) {
            var courseId;
            if (doc) {
                courseId = UniUtils.get(Router.current(), 'params.courseId');
                doc.course = courseId;
                doc.deadline = new Date(doc.deadline);
            }
            return doc;
        },
        after: {
            insert: function (err) {
                var courseId;
                if (!err) {
                    courseId = UniUtils.get(Router.current(), 'params.courseId');
                    $(window).scrollTop(0);
                    Meteor.subscribe('course', courseId); // after redirect course looses subscription
                    Router.go('/course/' + courseId);
                }
            }
        }
    }
});

Template.tasksAdd.onRendered(function () {
    // datepicker
    this.$('.datetimepicker').datetimepicker({
        format: 'll'
    });

    var descVal = this.$('[name=description]').val();
    this.summernoteInst = this.$('[name=description]').summernote({
        height: 300
    });
    Meteor.defer(function () {
        self.$('[name=description]').summernote('code', descVal);
    });
});
