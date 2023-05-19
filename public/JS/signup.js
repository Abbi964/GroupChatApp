const form = document.querySelector('.form-class')
const username  = document.getElementById('username');
const email  = document.getElementById('email');
const phoneNo  = document.getElementById('phoneNo');
const password  = document.getElementById('password');
const cnfrmpassword  = document.getElementById('cnfrmpassword');
const promptDiv = document.querySelector('.prompt');
const signUpInfo = document.querySelector('.signUpInfo')

form.addEventListener('submit',submitForm);

async function submitForm (e){
    e.preventDefault()
    if(username.value === '' || email.value === '', phoneNo.value === '' || password.value === '' || cnfrmpassword.value === ''){
        // if not all fields are filled
        promptDiv.innerHTML = '<p>Please fill all the fields</p>';
        setTimeout(()=>promptDiv.innerHTML = '',1000)
    }
    else if(password.value !== cnfrmpassword.value){
        // if password do not match with confirm password
        promptDiv.innerHTML = '<p>passwords do not match</p>';
        setTimeout(()=>promptDiv.innerHTML = '',1000)
    }
    else{
        try{
            // making an obj with input value
            let obj = {
                username : username.value,
                password : password.value,
                email : email.value,
                phoneNo : phoneNo.value
            }
            // psting the obj to database
            let response = await axios.post('http://localhost:3000/user/signup',obj);
            if(response.data === false){
                signUpInfo.innerHTML = '<p>User already exists, Please Login</p>'
            }
            else{
                signUpInfo.innerHTML = '<p>Signed in sucessfully</p>'
                username.value = '';
                password.value = '';
                email.value = '';
                phoneNo.value = '';
                cnfrmpassword.value = '';
            }

        }
        catch(err){
            console.log(err)
        }
    }
}
