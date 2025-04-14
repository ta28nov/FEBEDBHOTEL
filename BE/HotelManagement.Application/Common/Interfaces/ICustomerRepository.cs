using HotelManagement.Domain.Entities;

namespace HotelManagement.Application.Common.Interfaces;

/// <summary>
/// Interface cho repository khách hàng
/// </summary>
public interface ICustomerRepository
{
    Task<IEnumerable<Customer>> GetAllAsync();
    Task<Customer?> GetByIdAsync(int id);
    Task<Customer?> GetByUserIdAsync(int userId);
    Task<Customer?> GetByEmailAsync(string email);
    Task<int> CreateAsync(Customer customer);
    Task UpdateAsync(Customer customer);
    Task DeleteAsync(int id);
    Task AddAddressAsync(CustomerAddress address);
    Task RemoveAddressAsync(int addressId);
}
