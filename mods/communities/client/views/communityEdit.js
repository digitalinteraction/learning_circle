'use strict';

AutoForm.hooks({
    editCommunityForm: {
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
                UniUtils.set(modifier, '$set.description', $('#editCommunityForm [name="description"]').summernote('code'));
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
                    Router.go('/community/' + this.docId);
                }
            }
        }
    }
});

Template.communityEdit.rendered = function () {
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

Template.communityUploadImage.onCreated(function () {
    this.communityFileId = new ReactiveVar();

});

Template.communityUploadImage.onRendered(function () {
    var self = this;
    var data = Template.currentData();
    if (data && data.image) {
        self.communityFileId.set(data.image);
    }
    this.autorun(function () {
        self.subscribe('communityImages', self.communityFileId.get());
    });
});

Template.communityUploadImage.events({
    'click .js-community-upload': function (e, tmpl) {
        e.preventDefault();
        tmpl.$('.js-community-upload-input').trigger('click');
    },
    'change .js-community-upload-input': function (e, tmpl) {
        e.preventDefault();
        if (!e.target.files[0]) {
            return;
        }
        var file = new FS.File(event.target.files[0]);
        var beforeImage = tmpl.communityFileId.get();
        App.communityImagesCollection.insert(file, function (err, fileObj) {
            if (err) {
                return;
            }
            if (beforeImage) {
                App.communityImagesCollection.remove({_id: beforeImage});
            }
            tmpl.communityFileId.set(fileObj._id);
            $('.js-community-image-id').val(fileObj._id);
        });
    }
});

Template.communityUploadImage.helpers({
    communityFileObj: function () {
        var tmpl = Template.instance();
        return App.communityImagesCollection.findOne({_id: tmpl.communityFileId.get()});
    }
});
