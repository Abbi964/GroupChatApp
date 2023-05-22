const msgForm = document.querySelector('.msg-form');
const msgInput = document.getElementById('msg-input');
const promptDiv = document.querySelector('.prompt-div');
const chatUl = document.querySelector('.chatUl');
const groupUl = document.querySelector('.groupUl');
const createGroupBtn = document.querySelector('.createGroupBtn');
const createGroupForm = document.querySelector('#createGroupForm');
const createGrpNameInput = document.getElementById('createGroupName');
const groupInfo = document.querySelector('.groupInfo');
const addMemberBtn = document.querySelector('.addMemberBtn');
const addMemberForm = document.getElementById('addMemberForm')

msgForm.addEventListener('submit',sendMessage);

// storing message in the database when 'send' is clicked
async function sendMessage (e){
    e.preventDefault()
    if(msgInput.value === ''){
        window.alert('Nothing to send')
    }
    else{
        try{
            let token = localStorage.getItem('token');
            let groupId = localStorage.getItem('groupId')
            // making an obj with msg
            let obj = {msg : msgInput.value , groupId : groupId};
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
        const groupId = localStorage.getItem('groupId');
        // getting old messages from local storage of the group
        let oldMsgArray = JSON.parse(localStorage.getItem(groupId));
        let lastMsgId;

        // cheching if there is no old msg array in localstorage (can happen for newly signup or when a new group is created)
        if(oldMsgArray === null || []){
            oldMsgArray = [];
            lastMsgId = 0;
        }
        else{
            // Also finding out id of last msg
            lastMsgId = oldMsgArray[oldMsgArray.length - 1].id;
        }

        // first finding out group name with the help of group Id and showing it
        let result = await axios.get(`http://localhost:3000/group/findGroup?groupId=${groupId}`)
        groupInfo.innerHTML = `<h4>${result.data.group.name}</h4>`

        // now getting new messages from DB
        let response = await axios.get(`http://localhost:3000/chatapp/getNewMsg?lastMsgId=${lastMsgId}&groupId=${groupId}`);
    
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


// //--------------------- continuously pulling messages----------------//
// setInterval(()=>{
//     // first clearing the chat Ul
//     chatUl.innerHTML = ''
//     // now getting all the messages from DB
//     loadMsg()
// },8000)


//------------------handling create group btn------------------------//
createGroupBtn.addEventListener('click',(e)=>{
    // Toggling the visibility of the form
  createGroupForm.style.display = createGroupForm.style.display === 'none' ? 'block' : 'none';
});


//------------------handling create group Form------------------------//
createGroupForm.addEventListener('submit',async(e)=>{
    try{
        e.preventDefault()
        let token = localStorage.getItem('token')
        // making an object of input
        let grpObj = {name: createGrpNameInput.value}
        // making a post request
        let response = await axios.post('http://localhost:3000/group/createGroup',grpObj,{ headers:{ 'Authorization': token }});

        // if success then showing group on display
        if(response.data.success){
            // making an li 
            let li = makeGrpLi(createGrpNameInput.value , response.data.grpId);
            // appending li in groupUl
            groupUl.appendChild(li)
            // clearing input
            createGrpNameInput.value = '';
        }

    }
    catch(err){
        console.log(err)
    }

})

//-----------------handling add member Btn-----------------------//
addMemberBtn.addEventListener('click',(e)=>{
    // toggling the visibility of form
    addMemberForm.style.display = addMemberForm.style.display === 'none' ? 'block' : 'none';
})

//----------------handling add member form------------------------//
addMemberForm.addEventListener('submit',addUserToGroup);

async function addUserToGroup(e){
    e.preventDefault()
    try{
        const token = localStorage.getItem('token')
        let email = document.querySelector('.addMemberInput')
        // storing groupId and email in an obj
        let obj = {groupId : localStorage.getItem('groupId'), email : email.value };
        // making a post request
        let result = await axios.post('http://localhost:3000/group/addUser',obj,{
            headers:{ 'Authorization': token }
        })

        if(result.data.success === false){
            alert(result.data.msg)
        }
        else{
            alert('User added to Group')

            // clearing input
            email.value = ''
        }

    }
    catch(err){
        console.log(err)
    }

}

//--------reloading groups when page reloads---------------------//
window.addEventListener('DOMContentLoaded',loadGroups);

async function loadGroups(e){
    try{
        let token = localStorage.getItem('token')
        // getting groups from database
        let response = await axios.get('http://localhost:3000/group/getGroups',{
            headers:{ 'Authorization': token }
        })

        // if succesfull then show on dom
        if(response.data.success){
            response.data.groupArray.forEach((grp)=>{
                // making an li
                let li = makeGrpLi(grp.name,grp.id)
                // appending li in groupUl
                groupUl.appendChild(li)
            })
        }
    }
    catch(err){
        console.log(err)
    }
}

//------------selecting a group-------------------------//
groupUl.addEventListener('click',selectGroup);

function selectGroup(e){
    if(e.target.parentElement.className === 'groupLi'){
        // getting group id
        let groupId = e.target.parentElement.id;
        
        // saving groupId in local storage
        localStorage.setItem('groupId',groupId);

        // clearing chatul and then loading msg
        chatUl.innerHTML = ''
        loadMsg()
    }
}

//-------------------functions--------------------------//

function makeLi(name,msg,createdAt){
    let li = document.createElement('li');
    li.className = 'chatLi'
    li.innerHTML = `<p class="messageClass">${name} (${createdAt})    :    ${msg}</p>`
    return li
}

function makeGrpLi(name,id){
    let li = document.createElement('li');
    li.className = 'groupLi';
    li.id = id
    li.innerHTML = `<h3>${name}</h3>`
    return li
}

function storeInLocalStorage(msgArray){
    // In localStrorage old messages are stored saparately for every group with key being 'groupId' of that group
    const groupId = localStorage.getItem('groupId')
    let slicedArray;
    if(msgArray.length <10){
        slicedArray = msgArray
    }
    else{
        slicedArray = msgArray.slice(msgArray.length - 10)
    }
    localStorage.setItem(groupId,JSON.stringify(slicedArray))
}


