
Ext.define('MitraJaya.store.General.ProjectBankList', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.ProjectBankList',
    id: 'MitraJaya.store.General.ProjectBankList',
    fields: ['id', 'label'],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_project_bank',
        reader: {
            type: 'json'
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
			
        }
    }
});
