sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/RadioButton"
], function (Controller, JSONModel, RadioButton) {
    "use strict";
    return Controller.extend("sap.ui.demo.walkthrough.controller.App", {

        onInit: function () {
            const baseUrl = "http://localhost:3000";
            this.baseUrl = baseUrl;
            // set data model on view
            const oData = {
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
                    }
                ],
            };
            this.initScenarioData();
        },

        initScenarioData: async function () {
            const vaildScenarios = await this.queryVaildScenarios();
            vaildScenarios.map((item) => {
                item.checked = false
                return item
            })
            const oModel = new JSONModel({ scenario: vaildScenarios });
            this.getView().setModel(oModel, "scenarioModel");
        },

        onScenarioSelect: async function (oEvent) {
            const oSource = oEvent.getSource();
            if (oEvent.getParameters().selected) {
                this.byId("checksBox").setVisible(true);
                this.byId("vaildXmlBox").setVisible(true);
                this.byId("checksCard").getHeader().setTitle(oSource.getText());
                const allChecks = await this.queryVaildChecks(oSource.getText());
                const checkList = []
                for (const key in allChecks) {
                    if (Object.hasOwnProperty.call(allChecks, key)) {
                        const element = allChecks[key];
                        const check = {
                            label: key,
                            selected: false,
                            vaildXmls: element
                        }
                        checkList.push(check)
                    }
                }
                const oModel = new JSONModel({ checks: checkList });
                this.getView().setModel(oModel, "vaildChecksModel");
            }
        },

        onCheckSelect: function (oEvent) {
            const oSource = oEvent.getSource();
            const scenario = this.byId("checksCard").getHeader().getTitle();
            const cardTitle = `${scenario} -> ${oSource.getText()}`;
            this.byId("vaildXmlCard").getHeader().setTitle(cardTitle);
            if (oEvent.getParameters().selected) {
                const checks = this.getView().getModel("vaildChecksModel").oData.checks;
                const vaildXmls = checks.find((item) => item.label === oSource.getText());
                const vaildXmlsList = vaildXmls.vaildXmls.map((item) => {
                    return {
                        type: item.xmlType,
                        checked: item.xmlType === "normal" ? true : false,
                    }
                });
                const oModel = new JSONModel({ vaildXmls: vaildXmlsList});
                this.getView().setModel(oModel, "vaildXmlsModel");
            } else {
                const oModel = new JSONModel({ vaildXmls: []});
                this.getView().setModel(oModel, "vaildXmlsModel");
            }
        },

        onDownloadClick: function () {
            console.log("downloading !!!");
        },

        onCreateClick: function () {
            console.log("Creating Analysis !!!");
        },

        returnGetPromise: function (url) {
            return new Promise((resolve, reject) => {
                $.ajax(`${this.baseUrl}${url}`, {
                    type: "GET",
                    contentType: "application/json",
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        withCredentials: true
                    }
                }).done((data, textStatus, jqXhr) => {
                    resolve(data)
                }).fail((jqXhr, textStatus, errorThrown) => {
                    reject(errorThrown)
                })
            })
        },

        returnPostPromise: function (url) {
            return new Promise((resolve, reject) => {
                $.ajax(`${this.baseUrl}${url}`, {
                    type: "POST",
                    contentType: "application/json"
                }).done((data, textStatus, jqXhr) => {
                    resolve(data)
                }).fail((jqXhr, textStatus, errorThrown) => {
                    reject(errorThrown)
                })
            })
        },

        queryVaildScenarios: async function () {
            return await this.returnGetPromise("/file/vaildScenario");
        },

        queryVaildChecks: async function (scenarioName) {
            return await this.returnGetPromise(`/file/vaildCheckByScenario/${scenarioName}`);
        },
    });
});