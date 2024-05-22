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

Ext.define('MitraJaya.view.Admin.ChangePassword.MainForm', {
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Admin.ChangePassword.MainForm',
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
        },
        beforerender: function () {
            var thisObj = this;
        }
    },
    initComponent: function () {
        var thisObj = this;

        //Panel Basic ==================================== (Begin)
        thisObj.ObjPanelBasicData = Ext.create('Ext.panel.Panel', {
            title: 'Change Password',
            frame: true,
            cls: 'Sfr_PanelLayoutForm',
            id: 'MitraJaya.view.Admin.ChangePassword.MainForm-FormGeneralData',
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
						id: 'MitraJaya.view.Admin.ChangePassword.MainForm-FormBasicData',
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
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Admin.Vendor.MainForm-FormBasicData-OldPassword',
                                    name: 'MitraJaya.view.Admin.Vendor.MainForm-FormBasicData-OldPassword',
                                    fieldLabel: 'Old Password',
            						inputType: 'password',
                                    allowBlank: false,
                                    baseCls: 'Sfr_FormInputMandatory',
                                },{
                                    html:'<div style="margin-bottom:5px"></div>'
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Admin.Vendor.MainForm-FormBasicData-NewPassword',
                                    name: 'MitraJaya.view.Admin.Vendor.MainForm-FormBasicData-NewPassword',
                                    fieldLabel: 'New Password',
            						inputType: 'password',
                                    allowBlank: false,
                                    baseCls: 'Sfr_FormInputMandatory',
                                },{
                                    html:'<div style="margin-bottom:5px"></div>'
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Admin.Vendor.MainForm-FormBasicData-ReNewPassword',
                                    name: 'MitraJaya.view.Admin.Vendor.MainForm-FormBasicData-ReNewPassword',
                                    fieldLabel: 'Retype New Password',
            						inputType: 'password',
                                    allowBlank: false,
                                    baseCls: 'Sfr_FormInputMandatory',
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
							id: 'MitraJaya.view.Admin.ChangePassword.MainForm-FormBasicData-BtnSave',
							handler: function () {
								var Formnya = Ext.getCmp('MitraJaya.view.Admin.ChangePassword.MainForm-FormBasicData').getForm();

								var NewPassword = Ext.getCmp('MitraJaya.view.Admin.Vendor.MainForm-FormBasicData-NewPassword').getValue();
								var ReNewPassword = Ext.getCmp('MitraJaya.view.Admin.Vendor.MainForm-FormBasicData-ReNewPassword').getValue();

								if(NewPassword !== ReNewPassword){
									Ext.MessageBox.show({
										title: 'Warning',
										msg: 'New Password Doesn\'t Match !',
										buttons: Ext.MessageBox.OK,
										animateTarget: 'mb9',
										icon: 'ext-mb-warning'
									});

									return false;
								}

								if(NewPassword.length < 8){
									Ext.MessageBox.show({
										title: 'Warning',
										msg: 'Minimal 8 Character !',
										buttons: Ext.MessageBox.OK,
										animateTarget: 'mb9',
										icon: 'ext-mb-warning'
									});

									return false;
								}

								if (Formnya.isValid()) {

									Formnya.submit({
										url: m_api + '/v1/auth/change_password',
										method: 'POST',
										waitMsg: 'Saving data...',
										params: {
											OpsiDisplay: thisObj.viewVar.OpsiDisplay
										},
										success: function (fp, o) {
											Swal.fire({
												text: "Password Changed",
												icon: 'success',
												confirmButtonColor: '#3085d6',
											}).then((result) => {
												if (result.isConfirmed) {
													Ext.getCmp('MitraJaya.view.Admin.ChangePassword.MainForm').destroy(); //destory current view
													var MainForm = [];
													if (Ext.getCmp('MitraJaya.view.Admin.ChangePassword.MainForm') == undefined) {
														MainForm = Ext.create('MitraJaya.view.Admin.ChangePassword.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																SupplierID: o.result.SupplierID,
																PanelDisplayID: o.result.PanelDisplayID
															}
														});
													} else {
														Ext.getCmp('MitraJaya.view.Admin.ChangePassword.MainForm').destroy();
														MainForm = Ext.create('MitraJaya.view.Admin.ChangePassword.MainForm', {
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
                id: 'MitraJaya.view.Admin.ChangePassword.MainForm-labelInfoInsert'
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
        Ext.getCmp('MitraJaya.view.Admin.ChangePassword.MainForm').destroy(); //destory current view
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
