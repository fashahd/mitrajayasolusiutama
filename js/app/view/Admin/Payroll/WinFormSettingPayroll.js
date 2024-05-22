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

Ext.define('MitraJaya.view.Admin.Payroll.WinFormSettingPayroll', {
	extend: 'Ext.window.Window',
	id: 'MitraJaya.view.Admin.Payroll.WinFormSettingPayroll',
	cls: 'Sfr_LayoutPopupWindows',
	title: 'Payroll Setting',
	closable: true,
	modal: true,
	closeAction: 'destroy',
	width: '50%',
	height: 500,
	overflowY: 'auto',
	viewVar: false,
	setViewVar: function (value) {
		this.viewVar = value;
	},
	initComponent: function () {
		thisObj = this;

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
						id: 'MitraJaya.view.Admin.Payroll.WinFormSettingPayroll-FormBasicData',
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
									labelAlign: 'top',
									id: 'MitraJaya.view.Admin.Payroll.WinFormSettingPayroll-FormBasicData-signatrue_name',
									name: 'MitraJaya.view.Admin.Payroll.WinFormSettingPayroll-FormBasicData-signatrue_name',
									fieldLabel: 'Name'
								}]
							}, {
								columnWidth: 0.5,
								layout: 'form',
								style: 'padding:10px 0px 10px 5px;',
								items: [{
									xtype: 'hiddenfield',
									id: 'MitraJaya.view.Admin.Payroll.WinFormSettingPayroll-FormBasicData-document_old',
									name: 'MitraJaya.view.Admin.Payroll.WinFormSettingPayroll-FormBasicData-document_old'
								}, {
									xtype: 'fileuploadfield',
									labelWidth: 125,
									labelAlign: 'top',
									fieldLabel: 'Attachment' + ' <sup style="color:#FF0000;">(Max:10MB)</sup>' + ' *',
									id: 'MitraJaya.view.Admin.Payroll.WinFormSettingPayroll-FormBasicData-document',
									name: 'MitraJaya.view.Admin.Payroll.WinFormSettingPayroll-FormBasicData-document',
									buttonText: 'Browse',
									listeners: {
										'change': function (fb, v) {

											if (Math.floor(fb.fileInputEl.dom.files[0].size / 1000000) > 10) { //maksimal 10MB
												alert("file size more than 10MB");
												Ext.getCmp('MitraJaya.view.Admin.Payroll.WinFormSettingPayroll-FormBasicData-document').reset(true);
											} else {
												Ext.getCmp('MitraJaya.view.Admin.Payroll.WinFormSettingPayroll-FormBasicData').getForm().submit({
													url: m_api + '/v1/admin/payroll/signature_upload',
													clientValidation: false,
													waitMsg: 'Sending Image',
													success: function (fp, o) {
														Ext.getCmp('MitraJaya.view.Admin.Payroll.WinFormSettingPayroll-FormBasicData-document_old').setValue(o.result.FilePath);
														Ext.getCmp('MitraJaya.view.Admin.Payroll.WinFormSettingPayroll-FormBasicData-FileDocument').update('<a href="' + o.result.file + '" title="Download File" target="_blank"><img src="' + o.result.file + '" height="200" /></a>');
														Ext.getCmp('MitraJaya.view.Admin.Payroll.WinFormSettingPayroll-FormBasicData-FileDocument').doLayout();
													},
													failure: function (fp, o) {
														Ext.MessageBox.show({
															title: 'Attention',
															msg: o.result.message,
															buttons: Ext.MessageBox.OK,
															animateTarget: 'mb9',
															icon: 'ext-mb-error'
														});
													}
												});
											}
										}
									}
								}, {
									id: 'MitraJaya.view.Admin.Payroll.WinFormSettingPayroll-FormBasicData-FileDocument',
									html: '<img src="' + m_api_base_url + '/assets/images/no-images.png" height="200" />'
								}, {
									html: '<div style="margin-top:5px;font-size:10px;font-style:italic;">' + 'File must Image' + '</div>'
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
			id: 'MitraJaya.view.Admin.Payroll.WinFormSettingPayroll-BtnSave',
			handler: function () {
				var Formnya = Ext.getCmp('MitraJaya.view.Admin.Payroll.WinFormSettingPayroll-FormBasicData').getForm();

				if (Formnya.isValid()) {

					Formnya.submit({
						url: m_api + '/v1/admin/payroll/submit_setting',
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
				Ext.getCmp('MitraJaya.view.Admin.Payroll.WinFormSettingPayroll-BtnSave').setVisible(false);
			}

			//load data form
			Ext.getCmp('MitraJaya.view.Admin.Payroll.WinFormSettingPayroll-FormBasicData').getForm().load({
				url: m_api + '/v1/admin/payroll/form_payroll_setting',
				method: 'GET',
				params: {
					Month: thisObj.viewVar.month,
					Year: thisObj.viewVar.year,
					people_id: thisObj.viewVar.people_id
				},
				success: function (form, action) {
					// Ext.MessageBox.hide();
					var r = Ext.decode(action.response.responseText);

					Ext.getCmp('MitraJaya.view.Admin.Payroll.WinFormSettingPayroll-FormBasicData-FileDocument').update('<a href="' + r.data.document + '" title="Download File" target="_blank"><img src="' + r.data.document + '" height="200" /></a>');
					Ext.getCmp('MitraJaya.view.Admin.Payroll.WinFormSettingPayroll-FormBasicData-FileDocument').doLayout();

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
		if (Ext.getCmp('MitraJaya.view.Admin.Payroll.WinFormSettingPayroll-FormBasicData-FamRelation').getValue() == '1') {
			var YearBirth = parseInt(Ext.getCmp('MitraJaya.view.Admin.Payroll.WinFormSettingPayroll-FormBasicData-BirthYear').getValue());
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
