/******************************************
 *  Author : n1colius.lau@gmail.com
 *  Created On : Mon Jan 20 2020
 *  File : MainForm.js
 *******************************************/
/*
    Param2 yg diperlukan ketika load View ini
    - OpsiDisplay
    - SupplierID
    - PanelDisplayID
*/

Ext.define('MitraJaya.view.Report.Balance.MainForm', {
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Report.Balance.MainForm',
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
            
			//load formnya
			Ext.getCmp('MitraJaya.view.Report.Balance.MainForm-FormBasicData').getForm().load({
				url: m_api + '/v1/report/balance/data',
				method: 'GET',
				params: {
					SupplierID: this.viewVar.SupplierID
				},
				success: function (form, action) {
					Ext.MessageBox.hide();
					var r = Ext.decode(action.response.responseText);

					if(r.data.FilePath != ''){
						
						Ext.getCmp('MitraJaya.view.Report.Balance.MainForm-FormBasicData-Photo').update('<a href="javascript:Ext.getCmp(\'MitraJaya.view.Report.Balance.MainForm\').ZoomImage(\'' + m_api_base_url + '/files/balance/' + r.data.FilePath + '\')"><img src="' + m_api_base_url + '/files/balance/' + r.data.FilePath + '" style="height:500px;margin:0px 5px 5px 0px;float:left;" /></a>');
						Ext.getCmp('MitraJaya.view.Report.Balance.MainForm-FormBasicData-PhotoOld').setValue(r.data.FilePath);
					}
				},
				failure: function (form, action) {
					Ext.MessageBox.hide();
					Swal.fire({
						icon: 'error',
						text: 'Failed to retrieve data',
						// footer: '<a href="">Why do I have this issue?</a>'
					})
				}
			});
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

        //Panel Basic ==================================== (Begin)
        thisObj.ObjPanelBasicData = Ext.create('Ext.panel.Panel', {
            title: 'Balance',
            frame: true,
            cls: 'Sfr_PanelLayoutForm',
            id: 'MitraJaya.view.Report.Balance.MainForm-FormGeneralData',
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
						id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData',
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
									xtype: 'panel',
									id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-Photo',
									html: '<a href="javascript:Ext.getCmp(\'MitraJaya.view.Report.Balance.MainForm\').ZoomImage(\'' + m_api_base_url + '/assets/images/no_data.png' +'\')"><img src="' + m_api_base_url + '/assets/images/no_data.png" style="height:500px;margin:0px 5px 5px 0px;float:left;" /></a>'
								}, {
									xtype: 'fileuploadfield',
									id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-PhotoInput',
									name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-PhotoInput',
									buttonText: 'Browse',
									cls: 'Sfr_FormBrowseBtn',
									listeners: {
										'change': function (fb, v) {
											Ext.getCmp('MitraJaya.view.Report.Balance.MainForm-FormBasicData').getForm().submit({
												url: m_api + '/v1/report/balance/upload',
												clientValidation: false,
												params: {
													OpsiDisplay: thisObj.viewVar.OpsiDisplay
												},
												waitMsg: 'Sending Photo...',
												success: function (fp, o) {
													var r = Ext.decode(o.response.responseText);
													console.log(r);
													Ext.getCmp('MitraJaya.view.Report.Balance.MainForm-FormBasicData-Photo').update('<a href="javascript:Ext.getCmp(\'MitraJaya.view.Report.Balance.MainForm\').ZoomImage(\'' + m_api_base_url + '/files/balance/' + r.file + '\')"><img src="' + m_api_base_url + '/files/balance/' + r.file + '" style="height:500px;margin:0px 5px 5px 0px;float:left;" /></a>');
													Ext.getCmp('MitraJaya.view.Report.Balance.MainForm-FormBasicData-PhotoOld').setValue(o.result.file);
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
									id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-PhotoOld',
									name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-PhotoOld',
									inputType: 'hidden'
								}]
							}]
						}],
						buttons: [{
							xtype: 'button',
							icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/floppy-disk.svg',
							text: 'Save',
							hidden: m_act_update,
							cls: 'Sfr_BtnFormBlue',
							overCls: 'Sfr_BtnFormBlue-Hover',
							id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-BtnSave',
							handler: function () {
								var Formnya = Ext.getCmp('MitraJaya.view.Report.Balance.MainForm-FormBasicData').getForm();

								if (Formnya.isValid()) {

									Formnya.submit({
										url: m_api + '/v1/report/balance/submit',
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
													Ext.getCmp('MitraJaya.view.Report.Balance.MainForm').destroy(); //destory current view
													var MainForm = [];
													if (Ext.getCmp('MitraJaya.view.Report.Balance.MainForm') == undefined) {
														MainForm = Ext.create('MitraJaya.view.Report.Balance.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																SupplierID: o.result.SupplierID,
																PanelDisplayID: o.result.PanelDisplayID
															}
														});
													} else {
														Ext.getCmp('MitraJaya.view.Report.Balance.MainForm').destroy();
														MainForm = Ext.create('MitraJaya.view.Report.Balance.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																SupplierID: o.result.SupplierID,
																PanelDisplayID: o.result.PanelDisplayID
															}
														});
													}
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
													icon: 'ext-mb-error'
												});
											} catch (err) {
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
										msg: 'Form not complete yet',
										buttons: Ext.MessageBox.OK,
										animateTarget: 'mb9',
										icon: 'ext-mb-info'
									});
								}
							}
						}]
					}]
                }]
            }]
        });
        //Panel Basic ==================================== (End)

        //========================================================== LAYOUT UTAMA (Begin) ========================================//
        thisObj.items = [{
            xtype: 'panel',
            border: false,
            layout: {
                type: 'hbox'
            },
            items: [{
                id: 'MitraJaya.view.Report.Balance.MainForm-labelInfoInsert'
            }]
        }, {
            items: []
        }, {
            html: '<br />'
        }, {
            layout: 'column',
            border: false,
            items: [{
                //LEFT CONTENT
                columnWidth: 0.6,
                items: [
                    thisObj.ObjPanelBasicData
                ]
            }]
        }];
        //========================================================== LAYOUT UTAMA (END) ========================================//

        this.callParent(arguments);
    },
    BackToList: function () {
        Ext.getCmp('MitraJaya.view.Report.Balance.MainForm').destroy(); //destory current view
        var GridMainGrower = [];
        if (Ext.getCmp('Koltiva.view.Farmers.MainGrid') == undefined) {
            GridMainGrower = Ext.create('Koltiva.view.Farmers.MainGrid');
        } else {
            //destroy, create ulang
            Ext.getCmp('Koltiva.view.Farmers.MainGrid').destroy();
            GridMainGrower = Ext.create('Koltiva.view.Farmers.MainGrid');
        }
    },
	ZoomImage:function(val){
		Swal.fire({
			imageUrl: val,
			imageWidth: 1280,
			imageAlt: 'A tall image'
		  })
	}
});
