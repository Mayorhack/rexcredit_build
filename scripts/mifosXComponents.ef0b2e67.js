define(['Q', 'underscore', 'mifosX'], function (Q) {
    var components = {
        models: [
            'models.65f538ef'
        ],
        services: [
            'ResourceFactoryProvider',
            'HttpServiceProvider',
            'AuthenticationService',
            'SessionManager',
            'Paginator',
            'UIConfigService',
            'NotificationResponseHeaderProvider'
        ],
        controllers: [
            'controllers.48b5d011'
        ],
        filters: [
            'filters.b8785e06'
        ],
        directives: [
            'directives.922f124e'
        ]
    };

    return function() {
        var defer = Q.defer();
        require(_.reduce(_.keys(components), function (list, group) {
            return list.concat(_.map(components[group], function (name) {
                return group + "/" + name;
            }));
        }, [
            'routes-initialTasks-webstorage-configuration.fc273ef2'
        ]), function(){
            defer.resolve();
        });
        return defer.promise;
    }
});
