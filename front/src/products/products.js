const ApiURL ='https://beccos.onrender.com/';

const createCategoryForm = document.querySelector('#createCategoryForm');


createCategoryForm?.addEventListener('submit', async function(e) {
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

const getProducts = async()=>{

  const {data} =await axios.get(`https://beccos.onrender.com/products`);
   return data.products;

}
const displayProducts = async ()=>{
const products = await getCategories();
console.log(products);
let result =``;
result+=products.map((product)=>
`<tr>
   <td>${product.name}</td>
   <td><img src="${product.image.secure_url}"  width="50px"/></td>
   <td><span class="badge badge-${produc.status=='Active'?'success':'danger'}">${product.status}</span></td>
   <td> <a href="#" onClick="deleteCategory('${product._id}',event)" class="btn btn-danger">
   <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path fill="#fafcff" d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.7 23.7 0 0 0 -21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0 -16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"/></svg>
   </a>
  </tr>`
)
document.querySelector("#products").innerHTML=result;
}

const deleteCategory = async (id,e)=>{
  const token = localStorage.getItem('token');
  console.log(token);
  const {data} = await axios.delete(`${ApiURL}categories/${id}`,
  {headers:{authorization:`BECCOS__${token}`}});
  console.log(data);
   if(data.message=='success'){
     e.target.parentElement.parentElement.style="display:none";
  }
 }

displayProducts();