var data = [];
let idValue = 0;

var newForm = document.querySelector("#form");
var questionForm = document.querySelector(".section-2");
var subject = document.querySelector('#subject');
var query = document.querySelector("#query");
var querySubmit = document.querySelector("#btn-submit");
var questionList = document.querySelector(".question");
var Answerform = document.querySelector(".section-3");
var resAnswer = document.querySelector('.res-answer');
var user = document.querySelector("#user-name");
var userAnswer1 = document.querySelector('#user-answer');
var resBtn = document.querySelector('.res-submit');
var resBox = document.querySelector('.res-answer');
var resolve = document.querySelector('.resolve');
var searchText = document.querySelector('#search');

//function for creating question and append to the quetsion list

function createQuestion(subjectValue,queryValue,id1) {
    var div1 = document.createElement('div');
        div1.className = "question-box";
        div1.setAttribute('data-set', id1);
        div1.innerHTML = `<h2>${subjectValue}</h2><p>${queryValue}</p>`;
    questionList.appendChild(div1);     
    console.log(div1);
    //attaching click event to the question which are just put by user
        div1.addEventListener('click', (event) => {
            questionForm.style.display = "none";
            Answerform.style.display = "inline-block";
            let answerData = {};
            for (var i = 0; i < data.length; i++){
                if (data[i].id == div1.getAttribute('data-set')) {
                    answerData = data[i];
                    break;
                }
            }
            document.querySelector('#sub-text').innerText = answerData.subject;
            document.querySelector("#question-text").innerText = answerData.query;
            let responseText = document.querySelector('#responseText');
            responseText.style.display = "none";
            resBox.innerHTML = "";
            resBtn.setAttribute('data-Key', answerData.id);
            resolve.setAttribute('data-key', answerData.id);
            if (answerData.answer.length != 0) {
                responseText.style.display = "block";
                for (var ans of answerData.answer) {
                    addResponse(ans.userName, ans.userAnswer);
                }
            }


        })
}

//functiom for craeting response box
function addResponse(userName, userAnswer) {
    var div2 = document.createElement('div');
    div2.className = 'res-box';
    div2.innerHTML=`<h3>${userName}</h3><p>${userAnswer}</p>`
    resBox.appendChild(div2);
}

function solveBug() {
    questionList.innerHTML = "";
        data.forEach((cur) => {
            createQuestion(cur.subject, cur.query,cur.id);
        });
        searchText.value= "";
}

//listening submit button for submitting question
querySubmit.addEventListener('click', (event) => {
    if (searchText.value != "") {
        solveBug();
    }
    if (subject.value == "" || query.value == "") {
        alert("please enter the required material");
    }
    else {
        createQuestion(subject.value, query.value,idValue);
        let questionData = {
            "id": `${idValue}`,
            "subject": subject.value,
            "query": query.value,
            "answer": [],
            "resolve": false,
        };
        data.push(questionData);
        idValue++;
        subject.value = ""
        query.value = ""; 
        localStorage.setItem('questionData', JSON.stringify(data));
    }  
})
//listening to response button when some give response to question 
resBtn.addEventListener('click', (event) => {
    if (user.value != "" && userAnswer1.value != "") {
        responseText.style.display = "block";
        addResponse(user.value, userAnswer1.value);
        for (var k = 0; k < data.length; k++) {
            if (data[k].id == resBtn.getAttribute('data-key')) {
                data[k].answer.push({
                    "userName": user.value,
                    "userAnswer": userAnswer1.value
                });
            }
        }
        user.value = "";
        userAnswer1.value = "";
        localStorage.setItem('questionData', JSON.stringify(data));
    }
});
//when some one want to ask question
newForm.addEventListener("click", () => {
    Answerform.style.display = "none";
    questionForm.style.display = "inline-block";

})
//getting data from local storage when page is loaded;
window.addEventListener('DOMContentLoaded', () => {
    var localData = localStorage.getItem('questionData');
    console.log(localData);
    if (localData != null) {
        data = JSON.parse(localData);
        idValue = data.length ;
        console.log(data);
        for (var d = 0; d < data.length; d++) {
            createQuestion(data[d].subject, data[d].query, data[d].id)
        }
    }
});
// adding event to the resolve button;
resolve.addEventListener('click', () => {
    if (searchText.value != "") {
        solveBug();
    }
    var allQuestion = document.querySelectorAll('.question-box');
    if (allQuestion.length == 1) {
        questionList.removeChild(allQuestion[0]);
        data.splice(0, 1);
        localStorage.removeItem("questionData");

    } else {
        var position;
        var element;
        allQuestion.forEach((cur, index) => {
            if (cur.getAttribute('data-set') == resolve.getAttribute('data-key')) {
                element = cur;
                position = index;
            }
            if (position != undefined && index > position) {
                cur.dataset.set = (parseInt(cur.dataset.set) - 1).toString();
                data[index].id = (parseInt(data[index].id) - 1).toString();
            }
        });
        questionList.removeChild(element);
        data.splice(position, 1);
        localStorage.setItem('questionData', JSON.stringify(data));
    }
    idValue--;
    Answerform.style.display = "none";
    questionForm.style.display = "inline-block";
})
//searching option
searchText.addEventListener('keyup', (event) => {
    var str = event.target.value;
    var filterData = [];
    questionList.innerHTML = "";
    for (var i = 0; i < data.length; i++){
        if (data[i].subject.includes(str) || data[i].query.includes(str)) {
            filterData.push(data[i]);
            createQuestion(data[i].subject, data[i].query, data[i].id);
        }
    }
    if (filterData.length == 0) {
        questionList.innerHTML = '<div class="question-box" ><h1>NO DATA found</h1></div>';
    }
    if (event.target.value != "" && data.length == 0) {
        questionList.innerHTML = "";
        questionList.innerHTML='<div class="question-box" ><h1>NO DATA present</h1></div>'
    }
    if (event.target.value == "") {
        questionList.innerHTML = "";
        data.forEach((cur) => {
            createQuestion(cur.subject, cur.query, cur.id);
        });
    }
})
