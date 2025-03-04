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

Ext.define('MitraJaya.view.Finance.PinjamanSubCont.MainForm', {
	extend: 'Ext.panel.Panel',
	id: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm',
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
					Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-BtnSave').setVisible(false);
				}

				//load formnya
				Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData').getForm().load({
					url: m_api + '/v1/finance/loan/form_loan',
					method: 'GET',
					params: {
						LoanID: this.viewVar.LoanID
					},
					success: function (form, action) {
						// Ext.MessageBox.hide();
						var r = Ext.decode(action.response.responseText);
						//Title
						// Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-labelInfoInsert').update('<div id="header_title_farmer">' + Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanID').getValue() + ' - <strong>' + Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-SupplierName').getValue() + '</strong></div>');
						Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-labelInfoInsert').doLayout();
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
							// b.textContent = Swal.getTimerLeft()
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

		thisObj.combo_year = Ext.create('MitraJaya.store.General.StoreYear', {
			storeVar: {
				yearRange: 20
			}
		});

		thisObj.combo_company = Ext.create('MitraJaya.store.General.CompanyList', {
			storeVar: {
				CustomerID: ''
			}
		});

		thisObj.combo_employee_project = Ext.create('MitraJaya.store.General.EmployeeList');
		thisObj.combo_vendor_list = Ext.create('MitraJaya.store.General.VendorList');
		thisObj.combo_subcont_list = Ext.create('MitraJaya.store.General.SubContList');
		thisObj.combo_project = Ext.create('MitraJaya.store.General.ProjectList');
		thisObj.combo_department = Ext.create('MitraJaya.store.General.DepartmentList');

		//Panel Basic ==================================== (Begin)
		thisObj.ObjPanelBasicData = Ext.create('Ext.panel.Panel', {
			title: lang('Loan Data'),
			frame: true,
			cls: 'Sfr_PanelLayoutForm',
			id: 'MitraJaya.view.Finance.PinjamanSubCont-FormGeneralData',
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
						id: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData',
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
									id: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanID',
									name: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanID'
								}, {
									xtype: 'textfield',
									labelAlign: 'top',
									id: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-DocNumber',
									name: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-DocNumber',
									fieldLabel: lang('Document Number')
								}, {
									xtype: 'datefield',
									id: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanDate',
									name: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanDate',
									labelAlign: 'top',
									fieldLabel: lang('Loan Date'),
									format: 'Y-m-d',
									value: new Date(),
									allowBlank: false,
									baseCls: 'Sfr_FormInputMandatory'
								}, {
									xtype: 'numericfield',
									labelAlign: 'top',
									id: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanAmount',
									name: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanAmount',
									fieldLabel: lang('Loan Amount'),
									readOnly: true
								}, {
									xtype: 'datefield',
									id: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanTransferDate',
									name: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanTransferDate',
									labelAlign: 'top',
									format: 'Y-m-d',
									value: new Date(),
									fieldLabel: lang('Loan Transfer Date')
								}, {
									html: '<div style="margin-bottom:5px"></div>'
								}, {
									xtype: 'radiogroup',
									fieldLabel: lang('Type'),
									msgTarget: 'side',
									labelWidth: 180,
									allowBlank: false,
									labelAlign: 'top',
									baseCls: 'Sfr_FormInputMandatory',
									columns: 3,
									items: [{
										boxLabel: lang('Vendor'),
										name: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanType',
										inputValue: 'vendor',
										id: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanTypeVendor',
										listeners: {
											change: function () {
												if (this.checked == true) {
													Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-VendorName').setVisible(true);
													Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-SubcontName').setVisible(false);
													Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-EmployeeName').setVisible(false);
												}
												return false;
											}
										}
									}, {
										boxLabel: lang('Subcont'),
										name: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanType',
										inputValue: 'subcont',
										id: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanTypeSubcont',
										listeners: {
											change: function () {
												if (this.checked == true) {
													Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-SubcontName').setVisible(true);
													Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-VendorName').setVisible(false);
													Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-EmployeeName').setVisible(false);
												}
												return false;
											}
										}
									}, {
										boxLabel: lang('Employee'),
										name: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanType',
										inputValue: 'employee',
										id: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanTypeEmployee',
										listeners: {
											change: function () {
												if (this.checked == true) {
													Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-EmployeeName').setVisible(true);
													Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-VendorName').setVisible(false);
													Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-SubcontName').setVisible(false);
												}
												return false;
											}
										}
									}]
								}, {
									xtype: 'combobox',
									id: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-SubcontName',
									name: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-SubcontName',
									store: thisObj.combo_subcont_list,
									labelAlign: 'top',
									fieldLabel: 'Subcont Name',
									queryMode: 'local',
									displayField: 'label',
									valueField: 'id',
									hidden: true
								}, {
									xtype: 'combobox',
									id: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-VendorName',
									name: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-VendorName',
									store: thisObj.combo_vendor_list,
									labelAlign: 'top',
									fieldLabel: 'Vendor Name',
									queryMode: 'local',
									displayField: 'label',
									valueField: 'id',
									hidden: true
								}, {
									xtype: 'combobox',
									id: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-EmployeeName',
									name: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-EmployeeName',
									store: thisObj.combo_employee_project,
									labelAlign: 'top',
									fieldLabel: 'Employee Name',
									queryMode: 'local',
									displayField: 'label',
									valueField: 'id',
									hidden: true
								}, {
									xtype: 'combobox',
									id: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-ProjectID',
									name: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-ProjectID',
									store: thisObj.combo_project,
									labelAlign: 'top',
									fieldLabel: 'Project',
									queryMode: 'local',
									displayField: 'label',
									valueField: 'id',
									allowBlank: false,
									baseCls: 'Sfr_FormInputMandatory'
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
									xtype: 'textareafield',
									labelAlign: 'top',
									id: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanAmountDescription',
									name: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanAmountDescription',
									fieldLabel: lang('Loan Amount Description')
								}, {
									xtype: 'textareafield',
									labelAlign: 'top',
									id: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanDescription',
									name: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanDescription',
									fieldLabel: lang('Loan Description')
								}, {
									xtype: 'numericfield',
									labelAlign: 'top',
									fieldLabel: lang('Total Payment'),
									readOnly: true,
									id: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-TotalPayment',
									name: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-TotalPayment'
								}, {
									xtype: 'numericfield',
									labelAlign: 'top',
									fieldLabel: lang('Loan Remaining'),
									readOnly: true,
									id: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanRemaining',
									name: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanRemaining'
								}]
							}]
						}],
						buttons: [{
							xtype: 'button',
							icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/floppy-disk.svg',
							text: lang('Save'),
							cls: 'Sfr_BtnFormBlue',
							overCls: 'Sfr_BtnFormBlue-Hover',
							id: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-BtnSave',
							handler: function () {
								var Formnya = Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData').getForm();

								if (Formnya.isValid()) {

									Formnya.submit({
										url: m_api + '/v1/finance/loan/submit_loan',
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
													Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm').destroy(); //destory current view
													var MainForm = [];
													if (Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm') == undefined) {
														MainForm = Ext.create('MitraJaya.view.Finance.PinjamanSubCont.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																LoanID: o.result.LoanID,
																LoanType: o.result.LoanType
															}
														});
													} else {
														Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm').destroy();
														MainForm = Ext.create('MitraJaya.view.Finance.PinjamanSubCont.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																LoanID: o.result.LoanID,
																LoanType: o.result.LoanType
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

		var ObjPanelGridLoanPayment = [];

		if (thisObj.viewVar.OpsiDisplay == 'view' && thisObj.viewVar.LoanType == 'VENDOR' || thisObj.viewVar.OpsiDisplay == 'update' && thisObj.viewVar.LoanType == 'VENDOR') {
			thisObj.ObjPanelPaymentLoan = Ext.create('MitraJaya.view.Finance.PinjamanSubCont.GridLoanPayment', {
				viewVar: {
					LoanID: thisObj.viewVar.LoanID
				}
			});
			ObjPanelGridLoanPayment.push(thisObj.ObjPanelPaymentLoan);
		}

		if (thisObj.viewVar.OpsiDisplay == 'view' && thisObj.viewVar.LoanType == 'SUBCONT' || thisObj.viewVar.OpsiDisplay == 'update' && thisObj.viewVar.LoanType == 'SUBCONT') {
			thisObj.ObjPanelPaymentLoan = Ext.create('MitraJaya.view.Finance.PinjamanSubCont.GridLoanPayment', {
				viewVar: {
					LoanID: thisObj.viewVar.LoanID
				}
			});
			ObjPanelGridLoanPayment.push(thisObj.ObjPanelPaymentLoan);
		}

		if (thisObj.viewVar.OpsiDisplay == 'view' && thisObj.viewVar.LoanType == 'EMPLOYEE' || thisObj.viewVar.OpsiDisplay == 'update' && thisObj.viewVar.LoanType == 'EMPLOYEE') {
			thisObj.ObjPanelPaymentLoan = Ext.create('MitraJaya.view.Finance.PinjamanSubCont.GridLoanPaymentEmployee', {
				viewVar: {
					LoanID: thisObj.viewVar.LoanID
				}
			});
			ObjPanelGridLoanPayment.push(thisObj.ObjPanelPaymentLoan);
		}

		thisObj.ObjPanelBasicLoanDetail = Ext.create('MitraJaya.view.Finance.PinjamanSubCont.GridLoanDetail', {
			viewVar: {
				LoanID: thisObj.viewVar.LoanID
			}
		});

		//============================= End DQ =========================================//

		//========================================================== LAYOUT UTAMA (Begin) ========================================//
		thisObj.items = [{
			xtype: 'panel',
			border: false,
			layout: {
				type: 'hbox'
			},
			items: [{
				id: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-labelInfoInsert',
				html: '<div id="header_title_farmer">' + lang('Loan Data') + '</div>'
			}]
		}, {
			items: [{
				id: 'MitraJaya.view.Finance.PinjamanSubCont.MainForm-LinkBackToList',
				html: '<div id="Sfr_IdBoxInfoDataGrid" class="Sfr_BoxInfoDataGridForm"><ul class="Sft_UlListInfoDataGrid">'
					+ '<li class="Sft_ListInfoDataGrid"><a href="javascript:Ext.getCmp(\'MitraJaya.view.Finance.PinjamanSubCont.MainForm\').BackToList()">'
					+ '<img class="Sft_ListIconInfoDataGrid" src="' + varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/circle-chevron-left.svg" width="20" />&nbsp;&nbsp;' + lang('Back to Loan List') + '</a></li></div>'
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
			}, {
				//LEFT CONTENT
				columnWidth: 0.43,
				items: [
					thisObj.ObjPanelBasicLoanDetail
				]
			}, {
				columnWidth: 1,
				layout: 'form',
				style: 'padding:10px 0px 10px 5px;',
				items: ObjPanelGridLoanPayment
			}]
		}];
		//========================================================== LAYOUT UTAMA (END) ========================================//

		this.callParent(arguments);
	},
	BackToList: function () {
		Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm').destroy(); //destory current view
		var GridMainGrower = [];
		if (Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid') == undefined) {
			GridMainGrower = Ext.create('MitraJaya.view.Finance.PinjamanSubCont.MainGrid');
		} else {
			//destroy, create ulang
			Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid').destroy();
			GridMainGrower = Ext.create('MitraJaya.view.Finance.PinjamanSubCont.MainGrid');
		}
	}
});
