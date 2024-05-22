/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Wed Jan 29 2020
 *  File : WinFormFarmStatus.js
 *******************************************/

/*
	Param2 yg diperlukan ketika load View ini
	- OpsiDisplay
	- CallerStore
	- SupplierID
	- FarmNr
*/

Ext.define('MitraJaya.view.Admin.Employee.WinFormDocument', {
	extend: 'Ext.window.Window',
	id: 'MitraJaya.view.Admin.Employee.WinFormDocument',
	cls: 'Sfr_LayoutPopupWindows',
	title: lang('Document Form'),
	closable: true,
	modal: true,
	closeAction: 'destroy',
	width: '50%',
	height: 600,
	overflowY: 'auto',
	viewVar: false,
	setViewVar: function (value) {
		this.viewVar = value;
	},
	listeners: {
		afterRender: function () {
			var thisObj = this;

			//form reset
			var FormNya = Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormDocument-Form');
			FormNya.getForm().reset();


			if (thisObj.viewVar.OpsiDisplay == 'insert') {

			}

			if (thisObj.viewVar.OpsiDisplay == 'update' || thisObj.viewVar.OpsiDisplay == 'view') {
				if (thisObj.viewVar.OpsiDisplay == 'view') {
					Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormDocument-Form-BtnSave').setVisible(false);
					Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormDocument-Form-document').setDisabled(true);
				}

				FormNya.getForm().load({
					url: m_api + '/v1/admin/employee/form_document',
					method: 'GET',
					params: {
						doc_id: thisObj.viewVar.doc_id
					},
					success: function (form, action) {
						var r = Ext.decode(action.response.responseText);

						if (r.data.document != '') {

							if (r.data.mimetype == 'pdf') {
								icon = m_api_base_url + '/assets/images/pdf-icon.png';
							} else {
								icon = m_api_base_url + '/assets/images/no-images.png';
							}

							Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormDocument-Form-FileDocument').update('<a href="' + r.data.document + '" title="Download File" target="_blank">' + lang('Download File') + '    <img src="' + icon + '" height="24" /></a>');
							Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormDocument-Form-FileDocument').doLayout();
						}
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
		}
	},
	initComponent: function () {
		var thisObj = this;
		let labelWidth = 150;
		let combo_doc_type = Ext.create('MitraJaya.store.General.DocumentType');

		//items -------------------------------------------------------------- (begin)
		thisObj.items = [{
			xtype: 'form',
			id: 'MitraJaya.view.Admin.Employee.WinFormDocument-Form',
			padding: '5 25 5 8',
			items: [{
				layout: 'column',
				border: false,
				items: [{
					columnWidth: 0.5,
					layout: 'form',
					items: [{
						xtype: 'hiddenfield',
						id: 'MitraJaya.view.Admin.Employee.WinFormDocument-Form-doc_id',
						name: 'MitraJaya.view.Admin.Employee.WinFormDocument-Form-doc_id',
						fieldLabel: lang('Doc ID')
					}, {
						xtype: 'combobox',
						id: 'MitraJaya.view.Admin.Employee.WinFormDocument-Form-doc_type',
						name: 'MitraJaya.view.Admin.Employee.WinFormDocument-Form-doc_type',
						fieldLabel: lang('Document Type'),
						labelAlign: "top",
						allowBlank: false,
						baseCls: 'Sfr_FormInputMandatory',
						store: combo_doc_type,
						labelAlign: 'top',
						queryMode: 'local',
						displayField: 'label',
						valueField: 'id',
						listeners: {
							change: function (cb, nv, ov) {
								return false;
							}
						}
					}, {
						xtype: 'hiddenfield',
						id: 'MitraJaya.view.Admin.Employee.WinFormDocument-Form-document_old',
						name: 'MitraJaya.view.Admin.Employee.WinFormDocument-Form-document_old'
					}, {
						xtype: 'fileuploadfield',
						labelWidth: 125,
						labelAlign: 'top',
						fieldLabel: lang('Attachment') + ' <sup style="color:#FF0000;">(Max:10MB)</sup>' + ' *',
						id: 'MitraJaya.view.Admin.Employee.WinFormDocument-Form-document',
						name: 'MitraJaya.view.Admin.Employee.WinFormDocument-Form-document',
						buttonText: lang('Browse'),
						listeners: {
							'change': function (fb, v) {
								Ext.MessageBox.confirm('Message', 'Do you want to upload this data ?', function (btn) {
									if (btn == 'yes') {
										if (Math.floor(fb.fileInputEl.dom.files[0].size / 1000000) > 10) { //maksimal 10MB
											alert(lang("file size more than 10MB"));
											Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormDocument-Form-document').reset(true);
										} else {
											Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormDocument-Form').getForm().submit({
												url: m_api + '/v1/admin/employee/document_file_upload',
												clientValidation: false,
												params: {
													OpsiDisplay: thisObj.viewVar.OpsiDisplay,
													people_id: thisObj.viewVar.people_id,
													doc_id: Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormDocument-Form-doc_id').getValue()
												},
												waitMsg: lang('Sending Image'),
												success: function (fp, o) {
													if (o.result.mimetype == 'pdf') {
														icon = m_api_base_url + '/assets/images/pdf-icon.png';
													} else {
														icon = m_api_base_url + '/assets/images/no-images.png';
													}

													Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormDocument-Form-document_old').setValue(o.result.FilePath);
													Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormDocument-Form-FileDocument').update('<a href="' + o.result.file + '" title="Download File" target="_blank">' + lang('Download File') + '    <img src="' + icon + '" height="24" /></a>');
													Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormDocument-Form-FileDocument').doLayout();
												},
												failure: function (fp, o) {
													Ext.MessageBox.show({
														title: lang('Attention'),
														msg: o.result.message,
														buttons: Ext.MessageBox.OK,
														animateTarget: 'mb9',
														icon: 'ext-mb-error'
													});
												}
											});
										}
									}
								});
							}
						}
					}, {
						id: 'MitraJaya.view.Admin.Employee.WinFormDocument-Form-FileDocument',
						html: '<img src="' + m_api_base_url + '/assets/images/no-images.png" height="200" />'
					}]
				}, {
					columnWidth: 0.5,
					layout: 'form',
					style: 'margin-left:20px',
					items: [{
						xtype: 'textfield',
						id: 'MitraJaya.view.Admin.Employee.WinFormDocument-Form-doc_number',
						name: 'MitraJaya.view.Admin.Employee.WinFormDocument-Form-doc_number',
						fieldLabel: lang('Document Number'),
						labelAlign: "top",
						allowBlank: false,
						baseCls: 'Sfr_FormInputMandatory',
					}, {
						xtype: 'datefield',
						format: 'Y-m-d',
						id: 'MitraJaya.view.Admin.Employee.WinFormDocument-Form-expired_date',
						labelAlign: "top",
						name: 'MitraJaya.view.Admin.Employee.WinFormDocument-Form-expired_date',
						fieldLabel: lang('Expired Date')
					}]
				}]
			}]
		}];
		//items -------------------------------------------------------------- (end)

		//buttons -------------------------------------------------------------- (begin)
		thisObj.buttons = [{
			icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/floppy-disk.svg',
			cls: 'Sfr_BtnFormBlue',
			overCls: 'Sfr_BtnFormBlue-Hover',
			text: lang('Save'),
			id: 'MitraJaya.view.Admin.Employee.WinFormDocument-Form-BtnSave',
			handler: function () {
				var FormNya = Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormDocument-Form').getForm();
				if (FormNya.isValid()) {
					FormNya.submit({
						url: m_api + '/v1/admin/employee/submit_document',
						method: 'POST',
						params: {
							OpsiDisplay: thisObj.viewVar.OpsiDisplay,
							people_id: thisObj.viewVar.people_id
						},
						waitMsg: 'Saving data...',
						success: function (fp, o) {
							Ext.MessageBox.show({
								title: 'Information',
								msg: lang('Data saved'),
								buttons: Ext.MessageBox.OK,
								animateTarget: 'mb9',
								icon: 'ext-mb-success'
							});

							//refresh store FamLab yg manggil
							thisObj.viewVar.CallerStore.load();


							//tutup popup
							thisObj.close();
						},
						failure: function (fp, o) {
							try {
								var r = Ext.decode(o.response.responseText);
								Ext.MessageBox.show({
									title: 'Error',
									msg: r.message,
									buttons: Ext.MessageBox.OK,
									animateTarget: 'mb9',
									icon: 'ext-mb-error'
								});
							}
							catch (err) {
								Ext.MessageBox.show({
									title: 'Error',
									msg: 'Connection Error',
									buttons: Ext.MessageBox.OK,
									animateTarget: 'mb9',
									icon: 'ext-mb-error'
								});
							}
						}
					});
				} else {
					Ext.MessageBox.show({
						title: 'Attention',
						msg: lang('Form not valid yet'),
						buttons: Ext.MessageBox.OK,
						animateTarget: 'mb9',
						icon: 'ext-mb-info'
					});
				}
			}
		}, {
			icon: varjs.config.base_url + 'images/icons/new/close.png',
			text: lang('Close'),
			cls: 'Sfr_BtnFormGrey',
			overCls: 'Sfr_BtnFormGrey-Hover',
			handler: function () {
				thisObj.close();
			}
		}];
		//buttons -------------------------------------------------------------- (end)

		this.callParent(arguments);
	},

});
