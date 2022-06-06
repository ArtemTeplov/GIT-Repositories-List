const input = document.querySelector("input");
const container = document.querySelector(".container");
const container2 = document.querySelector(".container2");

container.addEventListener("click", event => {
    let target = event.target;
    if (!target.classList.contains("content")) {
	    return;
    }
    addChosen(target);
    input.value = "";
    removePredictions();
});

container2.addEventListener("click", event => {
    let target = event.target;
    if (!target.classList.contains("btn-close")) {
        return;
    }
    target.parentElement.remove();
});

function removePredictions() {
    container.innerHTML = "";
}

function showPredictions(repositories) {
    let dropdownPredictions = document.querySelectorAll(".content");
    removePredictions();

    for (let repositoryIndex = 0; repositoryIndex < 5; repositoryIndex++) {
	let name = repositories.items[repositoryIndex].name;
	let owner = repositories.items[repositoryIndex].owner.login;
	let stars = repositories.items[repositoryIndex].stargazers_count;

	let content = `<div class="content" data-owner="${owner}" data-stars="${stars}">${name}</div>`;
	container.innerHTML += content;
    }
}

function addChosen(target) {
    let name = target.textContent;
    let owner = target.dataset.owner;
    let stars = target.dataset.stars;
    
    container2.innerHTML += `<div class="chosen">Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars}<button class="btn-close"></button></div>`;
}

async function getPredictions() {
    const urlSearchRepositories = new URL("https://api.github.com/search/repositories");
    let repositoriesPart = input.value;
    if (repositoriesPart == "") {
	removePredictions();
	return;
    }
    urlSearchRepositories.searchParams.append("q", repositoriesPart)
	let response = await fetch(urlSearchRepositories);
	if (response.ok) {
	    let repositories = await response.json();
	    showPredictions(repositories);
	}else{
         return null;}
    }

function debounce(fn, timeout) {
    let timer = null;

    return (...args) => {
	clearTimeout(timer);
	return new Promise((resolve) => {
	    timer = setTimeout(
		() => resolve(fn(...args)),
		timeout,
	    );
	});
    };
}

const getPredictionsDebounce = debounce(getPredictions, 500);
input.addEventListener("input", getPredictionsDebounce);