exports.request = () => class RequestServices{
    constructor(){}
    static buildUrl(url,parameters){
        url = `https://api.stackexchange.com/2.2${url}`;
        const qString = parameters && Object.keys(parameters).map((key)=>{
            return `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`;
        }).join('&');
        if(qString){
            url += `?${qString}`;
        }
        return url;
    }

    static async fetch(url, parameters, options) {
        if(parameters && typeof parameters === 'object'){
            parameters.site = 'ru.stackoverflow.com';
            parameters.key =  'uzt*oDqUgZZsITxGHfU7XA((';
        }
        return await fetch(RequestServices.buildUrl(url, parameters), options)
            .then(response => response.json());
    }
};