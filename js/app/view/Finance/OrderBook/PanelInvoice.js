/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : GridLoanPayment.js
 *******************************************/
 Ext.define('MitraJaya.view.Finance.OrderBook.PanelInvoice' ,{
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.OrderBook.PanelInvoice',
    style:'padding:0 7px 7px 7px;margin:2px 0 0 0;',
    frame: true,
    collapsible: true,
    margin:'0 0 20 8',
    title:'Invoice Pembayaran',
    listeners: {
        afterRender: function(component, eOpts){
            var thisObj = this;
        }
    },
    initComponent: function() {
        var thisObj = this;

		// console.log(m_api);
        //Store
        thisObj.StoreGridMain = Ext.create('MitraJaya.store.Finance.OrderBook.InvoiceList',{
        	storeVar: {
                OrderBookID: thisObj.viewVar.OrderBookID
            }
        });

        //ContextMenu
        thisObj.ContextMenu = Ext.create('Ext.menu.Menu',{
            cls:'Sfr_ConMenu',
	        items:[{
                icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eye.svg',
                text: lang('View'),
                cls:'Sfr_BtnConMenuWhite',
                itemId: 'MitraJaya.view.OrderBook.PanelInvoice-ContextMenuView',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.OrderBook.PanelInvoice-Grid').getSelectionModel().getSelection()[0];
                    
					var WinInvoice = Ext.create('MitraJaya.view.Finance.OrderBook.WinInvoice',{
                        viewVar:{
                            InvoiceID: sm.get('InvoiceID'),
                            OpsiDisplay: 'view'
                        }
                    });

                    if (!WinInvoice.isVisible()) {
                        WinInvoice.center();
                        WinInvoice.show();
                    } else {
                        WinInvoice.close();
                    }
	            }
	        }]
	    });

        thisObj.items = [{
            xtype: 'grid',
            id: 'MitraJaya.view.OrderBook.PanelInvoice-Grid',
            style: 'border:1px solid #CCC;margin-top:4px;',
            cls:'Sfr_GridNew',
			minHeight:350,
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
				hidden:true,
                items: []
            }],
            columns:[{
            	text: '',
                xtype:'actioncolumn',
                flex: 1,
                items:[{
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/caret-down.svg',
                    handler: function(grid, rowIndex, colIndex, item, e, record) {
                        thisObj.ContextMenu.showAt(e.getXY());
                    }
                }]
            },{
                text: 'No',
                flex: 1,
                xtype: 'rownumberer'
            },{
                text: lang('InvoiceID'),
                dataIndex: 'InvoiceID',
                hidden: true
            },{
                text: lang('Invoice Number'),
                dataIndex: 'InvoiceNumber',
                flex: 20
            },{
                text: lang('Due Date'),
                dataIndex: 'DueDate',
                flex: 20
            },{
                text: lang('Amount'),
                dataIndex: 'Amount',
                flex: 20
            },{
                text: lang('Status'),
                dataIndex: 'Status',
                flex: 20,
                renderer: function (t, meta, record) {
                    let RetVal;
					if(record.data.Status == "Paid"){
						RetVal = `<span class="external-event bg-success ui-draggable ui-draggable-handle">`+record.data.Status+`</span>`;
					}else{
						RetVal = `<span class="external-event bg-danger ui-draggable ui-draggable-handle">`+record.data.Status+`</span>`;
					}
                    return RetVal;
                }
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
