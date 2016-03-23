'use strict';

AutoForm.hooks({
    editCoursesForm: {
        formToModifier: function (modifier) {
            var startDate = UniUtils.get(modifier, '$set.startDate');
            var endDate = UniUtils.get(modifier, '$set.endDate');
            var description = UniUtils.get(modifier, '$set.description');

            if (startDate) {
                UniUtils.set(modifier, '$set.startDate', new Date(startDate));
            }
            if (endDate) {
                UniUtils.set(modifier, '$set.endDate', new Date(endDate));
            }
            if (description) {
                UniUtils.set(modifier, '$set.description', $('#editCoursesForm [name="description"]').summernote('code'));
            }
            return modifier;
        },
        docToForm: function (doc) {
            doc.startDate = moment(doc.startDate).format('ll');
            doc.endDate = moment(doc.endDate).format('ll');
            return doc;
        },
        after: {
            update: function (err) {
                if (!err) {
                    $(window).scrollTop(0);
                    Router.go('/course/' + this.docId);
                }
            }
        }
    }
});

Template.courseEdit.rendered = function () {
    var self = this;
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

Template.courseUploadImage.onCreated(function () {
    this.courseFileId = new ReactiveVar();

});

Template.courseUploadImage.onRendered(function () {
    var self = this;
    var data = Template.currentData();
    if (data && data.image) {
        self.courseFileId.set(data.image);
    }
    this.autorun(function () {
        self.subscribe('courseImages', self.courseFileId.get());
    });
});

Template.courseUploadImage.events({
    'click .js-course-upload': function (e, tmpl) {
        e.preventDefault();
        tmpl.$('.js-course-upload-input').trigger('click');
    },
    'change .js-course-upload-input': function (e, tmpl) {
        e.preventDefault();
        if (!e.target.files[0]) {
            return;
        }
        var file = new FS.File(event.target.files[0]);
        var beforeImage = tmpl.courseFileId.get();
        App.courseImagesCollection.insert(file, function (err, fileObj) {
            if (err) {
                return;
            }
            if (beforeImage) {
                App.courseImagesCollection.remove({_id: beforeImage});
            }
            tmpl.courseFileId.set(fileObj._id);
            $('.js-course-image-id').val(fileObj._id);
        });
    }
});

Template.courseUploadImage.helpers({
    courseFileObj: function () {
        var tmpl = Template.instance();
        return App.courseImagesCollection.findOne({_id: tmpl.courseFileId.get()});
    }
});
