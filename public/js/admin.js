// jshint -W030

$(function(){
    $('.del').on('click',function(ev){
        var $target = $(e.target),
        id = $target.data('id'),
        $tr = $('.item-id'+id);
        
        $.ajax({
            type:'DELETE',
            URL:'/admin/list/?id='+id
        }).done(function(data){
            if(data.success === 1) {
                $tr.length && $tr.remove();                
            }
        });
    });
});
