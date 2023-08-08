import axios from 'axios';

const API = axios.create({

  baseURL: 'https://sketchme.ddns.net/dev',

});

export default API;
