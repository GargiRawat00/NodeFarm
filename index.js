



const fs=require('fs');
const url=require('url');
//blocking, synchronous way
// const textIn=fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textIn);

// const textOut= `This is wha we know about the avacado: ${textIn},\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt',textOut);
// console.log('file written');

//non-blocking asynchronous way
// 
const replaceTemplate=(temp,product)=>{
    //console.log(product);
    let output=temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output=output.replace(/{%IMAGE%}/g, product.image);
    output=output.replace(/{%PRICE%}/g, product.price);
    output=output.replace(/{%FROM%}/g, product.from);
    output=output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output=output.replace(/{%QUANTITY%}/g, product.quantity);
    output=output.replace(/{%DESCRIPTION%}/g, product.description);
    output=output.replace(/{%ID%}/g, product.id);
    //output=temp.replace(/{%IMAGE%}/g, product.image);
    if(!product.organic) output= output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    return output;
}
const http=require('http');
const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const tempOverview=fs.readFileSync(`${__dirname}/templates/overview.html`,'utf-8');
const tempCard=fs.readFileSync(`${__dirname}/templates/card.html`,'utf-8');
const tempProduct=fs.readFileSync(`${__dirname}/templates/product.html`,'utf-8');
const dataObj=JSON.parse(data);
const server=http.createServer((req,res)=>{
    const {query, pathname}=url.parse(req.url,true);
    //const pathname=url.parse(req.url,true);
    //console.log(pathname);
    //
    if(pathname==='/'|| pathname==='/overview')
    {
        res.writeHead(200,{'Content-type':'text/html'});
        const cardsHTML=dataObj.map(el=> replaceTemplate(tempCard,el)).join('');
        //console.log(cardsHTML);
        const output=tempOverview.replace('{%PRODUCT_CARDS%}',cardsHTML);
        //console.log(output);
        res.end(output);
    }
    else if(pathname==='/product')
    {
        //console.log(query);
        res.writeHead(200,{'Content-type':'text/html'});
        const product=dataObj[query.id];
        const output=replaceTemplate(tempProduct, product);
        res.end(output);
    }
    else if(pathname==='/api')
    {
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(data);
    }
    else{
        res.writeHead(404,{
            'Content-type':'text/html',
            'my-own-header':'hello-world'
        });
        res.end('<h1>Page Not Found</h1>');
    }
    //res.end('Hello from the server');
});
server.listen(8000,'127.0.0.1',()=>{
    console.log('Listening to request on port 8000...');
});