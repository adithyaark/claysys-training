namespace QuizAPI.Models;

// ── Auth DTOs ──────────────────────────────────────────────────────────────
public record RegisterDto(string Username, string Email, string Password);
public record LoginDto(string Email, string Password);
public record AuthResponseDto(string Token, string Username, string Role);

// ── Course DTOs ────────────────────────────────────────────────────────────
public record CourseDto(int Id, string Title, string Description);
public record CreateCourseDto(string Title, string Description);

// ── Quiz DTOs ──────────────────────────────────────────────────────────────
public record QuizDto(int Id, string Title, string Description, int CourseId, string CourseName, int TimeLimitMinutes, int QuestionCount);
public record CreateQuizDto(string Title, string Description, int CourseId, int TimeLimitMinutes);

// ── Question DTOs ──────────────────────────────────────────────────────────
public record QuestionDto(int Id, string Text, string OptionA, string OptionB, string OptionC, string OptionD, string CorrectAnswer, int Points, int QuizId, bool IsCustom);
public record QuestionWithAnswerDto(int Id, string Text, string OptionA, string OptionB, string OptionC, string OptionD, string CorrectAnswer, int Points, int QuizId, bool IsCustom);
public record CreateQuestionDto(string Text, string OptionA, string OptionB, string OptionC, string OptionD, string CorrectAnswer, int Points, int QuizId, bool IsCustom = true);

// ── Result DTOs ────────────────────────────────────────────────────────────
public record SubmitQuizDto(int QuizId, List<AnswerDto> Answers);
public record AnswerDto(int QuestionId, string SelectedAnswer);
public record ResultDto(int Id, string Username, int QuizId, string QuizTitle, string CourseTitle, int Score, int TotalQuestions, int CorrectAnswers, DateTime TakenAt);