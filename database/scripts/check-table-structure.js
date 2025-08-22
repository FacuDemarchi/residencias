import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Configurar Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_API_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Función para obtener la estructura de una tabla
async function getTableStructure(tableName) {
  try {
    console.log(`🔍 Verificando estructura de la tabla: ${tableName}`);
    
    // Intentar hacer una consulta con LIMIT 0 para obtener la estructura
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(0);

    if (error) {
      console.error(`❌ Error al verificar ${tableName}:`, error.message);
      return null;
    }

    // Si no hay error, la tabla existe pero puede estar vacía
    console.log(`✅ Tabla ${tableName} existe`);
    
    // Intentar obtener información del schema
    const { data: schemaInfo, error: schemaError } = await supabase
      .rpc('get_table_columns', { table_name: tableName })
      .single();

    if (schemaError) {
      console.log(`⚠️  No se pudo obtener schema detallado para ${tableName}`);
      console.log(`💡 La tabla existe pero no podemos ver su estructura completa`);
      return { exists: true, structure: 'unknown' };
    }

    return { exists: true, structure: schemaInfo };
  } catch (error) {
    console.error(`❌ Error inesperado con ${tableName}:`, error.message);
    return null;
  }
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  const tableName = args[0];

  if (!tableName) {
    console.log('📋 Uso: node check-table-structure.js <tabla>');
    console.log('📋 Ejemplo: node check-table-structure.js tags');
    return;
  }

  console.log(`🔍 Verificando estructura de la tabla: ${tableName}\n`);
  
  const result = await getTableStructure(tableName);
  
  if (result) {
    console.log(`\n✅ Resultado: ${JSON.stringify(result, null, 2)}`);
  } else {
    console.log(`\n❌ No se pudo verificar la tabla ${tableName}`);
  }
}

main().catch(console.error);
