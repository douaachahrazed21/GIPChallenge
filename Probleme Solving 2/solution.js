function smallest (num){
    let counter = 0;
    for (const n of num){
        if (n == counter){
            counter++;
        }
    }
    return counter;
}
const num = [0,3,5,7];
console.log(smallest(num));