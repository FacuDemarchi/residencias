import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Importar datos
import locationsData from './data/locations.js';
import statesData from './data/states.js';
import publicationsData from './data/publications.js';
import tagsData from './data/tags.js';
import amenitiesData from './data/amenities.js';
import rentalsData from './data/rentals.js';
import pagosData from './data/pagos.js';
import ratingsData from './data/ratings.js';
import contactsData from './data/contacts.js';
import imagesData from './data/images.js';
import priceHistoryData from './data/price-history.js';
import availabilityData from './data/availability.js';
import stateHistoryData from './data/state-history.js';

// Configurar Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_API_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// UUID de prueba
const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';

// Función genérica para insertar datos
async function insertData(tableName, data, options = {}) {
  try {
    console.log(`📝 Insertando datos en ${tableName}...`);
    
    const { data: result, error } = await supabase
      .from(tableName)
      .insert(data)
      .select();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        console.log(`⚠️  Algunos datos ya existen en ${tableName}`);
        return { success: true, message: 'Datos ya existían' };
      }
      throw error;
    }

    console.log(`✅ Se insertaron ${result.length} registros en ${tableName}`);
    return { success: true, data: result };
  } catch (error) {
    console.error(`❌ Error al insertar en ${tableName}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Función para insertar publicaciones con relaciones
async function insertPublications() {
  try {
    console.log('🏠 Insertando publicaciones...');
    
    // Obtener location_id y state_id disponibles
    const { data: locations } = await supabase.from('location').select('id');
    const { data: states } = await supabase.from('states').select('id');
    
    if (!locations || locations.length === 0) {
      throw new Error('No hay ubicaciones disponibles');
    }
    if (!states || states.length === 0) {
      throw new Error('No hay estados disponibles');
    }

    const publicationsWithRelations = publicationsData.map((pub, index) => ({
      ...pub,
      user_id: TEST_USER_ID,
      location_id: locations[index % locations.length].id,
      current_state_id: states[index % states.length].id,
      created_by: TEST_USER_ID,
      updated_by: TEST_USER_ID
    }));

    return await insertData('publications', publicationsWithRelations);
  } catch (error) {
    console.error('❌ Error al insertar publicaciones:', error.message);
    return { success: false, error: error.message };
  }
}

// Mapeo de nombres de tabla a datos
const tableDataMap = {
  'location': locationsData,
  'locations': locationsData,
  'states': statesData,
  'publications': publicationsData,
  'tags': tagsData,
  'amenities': amenitiesData,
  'rentals': rentalsData,
  'pagos': pagosData,
  'ratings': ratingsData,
  'contacts': contactsData,
  'images': imagesData,
  'price_history': priceHistoryData,
  'price-history': priceHistoryData,
  'availability': availabilityData,
  'state_history': stateHistoryData,
  'state-history': stateHistoryData
};

// Función principal
async function main() {
  const args = process.argv.slice(2);
  const tableName = args[0];

  console.log('🚀 Iniciando inserción de datos...\n');

  if (!tableName) {
    console.log('📋 Uso: npm run db:insert-data <tabla>');
    console.log('📋 O: npm run db:insert-data all');
    console.log('\n📊 Tablas disponibles:');
    console.log('  location        - Ubicaciones');
    console.log('  states          - Estados');
    console.log('  publications    - Publicaciones');
    console.log('  tags            - Tags');
    console.log('  amenities       - Amenidades');
    console.log('  rentals         - Alquileres');
    console.log('  pagos           - Pagos');
    console.log('  ratings         - Calificaciones');
    console.log('  contacts        - Contactos');
    console.log('  images          - Imágenes');
    console.log('  price-history   - Historial de precios');
    console.log('  availability    - Disponibilidad');
    console.log('  state-history   - Historial de estados');
    console.log('  all             - Insertar todos los datos');
    return;
  }

  if (tableName === 'all') {
    console.log('📦 Insertando todos los datos...\n');
    await insertData('location', locationsData);
    await insertData('states', statesData);
    await insertData('tags', tagsData);
    await insertData('amenities', amenitiesData);
    await insertData('rentals', rentalsData);
    await insertData('pagos', pagosData);
    await insertData('ratings', ratingsData);
    await insertData('contacts', contactsData);
    await insertData('images', imagesData);
    await insertData('price_history', priceHistoryData);
    await insertData('availability', availabilityData);
    await insertData('state_history', stateHistoryData);
    await insertPublications();
  } else if (tableName === 'publications') {
    await insertPublications();
  } else if (tableDataMap[tableName]) {
    const actualTableName = tableName === 'locations' ? 'location' : tableName;
    await insertData(actualTableName, tableDataMap[tableName]);
  } else {
    console.log(`❌ Error: Tabla "${tableName}" no encontrada`);
    console.log('💡 Usa "npm run db:insert-data" para ver las tablas disponibles');
  }

  console.log('\n✨ Proceso completado');
}

main().catch(console.error);
