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

Ext.define('MitraJaya.view.Admin.Employee.WinFormEducation' ,{
    extend: 'Ext.window.Window',
    id: 'MitraJaya.view.Admin.Employee.WinFormEducation',
    cls: 'Sfr_LayoutPopupWindows',
    title:'Education Form',
    closable: true,
    modal: true,
    closeAction: 'destroy',
    width: '50%',
    height: 400,
    overflowY: 'auto',
    viewVar: false,
    setViewVar: function(value){
        this.viewVar = value;
    },
    listeners: {
        afterRender: function(){
            var thisObj = this;

            //form reset
            var FormNya = Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormEducation-Form');
            FormNya.getForm().reset();


            if(thisObj.viewVar.OpsiDisplay == 'insert'){
                
            }

            if(thisObj.viewVar.OpsiDisplay == 'update' || thisObj.viewVar.OpsiDisplay == 'view'){
                if(thisObj.viewVar.OpsiDisplay == 'view') {
                    Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormEducation-Form-BtnSave').setVisible(false);
                }

                FormNya.getForm().load({
                    url: m_api + '/v1/admin/employee/form_education',
                    method: 'GET',
                    params: {
                        education_id: thisObj.viewVar.education_id
                    },
                    success: function (form, action) {
                        var r = Ext.decode(action.response.responseText);
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

            // Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormEducation').initMap('map-picker-plot', Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormEducation-Form-Latitude').getValue(), Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormEducation-Form-Longitude').getValue());
        }
    },
    initComponent: function() {
        var thisObj = this;
        let labelWidth = 150;

        thisObj.combo_education_level = Ext.create('MitraJaya.store.General.EducationLevel');

        //items -------------------------------------------------------------- (begin)
        thisObj.items = [{
        	xtype: 'form',
            id: 'MitraJaya.view.Admin.Employee.WinFormEducation-Form',
            padding:'5 25 5 8',
            items:[{
                layout: 'column',
                border: false,
                items:[{
                    columnWidth: 0.5,
                    layout:'form',
                    items:[{
                    	xtype: 'hiddenfield',
                        id: 'MitraJaya.view.Admin.Employee.WinFormEducation-Form-education_id',
                        name: 'MitraJaya.view.Admin.Employee.WinFormEducation-Form-education_id',
                        fieldLabel: 'Education ID'
                    },{
                    	xtype: 'textfield',
                        id: 'MitraJaya.view.Admin.Employee.WinFormEducation-Form-school_name',
                        name: 'MitraJaya.view.Admin.Employee.WinFormEducation-Form-school_name',
                        fieldLabel: 'School Name',
                        labelAlign: "top",
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
                    },{
                    	xtype: 'datefield',
						format:'Y-m-d',
                        id: 'MitraJaya.view.Admin.Employee.WinFormEducation-Form-start_year',
                        labelAlign: "top",
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
                        name: 'MitraJaya.view.Admin.Employee.WinFormEducation-Form-start_year',
                        fieldLabel: 'Start Date'
                    },{
                    	xtype: 'datefield',
						format:'Y-m-d',
                        id: 'MitraJaya.view.Admin.Employee.WinFormEducation-Form-end_year',
                        labelAlign: "top",
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
                        name: 'MitraJaya.view.Admin.Employee.WinFormEducation-Form-end_year',
                        fieldLabel: 'End Date'
                    }]
                },{
                    columnWidth: 0.5,
                    layout:'form',
					style:'margin-left:20px',
                    items:[{
						xtype: 'combobox',
						id: 'MitraJaya.view.Admin.Employee.WinFormEducation-Form-education_level',
						name: 'MitraJaya.view.Admin.Employee.WinFormEducation-Form-education_level',
						fieldLabel: 'Education Level',
                        labelAlign: "top",
						readOnly: m_act_update,
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
						store:thisObj.combo_education_level,
						queryMode:'local',
						displayField:'label',
						valueField:'id'							
					},{
                    	xtype: 'textfield',
                        id: 'MitraJaya.view.Admin.Employee.WinFormEducation-Form-gpa',
                        name: 'MitraJaya.view.Admin.Employee.WinFormEducation-Form-gpa',
                        fieldLabel: 'GPA',
                        labelAlign: "top"
                    },{
                    	xtype: 'textfield',
                        id: 'MitraJaya.view.Admin.Employee.WinFormEducation-Form-gpa_from',
                        name: 'MitraJaya.view.Admin.Employee.WinFormEducation-Form-gpa_from',
                        fieldLabel: 'GPA FROM',
                        labelAlign: "top"
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
            id: 'MitraJaya.view.Admin.Employee.WinFormEducation-Form-BtnSave',
            handler: function () {
            	var FormNya = Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormEducation-Form').getForm();
                if (FormNya.isValid()) {
                    FormNya.submit({
                        url: m_api + '/v1/admin/employee/submit_education',
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
