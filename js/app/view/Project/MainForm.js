/******************************************
 *  Author : fashahd@gmail.com.com
 *  Created On : Mon Jan 20 2020
 *  File : MainForm.js
 *******************************************/
/*
	Param2 yg diperlukan ketika load View ini
	- OpsiDisplay
	- ProjectID
	- PanelDisplayID
*/

Ext.define('MitraJaya.view.Project.MainForm', {
	extend: 'Ext.panel.Panel',
	id: 'MitraJaya.view.Project.MainForm',
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
					Ext.getCmp('MitraJaya.view.Project.MainForm-FormBasicData-BtnSave').setVisible(false);
				}

				//load formnya
				Ext.getCmp('MitraJaya.view.Project.MainForm-FormBasicData').getForm().load({
					url: m_api + '/v1/finance/project/form_project',
					method: 'GET',
					params: {
						ProjectID: this.viewVar.ProjectID
					},
					success: function (form, action) {
						var r = Ext.decode(action.response.responseText);
						//Title
						// Ext.getCmp('MitraJaya.view.Project.MainForm-labelInfoInsert').update('<div id="header_title_farmer">' + Ext.getCmp('MitraJaya.view.Project.MainForm-FormBasicData-SupplierDisplayID').getValue() + ' - <strong>' + Ext.getCmp('MitraJaya.view.Project.MainForm-FormBasicData-SupplierName').getValue() + '</strong></div>');
						Ext.getCmp('MitraJaya.view.Project.MainForm-labelInfoInsert').doLayout();
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
				// Ext.MessageBox.show({
				//     msg: 'Please wait...',
				//     progressText: 'Loading...',
				//     width: 300,
				//     wait: true,
				//     waitConfig: {
				//         interval: 200
				//     },
				//     icon: 'ext-mb-info', //custom class in msg-box.html
				//     animateTarget: 'mb9'
				// });

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

		thisObj.combo_company = Ext.create('MitraJaya.store.General.CompanyList', {
			storeVar: {
				CustomerID: ''
			}
		});

		//Panel Basic ==================================== (Begin)
		thisObj.ObjPanelBasicData = Ext.create('Ext.panel.Panel', {
			title: lang('Project Data'),
			frame: true,
			cls: 'Sfr_PanelLayoutForm',
			id: 'MitraJaya.view.Finance.OrderBook-FormGeneralData',
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
						id: 'MitraJaya.view.Project.MainForm-FormBasicData',
						fileUpload: true,
						buttonAlign: 'center',
						items: [{
							layout: 'column',
							border: false,
							items: [{
								columnWidth: 1,
								layout: 'form',
								style: 'padding:10px 0px 10px 5px;',
								items: [{
									xtype: 'textfield',
									inputType: 'hidden',
									id: 'MitraJaya.view.Project.MainForm-FormBasicData-ProjectID',
									name: 'MitraJaya.view.Project.MainForm-FormBasicData-ProjectID'
								}, {
									xtype: 'textfield',
									labelAlign: 'top',
									allowBlank: false,
									baseCls: 'Sfr_FormInputMandatory',
									fieldLabel: lang('Project Name'),
									id: 'MitraJaya.view.Project.MainForm-FormBasicData-ProjectName',
									name: 'MitraJaya.view.Project.MainForm-FormBasicData-ProjectName'
								}, {
									xtype: 'combobox',
									id: 'MitraJaya.view.Project.MainForm-FormBasicData-CustomerID',
									name: 'MitraJaya.view.Project.MainForm-FormBasicData-CustomerID',
									store: thisObj.combo_company,
									labelAlign: 'top',
									fieldLabel: 'Customer',
									queryMode: 'local',
									displayField: 'label',
									valueField: 'id',
									allowBlank: false,
									baseCls: 'Sfr_FormInputMandatory'
								}]
							}]
						}],
						buttons: [{
							xtype: 'button',
							icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/floppy-disk.svg',
							text: lang('Save'),
							cls: 'Sfr_BtnFormBlue',
							overCls: 'Sfr_BtnFormBlue-Hover',
							id: 'MitraJaya.view.Project.MainForm-FormBasicData-BtnSave',
							handler: function () {
								var Formnya = Ext.getCmp('MitraJaya.view.Project.MainForm-FormBasicData').getForm();

								if (Formnya.isValid()) {

									Formnya.submit({
										url: m_api + '/v1/finance/project/submit_project',
										method: 'POST',
										waitMsg: 'Saving data...',
										params: {
											OpsiDisplay: thisObj.viewVar.OpsiDisplay
										},
										success: function (fp, o) {
											// Ext.MessageBox.show({
											// 	title: 'Information',
											// 	msg: lang('Data saved'),
											// 	buttons: Ext.MessageBox.OK,
											// 	animateTarget: 'mb9',
											// 	icon: 'ext-mb-success',
											// 	fn: function (btn) {
											// 		if (btn == 'ok') {
											// 			Ext.getCmp('MitraJaya.view.Project.MainForm').destroy(); //destory current view
											// 			var MainForm = [];
											// 			if (Ext.getCmp('MitraJaya.view.Project.MainForm') == undefined) {
											// 				MainForm = Ext.create('MitraJaya.view.Project.MainForm', {
											// 					viewVar: {
											// 						OpsiDisplay: 'update',
											// 						ProjectID: o.result.ProjectID,
											// 						PanelDisplayID: o.result.PanelDisplayID
											// 					}
											// 				});
											// 			} else {
											// 				Ext.getCmp('MitraJaya.view.Project.MainForm').destroy();
											// 				MainForm = Ext.create('MitraJaya.view.Project.MainForm', {
											// 					viewVar: {
											// 						OpsiDisplay: 'update',
											// 						ProjectID: o.result.ProjectID,
											// 						PanelDisplayID: o.result.PanelDisplayID
											// 					}
											// 				});
											// 			}
											// 		}
											// 	}
											// });

											Swal.fire({
												text: "Data saved",
												icon: 'success',
												confirmButtonColor: '#3085d6',
											}).then((result) => {
												if (result.isConfirmed) {
													Ext.getCmp('MitraJaya.view.Project.MainForm').destroy(); //destory current view
													var MainForm = [];
													if (Ext.getCmp('MitraJaya.view.Project.MainForm') == undefined) {
														MainForm = Ext.create('MitraJaya.view.Project.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																ProjectID: o.result.ProjectID
															}
														});
													} else {
														Ext.getCmp('MitraJaya.view.Project.MainForm').destroy();
														MainForm = Ext.create('MitraJaya.view.Project.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																ProjectID: o.result.ProjectID
															}
														});
													}
												}
											})
										},
										failure: function (fp, o) {
											try {
												var r = Ext.decode(o.response.responseText);
												// Ext.MessageBox.show({
												// 	title: 'Error',
												// 	msg: r.message,
												// 	buttons: Ext.MessageBox.OK,
												// 	animateTarget: 'mb9',
												// 	icon: 'ext-mb-error'
												// });

												Swal.fire({
													icon: 'warning',
													text: r.message,
													// footer: '<a href="">Why do I have this issue?</a>'
												})
											} catch (err) {
												// Ext.MessageBox.show({
												// 	title: 'Error',
												// 	msg: 'Connection Error',
												// 	buttons: Ext.MessageBox.OK,
												// 	animateTarget: 'mb9',
												// 	icon: 'ext-mb-error'
												// });
												Swal.fire({
													icon: 'error',
													text: 'Connection Error',
													// footer: '<a href="">Why do I have this issue?</a>'
												})
											}
										}
									});

								} else {
									// Ext.MessageBox.show({
									// 	title: lang('Attention'),
									// 	msg: lang('Form not complete yet'),
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
						}]
					}]
				}]
			}]
		});
		//Panel Basic ==================================== (End)

		//============================= End DQ =========================================//

		var objPanelDinamis = [];

		// if (thisObj.viewVar.OpsiDisplay == 'update' || thisObj.viewVar.OpsiDisplay == 'view') {
		// 	thisObj.PanelInvoice = Ext.create('MitraJaya.view.Finance.OrderBook.PanelInvoice', {
		// 		viewVar: {
		// 			ProjectID: thisObj.viewVar.ProjectID
		// 		}
		// 	});

		// 	//Add ke object panel dinamis
		// 	objPanelDinamis.push(thisObj.PanelInvoice);
		// }

		//========================================================== LAYOUT UTAMA (Begin) ========================================//
		thisObj.items = [{
			xtype: 'panel',
			border: false,
			layout: {
				type: 'hbox'
			},
			items: [{
				id: 'MitraJaya.view.Project.MainForm-labelInfoInsert',
				html: '<div id="header_title_farmer">' + lang('Project Data') + '</div>'
			}]
		}, {
			items: [{
				id: 'MitraJaya.view.Project.MainForm-LinkBackToList',
				html: '<div id="Sfr_IdBoxInfoDataGrid" class="Sfr_BoxInfoDataGridForm"><ul class="Sft_UlListInfoDataGrid">'
					+ '<li class="Sft_ListInfoDataGrid"><a href="javascript:Ext.getCmp(\'MitraJaya.view.Project.MainForm\').BackToList()">'
					+ '<img class="Sft_ListIconInfoDataGrid" src="' + varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/circle-chevron-left.svg" width="20" />&nbsp;&nbsp;' + lang('Back to Project List') + '</a></li></div>'
			}]
		}, {
			html: '<br />'
		}, {
			layout: 'column',
			border: false,
			items: [{
				//LEFT CONTENT
				columnWidth: 0.5,
				items: [
					thisObj.ObjPanelBasicData
				]
			}, {
				//Right CONTENT
				// columnWidth: 0.49,
				// items: objPanelDinamis
			}]
		}];
		//========================================================== LAYOUT UTAMA (END) ========================================//

		this.callParent(arguments);
	},
	BackToList: function () {
		Ext.getCmp('MitraJaya.view.Project.MainForm').destroy(); //destory current view
		var GridMainGrower = [];
		if (Ext.getCmp('MitraJaya.view.Project.MainGrid') == undefined) {
			GridMainGrower = Ext.create('MitraJaya.view.Project.MainGrid');
		} else {
			//destroy, create ulang
			Ext.getCmp('MitraJaya.view.Project.MainGrid').destroy();
			GridMainGrower = Ext.create('MitraJaya.view.Project.MainGrid');
		}
	}
});
