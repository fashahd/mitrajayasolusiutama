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

Ext.define('MitraJaya.view.Finance.OrderBook.MainForm', {
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Finance.OrderBook.MainForm',
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
                    Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-BtnSave').setVisible(false);
                    Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-PhotoInput').setVisible(false);
                    Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-IdFileInput').setVisible(false);
                }

                //load formnya
                Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData').getForm().load({
                    url: m_api + '/v1/finance/order/form_order',
                    method: 'GET',
                    params: {
                        OrderBookID: this.viewVar.OrderBookID
                    },
                    success: function (form, action) {
                        Ext.MessageBox.hide();
                        var r = Ext.decode(action.response.responseText);
                        //Title
                        Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm-labelInfoInsert').update('<div id="header_title_farmer">' + Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-SupplierDisplayID').getValue() + ' - <strong>' + Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-SupplierName').getValue() + '</strong></div>');
                        Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm-labelInfoInsert').doLayout();
                    },
                    failure: function (form, action) {
                        Swal.fire({
							icon: 'error',
							text: 'Failed to Retreive Data',
							// footer: '<a href="">Why do I have this issue?</a>'
						})
                    }
                });

            }
        },
        beforerender: function () {
            var thisObj = this;

            if (thisObj.viewVar.OpsiDisplay != 'insert') {
                // Ext.MessageBox.show({
                //     msg: 'Please wait...',
                //     progressText: 'Loading...',
                //     width: 300,
                //     wait: true,
                //     waitConfig: {
                //         interval: 200
                //     },
                //     icon: 'ext-mb-info', //custom class in msg-box.html
                //     animateTarget: 'mb9'
                // });

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
		thisObj.combo_project 			= Ext.create('MitraJaya.store.General.ProjectList');
		thisObj.combo_department		= Ext.create('MitraJaya.store.General.DepartmentList');

        //Panel Basic ==================================== (Begin)
        thisObj.ObjPanelBasicData = Ext.create('Ext.panel.Panel', {
            title: lang('Order Book Data'),
            frame: true,
            cls: 'Sfr_PanelLayoutForm',
            id: 'MitraJaya.view.Finance.OrderBook-FormGeneralData',
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
						id: 'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData',
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
									xtype: 'textfield',
									inputType: 'hidden',
									id: 'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-OrderBookID',
									name: 'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-OrderBookID'
								},{
									xtype: 'textfield',
									labelAlign:'top',
									fieldLabel: lang('PO Number'),
									allowBlank: false,
									baseCls: 'Sfr_FormInputMandatory',
									id: 'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-ContractNumber',
									name: 'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-ContractNumber'
								}, {
									xtype: 'combobox',
									id:'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-CustomerID',
									name:'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-CustomerID',
									store:thisObj.combo_company,
									labelAlign:'top',
									fieldLabel:'Customer',
									queryMode:'local',
									displayField:'label',
									valueField:'id',
									allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory'										
								},{
									xtype: 'datefield',
									id: 'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-ContractDate',
									name: 'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-ContractDate',
									labelAlign:'top',
									fieldLabel: lang('PO Date'),
									format: 'Y-m-d',
									value: new Date(),
									allowBlank: false,
									baseCls: 'Sfr_FormInputMandatory'
								},{
									xtype: 'combobox',
									id:'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-ProjectID',
									name:'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-ProjectID',
									store:thisObj.combo_project,
									labelAlign:'top',
									fieldLabel:'Project',
									queryMode:'local',
									displayField:'label',
									valueField:'id',
									allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory'										
								},{
									xtype: 'combobox',
									id:'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-DeptID',
									name:'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-DeptID',
									store:thisObj.combo_department,
									labelAlign:'top',
									fieldLabel:'Department',
									queryMode:'local',
									displayField:'label',
									valueField:'id'									
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
									xtype: 'combobox',
									id:'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-PeopleID',
									name:'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-PeopleID',
									store:thisObj.combo_employee_project,
									labelAlign:'top',
									fieldLabel:'Employee',
									queryMode:'local',
									displayField:'label',
									valueField:'id',
									allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory'										
								}, {
									xtype: 'numberfield',
									labelAlign:'top',
									id: 'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-ContractAmount',
									name: 'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-ContractAmount',
									fieldLabel: lang('PO (Exc. PPN)'),
									listeners: {
										change:function(o,val,a){
											var ppn = Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-PPN').getValue();

											var ppnamount = (val*ppn)/100;

											Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-ContractAmountPPN').setValue(ppnamount);
											Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-TotalContactAmount').setValue(val+ppnamount);
										}
									}
								}, {
									xtype: 'numberfield',
									labelAlign:'top',
									id: 'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-PPN',
									name: 'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-PPN',
									fieldLabel: lang('PPN %'),
									value:11,
									listeners: {
										change:function(o,val,a){
											var amount = Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-ContractAmount').getValue();

											var ppnamount = (amount*val)/100;

											Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-ContractAmountPPN').setValue(ppnamount);
											Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-TotalContactAmount').setValue(amount+ppnamount);
										}
									}
								}, {
									xtype: 'numberfield',
									labelAlign:'top',
									readOnly:true,
									id: 'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-ContractAmountPPN',
									name: 'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-ContractAmountPPN',
									fieldLabel: lang('PPN'),
								}, {
									xtype: 'numberfield',
									labelAlign:'top',
									readOnly:true,
									id: 'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-TotalContactAmount',
									name: 'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-TotalContactAmount',
									fieldLabel: lang('PO (Inc. PPN)')
								}, {
									xtype: 'textareafield',
									labelAlign:'top',
									id: 'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-Description',
									name: 'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-Description',
									fieldLabel: lang('Description')
								}]
							}]
						}],
						buttons: [{
							xtype: 'button',
							icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/floppy-disk.svg',
							text: lang('Save'),
							cls: 'Sfr_BtnFormBlue',
							overCls: 'Sfr_BtnFormBlue-Hover',
							id: 'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-BtnSave',
							handler: function () {
								var Formnya = Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData').getForm();

								if (Formnya.isValid()) {

									Formnya.submit({
										url: m_api + '/v1/finance/order/submit_order',
										method: 'POST',
										waitMsg: 'Saving data...',
										params: {
											OpsiDisplay: thisObj.viewVar.OpsiDisplay
										},
										success: function (fp, o) {
											// Ext.MessageBox.show({
											// 	title: 'Information',
											// 	msg: lang('Data saved'),
											// 	buttons: Ext.MessageBox.OK,
											// 	animateTarget: 'mb9',
											// 	icon: 'ext-mb-success',
											// 	fn: function (btn) {
											// 		if (btn == 'ok') {
											// 			Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm').destroy(); //destory current view
											// 			var MainForm = [];
											// 			if (Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm') == undefined) {
											// 				MainForm = Ext.create('MitraJaya.view.Finance.OrderBook.MainForm', {
											// 					viewVar: {
											// 						OpsiDisplay: 'update',
											// 						OrderBookID: o.result.OrderBookID,
											// 						PanelDisplayID: o.result.PanelDisplayID
											// 					}
											// 				});
											// 			} else {
											// 				Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm').destroy();
											// 				MainForm = Ext.create('MitraJaya.view.Finance.OrderBook.MainForm', {
											// 					viewVar: {
											// 						OpsiDisplay: 'update',
											// 						OrderBookID: o.result.OrderBookID,
											// 						PanelDisplayID: o.result.PanelDisplayID
											// 					}
											// 				});
											// 			}
											// 		}
											// 	}
											// });

											Swal.fire({
												text: "Data saved",
												icon: 'success',
												confirmButtonColor: '#3085d6',
											}).then((result) => {
												if (result.isConfirmed) {
													Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm').destroy(); //destory current view
													var MainForm = [];
													if (Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm') == undefined) {
														MainForm = Ext.create('MitraJaya.view.Finance.OrderBook.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																OrderBookID: o.result.OrderBookID
															}
														});
													} else {
														Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm').destroy();
														MainForm = Ext.create('MitraJaya.view.Finance.OrderBook.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																OrderBookID: o.result.OrderBookID
															}
														});
													}
												}
											})
										},
										failure: function (fp, o) {
											try {
												var r = Ext.decode(o.response.responseText);
												// Ext.MessageBox.show({
												// 	title: 'Error',
												// 	msg: r.message,
												// 	buttons: Ext.MessageBox.OK,
												// 	animateTarget: 'mb9',
												// 	icon: 'ext-mb-error'
												// });
												
												Swal.fire({
													icon: 'error',
													text: r.message,
													// footer: '<a href="">Why do I have this issue?</a>'
												})
											} catch (err) {
												// Ext.MessageBox.show({
												// 	title: 'Error',
												// 	msg: 'Connection Error',
												// 	buttons: Ext.MessageBox.OK,
												// 	animateTarget: 'mb9',
												// 	icon: 'ext-mb-error'
												// });
												Swal.fire({
													icon: 'error',
													text: 'Connection Error',
													// footer: '<a href="">Why do I have this issue?</a>'
												})
											}
										}
									});

								} else {
									// Ext.MessageBox.show({
									// 	title: lang('Attention'),
									// 	msg: lang('Form not complete yet'),
									// 	buttons: Ext.MessageBox.OK,
									// 	animateTarget: 'mb9',
									// 	icon: 'ext-mb-info'
									// });

									
									Swal.fire({
										icon: 'warning',
										text: 'Form not complete yet',
										// footer: '<a href="">Why do I have this issue?</a>'
									})
								}
							}
						}]
					}]
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
                id: 'MitraJaya.view.Finance.OrderBook.MainForm-labelInfoInsert',
                html: '<div id="header_title_farmer">' + lang('Order Book Data') + '</div>'
            }]
        }, {
            items: [{
                id: 'MitraJaya.view.Finance.OrderBook.MainForm-LinkBackToList',
                html: '<div id="Sfr_IdBoxInfoDataGrid" class="Sfr_BoxInfoDataGridForm"><ul class="Sft_UlListInfoDataGrid">'
				+'<li class="Sft_ListInfoDataGrid"><a href="javascript:Ext.getCmp(\'MitraJaya.view.Finance.OrderBook.MainForm\').BackToList()">'
				+'<img class="Sft_ListIconInfoDataGrid" src="' + varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/circle-chevron-left.svg" width="20" />&nbsp;&nbsp;' + lang('Back to Order Book List') + '</a></li></div>'
            }]
        }, {
            html: '<br />'
        }, {
            layout: 'column',
            border: false,
            items: [{
                //LEFT CONTENT
                columnWidth: 0.55,
                items: [
                    thisObj.ObjPanelBasicData
                ]
            }]
        }];
        //========================================================== LAYOUT UTAMA (END) ========================================//

        this.callParent(arguments);
    },
    BackToList: function () {
        Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm').destroy(); //destory current view
        var GridMainGrower = [];
        if (Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid') == undefined) {
            GridMainGrower = Ext.create('MitraJaya.view.Finance.OrderBook.MainGrid');
        } else {
            //destroy, create ulang
            Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid').destroy();
            GridMainGrower = Ext.create('MitraJaya.view.Finance.OrderBook.MainGrid');
        }
    }
});
