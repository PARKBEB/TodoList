let categoryModal = document.querySelector('.category_modal');
let todoModal = document.querySelector('.todo_modal');
let dim = document.querySelector('.dim');

let categoryIcons = document.querySelectorAll('.category_icon');
let categoryModalNameText = document.querySelector('.category_modal_Name_text');
 
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
    categoryModalNameText.value = "";

    const data = {
        "todo": title,
        "icon": target
    }

    fetch("http://localhost:3000/data", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "content-type": "application/json; charset=utf-8"
        }
    })
    .then(response => response.json())
    .then(json => console.log(json))

    categoryModal.style.display = categoryModal.style.display === "none" ? "block" : "none";
    dim.style.display = categoryModal.style.display === "none" ? "none" : "block";
}

