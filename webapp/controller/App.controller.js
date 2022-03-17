sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/RadioButton"
], function (Controller, JSONModel, RadioButton) {
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
                        label: "Addons",
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
                        label: "Interface",
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
                        label: "BSP",
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
                    }

                ],
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "scenarioModel");
        },

        onScenarioSelect: function (oEvent) {
            const oSource = oEvent.getSource();
            if (oEvent.getParameters().selected) {
                this.byId("checksBox").setVisible(true);
                this.byId("vaildXmlBox").setVisible(true);
                this.byId("checksCard").getHeader().setTitle(oSource.getText());
            }
        },

        onCheckSelect: function (oEvent) {
            const oSource = oEvent.getSource();
            const scenario = this.byId("checksCard").getHeader().getTitle();
            const cardTitle = `${scenario} -> ${oSource.getText()}`;
            this.byId("vaildXmlCard").getHeader().setTitle(cardTitle);
            if (oEvent.getParameters().selected) {
                const checks = this.getView().getModel("scenarioModel").oData.checks;
                const vaildXmls = checks.find((item) => item.label === oSource.getText());
                const oModel = new JSONModel({ vaildXmls: vaildXmls.vaildXmls});
                this.getView().setModel(oModel, "vaildXmlsModel");
            } else {
                const oModel = new JSONModel({ vaildXmls: []});
                this.getView().setModel(oModel, "vaildXmlsModel");
            }
        }
    });
});