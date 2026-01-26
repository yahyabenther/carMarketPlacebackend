// car.service.js

const car = require('../models/car.model');
const imageModel = require('../models/image.model');

// FIX: Add pagination and filtering support
exports.getAllCars = async (filters = {}) => {
  try {
    console.log('🚗 getAllCars backend service called with filters:', filters);
    
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 12;
    const offset = (page - 1) * limit;

    console.log(`📄 Page: ${page}, Limit: ${limit}, Offset: ${offset}`);

    // Extract pagination params before passing to filter
    const filterParams = { ...filters };
    delete filterParams.page;
    delete filterParams.limit;

    // Get total count
    const allCars = await car.findAll();
    const total = allCars.length;

    console.log(`📊 Total cars in database: ${total}`);

    // Get paginated results with filters
    let results = allCars;

    // Apply filters if provided
    if (Object.keys(filterParams).length > 0) {
      console.log('🔍 Applying filters:', filterParams);
      results = results.filter(c => {
        return Object.entries(filterParams).every(([key, value]) => {
          if (!value) return true;
          const carValue = String(c[key] || '').toLowerCase();
          const filterValue = String(value).toLowerCase();
          return carValue.includes(filterValue);
        });
      });
      console.log(`✅ After filtering: ${results.length} cars`);
    }

    // Apply pagination
    const paginatedResults = results.slice(offset, offset + limit);

    console.log(`✅ Returning ${paginatedResults.length} cars for page ${page}`);

    return {
      success: true,
      data: {
        cars: paginatedResults,
        total: results.length,
        page,
        limit,
        totalPages: Math.ceil(results.length / limit)
      }
    };
  } catch (error) {
    console.error('Error in getAllCars service:', error);
    throw error;
  }
};

exports.getCarById = async (carId) => {
  return await car.findById(carId);
};

exports.addCar = async (carData) => {
  try {
    if (!carData.brand || !carData.model || !carData.price) {
      throw new Error('Brand, Model, and Price are required');
    }

    console.log('Adding car with data:', carData);
    const carId = await car.create(carData);
    console.log('Car created with ID:', carId);
    
    const newCar = await car.findById(carId);
    
    return {
      success: true,
      data: newCar,
      message: 'Car listing created successfully'
    };
  } catch (error) {
    throw error;
  }
};

exports.updateCar = async (carId, carData) => {
  try {
    if (!carId) {
      throw new Error('Car ID is required');
    }

    const existingCar = await car.findById(carId);
    if (!existingCar) {
      throw new Error('Car not found');
    }

    await car.update(carId, carData);
    const updatedCar = await car.findById(carId);
    
    return {
      success: true,
      data: updatedCar,
      message: 'Car listing updated successfully'
    };
  } catch (error) {
    throw error;
  }
};

exports.deleteCar = async (carId) => {
  try {
    if (!carId) {
      throw new Error('Car ID is required');
    }

    const existingCar = await car.findById(carId);
    if (!existingCar) {
      throw new Error('Car not found');
    }

    await car.delete(carId);
    
    return {
      success: true,
      message: 'Car listing deleted successfully'
    };
  } catch (error) {
    console.error('Error in deleteCar service:', error);
    throw error;
  }
};

exports.updateCarStatus = async (carId, status) => {
  try {
    if (!carId) {
      throw new Error('Car ID is required');
    }

    const validStatuses = ['available', 'sold', 'pending'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    await car.updateStatus(carId, status);
    const updatedCar = await car.findById(carId);
    
    return {
      success: true,
      data: updatedCar,
      message: 'Car status updated successfully'
    };
  } catch (error) {
    console.error('Error in updateCarStatus service:', error);
    throw error;
  }
};

exports.findCarsByOwnerId = async (ownerId) => {
  try {
    if (!ownerId) {
      throw new Error('Owner ID is required');
    }
    
    const ownerIdNum = parseInt(ownerId, 10);
    if (isNaN(ownerIdNum)) {
      throw new Error('Invalid owner ID format');
    }

    const cars = await car.findByOwnerId(ownerIdNum);
    return cars || [];
    
  } catch (error) {
    console.error('Error in findCarsByOwnerId service:', error);
    throw error;
  }
};

exports.searchCars = async (query, filters = {}) => {
  try {
    if (!query || query.trim() === '') {
      throw new Error('Search query is required');
    }

    const results = await car.search(query);
    
    return {
      success: true,
      data: {
        cars: results || [],
        count: results ? results.length : 0
      }
    };
  } catch (error) {
    console.error('Error in searchCars service:', error);
    throw error;
  }
};

exports.filterCars = async (filters) => {
  try {
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 9;
    const offset = (page - 1) * limit;

    // Extract pagination params
    const filterParams = { ...filters };
    delete filterParams.page;
    delete filterParams.limit;

    // Get all cars first
    const allCars = await car.findAll();

    // Apply filters
    let results = allCars;
    if (Object.keys(filterParams).length > 0) {
      results = results.filter(c => {
        return Object.entries(filterParams).every(([key, value]) => {
          if (!value) return true;
          const carValue = String(c[key] || '').toLowerCase();
          const filterValue = String(value).toLowerCase();
          return carValue.includes(filterValue);
        });
      });
    }

    // Apply pagination
    const paginatedResults = results.slice(offset, offset + limit);

    console.log(`✅ Filtered: ${paginatedResults.length} cars from ${results.length} total on page ${page}`);

    return {
      success: true,
      data: {
        cars: paginatedResults,
        total: results.length,
        page,
        limit,
        totalPages: Math.ceil(results.length / limit)
      }
    };
  } catch (error) {
    console.error('Error in filterCars service:', error);
    throw error;
  }
};

// Image-related services
exports.getCarImages = async (carId) => {
  try {
    if (!carId) {
      throw new Error('Car ID is required');
    }

    const images = await imageModel.findByCarId(carId);
    
    return {
      success: true,
      data: {
        images: images || [],
        count: images ? images.length : 0
      }
    };
  } catch (error) {
    console.error('Error in getCarImages service:', error);
    throw error;
  }
};

exports.addCarImage = async (carId, imageData) => {
  try {
    if (!carId) {
      throw new Error('Car ID is required');
    }

    const existingCar = await car.findById(carId);
    if (!existingCar) {
      throw new Error('Car not found');
    }

    if (!imageData.url) {
      throw new Error('Image URL is required');
    }

    const imageId = await imageModel.create({
      car_id: carId,
      url: imageData.url,
      alt_text: imageData.alt_text || ''
    });

    const newImage = await imageModel.findById(imageId);
    
    return {
      success: true,
      data: newImage,
      message: 'Image added successfully'
    };
  } catch (error) {
    console.error('Error in addCarImage service:', error);
    throw error;
  }
};

exports.updateCarImage = async (imageId, imageData) => {
  try {
    if (!imageId) {
      throw new Error('Image ID is required');
    }

    const existingImage = await imageModel.findById(imageId);
    if (!existingImage) {
      throw new Error('Image not found');
    }

    await imageModel.update(imageId, {
      url: imageData.url || existingImage.url,
      alt_text: imageData.alt_text || existingImage.alt_text
    });

    const updatedImage = await imageModel.findById(imageId);
    
    return {
      success: true,
      data: updatedImage,
      message: 'Image updated successfully'
    };
  } catch (error) {
    console.error('Error in updateCarImage service:', error);
    throw error;
  }
};

exports.deleteCarImage = async (imageId) => {
  try {
    if (!imageId) {
      throw new Error('Image ID is required');
    }

    const existingImage = await imageModel.findById(imageId);
    if (!existingImage) {
      throw new Error('Image not found');
    }

    await imageModel.deleteById(imageId);
    
    return {
      success: true,
      message: 'Image deleted successfully'
    };
  } catch (error) {
    console.error('Error in deleteCarImage service:', error);
    throw error;
  }
};

exports.deleteCarImages = async (carId) => {
  try {
    if (!carId) {
      throw new Error('Car ID is required');
    }

    const existingCar = await car.findById(carId);
    if (!existingCar) {
      throw new Error('Car not found');
    }

    await imageModel.deleteByCarId(carId);
    
    return {
      success: true,
      message: 'All car images deleted successfully'
    };
  } catch (error) {
    console.error('Error in deleteCarImages service:', error);
    throw error;
  }
};

exports.getCarWithStats = async (carId) => {
  try {
    if (!carId) {
      throw new Error('Car ID is required');
    }

    const carData = await car.findById(carId);
    if (!carData) {
      throw new Error('Car not found');
    }

    const imageCount = await imageModel.countByCarId(carId);
    
    return {
      success: true,
      data: {
        ...carData,
        imageCount
      }
    };
  } catch (error) {
    console.error('Error in getCarWithStats service:', error);
    throw error;
  }
};