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

Ext.define('MitraJaya.view.Finance.Claim.WinFormClaimDetail', {
	extend: 'Ext.window.Window',
	id: 'MitraJaya.view.Finance.Claim.WinFormClaimDetail',
	cls: 'Sfr_LayoutPopupWindows',
	title: 'Claim Form',
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
			var FormNya = Ext.getCmp('MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form');
			FormNya.getForm().reset();


			if (thisObj.viewVar.OpsiDisplay == 'insert') {

			}

			if (thisObj.viewVar.OpsiDisplay == 'update' || thisObj.viewVar.OpsiDisplay == 'view') {
				if (thisObj.viewVar.OpsiDisplay == 'view') {
					Ext.getCmp('MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-BtnSave').setVisible(false);
				}

				FormNya.getForm().load({
					url: m_api + '/v1/finance/claim/form_claim_detail',
					method: 'GET',
					params: {
						ClaimDetailID: thisObj.viewVar.ClaimDetailID
					},
					success: function (form, action) {
						var r = Ext.decode(action.response.responseText);

						if (r.data.FilePath !== null ) {

							Ext.getCmp('MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-Photo2').update('<a href="javascript:Ext.getCmp(\'MitraJaya.view.Finance.Claim.WinFormClaimDetail\').ZoomImage(\'' + m_api_base_url + '/' + r.data.FilePath + '\')"><img src="' + m_api_base_url + '/' + r.data.FilePath + '" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>');
							Ext.getCmp('MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-PhotoOld2').setValue(r.data.FilePath);
						}
						//Title
						// Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-labelInfoInsert').update('<div id="header_title_farmer">' + Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanID').getValue() + ' - <strong>' + Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-SupplierName').getValue() + '</strong></div>');
						// Ext.getCmp('MitraJaya.view.Finance.Claim.WinFormClaimDetail-labelInfoInsert').doLayout();
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

			// Ext.getCmp('MitraJaya.view.Finance.Claim.WinFormClaimDetail').initMap('map-picker-plot', Ext.getCmp('MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-Latitude').getValue(), Ext.getCmp('MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-Longitude').getValue());
		}
	},
	initComponent: function () {
		var thisObj = this;
		let labelWidth = 150;
		thisObj.cost_element = Ext.create('MitraJaya.store.General.CostComponent');


		//items -------------------------------------------------------------- (begin)
		thisObj.items = [{
			xtype: 'form',
			id: 'MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form',
			padding: '5 25 5 8',
			items: [{
				layout: 'column',
				border: false,
				items: [{
					columnWidth: 1,
					layout: 'form',
					border: false,
					cls: 'Sfr_PanelLayoutFormContainer',
					items: [{
						xtype: 'form',
						id: 'MitraJaya.view.Finance.Claim.WinFormClaimDetail-FormBasicData',
						fileUpload: true,
						border: false,
						buttonAlign: 'center',
						items: [{
							layout: 'column',
							border: false,
							items: [{
								columnWidth: 0.5,
								layout: 'form',
								style: 'padding:10px 0px 10px 5px;',
								items: [{
									xtype: 'hiddenfield',
									id: 'MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-ClaimDetailID',
									name: 'MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-ClaimDetailID',
									fieldLabel: 'Loan Payment Amount'
								}, {
									xtype: 'combobox',
									fieldLabel: 'Cost Element',
									labelAlign: "top",
									allowBlank: false,
									baseCls: 'Sfr_FormInputMandatory',
									store: thisObj.cost_element,
									queryMode: 'local',
									displayField: 'label',
									valueField: 'id',
									id: 'MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-CostElement',
									name: 'MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-CostElement'
								}, {
									xtype: 'datefield',
									id: 'MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-ClaimDetailDate',
									name: 'MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-ClaimDetailDate',
									fieldLabel: 'Date',
									labelAlign: "top",
									allowBlank: false,
									baseCls: 'Sfr_FormInputMandatory',
									format: 'Y-m-d'
								}, {
									xtype: 'panel',
									id: 'MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-Photo2',
									html: '<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Sparepart.MainForm\').ZoomImage(\'' + m_api_base_url + '/assets/images/no_data.png' + '\')"><img src="' + m_api_base_url + '/assets/images/no_data.png" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>'
								}, {
									xtype: 'fileuploadfield',
									id: 'MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-PhotoInput2',
									name: 'MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-PhotoInput2',
									buttonText: 'Browse',
									cls: 'Sfr_FormBrowseBtn',
									listeners: {
										'change': function (fb, v) {
											Ext.getCmp('MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form').getForm().submit({
												url: m_api + '/v1/finance/claim/upload',
												clientValidation: false,
												params: {
													OpsiDisplay: thisObj.viewVar.OpsiDisplay
												},
												waitMsg: 'Sending Photo...',
												success: function (fp, o) {
													Ext.getCmp('MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-Photo2').update('<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Sparepart.MainForm\').ZoomImage(\'' + m_api_base_url + '/' + o.result.file + '\')"><img src="' + m_api_base_url + '/' + o.result.file + '" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>');
													Ext.getCmp('MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-PhotoOld2').setValue(o.result.file);
												},
												failure: function (fp, o) {
													Ext.MessageBox.show({
														title: 'Error',
														msg: o.result.message,
														buttons: Ext.MessageBox.OK,
														animateTarget: 'mb9',
														icon: 'ext-mb-error'
													});
												}
											});
										}
									}
								}, {
									xtype: 'textfield',
									id: 'MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-PhotoOld2',
									name: 'MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-PhotoOld2',
									inputType: 'hidden'
								}]
							}, {
								columnWidth: 0.5,
								layout: 'form',
								style: 'padding:10px 0px 10px 5px;',
								items: [{
									xtype: 'numericfield',
									id: 'MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-Amount',
									name: 'MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-Amount',
									fieldLabel: 'Amount',
									labelAlign: "top",
									allowBlank: false,
									baseCls: 'Sfr_FormInputMandatory',
								}, {
									xtype: 'textareafield',
									labelAlign: 'top',
									id: 'MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-Description',
									name: 'MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-Description',
									fieldLabel: 'Description'
								}]
							}]
						}]
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
			id: 'MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-BtnSave',
			handler: function () {
				var FormNya = Ext.getCmp('MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form').getForm();

				if (FormNya.isValid()) {
					FormNya.submit({
						url: m_api + '/v1/finance/claim/submit_claim_detail',
						method: 'POST',
						params: {
							OpsiDisplay: thisObj.viewVar.OpsiDisplay,
							ClaimID: thisObj.viewVar.ClaimID
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
	ZoomImage: function (val) {
		Swal.fire({
			imageUrl: val,
			imageWidth: 1280,
			imageAlt: 'A tall image'
		})
	}

});
