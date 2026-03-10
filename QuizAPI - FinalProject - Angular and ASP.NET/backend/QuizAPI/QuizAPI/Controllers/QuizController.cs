using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models;

namespace QuizAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class QuizController : ControllerBase
{
    private readonly AppDbContext _db;
    public QuizController(AppDbContext db) => _db = db;

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<QuizDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var quizzes = await _db.Quizzes
            .Include(q => q.Course)
            .Include(q => q.Questions)
            .Select(q => new QuizDto(
                q.Id, q.Title, q.Description,
                q.CourseId, q.Course!.Title,
                q.TimeLimitMinutes,
                q.Questions.Count))
            .ToListAsync();
        return Ok(quizzes);
    }

    // Get all results for leaderboard. (Admin only)
    [HttpGet("results")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(IEnumerable<ResultDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllResults()
    {
        var results = await _db.Results
            .Include(r => r.User)
            .Include(r => r.Quiz)
                .ThenInclude(q => q!.Course)
            .OrderByDescending(r => r.TakenAt)
            .Select(r => new ResultDto(
                r.Id, r.User!.Username, r.QuizId, r.Quiz!.Title, r.Quiz.Course!.Title,
                r.Score, r.TotalQuestions, r.CorrectAnswers,
                r.TakenAt))
            .ToListAsync();
        return Ok(results);
    }

    //Get a quiz by ID.
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(QuizDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var q = await _db.Quizzes
            .Include(x => x.Course)
            .Include(x => x.Questions)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (q is null) return NotFound();

        return Ok(new QuizDto(q.Id, q.Title, q.Description,
            q.CourseId, q.Course!.Title, q.TimeLimitMinutes, q.Questions.Count));
    }

    // Get all quizzes for a specific course.
    [HttpGet("by-course/{courseId}")]
    [ProducesResponseType(typeof(IEnumerable<QuizDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByCourse(int courseId)
    {
        var quizzes = await _db.Quizzes
            .Include(q => q.Course)
            .Include(q => q.Questions)
            .Where(q => q.CourseId == courseId)
            .Select(q => new QuizDto(
                q.Id, q.Title, q.Description,
                q.CourseId, q.Course!.Title,
                q.TimeLimitMinutes, q.Questions.Count))
            .ToListAsync();
        return Ok(quizzes);
    }

    // Create a new quiz. (Admin only)
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(QuizDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateQuizDto dto)
    {
        if (!await _db.Courses.AnyAsync(c => c.Id == dto.CourseId))
            return BadRequest(new { message = "Course not found." });

        var quiz = new Quiz
        {
            Title = dto.Title,
            Description = dto.Description,
            CourseId = dto.CourseId,
            TimeLimitMinutes = dto.TimeLimitMinutes
        };

        _db.Quizzes.Add(quiz);
        await _db.SaveChangesAsync();

        await _db.Entry(quiz).Reference(q => q.Course).LoadAsync();
        return CreatedAtAction(nameof(GetById), new { id = quiz.Id },
            new QuizDto(quiz.Id, quiz.Title, quiz.Description,
                quiz.CourseId, quiz.Course!.Title, quiz.TimeLimitMinutes, 0));
    }

    /// <summary>Update a quiz. (Admin only)</summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(QuizDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] CreateQuizDto dto)
    {
        var quiz = await _db.Quizzes.Include(q => q.Course).Include(q => q.Questions)
                            .FirstOrDefaultAsync(q => q.Id == id);
        if (quiz is null) return NotFound();

        quiz.Title = dto.Title;
        quiz.Description = dto.Description;
        quiz.CourseId = dto.CourseId;
        quiz.TimeLimitMinutes = dto.TimeLimitMinutes;

        await _db.SaveChangesAsync();
        await _db.Entry(quiz).Reference(q => q.Course).LoadAsync();

        return Ok(new QuizDto(quiz.Id, quiz.Title, quiz.Description,
            quiz.CourseId, quiz.Course!.Title, quiz.TimeLimitMinutes, quiz.Questions.Count));
    }

    //Delete a quiz. (Admin only)
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var quiz = await _db.Quizzes.FindAsync(id);
        if (quiz is null) return NotFound();

        _db.Quizzes.Remove(quiz);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}