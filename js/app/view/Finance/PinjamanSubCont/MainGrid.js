/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : MainGrid.js
 *******************************************/
Ext.define('MitraJaya.view.Finance.PinjamanSubCont.MainGrid', {
	extend: 'Ext.panel.Panel',
	id: 'MitraJaya.view.Finance.PinjamanSubCont.MainGrid',
	renderTo: 'ext-content',
	style: 'padding:0 7px 7px 7px;margin:2px 0 0 0;',
	listeners: {
		afterRender: function (component, eOpts) {
			var thisObj = this;
			document.getElementById('ContentTopBar').style.display = 'block';

			var subcontloan_src = JSON.parse(localStorage.getItem('subcontloan_src'));

			if (subcontloan_src) {
				Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-VendorID').setValue(subcontloan_src.VendorID);
				Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-ProjectID').setValue(subcontloan_src.ProjectID);
				Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-EmployeeID').setValue(subcontloan_src.EmployeeID);
				Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-LoanType').setValue(subcontloan_src.LoanType);
				Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-DocNumber').setValue(subcontloan_src.DocNumber);
			}
		}
	},
	initComponent: function () {
		var thisObj = this;

		// console.log(m_api);
		//Store
		thisObj.StoreGridMain = Ext.create('MitraJaya.store.Finance.PinjamanSubCont.MainGrid');

		thisObj.combo_loan_type = Ext.create('Ext.data.Store', {
			fields: ['id', 'label'],
			data: [
				{ id: 'employee', label: 'Employee' },
				{ id: 'vendor', label: 'Vendor' },
				{ id: 'subcont', label: 'Subcont' }
			]
		});

		thisObj.combo_employee = Ext.create('MitraJaya.store.General.EmployeeList');
		thisObj.combo_vendor = Ext.create('MitraJaya.store.General.VendorList');
		thisObj.combo_project = Ext.create('MitraJaya.store.General.ProjectList');

		//ContextMenu
		thisObj.ContextMenuGrid = Ext.create('Ext.menu.Menu', {
			cls: 'Sfr_ConMenu',
			items: [{
				icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eye.svg',
				text: lang('View'),
				cls: 'Sfr_BtnConMenuWhite',
				itemId: 'MitraJaya.view.Finance.PinjamanSubCont.MainGrid-ContextMenuView',
				handler: function () {
					var sm = Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-Grid').getSelectionModel().getSelection()[0];
					Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid').destroy(); //destory current view

					var FormMainFarmer = [];
					if (Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm') == undefined) {
						FormMainFarmer = Ext.create('MitraJaya.view.Finance.PinjamanSubCont.MainForm', {
							viewVar: {
								OpsiDisplay: 'view',
								LoanID: sm.get('LoanID'),
								LoanType: sm.get('LoanType'),
								PanelDisplayID: sm.get('PanelDisplayID')
							}
						});
					} else {
						//destroy, create ulang
						Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm').destroy();
						FormMainFarmer = Ext.create('MitraJaya.view.Finance.PinjamanSubCont.MainForm', {
							viewVar: {
								OpsiDisplay: 'view',
								LoanID: sm.get('LoanID'),
								LoanType: sm.get('LoanType'),
								PanelDisplayID: sm.get('PanelDisplayID')
							}
						});
					}
				}
			}, {
				icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/pen-to-square.svg',
				text: lang('Update'),
				cls: 'Sfr_BtnConMenuWhite',
				hidden: m_act_update,
				itemId: 'MitraJaya.view.Finance.PinjamanSubCont.MainGrid-ContextMenuUpdate',
				handler: function () {
					var sm = Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-Grid').getSelectionModel().getSelection()[0];
					Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid').destroy(); //destory current view

					var FormMainFarmer = [];
					if (Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm') == undefined) {
						FormMainFarmer = Ext.create('MitraJaya.view.Finance.PinjamanSubCont.MainForm', {
							viewVar: {
								OpsiDisplay: 'update',
								LoanType: sm.get('LoanType'),
								LoanID: sm.get('LoanID'),
								PanelDisplayID: sm.get('PanelDisplayID')
							}
						});
					} else {
						//destroy, create ulang
						Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm').destroy();
						FormMainFarmer = Ext.create('MitraJaya.view.Finance.PinjamanSubCont.MainForm', {
							viewVar: {
								OpsiDisplay: 'update',
								LoanID: sm.get('LoanID'),
								LoanType: sm.get('LoanType'),
								PanelDisplayID: sm.get('PanelDisplayID')
							}
						});
					}
				}
			}, {
				icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eraser.svg',
				text: lang('Delete'),
				cls: 'Sfr_BtnConMenuWhite',
				hidden: m_act_delete,
				itemId: 'MitraJaya.view.Finance.PinjamanSubCont.MainGrid-ContextMenuDelete',
				handler: function () {
					var sm = Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-Grid').getSelectionModel().getSelection()[0];

					Swal.fire({
						title: 'Do you want to delete this data ?',
						text: "You won't be able to revert this!",
						icon: 'warning',
						showCancelButton: true,
						confirmButtonColor: '#3085d6',
						cancelButtonColor: '#d33',
						confirmButtonText: 'Yes, delete it!'
					}).then((result) => {
						if (result.isConfirmed) {
							Ext.Ajax.request({
								waitMsg: 'Please Wait',
								url: m_api + '/v1/finance/loan/delete_loan',
								method: 'DELETE',
								params: {
									LoanID: sm.get('LoanID')
								},
								success: function (response, opts) {
									Swal.fire(
										'Deleted!',
										'Your file has been deleted.',
										'success'
									)

									//refresh store
									thisObj.StoreGridMain.load();
								},
								failure: function (rp, o) {
									try {
										var r = Ext.decode(rp.responseText);
										Swal.fire(
											'Failed!',
											r.message,
											'warning'
										)
									}
									catch (err) {
										Swal.fire(
											'Failed!',
											'Connection Error',
											'warning'
										)
									}
								}
							});
						}
					})
				}
			}]
		});

		thisObj.items = [{
			layout: 'column',
			border: false,
			items: [{
				columnWidth: 1,
				layout: 'form',
				cls: 'Sfr_PanelLayoutFormContainer',
				items: [{
					xtype: 'form',
					fileUpload: true,
					buttonAlign: 'center',
					items: [{
						layout: 'column',
						border: false,
						hidden: false,
						items: [{
							columnWidth: 0.2,
							layout: 'form',
							style: 'padding-right: 10px',
							items: [{
								xtype: 'textfield',
								id: 'MitraJaya.view.Finance.PinjamanSubCont.MainGrid-DocNumber',
								name: 'MitraJaya.view.Finance.PinjamanSubCont.MainGrid-DocNumber',
								labelAlign: 'top',
								fieldLabel: 'Doc Number',
							}]
						}, {
							columnWidth: 0.2,
							layout: 'form',
							items: [{
								xtype: 'combobox',
								id: 'MitraJaya.view.Finance.PinjamanSubCont.MainGrid-LoanType',
								name: 'MitraJaya.view.Finance.PinjamanSubCont.MainGrid-LoanType',
								store: thisObj.combo_loan_type,
								labelAlign: 'top',
								fieldLabel: 'Type',
								queryMode: 'local',
								displayField: 'label',
								valueField: 'id',
								listeners: {
									'change': function (o, val) {
										if (val == "employee") {
											Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-EmployeeID').setVisible(true);
											Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-VendorID').setVisible(false);
										}
										if (val == "vendor") {
											Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-EmployeeID').setVisible(false);
											Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-VendorID').setVisible(true);
										}
									}
								}
							}]
						}, {
							columnWidth: 0.2,
							layout: 'form',
							items: [{
								xtype: 'combobox',
								id: 'MitraJaya.view.Finance.PinjamanSubCont.MainGrid-EmployeeID',
								name: 'MitraJaya.view.Finance.PinjamanSubCont.MainGrid-EmployeeID',
								hidden: true,
								store: thisObj.combo_employee,
								labelAlign: 'top',
								fieldLabel: 'Employee',
								queryMode: 'local',
								displayField: 'label',
								valueField: 'id'
							}]
						}, {
							columnWidth: 0.2,
							layout: 'form',
							items: [{
								xtype: 'combobox',
								id: 'MitraJaya.view.Finance.PinjamanSubCont.MainGrid-VendorID',
								name: 'MitraJaya.view.Finance.PinjamanSubCont.MainGrid-VendorID',
								store: thisObj.combo_vendor,
								hidden: true,
								labelAlign: 'top',
								fieldLabel: 'Vendor',
								queryMode: 'local',
								displayField: 'label',
								valueField: 'id'
							}]
						}, {
							columnWidth: 0.2,
							layout: 'form',
							items: [{
								xtype: 'combobox',
								id: 'MitraJaya.view.Finance.PinjamanSubCont.MainGrid-ProjectID',
								name: 'MitraJaya.view.Finance.PinjamanSubCont.MainGrid-ProjectID',
								store: thisObj.combo_project,
								labelAlign: 'top',
								fieldLabel: 'Project',
								queryMode: 'local',
								displayField: 'label',
								valueField: 'id'
							}]
						}, {
							columnWidth: 0.1,
							layout: 'form',
							items: [{
								xtype: 'button',
								// icon: varjs.config.base_url + 'images/icons/new/add-filter.png',
								text: lang('Search'),
								style: 'margin-left:20px; margin-top:30px',
								cls: 'Sfr_BtnFormCyan',
								overCls: 'Sfr_BtnFormCyan-Hover',
								id: 'MitraJaya.view.Finance.PinjamanSubCont.MainGrid-BtnApplyFilter',
								handler: function () {
									setFilterLs();
								}
							}]
						}]
					}]
				}]
			}]
		},
		{
			xtype: 'grid',
			id: 'MitraJaya.view.Finance.PinjamanSubCont.MainGrid-Grid',
			style: 'border:1px solid #CCC;margin-top:4px;',
			cls: 'Sfr_GridNew',
			minHeight: 600,
			loadMask: true,
			selType: 'rowmodel',
			store: thisObj.StoreGridMain,
			enableColumnHide: false,
			viewConfig: {
				deferEmptyText: false,
				emptyText: GetDefaultContentNoData()
			},
			dockedItems: [{
				xtype: 'pagingtoolbar',
				store: thisObj.StoreGridMain,
				dock: 'bottom',
				displayInfo: true,
				displayMsg: lang('Showing') + ' {0} ' + lang('to') + ' {1} ' + lang('of') + ' {2} ' + lang('data')
			}, {
				xtype: 'toolbar',
				dock: 'top',
				items: [{
					xtype: 'button',
					icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/square-plus.svg',
					text: lang('Add'),
					hidden: m_act_add,
					cls: 'Sfr_BtnGridNewWhite',
					overCls: 'Sfr_BtnGridNewWhite-Hover',
					id: 'MitraJaya.view.Finance.PinjamanSubCont.MainGrid-BtnAdd',
					handler: function () {
						Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid').destroy(); //destory current view
						var FormMainFarmer = [];

						//create object View untuk FormMainGrower
						if (Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm') == undefined) {
							FormMainFarmer = Ext.create('MitraJaya.view.Finance.PinjamanSubCont.MainForm', {
								viewVar: {
									OpsiDisplay: 'insert',
									PanelDisplayID: null
								}
							});
						} else {
							//destroy, create ulang
							Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm').destroy();
							FormMainFarmer = Ext.create('MitraJaya.view.Finance.PinjamanSubCont.MainForm', {
								viewVar: {
									OpsiDisplay: 'insert',
									PanelDisplayID: null
								}
							});
						}
					}
				}, {
					xtype: 'button',
					icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/file-export.svg',
					text: lang('Export'),
					cls: 'Sfr_BtnGridNewWhite',
					overCls: 'Sfr_BtnGridNewWhite-Hover',
					hidden: m_act_export_excel,
					id: 'MitraJaya.view.Finance.PinjamanSubCont.MainGrid-BtnExport',
					handler: function () {
						var VendorID = Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-VendorID').getValue();
						var ProjectID = Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-ProjectID').getValue();

						Swal.fire({
							text: "Export data ?",
							icon: 'warning',
							showCancelButton: true,
							confirmButtonColor: '#3085d6',
							cancelButtonColor: '#d33',
							confirmButtonText: 'Yes, Export it!'
						}).then((result) => {
							if (result.isConfirmed) {
								Ext.Ajax.request({
									url: m_api + '/v1/finance/loan/export_loan',
									method: 'POST',
									waitMsg: lang('Please Wait'),
									params: {
										VendorID: VendorID,
										ProjectID: ProjectID
									},
									success: function (data) {
										console.log(data);
										if (!fetchJSON(data.responseText)) {
											Swal.fire({
												icon: 'error',
												text: 'Connection Failed',
												// footer: '<a href="">Why do I have this issue?</a>'
											})
											return false;
										}

										var jsonResp = JSON.parse(data.responseText);
										if (jsonResp.success == true) {
											window.location = jsonResp.filenya;
										} else if (jsonResp.message == 'Empty') {
											Swal.fire({
												icon: 'warning',
												text: jsonResp.filenya,
												// footer: '<a href="">Why do I have this issue?</a>'
											})
											return false;
										}
									},
									failure: function () {
										Ext.MessageBox.hide();
										Swal.fire({
											icon: 'error',
											text: 'Failed to export, Please try again',
											// footer: '<a href="">Why do I have this issue?</a>'
										})
									}
								});
							}
						})
					}
				}, {
					xtype: 'button',
					icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/upload.svg',
					text: lang('Import'),
					cls: 'Sfr_BtnGridNewWhite',
					overCls: 'Sfr_BtnGridNewWhite-Hover',
					id: 'MitraJaya.view.Finance.PinjamanSubCont.MainGrid-BtnImport',
					handler: function () {
						var WinFormImportLoan = Ext.create('MitraJaya.view.Finance.PinjamanSubCont.WinFormImportLoan');
						if (!WinFormImportLoan.isVisible()) {
							WinFormImportLoan.center();
							WinFormImportLoan.show();
						} else {
							WinFormImportLoan.close();
						}
					}
				}, {
					xtype: 'tbspacer',
					flex: 1
				}, {
					icon: varjs.config.base_url + 'images/icons/new/add-filter.png',
					cls: 'Sfr_BtnGridPaleBlue',
					text: lang('Advanced Filter'),
					hidden: true,
					handler: function () {
						//advanced search
						var winAdvFilter = Ext.create('MitraJaya.view.Finance.PinjamanSubCont.WinAdvancedFilter');
						if (!winAdvFilter.isVisible()) {
							winAdvFilter.center();
							winAdvFilter.show();
						} else {
							winAdvFilter.close();
						}
					}
				}, {
					xtype: 'button',
					icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/recycle.svg',
					cls: 'Sfr_BtnGridBlue',
					overCls: 'Sfr_BtnGridBlue-Hover',
					id: 'MitraJaya.view.Finance.PinjamanSubCont.MainGrid-BtnReload',
					handler: function () {
						Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-Grid').getStore().loadPage(1);
					}
				}]
			}],
			columns: [{
				text: '',
				xtype: 'actioncolumn',
				flex: 1,
				items: [{
					icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/caret-down.svg',
					handler: function (grid, rowIndex, colIndex, item, e, record) {
						thisObj.ContextMenuGrid.showAt(e.getXY());
					}
				}]
			}, {
				text: 'No',
				flex: 1,
				xtype: 'rownumberer'
			}, {
				text: lang('LoanID'),
				dataIndex: 'LoanID',
				hidden: true
			}, {
				text: lang('Doc Number'),
				dataIndex: 'DocNumber',
				flex: 8
			}, {
				text: lang('Type'),
				dataIndex: 'LoanType',
				flex: 8
			}, {
				text: lang('Name'),
				dataIndex: 'VendorNameDisplay',
				flex: 15
			}, {
				text: lang('Project'),
				dataIndex: 'ProjectName',
				flex: 10
			}, {
				text: lang('Loan Amount'),
				dataIndex: 'LoanAmount',
				flex: 10
			}, {
				text: lang('Loan Date'),
				dataIndex: 'LoanDate',
				flex: 10
			}, {
				text: lang('Total Payment'),
				dataIndex: 'TotalPayment',
				flex: 10
			}, {
				text: lang('Loan Remaining'),
				dataIndex: 'LoanRemaining',
				flex: 10
			}, {
				text: lang('Status'),
				dataIndex: 'Status',
				flex: 10
			}]
		}];

		this.callParent(arguments);
	},
	submitOnEnterGrid: function (field, event) {
		localStorage.setItem('subcontloan_src', JSON.stringify({
			VendorID: Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-VendorID').getValue(),
			ProjectID: Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-ProjectID').getValue()
		}));
		Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-Grid').getStore().loadPage(1);
	}
});



function setFilterLs() {
	localStorage.setItem('subcontloan_src', JSON.stringify({
		VendorID: Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-VendorID').getValue(),
		EmployeeID: Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-EmployeeID').getValue(),
		LoanType: Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-LoanType').getValue(),
		DocNumber: Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-DocNumber').getValue(),
		ProjectID: Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-ProjectID').getValue()
	}));
	Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainGrid-Grid').getStore().loadPage(1);
}

function fetchJSON(text) {
	try {
		JSON.parse(text);
		return true;
	}
	catch (error) {
		return false;
	}
}
