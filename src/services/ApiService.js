class ApiService {
    static get(path, callback){
        fetch(path)
            .then((res) => res.json())
            .then(callback)
    }
}

export default ApiService