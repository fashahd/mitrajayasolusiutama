
Ext.define('MitraJaya.store.General.DepartmentList', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.DepartmentList',
    id: 'MitraJaya.store.General.DepartmentList',
    fields: ['id', 'label'],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_department',
        reader: {
            type: 'json'
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
			
        }
    }
});
