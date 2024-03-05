let categoryModal = document.querySelector('.category_modal');
let todoModal = document.querySelector('.todo_modal');
let dim = document.querySelector('.dim');

let categoryIcons = document.querySelectorAll('.category_icon');
let categoryModalNameText = document.querySelector('.category_modal_Name_text');
let categoryDel = document.querySelectorAll('.category_del');

// dim이 뭐가 문제인지 모르겠음
function categoryBtn() {
    categoryModal.style.display = categoryModal.style.display === "none" ? "block" : "none";
    dim.style.display = categoryModal.style.display === "none" ? "none" : "block";
}

function todoBtn() {
    todoModal.style.display = todoModal.style.display === "none" ? "block" : "none";
    dim.style.display = todoModal.style.display === "none" ? "none" : "block";
}

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

// 카테고리 Title 선택
function categoryOkBtn() {
    let title = categoryModalNameText.value;
    let categoryItem = document.querySelectorAll('.category_item'); // 변수를 전역으로 쓰면 categoryItem.length이 계속 1로 표시됨 이유 생각해야함

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

function categoryGetData(){
    fetch("http://localhost:3030/data")
    .then(response => response.json())
    .then(json => {
        const array = [];
        for(const data of json) {
            let getData=
            `<div class="category_item">
                <div class="${data.icon[0]} ${data.icon[1]}"></div>
                <div class="category_name">${data.title}</div>
                <div class="category_del" onclick="category_del()">x</div>
            </div>
             `
            array.push(getData);
        }
        document.querySelector('.category_item_all').innerHTML = array.join("");
    })
}

categoryGetData();

function category_del() {
    alert("test")
}

