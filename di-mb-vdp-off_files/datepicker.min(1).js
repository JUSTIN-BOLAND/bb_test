function gformInitDatepicker(){jQuery(".datepicker").each(function(){var a=jQuery(this),b=this.id,c={yearRange:"-100:+20",showOn:"focus",dateFormat:"mm/dd/yy",changeMonth:!0,changeYear:!0,suppressDatePicker:!1,onClose:function(){a.focus();var b=this;this.suppressDatePicker=!0,setTimeout(function(){b.suppressDatePicker=!1},200)},beforeShow:function(a,b){return!this.suppressDatePicker}};a.hasClass("dmy")?c.dateFormat="dd/mm/yy":a.hasClass("dmy_dash")?c.dateFormat="dd-mm-yy":a.hasClass("dmy_dot")?c.dateFormat="dd.mm.yy":a.hasClass("ymd_slash")?c.dateFormat="yy/mm/dd":a.hasClass("ymd_dash")?c.dateFormat="yy-mm-dd":a.hasClass("ymd_dot")&&(c.dateFormat="yy.mm.dd"),a.hasClass("datepicker_with_icon")&&(c.showOn="both",c.buttonImage=jQuery("#gforms_calendar_icon_"+b).val(),c.buttonImageOnly=!0),b=b.split("_"),c=gform.applyFilters("gform_datepicker_options_pre_init",c,b[1],b[2]),a.datepicker(c)})}jQuery(document).ready(gformInitDatepicker);