﻿using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WhaleSpotting.Controllers;
using WhaleSpotting.Models.Enums;
using WhaleSpotting.Models.RequestModels;
using WhaleSpotting.Models.ResponseModels;
using WhaleSpotting.Services;
using Xunit;

namespace WhaleSpotting.UnitTests.Controllers
{
    public class SightingsControllerTests
    {
        private readonly ISightingsService _sightings = A.Fake<ISightingsService>();
        private readonly SightingsController _underTest;

        public SightingsControllerTests()
        {
            _underTest = new SightingsController(_sightings);
        }

        [Fact]
        public async Task GetInfo_Called_ReturnsSightings()
        {
            // Arrange
            var serviceResponse = new List<SightingResponseModel>
            {
                new SightingResponseModel(),
                new SightingResponseModel()
            };

            A.CallTo(() => _sightings.GetSightings())
                .Returns(serviceResponse);

            // Act
            var result = await _underTest.GetInfo();

            // Assert
            result.Should().HaveCount(2);
        }

        [Fact]
        public void CreateSighting_CalledWithNewSighting_ReturnsCreatedResult()
        {
            // Arrange
            var newSighting = new SightingRequestModel
            {
                Species = Species.AtlanticWhiteSidedDolphin,
                Quantity = 2,
                Description = "was nice",
                Longitude = -100.010,
                Latitude = -22.010,
                Location = "atlantic ocean",
                SightedAt = DateTime.Now,
                OrcaType = null,
                OrcaPod = "",
                UserId = 5,
            };

            var sightingResponse = new SightingResponseModel
            {
                Id = 1,
                SightedAt = DateTime.Now,
                Species = "AtlanticWhiteSidedDolphin",
                Quantity = 2,
                Location = "atlantic ocean",
                Longitude = -100.010,
                Latitude = -22.010,
                Description = "was nice",
                OrcaType = "",
                OrcaPod = "",
                UserId = 5,
                Username = "FakeUser",
                Confirmed = false,
            };

            A.CallTo(() => _sightings.CreateSighting(newSighting))
                .Returns(sightingResponse);

            // Act
            var response = _underTest.CreateSighting(newSighting);

            // Assert
            var createdResult = response.Should().BeOfType<CreatedResult>().Subject;
            createdResult.Location.Should().Contain(sightingResponse.Id.ToString());
            createdResult.Value.Should().Be(sightingResponse);
        }

        [Fact]
        public void CreateSighting_CalledWithInvalidNewSighting_ReturnsValidationError()
        {
            // Arrange
            var newSighting = new SightingRequestModel
            {
                Species = Species.AtlanticWhiteSidedDolphin,
                Quantity = 2,
                Description = "was nice",
                Longitude = -100.010,
                Latitude = -22.010,
                Location = "atlantic ocean",
                SightedAt = DateTime.Now.AddDays(1),
                OrcaType = null,
                OrcaPod = "",
                UserId = 5,
            };

            const string exceptionMessage = "Sighted At must be in the past";

            A.CallTo(() => _sightings.CreateSighting(newSighting))
                .Throws(new Exception(exceptionMessage));

            // Act
            var response = _underTest.CreateSighting(newSighting);

            // Assert
            var validationErrorResult = response.Should().BeOfType<ObjectResult>().Subject;
            var validationProblemDetails = validationErrorResult.Value.Should().BeOfType<ValidationProblemDetails>().Subject;
            var errorMessage = validationProblemDetails.Errors["Thrown Error"][0];
            errorMessage.Should().Be("Sighted At must be in the past");
        }

        [Fact]
        public async void ConfirmSighting_CalledWithId_ReturnsSighting()
        {
            // Arrange
            const int id = 1;

            var sightingResponse = new SightingResponseModel
            {
                Id = 1,
                SightedAt = DateTime.Now,
                Species = "AtlanticWhiteSidedDolphin",
                Quantity = 2,
                Location = "atlantic ocean",
                Longitude = -100.010,
                Latitude = -22.010,
                Description = "was nice",
                OrcaType = "",
                OrcaPod = "",
                UserId = 5,
                Username = "FakeUser",
                Confirmed = true,
            };

            A.CallTo(() => _sightings.ConfirmSighting(id))
                .Returns(sightingResponse);

            // Act
            var result = await _underTest.ConfirmSighting(id);

            // Assert
            result.Should().BeOfType<ActionResult<SightingResponseModel>>();
        }

        [Fact]
        public async void ConfirmSighting_CalledWithInvalidId_ReturnsNotFound()
        {
            // Arrange
            const int id = 1;

            A.CallTo(() => _sightings.ConfirmSighting(id))
                .Returns<SightingResponseModel>(null);
                
            // Act
            var result = await _underTest.ConfirmSighting(id);

            // Assert
            result.Result.Should().BeOfType<NotFoundResult>();
        }
    }
}