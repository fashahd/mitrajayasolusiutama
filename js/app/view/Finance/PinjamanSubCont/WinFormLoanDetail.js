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

Ext.define('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail', {
	extend: 'Ext.window.Window',
	id: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail',
	cls: 'Sfr_LayoutPopupWindows',
	title: 'Loan Detail Form',
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
			var FormNya = Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form');
			FormNya.getForm().reset();


			if (thisObj.viewVar.OpsiDisplay == 'insert') {

			}

			if (thisObj.viewVar.OpsiDisplay == 'update' || thisObj.viewVar.OpsiDisplay == 'view') {
				if (thisObj.viewVar.OpsiDisplay == 'view') {
					Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-BtnSave').setVisible(false);
				}

				FormNya.getForm().load({
					url: m_api + '/v1/finance/loan/form_loan_detail',
					method: 'GET',
					params: {
						LoanDetailID: thisObj.viewVar.LoanDetailID
					},
					success: function (form, action) {
						var r = Ext.decode(action.response.responseText);

						if (r.data.FilePath !== null) {

							Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-Photo2').update('<a href="javascript:Ext.getCmp(\'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail\').ZoomImage(\'' + m_api_base_url + '/' + r.data.FilePath + '\')"><img src="' + m_api_base_url + '/' + r.data.FilePath + '" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>');
							Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-PhotoOld2').setValue(r.data.FilePath);
						}
						//Title
						// Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-labelInfoInsert').update('<div id="header_title_farmer">' + Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanID').getValue() + ' - <strong>' + Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-SupplierName').getValue() + '</strong></div>');
						// Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-labelInfoInsert').doLayout();
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

			// Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail').initMap('map-picker-plot', Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-Latitude').getValue(), Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-Longitude').getValue());
		}
	},
	initComponent: function () {
		var thisObj = this;
		let labelWidth = 150;
		thisObj.cost_element = Ext.create('MitraJaya.store.General.CostComponent');


		//items -------------------------------------------------------------- (begin)
		thisObj.items = [{
			xtype: 'form',
			id: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form',
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
						id: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-FormBasicData',
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
									id: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-LoanDetailID',
									name: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-LoanDetailID',
									fieldLabel: 'Loan Detail ID'
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
									id: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-CostElement',
									name: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-CostElement'
								}, {
									xtype: 'panel',
									id: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-Photo2',
									html: '<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Sparepart.MainForm\').ZoomImage(\'' + m_api_base_url + '/assets/images/no_data.png' + '\')"><img src="' + m_api_base_url + '/assets/images/no_data.png" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>'
								}, {
									xtype: 'fileuploadfield',
									id: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-PhotoInput2',
									name: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-PhotoInput2',
									buttonText: 'Browse',
									cls: 'Sfr_FormBrowseBtn',
									listeners: {
										'change': function (fb, v) {
											Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form').getForm().submit({
												url: m_api + '/v1/finance/loan/upload',
												clientValidation: false,
												params: {
													OpsiDisplay: thisObj.viewVar.OpsiDisplay
												},
												waitMsg: 'Sending Photo...',
												success: function (fp, o) {
													Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-Photo2').update('<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Sparepart.MainForm\').ZoomImage(\'' + m_api_base_url + '/' + o.result.file + '\')"><img src="' + m_api_base_url + '/' + o.result.file + '" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>');
													Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-PhotoOld2').setValue(o.result.file);
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
									id: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-PhotoOld2',
									name: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-PhotoOld2',
									inputType: 'hidden'
								}]
							}, {
								columnWidth: 0.5,
								layout: 'form',
								style: 'padding:10px 0px 10px 5px;',
								items: [{
									xtype: 'numericfield',
									id: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-Qty',
									name: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-Qty',
									fieldLabel: 'Qty',
									labelAlign: "top"
								}, {
									xtype: 'numericfield',
									id: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-Amount',
									name: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-Amount',
									fieldLabel: 'Amount',
									labelAlign: "top",
									allowBlank: false,
									baseCls: 'Sfr_FormInputMandatory',
								}, {
									xtype: 'textareafield',
									labelAlign: 'top',
									id: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-Description',
									name: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-Description',
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
			id: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-BtnSave',
			handler: function () {
				var FormNya = Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form').getForm();

				if (FormNya.isValid()) {
					FormNya.submit({
						url: m_api + '/v1/finance/loan/submit_loan_detail',
						method: 'POST',
						params: {
							OpsiDisplay: thisObj.viewVar.OpsiDisplay,
							LoanID: thisObj.viewVar.LoanID
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
							Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData').getForm().load({
								url: m_api + '/v1/finance/loan/form_loan',
								method: 'GET',
								params: {
									LoanID: thisObj.viewVar.LoanID
								},
								success: function (form, action) {
									// Ext.MessageBox.hide();
									var r = Ext.decode(action.response.responseText);
									//Title
									// Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-labelInfoInsert').update('<div id="header_title_farmer">' + Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanID').getValue() + ' - <strong>' + Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-SupplierName').getValue() + '</strong></div>');
									Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-labelInfoInsert').doLayout();
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
