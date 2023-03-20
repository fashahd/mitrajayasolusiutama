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
				Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-TabPayrollInformation').setDisabled(true);
				Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-TabStaffInformation').setDisabled(true);				
            }

            if (thisObj.viewVar.OpsiDisplay == 'view' || thisObj.viewVar.OpsiDisplay == 'update') {
				Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-TabPayrollInformation').setDisabled(false);
				Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-TabStaffInformation').setDisabled(false);
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

						//untuk handle combo bertingkat
                        var cmb_province = Ext.data.StoreManager.lookup('store.General.ProvinceList');
                        var cmb_district = Ext.data.StoreManager.lookup('store.General.DistrictList');
                        var cmb_subdistrict = Ext.data.StoreManager.lookup('store.General.SubDistrictList');
                        var cmb_village = Ext.data.StoreManager.lookup('store.General.VillageList');

						if(r.data.photo != ''){							
							Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-Photo').update('<img src="' + r.data.photo + '" style="height:300px;margin:0px 5px 5px 0px;float:left;" />');
						}
						
                        cmb_province.load({
                            callback: function(records, operation, success){
                                Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-province_id').setValue(r.data.province_id);
                                if (success == true) {
                                    cmb_district.load({
                                        params: {
                                            ProvinceID: r.data.province_id
                                        },
                                        callback: function(records, operation, success){
                                            if (success == true) {
                                                Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-district_id').setValue(r.data.district_id);
                                                cmb_subdistrict.load({
                                                    params: {
                                                        DistrictID: r.data.district_id
                                                    },
                                                    callback: function(records, operation, success){

                                                        if (success == true) {
                                                            Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-subdistrict_id').setValue(r.data.subdistrict_id);
                                                            cmb_village.load({
                                                                params: {
                                                                    SubDistrictID: r.data.subdistrict_id
                                                                },
                                                                callback: function(records, operation, success){
                                                                    if (success == true) {
                                                                        Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-village_id').setValue(r.data.village_id);
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });
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
        let cmb_province = Ext.create('MitraJaya.store.General.ProvinceList');
        cmb_province.load();
        let cmb_district = Ext.create('MitraJaya.store.General.DistrictList');
        let cmb_subdistrict = Ext.create('MitraJaya.store.General.SubDistrictList');
        let cmb_village = Ext.create('MitraJaya.store.General.VillageList');
        var storeGridContract = Ext.create('MitraJaya.store.Admin.Employee.GridContract',{
			storeVar: {
				people_id: thisObj.viewVar.people_id
			}
		});

        var contextMenuGridContract = Ext.create('Ext.menu.Menu',{
            items:[{
                icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eye.svg',
                text: lang('View'),
                handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-gridContract').getSelectionModel().getSelection()[0];

                    var winFormContract = Ext.create('MitraJaya.view.Admin.Employee.WinFormContract');
                    winFormContract.setViewVar({
						OpsiDisplay:'view',
						CallerStore: storeGridContract,
						people_id:thisObj.viewVar.people_id,
						contract_id:sm.get('contract_id')
					});
                    if (!winFormContract.isVisible()) {
                        winFormContract.center();
                        winFormContract.show();
                    } else {
                        winFormContract.close();
                    }
                }
            },{
	            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/pen-to-square.svg',
                text: lang('Update'),
                hidden: m_act_update,
                handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-gridContract').getSelectionModel().getSelection()[0];

                    var winFormContract = Ext.create('MitraJaya.view.Admin.Employee.WinFormContract');
                    winFormContract.setViewVar({
						OpsiDisplay:'update',
						CallerStore: storeGridContract,
						people_id:thisObj.viewVar.people_id,
						contract_id:sm.get('contract_id')
					});
                    if (!winFormContract.isVisible()) {
                        winFormContract.center();
                        winFormContract.show();
                    } else {
                        winFormContract.close();
                    }

                }
            },{
	            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eraser.svg',
                text: lang('Delete'),
                hidden: m_act_delete,
                handler: function(){
                    var sm = Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-gridContract').getSelectionModel().getSelection()[0];

                    Ext.MessageBox.confirm('Message', 'Do you want to delete this data ?', function(btn) {
                        if (btn == 'yes') {
                            Ext.Ajax.request({
                                waitMsg: 'Please Wait',
                                url: m_api + '/v1/admin/employee/delete_contract',
                                method: 'DELETE',
                                params: {
                                    contract_id: sm.get('contract_id')
                                },
                                success: function(response, opts) {
                                    Ext.MessageBox.show({
                                        title: 'Information',
                                        msg: lang('Data deleted'),
                                        buttons: Ext.MessageBox.OK,
                                        animateTarget: 'mb9',
                                        icon: 'ext-mb-success'
                                    });

                                    //refresh store FamLab
                                    Ext.data.StoreManager.lookup('store.Grower.GridMemberContract').load();
                                },
                                failure: function(response, opts) {
                                    var pesanNya;
                                    if(o.result.message != undefined){
                                        pesanNya = o.result.message;
                                    }else{
                                        pesanNya = lang('Connection error');
                                    }
                                    Ext.MessageBox.show({
                                        title: 'Error',
                                        msg: pesanNya,
                                        buttons: Ext.MessageBox.OK,
                                        animateTarget: 'mb9',
                                        icon: 'ext-mb-error'
                                    });
                                }
                            });
                        }
                    });
                }
            }]
        });

        var objPanelStaff = Ext.create('Ext.panel.Panel',{
            title: lang('List of Staff Contract'),
            frame: false,
            collapsible:false,
            margin:'0 0 40 0',
            id: 'MitraJaya.view.Admin.Employee.MainForm-PanelContract',
            dockedItems: [{
                xtype: 'pagingtoolbar',
                id: 'view.Grower.GridMainGrower-gridToolbar',
                store: storeGridContract,
                dock: 'bottom',
                displayInfo: true
            },{
                xtype: 'toolbar',
                baseCls: 'bgToolbarTitlePanel',
                dock: 'top',
                items:[{
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/square-plus.svg',
                    cls:'Sfr_BtnGridNewWhite',
					style:'margin: 10px 0px 10px 0px',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    text: lang('Add'),
                    id:'MitraJaya.view.Admin.Employee.MainForm-gridContract-BtnAdd',
                    hidden: m_act_add,
                    handler: function() {
                        var winFormContract = Ext.create('MitraJaya.view.Admin.Employee.WinFormContract');
						winFormContract.setViewVar({
                            OpsiDisplay:'insert',
                            CallerStore: storeGridContract,
                            people_id:thisObj.viewVar.people_id
                        });
                        if (!winFormContract.isVisible()) {
                            winFormContract.center();
                            winFormContract.show();
                        } else {
                            winFormContract.close();
                        }
                    }
                }]
            }],
            items: [{
                xtype: 'grid',
                id: 'MitraJaya.view.Admin.Employee.MainForm-gridContract',
                loadMask: true,
				minHeight:300,
                selType: 'rowmodel',
                store: storeGridContract,
                viewConfig: {
                    deferEmptyText: false,
                    emptyText: GetDefaultContentNoData()
                },
                minHeight:125,
                columns: [{
                    text: lang('Action'),
                    xtype:'actioncolumn',
                    flex: 0.5,
                    items:[{
						icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/caret-down.svg',
                        tooltip: 'Action',
                        handler: function(grid, rowIndex, colIndex, item, e, record) {
                            contextMenuGridContract.showAt(e.getXY());
                        }
                    }]
                },{
                    text: lang('ContractID'),
                    dataIndex: 'contract_id',
                    hidden:true
                },{
                    text: lang('Contract No'),
                    dataIndex: 'contract_number',
                    flex: 1,
                },{
                    text: lang('Position'),
                    dataIndex: 'position',
                    flex: 1,
                },{
                    text: lang('Gol'),
                    dataIndex: 'gol',
                    flex: 1,
                },{
                    text: lang('Employment Status'),
                    dataIndex: 'contract_status',
                    flex: 1,
                },{
                    text: lang('Employement Date'),
                    dataIndex: 'employment_date',
                    flex: 1,
                }]
            }]
        });

        var objPanelPayroll = Ext.create('MitraJaya.view.Admin.Employee.PanelPayroll', {
			viewVar: {
				OpsiDisplay: thisObj.viewVar.OpsiDisplay,
				people_id:thisObj.viewVar.people_id
			}
		});

        //Panel Basic ==================================== (Begin)
        thisObj.ObjPanelBasicData = Ext.create('Ext.panel.Panel', {
            frame: false,
            cls: 'Sfr_PanelLayoutForm',
            id: 'MitraJaya.view.Admin.Employee-FormGeneralData',
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
                            title: lang('Employee Data'),
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
										html: '<img src="' + m_api_base_url + '/assets/images/no-images.png" style="height:300px;margin:0px 5px 5px 0px;float:left;" />'
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
													url: m_api + '/v1/admin/employee/photo_upload',
													clientValidation: false,
													params: {
														OpsiDisplay: thisObj.viewVar.OpsiDisplay,
														people_id: Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-people_id').getValue()
													},
													waitMsg: 'Sending Photo...',
													success: function (fp, o) {
														// Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-Photo').update('<img src="' + m_api_base_url + '/images/Photo/' + o.result.file + '" style="height:150px;margin:0px 5px 5px 0px;float:left;" />');
														// Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-PhotoOld').setValue(o.result.photoInput);

														if(thisObj.viewVar.opsiDisplay == 'insert') {
															//Insert
															Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-Photo').update('<img src="' + o.result.fileurl + '" style="height:300px;margin:0px 5px 5px 0px;float:left;" />');
															Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-PhotoOld').setValue(o.result.file);
														} else {
															//Update / View
															Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-PhotoOld').setValue(o.result.file);
															Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-Photo').update('<img src="' + o.result.fileurl + '" style="height:300px;margin:0px 5px 5px 0px;float:left;" />');
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
								},{
									columnWidth: 0.5,
									layout: 'form',
									style: 'padding:10px 5px 10px 20px;',
									items: [{
										xtype: 'panel',
										title: lang('Address & Location'),
										frame: false,
										id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-SectionAddress',
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
													labelAlign: 'top',
													labelWidth: 150
												},
												items: [{
                                                    xtype: 'combobox',
                                                    id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-province_id',
                                                    name: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-province_id',
                                                    store: cmb_province,
                                                    fieldLabel: lang('Province'),
                                                    labelAlign:'top',
                                                    queryMode: 'local',
                                                    displayField: 'label',
                                                    valueField: 'id',
                                                    listeners: {
                                                        change: function(cb, nv, ov) {
                                                            cmb_district.load({
                                                                params: {
                                                                    ProvinceID: nv
                                                                }
                                                            });
                                                            Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-district_id').setValue('');
                                                            Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-subdistrict_id').setValue('');
                                                            Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-village_id').setValue('');
                                                        }
                                                    }
                                                },{
                                                    xtype: 'combobox',
                                                    id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-district_id',
                                                    name: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-district_id',
                                                    store: cmb_district,
                                                    fieldLabel: lang('District'),
                                                    labelAlign:'top',
                                                    queryMode: 'local',
                                                    displayField: 'label',
                                                    valueField: 'id',
                                                    listeners: {
                                                        change: function(cb, nv, ov) {
                                                            cmb_subdistrict.load({
                                                                params: {
                                                                    DistrictID: nv
                                                                }
                                                            });
                                                            Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-subdistrict_id').setValue('');
                                                            Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-village_id').setValue('');
                                                        }
                                                    }
                                                },{
                                                    xtype: 'combobox',
                                                    id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-subdistrict_id',
                                                    name: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-subdistrict_id',
                                                    store: cmb_subdistrict,
                                                    fieldLabel: lang('Sub District'),
                                                    labelAlign:'top',
                                                    queryMode: 'local',
                                                    displayField: 'label',
                                                    valueField: 'id',
                                                    listeners: {
                                                        change: function(cb, nv, ov) {
                                                            cmb_village.load({
                                                                params: {
                                                                    SubDistrictID: nv
                                                                }
                                                            });
                                                            Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm-FormBasicData-village_id').setValue('');
                                                        }
                                                    }
                                                },{
                                                    xtype: 'combobox',
                                                    id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-village_id',
                                                    name: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-village_id',
                                                    fieldLabel: lang('Village'),
                                                    store: cmb_village,
                                                    labelAlign:'top',
                                                    queryMode: 'local',
                                                    displayField: 'label',
                                                    valueField: 'id',
                                                    listeners: {
                                                        change: function(cb, nv, ov) {
															return false;
                                                        }
                                                    }
                                                },{
													xtype: 'textarea',
													readOnly: m_act_update,
													id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-address',
													name: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-address',
													fieldLabel: lang('Address')
												}]
											}]
										}]
									}]
								},{
									columnWidth: 0.5,
									layout: 'form',
									style: 'padding:10px 5px 10px 20px;',
									items: [{
										xtype: 'panel',
										title: lang('Communication'),
										frame: false,
										id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-SectionCommunication',
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
													labelAlign: 'top',
													labelWidth: 150
												},
												items: [{
													xtype: 'textfield',
													readOnly: m_act_update,
													id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-people_email',
													name: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-people_email',
													fieldLabel: lang('Email')
												},{
													html:'<div style="margin-bottom:10px"></div>'
												},{
													xtype: 'textfield',
													readOnly: m_act_update,
													id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-phone_number',
													name: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-phone_number',
													fieldLabel: lang('Handphone')
												}]
											}]
										}]
									},{
										xtype: 'panel',
										title: lang('Bank Information'),
										frame: false,
										id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-SectionBank',
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
													labelAlign: 'top',
													labelWidth: 150
												},
												items: [{
													xtype: 'textfield',
													readOnly: m_act_update,
													id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-bank',
													name: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-bank',
													fieldLabel: lang('Bank Name')
												},{
													html:'<div style="margin-bottom:10px"></div>'
												},{
													xtype: 'textfield',
													readOnly: m_act_update,
													id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-account_no',
													name: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-account_no',
													fieldLabel: lang('Account Number')
												},{
													html:'<div style="margin-bottom:10px"></div>'
												},{
													xtype: 'textfield',
													readOnly: m_act_update,
													id: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-account_beneficiary',
													name: 'MitraJaya.view.Admin.Employee.MainForm-FormBasicData-account_beneficiary',
													fieldLabel: lang('Account Number Beneficiary')
												}]
											}]
										}]
									}]
								}]
							}]
						},{
                            xtype: 'panel',
                            title: lang('Payroll Information'),
                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-TabPayrollInformation',
							disabled:true,
                            items: [{
                                layout: 'column',
                                border: false,
                                items: [{
                                    columnWidth: 1,
                                    layout: 'form',
                                    style: 'padding: 10px 0 0 0;min-height:1000px;',
                                    items: [objPanelPayroll]
                                }]
                            }]
                        },{
                            xtype: 'panel',
                            title: lang('Staff Contract'),
                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-TabStaffInformation',
							disabled:true,
                            items: [{
                                layout: 'column',
                                border: false,
                                items: [{
                                    columnWidth: 1,
                                    layout: 'form',
                                    style: 'padding: 10px 0 0 0;min-height:1000px;',
                                    items: [objPanelStaff]
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

		var objPanelDinamis = [];

		if(thisObj.viewVar.OpsiDisplay == 'update' || thisObj.viewVar.OpsiDisplay == 'view'){
			//Panel Family
			thisObj.ObjPanelFamily = Ext.create('MitraJaya.view.Admin.Employee.GridFamily',{
				viewVar: {
					people_id: thisObj.viewVar.people_id
				}
			});
			objPanelDinamis.push(thisObj.ObjPanelFamily);
			//panel Form Family ======================================================================== (end)

			//Panel Education
			thisObj.ObjPanelEducation = Ext.create('MitraJaya.view.Admin.Employee.GridEducation',{
				viewVar: {
					people_id: thisObj.viewVar.people_id
				}
			});
			objPanelDinamis.push(thisObj.ObjPanelEducation);
			//panel Form Education ======================================================================== (end)
		}

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
                columnWidth: 0.6,
				style:'margin-right:20px',
                items: [
                    thisObj.ObjPanelBasicData
                ]
            },{
                //RIGHT CONTENT
                columnWidth: 0.4,
                items:objPanelDinamis
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
