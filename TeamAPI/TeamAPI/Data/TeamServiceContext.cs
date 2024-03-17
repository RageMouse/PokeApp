using Microsoft.EntityFrameworkCore;
using TeamAPI.Models;

namespace TeamAPI.Data;

public class TeamServiceContext : DbContext
{
    public TeamServiceContext(DbContextOptions<TeamServiceContext> options) : base(options)
    {
        
    }

    public DbSet<Team> Team { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Team>().HasQueryFilter(f => !f.IsDeleted);
    }
}
