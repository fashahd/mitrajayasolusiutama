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

Ext.define('MitraJaya.view.Admin.Employee.MainForm', {
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Admin.Employee.MainForm',
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
                    Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-BtnSave').setVisible(false);
                }

                //load formnya
                Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData').getForm().load({
                    url: m_api + '/v1/admin/employee/form_employee',
                    method: 'GET',
                    params: {
                        people_id: this.viewVar.people_id
                    },
                    success: function (form, action) {
                        Ext.MessageBox.hide();
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

        thisObj.combo_religion = Ext.create('MitraJaya.store.General.ReligionList');

        //Panel Basic ==================================== (Begin)
        thisObj.ObjPanelBasicData = Ext.create('Ext.panel.Panel', {
            frame: false,
            cls: 'Sfr_PanelLayoutForm',
            id: 'MitraJaya.view.Finance.Employee-FormGeneralData',
            items: [{
                layout: 'column',
                border: false,
                padding: 10,
                items: [{
                    columnWidth: 1,
                    layout: 'form',
                    cls: 'Sfr_PanelLayoutFormContainer',
                    items: [{
                        xtype: 'tabpanel',
                        flex: 1,
                        activeTab: 0,
                        plain: true,
                        cls: 'Sfr_TabForm',
                        id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-Tab',
                        items: [{
                            xtype: 'form',
                            id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData',
                            fileUpload: true,
                            buttonAlign: 'center',
                            title: lang('Basic Info'),
                            cls: 'Sfr_PanelSubLayoutForm',
                            items: [{
								layout: 'column',
								border: false,
								items: [{
									columnWidth: 0.3,
									layout: 'form',
									style: 'padding:10px 0px 10px 5px;',
									items: [{
										xtype: 'panel',
										id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-Photo',
										html: '<img src="' + m_api_base_url + '/assets/images/no-images.png" style="height:250px;margin:0px 5px 5px 0px;float:left;" />'
									}, {
										xtype: 'fileuploadfield',
										id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-PhotoInput',
										name: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-PhotoInput',
										buttonText: 'Browse',
										cls: 'Sfr_FormBrowseBtn',
										buttonOnly: true,
										listeners: {
											'change': function (fb, v) {
												Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData').getForm().submit({
													url: m_api + '/farmers/photo_farmer',
													clientValidation: false,
													params: {
														opsiDisplay: thisObj.viewVar.opsiDisplay,
														FarmerID: Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-FarmerID').getValue(),
														ProvinceID: Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-Province').getValue()
													},
													waitMsg: 'Sending Photo...',
													success: function (fp, o) {
														// Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-Photo').update('<img src="' + m_api_base_url + '/images/Photo/' + o.result.file + '" style="height:150px;margin:0px 5px 5px 0px;float:left;" />');
														// Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-PhotoOld').setValue(o.result.photoInput);

														if(thisObj.viewVar.opsiDisplay == 'insert') {
															//Insert
															Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-Photo').update('<img src="' + m_api_base_url + '/files/export/' + o.result.file + '" style="height:150px;margin:0px 5px 5px 0px;float:left;" />');
															Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-PhotoOld').setValue(o.result.file);
														} else {
															//Update / View
															Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-Photo').update('<img src="' + o.result.fileurl + '" style="height:150px;margin:0px 5px 5px 0px;float:left;" />');
														}
													},
													failure: function (fp, o) {
														Ext.MessageBox.show({
															title: lang('Error'),
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
										id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-PhotoOld',
										name: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-PhotoOld',
										inputType: 'hidden'
									}]
								},{
									columnWidth: 0.7,
									layout: 'form',
									style: 'padding:10px 5px 10px 20px;',
									items: [{
										xtype: 'panel',
										title: lang('Personal Data'),
										frame: false,
										id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-SectionFarmerProfile',
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
													inputType: 'hidden',
													id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-people_id',
													name: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-people_id'
												},{
													xtype: 'textfield',
													id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-people_ext_id',
													name: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-people_ext_id',
													fieldLabel: lang('Staff ID'),
													readOnly: m_act_update,
													allowBlank: false,
													baseCls: 'Sfr_FormInputMandatory',
												},{
													html:'<div style="margin-bottom:10px"></div>'
												},{
													xtype: 'textfield',
													id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-people_name',
													name: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-people_name',
													fieldLabel: lang('Full Name'),
													readOnly: m_act_update,
													allowBlank: false,
													baseCls: 'Sfr_FormInputMandatory',
												},{
													html:'<div style="margin-bottom:10px"></div>'
												}, {
													fieldLabel: lang('Gender'),
													xtype: 'radiogroup',
													allowBlank: false,
													baseCls: 'Sfr_FormInputMandatory',
													readOnly: m_act_update,
													msgTarget: 'side',
													columns: 2,
													items: [{
														boxLabel: lang('Male'),
														name: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-people_gender',
														inputValue: 'male',
														id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-people_gender1',
														listeners: {
															change: function () {
																return false;
															}
														}
													}, {
														boxLabel: lang('Female'),
														name: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-people_gender',
														inputValue: 'female',
														id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-people_gender2',
														listeners: {
															change: function () {
																return false;
															}
														}
													}]
												},{
													html:'<div style="margin-bottom:10px"></div>'
												},{
													xtype: 'datefield',
													format: 'Y-m-d',
													editable:false,
													value:'2000-01-01',
													readOnly: m_act_update,
													id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-birth_date',
													name: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-birth_date',
													fieldLabel: lang('Date of Birth')
												},{
													html:'<div style="margin-bottom:10px"></div>'
												},{
													xtype: 'textfield',
													readOnly: m_act_update,
													id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-birth_place',
													name: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-birth_place',
													fieldLabel: lang('Place of Birth')
												},{
													html:'<div style="margin-bottom:10px"></div>'
												},{
													xtype: 'combobox',
													id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-religion',
													name: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-religion',
													fieldLabel: lang('Religion'),
													readOnly: m_act_update,
													store:thisObj.combo_religion,
													queryMode:'local',
													displayField:'label',
													valueField:'id'							
												}]
											}]
										}]
									}]
								}]
							}]
						},{
                            xtype: 'panel',
                            title: lang('Family'),
							disabled:true,
                            id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-TabAddDataFamily',
                            items: [{
                                layout: 'column',
                                border: false,
                                items: [{
                                    columnWidth: 1,
                                    layout: 'form',
                                    style: 'padding: 10px 0 0 0;min-height:1000px;',
                                    items: []
                                }]
                            }]
                        },{
                            xtype: 'panel',
                            title: lang('Emergency Contact'),
							disabled:true,
                            id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-TabAddDataEmergency',
                            items: [{
                                layout: 'column',
                                border: false,
                                items: [{
                                    columnWidth: 1,
                                    layout: 'form',
                                    style: 'padding: 10px 0 0 0;min-height:1000px;',
                                    items: []
                                }]
                            }]
                        }],
                        buttons: [{
                            xtype: 'button',
                            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/floppy-disk.svg',
                            text: lang('Save'),
                            cls: 'Sfr_BtnFormBlue',
                            overCls: 'Sfr_BtnFormBlue-Hover',
                            id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-BtnSave',
                            handler: function () {
                                var Formnya = Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData').getForm();

                                if (Formnya.isValid()) {
                                    Formnya.submit({
                                        url: m_api + '/v1/admin/employee/submit',
                                        method: 'POST',
                                        waitMsg: 'Saving data employee...',
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
													Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm').destroy(); //destory current view
													var MainForm = [];
													if (Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm') == undefined) {
														MainForm = Ext.create('MitraJaya.view.Admin.Employee.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																people_id: o.result.people_id
															}
														});
													} else {
														Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm').destroy();
														MainForm = Ext.create('MitraJaya.view.Admin.Employee.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																people_id: o.result.people_id
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
                id: 'MitraJaya.view.Admin.Employee.MainForm-labelInfoInsert',
                html: '<div id="header_title_farmer">' + lang('Employee Data') + '</div>'
            }]
        }, {
            items: [{
                id: 'MitraJaya.view.Admin.Employee.MainForm-LinkBackToList',
                html: '<div id="Sfr_IdBoxInfoDataGrid" class="Sfr_BoxInfoDataGridForm"><ul class="Sft_UlListInfoDataGrid">'
				+'<li class="Sft_ListInfoDataGrid"><a href="javascript:Ext.getCmp(\'MitraJaya.view.Admin.Employee.MainForm\').BackToList()">'
				+'<img class="Sft_ListIconInfoDataGrid" src="' + varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/circle-chevron-left.svg" width="20" />&nbsp;&nbsp;' + lang('Back to Employee List') + '</a></li></div>'
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
            }]
        }];
        //========================================================== LAYOUT UTAMA (END) ========================================//

        this.callParent(arguments);
    },
    BackToList: function () {
        Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm').destroy(); //destory current view
        var GridMainGrower = [];
        if (Ext.getCmp('MitraJaya.view.Admin.Employee.MainGrid') == undefined) {
            GridMainGrower = Ext.create('MitraJaya.view.Admin.Employee.MainGrid');
        } else {
            //destroy, create ulang
            Ext.getCmp('MitraJaya.view.Admin.Employee.MainGrid').destroy();
            GridMainGrower = Ext.create('MitraJaya.view.Admin.Employee.MainGrid');
        }
    }
});
