const ApiURL ='https://beccos.onrender.com/';
const createCategoryForm = document.querySelector('#createCategoryForm');

createCategoryForm.addEventListener('submit', async function(e) {
   e.preventDefault();
   
   const name = document.querySelector("#name").value;

   const {data} = await axios.post(`https://beccos.onrender.com/categories`,{name});

 console.log(data) ;
    if(data.message=='SUCCESS'){
        
     const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        
        Toast.fire({
          icon: 'success',
          title: 'تم اضافة التصنيف بنجاح'  
        })

    setTimeout(()=>{
         location.href='index.html';
     },3000)
      }


})