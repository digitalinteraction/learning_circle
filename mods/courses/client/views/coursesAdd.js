'use strict';

AutoForm.hooks({
    insertCoursesForm: {
        formToDoc: function (doc) {
            doc.startDate = new Date(doc.startDate);
            doc.endDate = new Date(doc.endDate);
            doc.description = $('[name=description]').summernote('code');
            doc.brief = App.clearText(doc.description);
            if (doc.brief > 500) {
                doc.brief = doc.brief.substr(0, 447) + '...';
            }
            return doc;
        },
        after: {
            insert: function (err, result) {
                if (!err) {
                    $(window).scrollTop(0);
                    Router.go('/course/' + result);
                }
            }
        }
    }
});

Template.coursesAdd.rendered = function () {
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
};
