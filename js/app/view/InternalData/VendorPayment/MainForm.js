/******************************************
 *  Author : fashahd@gmail.com.com
 *  Created On : Mon Jan 20 2020
 *  File : MainForm.js
 *******************************************/
/*
    Param2 yg diperlukan ketika load View ini
    - OpsiDisplay
    - OrderBookID
    - PanelDisplayID
*/

Ext.define('MitraJaya.view.InternalData.VendorPayment.MainForm', {
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.InternalData.VendorPayment.MainForm',
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
                    Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-BtnSave').setVisible(false);
                }

                //load formnya
                Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData').getForm().load({
                    url: m_api + '/v1/internaldata/vendorpayment/form_payment',
                    method: 'GET',
                    params: {
                        PaymentID: this.viewVar.PaymentID
                    },
                    success: function (form, action) {
                        var r = Ext.decode(action.response.responseText);
                        //Title
                        Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm-labelInfoInsert').doLayout();
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
				let timerInterval
				Swal.fire({
					title: 'Loading',
					html: 'Please wait...',
					timer: 1000,
					timerProgressBar: true,
					didOpen: () => {
						Swal.showLoading()
						const b = Swal.getHtmlContainer().querySelector('b')
						timerInterval = setInterval(() => {
						b.textContent = Swal.getTimerLeft()
						}, 100)
					},
					willClose: () => {
						clearInterval(timerInterval)
					}
				}).then((result) => {
					/* Read more about handling dismissals below */
					if (result.dismiss === Swal.DismissReason.timer) {
						console.log('I was closed by the timer')
					}
				})
            }
        }
    },
    initComponent: function () {
        var thisObj = this;

		thisObj.combo_month = Ext.create('MitraJaya.store.General.StoreMonth');

		thisObj.combo_year = Ext.create('MitraJaya.store.General.StoreYear',{
        	storeVar: {
                yearRange: 20
            }
        });

		thisObj.combo_company = Ext.create('MitraJaya.store.General.CompanyList',{
        	storeVar: {
                CustomerID: ''
            }
        });

		thisObj.combo_employee_project 	= Ext.create('MitraJaya.store.General.EmployeeList');
		thisObj.combo_vendor_list 		= Ext.create('MitraJaya.store.General.VendorList');
		thisObj.combo_subcont_list 		= Ext.create('MitraJaya.store.General.SubContList');
		thisObj.combo_project 			= Ext.create('MitraJaya.store.General.ProjectList');
		thisObj.combo_department		= Ext.create('MitraJaya.store.General.DepartmentList');

        //Panel Basic ==================================== (Begin)
        thisObj.ObjPanelBasicData = Ext.create('Ext.panel.Panel', {
            title: lang('Loan Data'),
            frame: true,
            cls: 'Sfr_PanelLayoutForm',
            id: 'MitraJaya.view.InternalData.VendorPayment-FormGeneralData',
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
						id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData',
						fileUpload: true,
						buttonAlign: 'center',
						items: [{
							layout: 'column',
							border: false,
							items: [{
								columnWidth: 0.5,
								layout: 'form',
								style: 'padding:10px 0px 10px 5px;',
								items: [{
									xtype: 'panel',
									title: lang('General Data'),
									frame: false,
									id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-SectionGeneral',
									style: 'margin-top:5px;',
									cls: 'Sfr_PanelSubLayoutFormRoundedGray',
									items: [{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 1,
											layout: 'form',
											// style: 'padding:10px 10px 10px 0px;',
											items: [{
												xtype: 'textfield',
												inputType: 'hidden',
												id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-PaymentID',
												name: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-PaymentID'
											}, {
												xtype: 'textfield',
												labelAlign:'top',
												fieldLabel: lang('Document Number'),
												allowBlank: false,
												baseCls: 'Sfr_FormInputMandatory',
												id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-DocumentNo',
												name: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-DocumentNo'		
											},{
												xtype: 'radiogroup',
												fieldLabel: lang('Type'),
												msgTarget: 'side',
												labelWidth:180,
												allowBlank:false,
												labelAlign:'top',
												baseCls: 'Sfr_FormInputMandatory',
												columns: 3,
												items: [{
													boxLabel: lang('Vendor'),
													name: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-Type',
													inputValue: 'vendor',
													id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-TypeVendor',
													listeners: {
														change: function () {
															if(this.checked == true){
																Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-MitraNameVendor').setVisible(true);
																Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-MitraNameSubcont').setVisible(false);
															}
															return false;
														}
													}
												}, {
													boxLabel: lang('Subcont'),
													name: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-Type',
													inputValue: 'subcont',
													id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-TypeSubcont',
													listeners: {
														change: function () {
															if(this.checked == true){
																Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-MitraNameSubcont').setVisible(true);
																Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-MitraNameVendor').setVisible(false);
															}
															return false;
														}
													}
												}]
											}, {
												xtype: 'combobox',
												id:'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-MitraNameSubcont',
												name:'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-MitraNameSubcont',
												store:thisObj.combo_subcont_list,
												labelAlign:'top',
												fieldLabel:'Subcont Name',
												queryMode:'local',
												displayField:'label',
												valueField:'id',
												hidden:true,
												baseCls: 'Sfr_FormInputMandatory'								
											}, {
												xtype: 'combobox',
												id:'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-MitraNameVendor',
												name:'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-MitraNameVendor',
												store:thisObj.combo_vendor_list,
												labelAlign:'top',
												fieldLabel:'Vendor Name',
												queryMode:'local',
												displayField:'label',
												valueField:'id',
												hidden:true,
												baseCls: 'Sfr_FormInputMandatory'								
											}, {
												xtype: 'combobox',
												id:'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-ProjectID',
												name:'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-ProjectID',
												store:thisObj.combo_project,
												labelAlign:'top',
												fieldLabel:'PO Number',
												queryMode:'local',
												displayField:'label',
												valueField:'id'
											}, {
												xtype: 'datefield',
												labelAlign:'top',
												editable:false,
												id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-InvoiceComplete',
												name: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-InvoiceComplete',
												fieldLabel: lang('Invoice Date'),
												format: 'Y-m-d'
											},  {
												xtype: 'datefield',
												labelAlign:'top',
												editable:false,
												id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-DueDate',
												name: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-DueDate',
												fieldLabel: lang('Due Date'),
												format: 'Y-m-d'
											},{
												xtype: 'numericfield',
												labelAlign:'top',
												id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-Amount',
												name: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-Amount',
												fieldLabel: lang('Amount'),
												allowBlank:false,
												baseCls: 'Sfr_FormInputMandatory',
												listeners: {
													change:function(o,val,a){
														thisObj.CalCulateOutstanding();
													}
												}
											},  {
												xtype: 'textareafield',
												labelAlign:'top',
												id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-Description',
												name: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-Description',
												fieldLabel: lang('Description')									
											}]
										}]
									}]
								},{
									xtype: 'panel',
									title: lang('Insurance & PPH'),
									frame: false,
									id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-SectionInsurance',
									style: 'margin-top:5px;',
									cls: 'Sfr_PanelSubLayoutFormRoundedGray',
									items: [{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 1,
											layout: 'form',
											// style: 'padding:10px 10px 10px 0px;',
											items: [{
												xtype: 'numericfield',
												labelAlign:'top',
												id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-Insurance',
												name: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-Insurance',
												fieldLabel: lang('Insurance'),
												readOnly: true
											}, {
												xtype: 'numberfield',
												labelAlign:'top',
												id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-PPH23Option',
												name: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-PPH23Option',
												fieldLabel: lang('PPH %'),
												value:4,
												listeners: {
													change:function(o,val,a){
														thisObj.CalCulateOutstanding();
													}
												}
											}, {
												xtype: 'numericfield',
												labelAlign:'top',
												id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-PPHValue',
												name: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-PPHValue',
												readOnly: true,
												fieldLabel: lang('PPH Value')
											}]
										}]
									}]
								}]
							}, {
								columnWidth: 0.495,
								layout: 'form',
								style: 'padding:10px 5px 10px 20px;',
								defaults: {
									labelAlign: 'left',
									labelWidth: 150
								},
								items: [{
									xtype: 'panel',
									title: lang('Cashbon'),
									frame: false,
									id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-SectionGeneralData',
									style: 'margin-top:5px;',
									cls: 'Sfr_PanelSubLayoutFormRoundedGray',
									items: [{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 1,
											layout: 'form',
											// style: 'padding:10px 10px 10px 0px;',
											id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-Left',
											items: [{
												xtype: 'textfield',
												labelAlign:'top',
												id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-CashbonDocumentNumber',
												name: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-CashbonDocumentNumber',
												fieldLabel: lang('Document Number')
											},{
												xtype: 'numericfield',
												labelAlign:'top',
												id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-CashbonAmount',
												name: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-CashbonAmount',
												fieldLabel: lang('Cashbon Amount'),
												listeners: {
													change:function(o,val,a){
														thisObj.CalCulateOutstanding();
													}
												}
											}]
										}]
									}]
								}, {
									xtype: 'panel',
									title: lang('SIO K3'),
									frame: false,
									id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-SectionK3',
									style: 'margin-top:5px;',
									cls: 'Sfr_PanelSubLayoutFormRoundedGray',
									items: [{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 1,
											layout: 'form',
											items: [{
												xtype: 'textfield',
												labelAlign:'top',
												id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-SIOK3Name',
												name: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-SIOK3Name',
												fieldLabel: lang('SIO K3 Name')
											}, {
												xtype: 'numericfield',
												labelAlign:'top',
												id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-SIOK3Amount',
												name: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-SIOK3Amount',
												fieldLabel: lang('SIO K3 Amount'),
												listeners: {
													change:function(o,val,a){
														thisObj.CalCulateOutstanding();
													}
												}
											}]
										}]
									}]
								}, {
									xtype: 'panel',
									title: lang('Outstanding'),
									frame: false,
									id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-SectionOutstanding',
									style: 'margin-top:5px;',
									cls: 'Sfr_PanelSubLayoutFormRoundedGray',
									items: [{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 1,
											layout: 'form',
											items: [{
												xtype: 'numericfield',
												labelAlign:'top',
												id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-Outstanding',
												name: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-Outstanding',
												readOnly: true,
												fieldLabel: lang('Outstanding')
											}]
										}]
									}]
								}, {
									xtype: 'panel',
									title: lang('Paid Status'),
									frame: false,
									id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-SectionPaid',
									style: 'margin-top:5px;',
									cls: 'Sfr_PanelSubLayoutFormRoundedGray',
									items: [{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 1,
											layout: 'form',
											items: [{
												xtype: 'datefield',
												labelAlign:'top',
												format:"Y-m-d",
												id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-PaidDate',
												name: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-PaidDate',
												fieldLabel: lang('Paid Date')
											},{
												xtype: 'numericfield',
												labelAlign:'top',
												id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-PaidAmount',
												name: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-PaidAmount',
												fieldLabel: lang('Paid Amount')
											}]
										}]
									}]
								}]
							}]
						}],
						buttons: [{
							xtype: 'button',
							icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/floppy-disk.svg',
							text: lang('Save'),
							cls: 'Sfr_BtnFormBlue',
							overCls: 'Sfr_BtnFormBlue-Hover',
							id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-BtnSave',
							handler: function () {
								var Formnya = Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData').getForm();

								if (Formnya.isValid()) {

									Formnya.submit({
										url: m_api + '/v1/internaldata/vendorpayment/submit_payment',
										method: 'POST',
										waitMsg: 'Saving data...',
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
													Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm').destroy(); //destory current view
													var MainForm = [];
													if (Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm') == undefined) {
														MainForm = Ext.create('MitraJaya.view.InternalData.VendorPayment.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																PaymentID: o.result.PaymentID
															}
														});
													} else {
														Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm').destroy();
														MainForm = Ext.create('MitraJaya.view.InternalData.VendorPayment.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																PaymentID: o.result.PaymentID
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
													text: r.message
												})
											} catch (err) {
												Swal.fire({
													icon: 'error',
													text: 'Connection Error'
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
					}]
                }]
            }]
        });
        //Panel Basic ==================================== (End)

		// var ObjPanelGridVendorPayment = [];

        // if (thisObj.viewVar.OpsiDisplay == 'view' || thisObj.viewVar.OpsiDisplay == 'update') {
        //     thisObj.ObjPanelPaymentLoan = Ext.create('MitraJaya.view.InternalData.VendorPayment.GridVendorPayment', {
        //         viewVar: {
        //             PaymentID: thisObj.viewVar.PaymentID
        //         }
        //     });
        //     ObjPanelGridVendorPayment.push(thisObj.ObjPanelPaymentLoan);
        // }

        //============================= End DQ =========================================//
        //========================================================== LAYOUT UTAMA (Begin) ========================================//
        thisObj.items = [{
            xtype: 'panel',
            border: false,
            layout: {
                type: 'hbox'
            },
            items: [{
                id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-labelInfoInsert',
                html: '<div id="header_title_farmer">' + lang('Payment Data') + '</div>'
            }]
        }, {
            items: [{
                id: 'MitraJaya.view.InternalData.VendorPayment.MainForm-LinkBackToList',
                html: '<div id="Sfr_IdBoxInfoDataGrid" class="Sfr_BoxInfoDataGridForm"><ul class="Sft_UlListInfoDataGrid">'
				+'<li class="Sft_ListInfoDataGrid"><a href="javascript:Ext.getCmp(\'MitraJaya.view.InternalData.VendorPayment.MainForm\').BackToList()">'
				+'<img class="Sft_ListIconInfoDataGrid" src="' + varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/circle-chevron-left.svg" width="20" />&nbsp;&nbsp;' + lang('Back to Vendor Payment List') + '</a></li></div>'
            }]
        }, {
            html: '<br />'
        }, {
            layout: 'column',
            border: false,
            items: [{
                //LEFT CONTENT
                columnWidth: 0.6,
                items: [
                    thisObj.ObjPanelBasicData
                ]
            }]
        }];
        //========================================================== LAYOUT UTAMA (END) ========================================//

        this.callParent(arguments);
    },
	CalCulateOutstanding:function(){
		let Amount 		= Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-Amount').getValue();
		let Cashbon 	= Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-CashbonAmount').getValue();
		let SIOK3Amount = Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-SIOK3Amount').getValue();
		let pphOption 	= Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-PPH23Option').getValue();
		
		let Insurance 	= (Amount*3)/100;
		let PPHValue 	= (pphOption*Amount)/100;
		let Outstanding	= Amount - (Insurance+PPHValue+Cashbon+SIOK3Amount);

		Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-PPHValue').setValue(PPHValue);
		Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-Insurance').setValue(Insurance);
		Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-Outstanding').setValue(Outstanding);
	},
    BackToList: function () {
        Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm').destroy(); //destory current view
        var GridMainGrower = [];
        if (Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid') == undefined) {
            GridMainGrower = Ext.create('MitraJaya.view.InternalData.VendorPayment.MainGrid');
        } else {
            //destroy, create ulang
            Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid').destroy();
            GridMainGrower = Ext.create('MitraJaya.view.InternalData.VendorPayment.MainGrid');
        }
    }
});
