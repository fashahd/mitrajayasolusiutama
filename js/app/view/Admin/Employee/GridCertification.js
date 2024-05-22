/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : GridLoanPayment.js
 *******************************************/
Ext.define('MitraJaya.view.Admin.Employee.GridCertification' ,{
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Admin.Employee.GridCertification',
    style:'padding:0 7px 7px 7px;margin:2px 0 10px 0;',
    title:'List Training & Certification',
    frame: true,
    collapsible: true,
    collapsed: false,
    listeners: {
        afterRender: function(component, eOpts){
            var thisObj = this;
        },
        expand: function() {
            var thisObj = this;
            thisObj.StoreGridMain.load();
        }
    },
    initComponent: function() {
        var thisObj = this;

		// console.log(m_api);
        //Store
        thisObj.StoreGridMain = Ext.create('MitraJaya.store.Admin.Employee.GridCertification',{
        	storeVar: {
                people_id: thisObj.viewVar.people_id
            }
        });

        //ContextMenu
        thisObj.ContextMenu = Ext.create('Ext.menu.Menu',{
            cls:'Sfr_ConMenu',
	        items:[{
                icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eye.svg',
                text: 'View',
                cls:'Sfr_BtnConMenuWhite',
                itemId: 'MitraJaya.view.Admin.Employee.GridCertification-ContextMenuView',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Admin.Employee.GridCertification-Grid').getSelectionModel().getSelection()[0];
                    var WinFormCertification = Ext.create('MitraJaya.view.Admin.Employee.WinFormCertification');
                    WinFormCertification.setViewVar({
                        OpsiDisplay:'view',
                        CallerStore: thisObj.StoreGridMain,
                        certification_id:sm.get('certification_id'),
						people_id: thisObj.viewVar.people_id
                    });
                    if (!WinFormCertification.isVisible()) {
                        WinFormCertification.center();
                        WinFormCertification.show();
                    } else {
                        WinFormCertification.close();
                    }
	            }
	        },{
	            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/pen-to-square.svg',
                text: 'Update',
                cls:'Sfr_BtnConMenuWhite',
                hidden: m_act_update,
                itemId: 'MitraJaya.view.Admin.Employee.GridCertification-ContextMenuUpdate',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Admin.Employee.GridCertification-Grid').getSelectionModel().getSelection()[0];
                    var WinFormCertification = Ext.create('MitraJaya.view.Admin.Employee.WinFormCertification');
                    WinFormCertification.setViewVar({
                        OpsiDisplay:'update',
                        CallerStore: thisObj.StoreGridMain,
                        certification_id:sm.get('certification_id'),
						people_id: thisObj.viewVar.people_id
                    });
                    if (!WinFormCertification.isVisible()) {
                        WinFormCertification.center();
                        WinFormCertification.show();
                    } else {
                        WinFormCertification.close();
                    }
	            }
	        },{
	            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eraser.svg',
                text: 'Delete',
                cls:'Sfr_BtnConMenuWhite',
	            hidden: m_act_delete,
                itemId: 'MitraJaya.view.Admin.Employee.GridCertification-ContextMenuDelete',
	            handler: function(){
                    var sm = Ext.getCmp('MitraJaya.view.Admin.Employee.GridCertification-Grid').getSelectionModel().getSelection()[0];

					Swal.fire({
						title: 'Do you want to delete this data ?',
						text: "You won't be able to revert this!",
						icon: 'warning',
						showCancelButton: true,
						confirmButtonColor: '#3085d6',
						cancelButtonColor: '#d33',
						confirmButtonText: 'Yes, delete it!'
					}).then((result) => {
						if (result.isConfirmed) {
							Ext.Ajax.request({
								waitMsg: 'Please Wait',
								url: m_api + '/v1/admin/employee/delete_education',
								method: 'DELETE',
								params: {
									certification_id: sm.get('certification_id')
								},
								success: function(response, opts) {
									Swal.fire(
										'Deleted!',
										'Your data has been deleted.',
										'success'
									)

									//refresh store
									thisObj.StoreGridMain.load();
								},
								failure: function(rp, o) {
									try {
										var r = Ext.decode(rp.responseText);
										Swal.fire(
											'Failed!',
											r.message,
											'warning'
										)
									}
									catch(err) {										
										Swal.fire(
											'Failed!',
											'Connection Error',
											'warning'
										)
									}
								}
							});
						}
					})
	            }
	        }]
	    });

        thisObj.items = [{
            xtype: 'grid',
            id: 'MitraJaya.view.Admin.Employee.GridCertification-Grid',
            style: 'border:1px solid #CCC;margin-top:4px;',
            cls:'Sfr_GridNew',
			minHeight:300,
            loadMask: true,
            selType: 'rowmodel',
            store: thisObj.StoreGridMain,
            enableColumnHide: false,
            viewConfig: {
                deferEmptyText: false,
                emptyText: GetDefaultContentNoData()
            },
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: thisObj.StoreGridMain,
                dock: 'bottom',
                displayInfo: true,
                displayMsg: 'Showing'+' {0} '+'to'+' {1} '+'of'+' {2} '+'data'
            },{
                xtype: 'toolbar',
                dock:'top',
                items: [{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/square-plus.svg',
                    text: 'Add',
                    hidden: m_act_add,
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    id: 'MitraJaya.view.Admin.Employee.GridCertification-BtnAdd',
                    handler: function() {
                    	var WinFormCertification = Ext.create('MitraJaya.view.Admin.Employee.WinFormCertification');
                        WinFormCertification.setViewVar({
                            OpsiDisplay:'insert',
                            CallerStore: thisObj.StoreGridMain,
                            people_id:thisObj.viewVar.people_id
                        });
                        if (!WinFormCertification.isVisible()) {
                            WinFormCertification.center();
                            WinFormCertification.show();
                        } else {
                            WinFormCertification.close();
                        }
                    }
                }]
            }],
            columns:[{
            	text: '',
                xtype:'actioncolumn',
                flex: 0.1,
                items:[{
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/caret-down.svg',
                    handler: function(grid, rowIndex, colIndex, item, e, record) {
                        thisObj.ContextMenu.showAt(e.getXY());
                    }
                }]
            },{
                text: 'No',
                flex: 0.1,
                xtype: 'rownumberer'
            },{
                text: 'cert_id',
                dataIndex: 'cert_id',
                hidden: true
            },{
                text: 'Name',
                dataIndex: 'cert_name',
                flex: 1
            },{
                text: 'Start',
                dataIndex: 'cert_date',
                flex: 1
            },{
                text: 'End',
                dataIndex: 'cert_end',
                flex: 1
            }]
        }];

        this.callParent(arguments);
    }
});

function fetchJSON(text){
    try{
        JSON.parse(text);
        return true;
    }
    catch (error){
        return false;
    }
}
