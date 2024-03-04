let categoryModal = document.querySelector('.category_modal');
let todoModal = document.querySelector('.todo_modal');
let dim = document.querySelector('.dim');

let categoryIcons = document.querySelectorAll('.category_icon');
 
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

// 카테고리 추가
categoryIcons.forEach(function(data) {
    data.addEventListener('click', function(event) {  
        categoryIcons.forEach(function(otherIcon) {  // console 2번찍힘
            otherIcon.style.border = "none";
            console.log("확인:" + otherIcon.classList);
        });

        target = event.currentTarget;
        target.style.border = "2px solid black";
        console.log("확인2:" + target.classList);
    });
});