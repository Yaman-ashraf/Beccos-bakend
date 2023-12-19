const loginClick = document.querySelector("#loginClick");
loginClick.addEventListener("click",function(e){     // to not refresh the page
    e.preventDefault();
    login();
})

const login = async ()=>{
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    try{
        const {data} = await axios.post(`https://beccos.onrender.com/auth/signin`,{email,password});

            console.log(data);
        if(data.message=='Success'){
            localStorage.setItem("token",data.token);
            location.href='../../src/categories/index.html';
        }
    }catch(error){
        document.querySelector(".invalid").classList.remove("invalid");
    }




}