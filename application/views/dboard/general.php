<?php
/******************************************
 *  Author : n1colius.lau@gmail.com
 *  Created On : Mon Feb 03 2020
 *  File : fardem.php
 *******************************************/
?>
<script type="text/javascript">
    $('#page_title, #breadcrumb_title').text('<?php echo $titlet ?>');
    $('#first-breadcrumb').text('<?php echo $breadcrumb_1 ?>');
    $('#second-breadcrumb').text('<?php echo $breadcrumb_2 ?>');
    <?$key = array_keys($action);
    for ($i=0;$i<sizeof($action);$i++) {?>
        var m_<?php echo $key[$i]?> = <?php echo ($action[$key[$i]]===true?'true':($action[$key[$i]]===false?'false':"'".$action[$key[$i]]."'"))?>;
        <?}?>
</script>

<div id="ContentDash" class='row-fluid'>
    <div class="page-head xs-pt-10 xs-pb-10">
        <div class="row">
            <div class="col-md-2">&nbsp;</div>
            <div class="col-md-10">

                <div class="btn-group btn-hspace pull-right">
                    <button class="btn btn-info pull-right" data-original-title=".btn .btn-info" data-placement="top" rel="tooltip" onClick="runSearch()">
                        <i class="icon icon-left s7-filter"></i><?php echo 'Search' ?>
                    </button>
                </div>

                <div class="btn-group btn-hspace pull-right">
                    <select class="form-control DashCombo" name="fyear" id="fyear"></select>
                </div>

                <div class="btn-group btn-hspace pull-right">
                    <select class="form-control DashCombo" name="quartal" id="quartal">
						<option value="q1">Quartal 1</option>
						<option value="q2">Quartal 2</option>
						<option value="q3">Quartal 3</option>
						<option value="q4">Quartal 4</option>
					</select>
                </div>
                <div class="btn-group btn-hspace pull-right" id="loader" style="display:none">
                    <div class="overlay dark" style="margin-top:5px; margin-right:5px">
                        <i class="fas fa-2x fa-sync-alt fa-spin"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row-fluid">
        <div class="main-content" >
            <!-- Chart -->
            <div class="row">
                <div class="col-md-12 xs-mt-20">
                    <div class="box gradient">
                        <div class="content row-fluid" style="border:1px solid lightgray;">
                            <div id="chart_income_invoice_quartal"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 xs-mt-20">
                    <div class="box gradient">
                        <div class="content row-fluid" style="border:1px solid lightgray;">
                            <div id="chart_income_invoice_quartal_by_client"></div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Chart -->

        </div>
    </div>

</div>
<br><br>
<script type="text/javascript" src="<?php echo base_url();?>js/modules/<?php echo $js;?>.js"></script>
