using Microsoft.EntityFrameworkCore;
using QuizAPI.Models;

namespace QuizAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Quiz> Quizzes => Set<Quiz>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<Result> Results => Set<Result>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        var seedDate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        modelBuilder.Entity<Course>().HasData(
            new Course { Id = 1, Title = "JavaScript", Description = "Core JS concepts and ES6+ features", CreatedAt = seedDate }
        );
        modelBuilder.Entity<Course>().HasData(
            new Course { Id = 2, Title = "Python", Description = "Python fundamentals and OOPs concepts", CreatedAt = seedDate }
        );
        modelBuilder.Entity<Course>().HasData(
            new Course { Id = 3, Title = "CSS", Description = "Styling the web with Cascading Style Sheets", CreatedAt = seedDate }
        );

        modelBuilder.Entity<Quiz>().HasData(
            new Quiz { Id = 1, Title = "JS Fundamentals Quiz", Description = "Test your JavaScript knowledge", CourseId = 1, TimeLimitMinutes = 10, CreatedAt = seedDate }
        );
        modelBuilder.Entity<Quiz>().HasData(
            new Quiz { Id = 2, Title = "Python Basics Quiz", Description = "Test your Python knowledge", CourseId = 2, TimeLimitMinutes = 10, CreatedAt = seedDate }
        );
        modelBuilder.Entity<Quiz>().HasData(
            new Quiz { Id = 3, Title = "CSS Essentials Quiz", Description = "Test your CSS styling skills", CourseId = 3, TimeLimitMinutes = 10, CreatedAt = seedDate }
        );

        //Javascript
        modelBuilder.Entity<Question>().HasData(
            new Question
            {
                Id = 1,
                QuizId = 1,
                Points = 1,
                IsCustom = false,
                Text = "Which keyword declares a block-scoped variable in JavaScript?",
                OptionA = "var",
                OptionB = "let",
                OptionC = "def",
                OptionD = "dim",
                CorrectAnswer = "B"
            },
            new Question
            {
                Id = 2,
                QuizId = 1,
                Points = 1,
                IsCustom = false,
                Text = "What does '===' check in JavaScript?",
                OptionA = "Value only",
                OptionB = "Type only",
                OptionC = "Value and Type",
                OptionD = "Reference",
                CorrectAnswer = "C"
            },
            new Question
            {
                Id = 3,
                QuizId = 1,
                Points = 1,
                IsCustom = false,
                Text = "Which method converts a JSON string to a JavaScript object?",
                OptionA = "JSON.stringify()",
                OptionB = "JSON.parse()",
                OptionC = "JSON.convert()",
                OptionD = "JSON.decode()",
                CorrectAnswer = "B"
            },
            new Question
            {
                Id = 4,
                QuizId = 1,
                Points = 1,
                IsCustom = false,
                Text = "What is the output of: typeof null?",
                OptionA = "\"null\"",
                OptionB = "\"undefined\"",
                OptionC = "\"object\"",
                OptionD = "\"boolean\"",
                CorrectAnswer = "C"
            },
            new Question
            {
                Id = 5,
                QuizId = 1,
                Points = 1,
                IsCustom = false,
                Text = "Which array method returns a new array with transformed elements?",
                OptionA = "filter()",
                OptionB = "find()",
                OptionC = "map()",
                OptionD = "reduce()",
                CorrectAnswer = "C"
            },
            new Question
            {
                Id = 6,
                QuizId = 1,
                Points = 1,
                IsCustom = false,
                Text = "What does the 'async' keyword do to a function?",
                OptionA = "Makes it run on a separate thread",
                OptionB = "Makes it return a Promise",
                OptionC = "Makes it run faster",
                OptionD = "Makes it synchronous",
                CorrectAnswer = "B"
            }
        );

        // Python
        modelBuilder.Entity<Question>().HasData(
            new Question
            {
                Id = 7,
                QuizId = 2,
                Points = 1,
                IsCustom = false,
                Text = "Which of the following is a valid Python list?",
                OptionA = "{1, 2, 3}",
                OptionB = "(1, 2, 3)",
                OptionC = "[1, 2, 3]",
                OptionD = "<1, 2, 3>",
                CorrectAnswer = "C"
            },
            new Question
            {
                Id = 8,
                QuizId = 2,
                Points = 1,
                IsCustom = false,
                Text = "What keyword is used to define a function in Python?",
                OptionA = "function",
                OptionB = "func",
                OptionC = "define",
                OptionD = "def",
                CorrectAnswer = "D"
            },
            new Question
            {
                Id = 9,
                QuizId = 2,
                Points = 1,
                IsCustom = false,
                Text = "Which data type is IMMUTABLE in Python?",
                OptionA = "list",
                OptionB = "dict",
                OptionC = "tuple",
                OptionD = "set",
                CorrectAnswer = "C"
            },
            new Question
            {
                Id = 10,
                QuizId = 2,
                Points = 1,
                IsCustom = false,
                Text = "What does 'len([1, 2, 3, 4])' return?",
                OptionA = "3",
                OptionB = "4",
                OptionC = "5",
                OptionD = "Error",
                CorrectAnswer = "B"
            },
            new Question
            {
                Id = 11,
                QuizId = 2,
                Points = 1,
                IsCustom = false,
                Text = "Which operator is used for exponentiation in Python?",
                OptionA = "^",
                OptionB = "**",
                OptionC = "^^",
                OptionD = "exp()",
                CorrectAnswer = "B"
            },
            new Question
            {
                Id = 12,
                QuizId = 2,
                Points = 1,
                IsCustom = false,
                Text = "What is the correct way to open a file in read mode in Python?",
                OptionA = "open('file.txt', 'w')",
                OptionB = "open('file.txt', 'a')",
                OptionC = "open('file.txt', 'r')",
                OptionD = "read('file.txt')",
                CorrectAnswer = "C"
            }
        );

        // CSS
        modelBuilder.Entity<Question>().HasData(
            new Question
            {
                Id = 13,
                QuizId = 3,
                Points = 1,
                IsCustom = false,
                Text = "What does CSS stand for?",
                OptionA = "Computer Style Sheets",
                OptionB = "Creative Style Sheets",
                OptionC = "Cascading Style Sheets",
                OptionD = "Colorful Style Sheets",
                CorrectAnswer = "C"
            },
            new Question
            {
                Id = 14,
                QuizId = 3,
                Points = 1,
                IsCustom = false,
                Text = "Which HTML tag is used to link an external CSS file?",
                OptionA = "<style>",
                OptionB = "<css>",
                OptionC = "<script>",
                OptionD = "<link>",
                CorrectAnswer = "D"
            },
            new Question
            {
                Id = 15,
                QuizId = 3,
                Points = 1,
                IsCustom = false,
                Text = "Which CSS property is used to change text color?",
                OptionA = "font-color",
                OptionB = "color",
                OptionC = "text-style",
                OptionD = "background-color",
                CorrectAnswer = "B"
            },
            new Question
            {
                Id = 16,
                QuizId = 3,
                Points = 1,
                IsCustom = false,
                Text = "Which CSS property controls the text size?",
                OptionA = "text-size",
                OptionB = "font-style",
                OptionC = "font-size",
                OptionD = "text-style",
                CorrectAnswer = "C"
            },
            new Question
            {
                Id = 17,
                QuizId = 3,
                Points = 1,
                IsCustom = false,
                Text = "How do you select an element with id 'header' in CSS?",
                OptionA = ".header",
                OptionB = "#header",
                OptionC = "header",
                OptionD = "*header",
                CorrectAnswer = "B"
            },
            new Question
            {
                Id = 18,
                QuizId = 3,
                Points = 1,
                IsCustom = false,
                Text = "Which property is used to change the background color?",
                OptionA = "bgcolor",
                OptionB = "background-color",
                OptionC = "color",
                OptionD = "background-style",
                CorrectAnswer = "B"
            }
        );
    }
}
