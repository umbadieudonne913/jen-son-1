// TestSonarBugs.java
public class TestSonarBugs {

    // 1️⃣ Variable globale non utilisée → code smell
    private int unusedVar = 42;

    // 2️⃣ Méthode sans return dans tous les cas → bug potentiel
    public int divide(int a, int b) {
        if (b != 0) {
            return a / b;
        }
        // pas de return si b == 0
    }

    // 3️⃣ Code dupliqué → code smell
    public void printNumbers() {
        System.out.println(1);
        System.out.println(2);
        System.out.println(3);

        System.out.println(1); // duplication
        System.out.println(2);
        System.out.println(3);
    }

    // 4️⃣ Méthode trop complexe → code smell
    public int complexMethod(int a, int b, int c, int d, int e, int f) {
        if(a>0){if(b>0){if(c>0){if(d>0){if(e>0){if(f>0){return a+b+c+d+e+f;}}}}}}
        return 0;
    }

    // 5️⃣ Paramètre inutilisé → code smell
    public void greet(String name) {
        System.out.println("Hello!");
    }
    
    public static void main(String[] args) {
        TestSonarBugs t = new TestSonarBugs();
        System.out.println(t.divide(10, 2));
    }
}
