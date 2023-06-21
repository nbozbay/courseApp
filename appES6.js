// Course Class
class Course {
    constructor(title, instructor, image) {
        this.courseID = Math.floor(Math.random() * 10000); // üretilen course objeleri için random bir id değeri üretiriz
        this.title = title;
        this.instructor = instructor;
        this.image = image;
    }
}

// UI Class
class UI {
    addCourseToList(course) {
        const list = document.getElementById("course-list");

        var html = `
        <tr>
            <td> <img src="img/${course.image}" class="img-fluid w-50"/> </td>
            <td> ${course.title} </td>
            <td> ${course.instructor} </td>
            <td> <a href="#" data-id="${course.courseID} " class="btn btn-danger btn-sm delete">Delete</a> </td>
        </tr>
         `;

        list.innerHTML += html; // += olması gerekir, çünkü mevcut içerikleri olan bir etikete html değerleri ekleriz
    }

    clearControls() {
        const title = document.getElementById("title").value = "";
        const instructor = document.getElementById("instructor").value = "";
        const image = document.getElementById("image").value = "";
    }

    deleteCourse(element) {
        if (element.classList.contains('delete')) { // contains(), verilen değerin classList içerisinde olup olmadığına bakar
            if (confirm("Are u sure?")) {
                const ui = new UI();
                element.parentElement.parentElement.remove();
                ui.showAlert('The course has been deleted', 'danger');
            }
        }
    }

    showAlert(message, className) {
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
}

// LocalStorage Class
class Storage {
    static getCourses() { // Localstorage işlemleri için kopya objelere ihtiyaç yok, sadece ana class üzerinden çağrılarak yapılabilir
        let courses;
        if (localStorage.getItem('courses') === null) {
            courses = [];
        }
        else {
            courses = JSON.parse(localStorage.getItem('courses'));
        }

        return courses;
    }

    static displayCourses() {
        const courses = Storage.getCourses();

        courses.forEach(course => {
            let ui = new UI();
            ui.addCourseToList(course);
        });

    }

    static addCourse(course) {
        let courses = Storage.getCourses();
        courses.push(course);
        localStorage.setItem('courses', JSON.stringify(courses));
    }

    static deleteCourse(element) {
        if (element.classList.contains('delete')) {
            const id = element.getAttribute('data-id'); // random oluşturulup butona atılan id değerini alırız

            const courses = Storage.getCourses();

            courses.forEach((course, index) => {
                if (course.courseID == id) {
                    courses.splice(index, 1);
                }
            })

            localStorage.setItem('courses', JSON.stringify(courses));
        }
    }
}

document.addEventListener('DOMContentLoaded', Storage.displayCourses()); // DOMContentLoaded, sayfa üzerindeki bütün dom içerikleri yüklenince çalışır

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

        // save to LS
        Storage.addCourse(course);

        // clear controls
        ui.clearControls();

        ui.showAlert('The Course has been added', 'success');
    }
    e.preventDefault();
});

document.getElementById("course-list").addEventListener("click", function (e) {

    const ui = new UI();
    ui.deleteCourse(e.target);

    Storage.deleteCourse(e.target);
})