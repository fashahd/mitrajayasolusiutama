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

Ext.define('MitraJaya.view.Admin.Customer.MainForm', {
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Admin.Customer.MainForm',
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
                    Ext.getCmp('MitraJaya.view.Admin.Customer.MainForm-FormBasicData-BtnSave').setVisible(false);
                }

                //load formnya
                Ext.getCmp('MitraJaya.view.Admin.Customer.MainForm-FormBasicData').getForm().load({
                    url: m_api + '/v1/admin/customer/form_customer',
                    method: 'GET',
                    params: {
                        CustomerID: this.viewVar.CustomerID
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
                        id: 'MitraJaya.view.Admin.Customer.MainForm-FormBasicData',
                        fileUpload: true,
                        buttonAlign: 'center',
                        
                        items: [{
                            layout: 'column',
                            border: false,
                            items: [{
                                columnWidth: 1,
                                layout: 'form',
                                style: 'padding:10px 0px 10px 5px;',
                                items: [{
                                    xtype: 'textfield',
                                    inputType: 'hidden',
                                    id: 'MitraJaya.view.Admin.Customer.MainForm-FormBasicData-CustomerID',
                                    name: 'MitraJaya.view.Admin.Customer.MainForm-FormBasicData-CustomerID'
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Admin.Customer.MainForm-FormBasicData-CustomerName',
                                    name: 'MitraJaya.view.Admin.Customer.MainForm-FormBasicData-CustomerName',
                                    fieldLabel: 'Customer Name',
                                    allowBlank: false,
                                    baseCls: 'Sfr_FormInputMandatory',
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Admin.Customer.MainForm-FormBasicData-PhoneNumber',
                                    name: 'MitraJaya.view.Admin.Customer.MainForm-FormBasicData-PhoneNumber',
                                    fieldLabel: 'Phone Number'
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
									vtype: 'email',
                                    id: 'MitraJaya.view.Admin.Customer.MainForm-FormBasicData-Email',
                                    name: 'MitraJaya.view.Admin.Customer.MainForm-FormBasicData-Email',
                                    fieldLabel: 'Email',
                                }, {
                                    xtype: 'textareafield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Admin.Customer.MainForm-FormBasicData-CustomerAddress',
                                    name: 'MitraJaya.view.Admin.Customer.MainForm-FormBasicData-CustomerAddress',
                                    fieldLabel: 'Address'
                                }]
                            }]
                        }],
                        buttons: [{
                            xtype: 'button',
                            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/floppy-disk.svg',
                            text: 'Save',
                            cls: 'Sfr_BtnFormBlue',
                            overCls: 'Sfr_BtnFormBlue-Hover',
                            id: 'MitraJaya.view.Admin.Customer.MainForm-FormBasicData-BtnSave',
                            handler: function () {
                                var Formnya = Ext.getCmp('MitraJaya.view.Admin.Customer.MainForm-FormBasicData').getForm();

                                if (Formnya.isValid()) {
                                    Formnya.submit({
                                        url: m_api + '/v1/admin/customer/submit',
                                        method: 'POST',
                                        waitMsg: 'Saving data customer...',
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
													Ext.getCmp('MitraJaya.view.Admin.Customer.MainForm').destroy(); //destory current view
													var MainForm = [];
													if (Ext.getCmp('MitraJaya.view.Admin.Customer.MainForm') == undefined) {
														MainForm = Ext.create('MitraJaya.view.Admin.Customer.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																CustomerID: o.result.CustomerID
															}
														});
													} else {
														Ext.getCmp('MitraJaya.view.Admin.Customer.MainForm').destroy();
														MainForm = Ext.create('MitraJaya.view.Admin.Customer.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																CustomerID: o.result.CustomerID
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
                id: 'MitraJaya.view.Admin.Customer.MainForm-labelInfoInsert',
                html: '<div id="header_title_farmer">' + 'Invoice Data' + '</div>'
            }]
        }, {
            items: [{
                id: 'MitraJaya.view.Admin.Customer.MainForm-LinkBackToList',
                html: '<div id="Sfr_IdBoxInfoDataGrid" class="Sfr_BoxInfoDataGridForm"><ul class="Sft_UlListInfoDataGrid">'
				+'<li class="Sft_ListInfoDataGrid"><a href="javascript:Ext.getCmp(\'MitraJaya.view.Admin.Customer.MainForm\').BackToList()">'
				+'<img class="Sft_ListIconInfoDataGrid" src="' + varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/circle-chevron-left.svg" width="20" />&nbsp;&nbsp;' + 'Back to Customer List' + '</a></li></div>'
            }]
        }, {
            html: '<br />'
        }, {
            layout: 'column',
            border: false,
            items: [{
                //LEFT CONTENT
                columnWidth: 0.5,
                items: [
                    thisObj.ObjPanelBasicData
                ]
            }]
        }];
        //========================================================== LAYOUT UTAMA (END) ========================================//

        this.callParent(arguments);
    },
    BackToList: function () {
        Ext.getCmp('MitraJaya.view.Admin.Customer.MainForm').destroy(); //destory current view
        var GridMainGrower = [];
        if (Ext.getCmp('MitraJaya.view.Admin.Customer.MainGrid') == undefined) {
            GridMainGrower = Ext.create('MitraJaya.view.Admin.Customer.MainGrid');
        } else {
            //destroy, create ulang
            Ext.getCmp('MitraJaya.view.Admin.Customer.MainGrid').destroy();
            GridMainGrower = Ext.create('MitraJaya.view.Admin.Customer.MainGrid');
        }
    }
});
