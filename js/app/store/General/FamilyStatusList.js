
Ext.define('MitraJaya.store.General.FamilyStatusList', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.FamilyStatusList',
    id: 'MitraJaya.store.General.FamilyStatusList',
    fields: ['id', 'label'],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_family_status',
        reader: {
            type: 'json'
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
			
        }
    }
});
