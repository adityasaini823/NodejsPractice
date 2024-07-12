
function localValue(jsonBody) {
    console.log(jsonBody);
}
function callback(result){
    result.text().then(localValue);
}
var obj={
        method:"GET",
}
fetch("http://localhost:3000/?counter=53",obj).then(callback)