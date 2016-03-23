'use strict';


/* global EmailTemplates: true */
(Meteor.isClient ? window : global).EmailDrafts = new UniCMS.Entity('emailDrafts', {
    courseId: UniCMS.component('metadata', {
        schema: {
            autoform: {
                label: false
            },
            denyUpdate: true,
            optional: false
        }
    }),
    subject: UniCMS.component('text', {
        schema: {
            label: 'Email subject',
            optional: false
        }
    }),
    content: UniCMS.component('summernote', {
        schema: {
            label: 'Email content',
            optional: true
        },
        summernoteOptions: {
            height: 150,
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
                ['para', ['paragraph']],
                ['color', ['color']],
                ['fontsize', ['fontsize']],
                ['lists', ['ul', 'ol']],
                ['insert', ['link']],
                ['undoredo', ['undo', 'redo']],
                ['view', ['codeview']]
            ]
        }
    })
}, {
    dynamicPubSub: false,
    dynamicRouter: false,
    docHelpers: {}
});

EmailDrafts.hooks = {
    insert: {
        onSuccess: function () {
            Session.set('selectedEmailDraft', this.docId);
        }
    },
    update: {}
};

var canEdit = function (userId) {
    return Roles.userIsInRole(userId, ['global_admin', 'global_community_admin']);
};

EmailDrafts.allow({
    insert: canEdit,
    update: canEdit,
    remove: canEdit
});
