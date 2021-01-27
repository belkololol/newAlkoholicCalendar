let desiredYear = 2021;
let monthName = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
let monthConteiner = document.querySelectorAll('.monthConteiner')

//заголовок с нужным годом
let heading = document.querySelector('.alko');
heading.innerHTML = ` 
  <h1>Алко <br>календарь <br> ${desiredYear} </h1>
  <img src="alkohol.png" alt=""> 
`;

let alkoData = JSON.parse(localStorage.getItem("alkoDataKey")) || {};

function createMonthTable(year, month) {
  let d = new Date(Date.UTC(year, month));
  let table = '<table><tr><th>пн</th><th>вт</th><th>ср</th><th>чт</th><th>пт</th><th>сб</th><th>вс</th></tr><tr>';

  // пробелы для первого ряда
  for (let i = 0; i < getDay(d); i++) {
    table += '<td></td>';
  }

  // <td> ячейки календаря с датами
  while (d.getMonth() == month) {
    const date = formatDate(d);

    table += `<td>  <p class="date">  ${d.getDate()} </p>  <img src="${getImgSrc(date)}" class="wineglass" data-date=${date}>  </td>`;
    if (getDay(d) % 7 == 6) { // вс, последний день - перевод строки
      table += '</tr><tr>';
    }

    d.setDate(d.getDate() + 1);
  }

  // добить таблицу пустыми ячейками, если нужно
  if (getDay(d) != 0) {
    for (let i = getDay(d); i < 7; i++) {
      table += '<td></td>';
    }
  }

  table += '</tr></table>';
  return table;
}

function getDay(date) { // получить номер дня недели, от 0 (пн) до 6 (вс)
  let day = date.getDay();
  if (day == 0) day = 7; // сделать воскресенье (0) последним днем
  return day - 1;
}

function createCalendar() {
  for (let i = 0; i <= 11; i++) {
    monthConteiner[i].innerHTML = `<p class="monthName"> ${monthName[i]} </p>  ${createMonthTable(desiredYear, i)}`;
  }
}

function formatDate(date) {
  date.setUTCHours(0, 0, 0, 0);

  return date.toISOString();
}

// клик по бокалу
function changeGlass(e) {
  const date = e.target.dataset['date'];
  
  saveAlkoDayData(date);

  e.target.setAttribute('src', getImgSrc(date));
}

// получить путь к изображению бокала
function getImgSrc(date) {
  const currentAlko = alkoData[date];
  const imgIndex = currentAlko ? currentAlko.value : 0;
  return `${imgIndex}.png`;
}

// сохранить данные об алкодне
function saveAlkoDayData(date) {
  const currentAlko = alkoData[date];

  if (currentAlko && currentAlko.value) {
    if (currentAlko.value === 3) {
      delete alkoData[date];
    } else {
      currentAlko.value++;
    }
  } else {
    const newAlko = {
      value: 1,
      date: date,
    };
    alkoData[newAlko.date] = newAlko;
  }

  localStorage.setItem('alkoDataKey', JSON.stringify(alkoData));
}

// инициализация
function init() {
  createCalendar();

  let glasses = document.querySelectorAll('.wineglass')
  glasses.forEach((el, i) => {
    el.addEventListener('click', (e) => {
      changeGlass(e, i)
    })
  }); 
}

init();