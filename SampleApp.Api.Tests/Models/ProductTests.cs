using SampleApp.Api.Models;
using FluentAssertions;

namespace SampleApp.Api.Tests.Models;

public class ProductTests
{
    [Fact]
    public void Product_CanBeInitialized_WithDefaultValues()
    {
        // Act
        var product = new Product();

        // Assert
        product.Id.Should().Be(0);
        product.Name.Should().Be(string.Empty);
        product.Price.Should().Be(0);
        product.Description.Should().Be(string.Empty);
    }

    [Fact]
    public void Product_CanBeInitialized_WithSpecificValues()
    {
        // Arrange & Act
        var product = new Product
        {
            Id = 1,
            Name = "Test Product",
            Price = 29.99m,
            Description = "A test product description"
        };

        // Assert
        product.Id.Should().Be(1);
        product.Name.Should().Be("Test Product");
        product.Price.Should().Be(29.99m);
        product.Description.Should().Be("A test product description");
    }

    [Fact]
    public void Product_Properties_CanBeModified()
    {
        // Arrange
        var product = new Product();

        // Act
        product.Id = 42;
        product.Name = "Modified Product";
        product.Price = 199.99m;
        product.Description = "Modified description";

        // Assert
        product.Id.Should().Be(42);
        product.Name.Should().Be("Modified Product");
        product.Price.Should().Be(199.99m);
        product.Description.Should().Be("Modified description");
    }

    [Theory]
    [InlineData(0)]
    [InlineData(1)]
    [InlineData(100)]
    [InlineData(int.MaxValue)]
    public void Product_Id_AcceptsValidIntegers(int id)
    {
        // Arrange & Act
        var product = new Product { Id = id };

        // Assert
        product.Id.Should().Be(id);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(0.01)]
    [InlineData(99.99)]
    [InlineData(1000.50)]
    public void Product_Price_AcceptsValidDecimals(decimal price)
    {
        // Arrange & Act
        var product = new Product { Price = price };

        // Assert
        product.Price.Should().Be(price);
    }

    [Theory]
    [InlineData("")]
    [InlineData("A")]
    [InlineData("Test Product Name")]
    [InlineData("Very long product name with many characters")]
    public void Product_Name_AcceptsValidStrings(string name)
    {
        // Arrange & Act
        var product = new Product { Name = name };

        // Assert
        product.Name.Should().Be(name);
    }

    [Theory]
    [InlineData("")]
    [InlineData("Short description")]
    [InlineData("This is a very long product description that contains multiple sentences and provides detailed information about the product features and specifications.")]
    public void Product_Description_AcceptsValidStrings(string description)
    {
        // Arrange & Act
        var product = new Product { Description = description };

        // Assert
        product.Description.Should().Be(description);
    }
}