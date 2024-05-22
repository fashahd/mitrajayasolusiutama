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

Ext.define('MitraJaya.view.Finance.Claim.MainForm', {
	extend: 'Ext.panel.Panel',
	id: 'MitraJaya.view.Finance.Claim.MainForm',
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
			if (m_groupid == '7') {
				Ext.getCmp('MitraJaya.view.Finance.Claim.MainForm-FormBasicData-EmployeeID').setReadOnly(true);
			}

			if (thisObj.viewVar.OpsiDisplay == 'insert') {
				Ext.getCmp('MitraJaya.view.Finance.Claim.MainForm-FormBasicData-EmployeeID').setValue(m_people_id);
			}

			if (thisObj.viewVar.OpsiDisplay == 'view' || thisObj.viewVar.OpsiDisplay == 'update') {
				//default
				if (thisObj.viewVar.OpsiDisplay == 'view') {
					Ext.getCmp('MitraJaya.view.Finance.Claim.MainForm-FormBasicData-BtnSave').setVisible(false);
				}

				//load formnya
				Ext.getCmp('MitraJaya.view.Finance.Claim.MainForm-FormBasicData').getForm().load({
					url: m_api + '/v1/finance/claim/form_claim',
					method: 'GET',
					params: {
						ClaimID: this.viewVar.ClaimID
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
		thisObj.combo_project = Ext.create('MitraJaya.store.General.ProjectList');
		thisObj.combo_department = Ext.create('MitraJaya.store.General.DepartmentList');

		//Panel Basic ==================================== (Begin)
		thisObj.ObjPanelBasicData = Ext.create('Ext.panel.Panel', {
			title: 'Claim Data',
			frame: true,
			cls: 'Sfr_PanelLayoutForm',
			id: 'MitraJaya.view.Finance.Claim.MainForm-Panel',
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
						id: 'MitraJaya.view.Finance.Claim.MainForm-FormBasicData',
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
									id: 'MitraJaya.view.Finance.Claim.MainForm-FormBasicData-ClaimID',
									name: 'MitraJaya.view.Finance.Claim.MainForm-FormBasicData-ClaimID'
								}, {
									xtype: 'textfield',
									fieldLabel: 'Document Number',
									labelAlign: 'top',
									id: 'MitraJaya.view.Finance.Claim.MainForm-FormBasicData-DocNumber',
									name: 'MitraJaya.view.Finance.Claim.MainForm-FormBasicData-DocNumber'
								}, {
									xtype: 'datefield',
									id: 'MitraJaya.view.Finance.Claim.MainForm-FormBasicData-ClaimDate',
									name: 'MitraJaya.view.Finance.Claim.MainForm-FormBasicData-ClaimDate',
									labelAlign: 'top',
									fieldLabel: 'Claim Date',
									format: 'Y-m-d',
									value: new Date(),
									allowBlank: false,
									baseCls: 'Sfr_FormInputMandatory'
								}, {
									xtype: 'combobox',
									id: 'MitraJaya.view.Finance.Claim.MainForm-FormBasicData-EmployeeID',
									name: 'MitraJaya.view.Finance.Claim.MainForm-FormBasicData-EmployeeID',
									store: thisObj.combo_employee_project,
									labelAlign: 'top',
									fieldLabel: 'Cost out By',
									queryMode: 'local',
									displayField: 'label',
									valueField: 'id'
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
									xtype: 'textfield',
									labelAlign: 'top',
									id: 'MitraJaya.view.Finance.Claim.MainForm-FormBasicData-Location',
									name: 'MitraJaya.view.Finance.Claim.MainForm-FormBasicData-Location',
									fieldLabel: 'Location'
								}, {
									xtype: 'combobox',
									id: 'MitraJaya.view.Finance.Claim.MainForm-FormBasicData-ProjectID',
									name: 'MitraJaya.view.Finance.Claim.MainForm-FormBasicData-ProjectID',
									store: thisObj.combo_project,
									labelAlign: 'top',
									fieldLabel: 'Project',
									queryMode: 'local',
									displayField: 'label',
									valueField: 'id'
								},{
									xtype: 'numericfield',
									labelAlign: 'top',
									id: 'MitraJaya.view.Finance.Claim.MainForm-FormBasicData-TotalAmount',
									name: 'MitraJaya.view.Finance.Claim.MainForm-FormBasicData-TotalAmount',
									fieldLabel: 'Total Amount'
								}, ]
							}]
						}],
						buttons: [{
							xtype: 'button',
							icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/floppy-disk.svg',
							text: 'Save',
							cls: 'Sfr_BtnFormBlue',
							overCls: 'Sfr_BtnFormBlue-Hover',
							id: 'MitraJaya.view.Finance.Claim.MainForm-FormBasicData-BtnSave',
							handler: function () {
								var Formnya = Ext.getCmp('MitraJaya.view.Finance.Claim.MainForm-FormBasicData').getForm();

								if (Formnya.isValid()) {

									Formnya.submit({
										url: m_api + '/v1/finance/claim/submit_claim',
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
													Ext.getCmp('MitraJaya.view.Finance.Claim.MainForm').destroy(); //destory current view
													var MainForm = [];
													if (Ext.getCmp('MitraJaya.view.Finance.Claim.MainForm') == undefined) {
														MainForm = Ext.create('MitraJaya.view.Finance.Claim.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																ClaimID: o.result.ClaimID,
																LoanType: o.result.LoanType
															}
														});
													} else {
														Ext.getCmp('MitraJaya.view.Finance.Claim.MainForm').destroy();
														MainForm = Ext.create('MitraJaya.view.Finance.Claim.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																ClaimID: o.result.ClaimID,
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

		let ObjPanelGridClaim = [];

		if (thisObj.viewVar.OpsiDisplay == 'view' || thisObj.viewVar.OpsiDisplay == 'update') {
			thisObj.ObjPanelClaim = Ext.create('MitraJaya.view.Finance.Claim.GridClaimDetail', {
				viewVar: {
					ClaimID: thisObj.viewVar.ClaimID
				}
			});
			ObjPanelGridClaim.push(thisObj.ObjPanelClaim);
		}

		//============================= End DQ =========================================//

		//========================================================== LAYOUT UTAMA (Begin) ========================================//
		thisObj.items = [{
			xtype: 'panel',
			border: false,
			layout: {
				type: 'hbox'
			},
			items: [{
				id: 'MitraJaya.view.Finance.Claim.MainForm-labelInfoInsert',
				html: '<div id="header_title_farmer">' + 'Claim Data' + '</div>'
			}]
		}, {
			items: [{
				id: 'MitraJaya.view.Finance.Claim.MainForm-LinkBackToList',
				html: '<div id="Sfr_IdBoxInfoDataGrid" class="Sfr_BoxInfoDataGridForm"><ul class="Sft_UlListInfoDataGrid">'
					+ '<li class="Sft_ListInfoDataGrid"><a href="javascript:Ext.getCmp(\'MitraJaya.view.Finance.Claim.MainForm\').BackToList()">'
					+ '<img class="Sft_ListIconInfoDataGrid" src="' + varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/circle-chevron-left.svg" width="20" />&nbsp;&nbsp;' + 'Back to Claim List' + '</a></li></div>'
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
				columnWidth: 0.43,
				layout: 'form',
				style: 'padding:0px 0px 10px 10px;',
				items: ObjPanelGridClaim
			}]
		}];
		//========================================================== LAYOUT UTAMA (END) ========================================//

		this.callParent(arguments);
	},
	BackToList: function () {
		Ext.getCmp('MitraJaya.view.Finance.Claim.MainForm').destroy(); //destory current view
		var GridMainGrower = [];
		if (Ext.getCmp('MitraJaya.view.Finance.Claim.MainGrid') == undefined) {
			GridMainGrower = Ext.create('MitraJaya.view.Finance.Claim.MainGrid');
		} else {
			//destroy, create ulang
			Ext.getCmp('MitraJaya.view.Finance.Claim.MainGrid').destroy();
			GridMainGrower = Ext.create('MitraJaya.view.Finance.Claim.MainGrid');
		}
	}
});
