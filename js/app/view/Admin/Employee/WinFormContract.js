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

Ext.define('MitraJaya.view.Admin.Employee.WinFormContract' ,{
    extend: 'Ext.window.Window',
    id: 'MitraJaya.view.Admin.Employee.WinFormContract',
    cls: 'Sfr_LayoutPopupWindows',
    title:'Contract Form',
    closable: true,
    modal: true,
    closeAction: 'destroy',
    width: '50%',
    height: 500,
    overflowY: 'auto',
    viewVar: false,
    setViewVar: function(value){
        this.viewVar = value;
    },
    listeners: {
        afterRender: function(){
            var thisObj = this;

            //form reset
            var FormNya = Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormContract-Form');
            FormNya.getForm().reset();


            if(thisObj.viewVar.OpsiDisplay == 'insert'){
                
            }

            if(thisObj.viewVar.OpsiDisplay == 'update' || thisObj.viewVar.OpsiDisplay == 'view'){
                if(thisObj.viewVar.OpsiDisplay == 'view') {
                    Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormContract-Form-BtnSave').setVisible(false);
                }

                FormNya.getForm().load({
                    url: m_api + '/v1/admin/employee/form_contract',
                    method: 'GET',
                    params: {
                        contract_id: thisObj.viewVar.contract_id
                    },
                    success: function (form, action) {
                        var r = Ext.decode(action.response.responseText);

						if(r.data.document != ''){
							Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormContract-Form-FileDocument').update('<a href="'+r.data.document+'" title="Download File" target="_blank">'+'Download File'+'    <img src="'+m_api_base_url+'/assets/images/pdf-icon.png" height="24" /></a>');
							Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormContract-Form-FileDocument').doLayout();
						}
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
        }
    },
    initComponent: function() {
        var thisObj = this;
        let labelWidth = 150;

        let combo_golongan = Ext.create('MitraJaya.store.General.GolList');
        let combo_position = Ext.create('MitraJaya.store.General.PositionList');

        //items -------------------------------------------------------------- (begin)
        thisObj.items = [{
        	xtype: 'form',
            id: 'MitraJaya.view.Admin.Employee.WinFormContract-Form',
            padding:'5 25 5 8',
            items:[{
                layout: 'column',
                border: false,
                items:[{
                    columnWidth: 0.5,
                    layout:'form',
                    items:[{
                    	xtype: 'hiddenfield',
                        id: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-contract_id',
                        name: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-contract_id',
                        fieldLabel: 'Contract ID'
                    },{
                    	xtype: 'textfield',
                        id: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-contract_number',
                        name: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-contract_number',
                        fieldLabel: 'Contract Number',
                        labelAlign: "top",
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
                    },{
                    	xtype: 'combobox',
                        id: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-position',
                        name: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-position',
                        fieldLabel: 'Position',
                        labelAlign: "top",
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
						store: combo_position,
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
                    	xtype: 'combobox',
                        id: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-gol',
                        name: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-gol',
                        fieldLabel: 'Gol',
                        labelAlign: "top",
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
						store: combo_golongan,
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
                    	xtype: 'numericfield',
                        id: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-contract_wage',
                        name: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-contract_wage',
                        fieldLabel: 'Salary per Month',
                        labelAlign: "top",
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
                    },{
                        xtype: 'hiddenfield',
                        id: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-document_old',
                        name: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-document_old'
                    },{
                        xtype: 'fileuploadfield',
                        labelWidth: 125,
						labelAlign:'top',
                        fieldLabel: 'Attachment' + ' <sup style="color:#FF0000;">(Max:10MB)</sup>' + ' *',
                        id: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-document',
                        name: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-document',
                        buttonText: 'Browse',
                        listeners: {
							afterrender: function (cmp) {
								cmp.fileInputEl.set({
									accept: '.pdf'
								});
							},
                            'change': function (fb, v) {

                                if (Math.floor(fb.fileInputEl.dom.files[0].size / 1000000) > 10) { //maksimal 10MB
                                    alert("file size more than 10MB");
                                    Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormContract-Form-document').reset(true);
                                } else {
                                    Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormContract-Form').getForm().submit({
                                        url: m_api + '/v1/admin/employee/document_contract_upload',
                                        clientValidation: false,
                                        params: {
                                            OpsiDisplay: thisObj.viewVar.OpsiDisplay,
											people_id: thisObj.viewVar.people_id,
                                            contract_id: Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormContract-Form-contract_id').getValue()
                                        },
                                        waitMsg: 'Sending Image',
                                        success: function (fp, o) {
                                            Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormContract-Form-document_old').setValue(o.result.FilePath);
											Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormContract-Form-FileDocument').update('<a href="'+o.result.file+'" title="Download File" target="_blank">'+'Download File'+'    <img src="'+m_api_base_url+'/assets/images/pdf-icon.png" height="24" /></a>');
											Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormContract-Form-FileDocument').doLayout();
                                        },
                                        failure: function (fp, o) {
                                            Ext.MessageBox.show({
                                                title: 'Attention',
                                                msg: o.result.message,
                                                buttons: Ext.MessageBox.OK,
                                                animateTarget: 'mb9',
                                                icon: 'ext-mb-error'
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    },{
                        id:'MitraJaya.view.Admin.Employee.WinFormContract-Form-FileDocument',
                        html:'<img src="'+m_api_base_url+'/assets/images/no-images.png" height="200" />'        
                    },{
                        html:'<div style="margin-top:5px;font-size:10px;font-style:italic;">'+'File must PDF'+'</div>'
                    }]
                },{
                    columnWidth: 0.5,
                    layout:'form',
					style:'margin-left:20px',
                    items:[{
						fieldLabel: 'Employment Status',
						xtype: 'radiogroup',
						allowBlank: false,
						labelAlign:'top',
						baseCls: 'Sfr_FormInputMandatory',
						readOnly: m_act_update,
						msgTarget: 'side',
						columns: 3,
						items: [{
							boxLabel: 'Contract',
							name: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-contract_status',
							inputValue: 'contract',
							id: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-contract_status1',
							listeners: {
								change: function () {
									if(this.checked == true){
										Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormContract-Form-end_date').setVisible(true);
										Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormContract-Form-end_date').allowBlank = false;
										Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormContract-Form-end_date').addCls('Sfr_FormInputMandatory');
									}
									return false;
								}
							}
						}, {
							boxLabel: 'Permanent',
							name: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-contract_status',
							inputValue: 'permanent',
							id: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-contract_status2',
							listeners: {
								change: function () {
									if(this.checked == true){
										Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormContract-Form-end_date').setVisible(false);
										Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormContract-Form-end_date').allowBlank = true;
									}
									return false;
								}
							}
						}, {
							boxLabel: 'Probation',
							name: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-contract_status',
							inputValue: 'probation',
							id: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-contract_status3',
							listeners: {
								change: function () {
									if(this.checked == true){
										Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormContract-Form-end_date').setVisible(true);
										Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormContract-Form-end_date').allowBlank = false;
										Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormContract-Form-end_date').addCls('Sfr_FormInputMandatory');
									}
									return false;
								}
							}
						}]
					},{
                    	xtype: 'datefield',
						format:'Y-m-d',
                        id: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-start_date',
                        labelAlign: "top",
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
                        name: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-start_date',
                        fieldLabel: 'Join Date'
                    },{
                    	xtype: 'datefield',
						format:'Y-m-d',
                        id: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-end_date',
                        labelAlign: "top",
                        name: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-end_date',
                        fieldLabel: 'End of Employment Date'
                    },{
                    	xtype: 'textfield',
                        id: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-location',
                        name: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-location',
                        fieldLabel: 'Work Location',
                        labelAlign: "top"
                    },{
						fieldLabel: 'Contract Status',
						xtype: 'radiogroup',
						allowBlank: false,
						labelAlign:'top',
						baseCls: 'Sfr_FormInputMandatory',
						readOnly: m_act_update,
						msgTarget: 'side',
						columns: 2,
						items: [{
							boxLabel: 'Active',
							name: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-employee_status',
							inputValue: '1',
							id: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-employee_status1'
						}, {
							boxLabel: 'Inactie',
							name: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-employee_status',
							inputValue: '2',
							id: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-employee_status2'
						}]
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
            id: 'MitraJaya.view.Admin.Employee.WinFormContract-Form-BtnSave',
            handler: function () {
            	var FormNya = Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormContract-Form').getForm();
                if (FormNya.isValid()) {
                    FormNya.submit({
                        url: m_api + '/v1/admin/employee/submit_contract',
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
