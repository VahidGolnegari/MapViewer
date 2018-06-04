var UrbanElementsDatabaseApiService = UrbanElementsDatabaseApiService || {};

// Global elementAttributes
var elementAttributes = {};

UrbanElementsDatabaseApiService.elementPointService = function (moduleId) {
    var service = {
        path: "UrbanElementsDatabaseApiModule",
        framework: $.ServicesFramework(moduleId)
    };
    service.baseUrl = service.framework.getServiceRoot(service.path) + "Item/";
    var elementId: -1;
    var getElementsLocationsActionUrl: "";
    var createElementPointActionUrl: "";
    var getElementPointActionUrl: "";
    var getElementPointAttributesActionUrl: "";
    var getElementsAttributesActionUrl: "";
    var elementPointWorkFlowViewSingleActionUrl: "";
    var updateElementPointAttributesActionUrl: "";
    var indexPath: "";

    /**
    * Ajax request to get element locations.
    */
    var getElementPoints = function(handleData) {
        // Create final path.
        var finalElementLocationsPath = this.getElementsLocationsActionUrl + "?elementId=" + this.elementId;

        // Log in the console.
        var functionName = this.getElementLocations.name;
        logIntendedData(functionName, "the URL is:", this.getElementsLocationsActionUrl);
        logIntendedData(functionName, "element id is:", this.elementId);
        logIntendedData(functionName, "final URL is:", finalElementLocationsPath);

        return $.ajax({
            type: "GET",
            url: finalElementLocationsPath,
            complete: function(response) {
                // Log response.
                logIntendedData(functionName, "the response of requested element locations is:", response);
                // Parse response.
                var data = hackDnnActionResultForJsonResponse(response);
                // Log data.
                logIntendedData(functionName, "the result of requested element locations is:", data);
                // Create marker in map.
                handleData(data);
            }
        });
    };

    /**
    * Ajax request to create element point.
    * @param {any} lat
    * @param {any} long
    */
    var createElementPoint = function(lat, long) {
        // Build final path.
        var createElementPointFinalPath = this.createElementPointActionUrl;

        // Log in the console.
        var functionName = this.createElementPoint.name;
        logIntendedData(functionName, "the URL is:", this.createElementPointActionUrl);
        logIntendedData(functionName, "element id is:", this.elementId);
        logIntendedData(functionName, "final URL is:", createElementPointFinalPath);
        var requestObject = {
            "ElementId": this.elementId,
            "Geom": {
                "Latitude": lat,
                "Longitude": long
            }
        };
        // Log data.
        logIntendedData(functionName, "the request object is:", requestObject);

        return $.ajax({
            type: "POST",
            url: createElementPointFinalPath,
            data: {
                locationJsonString: 
                    JSON.stringify(requestObject)
            },
            complete: function(response) {
                // Log response.
                logIntendedData(functionName, "the response of requested locations is:", response);
                // Parse response.
                var data = hackDnnActionResultForJsonResponse(response);
                // Log data.
                logIntendedData(functionName, "the result of requested locations is:", data);
                // Refresh hole page.
                location.reload();
            }
        });
    },

    /**
    * The function to create element attribute form attributes and element
    * point JSON objects.
    * Using global element attributes that was resolved from clicked element.
    * @param {elementPointObject} elementPointData
    * @param {elementPointAttributesObject} elementPointAttributesData
    */
    var createAndShowAttributeForm = function(elementPointData, elementPointAttributesData) {
        // Log data.
        var functionName = this.createAndShowAttributeForm.name;
        logIntendedData(functionName, "the element attributes is:", elementAttributes);
        logIntendedData(functionName, "the element point is:", elementPointData);

        // Dynamically create form in the target DOM.
        var elementAttributesHtml = "<div class='col-md-12'>";
        for (var i = 0; i < elementAttributes.Count; i++) {
            // We should use default value that was provided in the form if no value
            // was set before. So check all element point attributes and check it for 
            // matching with the target field and then check if this value was empty 
            // then use default value if anything was saved before.
            // Value for input box.
            var defaultValue = elementAttributes.ElementAttributes[i].DefaultValue;
            var currentElementPointAttributeId = 0;
            // Resolve value.
            for (var j = 0; j < elementPointAttributesData.Count; j++) {
                if (elementPointAttributesData.ElementPointAttributes[j].ElementAttribute.Key ===
                    elementAttributes.ElementAttributes[i].Key) {
                    defaultValue = elementPointAttributesData.ElementPointAttributes[j].Value;
                    currentElementPointAttributeId = elementPointAttributesData.ElementPointAttributes[j].ElementAttributeId;
                }
            }
            // Is current attribute required.
            var isRequired = elementAttributes.ElementAttributes[i].IsRequired;
            // Generate * or empty
            var isRequiredSymbol = "";
            if (isRequired) {
                isRequiredSymbol = "<labe style='color: red;'>*</label>";
            }
            // Resolve value if nothing was found and use default value.
            if (isStringEmptyOrUndefined(defaultValue)) { defaultValue = elementAttributes.ElementAttributes[i].DefaultValue; }

            elementAttributesHtml += 
                                    '<p> \
                                        ' + elementAttributes.ElementAttributes[i].Key + ':' + isRequiredSymbol + ' <input name="' + elementAttributes.ElementAttributes[i].Id + ',' + currentElementPointAttributeId  + '" type="' + elementAttributes.ElementAttributes[i].Type + '" class="col-md-12 form-control" value="' + defaultValue + '" placeholder="' + elementAttributes.ElementAttributes[i].Key + '"> \
                                        </p>';

            elementAttributesHtml += "</div><div class='col-md-12'>";
        }

        $("#element-detail-template").html("\
                        <div class='modal-dialog'> \
                            <div class='modal-content'> \
                                <div class='modal-header'> \
                                    <button type='button' class='close' data-dismiss='modal' aria-hidden='true'></button> \
                                    <h4 class='modal-title'>مشخصات المان</h4> \
                                </div> \
                                <div class='modal-body'> \
                                    <div class='scroller' style='height: 300px; display: inline;' data-always-visible='1' data-rail-visible1='1'> \
                                        <div class='tabbable-line'> \
                                            <ul class='nav nav-tabs '> \
                                                <li class='active'> \
                                                    <a href='#tab_15_1' data-toggle='tab'> مشخصات </a> \
                                                </li> \
                                                <li> \
                                                    <a href='#tab_15_2' data-toggle='tab'> فرم </a> \
                                                </li> \
                                            </ul> \
                                            <div class='tab-content'> \
                                                <div class='tab-pane active' id='tab_15_1'> \
                                                    <div class='row'> \
                                                        <div class='col-md-6'> \
                                                            <p> \
                                                                <input type='text' class='col-md-12 form-control' readonly placeholder='ایجاد کننده: " + elementPointData.CreatedBy + "'> \
                                                            </p> \
                                                            <p> \
                                                                <input type='text' class='col-md-12 form-control' readonly placeholder='تاریخ ایجاد: " + elementPointData.CreatedAt + "'> \
                                                            </p> \
                                                            <p> \
                                                                <input type='text' class='col-md-12 form-control' readonly placeholder='تاریخ ویرایش: " + elementPointData.UpdatedAt + "'> \
                                                            </p> \
                                                        </div> \
                                                        <div class='col-md-6'> \
                                                            <p> \
                                                                <input type='text' class='col-md-12 form-control' readonly placeholder='نوع المان: " + elementPointData.ElementType + "'> \
                                                            </p> \
                                                            <p> \
                                                                <input type='text' class='col-md-12 form-control' readonly placeholder='عرض جغرافیایی: " + elementPointData.Geom.Latitude + "'> \
                                                            </p> \
                                                            <p> \
                                                                <input type='text' class='col-md-12 form-control' readonly placeholder='طول جغرافیایی: " + elementPointData.Geom.Longitude + "'> \
                                                            </p> \
                                                        </div> \
                                                    </div> \
                                                </div> \
                                                <div class='tab-pane' id='tab_15_2'> \
                                                    <div class='alert alert-danger d-none' id='attribute-form-error-message'></div> \
                                                    <form class='row element-detail-form'> \
                                                        " + elementAttributesHtml + " \
                                                    </form> \
                                                </div> \
                                            </div> \
                                        </div> \
                                    </div> \
                                </div> \
                                <div class='modal-footer'> \
                                    <a id='element-detail-button' class='btn green edit-element-attributes'>ذخیره</a> \
                                    <a href=' " + this.elementPointWorkFlowViewSingleActionUrl.replace(/_elementPointId_/g, elementPointData.ElementPointId).replace(/_workFlowId_/g, elementPointData.WorkFlowId) + "' target='_blank' class='btn blue btn-outline'>گردش کارها</a> \
                                    <button type='button' data-dismiss='modal' class='btn default btn-outline'>بستن</button> \
                                </div> \
                            </div> \
                            <script> $('#element-detail-button').click(function(e) { updateElementPointAttributes('" + this.updateElementPointAttributesActionUrl + "', " + elementPointData.ElementPointId + ",'"+ this.indexPath +"'); }); </script> \
                        </div> \
                    ");
        // Visible the generated form.
        $("#element-detail").modal('show');
    },

    /**
    * Ajax request to get element point attributes.
    * @param {elementPointObject} elementPointData
    */
    var getElementPointAttributes = function(elementPointId, elementPointData) {
        // Create final path.
        var finalElementPointAttributesPath = this.getElementPointAttributesActionUrl + "?elementPointId=" + elementPointId;

        // Log in the console.
        var functionName = this.getElementPointAttributes.name;
        logIntendedData(functionName, "the URL is:", this.getElementsLocationsActionUrl);
        logIntendedData(functionName, "element id is:", this.elementId);
        logIntendedData(functionName, "final URL is:", finalElementPointAttributesPath);

        return $.ajax({
            type: "GET",
            url: finalElementPointAttributesPath,
            complete: function(response) {
                // Log response.
                logIntendedData(functionName, "the response of requested element point attributes is:", response);
                // Parse response.
                var data = hackDnnActionResultForJsonResponse(response);
                // Log data.
                logIntendedData(functionName, "the result of requested element point attributes is:", data);
                // Create form.
                ElementPointService.createAndShowAttributeForm(elementPointData, data);
            }
        });
    },

    /**
    * Ajax request to get element point.
    * @param {string} elementPointId
    */
    var getElementPoint = function(elementPointId) {
        // Build final path.
        var getElementPointFinalPath = this.getElementPointActionUrl + "?elementPointId=" + elementPointId;

        // Log in the console.
        var functionName = this.getElementPoint.name;
        logIntendedData(functionName, "the URL is:", this.getElementsLocationsActionUrl);
        logIntendedData(functionName, "element id is:", this.elementId);
        logIntendedData(functionName, "final URL is:", getElementPointFinalPath);

        return $.ajax({
            type: "GET",
            url: getElementPointFinalPath,
            complete: function(response) {
                // Log response.
                logIntendedData(functionName, "the response of requested element locations is:", response);
                // Parse response.
                var data = hackDnnActionResultForJsonResponse(response);
                // Log data.
                logIntendedData(functionName, "the result of requested element locations is:", data);
                // Get element point attributes and pass element point data to it for create form.
                ElementPointService.getElementPointAttributes(elementPointId, data);
            }
        });
    },

    /**
    * Ajax request to get element attributes.
    */
    var getElementAttributes = function() {
        // Build final path.
        var finalElementAttributesPath = this.getElementsAttributesActionUrl + "?elementId=" + this.elementId;

        // Log in the console.
        var functionName = this.getElementAttributes.name;
        logIntendedData(functionName, "the URL is:", this.getElementsLocationsActionUrl);
        logIntendedData(functionName, "element id is:", this.elementId);
        logIntendedData(functionName, "final URL is:", finalElementAttributesPath);

        return $.ajax({
            type: "GET",
            url: finalElementAttributesPath,
            complete: function(response) {
                // Log response.
                logIntendedData(functionName, "the response of requested element attributes is:", response);
                // Parse response.
                var data = hackDnnActionResultForJsonResponse(response);
                // Log data.
                logIntendedData(functionName, "the result of requested element attributes is:", data);
                // Update global element attributes.
                elementAttributes = data;
            }
        });
    }

    return {
        getElementPoints:           getElementPoints,
        createElementPoint:         createElementPoint,
        createAndShowAttributeForm: createAndShowAttributeForm,
        getElementPointAttributes:  getElementPointAttributes,
        getElementPoint:            getElementPoint,
        getElementAttributes:       getElementAttributes
    };
}
