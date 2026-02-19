using System.Net.Security;

class Program
{
    static void Main(string[] args)
    {
        int a = 12;
        int b = 14;

        int sum = a + b;
        int diff = a - b;
        int prod = a * b;
        double div = a / b;

        Console.WriteLine(a + "+" + b + "=" + sum);
        Console.WriteLine(a + "-" + b + "=" + diff);
        Console.WriteLine(a + "*" + b + "=" + prod);
        Console.WriteLine(a + "/" + b + "=" + div);

        int age = 40;
        string x = "adult";
        string y = "minor";

        if ( age >=18)
        {
          Console.Write(x+ " since age is " + age);
        }
        else
        {
          Console.Write(y+ " since age is " + age);
        }
    }
}