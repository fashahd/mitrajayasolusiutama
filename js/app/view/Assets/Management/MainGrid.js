/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : MainGrid.js
 *******************************************/
Ext.define('MitraJaya.view.Assets.Management.MainGrid', {
	extend: 'Ext.panel.Panel',
	id: 'MitraJaya.view.Assets.Management.MainGrid',
	renderTo: 'ext-content',
	style: 'padding:0 7px 7px 7px;margin:2px 0 0 0;',
	listeners: {
		afterRender: function (component, eOpts) {
			var thisObj = this;
			document.getElementById('ContentTopBar').style.display = 'block';

			var assets_ls = JSON.parse(localStorage.getItem('assets_ls'));

			if (assets_ls) {
				Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-keySearch').setValue(assets_ls.keySearch);
				Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-CategoryID').setValue(assets_ls.CategoryID);
				Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-Year').setValue(assets_ls.Year);
				Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-BrandID').setValue(assets_ls.BrandID);
			}
		}
	},
	initComponent: function () {
		var thisObj = this;

		// console.log(m_api);
		//Store
		thisObj.StoreGridMain = Ext.create('MitraJaya.store.Assets.Management.MainGrid');

		thisObj.comboCategory = Ext.create('MitraJaya.store.General.StoreAssetCategory');
		thisObj.comboBrand = Ext.create('MitraJaya.store.General.StoreAssetBrand');

		thisObj.combo_year = Ext.create('MitraJaya.store.General.StoreYear', {
			storeVar: {
				yearRange: 20
			}
		});

		//ContextMenu
		thisObj.ContextMenuGrid = Ext.create('Ext.menu.Menu', {
			cls: 'Sfr_ConMenu',
			items: [{
				icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eye.svg',
				text: lang('View'),
				cls: 'Sfr_BtnConMenuWhite',
				itemId: 'MitraJaya.view.Assets.Management.MainGrid-ContextMenuView',
				handler: function () {
					var sm = Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-Grid').getSelectionModel().getSelection()[0];
					Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid').destroy(); //destory current view

					var FormMainFarmer = [];
					if (Ext.getCmp('MitraJaya.view.Assets.Management.MainForm') == undefined) {
						FormMainFarmer = Ext.create('MitraJaya.view.Assets.Management.MainForm', {
							viewVar: {
								OpsiDisplay: 'view',
								AssetID: sm.get('AssetID'),
								PanelDisplayID: sm.get('PanelDisplayID')
							}
						});
					} else {
						//destroy, create ulang
						Ext.getCmp('MitraJaya.view.Assets.Management.MainForm').destroy();
						FormMainFarmer = Ext.create('MitraJaya.view.Assets.Management.MainForm', {
							viewVar: {
								OpsiDisplay: 'view',
								AssetID: sm.get('AssetID'),
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
				itemId: 'MitraJaya.view.Assets.Management.MainGrid-ContextMenuUpdate',
				handler: function () {
					var sm = Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-Grid').getSelectionModel().getSelection()[0];
					Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid').destroy(); //destory current view

					var FormMainFarmer = [];
					if (Ext.getCmp('MitraJaya.view.Assets.Management.MainForm') == undefined) {
						FormMainFarmer = Ext.create('MitraJaya.view.Assets.Management.MainForm', {
							viewVar: {
								OpsiDisplay: 'update',
								AssetID: sm.get('AssetID'),
								PanelDisplayID: sm.get('PanelDisplayID')
							}
						});
					} else {
						//destroy, create ulang
						Ext.getCmp('MitraJaya.view.Assets.Management.MainForm').destroy();
						FormMainFarmer = Ext.create('MitraJaya.view.Assets.Management.MainForm', {
							viewVar: {
								OpsiDisplay: 'update',
								AssetID: sm.get('AssetID'),
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
				itemId: 'MitraJaya.view.Assets.Management.MainGrid-ContextMenuDelete',
				handler: function () {
					var sm = Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-Grid').getSelectionModel().getSelection()[0];

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
								url: m_api + '/v1/assets/management/delete_asset',
								method: 'DELETE',
								params: {
									AssetID: sm.get('AssetID')
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
			}, {
				icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eye.svg',
				text: lang('Print QR Code'),
				cls: 'Sfr_BtnConMenuWhite',
				itemId: 'MitraJaya.view.Assets.Management.MainGrid-ContextMenuPrint',
				handler: function () {
					Ext.MessageBox.show({
						title: "",
						msg: "Include PPH 23 ?",
						icon: Ext.MessageBox.INFO,
						buttons: Ext.MessageBox.YESNO,
						fn: function (buttonId) {
							if (buttonId === "yes") {
								var sm = Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-Grid').getSelectionModel().getSelection()[0];

								var url = m_api + '/v1/report/printout/print_invoice';
								preview_cetak_surat(url + '?pph=yes&AssetID=' + sm.get("AssetID"));
							} else {
								var sm = Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-Grid').getSelectionModel().getSelection()[0];

								var url = m_api + '/v1/report/printout/print_invoice';
								preview_cetak_surat(url + '?pph=no&AssetID=' + sm.get("AssetID"));
							}
						}
					});
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
						items: [{
							columnWidth: 0.18,
							layout: 'form',
							style: 'padding-right:10px',
							items: [{
								name: 'MitraJaya.view.Assets.Management.MainGrid-keySearch',
								id: 'MitraJaya.view.Assets.Management.MainGrid-keySearch',
								xtype: 'textfield',
								baseCls: 'Sfr_TxtfieldSearchGrid',
								fieldLabel: 'Asset Number',
								labelAlign: 'top',
								emptyText: lang('Search by Asset/Serial Number'),
								enableKeyEvents: true,
								listeners: {
									specialkey: function (f, e) {
										if (e.getKey() == e.ENTER) {
											setFilterLs();
										}
									}
								}
							}]
						}, {
							columnWidth: 0.15,
							layout: 'form',
							style: 'padding-right:10px',
							items: [{
								xtype: 'combobox',
								id: 'MitraJaya.view.Assets.Management.MainGrid-CategoryID',
								name: 'MitraJaya.view.Assets.Management.MainGrid-CategoryID',
								labelAlign: 'top',
								fieldLabel: 'Asset Category',
								store: thisObj.comboCategory,
								queryMode: 'local',
								displayField: 'label',
								valueField: 'id',
							}]
						}, {
							columnWidth: 0.2,
							layout: 'form',
							items: [{
								xtype: 'combobox',
								id: 'MitraJaya.view.Assets.Management.MainGrid-BrandID',
								name: 'MitraJaya.view.Assets.Management.MainGrid-BrandID',
								store: thisObj.comboBrand,
								labelAlign: 'top',
								fieldLabel: 'Brand',
								queryMode: 'local',
								displayField: 'label',
								valueField: 'id'
							}]
						}, {
							columnWidth: 0.15,
							layout: 'form',
							style: 'padding-right:10px',
							items: [{
								xtype: 'combobox',
								id: 'MitraJaya.view.Assets.Management.MainGrid-Year',
								name: 'MitraJaya.view.Assets.Management.MainGrid-Year',
								labelAlign: 'top',
								fieldLabel: 'Tahun Pembelian',
								store: thisObj.combo_year,
								queryMode: 'local',
								displayField: 'label',
								valueField: 'id',
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
								id: 'MitraJaya.view.Assets.Management.MainGrid-BtnApplyFilter',
								handler: function () {
									setFilterLs();
								}
							}]
						}]
					}]
				}]
			}]
		}, {
			xtype: 'grid',
			id: 'MitraJaya.view.Assets.Management.MainGrid-Grid',
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
					id: 'MitraJaya.view.Assets.Management.MainGrid-BtnAdd',
					handler: function () {
						Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid').destroy(); //destory current view
						var FormMainFarmer = [];

						//create object View untuk FormMainGrower
						if (Ext.getCmp('MitraJaya.view.Assets.Management.MainForm') == undefined) {
							FormMainFarmer = Ext.create('MitraJaya.view.Assets.Management.MainForm', {
								viewVar: {
									OpsiDisplay: 'insert',
									PanelDisplayID: null
								}
							});
						} else {
							//destroy, create ulang
							Ext.getCmp('MitraJaya.view.Assets.Management.MainForm').destroy();
							FormMainFarmer = Ext.create('MitraJaya.view.Assets.Management.MainForm', {
								viewVar: {
									OpsiDisplay: 'insert',
									PanelDisplayID: null
								}
							});
						}
					}
				}, {
					xtype: 'button',
					icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/download.svg',
					text: lang('Export'),
					cls: 'Sfr_BtnGridNewWhite',
					overCls: 'Sfr_BtnGridNewWhite-Hover',
					hidden: m_act_export_excel,
					id: 'MitraJaya.view.Assets.Management.MainGrid-BtnExport',
					handler: function () {
						var keySearch = Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-keySearch').getValue();
						var Month = Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-CategoryID').getValue();
						var Year = Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-Year').getValue();
						var CustomerID = Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-BrandID').getValue();

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
									url: m_api + '/v1/finance/invoice/export_invoice',
									method: 'POST',
									waitMsg: lang('Please Wait'),
									params: {
										keySearch: keySearch,
										Month: Month,
										Year: Year,
										CustomerID: CustomerID
									},
									success: function (data) {
										// console.log(data);
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
					icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/file-import.svg',
					text: lang('Import'),
					cls: 'Sfr_BtnGridNewWhite',
					overCls: 'Sfr_BtnGridNewWhite-Hover',
					hidden: m_act_add,
					id: 'MitraJaya.view.Assets.Management.MainGrid-BtnImport',
					handler: function () {
						var WinFormImportInvoice = Ext.create('MitraJaya.view.Finance.Invoice.WinFormImportInvoice');
						if (!WinFormImportInvoice.isVisible()) {
							WinFormImportInvoice.center();
							WinFormImportInvoice.show();
						} else {
							WinFormImportInvoice.close();
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
						var winAdvFilter = Ext.create('MitraJaya.view.Finance.Invoice.WinAdvancedFilter');
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
					id: 'MitraJaya.view.Assets.Management.MainGrid-BtnReload',
					handler: function () {
						Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-Grid').getStore().loadPage(1);
					}
				}]
			}],
			columns: [{
				text: '',
				xtype: 'actioncolumn',
				flex: 5,
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
				text: lang('AssetID'),
				dataIndex: 'AssetID',
				hidden: true
			}, {
				text: lang('Asset Number'),
				dataIndex: 'AssetCode',
				flex: 10
			}, {
				text: lang('Serial Number'),
				dataIndex: 'AssetExternalID',
				flex: 15
			}, {
				text: lang('Type'),
				dataIndex: 'CategoryName',
				flex: 15
			}, {
				text: lang('Brand'),
				dataIndex: 'BrandName',
				flex: 10
			}, {
				text: lang('Asset Name'),
				dataIndex: 'AssetName',
				flex: 10
			}, {
				text: lang('Year'),
				dataIndex: 'Year',
				flex: 15
			}, {
				text: lang('HPP'),
				dataIndex: 'HPP',
				flex: 15,
				renderer: function (t, meta, record) {
					let RetVal;

					RetVal = 'Rp ' + number_format(record.data.HPP, 2);

					return RetVal;
				}
			}]
		}];

		this.callParent(arguments);
	},
	submitOnEnterGrid: function (field, event) {
		localStorage.setItem('assets_ls', JSON.stringify({
			keySearch: Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-keySearch').getValue(),
			CategoryID: Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-CategoryID').getValue(),
			Year: Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-Year').getValue(),
			BrandID: Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-BrandID').getValue()
		}));
		Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-Grid').getStore().loadPage(1);
	}
});

function setFilterLs() {
	localStorage.setItem('assets_ls', JSON.stringify({
		keySearch: Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-keySearch').getValue(),
		CategoryID: Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-CategoryID').getValue(),
		Year: Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-Year').getValue(),
		BrandID: Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-BrandID').getValue()
	}));
	Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid-Grid').getStore().loadPage(1);
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
