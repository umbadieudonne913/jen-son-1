// test-sonarqube-bugs.js

// 1. Variable non déclarée → bug
x = 10;

// 2. Comparaison faible → code smell
if (x == "10") {
    console.log("Equal");
}

// 3. Variable inutilisée → code smell
let unusedVar = 42;

// 4. Redéclaration de variable → code smell
var a = 5;
var a = 10;

// 5. Fonction sans retour cohérent → code smell
function sum(a, b) {
    if (a && b) {
        return a + b;
    }
}

// 6. Mauvaise indentation → code smell
if(true){console.log("bad style")}

// 7. Paramètre non utilisé → code smell
function greet(name) {
    console.log("Hi");
}

// 8. Fonction trop complexe → code smell
function complex(a,b,c,d,e,f,g){
    return a+b+c+d+e+f+g;
}
