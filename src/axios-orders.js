import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-63b5d.firebaseio.com/'
});

export default instance;