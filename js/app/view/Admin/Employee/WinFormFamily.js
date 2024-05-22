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

Ext.define('MitraJaya.view.Admin.Employee.WinFormFamily' ,{
    extend: 'Ext.window.Window',
    id: 'MitraJaya.view.Admin.Employee.WinFormFamily',
    cls: 'Sfr_LayoutPopupWindows',
    title:'Family Form',
    closable: true,
    modal: true,
    closeAction: 'destroy',
    width: '50%',
    height: 550,
    overflowY: 'auto',
    viewVar: false,
    setViewVar: function(value){
        this.viewVar = value;
    },
    listeners: {
        afterRender: function(){
            var thisObj = this;

            //form reset
            var FormNya = Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormFamily-Form');
            FormNya.getForm().reset();


            if(thisObj.viewVar.OpsiDisplay == 'insert'){
                
            }

            if(thisObj.viewVar.OpsiDisplay == 'update' || thisObj.viewVar.OpsiDisplay == 'view'){
                if(thisObj.viewVar.OpsiDisplay == 'view') {
                    Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormFamily-Form-BtnSave').setVisible(false);
                }

                FormNya.getForm().load({
                    url: m_api + '/v1/admin/employee/form_family',
                    method: 'GET',
                    params: {
                        family_id: thisObj.viewVar.family_id
                    },
                    success: function (form, action) {
                        var r = Ext.decode(action.response.responseText);
						
						//untuk handle combo bertingkat
                        var cmb_province = Ext.data.StoreManager.lookup('store.General.ProvinceList');
                        var cmb_district = Ext.data.StoreManager.lookup('store.General.DistrictList');
                        var cmb_subdistrict = Ext.data.StoreManager.lookup('store.General.SubDistrictList');
                        var cmb_village = Ext.data.StoreManager.lookup('store.General.VillageList');
						
                        cmb_province.load({
                            callback: function(records, operation, success){
                                Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormFamily-Form-province_id').setValue(r.data.province_id);
                                if (success == true) {
                                    cmb_district.load({
                                        params: {
                                            ProvinceID: r.data.province_id
                                        },
                                        callback: function(records, operation, success){
                                            if (success == true) {
                                                Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormFamily-Form-district_id').setValue(r.data.district_id);
                                                cmb_subdistrict.load({
                                                    params: {
                                                        DistrictID: r.data.district_id
                                                    },
                                                    callback: function(records, operation, success){

                                                        if (success == true) {
                                                            Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormFamily-Form-subdistrict_id').setValue(r.data.subdistrict_id);
                                                            cmb_village.load({
                                                                params: {
                                                                    SubDistrictID: r.data.subdistrict_id
                                                                },
                                                                callback: function(records, operation, success){
                                                                    if (success == true) {
                                                                        Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormFamily-Form-village_id').setValue(r.data.village_id);
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
							// footer: '<a href="">Why do I have this issue?</a>'
						})
                    }
                });
            }

            // Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormFamily').initMap('map-picker-plot', Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormFamily-Form-Latitude').getValue(), Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormFamily-Form-Longitude').getValue());
        }
    },
    initComponent: function() {
        var thisObj = this;
        let labelWidth = 150;

        thisObj.combo_family_status = Ext.create('MitraJaya.store.General.FamilyStatusList');
		
        let cmb_province = Ext.create('MitraJaya.store.General.ProvinceList');
        cmb_province.load();
        let cmb_district = Ext.create('MitraJaya.store.General.DistrictList');
        let cmb_subdistrict = Ext.create('MitraJaya.store.General.SubDistrictList');
        let cmb_village = Ext.create('MitraJaya.store.General.VillageList');

        //items -------------------------------------------------------------- (begin)
        thisObj.items = [{
        	xtype: 'form',
            id: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form',
            padding:'5 25 5 8',
            items:[{
                layout: 'column',
                border: false,
                items:[{
                    columnWidth: 0.5,
                    layout:'form',
                    items:[{
                    	xtype: 'hiddenfield',
                        id: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-family_id',
                        name: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-family_id',
                        fieldLabel: 'Loan Payment Amount'
                    },{
                    	xtype: 'textfield',
                        id: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-family_name',
                        name: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-family_name',
                        fieldLabel: 'Family Name',
                        labelAlign: "top",
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
                    },{
						fieldLabel: 'Gender',
						xtype: 'radiogroup',
                        labelAlign: "top",
						allowBlank: false,
						baseCls: 'Sfr_FormInputMandatory',
						readOnly: m_act_update,
						msgTarget: 'side',
						columns: 2,
						items: [{
							boxLabel: 'Male',
							name: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-family_gender',
							inputValue: 'male',
							id: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-family_gender1',
							listeners: {
								change: function () {
									return false;
								}
							}
						}, {
							boxLabel: 'Female',
							name: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-family_gender',
							inputValue: 'female',
							id: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-family_gender2',
							listeners: {
								change: function () {
									return false;
								}
							}
						}]
					},
                    {
                    	xtype: 'datefield',
                        id: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-family_birth_date',
                        name: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-family_birth_date',
                        fieldLabel: 'Birth Date',
                        labelAlign: "top",
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
                        format: 'Y-m-d'
                    },{
                    	xtype: 'textfield',
                        id: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-family_birth_place',
                        name: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-family_birth_place',
                        fieldLabel: 'Birth Place',
                        labelAlign: "top",
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
                    },{
						xtype: 'combobox',
						id: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-family_status',
						name: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-family_status',
						fieldLabel: 'Family Status',
                        labelAlign: "top",
						readOnly: m_act_update,
						store:thisObj.combo_family_status,
						queryMode:'local',
						displayField:'label',
						valueField:'id'							
					},{
                    	xtype: 'textfield',
                        id: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-family_phone',
                        labelAlign: "top",
                        name: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-family_phone',
                        fieldLabel: 'Phone Number'
                    },{
                    	xtype: 'textfield',
                        id: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-family_email',
                        labelAlign: "top",
                        name: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-family_email',
                        fieldLabel: 'Email'
                    }]
                },{
                    columnWidth: 0.5,
                    layout:'form',
					style:'margin-left:20px',
                    items:[{
						xtype: 'combobox',
						id: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-province_id',
						name: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-province_id',
						store: cmb_province,
						fieldLabel: 'Province',
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
								Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormFamily-Form-district_id').setValue('');
								Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormFamily-Form-subdistrict_id').setValue('');
								Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormFamily-Form-village_id').setValue('');
							}
						}
					},{
						xtype: 'combobox',
						id: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-district_id',
						name: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-district_id',
						store: cmb_district,
						fieldLabel: 'District',
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
								Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormFamily-Form-subdistrict_id').setValue('');
								Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormFamily-Form-village_id').setValue('');
							}
						}
					},{
						xtype: 'combobox',
						id: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-subdistrict_id',
						name: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-subdistrict_id',
						store: cmb_subdistrict,
						fieldLabel: 'Sub District',
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
								Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormFamily-Form-village_id').setValue('');
							}
						}
					},{
						xtype: 'combobox',
						id: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-village_id',
						name: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-village_id',
						store: cmb_village,
						fieldLabel: 'Village',
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
                        id: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-family_address',
                        labelAlign: "top",
                        name: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-family_address',
                        fieldLabel: 'Address'
                    }]
				}]
            }]
        }];
        //items -------------------------------------------------------------- (end)

        //buttons -------------------------------------------------------------- (begin)
        thisObj.buttons = [{
			icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/floppy-disk.svg',
            cls:'Sfr_BtnFormBlue',
            overCls:'Sfr_BtnFormBlue-Hover',
            text: 'Save',
            id: 'MitraJaya.view.Admin.Employee.WinFormFamily-Form-BtnSave',
            handler: function () {
            	var FormNya = Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormFamily-Form').getForm();
                if (FormNya.isValid()) {
                    FormNya.submit({
                        url: m_api + '/v1/admin/employee/submit_family',
                        method:'POST',
                        params: {
                            OpsiDisplay: thisObj.viewVar.OpsiDisplay,
                            people_id: thisObj.viewVar.people_id
                        },
                        waitMsg: 'Saving data...',
                        success: function(fp, o) {
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

                            Ext.getCmp('MitraJaya.view.Finance.Loan.MainForm-FormBasicData').getForm().load({
                                url: m_api + '/v1/finance/employeeloan/form_loan',
                                method: 'GET',
                                params: {
                                    EmployeeLoanID: thisObj.viewVar.EmployeeLoanID
                                },
                                success: function (form, action) {
                                    // Ext.MessageBox.hide();
                                    var r = Ext.decode(action.response.responseText);
                                    //Title
                                    // Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-labelInfoInsert').update('<div id="header_title_farmer">' + Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-EmployeeLoanID').getValue() + ' - <strong>' + Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-SupplierName').getValue() + '</strong></div>');
                                    // Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-labelInfoInsert').doLayout();
                                },
                                failure: function (form, action) {
                                    Swal.fire({
                                        icon: 'error',
                                        text: 'Failed to Retreive Data',
                                        // footer: '<a href="">Why do I have this issue?</a>'
                                    })
                                }
                            });

                        },
                        failure: function(fp, o){
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
                            catch(err) {
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
                }else{
                    Ext.MessageBox.show({
                        title: 'Attention',
                        msg: 'Form not valid yet',
                        buttons: Ext.MessageBox.OK,
                        animateTarget: 'mb9',
                        icon: 'ext-mb-info'
                    });
                }
            }
        },{
            icon: varjs.config.base_url + 'images/icons/new/close.png',
			text: 'Close',
			cls:'Sfr_BtnFormGrey',
			overCls:'Sfr_BtnFormGrey-Hover',
            handler: function() {
                thisObj.close();
            }
        }];
        //buttons -------------------------------------------------------------- (end)

        this.callParent(arguments);
    },
    
});
