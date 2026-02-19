using System;

class Program
{
    static void Main(string[] args)
    {
      Random random = new Random();
      int target = random.Next(1, 101);
      int guess = 0;

      while(guess != target)
      {
        Console.Write("enter your guess:");
        guess = Convert.ToInt32(Console.ReadLine());

        if (guess < target)
        {
          Console.WriteLine("Too low!");
        }
        else if (guess > target )
        {
          Console.WriteLine("Too High!!");
        }
        else 
        {
          Console.WriteLine("GREAT! You guessed it!");
        }
      }
      
        
    }
}