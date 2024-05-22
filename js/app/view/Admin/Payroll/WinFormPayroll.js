/******************************************
 *  Author : n1colius.lau@gmail.com   
 *  Created On : Wed Jan 22 2020
 *  File : WinFormFamily.js
 *******************************************/

/*
	Param2 yg diperlukan ketika load View ini
	- OpsiDisplay
	- SupplierID
	- SupFamID
	- CallerStore
*/

Ext.define('MitraJaya.view.Admin.Payroll.WinFormPayroll', {
	extend: 'Ext.window.Window',
	id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll',
	cls: 'Sfr_LayoutPopupWindows',
	title: 'Payroll Form',
	closable: true,
	modal: true,
	closeAction: 'destroy',
	width: '40%',
	height: 800,
	overflowY: 'auto',
	viewVar: false,
	setViewVar: function (value) {
		this.viewVar = value;
	},
	initComponent: function () {
		var thisObj = this;
		thisObj.combo_month = Ext.create('MitraJaya.store.General.StoreMonth');

		thisObj.combo_year = Ext.create('MitraJaya.store.General.StoreYear', {
			storeVar: {
				yearRange: 20
			}
		});

		//items -------------------------------------------------------------- (begin)
		thisObj.items = Ext.create('Ext.panel.Panel', {
			frame: false,
			items: [{
				layout: 'column',
				border: false,
				padding: 10,
				items: [{
					columnWidth: 1,
					style: 'padding:0px 10px 0px 20px',
					layout: 'form',
					items: [{
						xtype: 'form',
						id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData',
						fileUpload: true,
						buttonAlign: 'center',

						items: [{
							layout: 'column',
							border: false,
							items: [{
								columnWidth: 0.5,
								layout: 'form',
								style: 'padding:10px 15px 10px 5px;',
								items: [{
									xtype: 'textfield',
									inputType: 'hidden',
									id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-people_id',
									name: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-people_id'
								}, {
									xtype: 'combobox',
									readOnly: true,
									id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-year',
									name: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-year',
									labelAlign: 'top',
									fieldLabel: 'Period Year',
									store: thisObj.combo_year,
									queryMode: 'local',
									displayField: 'label',
									valueField: 'id'
								}, {
									html: '<div style="margin-bottom:10px"></div>'
								}, {
									xtype: 'numericfield',
									labelAlign: 'top',
									id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-salary',
									name: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-salary',
									fieldLabel: 'Bruto Salary'
								}]
							}, {
								columnWidth: 0.5,
								layout: 'form',
								style: 'padding:10px 0px 10px 5px;',
								items: [{
									xtype: 'combobox',
									readOnly: true,
									id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-month',
									name: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-month',
									labelAlign: 'top',
									fieldLabel: 'Budget Period Month',
									store: thisObj.combo_month,
									queryMode: 'local',
									displayField: 'label',
									valueField: 'id'
								}, {
									xtype: 'datefield',
									id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-date_state',
									name: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-date_state',
									labelAlign: 'top',
									format: 'Y-m-d',
									fieldLabel: 'Payroll Date',
									allowBlank: false,
									baseCls: 'Sfr_FormInputMandatory'
								}, {
									xtype: 'button',
									icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/download.svg',
									text: 'Prefill Data From Before',
									cls: 'Sfr_BtnGridNewWhite',
									overCls: 'Sfr_BtnGridNewWhite-Hover',
									style: 'margin-top:25px',
									id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-BtnDownload',
									handler: function () {
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

										var year = Ext.getCmp('MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-year').getValue();
										var month = Ext.getCmp('MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-month').getValue();

										//load data form
										Ext.getCmp('MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData').getForm().load({
											url: m_api + '/v1/admin/payroll/form_prefill_payroll',
											method: 'GET',
											params: {
												Month: month,
												Year: year,
												people_id: thisObj.viewVar.people_id
											},
											success: function (form, action) {
												// Ext.MessageBox.hide();
												var r = Ext.decode(action.response.responseText);

												Ext.MessageBox.hide();
											},
											failure: function (form, action) {

												Ext.MessageBox.hide();
												Swal.fire({
													icon: 'error',
													text: 'Failed to Retreive Data',
												});
											}
										});
									}
								}]
							}, {
								columnWidth: 1,
								layout: 'form',
								style: 'padding:10px 15px 0px 5px;',
								items: [{
									xtype: 'panel',
									title: 'Insentif',
									frame: false,
									id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-SectionInsentif',
									style: 'margin-top:12px;',
									cls: 'Sfr_PanelSubLayoutFormRoundedGray',
									items: [{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											style: 'padding:10px 0px 10px 5px;',
											defaults: {
												labelAlign: 'left',
												labelWidth: 150
											},
											items: [{
												xtype: 'numericfield',
												labelAlign: 'top',
												id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-insentif_transportasi',
												name: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-insentif_transportasi',
												fieldLabel: 'Transportasi'
											}, {
												xtype: 'numericfield',
												labelAlign: 'top',
												id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-insentif_komunikasi',
												name: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-insentif_komunikasi',
												fieldLabel: 'Komunikasi'
											}, {
												xtype: 'numericfield',
												labelAlign: 'top',
												id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-insentif_lembur',
												name: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-insentif_lembur',
												fieldLabel: 'Lembur'
											}]
										}, {
											columnWidth: 0.5,
											layout: 'form',
											style: 'padding:10px 0px 10px 5px;',
											defaults: {
												labelAlign: 'left',
												labelWidth: 150
											},
											items: [{
												xtype: 'numericfield',
												labelAlign: 'top',
												id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-insentif_bonus',
												name: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-insentif_bonus',
												fieldLabel: 'Bonus'
											}, {
												xtype: 'numericfield',
												labelAlign: 'top',
												id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-insentif_thr',
												name: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-insentif_thr',
												fieldLabel: 'THR'
											}]
										}]
									}]
								}]
							}, {
								columnWidth: 1,
								layout: 'form',
								style: 'padding:0px 15px 10px 5px;',
								items: [{
									xtype: 'panel',
									title: 'Deduction',
									frame: false,
									id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-SectionDeduction',
									style: 'margin-top:12px;',
									cls: 'Sfr_PanelSubLayoutFormRoundedGray',
									items: [{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											style: 'padding:10px 0px 10px 5px;',
											defaults: {
												labelAlign: 'left',
												labelWidth: 150
											},
											items: [{
												xtype: 'numericfield',
												labelAlign: 'top',
												id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-deduction_bpjs_tk',
												name: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-deduction_bpjs_tk',
												fieldLabel: 'BPJS TK'
											}, {
												xtype: 'numericfield',
												labelAlign: 'top',
												id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-deduction_bpjs_kesehatan',
												name: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-deduction_bpjs_kesehatan',
												fieldLabel: 'BPJS Kesehatan'
											}, {
												xtype: 'numericfield',
												labelAlign: 'top',
												id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-deduction_kasbon',
												name: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-deduction_kasbon',
												fieldLabel: 'Kasbon'
											}]
										}, {
											columnWidth: 0.5,
											layout: 'form',
											style: 'padding:10px 0px 10px 5px;',
											defaults: {
												labelAlign: 'left',
												labelWidth: 150
											},
											items: [{
												xtype: 'numericfield',
												labelAlign: 'top',
												id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-deduction_pph_21_insentif',
												name: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-deduction_pph_21_insentif',
												fieldLabel: 'PPH 21 Insentif'
											}, {
												xtype: 'numericfield',
												labelAlign: 'top',
												id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-deduction_pph_21',
												name: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-deduction_pph_21',
												fieldLabel: 'PPH 21 Gaji'
											}, {
												xtype: 'numericfield',
												labelAlign: 'top',
												id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-deduction_pph_21_kompensasi',
												name: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-deduction_pph_21_kompensasi',
												fieldLabel: 'PPH 21 Kompensasi'
											}, {
												xtype: 'numericfield',
												labelAlign: 'top',
												id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-deduction_pph_21_thr',
												name: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-deduction_pph_21_thr',
												fieldLabel: 'PPH 21 THR'
											}]
										}]
									}]
								}]
							}, {
								columnWidth: 1,
								layout: 'form',
								style: 'padding:0px 15px 10px 5px;',
								items: [{
									xtype: 'panel',
									title: 'Note',
									frame: false,
									id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-SectionNote',
									style: 'margin-top:12px;',
									cls: 'Sfr_PanelSubLayoutFormRoundedGray',
									items: [{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 1,
											layout: 'form',
											style: 'padding:10px 0px 10px 5px;',
											defaults: {
												labelAlign: 'left',
												labelWidth: 150
											},
											items: [{
												xtype: 'textfield',
												labelAlign: 'top',
												id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-notes',
												name: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-notes',
												fieldLabel: 'Notes'
											}]
										}]
									}]
								}]
							}]
						}]
					}]
				}]
			}]
		});
		//items -------------------------------------------------------------- (end)

		//buttons -------------------------------------------------------------- (begin)
		thisObj.buttons = [{
			icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/floppy-disk.svg',
			text: 'Save',
			cls: 'Sfr_BtnFormBlue',
			overCls: 'Sfr_BtnFormBlue-Hover',
			id: 'MitraJaya.view.Admin.Payroll.WinFormPayroll-BtnSave',
			handler: function () {
				var Formnya = Ext.getCmp('MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData').getForm();

				if (Formnya.isValid()) {

					Formnya.submit({
						url: m_api + '/v1/admin/payroll/submit_payroll',
						method: 'POST',
						waitMsg: 'Saving data...',
						params: {
							OpsiDisplay: thisObj.viewVar.OpsiDisplay
						},
						success: function (fp, o) {

							thisObj.viewVar.CallerStore.load();

							//tutup popup
							thisObj.close();

							Swal.fire({
								text: "Data saved",
								icon: 'success',
								confirmButtonColor: '#3085d6',
							}).then((result) => {
								if (result.isConfirmed) {
									thisObj.close();
								}
							})
						},
						failure: function (fp, o) {
							try {
								var r = Ext.decode(o.response.responseText);

								Ext.MessageBox.show({
									title: 'Error',
									msg: r.message,
									buttons: Ext.MessageBox.OK,
									animateTarget: 'mb9',
									icon: 'ext-mb-info'
								});
							} catch (err) {
								Ext.MessageBox.show({
									title: 'Error',
									msg: 'Connection Error',
									buttons: Ext.MessageBox.OK,
									animateTarget: 'mb9',
									icon: 'ext-mb-info'
								});
							}
						}
					});

				} else {
					// Ext.MessageBox.show({
					// 	title: 'Attention',
					// 	msg: 'Form not complete yet',
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
		}, {
			icon: varjs.config.base_url + 'images/icons/new/close.png',
			text: 'Close',
			cls: 'Sfr_BtnFormGrey',
			overCls: 'Sfr_BtnFormGrey-Hover',
			handler: function () {
				thisObj.close();
			}
		}];
		//buttons -------------------------------------------------------------- (end)

		this.callParent(arguments);
	},
	listeners: {
		afterRender: function () {
			var thisObj = this;
			// Map Initialize

			// Conditionanl Add Newa or view/update
			if (thisObj.viewVar.OpsiDisplay == 'view') {
				Ext.getCmp('MitraJaya.view.Admin.Payroll.WinFormPayroll-BtnSave').setVisible(false);
			}

			//load data form
			Ext.getCmp('MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData').getForm().load({
				url: m_api + '/v1/admin/payroll/form_payroll',
				method: 'GET',
				params: {
					Month: thisObj.viewVar.month,
					Year: thisObj.viewVar.year,
					people_id: thisObj.viewVar.people_id
				},
				success: function (form, action) {
					// Ext.MessageBox.hide();
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
	AddValidationBasicForm: function () {
		var thisObj = this;
		var ArrMsg = [];
		thisObj.AddValidation = true;
		//thisObj.MsgAddValidation = "Cihuy";

		//Cek Umur ================================================== (Begin)
		if (Ext.getCmp('MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-FamRelation').getValue() == '1') {
			var YearBirth = parseInt(Ext.getCmp('MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-BirthYear').getValue());
			var today = new Date();
			var age = today.getFullYear() - YearBirth;
			if (age <= 16) {
				thisObj.AddValidation = false;
				ArrMsg.push("Minimal Age is 16 years old");
			}
		}
		//Cek Umur ================================================== (End)


		if (thisObj.AddValidation == false) {
			var HtmlMsg = '<ul>';
			for (var index = 0; index < ArrMsg.length; index++) {
				HtmlMsg += '<li>' + ArrMsg[index] + '</li>'
			}
			HtmlMsg += '</ul>';
			thisObj.MsgAddValidation = HtmlMsg;
		}
	}
});
