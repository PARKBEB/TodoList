let categoryModal = document.querySelector('.category_modal');
let todoModal = document.querySelector('.todo_modal');
let editModal = document.querySelector('.edit_modal');
let dim = document.querySelector('.modals');

let categoryIcons = document.querySelectorAll('.category_icon');
let categoryDelAll = document.querySelectorAll('.category_del');
let categoryModalNameText = document.querySelector('.category_modal_Name_text');

// category

function categoryBtn() {
    categoryModal.style.display = categoryModal.style.display === "none" ? "block" : "none";
    dim.style.display = dim.style.display === "none" ? "block" : "none";

    categoryModalNameText.value = ""
}

let target;

// 카테고리 아이콘 선택시 표시
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
    // ❗변수를 전역으로 쓰면 categoryItem.length이 계속 1로 표시됨 이유 생각해야함
    let categoryItem = document.querySelectorAll('.category_item');

    if(categoryItem.length < 4 && title !== "") {
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

    } else if(categoryItem.length > 3) {
        alert("4개 이상 입력 불가");
    } else if(title === "") {
        alert("타이틀 공백 불가");
    }

    categoryModal.style.display = categoryModal.style.display === "none" ? "block" : "none";
    dim.style.display = categoryModal.style.display === "none" ? "none" : "block";
}

categoryGetData();

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

// todo

// todo 입력 조회
function todoBtn() {
    document.querySelector('.todo_modal_Name_text').value = "";
    document.querySelector('.todo_modal_contents_text').value = "";

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
// todo 카테고리 아이콘 선택
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
    } 
});

let titleInnerCategory; 

init();

function init() {
    setCategory('.category_item_default');
    setCategory('.category_item_contents');
}

function setCategory(categoryName) {
    document.querySelector(categoryName).addEventListener('click', function(event) { 
        const clickedTitle = event.target.closest('.category_name');
    
        if (clickedTitle) {
            titleInnerCategory = clickedTitle.innerText;
        } 
    });
}

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
    let ddayInputNum = Math.floor((dateInsert - today) / (24 * 60 * 60 * 1000));

    if(ddayInput < 0) {
        ddayInput = "D+"+ ddayInput * -1;
    } else if (ddayInput === 0){
        ddayInput = "✨D-DAY"
    } else {
        ddayInput = "D-" + ddayInput;
    }

    if(TodoTitle !== "") {
        const contents = {
            "title": categoryTitle,
            "icon": todoTarget.classList,
            "TodoTitle": TodoTitle,
            "content": content,
            "dday": ddayInput,
            "ddayNum": ddayInputNum,
            "active": "block"
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

titleInnerCategory = "All";

getTodoData();

function getItem(contents, isDone) {
    var checkboxHtml = isDone ? `<input type="checkbox" class="active_chk" checked><span class="active_text">Done</span>` : `<input type="checkbox" class="active_chk"><span class="active_text">Active</span>`

    var returnHtml = 
    `<div class="${contents.title} ${contents.icon[1]} active_display" data-id="${contents.id}" style="display: ${contents.active};">
        <div class="todo_item">
            <div class="todo_text">
                <div class="todo_text_header">
                    <div class="todo_title">${contents.TodoTitle}
                    </div>
                    <div class="dday">${contents.dday}
                    </div>
                </div>
                <div class="todo_contents">${contents.content}
                </div>
                <div class="todo_text_footer">
                    <div class="edit" onclick="edit()" data-id="${contents.id}">edit
                    </div>
                    <div class="active">` + checkboxHtml +
                    `
                    </div>
                </div>
            </div>
        </div>
    </div>`
    
    return returnHtml;
}

// After
function getTodoData() {
    fetch("http://localhost:3030/contents")
    .then(response => response.json())
    .then(json => {
        const arr = [];
        for(const contents of json) {
            if(titleInnerCategory === contents.title || titleInnerCategory === "All") {
                let addData = getItem(contents, false);
                arr.push(addData);
            }

            document.querySelector('.todo_wrapper').innerHTML = arr.join("");
        }
    })
}

// 카테고리 아이콘 선택시 표시
document.querySelector('.edit_modal_color').addEventListener('click', function(event) {  // event 안에는 '.edit_modal_color'내 classList 전부 활용가능함
    const clickedItem = event.target.closest('.category_todo_items');
    let t = document.querySelectorAll('.category_icon');

    if (clickedItem) {
        t.forEach(function(icon) {
            icon.style.border = "none";
        })

        todoTarget = clickedItem.querySelector('.category_icon');
        todoTarget.style.border = "2px solid black";
        categoryTitle = clickedItem.querySelector('.category_name').innerText;
    } 
});


// 태스크 수정    // ❗dim이 뭐가 문제인지 모르겠음  css 스타일이 none으로 되어있는데 block으로 인식되는듯
function edit() {
    editModal.style.display = editModal.style.display === "block" ? "none" : "block";   
    dim.style.display = todoModal.style.display === "block" ? "none" : "block"; 

        fetch(`http://localhost:3030/data`)
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

// 태스크 수정 후 등록
function todoEditBtn() {
    editModal.style.display = editModal.style.display === "block" ? "none" : "block";   
    dim.style.display = editModal.style.display === "none" ? "none" : "block"; // ❗dim 이랑 modal 왜이러지

    // Title
    let TodoTitleEdit = document.querySelector('.edit_modal_Name_text').value;
    let contentEdit = document.querySelector('.edit_modal_contents_text').value;

    // Date
    let today = new Date();
    let dday = document.querySelector('.edit_modal_contents_date').value;
    let dateInsert = new Date(dday);

    dateInsert.setHours(today.getHours());
    dateInsert.setMinutes(today.getMinutes());
    dateInsert.setSeconds(today.getSeconds());
    dateInsert.setMilliseconds(today.getMilliseconds());

    let ddayInput = Math.floor((dateInsert - today) / (24 * 60 * 60 * 1000));
    let ddayInputNum = Math.floor((dateInsert - today) / (24 * 60 * 60 * 1000));

    if(ddayInput < 0) {
        ddayInput = "D+"+ ddayInput * -1;
    } else if (ddayInput === 0){
        ddayInput = "✨D-DAY"
    } else {
        ddayInput = "D-" + ddayInput;
    }

    document.addEventListener('click', function(event) {
        let putID = event.target.dataset.id;

        if(TodoTitleEdit !== "") {
            const contents = {
                "title": categoryTitle,
                "icon": todoTarget.classList,
                "TodoTitle": TodoTitleEdit,
                "content": contentEdit,
                "dday": ddayInput,
                "ddayNum": ddayInputNum
            }
            fetch(`http://localhost:3030/contents/${putID}`, {
                method: "PUT",
                body: JSON.stringify(contents),
                headers: {
                    "content-type": "application/json; charset=utf-8"
                }
            })
            .then(response => response.json())
            .then(() => location.reload())     // ❗getTodoData()로 하면 todoEditButton을 클릭한 다음 > edit을 누르면 이전 데이터가 todoGetdata에 보여짐..새로고침은 좋은 방향이 아님
            .catch(error => console.error('Error:', error));
        } else {
            alert("공백 입력")
        }
    });
}

// 태스크 삭제
function todoDeleteBtn() {
    document.addEventListener('click', function(event) {
        let delID = event.target.dataset.id;         
        
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

// 태스크 별 active-done
document.querySelector('.todo_wrapper').addEventListener('change', function(event) {
    const chkItem = event.target.closest('.active_display');
    let chkContentID = event.target.closest('.active_display').dataset.id;
    
    if(chkItem) {
        if (event.target.checked) {
            // POST불가 PUT가능 < active: "none" 하나만 불가함
            // 일부만 변경할떄는 PATCH를 쓰자!

            const patchData = {
                "active": "none"
            };
            
            fetch(`http://localhost:3030/contents/${chkContentID}`, {
                method: 'PATCH', // HTTP 메서드를 PATCH로 설정합니다.
                headers: {
                    'Content-Type': 'application/json' // 요청 본문의 형식을 JSON으로 설정합니다.
                },
                body: JSON.stringify(patchData) // JSON 형식으로 데이터를 직렬화하여 요청 본문에 포함합니다.
            })
            .then(() => getTodoData())

        } else {
            const patchData = {
                "active": "block"
            };
            
            fetch(`http://localhost:3030/contents/${chkContentID}`, {
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(patchData)
            })
            .then(() => location.reload())

        }
    }
});


// 태스크 전체 active-done
document.querySelector('.hidebox_chk').addEventListener('change', function(event) {
    if(event.target.checked) {
        fetch("http://localhost:3030/contents")
        .then(response => response.json())
        .then(json => {
            const array = [];

            for(const contents of json) {
                if(contents.active === "none") {
                    contents.active = "block";
                } else {
                    contents.active = "none";
                }
                let getData = getItem(contents, true);
                array.push(getData);
            }
            document.querySelector('.todo_wrapper').innerHTML = array.join(""); 
        })
    } else {
        fetch("http://localhost:3030/contents")
        .then(response => response.json())
        .then(json => {
            const array = [];
            for(const contents of json) {
                if(contents.active === "none") {
                    contents.active = "none";
                } else {
                    contents.active = "block";
                }
                let getData = getItem(contents, false);
                array.push(getData);
            }
            document.querySelector('.todo_wrapper').innerHTML = array.join(""); 
        })
    }
})

// 생성순 정렬
function sortDate() {
    fetch("http://localhost:3030/contents")
    .then(response => response.json())
    .then(json => {
        const array = [];
        for(const contents of json) {
            if(contents.active === "none") {
                contents.active = "none";
            } else {
                contents.active = "block";
            }
            let getData = getItem(contents, false);
            array.push(getData);
        }
        document.querySelector('.todo_wrapper').innerHTML = array.join(""); 
    })
}

// d-day순 정렬
function sortLatest() {
    fetch("http://localhost:3030/contents")
    .then(response => response.json())
    .then(json => {
        const array = [];
        for(const contents of json) {
            if(contents.active === "none") {
                contents.active = "none";
            } else {
                contents.active = "block";
            }
            let getData = getItem(contents, false);
            array.push({element: getData, ddayNum: contents.ddayNum});
        }
        array.sort((a, b) => {
            return compare(a.ddayNum, b.ddayNum);
        });
        
        // 정렬된 array의 각 요소에서 item.element를 추출하여 새로운 배열
        const elements = array.map(item => item.element).join(""); 

        // 결과를 todo_wrapper 요소에 할당
        document.querySelector('.todo_wrapper').innerHTML = elements;
    })
}

function compare(a, b) {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}