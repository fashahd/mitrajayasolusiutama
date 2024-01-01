/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : MainGrid.js
 *******************************************/
Ext.define('MitraJaya.view.Admin.Payroll.MainGrid', {
	extend: 'Ext.panel.Panel',
	id: 'MitraJaya.view.Admin.Payroll.MainGrid',
	renderTo: 'ext-content',
	style: 'padding:0 7px 7px 7px;margin:2px 0 0 0;',
	listeners: {
		afterRender: function (component, eOpts) {
			var thisObj = this;
			document.getElementById('ContentTopBar').style.display = 'block';

			var budget_plan_src = JSON.parse(localStorage.getItem('budget_plan_src'));

			if (budget_plan_src) {
				Ext.getCmp('MitraJaya.view.Admin.Payroll.MainGrid-Year').setValue(budget_plan_src.Year);
				Ext.getCmp('MitraJaya.view.Admin.Payroll.MainGrid-Month').setValue(budget_plan_src.Month);
			}
		}
	},
	initComponent: function () {
		var thisObj = this;

		// console.log(m_api);
		//Store
		thisObj.StoreGridMain = Ext.create('MitraJaya.store.Admin.Payroll.MainGrid');
		thisObj.combo_month = Ext.create('MitraJaya.store.General.StoreMonth');

		thisObj.TotalIncomePlaning = 0;
		thisObj.TotalIncomeActual = 0;
		thisObj.TotalExpensePlaning = 0;
		thisObj.TotalExpenseActual = 0;

		thisObj.combo_year = Ext.create('MitraJaya.store.General.StoreYear', {
			storeVar: {
				yearRange: 20
			}
		});

		thisObj.GridEmployee = [{
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
							columnWidth: 0.3,
							layout: 'form',
							style: 'padding-right:10px',
							items: [{
								xtype: 'combobox',
								id: 'MitraJaya.view.Admin.Payroll.MainGrid-Month',
								name: 'MitraJaya.view.Admin.Payroll.MainGrid-Month',
								labelAlign: 'top',
								fieldLabel: 'Budget Period Month',
								store: thisObj.combo_month,
								queryMode: 'local',
								displayField: 'label',
								valueField: 'id',
								value: m_month
							}]
						}, {
							columnWidth: 0.3,
							layout: 'form',
							style: 'padding-right:10px',
							items: [{
								xtype: 'combobox',
								id: 'MitraJaya.view.Admin.Payroll.MainGrid-Year',
								name: 'MitraJaya.view.Admin.Payroll.MainGrid-Year',
								labelAlign: 'top',
								fieldLabel: 'Budget Period Year',
								store: thisObj.combo_year,
								queryMode: 'local',
								displayField: 'label',
								valueField: 'id',
								value: m_year
							}]
						}, {
							columnWidth: 0.2,
							layout: 'form',
							items: [{
								xtype: 'button',
								// icon: varjs.config.base_url + 'images/icons/new/add-filter.png',
								text: lang('Search'),
								style: 'margin-left:20px; margin-top:30px',
								cls: 'Sfr_BtnFormCyan',
								overCls: 'Sfr_BtnFormCyan-Hover',
								id: 'MitraJaya.view.Admin.Payroll.MainGrid-BtnApplyFilter',
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
			id: 'MitraJaya.view.Admin.Payroll.MainGrid-Grid',
			style: 'border:1px solid #CCC;margin-top:4px;',
			cls: 'Sfr_GridNew',
			minHeight: 600,
			loadMask: true,
			selType: 'rowmodel',
			features: [{
				groupHeaderTpl: '{name}',
				ftype: 'groupingsummary',
				collapsible: false,
			}],
			store: thisObj.StoreGridMain,
			enableColumnHide: false,
			viewConfig: {
				deferEmptyText: false,
				emptyText: GetDefaultContentNoData()
			},
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				items: [{
					html: '<div>Payroll</div>'
				}, {
					xtype: 'tbspacer',
					flex: 1
				}, {
					xtype: 'button',
					icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/signature.svg',
					text: lang('Setting Payroll'),
					cls: 'Sfr_BtnGridNewWhite',
					overCls: 'Sfr_BtnGridNewWhite-Hover',
					hidden: m_act_update,
					id: 'MitraJaya.view.Admin.Payroll.MainGrid-Income-Grid-BtnSignature',
					handler: function () {
						var WinFormSettingPayroll = Ext.create('MitraJaya.view.Admin.Payroll.WinFormSettingPayroll');
						WinFormSettingPayroll.setViewVar({
							CallerStore: thisObj.StoreGridMain
						});
						if (!WinFormSettingPayroll.isVisible()) {
							WinFormSettingPayroll.center();
							WinFormSettingPayroll.show();
						} else {
							WinFormSettingPayroll.close();
						}

					}
				}, {
					xtype: 'button',
					icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/pen-to-square.svg',
					text: lang('Update'),
					cls: 'Sfr_BtnGridNewWhite',
					overCls: 'Sfr_BtnGridNewWhite-Hover',
					hidden: m_act_update,
					id: 'MitraJaya.view.Admin.Payroll.MainGrid-Income-Grid-BtnUpdate',
					handler: function () {
						let sm = Ext.getCmp('MitraJaya.view.Admin.Payroll.MainGrid-Grid').getSelectionModel().getSelection()[0];
						let month = Ext.getCmp('MitraJaya.view.Admin.Payroll.MainGrid-Month').getValue();
						let year = Ext.getCmp('MitraJaya.view.Admin.Payroll.MainGrid-Year').getValue();

						if (sm == undefined) {
							Swal.fire(
								'Please Select Data!',
								'',
								'warning'
							)
							return false;
						}

						if (sm.data.people_id == '' || sm.data.people_id == null) {
							Swal.fire(
								'Please Select Data!',
								'',
								'warning'
							)
							return false;
						}

						var WinFormPayroll = Ext.create('MitraJaya.view.Admin.Payroll.WinFormPayroll');
						WinFormPayroll.setViewVar({
							OpsiDisplay: 'update',
							people_id: sm.data.people_id,
							month: month,
							year: year,
							CallerStore: thisObj.StoreGridMain
						});
						if (!WinFormPayroll.isVisible()) {
							WinFormPayroll.center();
							WinFormPayroll.show();
						} else {
							WinFormPayroll.close();
						}

					}
				}, {
					xtype: 'button',
					icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/paperclip.svg',
					text: lang('Slip Gaji'),
					cls: 'Sfr_BtnGridNewWhite',
					overCls: 'Sfr_BtnGridNewWhite-Hover',
					hidden: m_act_update,
					id: 'MitraJaya.view.Admin.Payroll.MainGrid-Income-Grid-BtnSlipGaji',
					handler: function () {
						let sm = Ext.getCmp('MitraJaya.view.Admin.Payroll.MainGrid-Grid').getSelectionModel().getSelection()[0];
						let month = Ext.getCmp('MitraJaya.view.Admin.Payroll.MainGrid-Month').getValue();
						let year = Ext.getCmp('MitraJaya.view.Admin.Payroll.MainGrid-Year').getValue();

						if (sm == undefined) {
							Swal.fire(
								'Please Select Data!',
								'',
								'warning'
							)
							return false;
						}

						if (sm.data.people_id == '' || sm.data.people_id == null) {
							Swal.fire(
								'Please Select Data!',
								'',
								'warning'
							)
							return false;
						}

						var url = m_api + '/v1/admin/payroll/print_pay_slip';
						preview_cetak_surat(url + '?people_id=' + sm.data.people_id + '&month=' + month + '&year=' + year);

					}
				}, {
					xtype: 'button',
					icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/file-export.svg',
					text: lang('Share'),
					cls: 'Sfr_BtnGridNewWhite',
					overCls: 'Sfr_BtnGridNewWhite-Hover',
					style: 'margin-top:25px',
					id: 'MitraJaya.view.Finance.OrderBook.MainGrid-BtnExport',
					handler: function () {
						let sm = Ext.getCmp('MitraJaya.view.Admin.Payroll.MainGrid-Grid').getSelectionModel().getSelection()[0];
						let month = Ext.getCmp('MitraJaya.view.Admin.Payroll.MainGrid-Month').getValue();
						let year = Ext.getCmp('MitraJaya.view.Admin.Payroll.MainGrid-Year').getValue();

						if (sm == undefined) {
							Swal.fire(
								'Please Select Data!',
								'',
								'warning'
							)
							return false;
						}

						if (sm.data.people_id == '' || sm.data.people_id == null) {
							Swal.fire(
								'Please Select Data!',
								'',
								'warning'
							)
							return false;
						}

						Swal.fire({
							text: "Share this to user ?",
							icon: 'warning',
							showCancelButton: true,
							confirmButtonColor: '#3085d6',
							cancelButtonColor: '#d33',
							confirmButtonText: 'Yes, Share it!'
						}).then((result) => {
							if (result.isConfirmed) {
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

								Ext.Ajax.request({
									url: m_api + '/v1/admin/payroll/share_payroll',
									method: 'GET',
									waitMsg: lang('Please Wait'),
									params: {
										month: month,
										year: year,
										people_id: sm.data.people_id
									},
									success: function (data) {
										let response = JSON.parse(data.responseText);
										Ext.MessageBox.hide();

										Swal.fire({
											icon: response.desc,
											text: response.message,
											// footer: '<a href="">Why do I have this issue?</a>'
										})
									},
									failure: function (err) {
										let response = JSON.parse(err.responseText);
										Ext.MessageBox.hide();
										Swal.fire({
											icon: response.desc,
											text: response.message,
											// footer: '<a href="">Why do I have this issue?</a>'
										})
									}
								});
							}
						});
					}
				}, {
					xtype: 'button',
					icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/recycle.svg',
					cls: 'Sfr_BtnGridBlue',
					overCls: 'Sfr_BtnGridBlue-Hover',
					id: 'MitraJaya.view.Admin.Payroll.MainGrid-BtnReload',
					handler: function () {
						Ext.getCmp('MitraJaya.view.Admin.Payroll.MainGrid-Grid').getStore().loadPage(1);
					}
				}]
			}],
			columns: [{
				text: lang('Employee ID'),
				dataIndex: 'people_id',
				hidden: true,
				flex: 1
			}, {
				text: 'No',
				flex: 0.1,
				xtype: 'rownumberer'
			}, {
				text: lang('Employee ID'),
				dataIndex: 'people_ext_id',
				flex: 1
			}, {
				text: lang('Employee Name'),
				dataIndex: 'people_name',
				flex: 1
			}, {
				text: lang('Bruto Salary'),
				dataIndex: 'salary',
				flex: 1,
				renderer: function (t, meta, record) {
					let RetVal;

					RetVal = 'Rp ' + number_format(record.data.salary, 2);

					return RetVal;
				}
			}, {
				text: lang('Incentive'),
				dataIndex: 'incentive',
				flex: 1,
				renderer: function (t, meta, record) {
					let RetVal;

					RetVal = 'Rp ' + number_format(record.data.incentive, 2);

					return RetVal;
				}
			}, {
				text: lang('Deduction'),
				dataIndex: 'deduction',
				flex: 1,
				renderer: function (t, meta, record) {
					let RetVal;

					RetVal = 'Rp ' + number_format(record.data.deduction, 2);

					return RetVal;
				}
			}, {
				text: lang('Nett Salary'),
				dataIndex: 'net_salary',
				flex: 1,
				renderer: function (t, meta, record) {
					let RetVal;

					RetVal = 'Rp ' + number_format(record.data.net_salary, 2);

					return RetVal;
				}
			}],
			listeners: {
				afterrender: {
					fn: function (grid) {
					}
				}
			}
		}];

		thisObj.items = [{
			layout: 'column',
			border: false,
			items: [{
				//LEFT CONTENT
				columnWidth: 1,
				items: thisObj.GridEmployee
			}]
		}];

		this.callParent(arguments);
	},
	submitOnEnterGrid: function (field, event) {
		localStorage.setItem('budget_plan_src', JSON.stringify({
			Year: Ext.getCmp('MitraJaya.view.Admin.Payroll.MainGrid-Year').getValue()
		}));
		Ext.getCmp('MitraJaya.view.Admin.Payroll.MainGrid-Grid').getStore().loadPage(1);
		Ext.getCmp('MitraJaya.view.Admin.Payroll.MainGrid-Expense-Grid').getStore().loadPage(1);
	}
});

function setFilterLs() {
	localStorage.setItem('budget_plan_src', JSON.stringify({
		Year: Ext.getCmp('MitraJaya.view.Admin.Payroll.MainGrid-Year').getValue(),
		Month: Ext.getCmp('MitraJaya.view.Admin.Payroll.MainGrid-Month').getValue()
	}));

	Ext.getCmp('MitraJaya.view.Admin.Payroll.MainGrid-Grid').getStore().loadPage(1);
	Ext.getCmp('MitraJaya.view.Admin.Payroll.MainGrid-Expense-Grid').getStore().loadPage(1);
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
