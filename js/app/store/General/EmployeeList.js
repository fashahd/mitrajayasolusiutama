
Ext.define('MitraJaya.store.General.EmployeeList', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.EmployeeList',
    id: 'MitraJaya.store.General.EmployeeList',
    fields: ['id', 'label'],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_employee',
        reader: {
            type: 'json'
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
			
        }
    }
});
