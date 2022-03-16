sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";
    return Controller.extend("sap.ui.demo.walkthrough.controller.App", {

        onInit: function () {
            // set data model on view
            const oData = {
                recipient: {
                    name: "World"
                },
                scenario: [
                    {
                        label: "S/4 Upgrade",
                        checked: false
                    },
                    {
                        label: "S/4 Conversion",
                        checked: false
                    },
                    {
                        label: "BW4 HANA",
                        checked: false
                    },
                    {
                        label: "RCX",
                        checked: false,
                    },
                    {
                        label: "UDP",
                        checked: false   
                    }

                ],
                checks: [
                    {
                        label: "ABAP",
                        selected: false,
                        vaildXmls: [ 
                            {
                                type: "Normal",
                                checked: true
                            },
                            {
                                type: "Error",
                                checked: false
                            },
                            {
                                type: "No Data",
                                checked: false
                            },
                        ]
                    },
                    {
                        label: "Active Business Function",
                        selected: false
                    },
                    {
                        label: "Addons",
                        selected: false
                    },
                    {
                        label: "Interface",
                        selected: false,
                    },
                    {
                        label: "BSP",
                        selected: false   
                    }

                ],
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "scenarioModel");
        },

        onShowHello: function () {
            // show a native JavaScript alert
            alert("Hello World");
        },

        onScenarioSelect: function (oEvent) {
            const oSource = oEvent.getSource();
            if (oEvent.getParameters().selected) {
                console.log(oSource.getText());
            }
        }
    });
});