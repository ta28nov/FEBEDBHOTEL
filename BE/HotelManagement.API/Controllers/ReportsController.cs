using System.Security.Claims;
using HotelManagement.API.Models;
using HotelManagement.Application.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelManagement.Infrastructure.Data;

namespace HotelManagement.API.Controllers;

/// <summary>
/// Controller xử lý các API liên quan đến báo cáo
/// </summary>
[ApiController]
[Route("api/reports")]
[Authorize(Policy = "EmployeeAndAdmin")]
public class ReportsController : ControllerBase
{
    private readonly HotelDbContext _context;
    private readonly ILogger<ReportsController> _logger;

    public ReportsController(
        HotelDbContext context,
        ILogger<ReportsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// API lấy báo cáo doanh thu theo tháng
    /// </summary>
    /// <param name="year">Năm báo cáo</param>
    /// <returns>Báo cáo doanh thu</returns>
    [HttpGet("monthly-revenue")]
    public async Task<IActionResult> GetMonthlyRevenueReport([FromQuery] int? year)
    {
        // Nếu không có năm, lấy năm hiện tại
        if (!year.HasValue)
        {
            year = DateTime.UtcNow.Year;
        }
        
        // Sử dụng stored procedure để lấy báo cáo
        var result = await _context.Database
            .ExecuteSqlRawAsync($"EXEC GetMonthlyRevenueReport @Year = {year}");
            
        // Lấy kết quả từ stored procedure
        var report = await _context.Set<MonthlyRevenueReportDto>().ToListAsync();
        
        return Ok(report);
    }

    /// <summary>
    /// API lấy báo cáo công suất phòng
    /// </summary>
    /// <param name="startDate">Ngày bắt đầu</param>
    /// <param name="endDate">Ngày kết thúc</param>
    /// <returns>Báo cáo công suất</returns>
    [HttpGet("occupancy")]
    public async Task<IActionResult> GetOccupancyReport(
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate)
    {
        // Nếu không có ngày bắt đầu, lấy 30 ngày trước
        if (!startDate.HasValue)
        {
            startDate = DateTime.UtcNow.AddDays(-30);
        }
        
        // Nếu không có ngày kết thúc, lấy ngày hiện tại
        if (!endDate.HasValue)
        {
            endDate = DateTime.UtcNow;
        }
        
        // Sử dụng stored procedure để lấy báo cáo
        var result = await _context.Database
            .ExecuteSqlRawAsync($"EXEC GetOccupancyReport @StartDate = '{startDate:yyyy-MM-dd}', @EndDate = '{endDate:yyyy-MM-dd}'");
            
        // Lấy kết quả từ stored procedure
        var report = await _context.Set<OccupancyReportDto>().ToListAsync();
        
        return Ok(report);
    }
}
