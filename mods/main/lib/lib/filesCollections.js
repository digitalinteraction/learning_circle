'use strict';

/*
 Stores
 */

var bigCover = new FS.Store.GridFS('bigCover', {
    transformWrite: cropAndResize('750', '300')
});
var smallCover = new FS.Store.GridFS('smallCover', {
    transformWrite: cropAndResize('400', '160')
});

/**
 * Generates a transformWrite compatible function to crop and resize image for given dimensions
 * @param {String} width width
 * @param {String} [height=width] height
 * @return {Function} transformWrite function
 */
function cropAndResize (width, height) {
    check(width, String);
    height = height || width;
    check(height, String);
    return function (fileObj, readStream, writeStream) {
        gm(readStream, fileObj.name())
            .autoOrient()
            .resize(width, height + '^')
            .gravity('Center')
            .extent(width, height)
            .stream()
            .pipe(writeStream);
    };
}

var imageFilter = {
    maxSize: 2 * 1024 * 1024, // in bytes
    allow: {
        contentTypes: ['image/*'],
        extensions: ['png', 'jpeg', 'jpg']
    },
    onInvalid: function (message) {
        if (Meteor.isClient) {
            alert(message + '.\nAllowed formats: png, jpeg, jpg \nMax file size: 2 MB');
        } else {
            console.log(message);
        }
    }
};


/*
 Blog files
 */

var blogImagesCollection = new FS.Collection('blogImages', {
    stores: [smallCover, bigCover],
    filter: imageFilter
});

blogImagesCollection.allow({
    insert: function (userId) {
        return !!userId;
    },
    update: function (userId) {
        return !!userId;
    },
    remove: function (userId) {
        return !!userId;
    },
    download: function () {
        return true;
    }
});

if (Meteor.isServer) {
    Meteor.publish('blogImages', function (id) {
        if (Match.test(id, String)) {
            return blogImagesCollection.find({_id: id}, {limit: 1});
        }
        return [];
    });
}

App.blogImagesCollection = blogImagesCollection;


/*
 Project files
 */

var projectImagesCollection = new FS.Collection('projectImages', {
    stores: [smallCover, bigCover],
    filter: imageFilter
});

projectImagesCollection.allow({
    insert: function (userId) {
        return !!userId;
    },
    update: function (userId) {
        return !!userId;
    },
    remove: function (userId) {
        return !!userId;
    },
    download: function () {
        return true;
    }
});

if (Meteor.isServer) {
    Meteor.publish('projectImages', function (id) {
        if (Match.test(id, String)) {
            return projectImagesCollection.find({_id: id}, {limit: 1});
        }
        return [];
    });
}

App.projectImagesCollection = projectImagesCollection;

/*
 Courses files
 */

var courseImagesCollection = new FS.Collection('courseImages', {
    stores: [smallCover, bigCover],
    filter: imageFilter
});

courseImagesCollection.allow({
    insert: function (userId) {
        return !!userId;
    },
    update: function (userId) {
        return !!userId;
    },
    remove: function (userId) {
        return !!userId;
    },
    download: function () {
        return true;
    }
});

if (Meteor.isServer) {
    Meteor.publish('courseImages', function (id) {
        if (Match.test(id, String)) {
            return courseImagesCollection.find({_id: id}, {limit: 1});
        }
        return [];
    });
}

App.courseImagesCollection = courseImagesCollection;

/*
 Community files
 */

var communityImagesCollection = new FS.Collection('communityImages', {
    stores: [smallCover, bigCover],
    filter: imageFilter
});

communityImagesCollection.allow({
    insert: function (userId) {
        return !!userId;
    },
    update: function (userId) {
        return !!userId;
    },
    remove: function (userId) {
        return !!userId;
    },
    download: function () {
        return true;
    }
});

if (Meteor.isServer) {
    Meteor.publish('communityImages', function (id) {
        if (Match.test(id, String)) {
            return communityImagesCollection.find({_id: id}, {limit: 1});
        }
        return [];
    });
}

App.communityImagesCollection = communityImagesCollection;

