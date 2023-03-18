Ext.define('MitraJaya.store.General.VillageList', {
    extend: 'Ext.data.Store',
    storeId: 'store.General.VillageList',
    id: 'store.General.VillageList',
    fields: ['id', 'label'],
    remoteSort: true,
    autoLoad: false,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_village',
        reader: {
            type: 'json'
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
            store.proxy.extraParams.SubDistrictID = this.storeVar.SubDistrictID;
        }
    }
});
