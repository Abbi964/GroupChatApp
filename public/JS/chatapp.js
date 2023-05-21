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

// Loading messages from DB and local storage when page gets refreshed
window.addEventListener('DOMContentLoaded',loadMsg);

async function loadMsg(e){
    try{
        // getting old messages from local storage
        let oldMsgArray = JSON.parse(localStorage.getItem('oldMsgArray'));
        let lastMsgId;

        // cheching if there is no old msg array in localstorage (can happen for newly signup)
        if(oldMsgArray === null){
            oldMsgArray = [];
            lastMsgId = 0;
        }
        else{
            // Also finding out id of last msg
            lastMsgId = oldMsgArray[oldMsgArray.length - 1].id;
        }

        // now getting new messages from DB
        let response = await axios.get(`http://localhost:3000/chatapp/getNewMsg?lastMsgId=${lastMsgId}`);
    
        if(response.data.success){
            //combining old and new message arrays
            let msgArray = [...oldMsgArray,...response.data.newMsgArray]
            // storing this msgArray in localstorage but also only storing anly 10 msg in localstorage
            storeInLocalStorage(msgArray)

            // showing msg on display
            msgArray.forEach((msgObj)=>{
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

function storeInLocalStorage(msgArray){
    let slicedArray;
    if(msgArray.length <10){
        slicedArray = msgArray
    }
    else{
        slicedArray = msgArray.slice(msgArray.length - 10)
    }
    localStorage.setItem('oldMsgArray',JSON.stringify(slicedArray))
}

// continuously pulling messages
setInterval(()=>{
    // first clearing the chat Ul
    chatUl.innerHTML = ''
    // now getting all the messages from DB
    loadMsg()
},8000)