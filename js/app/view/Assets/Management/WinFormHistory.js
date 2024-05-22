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

Ext.define('MitraJaya.view.Assets.Management.WinFormHistory', {
	extend: 'Ext.window.Window',
	id: 'MitraJaya.view.Assets.Management.WinFormHistory',
	cls: 'Sfr_LayoutPopupWindows',
	title: 'Transaction Form',
	closable: true,
	modal: true,
	closeAction: 'destroy',
	width: '50%',
	height: 550,
	overflowY: 'auto',
	viewVar: false,
	setViewVar: function (value) {
		this.viewVar = value;
	},
	listeners: {
		afterRender: function () {
			var thisObj = this;

			//form reset
			var FormNya = Ext.getCmp('MitraJaya.view.Assets.Management.WinFormHistory-Form');
			FormNya.getForm().reset();

			Ext.getCmp('MitraJaya.view.Assets.Management.WinFormHistory-Form-AssetID').setValue(thisObj.viewVar.AssetID);


			if (thisObj.viewVar.OpsiDisplay == 'insert') {

			}

			if (thisObj.viewVar.OpsiDisplay == 'update' || thisObj.viewVar.OpsiDisplay == 'view') {
				if (thisObj.viewVar.OpsiDisplay == 'view') {
					Ext.getCmp('MitraJaya.view.Assets.Management.WinFormHistory-Form-BtnSave').setVisible(false);
				}

				FormNya.getForm().load({
					url: m_api + '/v1/assets/management/form_assets_history',
					method: 'GET',
					params: {
						HistoryID: thisObj.viewVar.HistoryID
					},
					success: function (form, action) {
						var r = Ext.decode(action.response.responseText);

						if (r.data.File != '') {
							Ext.getCmp('MitraJaya.view.Assets.Management.WinFormHistory-Form-FileDocument').update('<img src="' + r.data.File + '" height="200" /><br><a href="' + r.data.File + '" title="Download File" target="_blank">' + 'Download File' + '</a>');
							Ext.getCmp('MitraJaya.view.Assets.Management.WinFormHistory-Form-FileDocument').doLayout();
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

			// Ext.getCmp('MitraJaya.view.Assets.Management.WinFormHistory').initMap('map-picker-plot', Ext.getCmp('MitraJaya.view.Assets.Management.WinFormHistory-Form-Latitude').getValue(), Ext.getCmp('MitraJaya.view.Assets.Management.WinFormHistory-Form-Longitude').getValue());
		}
	},
	initComponent: function () {
		var thisObj = this;
		let labelWidth = 150;
		thisObj.combo_employee = Ext.create('MitraJaya.store.General.EmployeeList');

		//items -------------------------------------------------------------- (begin)
		thisObj.items = [{
			xtype: 'form',
			id: 'MitraJaya.view.Assets.Management.WinFormHistory-Form',
			padding: '5 25 5 8',
			items: [{
				layout: 'column',
				border: false,
				items: [{
					columnWidth: 0.5,
					layout: 'form',
					items: [{
						xtype: 'hiddenfield',
						id: 'MitraJaya.view.Assets.Management.WinFormHistory-Form-HistoryID',
						name: 'MitraJaya.view.Assets.Management.WinFormHistory-Form-HistoryID',
						fieldLabel: 'History ID'
					}, {
						xtype: 'hiddenfield',
						id: 'MitraJaya.view.Assets.Management.WinFormHistory-Form-AssetID',
						name: 'MitraJaya.view.Assets.Management.WinFormHistory-Form-AssetID',
						fieldLabel: 'AssetID'
					}, {
						xtype: 'combobox',
						labelAlign: 'top',
						fieldLabel: 'Employee Name',
						id: 'MitraJaya.view.Assets.Management.WinFormHistory-Form-PeopleID',
						name: 'MitraJaya.view.Assets.Management.WinFormHistory-Form-PeopleID',
						store: thisObj.combo_employee,
						labelAlign: 'top',
						queryMode: 'local',
						displayField: 'label',
						valueField: 'id',
						allowBlank: false,
						baseCls: 'Sfr_FormInputMandatory'
					}, {
						xtype: 'datefield',
						format: 'Y-m-d',
						id: 'MitraJaya.view.Assets.Management.WinFormHistory-Form-StartDate',
						labelAlign: "top",
						allowBlank: false,
						baseCls: 'Sfr_FormInputMandatory',
						name: 'MitraJaya.view.Assets.Management.WinFormHistory-Form-StartDate',
						fieldLabel: 'Date of Submission'
					}, {
						xtype: 'datefield',
						format: 'Y-m-d',
						id: 'MitraJaya.view.Assets.Management.WinFormHistory-Form-EndDate',
						labelAlign: "top",
						name: 'MitraJaya.view.Assets.Management.WinFormHistory-Form-EndDate',
						fieldLabel: 'Date of Return'
					}, {
						xtype: 'textareafield',
						id: 'MitraJaya.view.Assets.Management.WinFormHistory-Form-Description',
						name: 'MitraJaya.view.Assets.Management.WinFormHistory-Form-Description',
						fieldLabel: 'Description',
						labelAlign: "top"
					}]
				}, {
					columnWidth: 0.5,
					layout: 'form',
					style: 'margin-left:20px',
					items: [{
						xtype: 'hiddenfield',
						id: 'MitraJaya.view.Assets.Management.WinFormHistory-Form-File_old',
						name: 'MitraJaya.view.Assets.Management.WinFormHistory-Form-File_old'
					}, {
						xtype: 'fileuploadfield',
						labelWidth: 125,
						labelAlign: 'top',
						fieldLabel: 'Attachment' + ' <sup style="color:#FF0000;">(Max:10MB)</sup>' + ' *',
						id: 'MitraJaya.view.Assets.Management.WinFormHistory-Form-File',
						name: 'MitraJaya.view.Assets.Management.WinFormHistory-Form-File',
						buttonText: 'Browse',
						listeners: {
							'change': function (fb, v) {

								if (Math.floor(fb.fileInputEl.dom.files[0].size / 1000000) > 10) { //maksimal 10MB
									alert("file size more than 10MB");
									Ext.getCmp('MitraJaya.view.Assets.Management.WinFormHistory-Form-File').reset(true);
								} else {
									Ext.getCmp('MitraJaya.view.Assets.Management.WinFormHistory-Form').getForm().submit({
										url: m_api + '/v1/assets/management/asset_history_upload',
										clientValidation: false,
										params: {
											OpsiDisplay: thisObj.viewVar.OpsiDisplay,
											HistoryID: Ext.getCmp('MitraJaya.view.Assets.Management.WinFormHistory-Form-HistoryID').getValue()
										},
										waitMsg: 'Sending Image',
										success: function (fp, o) {
											if (o.result.file != '') {
												Ext.getCmp('MitraJaya.view.Assets.Management.WinFormHistory-Form-File_old').setValue(o.result.FilePath);
												Ext.getCmp('MitraJaya.view.Assets.Management.WinFormHistory-Form-FileDocument').update('<img src="' + o.result.file + '" height="200" /><br><a href="' + o.result.file + '" title="Download File" target="_blank">' + 'Download File' + '</a>');
												Ext.getCmp('MitraJaya.view.Assets.Management.WinFormHistory-Form-FileDocument').doLayout();
											}
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
						id: 'MitraJaya.view.Assets.Management.WinFormHistory-Form-FileDocument',
						html: '<img src="' + m_api_base_url + '/assets/images/no-images.png" height="200" />'
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
			text: 'Save',
			id: 'MitraJaya.view.Assets.Management.WinFormHistory-Form-BtnSave',
			handler: function () {
				var FormNya = Ext.getCmp('MitraJaya.view.Assets.Management.WinFormHistory-Form').getForm();
				if (FormNya.isValid()) {
					FormNya.submit({
						url: m_api + '/v1/assets/management/submit_assets_history',
						method: 'POST',
						params: {
							OpsiDisplay: thisObj.viewVar.OpsiDisplay
						},
						waitMsg: 'Saving data...',
						success: function (fp, o) {
							Ext.MessageBox.show({
								title: 'Information',
								msg: 'Data saved',
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
						msg: 'Form not valid yet',
						buttons: Ext.MessageBox.OK,
						animateTarget: 'mb9',
						icon: 'ext-mb-info'
					});
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

});
