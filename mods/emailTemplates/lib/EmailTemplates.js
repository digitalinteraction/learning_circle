'use strict';

/*
 ## How EmailTemplates Work:
 - There is closed list of triggers that can be triggered anywhere in the code to send emails
 - Each trigger should have a global EmailTemplate doc with template that acts as a default
 - Additionally each course can add own EmailTemplate doc for each trigger that will overwrite the default
 - When some action that requires sending email happens, trigger is called and mail is send based on:
 - + Data specific to the action (defined in the fields section for each trigger)
 - + EmailTemplate for the course or global one
 - + Branding from the course community
 */

//
// be sure to check out /settings/server/emails.js for more interesting stuff :)
//

var emailTriggersList = [
    {
        id: 'sign_up_for_course',
        fields: ['user_name', 'user_surname']
    },
    {
        id: 'approve_for_course',
        fields: ['user_name', 'user_surname']
    },
    {
        id: 'group_allocation',
        fields: ['group_title']
    },
    {
        id: 'group_reschedule',
        fields: ['user_name', 'user_surname', 'group_title']
    },
    {
        id: 'mail_all_students',
        fields: ['subject', 'content']
    }
];

/* global EmailTemplates: true */
(Meteor.isClient ? window : global).EmailTemplates = new UniCMS.Entity('emailTemplates', {
    triggerId: UniCMS.component('metadata', {
        schema: {
            label: 'Trigger ID',
            optional: false
        }
    }),
    courseId: UniCMS.component('metadata', {
        schema: {
            label: 'Course ID',
            optional: false
        }
    }),
    subject: UniCMS.component('text', {
        schema: {
            label: 'Email subject',
            optional: false
        }
    }),
    template: UniCMS.component('summernote', {
        schema: {
            label: 'Email template',
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
                ['insert', ['link', 'picture']],
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

var canEdit = function (userId) {
    return Roles.userIsInRole(userId, ['global_admin', 'global_community_admin']);
};

EmailTemplates.allow({
    insert: canEdit,
    update: canEdit
});

EmailTemplates.triggersList = emailTriggersList;
EmailTemplates.GLOBAL = '__DEFAULT__';
