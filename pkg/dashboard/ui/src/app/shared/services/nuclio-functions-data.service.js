(function () {
    'use strict';

    angular.module('nuclio.app')
        .factory('NuclioFunctionsDataService', NuclioFunctionsDataService);

    function NuclioFunctionsDataService(lodash, NuclioClientService, NuclioNamespacesDataService) {
        return {
            deleteFunction: deleteFunction,
            getFunction: getFunction,
            getFunctions: getFunctions,
            getTemplates: getTemplates,
            updateFunction: updateFunction
        };

        //
        // Public methods
        //

        /**
         * Gets function details
         * @param {Object} functionData
         * @returns {Promise}
         */
        function getFunction(functionData) {
            var headers = {
                'Content-Type': 'application/json',
                'x-nuclio-project-name': functionData.projectName
            };

            lodash.assign(headers, NuclioNamespacesDataService.getNamespaceHeader('x-nuclio-function-namespace'));

            var config = {
                method: 'get',
                headers: headers,
                withCredentials: false,
                url: NuclioClientService.buildUrlWithPath('functions/') + functionData.name
            };

            return NuclioClientService.makeRequest(config).then(function (response) {
                return response.data;
            });
        }

        /**
         * Deletes function
         * @param {Object} functionData
         * @returns {Promise}
         */
        function deleteFunction(functionData) {
            var headers = {
                'Content-Type': 'application/json'
            };
            var namespace = NuclioNamespacesDataService.getNamespace();

            if (lodash.isNil(namespace)) {
                functionData = lodash.omit(functionData, 'namespace')
            }

            var config = {
                method: 'delete',
                url: NuclioClientService.buildUrlWithPath('functions'),
                headers: headers,
                data: {
                    'metadata': functionData
                },
                withCredentials: false
            };

            return NuclioClientService.makeRequest(config);
        }

        /**
         * Gets functions list
         * @param {string} projectName - the name of the project containing the function
         * @returns {Promise}
         */
        function getFunctions(projectName) {
            var headers = {
                'x-nuclio-project-name': projectName
            };

            lodash.assign(headers, NuclioNamespacesDataService.getNamespaceHeader('x-nuclio-function-namespace'));

            var config = {
                method: 'get',
                url: NuclioClientService.buildUrlWithPath('functions'),
                headers: headers,
                withCredentials: false
            };

            return NuclioClientService.makeRequest(config, false, false);
        }

        /**
         * Update existing function with new data
         * @param {Object} functionDetails
         * @param {string} projectName - the name of the project containing the function
         * @returns {Promise}
         */
        function updateFunction(functionDetails, projectName) {
            var headers = {
                'Content-Type': 'application/json',
                'x-nuclio-project-name': projectName
            };

            var namespace = NuclioNamespacesDataService.getNamespace();
            if (!lodash.isNil(namespace)) {
                lodash.set(functionDetails, 'metadata.namespace', namespace);
            }

            var config = {
                method: 'post',
                url: NuclioClientService.buildUrlWithPath('functions'),
                headers: headers,
                data: functionDetails,
                withCredentials: false
            };

            return NuclioClientService.makeRequest(config);
        }

        /**
         * Gets templates for function
         * @returns {Promise}
         */
        function getTemplates() {
            var config = {
                method: 'get',
                withCredentials: false,
                url: NuclioClientService.buildUrlWithPath('function_templates')
            };

            return NuclioClientService.makeRequest(config);
        }
    }
}());
