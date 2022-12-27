
Ext.define('MitraJaya.store.General.ContractNumberList', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.ContractNumberList',
    id: 'MitraJaya.store.General.ContractNumberList',
    fields: ['id', 'label'],
    autoLoad: false,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_contract_number',
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
