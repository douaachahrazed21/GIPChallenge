const input = document.getElementById('valeur');
const buttons = [...document.querySelectorAll('button')];
const appendValue = (value) => {
    input.value += value;
}
const clearValue = () => {
    input.value = '';
}
const calculate = () => {
    const tokens = input.value.match(/\d+\.?\d*|[-+*/()]/g);
    if (!tokens) return;
    let i =0;
    const expression = ()=>{
        let result = term();
        while (tokens[i] === '+' || tokens[i] === '-'){
            result = tokens[i++] == '+'? result + term() : result - term();
        }
        return result;
    }
    const term = ()=> {
        let result = factor();
        while (tokens[i] === '*' || tokens[i] === '/'){
            result = tokens[i++] == '*'? result * factor() : result / factor();
        }
        return result;
    }
    const factor = ()=>{
        const token = tokens[i++];
        if ( token === '-'){
            return -factor();
        }
        if (token === '(') {
           let result = expression();
            i++;
            return result;
        }
            return parseFloat(token);
    }
    input.value=expression();
}

const moves = {ArrowLeft : -1, ArrowRight : +1, ArrowUp : -4, ArrowDown : 4}
const nav = (e) => {
    if (!(e.key in moves)){
        return;
    }
    const current = buttons.indexOf(document.activeElement)
    if(current == -1){
        if(e.key === "ArrowDown"){
            buttons[0].focus();
        }
        return;
    }
    e.preventDefault();
    if(e.key == "ArrowUp" && current < 4){
        input.focus();
        return;
    }
    const next = (current + moves[e.key] + buttons.length)%buttons.length;
    buttons[next].focus();

}
