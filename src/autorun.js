import Poo from './poo';

console.log("this is the entry point of autorun.js");
launchAutorun();

function launchAutorun() {
    console.log("this is THE NEW AUTORUN");

    setTimeout( () => {
        console.log("eat pizza");
        console.log("instantiate poo");
        const poo = new Poo();
        poo.output();
    }, 3000);

    setTimeout(
        () => {
            console.log("Hello");
        },
        4000);
}

