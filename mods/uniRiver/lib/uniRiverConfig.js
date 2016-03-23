'use strict';

UniRiver.transformActor = function (actor) {
    var actorName;
    if (actor.name && actor.surname) {
        actorName = actor.name + ' ' + actor.surname;
    } else if (actor.name) {
        actorName = actor.name;
    }
    return {
        _id: actor._id,
        name: actorName
    };
};
