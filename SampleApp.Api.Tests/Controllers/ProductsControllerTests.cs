using Microsoft.AspNetCore.Mvc;
using SampleApp.Api.Controllers;
using SampleApp.Api.Models;
using FluentAssertions;

namespace SampleApp.Api.Tests.Controllers;

public class ProductsControllerTests
{
    private readonly ProductsController _controller;

    public ProductsControllerTests()
    {
        _controller = new ProductsController();
    }

    [Fact]
    public void GetProducts_ReturnsOkResult_WithListOfProducts()
    {
        // Act
        var result = _controller.GetProducts();

        // Assert
        result.Should().NotBeNull();
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var products = okResult.Value.Should().BeAssignableTo<IEnumerable<Product>>().Subject;
        products.Should().HaveCount(3);
    }

    [Fact]
    public void GetProducts_ReturnsCorrectProducts()
    {
        // Act
        var result = _controller.GetProducts();

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var products = okResult.Value.Should().BeAssignableTo<IEnumerable<Product>>().Subject.ToList();
        
        products[0].Name.Should().Be("Laptop");
        products[0].Price.Should().Be(999.99m);
        products[0].Description.Should().Be("High-performance laptop");

        products[1].Name.Should().Be("Mouse");
        products[1].Price.Should().Be(29.99m);
        products[1].Description.Should().Be("Wireless optical mouse");

        products[2].Name.Should().Be("Keyboard");
        products[2].Price.Should().Be(79.99m);
        products[2].Description.Should().Be("Mechanical gaming keyboard");
    }

    [Fact]
    public void GetProduct_WithValidId_ReturnsOkResult_WithProduct()
    {
        // Arrange
        var productId = 1;

        // Act
        var result = _controller.GetProduct(productId);

        // Assert
        result.Should().NotBeNull();
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var product = okResult.Value.Should().BeOfType<Product>().Subject;
        product.Id.Should().Be(productId);
        product.Name.Should().Be("Laptop");
        product.Price.Should().Be(999.99m);
        product.Description.Should().Be("High-performance laptop");
    }

    [Fact]
    public void GetProduct_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var invalidId = 999;

        // Act
        var result = _controller.GetProduct(invalidId);

        // Assert
        result.Result.Should().BeOfType<NotFoundResult>();
    }

    [Theory]
    [InlineData(1)]
    [InlineData(2)]
    [InlineData(3)]
    public void GetProduct_WithExistingIds_ReturnsCorrectProduct(int productId)
    {
        // Act
        var result = _controller.GetProduct(productId);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var product = okResult.Value.Should().BeOfType<Product>().Subject;
        product.Id.Should().Be(productId);
        product.Name.Should().NotBeNullOrEmpty();
        product.Description.Should().NotBeNullOrEmpty();
        product.Price.Should().BeGreaterThan(0);
    }

    [Fact]
    public void CreateProduct_WithValidProduct_ReturnsCreatedAtActionResult()
    {
        // Arrange
        var newProduct = new Product
        {
            Name = "Test Product",
            Price = 19.99m,
            Description = "A test product"
        };

        // Act
        var result = _controller.CreateProduct(newProduct);

        // Assert
        result.Should().NotBeNull();
        var createdResult = result.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
        createdResult.ActionName.Should().Be(nameof(ProductsController.GetProduct));
        
        var createdProduct = createdResult.Value.Should().BeOfType<Product>().Subject;
        createdProduct.Id.Should().Be(4); // Should be next available ID
        createdProduct.Name.Should().Be("Test Product");
        createdProduct.Price.Should().Be(19.99m);
        createdProduct.Description.Should().Be("A test product");
    }

    [Fact]
    public void CreateProduct_AssignsCorrectId_WhenMultipleProductsCreated()
    {
        // Arrange
        var firstProduct = new Product { Name = "Product 1", Price = 10m, Description = "First" };
        var secondProduct = new Product { Name = "Product 2", Price = 20m, Description = "Second" };

        // Act
        var firstResult = _controller.CreateProduct(firstProduct);
        var secondResult = _controller.CreateProduct(secondProduct);

        // Assert
        var firstCreated = ((CreatedAtActionResult)firstResult.Result!).Value.Should().BeOfType<Product>().Subject;
        var secondCreated = ((CreatedAtActionResult)secondResult.Result!).Value.Should().BeOfType<Product>().Subject;
        
        firstCreated.Id.Should().Be(4);
        secondCreated.Id.Should().Be(5);
    }

    [Fact]
    public void CreateProduct_AddsProductToList()
    {
        // Arrange
        var newProduct = new Product
        {
            Name = "New Product",
            Price = 99.99m,
            Description = "A brand new product"
        };

        // Act
        _controller.CreateProduct(newProduct);
        var getResult = _controller.GetProducts();

        // Assert
        var okResult = getResult.Result.Should().BeOfType<OkObjectResult>().Subject;
        var products = okResult.Value.Should().BeAssignableTo<IEnumerable<Product>>().Subject;
        products.Should().HaveCount(4); // Original 3 + 1 new
        products.Should().Contain(p => p.Name == "New Product");
    }
}