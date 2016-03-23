'use strict';

AutoForm.hooks({
    updateTasksForm: {
        formToModifier: function (modifier) {
            var deadline = UniUtils.get(modifier, '$set.deadline');

            if (deadline) {
                UniUtils.set(modifier, '$set.deadline', new Date(deadline));
            }

            UniUtils.set(modifier, '$set.course', UniUtils.get(Router.current(), 'params.courseId'));

            return modifier;
        },
        docToForm: function (doc) {
            if (doc.deadline) {
                doc.deadline = moment(doc.deadline).format('ll');
            }
            return doc;
        },
        after: {
            update: function (err) {
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

Template.tasksEdit.onRendered(function () {
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
