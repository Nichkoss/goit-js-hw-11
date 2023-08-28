import { Notify } from 'notiflix/build/notiflix-notify-aio';
import '../css/base.css';


const refs = {
    formEl: document.querySelector('.search-form'),
    inputEl: document.querySelector('[name="searchQuery"]'),
    divEl: document.querySelector('.gallery'),
    btnLoadMore: document.querySelector('.load-more'),
}

async function fetchImages(searchQuery) {
    const BASE_URL = "https://pixabay.com/api/";
    const apiKEY = "36788641-8cf00dcd24f2681e40d99dde8";
    const perPage = 40;
    const response = await fetch(`${BASE_URL}?key=${apiKEY}&q=${searchQuery}&image_type=image&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`)
       if (!response.ok) {
        throw new Error(response.status);
    }
    return response.json();
}

let searchQuery = '';
let page = 1;

refs.btnLoadMore.style.display = 'none';

refs.formEl.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onLoadMore);




function onSearch(e) {
    e.preventDefault();
    refs.divEl.innerHTML = ''
    searchQuery = e.currentTarget.elements.searchQuery.value;
    console.log(searchQuery);
    page = 1;
    refs.btnLoadMore.style.display = 'none';
   

    fetchImages(searchQuery)
        .then(data => {
            console.log(data);
            createMarkupCard(data);
            refs.btnLoadMore.style.display = 'block';
            Notify.success(`Hooray! We found ${data.totalHits} images.`)
            if (data.hits.length === 0) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.')
            }
        })
        .catch(error => console.log(error));
}

function createMarkupCard(data) {
    const addImages = data.hits.map(img => {
        return `<div class="photo-card">
            <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" width="300" height="200"/>
            <div class="info">
                <p class="info-item">
                    <b>Likes:</b> ${img.likes}
                </p>
                <p class="info-item">
                    <b>Views:</b> ${img.views}
                </p>
                <p class="info-item">
                    <b>Comments:</b> ${img.comments}
                </p>
                <p class="info-item">
                    <b>Downloads:</b> ${img.downloads}
                </p>
            </div>
        </div>`;
    }).join("");
    refs.divEl.insertAdjacentHTML("beforeend", addImages);
}

function onLoadMore() {
    fetchImages(searchQuery)
        .then(data => {
            console.log(data);
            page += 1;
            createMarkupCard(data);
            if (data.totalHits <= page * 40) {
                Notify.failure("We're sorry, but you've reached the end of search results.");
                refs.btnLoadMore.style.display = 'none';
            }
        }); 
}