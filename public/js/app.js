
let socket = io();
// get thr user name  
let username;

do {
    username = prompt(`Enter Your Naame`);
} while (!username)



const textArea = document.querySelector("#textArea");
const submitbtn = document.querySelector("#submitbtn");
const commentBox = document.querySelector(".comment_box");

submitbtn.addEventListener("click", (e) => {
    e.preventDefault();

    let comment = textArea.value;

    if (!comment) {
        return
    }

    postComment(comment);
});

function postComment(comment) {
    // append to dom 
    let data = {
        username: username,
        comment: comment,
    }
    appendDom(data);
    textArea.value = "";


    // Brodcast 
    brodCastComment(data);

    // sync withmongodb

    syncWithDb(data);
}

function appendDom(data) {
    const liTag = document.createElement("li");
    liTag.classList.add("comment", "mt-3");

    const marup = `
    <li class="comment">
    <div class="card border=light mb-3 ">
        <div class="card-body">
         <h6>${data.username}</h6>
         <p>${data.comment}</p>
         <div>
            <span><i class="far fa-clock"></i></span>
            <small>${moment(data.time).format('LT')}</small>
            </div>
        </div>
       
    </div>
</li>

    `;

    liTag.innerHTML = marup;
    commentBox.prepend(liTag);

}

function brodCastComment(data) {
    //  sockets 
    socket.emit('comment', data); //first perameter event name(any), code is send to server;
}

socket.on('comment', (data) => {
    appendDom(data);
})

// typing functionalty 

const typingDev = document.querySelector(".typing");
socket.on("typing", (data) => {
    typingDev.innerText = `${data.username} is typing..`;


    // code for when user stoping tying 

    deboucne(function () {
        typingDev.innerText = "";
    }, 1000)

});

let timerId = null;

function deboucne(func, timer) {
    if (timerId) {
        clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
        func()
    }, timer)

}


// add addEventListener for typing 
textArea.addEventListener("keyup", (data) => {
    socket.emit("typing", { username });
});



// api call 
function syncWithDb(data) {
    const headers = {
        'Content-type': 'application/json'
    }
    fetch('/api/comments', { method: 'Post', body: JSON.stringify(data), headers })
    .then(response => response.json())
        .then(result => {
            console.log(result);
        })
}



function fetchComments () {
    fetch('/api/comments')
        .then(res => res.json())
        .then(result => {
            Array.from(result).forEach(function(comment){
                comment.time = comment.createdAt
                appendDom(comment)
            })
        })
}


window.onload = fetchComments;