'use strict';

Template.blogMostPopular.onCreated(function () {
    this.subscribe('BlogMostPopular', 4);
});

Template.blogMostPopular.helpers({
    posts: function () {
        return Blog.find({}, {
            sort: {
                title: 1 // @todo change this later to some popularity factor
            },
            limit: 4
        });
    }
});
