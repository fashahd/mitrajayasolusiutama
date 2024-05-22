/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : MainGrid.js
 *******************************************/
Ext.define('MitraJaya.view.Finance.Claim.MainGrid', {
	extend: 'Ext.panel.Panel',
	id: 'MitraJaya.view.Finance.Claim.MainGrid',
	renderTo: 'ext-content',
	style: 'padding:0 7px 7px 7px;margin:2px 0 0 0;',
	listeners: {
		afterRender: function (component, eOpts) {
			var thisObj = this;
			document.getElementById('ContentTopBar').style.display = 'block';

			var claim_ls = JSON.parse(localStorage.getItem('claim_ls'));

			if (claim_ls) {
				Ext.getCmp('MitraJaya.view.Finance.Claim.MainGrid-ProjectID').setValue(claim_ls.ProjectID);
				Ext.getCmp('MitraJaya.view.Finance.Claim.MainGrid-DocNumber').setValue(claim_ls.DocNumber);
			}
		}
	},
	initComponent: function () {
		var thisObj = this;

		// console.log(m_api);
		//Store
		thisObj.StoreGridMain = Ext.create('MitraJaya.store.Finance.Claim.MainGrid');

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
				text: 'View',
				cls: 'Sfr_BtnConMenuWhite',
				itemId: 'MitraJaya.view.Finance.Claim.MainGrid-ContextMenuView',
				handler: function () {
					var sm = Ext.getCmp('MitraJaya.view.Finance.Claim.MainGrid-Grid').getSelectionModel().getSelection()[0];
					Ext.getCmp('MitraJaya.view.Finance.Claim.MainGrid').destroy(); //destory current view

					var FormMainFarmer = [];
					if (Ext.getCmp('MitraJaya.view.Finance.Claim.MainForm') == undefined) {
						FormMainFarmer = Ext.create('MitraJaya.view.Finance.Claim.MainForm', {
							viewVar: {
								OpsiDisplay: 'view',
								ClaimID: sm.get('ClaimID'),
								PanelDisplayID: sm.get('PanelDisplayID')
							}
						});
					} else {
						//destroy, create ulang
						Ext.getCmp('MitraJaya.view.Finance.Claim.MainForm').destroy();
						FormMainFarmer = Ext.create('MitraJaya.view.Finance.Claim.MainForm', {
							viewVar: {
								OpsiDisplay: 'view',
								ClaimID: sm.get('ClaimID'),
								PanelDisplayID: sm.get('PanelDisplayID')
							}
						});
					}
				}
			}, {
				icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/pen-to-square.svg',
				text: 'Update',
				cls: 'Sfr_BtnConMenuWhite',
				hidden: m_act_update,
				itemId: 'MitraJaya.view.Finance.Claim.MainGrid-ContextMenuUpdate',
				handler: function () {
					var sm = Ext.getCmp('MitraJaya.view.Finance.Claim.MainGrid-Grid').getSelectionModel().getSelection()[0];
					Ext.getCmp('MitraJaya.view.Finance.Claim.MainGrid').destroy(); //destory current view

					var FormMainFarmer = [];
					if (Ext.getCmp('MitraJaya.view.Finance.Claim.MainForm') == undefined) {
						FormMainFarmer = Ext.create('MitraJaya.view.Finance.Claim.MainForm', {
							viewVar: {
								OpsiDisplay: 'update',
								ClaimID: sm.get('ClaimID'),
								PanelDisplayID: sm.get('PanelDisplayID')
							}
						});
					} else {
						//destroy, create ulang
						Ext.getCmp('MitraJaya.view.Finance.Claim.MainForm').destroy();
						FormMainFarmer = Ext.create('MitraJaya.view.Finance.Claim.MainForm', {
							viewVar: {
								OpsiDisplay: 'update',
								ClaimID: sm.get('ClaimID'),
								PanelDisplayID: sm.get('PanelDisplayID')
							}
						});
					}
				}
			}, {
				icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eraser.svg',
				text: 'Delete',
				cls: 'Sfr_BtnConMenuWhite',
				hidden: m_act_delete,
				itemId: 'MitraJaya.view.Finance.Claim.MainGrid-ContextMenuDelete',
				handler: function () {
					var sm = Ext.getCmp('MitraJaya.view.Finance.Claim.MainGrid-Grid').getSelectionModel().getSelection()[0];

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
								url: m_api + '/v1/finance/claim/delete_claim',
								method: 'DELETE',
								params: {
									ClaimID: sm.get('ClaimID')
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
							style: 'margin-right:10px',
							items: [{
								xtype: 'textfield',
								id: 'MitraJaya.view.Finance.Claim.MainGrid-DocNumber',
								name: 'MitraJaya.view.Finance.Claim.MainGrid-DocNumber',
								labelAlign: 'top',
								fieldLabel: 'Document Number',
								listeners: {
									specialkey: thisObj.submitOnEnterGrid
								}
							}]
						}, {
							columnWidth: 0.2,
							layout: 'form',
							items: [{
								xtype: 'combobox',
								id: 'MitraJaya.view.Finance.Claim.MainGrid-ProjectID',
								name: 'MitraJaya.view.Finance.Claim.MainGrid-ProjectID',
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
								text: 'Search',
								style: 'margin-left:20px; margin-top:30px',
								cls: 'Sfr_BtnFormCyan',
								overCls: 'Sfr_BtnFormCyan-Hover',
								id: 'MitraJaya.view.Finance.Claim.MainGrid-BtnApplyFilter',
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
			id: 'MitraJaya.view.Finance.Claim.MainGrid-Grid',
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
				displayMsg: 'Showing' + ' {0} ' + 'to' + ' {1} ' + 'of' + ' {2} ' + 'data'
			}, {
				xtype: 'toolbar',
				dock: 'top',
				items: [{
					xtype: 'button',
					icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/square-plus.svg',
					text: 'Add',
					hidden: m_act_add,
					cls: 'Sfr_BtnGridNewWhite',
					overCls: 'Sfr_BtnGridNewWhite-Hover',
					id: 'MitraJaya.view.Finance.Claim.MainGrid-BtnAdd',
					handler: function () {
						Ext.getCmp('MitraJaya.view.Finance.Claim.MainGrid').destroy(); //destory current view
						var FormMainFarmer = [];

						//create object View untuk FormMainGrower
						if (Ext.getCmp('MitraJaya.view.Finance.Claim.MainForm') == undefined) {
							FormMainFarmer = Ext.create('MitraJaya.view.Finance.Claim.MainForm', {
								viewVar: {
									OpsiDisplay: 'insert',
									PanelDisplayID: null
								}
							});
						} else {
							//destroy, create ulang
							Ext.getCmp('MitraJaya.view.Finance.Claim.MainForm').destroy();
							FormMainFarmer = Ext.create('MitraJaya.view.Finance.Claim.MainForm', {
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
					text: 'Export',
					cls: 'Sfr_BtnGridNewWhite',
					overCls: 'Sfr_BtnGridNewWhite-Hover',
					hidden: m_act_export_excel,
					id: 'MitraJaya.view.Finance.Claim.MainGrid-BtnExport',
					handler: function () {
						var VendorID = Ext.getCmp('MitraJaya.view.Finance.Claim.MainGrid-VendorID').getValue();
						var ProjectID = Ext.getCmp('MitraJaya.view.Finance.Claim.MainGrid-ProjectID').getValue();

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
									waitMsg: 'Please Wait',
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
					xtype: 'tbspacer',
					flex: 1
				}, {
					icon: varjs.config.base_url + 'images/icons/new/add-filter.png',
					cls: 'Sfr_BtnGridPaleBlue',
					text: 'Advanced Filter',
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
					id: 'MitraJaya.view.Finance.Claim.MainGrid-BtnReload',
					handler: function () {
						Ext.getCmp('MitraJaya.view.Finance.Claim.MainGrid-Grid').getStore().loadPage(1);
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
				text: 'ClaimID',
				dataIndex: 'ClaimID',
				hidden: true
			}, {
				text: 'Doc Number',
				dataIndex: 'DocNumber',
				flex: 8
			}, {
				text: 'Claim Date',
				dataIndex: 'ClaimDate',
				flex: 15
			}, {
				text: 'Location',
				dataIndex: 'Location',
				flex: 10
			}, {
				text: 'Project Name',
				dataIndex: 'ProjectName',
				flex: 10
			}, {
				text: 'Total Amount',
				dataIndex: 'TotalAmount',
				flex: 10,
				renderer: function (t, meta, record) {
					let RetVal;

					RetVal = 'Rp ' + number_format(record.data.TotalAmount, 2);

					return RetVal;
				}
			}, {
				text: 'Cost out By',
				dataIndex: 'PeopleName',
				flex: 10
			}]
		}];

		this.callParent(arguments);
	},
	submitOnEnterGrid: function (field, event) {
		localStorage.setItem('claim_ls', JSON.stringify({
			DocNumber: Ext.getCmp('MitraJaya.view.Finance.Claim.MainGrid-DocNumber').getValue(),
			ProjectID: Ext.getCmp('MitraJaya.view.Finance.Claim.MainGrid-ProjectID').getValue()
		}));
		Ext.getCmp('MitraJaya.view.Finance.Claim.MainGrid-Grid').getStore().loadPage(1);
	}
});



function setFilterLs() {
	localStorage.setItem('claim_ls', JSON.stringify({
		DocNumber: Ext.getCmp('MitraJaya.view.Finance.Claim.MainGrid-DocNumber').getValue(),
		ProjectID: Ext.getCmp('MitraJaya.view.Finance.Claim.MainGrid-ProjectID').getValue()
	}));
	Ext.getCmp('MitraJaya.view.Finance.Claim.MainGrid-Grid').getStore().loadPage(1);
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
