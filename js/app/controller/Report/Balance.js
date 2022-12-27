/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : Farmers.js
 *******************************************/
 Ext.define('MitraJaya.controller.Report.Balance', {
    extend: 'Ext.app.Controller',
    init: function() {
        this.renderView();
    },
    renderView: function() {
    	var MainLayout = [];

        if(Ext.getCmp('MitraJaya.view.Report.Balance.MainForm') == undefined){
            MainLayout = Ext.create('MitraJaya.view.Report.Balance.MainForm');
        }else{
            //destroy, create ulang
            Ext.getCmp('MitraJaya.view.Report.Balance.MainForm').destroy();
            MainLayout = Ext.create('MitraJaya.view.Report.Balance.MainForm');
        }
    }
});
