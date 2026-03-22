// Fichier: test-sonarqube.js

function hello() {
    console.log("Hello DevOps")
}
hello()

// 1. Variable non déclarée
x = 10;

// 2. Comparaison faible (== au lieu de ===)
if (x == "10") {
    console.log("Equal");
}

// 3. Fonction sans retour cohérent
function sum(a, b) {
    if (a && b) {
        return a + b;
    }
}

// 4. Variable inutilisée
let unusedVar = 100;

// 5. Redéclaration de variable
var a = 5;
var a = 10;

// 6. Mauvaise gestion des erreurs
try {
    throw "error";
} catch (e) {
}

// 7. Boucle infinie
// while(true) {}

// 8. Mauvais type
let num = "5" * 2;

// 9. Accès à une propriété inexistante
let obj = {};
console.log(obj.name.first);

// 10. Mutation de const
const pi = 3.14;
pi = 3.1416;

// 11. Mauvaise indentation / lisibilité
if(true){console.log("bad style")}

// 12. Paramètre non utilisé
function greet(name) {
    console.log("Hi");
}

// 13. Fonction trop complexe
function complex(a,b,c,d,e,f,g){
    return a+b+c+d+e+f+g;
}

// 14. Callback imbriqué (callback hell)
setTimeout(function(){
    setTimeout(function(){
        setTimeout(function(){
            console.log("Nested");
        },1000);
    },1000);
},1000);

// 15. Mauvaise pratique avec eval (⚠️ VULNÉRABILITÉ)
function runUserCode(userInput) {
    eval(userInput); // ❌ vulnérabilité critique (code injection)
}

// 16. Comparaison avec null incorrecte
let val = null;
if (val == undefined) {
    console.log("null or undefined");
}

// 17. Mauvaise gestion async
async function fetchData() {
    let data = fetch("https://api.example.com");
    console.log(data); // pas await
}

// 18. Tableau modifié pendant itération
let arr = [1,2,3];
arr.forEach((item, index) => {
    arr.push(item);
});

// 19. Fonction vide inutile
function doNothing() {}

// 20. Mauvais usage de this
const obj2 = {
    name: "Dev",
    getName: function() {
        return function() {
            return this.name;
        }
    }
};

// 21. Return unreachable
function test() {
    return;
    console.log("never executed");
}
