const sign=document.getElementById('sign')
sign.addEventListener('click',async()=>{
    const username=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    if(!username || !password){
        alert("Username and password required")
    }
    else{
        const data={
            username:username,
            password:password
        }
        try{
            const response=await fetch('http://localhost:8000/login',{
                method:'POST',
                headers:{
                    'content-Type':'application/json'
                },
                body:JSON.stringify(data)
            });
            const res=await response.json();
            console.log(res)
            if(res.status=="Success"){
                alert("Login Successfull")
                window.location.href='index2.html'
            }
            else{
                alert('Login Unsuccessfull')
            }
    }catch(err){
        print("Error occured",err)
    }
}
})