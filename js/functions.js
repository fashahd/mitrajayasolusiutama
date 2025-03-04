function lang(str) {
    try {
        if (lang_arr[str] != undefined)
            return lang_arr[str];
        else
            return str
    } catch (e) {
        return str;
    }
}

var preview_type            = '';
var preview_prescription_id = null;
var preview_dispense_id     = null;
var preview_order_id        = null;
function preview_cetak_surat(url,width,left) {
    setup_preview('printserver');
    preview_type            = 'cetak';
    preview_prescription_id = 1;
    dvpreview.iframe.setAttribute('src',url);
    if (width>0) dvpreview.frame.setAttribute('style','width:'+width+'px;left:'+left);
}
function preview_link(url,width,left) {
    setup_preview_link('printserver');
    preview_prescription_id = 1;
    dvpreview.iframe.setAttribute('src',url);
    if (width>0) dvpreview.frame.setAttribute('style','width:'+width+'px;left:'+left);
}
function preview_video(url) {
    setup_videopreview('video');
    preview_type = 'video';
    preview_prescription_id = 1;
    dvpreview.iframe.setAttribute('src',url);
}
// function preview_image(url,width,top) {
//     setup_imagepreview('image');
//     preview_type = 'image';
//     preview_prescription_id = 1;
//     dvpreview.iframe.setAttribute('src',url);
//     dvpreview.iframe.style.border = '1';
//     if (width>0) {
//         if (width>0) dvpreview.frame.setAttribute('style','position: fixed; width:60%; height:80%;align:center;padding:5px;');
//         //if (width>0) dvpreview.frame.setAttribute('style','float: left;height: 400px;width: 600px;padding: 2px;border: 1px #a0b1a0 solid;
//             //margin-top: 50px;margin-left: 2px;margin-bottom: 50px;');
//     }
// }

function openPanel(response,aurl,cont) {
    $('#'+cont).html(response);
    $('#'+cont).removeClass('cover');
    $( 'html, body' ).animate({ scrollTop: 0 }, 500);
    var module = aurl.replace(m_url+'/', '');
    $.get(m_api+'/page/info?module='+module, function(data) {
        if (data) {
            $('#page-info-content').html(data.Content);
            var button = '<button type="button" class="btn btn-space btn-default md-trigger" data-modal="page-info"><i class="icon s7-light"></i></button>';
            $('.page-head .row .col-md-2 h2').prepend(button);
            $('.md-trigger').modalEffects();
        }
    });
}

function link(aurl,cont) {
    if (cont===undefined) cont='wrapper';
    $('#'+cont).addClass('cover');
    $('#'+cont).html('');
    $.ajax({
        url: aurl,
        type: 'GET',
        // dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
        data: {ajax: '1'},
    })
    .done(function(response) {
        openPanel(response,aurl,cont);
    })
    .fail(function(response) {

        if (response.statusText == 'Unauthorized' && Ext.getCmp('frm-revoke-session-password') === undefined) {

            function unlock() {
                var passwd = Ext.getCmp('frm-revoke-session-password').getValue();
                Ext.Ajax.request({
                    url: '/api/common/revoke',
                    method:'POST',
                    params: {
                        uid:mj.mj_session,
                        passwd:passwd
                    },
                    success: function(response){
                        win.close();
                        link(aurl,cont);
                    }
                });
            }

            var win = Ext.create('Ext.Window',{
                modal:true,
                constraint:true,
                frame:true,
                title:'Session Expired',
                items:[
                    {
                        xtype:'form',
                        padding: 10,
                        items:[
                            {
                                xtype:'panel',
                                flex:1,
                                height:80,
                                width:350,
                                html:'<div>'+mj.mj_fullname+', your session has expired, please submit your password below to revoke your session or click the logout button to sign in as a different user</div>'
                            },
                            {
                                xtype:'textfield',
                                width:350,
                                height:40,
                                fieldStyle:'text-align:center',
                                id:'frm-revoke-session-password',
                                inputType:'password',
                                allowBlank:false,
                                emptyText:'Enter your password',
                                listeners: {
                                    specialkey: function(field, e){
                                        if (e.getKey() == e.ENTER) {
                                            unlock();
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ],
                buttonAlign:'center',
                buttons:[
                    {
                        xtype:'button',
                        text:'Unlock',
                        handler: function() {
                            unlock();
                        }
                    },
                    {
                        xtype:'button',
                        text:'Logout',
                        handler: function() {
                            Ext.MessageBox.show({
                                title: 'Logout',
                                msg: 'Are you sure you want to logout?',
                                buttonText:{
                                    yes: "Yes, I want to logout",
                                },
                                fn: (btn) => {
                                    console.log('Application Logout..');
                                    if(btn === 'yes'){
                                        window.location = '/';
                                    }
                                }
                            });
                        }
                    }
                ]
            }).show();
          }
    })
    .always(function() {
        // console.log("complete");
    });
}
function linknotif(aurl,memberLoanID) {

    var cont='wrapper';
    $('#'+cont).addClass('cover');
    $('#'+cont).html('');
    Ext.Ajax.request({
        url: aurl,
        async:true,
        method: 'GET',
        params: {ajax: '1',memberLoanID:memberLoanID},
        success: function(fp, o){
            $('#'+cont).html(fp.responseText);
            $('#'+cont).removeClass('cover');
        }
    })
    Ext.Ajax.request({
        url: '<?=$ApiUrl?>/loan/SetReadLoanNotif',
        async:true,
        method: 'POST',
        params: {Status: 1,memberLoanID:memberLoanID},
        success: function(fp, o){
        }
    })
}

function setreadnotif(url,NotifRecID){
    Ext.Ajax.request({
        url: m_api+'/tools/ClearNotifications',
        method: 'GET',
        params: {NotifRecID: NotifRecID},
        success: function(response){
            link(url);
        }
    });
}

function getNotifHeader()
{
     Ext.Ajax.request({
        url: m_api+'/v1/finance/invoice/notifications_load',
        method: 'GET',
        params: {start: 0,limit:20},
        success: function(response){
            var text = Ext.decode(response.responseText);
            $('#NumNotifHeader').text(text.total);
            if (text.total !== '0') {
                $('#notif-indicator').removeClass('hidden');
            } else {
                $('#notif-indicator').addClass('hidden');
            }

            var ListNotif = '';
            for(var i = 0; i < text.data.length; i++) {
                var obj = text.data[i];
                
                ListNotif += '<a href="#" class="dropdown-item">'
				+'<div class="media">'
					+'<div class="media-body">'
						+'<h5>Invoice Number : <b>'+obj.InvoiceNumber+'</b></h5>'
						+'<h6>Customer : <b>'+obj.CustomerName+'</b></h6>'
						+'<h6>Amount : <b>'+obj.InvoiceTotal+'</b></h6>'
						+'<h6>Due Date : <b>'+obj.DueDate+'</b></h6>'
						// +'<p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p>'
					+'</div>'
				+'</div></a><div class="dropdown-divider"></div>';

            }
            var lists = document.getElementById('NotifData');
            if(lists !== undefined && lists !== null){
                lists.innerHTML = ListNotif;
            }
        }
    });
}

function getNotifHeaderCert()
{
     Ext.Ajax.request({
        url: m_api+'/v1/admin/employee/notifications_load',
        method: 'GET',
        params: {start: 0,limit:20},
        success: function(response){
            var text = Ext.decode(response.responseText);
            $('#NumNotifHeaderCert').text(text.total);
            if (text.total !== '0') {
                $('#notif-indicator').removeClass('hidden');
            } else {
                $('#notif-indicator').addClass('hidden');
            }

            var ListNotif = '';
            for(var i = 0; i < text.data.length; i++) {
                var obj = text.data[i];
                
                ListNotif += '<a href="#" class="dropdown-item">'
				+'<div class="media">'
					+'<div class="media-body">'
						+'<h5>Certificate Name: <b>'+obj.cert_name+'</b></h5>'
						+'<h5>Certificate Number : <b>'+obj.cert_code+'</b></h5>'
						+'<h6>Expired Date : <b>'+obj.end_date+'</b></h6>'
						+'<h6>Employee Name : <b>'+obj.people_name+'</b></h6>'
						// +'<p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p>'
					+'</div>'
				+'</div></a><div class="dropdown-divider"></div>';

            }
            var lists = document.getElementById('NotifDataCert');
            if(lists !== undefined && lists !== null){
                lists.innerHTML = ListNotif;
            }
        }
    });
}
function loadAnnouncement()
{
    
    $.get(m_api+'/announcement/list', function(data) {
        if (data) {
            $.each(data, function(index, val) {
                tpl = '<li>\
                            <div class="icon"><span class="icon s7-speaker"></span></div>\
                            <div class="content"><span>'+val.Message+'</span></div>\
                        </li>';
                $('ul#announcement').append(tpl);
            });
        }
    });
}
function loadDocument()
{
    $.get(m_api+'/document/list', function(data) {
        if (data) {
            $.each(data, function(index, val) {
                tpl = '<li>\
                            <div class="icon"><span class="icon s7-file"></span></div>\
                            <div class="content"><a target="_blank" href="'+m_url+'/documents/'+val.FileName+'">'+val.FileLabel+'</a></div>\
                        </li>';
                $('ul#document').append(tpl);
            });
        }
    });
}


function startSync()
{
    // Ext.Ajax.timeout= 60000;
    // Ext.override(Ext.form.Basic, { timeout: Ext.Ajax.timeout / 1000 });
    // Ext.override(Ext.data.proxy.Server, { timeout: Ext.Ajax.timeout });
    // Ext.override(Ext.data.Connection, { timeout: Ext.Ajax.timeout });

    var msgbox =  Ext.MessageBox.show({
           msg: '<center>Mohon menunggu hingga proses sinkronisasi data selesai</center>',
           width:370,
           wait:true
        });

     Ext.Ajax.request({
        url: m_api+'index.php/cooperatives/sync',
        success: function(response){
            var text = Ext.decode(response.responseText);
            Ext.MessageBox.alert('Sinkronisasi Data', text.message);
        }
    });

}

function ifNaN(value, alt) {
    if (isNaN(value)) {
        return alt;
    }
    return value;
}

function checkImageExistsGeneral(imageUrl, callBack) {
    var imageData = new Image();
    imageData.onload = function() {
        callBack(true);
    };
    imageData.onerror = function() {
        callBack(false);
    };
    imageData.src = imageUrl;
}

/* Alert Mandatory Form */
function AlertNotification(objPanelBasicData){
    var contentForm = objPanelBasicData.query("field{isValid()==false}");
    var validation = '';
    for(var i=0; i< contentForm.length; i++){
        if(contentForm[i].fieldLabel){
            var split = contentForm[i].fieldLabel.split('<');
            validation += lang(split[0]) + ', ';
        }
    }
    Ext.MessageBox.show({
        title: lang('Attention'),
        msg: lang('The field') + ' ' + validation + ' ' + lang('is required')+ ' !',
        buttons: Ext.MessageBox.OK,
        animateTarget: 'mb9',
        icon: 'ext-mb-info'
    });
}

/* Change Status Traceability (on the fly) */
function changeStatus(id, status){
    return Ext.getCmp(id).setValue(status);
}

/* Change Status Traceability saving */
function changeSaveStatus(data){
    Ext.Ajax.request({
        waitMsg: 'Please Wait',
        url: m_api + '/transaction/UpdateStatus',
        method: 'POST',
        params: {
            id: data.id,
            table : data.table,
            key : data.key,
            status_app : data.status_app,
            status : data.status
        },
        success: function(response, opts) {
            result = response.responseText;
            result = JSON.parse(result);
            
        }
    });
}

function GetDefaultContentNoData(){
    var HtmlReturn;
    HtmlReturn = '<div class="Sfr_ContDataNotFound"><img src="'+varjs.config.base_url+'/assets/icons/nodata-search.png" width="48" /><p style="margin-top:6px;">'+lang('No Data Available')+'</p></div>';
    return HtmlReturn;
}

function clearlocalStorage() {
    localStorage.removeItem('cof_gridfarmers_params'); //grid farmers
}

function downloadFile(url, filename) {
    // set notif to bottom-right
    $.extend($.gritter.options, { position: 'bottom-right' });
    var id = $.gritter.add({
        title: filename,
        text: lang('Downloading file, please wait'),
        image: App.conf.assetsPath + '/' +  App.conf.imgPath + '/download.png',
        class_name: 'clean',
        sticky: true, 
        time: ''
    });
    Ext.Ajax.request({
        url: url,
        method: 'GET',
        success: function(response, opts) {
            $.gritter.remove(id);
            result = response.responseText;
            if (isJson(result)) {
                response = JSON.parse(result);
                if (response.success == true) {
                    $.gritter.add({
                        title: filename,
                        text: lang('Download success, here is your <a href="'+response.url+'" target="_blank">file</a>'),
                        image: App.conf.assetsPath + '/' +  App.conf.imgPath + '/download.png',
                        class_name: 'clean',
                        sticky: true, 
                        time: ''
                    });
                } else {
                    $.gritter.add({
                        title: filename,
                        text: lang('Download fail')+'. '+response.message,
                        image: App.conf.assetsPath + '/' +  App.conf.imgPath + '/download.png',
                        class_name: 'clean',
                        sticky: true, 
                        time: ''
                    });
                }   
            } else {
                $.gritter.add({
                    title: filename,
                    text: lang('Download fail')+'.',
                    image: App.conf.assetsPath + '/' +  App.conf.imgPath + '/download.png',
                    class_name: 'clean',
                    sticky: true, 
                    time: ''
                });
            }
        },
        failure: function (response) {
            $.gritter.remove(id);
                $.gritter.add({
                    title: filename,
                    text: lang('Download fail')+'. ',
                    image: App.conf.assetsPath + '/' +  App.conf.imgPath + '/download.png',
                    class_name: 'clean',
                    sticky: true, 
                    time: ''
                });

        }
    });
    
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
