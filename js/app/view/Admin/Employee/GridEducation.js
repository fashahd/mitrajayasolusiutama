/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : GridLoanPayment.js
 *******************************************/
Ext.define('MitraJaya.view.Admin.Employee.GridEducation' ,{
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Admin.Employee.GridEducation',
    style:'padding:0 7px 7px 7px;margin:2px 0 10px 0;',
    title:'List Education',
    frame: true,
    collapsible: true,
    collapsed: false,
    listeners: {
        afterRender: function(component, eOpts){
            var thisObj = this;

			if(thisObj.viewVar.OpsiDisplay == 'update'){
				Ext.getCmp('MitraJaya.view.Admin.Employee.GridEducation-BtnAdd').setVisible(true);
			}else{
				Ext.getCmp('MitraJaya.view.Admin.Employee.GridEducation-BtnAdd').setVisible(false);
			}
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
        thisObj.StoreGridMain = Ext.create('MitraJaya.store.Admin.Employee.GridEducation',{
        	storeVar: {
                people_id: thisObj.viewVar.people_id
            }
        });

        //ContextMenu
        thisObj.ContextMenu = Ext.create('Ext.menu.Menu',{
            cls:'Sfr_ConMenu',
	        items:[{
                icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eye.svg',
                text: lang('View'),
                cls:'Sfr_BtnConMenuWhite',
                itemId: 'MitraJaya.view.Admin.Employee.GridEducation-ContextMenuView',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Admin.Employee.GridEducation-Grid').getSelectionModel().getSelection()[0];
                    var WinFormEducation = Ext.create('MitraJaya.view.Admin.Employee.WinFormEducation');
                    WinFormEducation.setViewVar({
                        OpsiDisplay:'view',
                        CallerStore: thisObj.StoreGridMain,
                        education_id:sm.get('education_id'),
						people_id: thisObj.viewVar.people_id
                    });
                    if (!WinFormEducation.isVisible()) {
                        WinFormEducation.center();
                        WinFormEducation.show();
                    } else {
                        WinFormEducation.close();
                    }
	            }
	        },{
	            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/pen-to-square.svg',
                text: lang('Update'),
                cls:'Sfr_BtnConMenuWhite',
                hidden: m_act_update,
                itemId: 'MitraJaya.view.Admin.Employee.GridEducation-ContextMenuUpdate',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Admin.Employee.GridEducation-Grid').getSelectionModel().getSelection()[0];
                    var WinFormEducation = Ext.create('MitraJaya.view.Admin.Employee.WinFormEducation');
                    WinFormEducation.setViewVar({
                        OpsiDisplay:'update',
                        CallerStore: thisObj.StoreGridMain,
                        education_id:sm.get('education_id'),
						people_id: thisObj.viewVar.people_id
                    });
                    if (!WinFormEducation.isVisible()) {
                        WinFormEducation.center();
                        WinFormEducation.show();
                    } else {
                        WinFormEducation.close();
                    }
	            }
	        },{
	            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eraser.svg',
                text: lang('Delete'),
                cls:'Sfr_BtnConMenuWhite',
	            hidden: m_act_delete,
                itemId: 'MitraJaya.view.Admin.Employee.GridEducation-ContextMenuDelete',
	            handler: function(){
                    var sm = Ext.getCmp('MitraJaya.view.Admin.Employee.GridEducation-Grid').getSelectionModel().getSelection()[0];

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
									education_id: sm.get('education_id')
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
            id: 'MitraJaya.view.Admin.Employee.GridEducation-Grid',
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
                displayMsg: lang('Showing')+' {0} '+lang('to')+' {1} '+lang('of')+' {2} '+lang('data')
            },{
                xtype: 'toolbar',
                dock:'top',
                items: [{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/square-plus.svg',
                    text: lang('Add'),
                    hidden: m_act_add,
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    id: 'MitraJaya.view.Admin.Employee.GridEducation-BtnAdd',
                    handler: function() {
                    	var WinFormEducation = Ext.create('MitraJaya.view.Admin.Employee.WinFormEducation');
                        WinFormEducation.setViewVar({
                            OpsiDisplay:'insert',
                            CallerStore: thisObj.StoreGridMain,
                            people_id:thisObj.viewVar.people_id
                        });
                        if (!WinFormEducation.isVisible()) {
                            WinFormEducation.center();
                            WinFormEducation.show();
                        } else {
                            WinFormEducation.close();
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
                text: lang('education_id'),
                dataIndex: 'education_id',
                hidden: true
            },{
                text: lang('Level'),
                dataIndex: 'education_level',
                flex: 1
            },{
                text: lang('Name'),
                dataIndex: 'school_name',
                flex: 1
            },{
                text: lang('Start'),
                dataIndex: 'start_year',
                flex: 1
            },{
                text: lang('End'),
                dataIndex: 'end_year',
                flex: 1
            },{
                text: lang('GPA'),
                dataIndex: 'gpa',
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
