import axios from 'axios';

  const URL = 'https://pixabay.com/api/';
  const API_KEY = '39110757-18befe450c763484897d09af2';

export default async function fetchImages(value, page) {

  return await axios.get(`${URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`).then(response => response.data);
}