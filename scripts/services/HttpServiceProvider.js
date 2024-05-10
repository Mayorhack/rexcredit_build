(function (module) {
  mifosX.services = _.extend(module, {
    HttpServiceProvider: function () {
      var requestInterceptors = {};

      this.addRequestInterceptor = function (id, interceptorFn) {
        requestInterceptors[id] = interceptorFn;
      };

      this.removeRequestInterceptor = function (id) {
        delete requestInterceptors[id];
      };

      this.$get = [
        "$http",
        function (http) {
          var HttpService = function () {
            var getConfig = function (config) {
              return _.reduce(
                _.values(requestInterceptors),
                function (c, i) {
                  return i(c);
                },
                config
              );
            };

            var self = this;
            _.each(["get", "delete", "head"], function (method) {
              self[method] = function (url) {
                var config = getConfig({
                  method: method.toUpperCase(),
                  url: url,
                });
                return http(config);
              };
            });
            _.each(["post", "put"], function (method) {
              self[method] = function (url, data, headers) {
                var config = getConfig({
                  method: method.toUpperCase(),
                  url: url,
                  data: data,
                  headers: headers,
                });
                return http(config);
              };
            });
            this.setAuthorization = function (key, isOauth) {
              if (isOauth) {
                http.defaults.headers.common.Authorization = "bearer " + key;
              } else {
                http.defaults.headers.common.Authorization = "Basic " + key;
                http.defaults.headers.common["x-source-code"] = "BAASCORE";
                http.defaults.headers.common["x-client-id"] =
                  "TSTBAASCORE_827284704106634167780257123372";
                http.defaults.headers.common["x-client-secret"] =
                  "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJCQUFTQ09SRSIsImlhdCI6MTcxNDQ4MTYxNywic3ViIjoiQkFBU0NPUkUiLCJpc3MiOiJCQUFTQ09SRSIsImV4cCI6MTcxMjY4OTkyMH0.ZFGzRPRlbsIfcMWpjpoy3ADfZ_TCahucoahqdg1pK_w";
              }
            };

            this.cancelAuthorization = function () {
              delete http.defaults.headers.common.Authorization;
              delete http.defaults.headers.common[
                "Fineract-Platform-TFA-Token"
              ];
            };

            this.setTwoFactorAccessToken = function (token) {
              http.defaults.headers.common["Fineract-Platform-TFA-Token"] =
                token;
            };
            this.setOTPToken = function (token) {
              console.log("otp set");

              http.defaults.headers.common["otp"] = token;
            };
          };
          return new HttpService();
        },
      ];
    },
  });
  mifosX.ng.services
    .config(function ($provide) {
      $provide.provider("HttpService", mifosX.services.HttpServiceProvider);
    })
    .run(function ($log) {
      $log.info("HttpService initialized");
    });
})(mifosX.services || {});
