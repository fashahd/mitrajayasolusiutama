/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : GridLoanPayment.js
 *******************************************/
Ext.define('MitraJaya.view.Finance.Claim.GridClaimDetail', {
	extend: 'Ext.panel.Panel',
	id: 'MitraJaya.view.Finance.Claim.GridClaimDetail',
	title: 'Claim Detail',
	listeners: {
		afterRender: function (component, eOpts) {
			var thisObj = this;
		}
	},
	initComponent: function () {
		var thisObj = this;

		// console.log(m_api);
		//Store
		thisObj.StoreGridMain = Ext.create('MitraJaya.store.Finance.Claim.GridClaimDetail', {
			storeVar: {
				ClaimID: thisObj.viewVar.ClaimID
			}
		});


		thisObj.combo_company = Ext.create('MitraJaya.store.General.CompanyList', {
			storeVar: {
				CustomerID: ''
			}
		});

		thisObj.items = [{
			xtype: 'grid',
			id: 'MitraJaya.view.Finance.Claim.GridClaimDetail-Grid',
			style: 'border:1px solid #CCC;margin-top:4px;',
			cls: 'Sfr_GridNew',
			minHeight: 600,
			loadMask: true,
			selType: 'rowmodel',
			store: thisObj.StoreGridMain,
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
					cls: 'Sfr_BtnGridNewWhite',
					overCls: 'Sfr_BtnGridNewWhite-Hover',
					id: 'MitraJaya.view.Finance.Claim.GridClaimDetail-Grid-BtnAdd',
					handler: function () {
						var WinFormClaimDetail = Ext.create('MitraJaya.view.Finance.Claim.WinFormClaimDetail');
						WinFormClaimDetail.setViewVar({
							OpsiDisplay: 'insert',
							CallerStore: thisObj.StoreGridMain,
							ClaimID: thisObj.viewVar.ClaimID
						});
						if (!WinFormClaimDetail.isVisible()) {
							WinFormClaimDetail.center();
							WinFormClaimDetail.show();
						} else {
							WinFormClaimDetail.close();
						}
					}
				}, {
					xtype: 'button',
					icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/pen-to-square.svg',
					text: 'View',
					cls: 'Sfr_BtnGridNewWhite',
					overCls: 'Sfr_BtnGridNewWhite-Hover',
					id: 'MitraJaya.view.Finance.Claim.GridClaimDetail-Grid-BtnView',
					handler: function () {
						var sm = Ext.getCmp('MitraJaya.view.Finance.Claim.GridClaimDetail-Grid').getSelectionModel().getSelection()[0];

						// console.log(sm);

						if (sm == undefined) {
							Swal.fire(
								'Please Select Data!',
								'',
								'warning'
							)
							return false;
						}

						if (sm.data.BudgetPlanID == '') {
							Swal.fire(
								'Please Select Data!',
								'',
								'warning'
							)
							return false;
						}

						var WinFormClaimDetail = Ext.create('MitraJaya.view.Finance.Claim.WinFormClaimDetail');
						WinFormClaimDetail.setViewVar({
							OpsiDisplay: 'view',
							CallerStore: thisObj.StoreGridMain,
							ClaimID: thisObj.viewVar.ClaimID,
							ClaimDetailID: sm.get('ClaimDetailID')
						});
						if (!WinFormClaimDetail.isVisible()) {
							WinFormClaimDetail.center();
							WinFormClaimDetail.show();
						} else {
							WinFormClaimDetail.close();
						}

					}
				}, {
					xtype: 'button',
					icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/pen-to-square.svg',
					text: 'Update',
					cls: 'Sfr_BtnGridNewWhite',
					overCls: 'Sfr_BtnGridNewWhite-Hover',
					hidden: m_act_update,
					id: 'MitraJaya.view.Finance.Claim.GridClaimDetail-Grid-BtnUpdate',
					handler: function () {
						var sm = Ext.getCmp('MitraJaya.view.Finance.Claim.GridClaimDetail-Grid').getSelectionModel().getSelection()[0];

						// console.log(sm);

						if (sm == undefined) {
							Swal.fire(
								'Please Select Data!',
								'',
								'warning'
							)
							return false;
						}

						if (sm.data.BudgetPlanID == '') {
							Swal.fire(
								'Please Select Data!',
								'',
								'warning'
							)
							return false;
						}

						var WinFormClaimDetail = Ext.create('MitraJaya.view.Finance.Claim.WinFormClaimDetail');
						WinFormClaimDetail.setViewVar({
							OpsiDisplay: 'update',
							CallerStore: thisObj.StoreGridMain,
							ClaimID: thisObj.viewVar.ClaimID,
							ClaimDetailID: sm.get('ClaimDetailID')
						});
						if (!WinFormClaimDetail.isVisible()) {
							WinFormClaimDetail.center();
							WinFormClaimDetail.show();
						} else {
							WinFormClaimDetail.close();
						}

					}
				}, {
					xtype: 'button',
					icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eraser.svg',
					text: 'Delete',
					cls: 'Sfr_BtnGridNewWhite',
					overCls: 'Sfr_BtnGridNewWhite-Hover',
					hidden: m_act_delete,
					id: 'MitraJaya.view.Finance.Claim.GridClaimDetail-Grid-BtnDelete',
					handler: function () {
						var sm = Ext.getCmp('MitraJaya.view.Finance.Claim.GridClaimDetail-Grid').getSelectionModel().getSelection()[0];

						if (sm == undefined) {
							Swal.fire(
								'Please Select Data!',
								'',
								'warning'
							)
							return false;
						}

						if (sm.data.BudgetPlanID == '') {
							Swal.fire(
								'Please Select Data!',
								'',
								'warning'
							)
							return false;
						}

						var sm = Ext.getCmp('MitraJaya.view.Finance.Claim.GridClaimDetail-Grid').getSelectionModel().getSelection()[0];

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
									url: m_api + '/v1/finance/claim/delete_claim_detail',
									method: 'DELETE',
									params: {
										ClaimDetailID: sm.get('ClaimDetailID')
									},
									success: function (response, opts) {
										Swal.fire(
											'Deleted!',
											'Your file has been deleted.',
											'success'
										)

										//refresh store
										thisObj.StoreGridMain.load();

										//load formnya
										Ext.getCmp('MitraJaya.view.Finance.Claim.MainForm-FormBasicData').getForm().load({
											url: m_api + '/v1/finance/claim/form_claim',
											method: 'GET',
											params: {
												ClaimID: thisObj.viewVar.ClaimID
											},
											success: function (form, action) {
												// Ext.MessageBox.hide();
												var r = Ext.decode(action.response.responseText);
												//Title
												// Ext.getCmp('MitraJaya.view.Finance.Claim.MainForm-labelInfoInsert').update('<div id="header_title_farmer">' + Ext.getCmp('MitraJaya.view.Finance.Claim.MainForm-FormBasicData-ClaimID').getValue() + ' - <strong>' + Ext.getCmp('MitraJaya.view.Finance.Claim.MainForm-FormBasicData-SupplierName').getValue() + '</strong></div>');
												Ext.getCmp('MitraJaya.view.Finance.Claim.MainForm-labelInfoInsert').doLayout();
											},
											failure: function (form, action) {
												Swal.fire({
													icon: 'error',
													text: 'Failed to Retreive Data',
													// footer: '<a href="">Why do I have this issue?</a>'
												})
											}
										});
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
			}],
			columns: [{
				text: 'No',
				flex: 1,
				xtype: 'rownumberer'
			}, {
				text: 'ClaimDetailID',
				dataIndex: 'ClaimDetailID',
				hidden: true
			}, {
				text: 'Cost Element',
				dataIndex: 'CostElement',
				flex: 10
			}, {
				text: 'Date',
				dataIndex: 'ClaimDetailDate',
				flex: 10
			}, {
				text: 'Description',
				dataIndex: 'Description',
				flex: 20
			}, {
				text: 'Amount',
				dataIndex: 'Amount',
				flex: 15,
				renderer: function (t, meta, record) {
					let RetVal;

					RetVal = 'Rp ' + number_format(record.data.Amount, 2);

					return RetVal;
				}
			}]
		}];

		this.callParent(arguments);
	}
});

function fetchJSON(text) {
	try {
		JSON.parse(text);
		return true;
	}
	catch (error) {
		return false;
	}
}
