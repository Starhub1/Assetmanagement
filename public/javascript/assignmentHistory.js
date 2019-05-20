    // Get input element
    let filterInput = document.getElementById('search');
    // Add event listener
    filterInput.addEventListener('keyup', filterNames);

    function filterNames(){
      // Get value of input
      let filterValue = document.getElementById('search').value.toUpperCase();

      // Get tr
      let tr = document.querySelectorAll('#hist');

      // Loop through collection-item lis
      for(let i = 0;i < tr.length;i++){
        //Asset Description  
        let a = tr[i].getElementsByTagName('td')[1];

        // //Asset Type
        // let b = tr[i].getElementsByTagName('td')[2];

        // //Asset SubType
        // let c = tr[i].getElementsByTagName('td')[3];

        // //Asset Serial
        // let d = tr[i].getElementsByTagName('td')[4];
        
        // //Asset Owner
        // let e = tr[i].getElementsByTagName('td')[5];

        // If matched
        if(a.innerText.toUpperCase().includes(filterValue)){
          tr[i].style.display = '';
        } else {
          tr[i].style.display = 'none';
        }
        // if(a.innerText.toUpperCase().includes(filterValue)||b.innerText.toUpperCase().includes(filterValue)
        // ||c.innerText.toUpperCase().includes(filterValue)||d.innerText.toUpperCase().includes(filterValue)
        // ||e.innerText.toUpperCase().includes(filterValue)){
        //   tr[i].style.display = '';
        // } else {
        //   tr[i].style.display = 'none';
        // }
      }
    }