function different(strings) {
    let diff = "";
    for(let i =0;i<strings.length;i++){
        const c = strings[i][i];
        if(c === "1"){
            diff+="0";
        } else {
            diff += "1";
        }
    }
    return diff;
}
const strings = ["1100", "1010", "1110", "1001"];
console.log(different(strings));
