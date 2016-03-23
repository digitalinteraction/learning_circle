'use strict';

Template.getUserBlogs.onCreated(function () {
    check(this.data, {
        userId: String
    });
    this.subscribe('BlogUserProfile', this.data.userId);
});
Template.getUserBlogs.helpers({
    posts: function () {
        return Blog.find({ownerId: this.userId});
    }
});
