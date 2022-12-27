
Ext.define('MitraJaya.store.General.ProjectList', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.ProjectList',
    id: 'MitraJaya.store.General.ProjectList',
    fields: ['id', 'label'],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_project',
        reader: {
            type: 'json'
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
			
        }
    }
});
