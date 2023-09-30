/******************************************
 *  Author : n1colius.lau@gmail.com   
 *  Created On : Wed Jul 24 2019
 *  File : PanelFormAdditionalKrakakoa.js
 *******************************************/

/*
    Param2 yg diperlukan ketika load View ini
    - FarmerID
*/
// custom Vtype for vtype:'IPAddress'
Ext.apply(Ext.form.field.VTypes, {
    IPAddress:  function(v) {
        return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(v);
    },
    IPAddressText: 'Must be a numeric IP address',
    IPAddressMask: /[\d\.]/i
});

Ext.define('MitraJaya.view.Admin.Employee.PanelPayroll', {
    extend: 'Ext.form.Panel',
    id: 'MitraJaya.view.Admin.Employee.PanelPayroll',
    fileUpload: true,
    buttonAlign: 'center',
    cls: 'Sfr_PanelSubLayoutForm',
    initComponent: function () {
        var thisObj = this;

		let combo_ptkp_status = Ext.create('MitraJaya.store.General.PTKPStatus');
		let combo_bpjs_family = Ext.create('MitraJaya.store.General.BPJSFamily');

        thisObj.items = [{
            layout: 'column',
            border: false,
            padding: 10,
            items: [{
                columnWidth: 0.5,
                layout: 'form',
                cls: 'Sfr_PanelLayoutFormContainer',
                style: 'padding-right:6px;',
                items: [{
                    xtype: 'panel',
                    title: lang('Salary'),
                    frame: false,
                    id: 'MitraJaya.view.Admin.Employee.PanelPayroll-SectionSalary',
                    style: 'margin-top:5px;padding-top:7px;',
                    cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                    items: [{
                        layout: 'column',
                        border: false,
                        items: [{
                            columnWidth: 1,
                            layout: 'form',
                            defaults: {
                                labelAlign: 'top'
                            },
                            items: [{ html: '<div style="height:13px;">&nbsp;</div>' },{
                                xtype: 'numericfield',
                                fieldLabel: lang('Basic Salary'),
                                id: 'MitraJaya.view.Admin.Employee.PanelPayroll-Form-basic_salary',
                                name: 'MitraJaya.view.Admin.Employee.PanelPayroll-Form-basic_salary',
                                height: 65
                            },{
                                xtype: 'numericfield',
                                fieldLabel: lang('Transport'),
                                id: 'MitraJaya.view.Admin.Employee.PanelPayroll-Form-transport_salary',
                                name: 'MitraJaya.view.Admin.Employee.PanelPayroll-Form-transport_salary',
                                height: 65
                            },{
                                xtype: 'numericfield',
                                fieldLabel: lang('Mobile'),
                                id: 'MitraJaya.view.Admin.Employee.PanelPayroll-Form-mobile_salary',
                                name: 'MitraJaya.view.Admin.Employee.PanelPayroll-Form-mobile_salary',
                                height: 65
                            }]
                        }]
                    }]
                }]
            }, {
                columnWidth: 0.5,
                layout: 'form',
                cls: 'Sfr_PanelLayoutFormContainer',
                style: 'padding-left:6px;',
                items: [{
                    xtype: 'panel',
                    title: lang('Tax Information'),
                    frame: false,
                    id: 'MitraJaya.view.Admin.Employee.PanelPayroll-SectionTaxInfo',
                    style: 'margin-top:5px;padding-top:7px;',
                    cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                    items: [{
                        layout: 'column',
                        border: false,
                        items: [{
                            columnWidth: 1,
                            layout: 'form',
                            defaults: {
                                labelAlign: 'top'
                            },
                            items: [{ html: '<div style="height:13px;">&nbsp;</div>' },{
                                xtype: 'textfield',
                                fieldLabel: lang('Tax Number'),
                                id: 'MitraJaya.view.Admin.Employee.PanelPayroll-Form-tax_number',
                                name: 'MitraJaya.view.Admin.Employee.PanelPayroll-Form-tax_number',
                                height: 65
                            },{
								xtype: 'combobox',
								id: 'MitraJaya.view.Admin.Employee.PanelPayroll-Form-ptkp_status',
								name: 'MitraJaya.view.Admin.Employee.PanelPayroll-Form-ptkp_status',
								fieldLabel: lang('PTKP Status'),
								labelAlign: "top",
								store: combo_ptkp_status,
								labelAlign:'top',
								queryMode: 'local',
								displayField: 'label',
								valueField: 'id',
								listeners: {
									change: function(cb, nv, ov) {
										return false;
									}
								}
							}]
                        }]
                    }]
                }]
            },{
                columnWidth: 0.5,
                layout: 'form',
                cls: 'Sfr_PanelLayoutFormContainer',
                style: 'padding-left:6px;',
                items: [{
                    xtype: 'panel',
                    title: lang('BPJS Information'),
                    frame: false,
                    id: 'MitraJaya.view.Admin.Employee.PanelPayroll-SectionBPJS',
                    style: 'margin-top:5px;padding-top:7px;',
                    cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                    items: [{
                        layout: 'column',
                        border: false,
                        items: [{
                            columnWidth: 1,
                            layout: 'form',
                            defaults: {
                                labelAlign: 'top'
                            },
                            items: [{ html: '<div style="height:13px;">&nbsp;</div>' },{
                                xtype: 'textfield',
                                fieldLabel: lang('BPJS Ketenagakerjaan'),
                                id: 'MitraJaya.view.Admin.Employee.PanelPayroll-Form-bpjs_tk',
                                name: 'MitraJaya.view.Admin.Employee.PanelPayroll-Form-bpjs_tk',
                                height: 65
                            },{
                                xtype: 'textfield',
                                fieldLabel: lang('BPJS Kesehatan'),
                                id: 'MitraJaya.view.Admin.Employee.PanelPayroll-Form-bpjs_kesehatan',
                                name: 'MitraJaya.view.Admin.Employee.PanelPayroll-Form-bpjs_kesehatan',
                                height: 65
                            },{
								xtype: 'combobox',
								id: 'MitraJaya.view.Admin.Employee.PanelPayroll-Form-bpjs_family',
								name: 'MitraJaya.view.Admin.Employee.PanelPayroll-Form-bpjs_family',
								fieldLabel: lang('BPJS Kesehatan Family'),
								labelAlign: "top",
								store: combo_bpjs_family,
								labelAlign:'top',
								queryMode: 'local',
								displayField: 'label',
								valueField: 'id',
								listeners: {
									change: function(cb, nv, ov) {
										return false;
									}
								}
							}]
                        }]
                    }]
                }]
            }]
        }];

        thisObj.buttons = [{
            xtype: 'button',
			icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/floppy-disk.svg',
            text: lang('Save'),
            hidden: (thisObj.viewVar.OpsiDisplay === 'update') && m_act_update === false ? false : true,
			cls: 'Sfr_BtnFormBlue',
			overCls: 'Sfr_BtnFormBlue-Hover',
            id: 'MitraJaya.view.Admin.Employee.PanelPayroll-BtnSave',
            handler: function () {
                var Formnya = Ext.getCmp('MitraJaya.view.Admin.Employee.PanelPayroll').getForm();

                if (Formnya.isValid()) {
                    Formnya.submit({
                        url: m_api + '/v1/admin/employee/submit_payroll',
                        method: 'POST',
                        waitMsg: 'Saving data...',
                        params: {
                            people_id: thisObj.viewVar.people_id
                        },
                        success: function (fp, o) {
                            Ext.MessageBox.show({
                                title: 'Information',
                                msg: lang('Data saved'),
                                buttons: Ext.MessageBox.OK,
                                animateTarget: 'mb9',
                                icon: 'ext-mb-success'
                            });							

							//load data form
							Ext.getCmp('MitraJaya.view.Admin.Employee.PanelPayroll').getForm().load({
								url: m_api + '/v1/admin/employee/form_payroll',
								method: 'GET',
								params: {
									people_id: this.viewVar.people_id
								},
								success: function (form, action) {
									Ext.MessageBox.hide();
									var r = Ext.decode(action.response.responseText);
								},
								failure: function (form, action) {
									Ext.MessageBox.hide();
									Ext.MessageBox.show({
										title: 'Failed',
										msg: 'Failed to retrieve data',
										buttons: Ext.MessageBox.OK,
										animateTarget: 'mb9',
										icon: 'ext-mb-error'
									});
								}
							});
                        },
                        failure: function (fp, o) {
                            try {
                                var r = Ext.decode(rp.responseText);
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

                } else {
                    Ext.MessageBox.show({
                        title: 'Attention',
                        msg: lang('Form not complete yet'),
                        buttons: Ext.MessageBox.OK,
                        animateTarget: 'mb9',
                        icon: 'ext-mb-info'
                    });
                }
            }
        }];

        this.callParent(arguments);
    },
    listeners: {
        afterRender: function (component, eOpts) {
            var thisObj = this;

            //load data form
            Ext.getCmp('MitraJaya.view.Admin.Employee.PanelPayroll').getForm().load({
                url: m_api + '/v1/admin/employee/form_payroll',
                method: 'GET',
                params: {
                    people_id: this.viewVar.people_id
                },
                success: function (form, action) {
                    Ext.MessageBox.hide();
                    var r = Ext.decode(action.response.responseText);
                },
                failure: function (form, action) {
                    Ext.MessageBox.hide();
                    Ext.MessageBox.show({
                        title: 'Failed',
                        msg: 'Failed to retrieve data',
                        buttons: Ext.MessageBox.OK,
                        animateTarget: 'mb9',
                        icon: 'ext-mb-error'
                    });
                }
            });
        }
    }
});
