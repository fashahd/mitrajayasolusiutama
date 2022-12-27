
Ext.define('MitraJaya.store.General.CompanyList', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.CompanyList',
    id: 'MitraJaya.store.General.CompanyList',
    fields: ['id', 'label'],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_company',
        reader: {
            type: 'json'
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
            store.proxy.extraParams.CustomerID = this.storeVar.CustomerID;
        }
    }
});
