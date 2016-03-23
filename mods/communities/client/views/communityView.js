'use strict';

Template.communityView.helpers({
    communityTasks: function () {
        if (this._id) {
            return Colls.Tasks.find({community: this._id});
        }
    },
    canApply: function () {
        return moment(new Date(this.startDate)).isAfter(new Date()) && moment(new Date(this.endDate)).isAfter(new Date());
    }
});

Template.communityViewImage.onRendered(function () {
    var data;
    this.autorun(function () {
        data = Template.currentData();
        if (data && data.image) {
            this.subscribe('communityImages', data.image);
        }
    }.bind(this));
});

Template.communityViewImage.helpers({
    communityFileObj: function () {
        var image = this.image;
        if (image) {
            return App.communityImagesCollection.findOne({_id: image});
        }
    }
});
