$('#myModal').on('show.bs.modal', function (e) {
        var assetName = $(e.relatedTarget).data('asset-name');
        var assetId = $(e.relatedTarget).data('asset-id');
        $(e.currentTarget).find('#modelTitle').text(assetName);
        $(e.currentTarget).find('#assignNewOwner').attr("action", "/home/" + assetId+"/assignNewOwner");
    });

    $('#assignNewOwner').submit(function (event) {
        // Stop form from submitting normally
        event.preventDefault();
        // Get some values from elements on the page:
        var $form = $(this),
            owner = $form.find("#defaultForm-owner").val(),
            email = $form.find("#defaultForm-email").val(),
            userType =$form.find("#defaultForm-userType").val()
        message = $form.find("#defaultForm-message").val()
        url = $form.attr("action");

        //$('#myModal').modal('hide');
        $.post(url, {
            owner: owner,
            email: email,
            userType:userType,
            message: message
        }, function (data, status) {

            if (data.redirect) {
                // data.redirect contains the string URL to redirect to
                window.location.href = data.redirect;
            } else {
                // data.form contains the HTML for the replacement form
                $("#myModal").replaceWith(data.form);
            }
        });
        $('#alert-Message').css('display','');
        $('#alert-Message').text('Successfully Added the owner');
        setTimeout(function () {
            location.reload();
        }, 500);
        // this.submit();
    });
    // Get input element
    let filterInput = document.getElementById('search');
    // Add event listener
    filterInput.addEventListener('keyup', filterNames);

    function filterNames(){
      // Get value of input
      let filterValue = document.getElementById('search').value.toUpperCase();

      // Get tr
      let tr = document.querySelectorAll('tbody tr');

      // Loop through collection-item lis
      for(let i = 0;i < tr.length;i++){
        //Asset Description  
        let a = tr[i].getElementsByTagName('a')[0];

        //Asset Type
        let b = tr[i].getElementsByTagName('td')[2];

        //Asset SubType
        let c = tr[i].getElementsByTagName('td')[3];

        //Asset Serial
        let d = tr[i].getElementsByTagName('td')[4];

        // If matched
        if(a.innerText.toUpperCase().includes(filterValue)||b.innerText.toUpperCase().includes(filterValue)
        ||c.innerText.toUpperCase().includes(filterValue)||d.innerText.toUpperCase().includes(filterValue)){
          tr[i].style.display = '';
        } else {
          tr[i].style.display = 'none';
        }
      }

    }    
