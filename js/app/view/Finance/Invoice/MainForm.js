/******************************************
 *  Author : fashahd@gmail.com.com
 *  Created On : Mon Jan 20 2020
 *  File : MainForm.js
 *******************************************/
/*
    Param2 yg diperlukan ketika load View ini
    - OpsiDisplay
    - SupplierID
    - PanelDisplayID
*/

Ext.define('MitraJaya.view.Finance.Invoice.MainForm', {
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Finance.Invoice.MainForm',
    style: 'padding:0 15px 15px 15px;margin:5px 0 0 0;',
    viewVar: false,
    setViewVar: function (value) {
        this.viewVar = value;
    },
    renderTo: 'ext-content',
    listeners: {
        afterRender: function () {
            var thisObj = this;
            document.getElementById('ContentTopBar').style.display = 'none';
            
            //Isi nilai default

            if (thisObj.viewVar.OpsiDisplay == 'insert') {
				
				
            }

            if (thisObj.viewVar.OpsiDisplay == 'view' || thisObj.viewVar.OpsiDisplay == 'update') {
                //default
                if (thisObj.viewVar.OpsiDisplay == 'view') {
                    Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-BtnSave').setVisible(false);
                }

                //load formnya
                Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData').getForm().load({
                    url: m_api + '/v1/finance/invoice/form_invoice',
                    method: 'GET',
                    params: {
                        InvoiceID: this.viewVar.InvoiceID
                    },
                    success: function (form, action) {
                        Ext.MessageBox.hide();
                        var r = Ext.decode(action.response.responseText);
                    },
                    failure: function (form, action) {
                        Swal.fire({
							icon: 'error',
							text: 'Failed to Retreive Data',
						})
                    }
                });

            }
        },
        beforerender: function () {
            var thisObj = this;

            if (thisObj.viewVar.OpsiDisplay != 'insert') {
                Ext.MessageBox.show({
                    msg: 'Please wait...',
                    progressText: 'Loading...',
                    width: 300,
                    wait: true,
                    waitConfig: {
                        interval: 200
                    },
                    icon: 'ext-mb-info', //custom class in msg-box.html
                    animateTarget: 'mb9'
                });
            }
        }
    },
    initComponent: function () {
        var thisObj = this;

        thisObj.combo_company = Ext.create('MitraJaya.store.General.CompanyList');
        thisObj.combo_contract_number = Ext.create('MitraJaya.store.General.ContractNumberList',{
        	storeVar: {
                CustomerID: ''
            }
        })

        

        thisObj.combo_month = Ext.create('MitraJaya.store.General.StoreMonth');
		
        thisObj.combo_year = Ext.create('MitraJaya.store.General.StoreYear',{
            storeVar: {
                yearRange: 20
            }
        });

        //Panel Basic ==================================== (Begin)
        thisObj.ObjPanelBasicData = Ext.create('Ext.panel.Panel', {
            title: 'Form Invoice',
            frame: true,
            cls: 'Sfr_PanelLayoutForm',
            id: 'MitraJaya.view.Finance.Invoice-FormGeneralData',
            collapsible: true,
            items: [{
                layout: 'column',
                border: false,
                padding: 10,
                items: [{
                    columnWidth: 1,
                    layout: 'form',
                    cls: 'Sfr_PanelLayoutFormContainer',
                    items: [{
                        xtype: 'form',
                        id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData',
                        fileUpload: true,
                        buttonAlign: 'center',
                        
                        items: [{
                            layout: 'column',
                            border: false,
                            items: [{
                                columnWidth: 0.3,
                                layout: 'form',
                                style: 'padding:10px 0px 10px 5px;',
                                items: [{
                                    xtype: 'textfield',
                                    inputType: 'hidden',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceID',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceID'
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceNumber',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceNumber',
                                    fieldLabel: 'Invoice Number',
                                    allowBlank: false,
                                    baseCls: 'Sfr_FormInputMandatory',
                                }, {
                                    xtype: 'combobox',
									id:'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoicePeriodMonth',
									name:'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoicePeriodMonth',
									labelAlign:'top',
									fieldLabel:'Invoice Period Month',
									allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory',
                                    store:thisObj.combo_month,
                                    queryMode:'local',
                                    displayField:'label',
                                    valueField:'id',
                                }, {
                                    xtype: 'combobox',
									id:'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoicePeriodYear',
									name:'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoicePeriodYear',
									labelAlign:'top',
									fieldLabel:'Invoice Period Year',
									allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory',
                                    store:thisObj.combo_year,
                                    queryMode:'local',
                                    displayField:'label',
                                    valueField:'id',
                                }, {
                                    xtype: 'combobox',
									id:'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-CustomerID',
									name:'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-CustomerID',
									store:thisObj.combo_company,
									labelAlign:'top',
									fieldLabel:'Customer',
									queryMode:'local',
									displayField:'label',
									valueField:'id',
									allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory',
									listeners:{
										change : function(o,val,a){
											thisObj.combo_contract_number.storeVar.CustomerID = val;
											thisObj.combo_contract_number.load();
										}
									}
                                }, {
                                    xtype: 'combobox',
									id:'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-ContractNumber',
									name:'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-ContractNumber',
									store:thisObj.combo_contract_number,
									labelAlign:'top',
									fieldLabel:'Contract Number',
									queryMode:'local',
									displayField:'label',
									valueField:'id',
									allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory'
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-people_name',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-people_name',
                                    fieldLabel: 'Invoice PJ',
                                    readOnly: true
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-TaxNumber',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-TaxNumber',
                                    fieldLabel: 'Tax Number',
                                }, {
                                    xtype: 'textareafield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-Description',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-Description',
                                    fieldLabel: 'Description',
                                    allowBlank: false,
                                }]
                            }, {
                                columnWidth: 0.3,
                                layout: 'form',
                                style: 'padding:10px 5px 10px 20px;',
                                defaults: {
                                    labelAlign: 'left',
                                    labelWidth: 150
                                },
                                items: [{
                                    xtype: 'numericfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceAmount',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceAmount',
                                    fieldLabel: 'Amount',
                                    allowBlank: false,
                                    baseCls: 'Sfr_FormInputMandatory',
                                    listeners: {
										change:function(o,val,a){
                                            var VATPercent = Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-VATPercent').getValue();

											var vatamount = (val*VATPercent)/100;
											var total1 = (val+vatamount);

                                            var pph23 = Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-PPH23Option').getValue();

											var pph23Value = (val*pph23)/100;

											Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-PPH23Value').setValue(pph23Value);

											Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceVAT').setValue(vatamount);
											Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceTotal').setValue(total1);

											thisObj.CalcluateGrossNetIncome();
										}
									}
                                }, {
                                    xtype: 'numericfield',
									labelAlign:'top',
									id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-VATPercent',
									name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-VATPercent',
									fieldLabel: 'VAT %',
									value:11,
                                    listeners: {
										change:function(o,val,a){
                                            var amount = Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceAmount').getValue();

											var vatamount = (val*amount)/100;
                                            var total1 = (amount+vatamount);

											Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceVAT').setValue(vatamount);
											Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceTotal').setValue(total1);

											thisObj.CalcluateGrossNetIncome();
										}
									}
                                }, {
                                    xtype: 'numericfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceVAT',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceVAT',
                                    fieldLabel: 'VAT Amount',
                                    readOnly: true,
                                }, {
                                    xtype: 'numericfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceTotal',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceTotal',
                                    fieldLabel: 'Total',
                                    readOnly: true,
                                }, {
                                    xtype: 'datefield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceGR',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceGR',
                                    fieldLabel: 'Invoice GR Date',
                                    format: 'Y-m-d'
                                }, {
                                    xtype: 'datefield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceReceived',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceReceived',
                                    fieldLabel: 'Invoice Received Date',
                                    format: 'Y-m-d'
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-VendorInvoiceNumber',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-VendorInvoiceNumber',
                                    fieldLabel: 'Vendor Invoice Number',
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-VendorTaxNumber',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-VendorTaxNumber',
                                    fieldLabel: 'Vendor Tax Number',
                                }]
                            }, {
                                columnWidth: 0.3,
                                layout: 'form',
                                style: 'padding:10px 5px 10px 20px;',
                                defaults: {
                                    labelAlign: 'left',
                                    labelWidth: 150
                                },
                                items: [{
                                    xtype: 'radiogroup',
                                    labelAlign:'top',
                                    fieldLabel: 'Due Date Period',
                                    msgTarget: 'side',
                                    columns: 2,
                                    items: [{
                                        boxLabel: '30 Days',
                                        name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-DueDatePeriod',
                                        inputValue: '30',
                                        id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-DueDatePeriod30',
                                        listeners: {
                                            change: function () {
                                                if (this.checked == true) {
                                                    var amount = Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceAmount').getValue();
                                                    var invoiceTotal = Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceTotal').getValue();
                                                    var pph23Value = Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-PPH23Value').getValue();
                                                    var receivedDate = Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceReceived').getValue();
													
													if(receivedDate == null){
														Swal.fire({
															icon: 'warning',
															text: 'Please Select Received Date',
															// footer: '<a href="">Why do I have this issue?</a>'
														})
														Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-DueDatePeriod30').setValue(false);
														return false
													}

                                                    var dueDate = new Date(receivedDate.getTime()+(30*24*60*60*1000));
                                                    var grossIncome = (invoiceTotal-pph23Value);
                                                    var nettIncome = (amount-pph23Value);

                                                    Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-GrossIncome').setValue(grossIncome);
                                                    Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-NettIncome').setValue(nettIncome);
                                                    Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-DueDate').setValue(dueDate);
                                                }
                                            }
                                        }
                                    }, {
                                        boxLabel: '45 Days',
                                        name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-DueDatePeriod',
                                        inputValue: '45',
                                        id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-DuteDatePeriod45',
                                        listeners: {
                                            change: function () {
                                                if (this.checked == true) {

                                                    var receivedDate = Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceReceived').getValue();
													
													if(receivedDate == null){
														Swal.fire({
															icon: 'warning',
															text: 'Please Select Received Date',
														})
														Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-DuteDatePeriod45').setValue(false);
														return false
													}

                                                    var dueDate = new Date(receivedDate.getTime()+(45*24*60*60*1000));
                                                    Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-DueDate').setValue(dueDate);
                                                }
                                            }
                                        }
                                    }]
                                }, {
                                    xtype: 'datefield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-DueDate',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-DueDate',
                                    fieldLabel: 'Due Date',
                                    readOnly: true,
                                    format: 'Y-m-d'
                                }, {
                                    xtype: 'datefield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-Paid',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-Paid',
                                    fieldLabel: 'Paid',
                                    format: 'Y-m-d'
                                }, {
                                    xtype: 'numericfield',
									labelAlign:'top',
									id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-PPH23Option',
									name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-PPH23Option',
									fieldLabel: 'PPH23 %',
									value:2,
									listeners: {
										change:function(o,val,a){
											var amount = Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceAmount').getValue();

											var pph23 = (amount*val)/100;

											Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-PPH23Value').setValue(pph23);
											thisObj.CalcluateGrossNetIncome();
										}
									}
                                }, {
                                    xtype: 'numericfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-PPH23Value',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-PPH23Value',
                                    readOnly: true,
                                    fieldLabel: 'PPH 23 Value',
									listeners:{
										change:function(){
											thisObj.CalcluateGrossNetIncome();
										}
									}
                                }, {
                                    xtype: 'numericfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-GrossIncome',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-GrossIncome',
                                    readOnly: true,
                                    fieldLabel: 'Gross Income',
                                }, {
                                    xtype: 'numericfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-NettIncome',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-NettIncome',
                                    fieldLabel: 'Nett Income',
                                    readOnly: true,
                                }]
                            }]
                        }],
                        buttons: [{
                            xtype: 'button',
                            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/floppy-disk.svg',
                            text: 'Save',
                            cls: 'Sfr_BtnFormBlue',
                            overCls: 'Sfr_BtnFormBlue-Hover',
                            id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-BtnSave',
                            handler: function () {
                                var Formnya = Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData').getForm();

                                if (Formnya.isValid()) {
                                    Formnya.submit({
                                        url: m_api + '/v1/finance/invoice/submit_invoice',
                                        method: 'POST',
                                        waitMsg: 'Saving data invoice...',
                                        params: {
                                            OpsiDisplay: thisObj.viewVar.OpsiDisplay
                                        },
                                        success: function (fp, o) {
											Swal.fire({
												text: "Data saved",
												icon: 'success',
												confirmButtonColor: '#3085d6',
											}).then((result) => {
												if (result.isConfirmed) {
													Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm').destroy(); //destory current view
													var MainForm = [];
													if (Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm') == undefined) {
														MainForm = Ext.create('MitraJaya.view.Finance.Invoice.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																InvoiceID: o.result.InvoiceID
															}
														});
													} else {
														Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm').destroy();
														MainForm = Ext.create('MitraJaya.view.Finance.Invoice.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																InvoiceID: o.result.InvoiceID
															}
														});
													}
												}
											})
                                        },
                                        failure: function (fp, o) {
                                            try {
                                                var r = Ext.decode(o.response.responseText);
                                                Swal.fire({
													icon: 'error',
													text: r.message,
												})
                                            } catch (err) {

                                                Swal.fire({
													icon: 'error',
													text: 'Connection Error',
												})
                                            }
                                        }
                                    });
                                } else {
                                    Swal.fire({
										icon: 'warning',
										text: 'Form not complete yet',
									})
                                }
                            }
                        }]
                    }],
                }]
            }]
        });
        //Panel Basic ==================================== (End)

        //============================= End DQ =========================================//

        //========================================================== LAYOUT UTAMA (Begin) ========================================//
        thisObj.items = [{
            xtype: 'panel',
            border: false,
            layout: {
                type: 'hbox'
            },
            items: [{
                id: 'MitraJaya.view.Finance.Invoice.MainForm-labelInfoInsert',
                html: '<div id="header_title_farmer">' + 'Invoice Data' + '</div>'
            }]
        }, {
            items: [{
                id: 'MitraJaya.view.Finance.Invoice.MainForm-LinkBackToList',
                html: '<div id="Sfr_IdBoxInfoDataGrid" class="Sfr_BoxInfoDataGridForm"><ul class="Sft_UlListInfoDataGrid">'
				+'<li class="Sft_ListInfoDataGrid"><a href="javascript:Ext.getCmp(\'MitraJaya.view.Finance.Invoice.MainForm\').BackToList()">'
				+'<img class="Sft_ListIconInfoDataGrid" src="' + varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/circle-chevron-left.svg" width="20" />&nbsp;&nbsp;' + 'Back to Invoice List' + '</a></li></div>'
            }]
        }, {
            html: '<br />'
        }, {
            layout: 'column',
            border: false,
            items: [{
                //LEFT CONTENT
                columnWidth: 1,
                items: [
                    thisObj.ObjPanelBasicData
                ]
            }]
        }];
        //========================================================== LAYOUT UTAMA (END) ========================================//

        this.callParent(arguments);
    },
	CalcluateGrossNetIncome: function(){
		var amount = Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceAmount').getValue();
		var invoiceTotal = Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceTotal').getValue();
		var pph23Value = Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-PPH23Value').getValue();
		var grossIncome = (invoiceTotal-pph23Value);
		var nettIncome = (amount-pph23Value);

		Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-GrossIncome').setValue(grossIncome);
		Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-NettIncome').setValue(nettIncome);
	},
    BackToList: function () {
        Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm').destroy(); //destory current view
        var GridMainGrower = [];
        if (Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid') == undefined) {
            GridMainGrower = Ext.create('MitraJaya.view.Finance.Invoice.MainGrid');
        } else {
            //destroy, create ulang
            Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid').destroy();
            GridMainGrower = Ext.create('MitraJaya.view.Finance.Invoice.MainGrid');
        }
    }
});
