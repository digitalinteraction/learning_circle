'use strict';

Meteor.startup(function () {
    UniConfig.private.runOnce('briefPurifyBlog3', function () {
        Blog.find({}).forEach(function (doc) {
            doc.brief = App.clearText(doc.content);
            if (doc.brief.length > 500) {
                doc.brief = doc.brief.substr(0, 447) + '...';
            }
            Blog.update({_id: doc._id}, {$set: {brief: doc.brief}});
        });
    });

    UniConfig.private.runOnce('briefPurifyProject3', function () {
        Project.find({}).forEach(function (doc) {
            doc.brief = App.clearText(doc.content);
            if (doc.brief.length > 500) {
                doc.brief = doc.brief.substr(0, 447) + '...';
            }
            Project.update({_id: doc._id}, {$set: {brief: doc.brief}});
        });
    });

    UniConfig.private.runOnce('briefPurifyCourses3', function () {
        Colls.Courses.find({}).forEach(function (doc) {
            doc.brief = App.clearText(doc.description);
            if (doc.brief.length > 500) {
                doc.brief = doc.brief.substr(0, 447) + '...';
            }
            Colls.Courses.update({_id: doc._id}, {$set: {brief: doc.brief}});
        });
    });

    UniConfig.private.runOnce('blogImageCollectionFix', function () {
        Blog.find({images: {$ne: false}}).forEach(function (doc) {
            var newDoc = {};
            var projectImageDoc;
            var blogImageDoc;
            if (doc.image) {
                projectImageDoc = App.projectImagesCollection.findOne({_id: doc.image});
                if (projectImageDoc) {
                    newDoc = {
                        original: projectImageDoc.original,
                        uploadedAt: projectImageDoc.uploadedAt,
                        copies: projectImageDoc.copies
                    };
                    blogImageDoc = App.blogImagesCollection.files.insert(newDoc);
                    if (projectImageDoc && blogImageDoc) {
                        Blog.update({_id: doc._id}, {$set: {image: blogImageDoc}});
                    }
                }
            }
        });
    });

    UniConfig.private.runOnce('briefPurifyActivities3', function () {
        UniRiver.Activities.find({action: {$in: ['createdBlog', 'updatedBlog', 'removedBlog', 'createdProject', 'updatedProject', 'removedProject']}}).forEach(function (doc) {
            var Collection = ((doc.action === 'createdBlog' || doc.action === 'updatedBlog' || doc.action === 'removedBlog') ? Blog : Project);
            var object;
            if (doc.o._id) {
                object = Collection.findOne(doc.o._id);
            }
            if (object && object.content) {
                doc.o.brief = App.clearText(object.content);
                if (doc.o.brief.length > 500) {
                    doc.o.brief = doc.o.brief.substr(0, 447) + '...';
                }
            } else {
                doc.o.brief += ' ';
            }
            UniRiver.Activities.update({_id: doc._id}, {$set: {'o.brief': doc.o.brief}});
        });
    });
});
