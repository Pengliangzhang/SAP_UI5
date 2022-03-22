sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/RadioButton",
    "sap/ui/demo/walkthrough/util/Util"
], function (Controller, JSONModel, RadioButton, Util) {
    "use strict";
    return Controller.extend("sap.ui.demo.walkthrough.controller.App", {

        onInit: function () {
            const baseUrl = "http://localhost:3000";
            this.baseUrl = baseUrl;
            // set data model on view
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
                const oModel = new JSONModel({ checks: checkList, currentCheck: null });
                this.getView().setModel(oModel, "vaildChecksModel");
            }
        },

        onCheckSelect: function (oEvent) {
            const oSource = oEvent.getSource();
            const scenario = this.byId("checksCard").getHeader().getTitle();
            const cardTitle = `${scenario} -> ${oSource.getText()}`;
            this.byId("vaildXmlCard").getHeader().setTitle(cardTitle);
            const vaildChecks = this.getView().getModel("vaildChecksModel").oData;
            let vaildXmlsModel = null;
            if (oEvent.getParameters().selected) {
                vaildChecks.currentCheck = oSource.getText()
                const vaildXmls = vaildChecks.checks.find((item) => item.label === oSource.getText());
                const vaildXmlsList = vaildXmls.vaildXmls.map((item) => {
                    if (item.checked === undefined) {
                        item.checked = item.xmlType === "normal" ? true : false;
                    }
                    return item;
                });
                vaildXmlsModel = new JSONModel({ vaildXmls: vaildXmlsList});
            } else {
                vaildChecks.currentCheck = null;
                vaildXmlsModel = new JSONModel({ vaildXmls: []});                
            }
            const vaildChecksModel = new JSONModel(vaildChecks);
            this.getView().setModel(vaildXmlsModel, "vaildXmlsModel");
            this.getView().setModel(vaildChecksModel, "vaildChecksModel");

            const enabledDownload = vaildChecks.checks.some((item) => item.selected === true)
            if (enabledDownload) {
                this.byId("downloadBtn").setEnabled();
                this.byId("createBtn").setEnabled();
            } else {
                this.byId("downloadBtn").setEnabled(false);
                this.byId("createBtn").setEnabled(false);
            }
        },

        onDownloadClick: async function () {
            const scenarioList = this.getView().getModel("scenarioModel").oData;
            const checksList = this.getView().getModel("vaildChecksModel").oData;
            const currScenario = scenarioList.scenario.find((item) => item.selected === true )
            const selectedChecks = []
            checksList.checks.forEach((item) => {
                if (item.selected) {
                    const check = {};
                    check.checkName = item.label;
                    item.vaildXmls.forEach(xml => {
                        if (xml.checked) {
                            check.type = xml.xmlType;
                        }
                    });
                    selectedChecks.push(check);
                }
            });
            const requestBody = {
                fileDownloadInfo: {
                    checkList: selectedChecks,
                    scenarioName: currScenario.scenarioName
                }
            };
            const zipFile = await this.queryZipFile(requestBody);
            const a = document.createElement('a');
            a.href = `${this.baseUrl}/file/zip/${zipFile.data}`;
            a.click();
            a.remove();
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

        returnPostPromise: function (url, body) {
            return new Promise((resolve, reject) => {
                $.ajax(`${this.baseUrl}${url}`, {
                    type: "POST",
                    data: body,
                }).done((data, textStatus, jqXhr) => {
                    resolve({data, textStatus, jqXhr})
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

        queryZipFile: async function (requestBody) {
            return await this.returnPostPromise("/file/", requestBody);
        }
    });
});