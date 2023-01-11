
Ext.define('MitraJaya.store.General.ProductList', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.ProductList',
    id: 'MitraJaya.store.General.ProductList',
    fields: ['id', 'label'],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_product',
        reader: {
            type: 'json'
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
            // store.proxy.extraParams.CustomerID = this.storeVar.CustomerID;
        }
    }
});
