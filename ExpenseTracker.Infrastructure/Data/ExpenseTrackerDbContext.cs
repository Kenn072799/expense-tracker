using ExpenseTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Infrastructure.Data;

public class ExpenseTrackerDbContext : DbContext
{
    public ExpenseTrackerDbContext(
        DbContextOptions<ExpenseTrackerDbContext> options)
        : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Expense> Expenses { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Budget> Budgets { get; set; }
    public DbSet<RecurringExpense> RecurringExpenses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");

            entity.HasKey(x => x.UserId);

            entity.Property(x => x.FirstName)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(x => x.LastName)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(x => x.Email)
                .HasMaxLength(100)
                .IsRequired();

            entity.HasIndex(x => x.Email)
                .IsUnique();

            entity.Property(x => x.PasswordHash)
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(x => x.CreatedAt)
                .HasDefaultValueSql("SYSDATETIME()");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("Category");

            entity.HasKey(x => x.CategoryId);

            entity.Property(x => x.Name)
                .HasMaxLength(100)
                .IsRequired();

            entity.HasIndex(x => x.Name)
                .IsUnique();

            entity.Property(x => x.IsActive)
                .HasDefaultValue(true);
        });

        modelBuilder.Entity<Expense>(entity =>
        {
            entity.ToTable("Expense");

            entity.HasKey(x => x.ExpenseId);

            entity.Property(x => x.Amount)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            entity.Property(x => x.Description)
                .HasMaxLength(255);

            entity.Property(x => x.ExpenseDate)
                .HasDefaultValueSql("SYSDATETIME()");

            entity.Property(x => x.CreatedAt)
                .HasDefaultValueSql("SYSDATETIME()");

            entity.Property(x => x.UpdatedAt)
                .HasDefaultValueSql("SYSDATETIME()");

            entity.HasOne(x => x.User)
                .WithMany(x => x.Expenses)
                .HasForeignKey(x => x.UserId);

            entity.HasOne(x => x.Category)
                .WithMany(x => x.Expenses)
                .HasForeignKey(x => x.CategoryId);

            entity.HasOne(x => x.RecurringExpense)
                .WithMany()
                .HasForeignKey(x => x.RecurringExpenseId);

            entity.HasIndex(x => new
            {
                x.RecurringExpenseId,
                x.RecurringOccurrenceDate
            })
            .IsUnique()
            .HasFilter(
                "[RecurringExpenseId] IS NOT NULL AND [RecurringOccurrenceDate] IS NOT NULL");
        });

        modelBuilder.Entity<Budget>(entity =>
        {
            entity.ToTable("Budget");

            entity.HasKey(x => x.BudgetId);

            entity.Property(x => x.Amount)
                .HasColumnType("decimal(18,2)");

            entity.Property(x => x.CreatedAt)
                .HasDefaultValueSql("SYSDATETIME()");

            entity.Property(x => x.UpdatedAt)
                .HasDefaultValueSql("SYSDATETIME()");

            entity.HasOne(x => x.User)
                .WithMany(x => x.Budgets)
                .HasForeignKey(x => x.UserId);

            entity.HasOne(x => x.Category)
                .WithMany(x => x.Budgets)
                .HasForeignKey(x => x.CategoryId);

            entity.HasIndex(x => new
            {
                x.UserId,
                x.CategoryId,
                x.Month,
                x.Year
            })
            .IsUnique();
        });

        modelBuilder.Entity<RecurringExpense>(entity =>
        {
            entity.ToTable("RecurringExpense");

            entity.HasKey(x => x.RecurringExpenseId);

            entity.Property(x => x.Amount)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            entity.Property(x => x.Description)
                .HasMaxLength(255);

            entity.Property(x => x.Frequency)
                .HasMaxLength(20)
                .IsRequired();

            entity.Property(x => x.StartDate)
                .IsRequired();

            entity.Property(x => x.NextRunDate)
                .IsRequired();

            entity.Property(x => x.IsActive)
                .HasDefaultValue(true);

            entity.Property(x => x.CreatedAt)
                .HasDefaultValueSql("SYSDATETIME()");

            entity.Property(x => x.UpdatedAt)
                .HasDefaultValueSql("SYSDATETIME()");

            entity.HasOne(x => x.User)
                .WithMany(x => x.RecurringExpenses)
                .HasForeignKey(x => x.UserId);

            entity.HasOne(x => x.Category)
                .WithMany(x => x.RecurringExpenses)
                .HasForeignKey(x => x.CategoryId);
        });

    }
}