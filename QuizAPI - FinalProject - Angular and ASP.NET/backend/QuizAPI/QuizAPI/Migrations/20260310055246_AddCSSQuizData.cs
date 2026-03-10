using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace QuizAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddCSSQuizData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Courses",
                columns: new[] { "Id", "CreatedAt", "Description", "Title" },
                values: new object[] { 3, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Styling the web with Cascading Style Sheets", "CSS" });

            migrationBuilder.InsertData(
                table: "Quizzes",
                columns: new[] { "Id", "CourseId", "CreatedAt", "Description", "TimeLimitMinutes", "Title" },
                values: new object[] { 3, 3, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Test your CSS styling skills", 10, "CSS Essentials Quiz" });

            migrationBuilder.InsertData(
                table: "Questions",
                columns: new[] { "Id", "CorrectAnswer", "OptionA", "OptionB", "OptionC", "OptionD", "Points", "QuizId", "Text" },
                values: new object[,]
                {
                    { 13, "C", "Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets", 1, 3, "What does CSS stand for?" },
                    { 14, "D", "<style>", "<css>", "<script>", "<link>", 1, 3, "Which HTML tag is used to link an external CSS file?" },
                    { 15, "B", "font-color", "color", "text-style", "background-color", 1, 3, "Which CSS property is used to change text color?" },
                    { 16, "C", "text-size", "font-style", "font-size", "text-style", 1, 3, "Which CSS property controls the text size?" },
                    { 17, "B", ".header", "#header", "header", "*header", 1, 3, "How do you select an element with id 'header' in CSS?" },
                    { 18, "B", "bgcolor", "background-color", "color", "background-style", 1, 3, "Which property is used to change the background color?" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Quizzes",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Courses",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
