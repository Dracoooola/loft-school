const slider = require('./common/slider');
const $ = require('jquery'); // если будет нужен

slider(); // инициализируем слайдер

var parallaxContainer = document.getElementById('parallax'),
    layers = parallaxContainer.children;

var moveLayers = function(e) {
    var initialX = (window.innerWidth / 2) - e.pageX;
    var initialY = (window.innerHeight / 2) - e.pageY;

    [].slice.call(layers).forEach(function(layer, index) {
        var
            divider = index / 60,
            positionX = initialX * divider,
            positionY = initialY * divider,
            bottomPosition = (window.innerHeight / 2) * divider,
            transformString = 'translate(' + positionX + 'px,' + positionY + 'px)',
            image = layer.firstElementChild;

        layer.style.transform = transformString;
        image.style.bottom = '-' + bottomPosition + 'px';
    });

};

window.addEventListener('mousemove', moveLayers);