const msgForm = document.querySelector('.msg-form');
const msgInput = document.getElementById('msg-input');
const promptDiv = document.querySelector('.prompt-div');
const chatUl = document.querySelector('.chatUl')

msgForm.addEventListener('submit',sendMessage);

// storing message in the database when 'send' is clicked
async function sendMessage (e){
    e.preventDefault()
    if(msgInput.value === ''){
        window.alert('Nothing to send')
    }
    else{
        try{
            let token = localStorage.getItem('token')
            // making an obj with msg
            let obj = {msg : msgInput.value};
            // posting this msg
            let response = await axios.post('http://localhost:3000/chatapp/sendMsg',obj,{ headers:{ 'Authorization': token }});
            console.log(response)
            // displaying message on screen
            if(response.data.success){
                promptDiv.innerHTML = '<p class="success">Message Sent</p>'
                setTimeout(()=>promptDiv.innerHTML = '',1000)
                // clearing input
                msgInput.value = ''
            }
            else{
                promptDiv.innerHTML = '<p class="failure">Something Went Wrong</p>'
                setTimeout(()=>promptDiv.innerHTML = '',1000)
            }

        }
        catch(err){
            console.log(err)
        }

    }
}

// Loading messages from DB when page is refreshed
window.addEventListener('DOMContentLoaded',loadMsg);

async function loadMsg(e){
    try{
        let response = await axios.get('http://localhost:3000/chatapp/getMsg');
    
        if(response.data.success){
            // showing msg on display
            response.data.msgArray.forEach((msgObj)=>{
                // making an li
                let li = makeLi(msgObj.username,msgObj.message,msgObj.createdAt);
                // appending li to ul
                chatUl.appendChild(li)
            })
    
        }
        else{
            //showing error message on screen
            promptDiv.innerHTML = '<p class="failure">Something Went Wrong</p>'
            setTimeout(()=>promptDiv.innerHTML = '',1000)
        }
    }
    catch(err){
        console.log(err);
    }

}



function makeLi(name,msg,createdAt){
    let li = document.createElement('li');
    li.className = 'chatLi'
    li.innerText = `${name} (${createdAt})  -    ${msg}`;
    return li
}

// continuously pulling msg from DB every 1 sec
setInterval(()=>{
    // first clearing the chat Ul
    chatUl.innerHTML = ''
    // now getting all the messages from DB
    loadMsg()
},8000)