namespace HotelManagement.API.Models;

/// <summary>
/// Mô hình dữ liệu cho báo cáo doanh thu theo tháng
/// </summary>
public class MonthlyRevenueReportDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal RoomRevenue { get; set; }
    public decimal ServiceRevenue { get; set; }
    public int TotalBookings { get; set; }
    public int CheckedInBookings { get; set; }
    public int CancelledBookings { get; set; }
}

/// <summary>
/// Mô hình dữ liệu cho báo cáo tỉ lệ lấp đầy phòng
/// </summary>
public class OccupancyReportDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public decimal OccupancyRate { get; set; } // Tỉ lệ phần trăm
    public int TotalRooms { get; set; }
    public int OccupiedRoomDays { get; set; }
    public int AvailableRoomDays { get; set; }
    public List<RoomTypeOccupancyDto> RoomTypeBreakdown { get; set; } = new List<RoomTypeOccupancyDto>();
}

/// <summary>
/// Mô hình dữ liệu cho tỉ lệ lấp đầy theo loại phòng
/// </summary>
public class RoomTypeOccupancyDto
{
    public int RoomTypeId { get; set; }
    public string RoomTypeName { get; set; } = string.Empty;
    public decimal OccupancyRate { get; set; } // Tỉ lệ phần trăm
    public int TotalRooms { get; set; }
    public int OccupiedRoomDays { get; set; }
    public int AvailableRoomDays { get; set; }
} 