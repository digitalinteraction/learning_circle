'use strict';

Template.commentsListForm.replaces('uniCommentsForm');
Template.commentsListForm.inheritsHelpersFrom('uniCommentsForm');
Template.commentsListForm.inheritsEventsFrom('uniCommentsForm');
Template.commentsListForm.inheritsHooksFrom('uniCommentsForm');

Template.commentsList.replaces('uniCommentsList');
Template.commentsList.inheritsHelpersFrom('uniCommentsList');
Template.commentsList.inheritsEventsFrom('uniCommentsList');
Template.commentsList.inheritsHooksFrom('uniCommentsList');

Template.commentsListItem.replaces('uniCommentsListItem');
Template.commentsListItem.inheritsHelpersFrom('uniCommentsListItem');
Template.commentsListItem.inheritsEventsFrom('uniCommentsListItem');
Template.commentsListItem.inheritsHooksFrom('uniCommentsListItem');

Template.commentsList.onRendered(function () {
    var self = this;
    this.autorun(function () {
        self.subscribe('docCommentsUsers', self.data.docId);
    });
});

Template.commentsAuthorAvatar.helpers({
    authorAvatar: function () {
        var userId = this._id;
        if (userId) {
            return ProfileAvatar.find({'metadata.owner': userId});
        }
    }
});

var autocomplete = new AutocompleteUsers();

Template.commentsListForm.onRendered(function () {
    this.commentTextarea = this.$('textarea');
    this.summernote = this.commentTextarea.summernote({
        toolbar: [],
        height: 150
    });

    this.summernote.on('summernote.keyup', function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(this);
        autocomplete.summernoteKeyUp.apply(autocomplete, args);
    });

    this.summernote.on('summernote.blur', function () {
        autocomplete.summernoteBlur.call(autocomplete);
    });
});

Template.commentEditForm.onRendered(function () {
    this.commentTextarea = this.$('textarea');
    this.summernote = this.commentTextarea.summernote({
        toolbar: [],
        height: 150
    });
});

Template.commentEditForm.onDestroyed(function () {
    this.summernote.summernote('destroy');
});

Template.commentsListForm.events({
    'click .js-send-comment-form': function (e, tmpl) {
        var $summernote = tmpl.summernote,
            text,
            docCollection = this.docCollection,
            docId = this.docId;

        if ($summernote && docId) {
            text = $summernote.summernote('code');
            text = UniHTML.purify(text);

            if (text) {
                UniComments.addComment(docId, text, {collectionName: docCollection});
                $summernote.summernote('code', '');
            }
        }
    }
});
