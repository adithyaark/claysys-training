using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models;

namespace QuizAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class QuestionController : ControllerBase
{
    private readonly AppDbContext _db;
    public QuestionController(AppDbContext db) => _db = db;

    // Get all questions for a quiz 
    [HttpGet("by-quiz/{quizId}")]
    [ProducesResponseType(typeof(IEnumerable<QuestionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByQuiz(int quizId)
    {
        var questions = await _db.Questions
            .Where(q => q.QuizId == quizId)
            .Select(q => new QuestionDto(
                q.Id, q.Text, q.OptionA, q.OptionB, q.OptionC, q.OptionD, q.CorrectAnswer, q.Points, q.QuizId, q.IsCustom))
            .ToListAsync();
        return Ok(questions);
    }

    // Get all questions with answers for ALL quizzes (Admin only).
    [HttpGet("all-with-answers")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(IEnumerable<QuestionWithAnswerDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllWithAnswers()
    {
        var questions = await _db.Questions
            .Select(q => new QuestionWithAnswerDto(
                q.Id, q.Text, q.OptionA, q.OptionB, q.OptionC, q.OptionD,
                q.CorrectAnswer, q.Points, q.QuizId, q.IsCustom))
            .ToListAsync();
        return Ok(questions);
    }

    // Get all questions with answers (Admin only).
    [HttpGet("by-quiz/{quizId}/with-answers")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(IEnumerable<QuestionWithAnswerDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByQuizWithAnswers(int quizId)
    {
        var questions = await _db.Questions
            .Where(q => q.QuizId == quizId)
            .Select(q => new QuestionWithAnswerDto(
                q.Id, q.Text, q.OptionA, q.OptionB, q.OptionC, q.OptionD,
                q.CorrectAnswer, q.Points, q.QuizId, q.IsCustom))
            .ToListAsync();
        return Ok(questions);
    }

    // Get a single question by ID
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(QuestionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var q = await _db.Questions.FindAsync(id);
        if (q is null) return NotFound();

        return Ok(new QuestionDto(q.Id, q.Text, q.OptionA, q.OptionB, q.OptionC, q.OptionD, q.CorrectAnswer, q.Points, q.QuizId, q.IsCustom));
    }

    // Create a new question. (Admin only)
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(QuestionWithAnswerDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateQuestionDto dto)
    {
        if (!await _db.Quizzes.AnyAsync(q => q.Id == dto.QuizId))
            return BadRequest(new { message = "Quiz not found." });

        var allowed = new[] { "A", "B", "C", "D" };
        if (!allowed.Contains(dto.CorrectAnswer.ToUpper()))
            return BadRequest(new { message = "CorrectAnswer must be A, B, C, or D." });

        var question = new Question
        {
            Text = dto.Text,
            OptionA = dto.OptionA,
            OptionB = dto.OptionB,
            OptionC = dto.OptionC,
            OptionD = dto.OptionD,
            CorrectAnswer = dto.CorrectAnswer.ToUpper(),
            Points = dto.Points,
            QuizId = dto.QuizId,
            IsCustom = dto.IsCustom
        };

        _db.Questions.Add(question);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = question.Id },
            new QuestionWithAnswerDto(question.Id, question.Text,
                question.OptionA, question.OptionB, question.OptionC, question.OptionD,
                question.CorrectAnswer, question.Points, question.QuizId, question.IsCustom));
    }

    /// <summary>Update a question. (Admin only)</summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(QuestionWithAnswerDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] CreateQuestionDto dto)
    {
        var question = await _db.Questions.FindAsync(id);
        if (question is null) return NotFound();

        question.Text = dto.Text;
        question.OptionA = dto.OptionA;
        question.OptionB = dto.OptionB;
        question.OptionC = dto.OptionC;
        question.OptionD = dto.OptionD;
        question.CorrectAnswer = dto.CorrectAnswer.ToUpper();
        question.Points = dto.Points;
        question.QuizId = dto.QuizId;
        question.IsCustom = dto.IsCustom;

        await _db.SaveChangesAsync();

        return Ok(new QuestionWithAnswerDto(question.Id, question.Text,
            question.OptionA, question.OptionB, question.OptionC, question.OptionD,
            question.CorrectAnswer, question.Points, question.QuizId, question.IsCustom));
    }

    // Delete a question. (Admin only)
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var question = await _db.Questions.FindAsync(id);
        if (question is null) return NotFound();

        _db.Questions.Remove(question);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // Submit answers for a quiz and receive your score.
    [HttpPost("submit")]
    [Authorize]
    [ProducesResponseType(typeof(Result), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SubmitQuiz([FromBody] SubmitQuizDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var quiz = await _db.Quizzes.Include(q => q.Questions)
                            .FirstOrDefaultAsync(q => q.Id == dto.QuizId);
        if (quiz is null) return BadRequest(new { message = "Quiz not found." });

        int correct = 0;
        foreach (var answer in dto.Answers)
        {
            var question = quiz.Questions.FirstOrDefault(q => q.Id == answer.QuestionId);
            if (question is not null &&
                question.CorrectAnswer.Equals(answer.SelectedAnswer, StringComparison.OrdinalIgnoreCase))
            {
                correct++;
            }
        }

        int totalPoints = quiz.Questions.Sum(q => q.Points);
        int scoredPoints = 0;
        foreach (var answer in dto.Answers)
        {
            var q = quiz.Questions.FirstOrDefault(x => x.Id == answer.QuestionId);
            if (q is not null &&
                q.CorrectAnswer.Equals(answer.SelectedAnswer, StringComparison.OrdinalIgnoreCase))
            {
                scoredPoints += q.Points;
            }
        }

        var result = new Result
        {
            UserId = userId,
            QuizId = dto.QuizId,
            Score = scoredPoints,
            TotalQuestions = quiz.Questions.Count,
            CorrectAnswers = correct
        };

        _db.Results.Add(result);
        await _db.SaveChangesAsync();

        await _db.Entry(result).Reference(r => r.User).LoadAsync();
        await _db.Entry(result).Reference(r => r.Quiz).LoadAsync();
        await _db.Entry(result.Quiz!).Reference(q => q.Course).LoadAsync();

        return Ok(new ResultDto(result.Id, result.User!.Username, result.QuizId, quiz.Title, quiz.Course!.Title,
            result.Score, result.TotalQuestions, result.CorrectAnswers, result.TakenAt));
    }
}