let categoryModal = document.querySelector('.category_modal');
let todoModal = document.querySelector('.todo_modal');
let dim = document.querySelector('.dim');

let categoryIcons = document.querySelectorAll('.category_icon');
let categoryModalNameText = document.querySelector('.category_modal_Name_text');
let categoryDelAll = document.querySelectorAll('.category_del');

// ❗dim이 뭐가 문제인지 모르겠음
function categoryBtn() {        // ❗맨 처음 시작할 때 더블 클릭해야함
    categoryModal.style.display = categoryModal.style.display === "none" ? "block" : "none";
    dim.style.display = categoryModal.style.display === "none" ? "none" : "block";

    categoryModalNameText.value = ""
}

let target;
let target_todo;

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

categoryIcons.forEach(function(data) {
    data.addEventListener('click', function(event) {  
        categoryIcons.forEach(function(otherIcon) { 
            otherIcon.style.border = "none";
        });
        target = event.currentTarget;
        target.style.border = "2px solid black";
    });
});

// 카테고리 Title 선택
function categoryOkBtn() {
    let title = categoryModalNameText.value;
    let categoryItem = document.querySelectorAll('.category_item'); // ❗변수를 전역으로 쓰면 categoryItem.length이 계속 1로 표시됨 이유 생각해야함

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
        .then(() => categoryGetData())
        .catch(error => console.error('Error:', error));

    } else if(categoryItem.length > 4) {
        alert("4개 이상 입력 불가");
    } else if(title === "") {
        alert("타이틀 공백 불가");
    }

    categoryModal.style.display = categoryModal.style.display === "none" ? "block" : "none";
    dim.style.display = categoryModal.style.display === "none" ? "none" : "block";
}

// 카테고리 조회
function categoryGetData(){
    fetch("http://localhost:3030/data")
    .then(response => response.json())
    .then(json => {
        const array = [];
        for(const data of json) {
            let getData=
            `<div class="category_item">
                <div class="${data.icon[0]} ${data.icon[1]}"></div>
                <div class="category_name ${data.title}">${data.title}</div>
                <div class="category_del" onclick="category_del()" data-id="${data.id}">X</div> 
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
        document.querySelector('.category_del').addEventListener('click', function(event){
            let delID = event.currentTarget.dataset.id;
            console.log("눌림");                            // ❗여러번 눌러야함 // 추측: category_del() 클릭 1번 + category_del에 추가된 click 이벤트 1번 총 2회
            
            fetch(`http://localhost:3030/data/${delID}`, {
                method: "DELETE",
            })
            .then(response => response.json())
            .then(() => 
                event.target.parentNode.remove()
            )
            categoryGetData();
        });
}

// todo modal
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
                    <div class="${data.icon[0]} ${data.icon[1]}"></div>
                    <div class="category_name ${data.title}">${data.title}</div>
                </div>
                `
                array.push(getData);
            }
            document.querySelector('.todo_modal_color').innerHTML = array.join("");
        })
    }
}

// todo 저장
function todoOkBtn() {
    let TodoTitle = document.querySelector('.todo_modal_Name_text').value;
    let content = document.querySelector('.todo_modal_contents_text').value;

    const contents = {
        "TodoTitle": TodoTitle,
        "content": content,
        "title": 임시,
        "icon": 임시
    }
    fetch("http://localhost:3030/contents", {
        method: "POST",
        body: JSON.stringify(contents),
        headers: {
            "content-type": "application/json; charset=utf-8"
        }
    })
    .then(response => response.json())
    .then(json => console.log(json))
    .catch(error => console.error('Error:', error));
} 
