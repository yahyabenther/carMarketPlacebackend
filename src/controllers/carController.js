const carService = require('../services/car.services');
const imageModel = require('../models/image.model');

exports.getAllCars = async (req, res) => {
  try {
    const { search, brand, fuel, transmission, minPrice, maxPrice, location, page, limit } = req.query;
    
    console.log('🚗 getAllCars controller called with query:', req.query);
    
    let result;
    
    if (search) {
      result = await carService.searchCars(search);
    } else if (brand || fuel || transmission || minPrice || maxPrice || location) {
      // Pass pagination params along with filters
      result = await carService.filterCars({
        brand,
        fuel,
        transmission,
        minPrice,
        maxPrice,
        location,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 9
      });
    } else {
      // Pass pagination params to getAllCars
      result = await carService.getAllCars({
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 9
      });
    }
    
    console.log('✅ Returning result with', result.data?.cars?.length || 0, 'cars');
    res.json(result);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ success: false, message: 'Error fetching cars' });
  }
};

exports.getImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    console.log('🖼️ Fetching image with ID:', imageId);

    const image = await imageModel.findById(imageId);

    if (!image) {
      console.log('❌ Image not found:', imageId);
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    console.log('✅ Image found:', image.originalName);

    let imageBuffer = image.image_data;

    if (!imageBuffer) {
      console.log('❌ Image buffer is empty');
      return res.status(400).json({ success: false, message: 'Image data not available' });
    }

    // Ensure it's a Buffer
    if (!Buffer.isBuffer(imageBuffer)) {
      console.log('Converting to buffer...');
      if (typeof imageBuffer === 'string') {
        imageBuffer = Buffer.from(imageBuffer, 'binary');
      } else {
        imageBuffer = Buffer.from(imageBuffer);
      }
    }

    const mimeType = image.mimeType || 'image/jpeg';
    
    res.removeHeader('Content-Type');
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', imageBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.status(200);
    
    console.log('📤 Sending image:', image.originalName, 'Size:', imageBuffer.length, 'MIME:', mimeType);
    
    return res.end(imageBuffer);
    
  } catch (error) {
    console.error('❌ Error serving image:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to serve image', 
      error: error.message 
    });
  }
};

exports.getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await carService.getCarById(id);
    
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    
    res.json({ success: true, data: car });
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ success: false, message: 'Error fetching car' });
  }
};

exports.getCarsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('📍 Fetching cars for user:', userId);
    
    if (!userId || userId.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    const cars = await carService.findCarsByOwnerId(userId);
    
    console.log('✅ Found', cars.length, 'cars for user:', userId);
    
    res.json({
      success: true,
      cars: cars || [],
      count: cars?.length || 0
    });
  } catch (error) {
    console.error('❌ Error fetching user cars:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user cars'
    });
  }
};

exports.createCar = async (req, res) => {
  try {
    const { title, brand, model, year, price, mileage, fuel, transmission, location } = req.body;
    const user_id = req.user.id;
    
    console.log('📍 Creating car with:', { brand, model, price });
    console.log('📸 Files received:', req.files?.length || 0);
    
    if (!brand || !model || !price) {
      return res.status(400).json({ success: false, message: 'Brand, Model, and Price are required' });
    }
    
    const result = await carService.addCar({
      title: title || `${year} ${brand} ${model}`,
      brand,
      model,
      year,
      price,
      mileage,
      fuel,
      transmission,
      location,
      user_id
    });

    console.log('✅ Car created with ID:', result.data.id);
    
    if (req.files && req.files.length > 0) {
      console.log('📸 Uploading', req.files.length, 'images...');
      
      for (const file of req.files) {
        try {
          await imageModel.create({
            car_id: result.data.id,
            image_data: file.buffer,
            originalName: file.originalname,
            mimeType: file.mimetype,
            fileSize: file.size
          });
          console.log('✅ Image uploaded:', file.originalname);
        } catch (imgError) {
          console.error('❌ Error uploading image:', imgError);
        }
      }
    }
    
    res.status(201).json({
      success: true,
      message: 'Car listing created successfully',
      data: result.data
    });
  } catch (error) {
    console.error('❌ Error creating car:', error);
    res.status(500).json({ success: false, message: error.message || 'Error creating car listing' });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, brand, model, year, price, mileage, fuel, transmission, location } = req.body;
    
    console.log('📍 Updating car:', id);
    console.log('📸 Files received:', req.files?.length || 0);
    
    const car = await carService.getCarById(id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    
    if (car.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this car' });
    }
    
    const result = await carService.updateCar(id, {
      title: title || `${year} ${brand} ${model}`,
      brand,
      model,
      year,
      price,
      mileage,
      fuel,
      transmission,
      location
    });

    console.log('✅ Car updated');
    
    if (req.files && req.files.length > 0) {
      console.log('📸 Deleting old images and uploading', req.files.length, 'new images...');
      
      await imageModel.deleteByCarId(id);
      
      for (const file of req.files) {
        try {
          await imageModel.create({
            car_id: id,
            image_data: file.buffer,
            originalName: file.originalname,
            mimeType: file.mimetype,
            fileSize: file.size
          });
          console.log('✅ Image uploaded:', file.originalname);
        } catch (imgError) {
          console.error('❌ Error uploading image:', imgError);
        }
      }
    }
    
    res.json({
      success: true,
      message: 'Car listing updated successfully',
      data: result.data
    });
  } catch (error) {
    console.error('❌ Error updating car:', error);
    res.status(500).json({ success: false, message: error.message || 'Error updating car listing' });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    
    const car = await carService.getCarById(id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    
    // Admins can delete any car, regular users can only delete their own
    if (req.user.role !== 'admin' && car.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this car' });
    }
    
    const result = await carService.deleteCar(id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ success: false, message: error.message || 'Error deleting car listing' });
  }
};

exports.updateCarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await carService.updateCarStatus(id, status);
    res.json(result);
  } catch (error) {
    console.error('Error updating car status:', error);
    res.status(500).json({ success: false, message: error.message || 'Error updating status' });
  }
};

exports.searchCars = async (req, res) => {
  try {
    const { q } = req.query;
    const result = await carService.searchCars(q);
    res.json(result);
  } catch (error) {
    console.error('Error searching cars:', error);
    res.status(500).json({ success: false, message: 'Error searching cars' });
  }
};

exports.filterCars = async (req, res) => {
  try {
    const result = await carService.filterCars(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error filtering cars:', error);
    res.status(500).json({ success: false, message: 'Error filtering cars' });
  }
};