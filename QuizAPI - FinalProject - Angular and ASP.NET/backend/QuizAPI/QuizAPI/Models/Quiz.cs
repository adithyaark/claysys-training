namespace QuizAPI.Models;

public class Quiz
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int CourseId { get; set; }
    public Course? Course { get; set; }
    public int TimeLimitMinutes { get; set; } = 10;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Question> Questions { get; set; } = new List<Question>();
    public ICollection<Result> Results { get; set; } = new List<Result>();
}