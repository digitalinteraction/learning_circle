'use strict';

UniCollection.publish('ReadingsInTask', function (taskId) {
    check(taskId, String);

    return Colls.Reading.find({taskId: taskId});
});
