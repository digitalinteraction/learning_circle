'use strict';
window.getJsonStatistic = function () {
    Meteor.call('getStatisticToken', function (err, response) {
        if (err) {
            console.error(err);
        } else {
            window.open(Meteor.absoluteUrl(response));
        }
    });
};

window.convertUsersAvatars = function (token) {
    var user = UniUsers.getLoggedIn();
    if(user && user.isAdmin()){
        Meteor.subscribe('convertAvatarPublication', token, {
            onReady: function(){
                var usersIds = [];
                UniUsers.find().forEach(function(u){
                    usersIds.push(u._id);
                });
                ProfileAvatar.find({'metadata.owner': {$in: usersIds}}).forEach(function(avatar){
                    var avatarUrl = avatar && avatar.url({store: 'thumbs'});
                    var xhr = new XMLHttpRequest();
                    var myBlob = null;
                    xhr.open('GET', Meteor.absoluteUrl(avatarUrl), true);
                    xhr.responseType = 'blob';
                    xhr.onload = function() {
                        if (this.status == 200) {
                            myBlob = this.response;
                            var reader = new window.FileReader();
                            reader.readAsDataURL(myBlob);
                            reader.onloadend = function() {
                                var base64Image = reader.result;
                                console.log('runMethod');
                                Meteor.call('insertUserAvatar',{_id: avatar.metadata.owner, base64Image: base64Image});
                            };
                        }
                    };
                    xhr.send();
                });
            }
        });
    }
};
