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

async function getTableStructure() {
  try {
    console.log('🔍 Obteniendo estructura de todas las tablas...\n');
    
    // Consulta principal para obtener estructura completa
    const { data: structure, error } = await supabase
      .from('information_schema.columns')
      .select('table_name, column_name, data_type, is_nullable, column_default, character_maximum_length, numeric_precision, numeric_scale, ordinal_position')
      .eq('table_schema', 'public')
      .order('table_name, ordinal_position');

    if (error) {
      console.error('❌ Error al obtener estructura:', error.message);
      return;
    }

    if (structure && structure.length > 0) {
      console.log('📊 Estructura de todas las tablas:');
      console.log('─'.repeat(100));
      
      let currentTable = '';
      for (const column of structure) {
        if (column.table_name !== currentTable) {
          currentTable = column.table_name;
          console.log(`\n📋 Tabla: ${currentTable.toUpperCase()}`);
          console.log('─'.repeat(80));
          console.log('Columna'.padEnd(25) + 'Tipo'.padEnd(20) + 'Nullable'.padEnd(10) + 'Default'.padEnd(15) + 'Pos');
          console.log('─'.repeat(80));
        }
        
        const dataType = column.data_type === 'character varying' 
          ? `varchar(${column.character_maximum_length || '?'})`
          : column.data_type === 'numeric'
          ? `numeric(${column.numeric_precision || '?'},${column.numeric_scale || '?'})`
          : column.data_type;

        console.log(
          column.column_name.padEnd(25) + 
          dataType.padEnd(20) + 
          column.is_nullable.padEnd(10) + 
          (column.column_default || 'NULL').padEnd(15) + 
          column.ordinal_position
        );
      }
      
      console.log('\n─'.repeat(100));
      console.log(`📊 Total de columnas encontradas: ${structure.length}`);
    } else {
      console.log('⚠️  No se encontraron columnas');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar el script
getTableStructure();
