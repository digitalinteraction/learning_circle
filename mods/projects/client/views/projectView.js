'use strict';

Template.projectView.onCreated(function () {
    var self = this;

    self.isReady = new ReactiveVar(false);
    this.autorun(function () {
        var id = UniUtils.get(Router.current(), 'params._id');
        Meteor.subscribe('ProjectView', id, function () {
            self.isReady.set(true);
        });
        Meteor.subscribe('reportInformation', id);
    });
});

var getProject = function () {
    var id = UniUtils.get(Router.current(), 'params._id');
    return Project.findOne(id);
};

Template.projectView.helpers({
    isReady: function () {
        return Template.instance().isReady.get();
    },
    project: getProject,
    isJoined: function () {
        return this.doc && this.doc.joinIsJoined('project', UniUsers.getLoggedInId());
    }
});

Template.projectView.events({
    'click .js-set-status': function (ev) {
        var el = ev.currentTarget;
        var status = $(el).data('status');
        var project = getProject();
        var id = UniUtils.get(Router.current(), 'params._id');
        if (project) {
            if (status === 'archived') {
                UniUI.areYouSure(el, function () {
                    Project.update({_id: id}, {$set: {status: status}});
                    Meteor.call('setReportStatus', undefined, 'accepted', id);
                    if (project.editMode) {
                        project.toggleEditMode();
                    }
                });
            } else {
                Project.update({_id: id}, {$set: {status: status}});
                project.toggleEditMode();
                if (status === 'published' && project.taskId) {
                    Meteor.call('taskApprovalClear', project.taskId);
                }
            }
        }
    },
    'click .js-post-toggle-public': function () {
        var id = UniUtils.get(Router.current(), 'params._id');
        if (id) {
            Meteor.call('projectTooglePublic', id);
        }
    },
    'click .js-toggle-mode': function () {
        var project = getProject();
        if (project) {
            project.toggleEditMode();
        }
    },
    'click .js-edit': function () {
        var project = getProject();
        if (project) {
            project.editMode(true);
        }
    },
    'click .js-cancel': function () {
        var project = getProject();
        if (project) {
            project.editMode(false);
        }
    },
    'click .js-delete': function (ev) {
        var el = ev.currentTarget;
        var project = getProject();
        UniUI.areYouSure(el, function () {
            setTimeout(function () {
                Router.go('/project');
                if (project) {
                    Project.getCollection().remove({_id: project._id});
                }
            }, 100);
        });
    },
    'click .js-save': function () {
        var project = getProject();
        var formId;
        if (project) {
            formId = Project.getUpdateFormId(project._id);
            $('#' + formId).submit();
            if (project.taskId) {
                Meteor.call('taskApprovalClear', project.taskId);
            }
        }
    },
    'click .js-project-report': function () {
        var project = getProject(), data;
        if (project) {
            data = {
                userId: Meteor.userId,
                docId: project._id,
                docOriginalStatus: project.status,
                docType: 'project',
                status: 'reported'
            };
            UniUI.openModal('reportModal', data);
        }
    },
    'click .js-share': function (ev) {
        ev.preventDefault();

        var project = getProject();

        if (project.status !== 'public') {
            return;
        }

        var type = $(ev.currentTarget).data('type');
        var params = {};
        var url;

        switch (type) {
            case 'facebook':
                url = 'https://www.facebook.com/sharer.php';
                params.u = window.location.href;
                break;
            case 'google':
                url = 'https://plus.google.com/share';
                params.url = window.location.href;
                break;
            case 'twitter':
                url = 'https://twitter.com/home';
                params.status = project.title;
                break;
            case 'pinterest':
                url = 'https://pinterest.com/pin/create/button/';
                params.url = window.location.href;
                params.media = Meteor.absoluteUrl($('.js-share-media').attr('src'));
                params.description = project.title;
                break;
            default:
                console.warn('Invalid sharing type');
                return;
        }

        window.open(url + '?' + $.param(params), 'share-' + type,
            'width=580,height=400,toolbar=0,status=0,location=0,menubar=0,directories=0,scrollbars=0'
        );
    }
});

Template.updateProjectField.onCreated(function () {
    this.subscribe('projectPosts', this.data._id);
});

Template.updateProjectField.helpers({
    getProjectPosts: function () {
        return ProjectPost.find({projectId: this._id});
    },
    noWrite: function () {
        return ProjectPost.find({projectId: this._id, ownerId: Meteor.userId()}).count() === 0;
    }
});

Template.updateProjectField.events({
    'blur .js-update-field-project': function (e) {
        e.preventDefault();
        var value = $(e.currentTarget).val();
        if (value) {
            Project.getCollection().update({_id: this._id}, {$set: {updateProject: value}});
        }
    },
    'click .js-edit-project-post': function () {
        this.doc.editMode(true);
    },
    'click .js-delete-project-post': function (event) {
        var projectPostId = this.doc._id;
        UniUI.areYouSure(event.currentTarget, function () {
            Meteor.call('deleteProjectPost', projectPostId);
        });
    }
});

Template.uniAnyJoinButton.events({
    'click .js-uaj-join': function () {
        //TODO change this to hooks or something like that when project will be not public join
        uniNotifications.create('joinProject', Meteor.userId(), this._id);
    }
});

ProjectPost.hooks = {
    insert: {
        onSuccess: function () {
            this.template.$('.note-editable').html('');
        }
    },
    update: {
        onSuccess: function () {
            try {
                this.template.data.doc.editMode(false);
            } catch (e) {
                console.warn('[UniCMS] Cannot set edit mode to false. ' + e);
            }
        }
    }
};
