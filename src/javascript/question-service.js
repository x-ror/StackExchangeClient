const servicesApi = require('./stackexchange-service');

exports.getQuestions = (url,qParams) => {
  servicesApi.fetch(url,qParams).then(req =>{
    if(req.items){
      let stack = [];
      req.items.map( item => {
        stack.push(`<div class="question">
          <div class="title">
            <h4><a href="#">${item.title}</a></h4>
          </div>
          <div class="tags">
            ${tags(item.tags)}
          </div>
        </div>`);
      });
      document.querySelector('.container').insertAdjacentHTML('beforeend',stack.join(''));
    }
  });  
  const tags = (tags) => {
    return tags.map( tag => {
      return `<div class="tag"><a href="#">${tag}</a></div>`;
    }).join('');
  };
}