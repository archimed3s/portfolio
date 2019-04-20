import ready from 'domready';

import App from './App';

ready(() => {
	window.app = new App();
	window.app.init();

	document.getElementsByClassName('js-viewPortfolio')[0].addEventListener('click', () => {
		document.getElementsByClassName('js-projectsContainer')[0].classList.add('active');
	});

	document.getElementsByClassName('js-projectsEvents')[0].addEventListener('click', (e) => {
		document.getElementsByClassName('templates__wrapper')[0].classList.add('active');
		document.getElementsByClassName('template')[e.target.closest('.project').dataset.project].classList.add('active');
	});

	document.getElementsByClassName('js-closePopup')[0].addEventListener('click', () => {
		document.getElementsByClassName('templates__wrapper')[0].classList.remove('active');

		for (let i = 0; i < document.getElementsByClassName('template').length; i++) {
			document.getElementsByClassName('template')[i].classList.remove('active');
		}
	});

	letterAnimation('js-title', 2);

	setTimeout(() => {
		letterAnimation('js-description', 2);
	}, 1000);

	setTimeout(() => {
		letterAnimation('js-btn', 2);
	}, 2000);

	function letterAnimation(elem, duration) {
		let animDuration = duration,
			copyEl = document.getElementsByClassName(elem),
			copyText = copyEl.innerHTML;

		for (let i = 0; i < copyEl[0].children.length; i++) {
			let line = copyEl[0].children[i],
				words = line.innerHTML.split(' '),
				newLine = document.createElement('p');

			words.forEach(function (word) {
				let wordWrapper = document.createElement('span');

				wordWrapper.className = 'word';

				for (let j = 0; j < word.length; j++) {
					let letter = word[j],
						letterWrapper = document.createElement('span');

					letterWrapper.className = 'letter';

					let animDelay = Math.random() * animDuration;

					letterWrapper.style.animationDelay = animDelay + 's';
					letterWrapper.style.animationDuration = (animDuration - animDelay) + 's';

					let letterContent = document.createTextNode(letter);

					letterWrapper.appendChild(letterContent);
					wordWrapper.appendChild(letterWrapper);
				}

				newLine.appendChild(wordWrapper);
			});

			copyEl[0].replaceChild(newLine, copyEl[0].children[i]);
		}

		copyEl[0].classList.add('active');
	}
});
