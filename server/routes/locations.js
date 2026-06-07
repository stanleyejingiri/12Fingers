//server/routes/locations.js
import express from 'express';
import { pool } from '../database.js';

const router = express.Router();

// Get all countries
/*router.get('/countries', async (req, res) => {
  try {
    const [countries] = await pool.query(`
      SELECT id, name, code 
      FROM locations 
      WHERE type = 'country' 
      ORDER BY name
    `);
    
    res.json({
      success: true,
      countries: countries
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});*/
router.get('/countries', async (req, res) => {
  try {
    const [countries] = await pool.query(`
      SELECT id, name, code 
      FROM locations 
      WHERE type = 'country'
      ORDER BY name
    `);
    res.json({ success: true, countries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get states by country ID
router.get('/states/:countryId', async (req, res) => {
  try {
    const { countryId } = req.params;
    
    const [states] = await pool.query(`
      SELECT id, name 
      FROM locations 
      WHERE type = 'state' AND parent_id = ?
      ORDER BY name
    `, [countryId]);
    
    res.json({
      success: true,
      states: states
    });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get cities by state ID
router.get('/cities/:stateId', async (req, res) => {
  try {
    const { stateId } = req.params;
    
    const [cities] = await pool.query(`
      SELECT id, name 
      FROM locations 
      WHERE type = 'city' AND parent_id = ?
      ORDER BY name
    `, [stateId]);
    
    res.json({
      success: true,
      cities: cities
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// Add after the existing routes in locations.js:

// Match detected location to database records
router.get('/match', async (req, res) => {
  try {
    const { country, state, city } = req.query;
    
    if (!country) {
      return res.status(400).json({ 
        success: false, 
        error: 'Country name is required' 
      });
    }
    
    // Step 1: Find country (case insensitive)
    const [countries] = await pool.query(`
      SELECT id, name, code 
      FROM locations 
      WHERE type = 'country' 
      AND LOWER(name) LIKE LOWER(?)
      OR LOWER(code) LIKE LOWER(?)
      LIMIT 1
    `, [`%${country}%`, `%${country}%`]);
    
    if (countries.length === 0) {
      return res.json({ 
        success: true, 
        match: null 
      });
    }
    
    const countryMatch = countries[0];
    const result = {
      countryId: countryMatch.id,
      countryName: countryMatch.name,
      stateId: null,
      stateName: null,
      cityId: null,
      cityName: null
    };
    
    // Step 2: Find state if provided
    if (state && countryMatch.id) {
      const [states] = await pool.query(`
        SELECT id, name 
        FROM locations 
        WHERE type = 'state' 
        AND parent_id = ?
        AND LOWER(name) LIKE LOWER(?)
        LIMIT 1
      `, [countryMatch.id, `%${state}%`]);
      
      if (states.length > 0) {
        const stateMatch = states[0];
        result.stateId = stateMatch.id;
        result.stateName = stateMatch.name;
        
        // Step 3: Find city if provided
        if (city && stateMatch.id) {
          const [cities] = await pool.query(`
            SELECT id, name 
            FROM locations 
            WHERE type = 'city' 
            AND parent_id = ?
            AND LOWER(name) LIKE LOWER(?)
            LIMIT 1
          `, [stateMatch.id, `%${city}%`]);
          
          if (cities.length > 0) {
            const cityMatch = cities[0];
            result.cityId = cityMatch.id;
            result.cityName = cityMatch.name;
          }
        }
      }
    }
    
    res.json({
      success: true,
      match: result
    });
    
  } catch (error) {
    console.error('Error matching location:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get all locations hierarchy (for frontend dropdowns)
router.get('/hierarchy', async (req, res) => {
  try {
    // Get all countries
    const [countries] = await pool.query(`
      SELECT id, name, code 
      FROM locations 
      WHERE type = 'country' 
      ORDER BY name
    `);
    
    // For each country, get states
    const hierarchy = await Promise.all(
      countries.map(async (country) => {
        const [states] = await pool.query(`
          SELECT id, name 
          FROM locations 
          WHERE type = 'state' AND parent_id = ?
          ORDER BY name
        `, [country.id]);
        
        // For each state, get cities
        const statesWithCities = await Promise.all(
          states.map(async (state) => {
            const [cities] = await pool.query(`
              SELECT id, name 
              FROM locations 
              WHERE type = 'city' AND parent_id = ?
              ORDER BY name
            `, [state.id]);
            
            return {
              ...state,
              cities: cities
            };
          })
        );
        
        return {
          ...country,
          states: statesWithCities
        };
      })
    );
    
    res.json({
      success: true,
      hierarchy: hierarchy
    });
    
  } catch (error) {
    console.error('Error fetching location hierarchy:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

export default router;