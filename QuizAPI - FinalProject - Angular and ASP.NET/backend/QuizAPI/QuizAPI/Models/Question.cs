namespace QuizAPI.Models;

public class Question
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public string OptionA { get; set; } = string.Empty;
    public string OptionB { get; set; } = string.Empty;
    public string OptionC { get; set; } = string.Empty;
    public string OptionD { get; set; } = string.Empty;
    public string CorrectAnswer { get; set; } = string.Empty;  // "A" | "B" | "C" | "D"
    public int Points { get; set; } = 1;
    public int QuizId { get; set; }
    public bool IsCustom { get; set; } = false;
    public Quiz? Quiz { get; set; }
}