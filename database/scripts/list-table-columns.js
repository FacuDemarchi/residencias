import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Faltan las variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_API_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getTableColumns(tableName) {
  try {
    // Hacer una consulta vacía para obtener la estructura de la tabla
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(0);

    if (error) {
      return null;
    }

    // Hacer una consulta de muestra para ver los tipos de datos
    const { data: sampleData, error: sampleError } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    return {
      exists: true,
      sampleData: sampleData && sampleData.length > 0 ? sampleData[0] : null
    };

  } catch (err) {
    return null;
  }
}

async function listTableColumns() {
  try {
    console.log('🔍 Listando campos de cada tabla...\n');
    
    const tablesToCheck = [
      'publications_test',
      'publications', 
      'tags',
      'location',
      'amenities',
      'publication_amenities'
    ];

    for (const tableName of tablesToCheck) {
      console.log(`📋 Tabla: ${tableName.toUpperCase()}`);
      console.log('─'.repeat(60));

      const result = await getTableColumns(tableName);
      
      if (result && result.exists) {
        if (result.sampleData) {
          const columns = Object.keys(result.sampleData);
          columns.forEach((column, index) => {
            const value = result.sampleData[column];
            const type = value === null ? 'NULL' : typeof value;
            console.log(`  ${index + 1}. ${column} (${type})`);
          });
        } else {
          console.log('  ⚠️  Tabla vacía - no se pueden determinar los tipos de datos');
          console.log('  📝 Usa el SQL Editor para ver la estructura completa');
        }
      } else {
        console.log('  ❌ No se puede acceder a esta tabla');
      }
      
      console.log(''); // Línea en blanco
    }

    console.log('💡 Nota: Para ver tipos de datos exactos, usa:');
    console.log('   SELECT * FROM information_schema.columns WHERE table_name = \'nombre_tabla\';');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar el script
listTableColumns();


