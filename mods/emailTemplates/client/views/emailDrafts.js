'use strict';

Template.emailDrafts.onCreated(function () {
    this.autorun(function () {
        Meteor.subscribe('emailDrafts', Session.get('activeCourseId'));
    });
    Session.set('selectedEmailDraft', null);
    this.message = new ReactiveVar();
});
Template.emailDrafts.helpers({
    courseId: function () {
        return Session.get('activeCourseId');
    },
    getDrafts: function () {
        return EmailDrafts.find({
            courseId: Session.get('activeCourseId')
        }, {
            sort: {
                subject: 1
            }
        });
    },
    getSelectedDraftId: function () {
        return Session.get('selectedEmailDraft');
    },
    isSelectedDraft: function (id) {
        return Session.equals('selectedEmailDraft', id);
    },
    getMessage: function () {
        return Template.instance().message.get();
    }
});
Template.emailDrafts.events({
    'reset form#emailDraftsInsertForm': function (e) {
        $('[data-schema-key="content"]', e.currentTarget).summernote('code', '');
    },
    'click [data-action="select"]': function (e) {
        Session.set('selectedEmailDraft', $(e.currentTarget).data().id || null);
    },
    'click [data-action="remove"]': function (e) {
        e.preventDefault();
        e.stopPropagation();
        var id = UniUtils.get($(e.currentTarget).parent().data(), 'id');
        if (!id) {
            return;
        }
        if (Session.equals('selectedEmailDraft', id)) {
            Session.set('selectedEmailDraft', null);
        }

        EmailDrafts.remove({_id: id});
    },
    'click [data-action="send"]': function (e, t) {
        sendEmail(e, t, false);
    },
    'click [data-action="sendTestEmail"]': function (e, t) {
        sendEmail(e, t, true);
    }
});
Template._emailDraftsSendButton.helpers({
    areYouSureTestQuestion: function () {
        return i18n('emails.drafts.areYouSureTestQuestion', UniUsers.getLoggedIn().getFirstEmailAddress());
    },
    areYouSureQuestion: function () {
        var course = Colls.Courses.findOne(Session.get('activeCourseId'));
        return i18n('emails.drafts.areYouSureQuestion', course.title);
    }
});

function sendEmail (e, t, isTestEmail) {
    e.preventDefault();
    var draftId = Session.get('selectedEmailDraft');

    var form = $(e.currentTarget).closest('form');

    var subject = t.$('[data-schema-key="subject"]', form).val();
    var content = t.$('[data-schema-key="content"]', form).summernote('code');
    var courseId = Session.get('activeCourseId');

    var target = $('[name="target"]:checked', form).map(function () {
        return this.value;
    }).get();

    UniUI.areYouSure(e.currentTarget, function () {
        if (draftId && !isTestEmail) {
            // remove draft after send
            Session.set('selectedEmailDraft', null);
            EmailDrafts.remove({_id: draftId});
        }

        Meteor.call('sendCourseMassEmail', {
            subject: subject,
            content: content,
            target: target,
            courseId: courseId,
            isTestEmail: !!isTestEmail
        }, function (err) {
            if (err) {
                t.message.set({
                    type: 'error',
                    msg: err.reason || err.message || 'Unknown error'
                });
            } else {
                t.message.set({
                    type: 'success',
                    msg: i18n('emails.drafts.success')
                });

                if (!isTestEmail) {
                    // try to reset the form
                    try {
                        form.get(0).reset();
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        });
    });
}
