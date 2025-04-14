namespace HotelManagement.Application.Common.Models;

public class MonthlyRevenueReportDto
{
    public int Month { get; set; }
    public decimal Revenue { get; set; }
    public decimal Services { get; set; }
    public int BookingsCount { get; set; }
}
