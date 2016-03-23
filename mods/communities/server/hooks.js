'use strict';

Colls.Communities.before.update(function (userId, doc) {
    var communityAdmins = doc.community_admins;
    if (communityAdmins && communityAdmins.length) {
        _.each(communityAdmins, function (adminId) {
            Roles.removeUsersFromRoles(adminId, 'global_community_admin', Roles.GLOBAL_GROUP);
            Roles.removeUsersFromRoles(adminId, 'community_admin', doc._id);
        });
    }
    return true;
});

Colls.Communities.after.update(function (userId, doc) {
    var communityAdmins = doc.community_admins;
    if (communityAdmins && communityAdmins.length) {
        _.each(communityAdmins, function (adminId) {
            Roles.addUsersToRoles(adminId, 'global_community_admin', Roles.GLOBAL_GROUP);
            Roles.addUsersToRoles(adminId, 'community_admin', doc._id);
        });
    }
    return true;
});
