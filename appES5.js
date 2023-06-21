// course constructor
function Course(title, instructor, image) {
    this.title = title;
    this.instructor = instructor;
    this.image = image;

}

// UI constructor
function UI() {
}

UI.prototype.addCourseToList = function (course) {
    const list = document.getElementById("course-list");

    var html = `
        <tr>
            <td> <img src="img/${course.image}" class="img-fluid w-50"/> </td>
            <td> ${course.title} </td>
            <td> ${course.instructor} </td>
            <td> <a href="#" class="btn btn-danger btn-sm delete">Delete</a> </td>
        </tr>
    `;

    list.innerHTML += html; // += olması gerekir, çünkü mevcut içerikleri olan bir etikete html değerleri ekleriz
}

UI.prototype.clearControls = function () {
    const title = document.getElementById("title").value = "";
    const instructor = document.getElementById("instructor").value = "";
    const image = document.getElementById("image").value = "";
}

UI.prototype.deleteCourse = function (element) {
    if (element.classList.contains('delete')) { // contains(), verilen değerin classList içerisinde olup olmadığına bakar
        if (confirm("Are u sure?")) {
            const ui = new UI();
            element.parentElement.parentElement.remove();
            ui.showAlert('The course has been deleted', 'danger');
        }
    }
}

UI.prototype.showAlert = function (message, className) {
    var alert = `
        <div class="alert alert-${className}">
            ${message}
        </div>
    ` ;

    const row = document.querySelector(".row");
    // beforeBegin , afterBegin , beforeEnd , afterEnd
    row.insertAdjacentHTML('beforeBegin', alert); // insertAdjacentHTML(), seçtiğimiz konuma HTML etiketi eklememizi sağlar (before ve after değerleri ile, seçili elementten önce veya sonra ekleme yapabiliriz)

    setTimeout(function () { // setTimeout(), belirlediğimiz süre sonrasında function içerisinde yazmış olduğumuz işlemin gerçekleşmesini sağlar

        document.querySelector(".alert").remove();
    }, 3000)
}

document.getElementById("new-course").addEventListener('submit', function (e) {

    const title = document.getElementById("title").value;
    const instructor = document.getElementById("instructor").value;
    const image = document.getElementById("image").value;

    // create course instance
    const course = new Course(title, instructor, image);

    // create UI
    const ui = new UI();

    if (title === "" || instructor === "" || image === "") {
        ui.showAlert('Please complete the form', 'warning');
    }
    else {
        // add course to list
        ui.addCourseToList(course);

        // clear controls
        ui.clearControls();

        ui.showAlert('The Course has been added', 'success');
    }
    e.preventDefault();
});

document.getElementById("course-list").addEventListener("click", function (e) {

    const ui = new UI();
    ui.deleteCourse(e.target);
})