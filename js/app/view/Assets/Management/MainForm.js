/******************************************
 *  Author : fashahd@gmail.com.com
 *  Created On : Mon Jan 20 2020
 *  File : MainForm.js
 *******************************************/
/*
	Param2 yg diperlukan ketika load View ini
	- OpsiDisplay
	- SupplierID
	- PanelDisplayID
*/

Ext.define('MitraJaya.view.Assets.Management.MainForm', {
	extend: 'Ext.panel.Panel',
	id: 'MitraJaya.view.Assets.Management.MainForm',
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

			if (thisObj.viewVar.OpsiDisplay == 'insert') {


			}

			if (thisObj.viewVar.OpsiDisplay == 'view' || thisObj.viewVar.OpsiDisplay == 'update') {
				//default
				if (thisObj.viewVar.OpsiDisplay == 'view') {
					Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-BtnSave').setVisible(false);
				}

				//load formnya
				Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData').getForm().load({
					url: m_api + '/v1/assets/management/form_asset',
					method: 'GET',
					params: {
						AssetID: this.viewVar.AssetID
					},
					success: function (form, action) {
						Ext.MessageBox.hide();
						var r = Ext.decode(action.response.responseText);
						
						if(r.data.File1){
							Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File1Preview').update('    <img src="' + r.data.File1 + '" height="200" /><br><a href="' + r.data.File1 + '" title="Download File" target="_blank">' + lang('Download File') + '</a>');
							Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File1Preview').doLayout();
						}
						if(r.data.File2){
							Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File2Preview').update('    <img src="' + r.data.File2 + '" height="200" /><br><a href="' + r.data.File2 + '" title="Download File" target="_blank">' + lang('Download File') + '</a>');
							Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File2Preview').doLayout();
						}
						if(r.data.File3){
							Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File3Preview').update('    <img src="' + r.data.File3 + '" height="200" /><br><a href="' + r.data.File3 + '" title="Download File" target="_blank">' + lang('Download File') + '</a>');
							Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File3Preview').doLayout();
						}
						if(r.data.File4){
							Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File4Preview').update('    <img src="' + r.data.File4 + '" height="200" /><br><a href="' + r.data.File4 + '" title="Download File" target="_blank">' + lang('Download File') + '</a>');
							Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File4Preview').doLayout();
						}

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
		beforerender: function () {
			var thisObj = this;

			if (thisObj.viewVar.OpsiDisplay != 'insert') {
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
			}
		}
	},
	initComponent: function () {
		var thisObj = this;

		thisObj.comboCategory = Ext.create('MitraJaya.store.General.StoreAssetCategory');
		thisObj.comboBrand = Ext.create('MitraJaya.store.General.StoreAssetBrand');

		thisObj.comboYear = Ext.create('MitraJaya.store.General.StoreYear', {
			storeVar: {
				yearRange: 20
			}
		});

		//Panel Basic ==================================== (Begin)
		thisObj.ObjPanelBasicData = Ext.create('Ext.panel.Panel', {
			title: lang('Form Invoice'),
			frame: true,
			cls: 'Sfr_PanelLayoutForm',
			id: 'MitraJaya.view.Finance.Invoice-FormGeneralData',
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
						id: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData',
						fileUpload: true,
						buttonAlign: 'center',

						items: [{
							layout: 'column',
							border: false,
							items: [{
								columnWidth: 0.3,
								layout: 'form',
								style: 'padding:10px 0px 10px 5px;',
								items: [{
									xtype: 'textfield',
									inputType: 'hidden',
									id: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-AssetID',
									name: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-AssetID'
								}, {
									xtype: 'textfield',
									labelAlign: 'top',
									id: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-AssetCode',
									name: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-AssetCode',
									fieldLabel: lang('ID Asset'),
									readOnly: true
								}, {
									xtype: 'combobox',
									id: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-CategoryID',
									name: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-CategoryID',
									labelAlign: 'top',
									fieldLabel: 'Category',
									allowBlank: false,
									baseCls: 'Sfr_FormInputMandatory',
									store: thisObj.comboCategory,
									queryMode: 'local',
									displayField: 'label',
									valueField: 'id',
								}, {
									xtype: 'combobox',
									id: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-BrandID',
									name: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-BrandID',
									labelAlign: 'top',
									fieldLabel: 'Brand',
									allowBlank: false,
									baseCls: 'Sfr_FormInputMandatory',
									store: thisObj.comboBrand,
									queryMode: 'local',
									displayField: 'label',
									valueField: 'id',
								}, {
									xtype: 'combobox',
									id: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-Year',
									name: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-Year',
									labelAlign: 'top',
									fieldLabel: 'Tahun Pembelian',
									allowBlank: false,
									baseCls: 'Sfr_FormInputMandatory',
									store: thisObj.comboYear,
									queryMode: 'local',
									displayField: 'label',
									valueField: 'id',
								}, {
									xtype: 'textfield',
									labelAlign: 'top',
									id: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-AssetExternalID',
									name: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-AssetExternalID',
									fieldLabel: lang('Serial Number'),
									allowBlank: false,
									baseCls: 'Sfr_FormInputMandatory'
								}, {
									xtype: 'textfield',
									labelAlign: 'top',
									id: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-AssetName',
									name: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-AssetName',
									fieldLabel: lang('Asset Name'),
									allowBlank: false,
									baseCls: 'Sfr_FormInputMandatory'
								}, {
									xtype: 'numericfield',
									labelAlign: 'top',
									id: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-HPP',
									name: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-HPP',
									fieldLabel: lang('HPP'),
									allowBlank: false,
									baseCls: 'Sfr_FormInputMandatory'
								}]
							}, {
								columnWidth: 0.3,
								layout: 'form',
								style: 'padding:10px 5px 10px 20px;',
								defaults: {
									labelAlign: 'left',
									labelWidth: 150
								},
								items: [{
									id: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-File2Preview',
									html: '<img src="' + m_api_base_url + '/assets/images/no-images.png" height="200" />'
								}, {
									xtype: 'hiddenfield',
									id: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-File2_old',
									name: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-File2_old'
								}, {
									xtype: 'fileuploadfield',
									labelWidth: 125,
									labelAlign: 'top',
									fieldLabel: lang('Attachment') + ' <sup style="color:#FF0000;">(Max:10MB)</sup>',
									id: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-File2',
									name: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-File2',
									buttonText: lang('Browse'),
									listeners: {
										'change': function (fb, v) {
											Ext.MessageBox.confirm('Message', 'Do you want to upload this data ?', function (btn) {
												if (btn == 'yes') {
													if (Math.floor(fb.fileInputEl.dom.files[0].size / 1000000) > 10) { //maksimal 10MB
														alert(lang("file size more than 10MB"));
														Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File2').reset(true);
													} else {
														Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData').getForm().submit({
															url: m_api + '/v1/assets/management/file_upload',
															clientValidation: false,
															params: {
																OpsiDisplay: thisObj.viewVar.OpsiDisplay,
																FileSource: 'File2',
																AssetID: Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-AssetID').getValue()
															},
															waitMsg: lang('Sending Image'),
															success: function (fp, o) {

																Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File2_old').setValue(o.result.FilePath);
																Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File2Preview').update('    <img src="' + o.result.file + '" height="200" /><br><a href="' + o.result.file + '" title="Download File" target="_blank">' + lang('Download File') + '</a>');
																Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File2Preview').doLayout();
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
									id: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-File3Preview',
									html: '<img src="' + m_api_base_url + '/assets/images/no-images.png" height="200" />'
								}, {
									xtype: 'hiddenfield',
									id: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-File3_old',
									name: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-File3_old'
								}, {
									xtype: 'fileuploadfield',
									labelWidth: 125,
									labelAlign: 'top',
									fieldLabel: lang('Attachment') + ' <sup style="color:#FF0000;">(Max:10MB)</sup>',
									id: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-File3',
									name: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-File3',
									buttonText: lang('Browse'),
									listeners: {
										'change': function (fb, v) {
											Ext.MessageBox.confirm('Message', 'Do you want to upload this data ?', function (btn) {
												if (btn == 'yes') {
													if (Math.floor(fb.fileInputEl.dom.files[0].size / 1000000) > 10) { //maksimal 10MB
														alert(lang("file size more than 10MB"));
														Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File3').reset(true);
													} else {
														Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData').getForm().submit({
															url: m_api + '/v1/assets/management/file_upload',
															clientValidation: false,
															params: {
																OpsiDisplay: thisObj.viewVar.OpsiDisplay,
																FileSource: 'File3',
																AssetID: Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-AssetID').getValue()
															},
															waitMsg: lang('Sending Image'),
															success: function (fp, o) {

																Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File3_old').setValue(o.result.FilePath);
																Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File3Preview').update('    <img src="' + o.result.file + '" height="200" /><br><a href="' + o.result.file + '" title="Download File" target="_blank">' + lang('Download File') + '</a>');
																Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File3Preview').doLayout();
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
								}]
							}, {
								columnWidth: 0.3,
								layout: 'form',
								style: 'padding:10px 5px 10px 20px;',
								defaults: {
									labelAlign: 'left',
									labelWidth: 150
								},
								items: [{
									id: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-File1Preview',
									html: '<img src="' + m_api_base_url + '/assets/images/no-images.png" height="200" />'
								}, {
									xtype: 'hiddenfield',
									id: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-File1_old',
									name: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-File1_old'
								}, {
									xtype: 'fileuploadfield',
									labelWidth: 125,
									labelAlign: 'top',
									fieldLabel: lang('Attachment') + ' <sup style="color:#FF0000;">(Max:10MB)</sup>',
									id: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-File1',
									name: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-File1',
									buttonText: lang('Browse'),
									listeners: {
										'change': function (fb, v) {
											Ext.MessageBox.confirm('Message', 'Do you want to upload this data ?', function (btn) {
												if (btn == 'yes') {
													if (Math.floor(fb.fileInputEl.dom.files[0].size / 1000000) > 10) { //maksimal 10MB
														alert(lang("file size more than 10MB"));
														Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File1').reset(true);
													} else {
														Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData').getForm().submit({
															url: m_api + '/v1/assets/management/file_upload',
															clientValidation: false,
															params: {
																OpsiDisplay: thisObj.viewVar.OpsiDisplay,
																FileSource: 'File1',
																AssetID: Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-AssetID').getValue()
															},
															waitMsg: lang('Sending Image'),
															success: function (fp, o) {

																Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File1_old').setValue(o.result.FilePath);
																Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File1Preview').update('    <img src="' + o.result.file + '" height="200" /><br><a href="' + o.result.file + '" title="Download File" target="_blank">' + lang('Download File') + '</a>');
																Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File1Preview').doLayout();
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
									id: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-File4Preview',
									html: '<img src="' + m_api_base_url + '/assets/images/no-images.png" height="200" />'
								}, {
									xtype: 'hiddenfield',
									id: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-File4_old',
									name: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-File4_old'
								}, {
									xtype: 'fileuploadfield',
									labelWidth: 125,
									labelAlign: 'top',
									fieldLabel: lang('Attachment') + ' <sup style="color:#FF0000;">(Max:10MB)</sup>',
									id: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-File4',
									name: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-File4',
									buttonText: lang('Browse'),
									listeners: {
										'change': function (fb, v) {
											Ext.MessageBox.confirm('Message', 'Do you want to upload this data ?', function (btn) {
												if (btn == 'yes') {
													if (Math.floor(fb.fileInputEl.dom.files[0].size / 1000000) > 10) { //maksimal 10MB
														alert(lang("file size more than 10MB"));
														Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File4').reset(true);
													} else {
														Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData').getForm().submit({
															url: m_api + '/v1/assets/management/file_upload',
															clientValidation: false,
															params: {
																OpsiDisplay: thisObj.viewVar.OpsiDisplay,
																FileSource: 'File4',
																AssetID: Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-AssetID').getValue()
															},
															waitMsg: lang('Sending Image'),
															success: function (fp, o) {
																console.log(o);

																Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File4_old').setValue(o.result.FilePath);
																Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File4Preview').update('    <img src="' + o.result.file + '" height="200" /><br><a href="' + o.result.file + '" title="Download File" target="_blank">' + lang('Download File') + '</a>');
																Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData-File4Preview').doLayout();
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
								}]
							}]
						}],
						buttons: [{
							xtype: 'button',
							icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/floppy-disk.svg',
							text: lang('Save'),
							cls: 'Sfr_BtnFormBlue',
							overCls: 'Sfr_BtnFormBlue-Hover',
							id: 'MitraJaya.view.Assets.Management.MainForm-FormBasicData-BtnSave',
							handler: function () {
								var Formnya = Ext.getCmp('MitraJaya.view.Assets.Management.MainForm-FormBasicData').getForm();

								if (Formnya.isValid()) {
									Formnya.submit({
										url: m_api + '/v1/assets/management/submit',
										method: 'POST',
										waitMsg: 'Saving data asset...',
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
													Ext.getCmp('MitraJaya.view.Assets.Management.MainForm').destroy(); //destory current view
													var MainForm = [];
													if (Ext.getCmp('MitraJaya.view.Assets.Management.MainForm') == undefined) {
														MainForm = Ext.create('MitraJaya.view.Assets.Management.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																AssetID: o.result.AssetID
															}
														});
													} else {
														Ext.getCmp('MitraJaya.view.Assets.Management.MainForm').destroy();
														MainForm = Ext.create('MitraJaya.view.Assets.Management.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																AssetID: o.result.AssetID
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
													text: r.message,
												})
											} catch (err) {

												Swal.fire({
													icon: 'error',
													text: 'Connection Error',
												})
											}
										}
									});
								} else {
									Swal.fire({
										icon: 'warning',
										text: 'Form not complete yet',
									})
								}
							}
						}]
					}],
				}]
			}]
		});
		//Panel Basic ==================================== (End)

		//============================= End DQ =========================================//

		//========================================================== LAYOUT UTAMA (Begin) ========================================//
		thisObj.items = [{
			xtype: 'panel',
			border: false,
			layout: {
				type: 'hbox'
			},
			items: [{
				id: 'MitraJaya.view.Assets.Management.MainForm-labelInfoInsert',
				html: '<div id="header_title_farmer">' + lang('Asset Data') + '</div>'
			}]
		}, {
			items: [{
				id: 'MitraJaya.view.Assets.Management.MainForm-LinkBackToList',
				html: '<div id="Sfr_IdBoxInfoDataGrid" class="Sfr_BoxInfoDataGridForm"><ul class="Sft_UlListInfoDataGrid">'
					+ '<li class="Sft_ListInfoDataGrid"><a href="javascript:Ext.getCmp(\'MitraJaya.view.Assets.Management.MainForm\').BackToList()">'
					+ '<img class="Sft_ListIconInfoDataGrid" src="' + varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/circle-chevron-left.svg" width="20" />&nbsp;&nbsp;' + lang('Back to Assets List') + '</a></li></div>'
			}]
		}, {
			html: '<br />'
		}, {
			layout: 'column',
			border: false,
			items: [{
				//LEFT CONTENT
				columnWidth: 1,
				items: [
					thisObj.ObjPanelBasicData
				]
			}]
		}];
		//========================================================== LAYOUT UTAMA (END) ========================================//

		this.callParent(arguments);
	},
	BackToList: function () {
		Ext.getCmp('MitraJaya.view.Assets.Management.MainForm').destroy(); //destory current view
		var GridMainGrower = [];
		if (Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid') == undefined) {
			GridMainGrower = Ext.create('MitraJaya.view.Assets.Management.MainGrid');
		} else {
			//destroy, create ulang
			Ext.getCmp('MitraJaya.view.Assets.Management.MainGrid').destroy();
			GridMainGrower = Ext.create('MitraJaya.view.Assets.Management.MainGrid');
		}
	}
});
