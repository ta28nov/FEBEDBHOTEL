using HotelManagement.Application.Common.Interfaces;
using HotelManagement.Domain.Entities;
using HotelManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Infrastructure.Repositories;

/// <summary>
/// Repository xử lý các thao tác với khách hàng
/// </summary>
public class CustomerRepository : ICustomerRepository
{
    private readonly HotelDbContext _context;

    public CustomerRepository(HotelDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Lấy tất cả khách hàng
    /// </summary>
    public async Task<IEnumerable<Customer>> GetAllAsync()
    {
        return await _context.Customers
            .Include(c => c.User)
            .Include(c => c.Addresses)
            .ToListAsync();
    }

    /// <summary>
    /// Lấy khách hàng theo ID
    /// </summary>
    public async Task<Customer?> GetByIdAsync(int id)
    {
        return await _context.Customers
            .Include(c => c.User)
            .Include(c => c.Addresses)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    /// <summary>
    /// Lấy khách hàng theo ID người dùng
    /// </summary>
    public async Task<Customer?> GetByUserIdAsync(int userId)
    {
        return await _context.Customers
            .Include(c => c.User)
            .Include(c => c.Addresses)
            .FirstOrDefaultAsync(c => c.UserId == userId);
    }

    /// <summary>
    /// Lấy khách hàng theo email
    /// </summary>
    public async Task<Customer?> GetByEmailAsync(string email)
    {
        return await _context.Customers
            .Include(c => c.User)
            .Include(c => c.Addresses)
            .FirstOrDefaultAsync(c => c.Email == email);
    }

    /// <summary>
    /// Tạo khách hàng mới
    /// </summary>
    public async Task<int> CreateAsync(Customer customer)
    {
        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();
        return customer.Id;
    }

    /// <summary>
    /// Cập nhật khách hàng
    /// </summary>
    public async Task UpdateAsync(Customer customer)
    {
        _context.Customers.Update(customer);
        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Xóa khách hàng
    /// </summary>
    public async Task DeleteAsync(int id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer != null)
        {
            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();
        }
    }

    /// <summary>
    /// Thêm địa chỉ cho khách hàng
    /// </summary>
    public async Task AddAddressAsync(CustomerAddress address)
    {
        _context.CustomerAddresses.Add(address);
        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Xóa địa chỉ của khách hàng
    /// </summary>
    public async Task RemoveAddressAsync(int addressId)
    {
        var address = await _context.CustomerAddresses.FindAsync(addressId);
        if (address != null)
        {
            _context.CustomerAddresses.Remove(address);
            await _context.SaveChangesAsync();
        }
    }
}
