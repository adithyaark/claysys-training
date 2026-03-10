using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace QuizAPI.Migrations
{
    /// <inheritdoc />
    public partial class RestoreJSQuestions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Ensure cleaning up any potential leftovers before inserting
            migrationBuilder.DeleteData(table: "Questions", keyColumn: "Id", keyValue: 1);
            migrationBuilder.DeleteData(table: "Questions", keyColumn: "Id", keyValue: 2);
            migrationBuilder.DeleteData(table: "Questions", keyColumn: "Id", keyValue: 3);
            migrationBuilder.DeleteData(table: "Questions", keyColumn: "Id", keyValue: 4);
            migrationBuilder.DeleteData(table: "Questions", keyColumn: "Id", keyValue: 5);
            migrationBuilder.DeleteData(table: "Questions", keyColumn: "Id", keyValue: 6);

            migrationBuilder.InsertData(
                table: "Questions",
                columns: new[] { "Id", "CorrectAnswer", "OptionA", "OptionB", "OptionC", "OptionD", "Points", "QuizId", "Text" },
                values: new object[,]
                {
                    { 1, "B", "var", "let", "def", "dim", 1, 1, "Which keyword declares a block-scoped variable in JavaScript?" },
                    { 2, "C", "Value only", "Type only", "Value and Type", "Reference", 1, 1, "What does '===' check in JavaScript?" },
                    { 3, "B", "JSON.stringify()", "JSON.parse()", "JSON.convert()", "JSON.decode()", 1, 1, "Which method converts a JSON string to a JavaScript object?" },
                    { 4, "C", "\"null\"", "\"undefined\"", "\"object\"", "\"boolean\"", 1, 1, "What is the output of: typeof null?" },
                    { 5, "C", "filter()", "find()", "map()", "reduce()", 1, 1, "Which array method returns a new array with transformed elements?" },
                    { 6, "B", "Makes it run on a separate thread", "Makes it return a Promise", "Makes it run faster", "Makes it synchronous", 1, 1, "What does the 'async' keyword do to a function?" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 6);
        }
    }
}
