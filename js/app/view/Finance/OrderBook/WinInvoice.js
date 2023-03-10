/******************************************
 *  Author : n1colius.lau@gmail.com   
 *  Created On : Wed Jan 22 2020
 *  File : WinFormFamily.js
 *******************************************/

/*
    Param2 yg diperlukan ketika load View ini
    - OpsiDisplay
    - SupplierID
    - SupFamID
    - CallerStore
*/

Ext.define('MitraJaya.view.Finance.OrderBook.WinInvoice' ,{
    extend: 'Ext.window.Window',
    id: 'MitraJaya.view.Finance.OrderBook.WinInvoice',
    cls: 'Sfr_LayoutPopupWindows',
    title: lang('Invoice Details'),
    closable: true,
    modal: true,
    closeAction: 'destroy',
    width: '80%',
    height: 700,
    overflowY: 'auto',
    viewVar: false,
    setViewVar: function(value){
        this.viewVar = value;
    },
    initComponent: function() {
        var thisObj = this;
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

        //items -------------------------------------------------------------- (begin)
        thisObj.items = Ext.create('Ext.panel.Panel', {
            frame: false,
            items: [{
                layout: 'column',
                border: false,
                padding: 10,
                items: [{
                    columnWidth: 1,
                    layout: 'form',
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
                                    fieldLabel: lang('Invoice Number'),
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
                                    fieldLabel: lang('Invoice PJ'),
                                    readOnly: true
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-TaxNumber',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-TaxNumber',
                                    fieldLabel: lang('Tax Number'),
                                }, {
                                    xtype: 'textareafield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-Description',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-Description',
                                    fieldLabel: lang('Description'),
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
                                    xtype: 'numberfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceAmount',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceAmount',
                                    fieldLabel: lang('Amount'),
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
										}
									}
                                }, {
                                    xtype: 'numberfield',
									labelAlign:'top',
									id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-VATPercent',
									name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-VATPercent',
									fieldLabel: lang('VAT %'),
									value:11,
                                    listeners: {
										change:function(o,val,a){
                                            var amount = Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceAmount').getValue();

											var vatamount = (val*amount)/100;
                                            var total1 = (amount+vatamount);

											Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceVAT').setValue(vatamount);
											Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceTotal').setValue(total1);
										}
									}
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceVAT',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceVAT',
                                    fieldLabel: lang('VAT Amount'),
                                    readOnly: true,
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceTotal',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceTotal',
                                    fieldLabel: lang('Total'),
                                    readOnly: true,
                                }, {
                                    xtype: 'datefield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceGR',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceGR',
                                    fieldLabel: lang('Invoice GR Date'),
                                    format: 'Y-m-d'
                                }, {
                                    xtype: 'datefield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceReceived',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceReceived',
                                    fieldLabel: lang('Invoice Received Date'),
                                    format: 'Y-m-d'
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
                                    fieldLabel: lang('Due Date Period'),
                                    msgTarget: 'side',
                                    columns: 2,
                                    items: [{
                                        boxLabel: lang('30 Days'),
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
                                        boxLabel: lang('45 Days'),
                                        name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-DueDatePeriod',
                                        inputValue: '45',
                                        id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-DuteDatePeriod45',
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
														})
														Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-DuteDatePeriod45').setValue(false);
														return false
													}

                                                    var dueDate = new Date(receivedDate.getTime()+(45*24*60*60*1000));
                                                    var grossIncome = (invoiceTotal-pph23Value);
                                                    var nettIncome = (amount-pph23Value);

                                                    Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-GrossIncome').setValue(grossIncome);
                                                    Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-NettIncome').setValue(nettIncome);
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
                                    fieldLabel: lang('Due Date'),
                                    readOnly: true,
                                    format: 'Y-m-d'
                                }, {
                                    xtype: 'datefield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-Paid',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-Paid',
                                    fieldLabel: lang('Paid'),
                                    format: 'Y-m-d'
                                }, {
                                    xtype: 'numberfield',
									labelAlign:'top',
									id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-PPH23Option',
									name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-PPH23Option',
									fieldLabel: lang('PPH23 %'),
									value:2,
									listeners: {
										change:function(o,val,a){
											var amount = Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-InvoiceAmount').getValue();

											var pph23 = (amount*val)/100;

											Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-PPH23Value').setValue(pph23);
										}
									}
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-PPH23Value',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-PPH23Value',
                                    readOnly: true,
                                    fieldLabel: lang('PPH 23 Value'),
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-GrossIncome',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-GrossIncome',
                                    readOnly: true,
                                    fieldLabel: lang('Gross Income'),
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-NettIncome',
                                    name: 'MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-NettIncome',
                                    fieldLabel: lang('Nett Income'),
                                    readOnly: true,
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        });
        //items -------------------------------------------------------------- (end)

        //buttons -------------------------------------------------------------- (begin)
        thisObj.buttons = [{
            icon: varjs.config.base_url + 'images/icons/new/close.png',
            text: lang('Close'),
            cls:'Sfr_BtnFormGrey',
            overCls:'Sfr_BtnFormGrey-Hover',
            handler: function() {
                thisObj.close();
            }
        }];
        //buttons -------------------------------------------------------------- (end)

        this.callParent(arguments);
    },
    listeners: {
        afterRender: function(){
            var thisObj = this;
            markers = []
            // Map Initialize

            // Conditionanl Add Newa or view/update
                if(thisObj.viewVar.OpsiDisplay == 'view') {

                    //load data form
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
                } else {
                    Ext.getCmp('MitraJaya.view.Finance.OrderBook.WinInvoice').addMarkerListener()

                    // Ext.getCmp('fieldDairy').setVisible(false);
                    // Ext.getCmp('fieldNonDairy').setVisible(false);
                }
        }
    },
    AddValidationBasicForm: function(){
        var thisObj = this;
        var ArrMsg = [];
        thisObj.AddValidation = true;
        //thisObj.MsgAddValidation = "Cihuy";

        //Cek Umur ================================================== (Begin)
        if(Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-FamRelation').getValue() == '1'){
            var YearBirth = parseInt(Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-BirthYear').getValue());
            var today = new Date();
            var age = today.getFullYear() - YearBirth;            
            if(age <= 16){
                thisObj.AddValidation = false;
                ArrMsg.push("Minimal Age is 16 years old");
            }
        }
        //Cek Umur ================================================== (End)


        if(thisObj.AddValidation == false){
            var HtmlMsg = '<ul>';
            for (var index = 0; index < ArrMsg.length; index++) {
                HtmlMsg += '<li>'+ArrMsg[index]+'</li>'
            }
            HtmlMsg+='</ul>';
            thisObj.MsgAddValidation = HtmlMsg;
        }
    }
});
