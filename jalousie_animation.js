/**
 * Создаем объект (можно вынести в отдельный json) 
 * в котором размещаем для соответсвующего ID шаг элементов 
 * по которым делим на <span>
 */

var schemeOfSlice = {
    main: 
    { 
        desktop: [0, 25, 51],
        mobile: [0, 18, 35, 51, 65, 79]
    },
    euroled: 
    { 
        desktop: [0, 23, 47],
        mobile: [0, 23, 47, 63, 72]
    },
    aver: 
    { 
        desktop: [0, 26, 54, 78],
        mobile: [0, 26, 54, 78]
    },
};

document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll(".animationItem");

    /**
     * делаем наблюдателя, который будет запускать функцию разбития элементов
     * только когджа попадям на него. 
     */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.style.visibility = 'visible';
                element.style.opacity = '1'; 
                let idOfElement = element.id
                let textContent = element.innerText 
                let device = getDeviceType();
                let sliceIndexes = schemeOfSlice[idOfElement][device];
                element.innerText = ''

                createAndAppendSlices(element, textContent, sliceIndexes)

                // это исключение для главного заголова на главной старнице 
                // так как там есть выделение нескольких первых букв
                if(idOfElement === 'main'){
                    var spans = element.querySelectorAll('span')

                    for(let i = 1; i < 35; i++){
                        if(i === 26){
                            continue
                        }
                        var mainBoldChar = `<b>${spans[i].innerText}</b>`
                        spans[i].innerHTML = mainBoldChar
                    }

                }
                observer.unobserve(element); 
            }
        });
    }, { threshold: 1.0 });

    elements.forEach(element => {
        observer.observe(element);
    });
});

/**
 * функция
 * в которой каждый элемент класса .animationItem
 * подвергаем разделению на части и добавляем 
 * анимацию
 */

function createAndAppendSlices(element, textContent, sliceIndexes) {
    sliceIndexes.forEach((start, index) => {
        var end = index < sliceIndexes.length - 1 ? sliceIndexes[index + 1] : textContent.length;
        var slice = textContent.slice(start, end);

        var characters = slice.split('');
        var containerSpan = document.createElement('span');
        containerSpan.classList.add('slice');

        characters.forEach((char, index) => {
            var charSpan = document.createElement('span');
            charSpan.classList.add('animatedChar');
            if (char === ' ') {
                charSpan.innerHTML = '&nbsp;';
                charSpan.style.opacity = "0";
            } else {
                charSpan.textContent = char;
            }

            // анимация
            charSpan.style.animation = `slideIn 0.5s cubic-bezier(.01,.89,.23,.98) ${index * 0.02}s forwards`;
            containerSpan.appendChild(charSpan);
        });
        
        element.appendChild(containerSpan);
        if (index < sliceIndexes.length - 1) {
            element.appendChild(document.createTextNode(' '));
        }
    });
    element.classList.add('animated'); 
}

// тут просто определяем экран
function getDeviceType() {
    return window.innerWidth <= 770 ? 'mobile' : 'desktop';
}