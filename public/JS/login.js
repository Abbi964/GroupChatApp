const form = document.querySelector('.form-class')
const email  = document.getElementById('email');
const password  = document.getElementById('password');
const loginInfo = document.querySelector('.loginInfo');
const promptDiv = document.querySelector('.prompt');

form.addEventListener('submit',submitForm);

async function submitForm (e){
    e.preventDefault()
    if(email.value === '' || password.value === ''){
        // if not all fields are filled
        promptDiv.innerHTML = '<p>Please fill all the fields</p>';
        setTimeout(()=>promptDiv.innerHTML = '',1000)
    }
    else{
        try{
            // making an object containing login info
            let obj = {
                email : email.value,
                password : password.value,
            }
            // making a post request 
            let response = await axios.post('http://localhost:3000/user/login',obj);
            console.log(response)
            // alerting the msg recieved
            window.alert(response.data.msg)
            // logging in the user
            if(response.data.success){
                // saving JWT in local storage
                localStorage.setItem('token',response.data.token)
                // redirecting to main page
                window.location.href = "/main"
            }
        }
        catch(err){
            console.log(err)
        }
    }
}