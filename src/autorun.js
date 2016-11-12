import Poo from './poo';
import App from './app';

console.log("this is the entry point of autorun.js");
const app = new App();
app.run();

// launchAutorun();
//
// function launchAutorun() {
//     console.log("this is THE NEW AUTORUN");
//
//     setTimeout( () => {
//         console.log("eat pizza");
//         console.log("instantiate poo");
//         const poo = new Poo();
//         poo.output();
//     }, 3000);
//
//     setTimeout(
//         () => {
//             console.log("Hello");
//         },
//         4000);
// }

