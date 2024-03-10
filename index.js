let categoryModal = document.querySelector('.category_modal');
let todoModal = document.querySelector('.todo_modal');
let dim = document.querySelector('.dim');

let categoryModalNameText = document.querySelector('.category_modal_Name_text');
let categoryDelAll = document.querySelectorAll('.category_del');

// ❗dim이 뭐가 문제인지 모르겠음
function categoryBtn() {        // ❗맨 처음 시작할 때 더블 클릭해야함
    categoryModal.style.display = categoryModal.style.display === "none" ? "block" : "none";
    dim.style.display = categoryModal.style.display === "none" ? "none" : "block";

    categoryModalNameText.value = ""
}

let categoryIcons = document.querySelectorAll('.category_icon');
let target;

// 카테고리 아이콘 선택
categoryIcons.forEach(function(data) {
    data.addEventListener('click', function(event) {  
        categoryIcons.forEach(function(otherIcon) { 
            otherIcon.style.border = "none";
        });
        target = event.currentTarget;
        target.style.border = "2px solid black";
    });
});

// 카테고리 Title 등록
function categoryOkBtn() {
    let title = categoryModalNameText.value;
    let categoryItem = document.querySelectorAll('.category_item_contents'); // ❗변수를 전역으로 쓰면 categoryItem.length이 계속 1로 표시됨 이유 생각해야함

    if(categoryItem.length < 5 && title !== "") {
        const data = {
            "title": title,
            "icon": target.classList
        }
        fetch("http://localhost:3030/data", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "content-type": "application/json; charset=utf-8"
            }
        })
        .then(response => response.json())
        .then(() => categoryGetData())  // 왜 이게 아닐까...뭔가 꼬였다 document.querySelector('.category_item_contents').click(), 
        .catch(error => console.error('Error:', error));

    } else if(categoryItem.length > 4) {
        alert("4개 이상 입력 불가");
    } else if(title === "") {
        alert("타이틀 공백 불가");
    }

    categoryModal.style.display = categoryModal.style.display === "none" ? "block" : "none";
    dim.style.display = categoryModal.style.display === "none" ? "none" : "block";
}

// 카테고리 조회 // 프로미스에대한 공부 필요
function categoryGetData(){
    fetch("http://localhost:3030/data")
    .then(response => response.json())
    .then(json => {
        const array = [];
        for(const data of json) {
            let getData=
            `<div class="category_item">
                <div class="${data.icon[0]} ${data.icon[1]}"></div>
                <div class="${data.title} category_name" onclick="getTodoData()">${data.title}</div>
                <div class="category_del" onclick="category_del()" data-title="${data.title}" data-id="${data.id}">X</div> 
            </div>
             `
            array.push(getData);
        }
        document.querySelector('.category_item_contents').innerHTML = array.join("");
    })
}

categoryGetData();

// 카테고리 삭제
function category_del() {
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('category_del')) {
            let delID = event.target.dataset.id;               // ❗여러번 눌러야함 // 추측: category_del() 클릭 1번 + category_del에 추가된 click 이벤트 1번 총 2회
            
            fetch(`http://localhost:3030/data/${delID}`, {
                method: "DELETE",
            })
            .then(response => response.json())
            .then(() => 
                event.target.parentNode.remove(),
                categoryGetData()
            )
        }
    });
}

// // 카테고리 삭제-카테고리 태스크도 모두 삭제   // delete는 쿼리스트링 불가
// function category_del() {
//     document.addEventListener('click', function(event) {
//         if (event.target.classList.contains('category_del')) {
//             let delTitle = event.target.dataset.title;

//             fetch(`http://localhost:3030/data?title=${delTitle}`, {
//                 method: "DELETE",
//             })
//             .then(response => response.json())
//             .then(() => 
//                 event.target.parentNode.remove(),
//                 categoryGetData()
//             )
//         }
//     });
// }

// todo 입력 조회
function todoBtn() {
    if(document.querySelector('.category_item') === null){
        alert("카테고리 등록 필요");
    } else {
    todoModal.style.display = todoModal.style.display === "none" ? "block" : "none";
    dim.style.display = todoModal.style.display === "none" ? "none" : "block";

    fetch("http://localhost:3030/data")
        .then(response => response.json())
        .then(json => {
            const array = [];
            
            for(const data of json) {
                let getData=
                `<div class="category_todo_items">
                    <div class="${data.icon[0]} ${data.icon[1]} todo_icon"></div>
                    <div class="category_name">${data.title}</div>
                </div>
                `

                array.push(getData);
            }
            document.querySelector('.todo_modal_color').innerHTML = array.join("");   
        })
    }
}

let todoTarget;
let categoryTitle;

// closet을 사용하지않으면 todoBtn()로 조회되기전에 이미 데이터를 찾으려함 > undifinded
document.querySelector('.todo_modal_color').addEventListener('click', function(event) {  // event 안에는 '.todo_modal_color'내 classList 전부 활용가능함
    const clickedItem = event.target.closest('.category_todo_items');
    let t = document.querySelectorAll('.category_icon');

    if (clickedItem) {
        t.forEach(function(icon) {
            icon.style.border = "none";
        })

        todoTarget = clickedItem.querySelector('.category_icon');
        todoTarget.style.border = "2px solid black";
        categoryTitle = clickedItem.querySelector('.category_name').innerText;

        console.log("확인"+categoryTitle);
    } 
});

let titleInnerCategory; 

document.querySelector('.category_item_defalt').addEventListener('click', function(event) { 
    const clickedTitle = event.target.closest('.category_name');

    if (clickedTitle) {
        titleInnerCategory = clickedTitle.innerText;
    } 
});

document.querySelector('.category_item_contents').addEventListener('click', function(event) { 
    const clickedTitle = event.target.closest('.category_name');

    if (clickedTitle) {
        titleInnerCategory = clickedTitle.innerText;
    } 
});

// todo 등록
function todoOkBtn() {
    todoModal.style.display = todoModal.style.display === "none" ? "block" : "none";
    dim.style.display = todoModal.style.display === "none" ? "none" : "block";

    let TodoTitle = document.querySelector('.todo_modal_Name_text').value;
    let content = document.querySelector('.todo_modal_contents_text').value;

    let today = new Date();
    let dday = document.querySelector('.todo_modal_contents_date').value;
    let dateInsert = new Date(dday);

    dateInsert.setHours(today.getHours());
    dateInsert.setMinutes(today.getMinutes());
    dateInsert.setSeconds(today.getSeconds());
    dateInsert.setMilliseconds(today.getMilliseconds());

    let ddayInput = Math.floor((dateInsert - today) / (24 * 60 * 60 * 1000));
    if(ddayInput < 0) {
        ddayInput = "D+"+ ddayInput * -1;
    } else if (ddayInput === 0){
        ddayInput = "D-DAY!"
    } else {
        ddayInput = "D-" + ddayInput;
    }

    if(TodoTitle !== "") {
        const contents = {
            "title": categoryTitle,
            "icon": todoTarget.classList,
            "TodoTitle": TodoTitle,
            "content": content,
            "dday": ddayInput
        }
        fetch("http://localhost:3030/contents", {
            method: "POST",
            body: JSON.stringify(contents),
            headers: {
                "content-type": "application/json; charset=utf-8"
            }
        })
        .then(response => response.json())
        .then( () => getTodoData())
        .catch(error => console.error('Error:', error));
    } else {
        alert("공백 입력")
    }
} 

// todo 입력 조회
function getTodoData() {
    fetch("http://localhost:3030/contents")
        .then(response => response.json())
        .then(json => {
            const array2 = [];
            for(const contents of json) {
                if(titleInnerCategory === contents.title) {
                    let addData=
                    `<div class="${contents.title} ${contents.icon[1]}">
                    <div class="todo_item">
                        <div class="todo_text">
                            <div class="todo_text_header">
                                <div class="todo_title">${contents.TodoTitle}</div>
                                <div class="dday">${contents.dday}</div>
                            </div>
                            <div class="todo_contents">${contents.content}</div>
                            <div class="todo_text_footer">
                                <div class="edit" onclick="edit()" data-id="${contents.id}">edit</div>
                                <div class="active">
                                    <input type="checkbox" class="active_chk">
                                    <span class="artive_text">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>`
                    array2.push(addData);
                } else if (titleInnerCategory === "All") {
                    let addData=
                    `<div class="${contents.title} ${contents.icon[1]}">
                    <div class="todo_item">
                        <div class="todo_text">
                            <div class="todo_text_header">
                                <div class="todo_title">${contents.TodoTitle}</div>
                                <div class="dday">${contents.dday}</div>
                            </div>
                            <div class="todo_contents">${contents.content}</div>
                            <div class="todo_text_footer">
                                <div class="edit">edit</div>
                                <div class="active">
                                    <input type="checkbox" class="active_chk">
                                    <span class="artive_text">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>`
                    array2.push(addData);
                }
                document.querySelector('.todo_wrapper').innerHTML = array2.join("");
            }
        })
    }

let editModal = document.querySelector('.edit_modal');

// 수정 조회  // ❗dim이 뭐가 문제인지 모르겠음  css 스타일이 none으로 되어있는데 block으로 인식되는듯
function edit() {
    editModal.style.display = editModal.style.display === "block" ? "none" : "block";   
    dim.style.display = todoModal.style.display === "none" ? "none" : "block";

        fetch(`http://localhost:3030/contents`)
            .then(response => response.json())
            .then(json => {
                const array = [];

                for(const data of json) {
                    let getData=
                    `<div class="category_todo_items">
                        <div class="${data.icon[0]} ${data.icon[1]} todo_icon"></div>
                        <div class="category_name">${data.title}</div>
                    </div>
                    `

                    array.push(getData);
                }
                document.querySelector('.edit_modal_color').innerHTML = array.join("");   
            })

            
        document.addEventListener('click', function(event) {
            let contentsID = event.target.dataset.id
            
            fetch(`http://localhost:3030/contents/${contentsID}`)
            .then(response => response.json())
            .then(json => {
                    document.querySelector('.edit_modal_Name_text').value = json.TodoTitle;
                    document.querySelector('.edit_modal_contents_text').value = json.content;
                    document.querySelector('.edit_cancel_btn').setAttribute('data-id', json.id);
                    document.querySelector('.edit_ok_btn').setAttribute('data-id', json.id);
            })
        });
}
  
// 수정 등록
function todoEditBtn() {

}

// 태스크 삭제
function todoDeleteBtn() {
    document.addEventListener('click', function(event) {
        let delID = event.target.dataset.id;
        console.log("체크: " + delID);            
        
        fetch(`http://localhost:3030/contents/${delID}`, {
            method: "DELETE",
        })
        .then(response => response.json())
        .then(() => 
            event.target.parentNode.remove(),
            location.reload() // 새로고침 < 좋은 방법은 아닌듯
        )
    });
}