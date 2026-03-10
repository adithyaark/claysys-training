using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Data;
using QuizAPI.Models;

namespace QuizAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CourseController : ControllerBase
{
    private readonly AppDbContext _db;
    public CourseController(AppDbContext db) => _db = db;

    // Get all courses.
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<CourseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        Console.WriteLine("CourseController: GetAll - Starting DB Query...");
        try 
        {
            var courses = await _db.Courses
                .Select(c => new CourseDto(c.Id, c.Title, c.Description))
                .ToListAsync();
            Console.WriteLine($"CourseController: GetAll - Found {courses.Count} courses");
            return Ok(courses);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"CourseController: GetAll - ERROR: {ex.Message}");
            return StatusCode(500, ex.Message);
        }
    }

    // Get a course by ID.
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(CourseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var c = await _db.Courses.FindAsync(id);
        if (c is null) return NotFound();
        return Ok(new CourseDto(c.Id, c.Title, c.Description));
    }

    // Create a new course. (Admin only)
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(CourseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Create([FromBody] CreateCourseDto dto)
    {
        var course = new Course { Title = dto.Title, Description = dto.Description };
        _db.Courses.Add(course);
        await _db.SaveChangesAsync();
        var result = new CourseDto(course.Id, course.Title, course.Description);
        return CreatedAtAction(nameof(GetById), new { id = course.Id }, result);
    }

    // Update an existing course. (Admin only)
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(CourseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] CreateCourseDto dto)
    {
        var course = await _db.Courses.FindAsync(id);
        if (course is null) return NotFound();

        course.Title = dto.Title;
        course.Description = dto.Description;
        await _db.SaveChangesAsync();
        return Ok(new CourseDto(course.Id, course.Title, course.Description));
    }

    // Delete a course. 
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var course = await _db.Courses.FindAsync(id);
        if (course is null) return NotFound();

        _db.Courses.Remove(course);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}