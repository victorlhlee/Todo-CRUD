$(document).ready(function(){
  
  $("li div input[data-checked=true]").prop("checked",true);
  $(".incomplete_number").html(uncheckedBox());
  $(".pau_number").html(checkedBox());

  $("li div input[type=checkbox]").change(function(){
      var doc_id = $(this).data('todo-id');
      if($(this).prop( "checked")){
        $(this).siblings().children("span").addClass("line_through");
        $.ajax('/todos/'+doc_id+'/complete', {
          method : "PUT",
          data: { 
            is_done : true}
          
        });
              
       }else{
        $(this).siblings().children("span").removeClass("line_through"); 
          $.ajax('/todos/'+doc_id+'/incomplete', {
            method : "PUT",
            data : {
              is_done : false}
          });

       }

        $(".incomplete_number").html(uncheckedBox());
        $(".pau_number").html(checkedBox());

    });

  
});
  
  function uncheckedBox (){
    var checkList = $("li div input[type=checkbox]").length;
    var checked = $(':checked').length;
    var unchecked = checkList - checked;

    return unchecked;
}

  function checkedBox (){
    var checked = $(':checked').length;

    return checked;
  }





  


