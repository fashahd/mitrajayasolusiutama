
Ext.define('MitraJaya.store.General.CostComponent', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.CostComponent',
    id: 'MitraJaya.store.General.CostComponent',
    fields: ['id', 'label'],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_cost_element',
        reader: {
            type: 'json'
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
			
        }
    }
});
