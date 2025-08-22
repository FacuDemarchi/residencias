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

async function listTables() {
  try {
    console.log('🔍 Obteniendo TODAS las tablas de la base de datos...\n');
    
    // Intentar obtener todas las tablas usando una consulta directa
    console.log('📋 Intentando método 1: Consulta directa a information_schema...');
    
    try {
      const { data: tables, error } = await supabase
        .from('information_schema.tables')
        .select('table_name, table_type')
        .eq('table_schema', 'public')
        .order('table_name');

      if (error) {
        throw error;
      }

      if (tables && tables.length > 0) {
        console.log('✅ Método 1 exitoso! Todas las tablas encontradas:');
        console.log('─'.repeat(60));
        console.log('Tabla'.padEnd(30) + 'Tipo');
        console.log('─'.repeat(60));

        for (const table of tables) {
          console.log(table.table_name.padEnd(30) + table.table_type);
        }

        console.log('─'.repeat(60));
        console.log(`📊 Total de tablas encontradas: ${tables.length}`);
        return;
      } else {
        console.log('⚠️  No se encontraron tablas con el método 1');
      }
    } catch (error) {
      console.log('❌ Error con método 1:', error.message);
    }

    // Método 2: Usar RPC si está disponible
    console.log('\n📋 Intentando método 2: RPC exec_sql...');
    
    try {
      const { data: rpcTables, error: rpcError } = await supabase
        .rpc('exec_sql', {
          sql: `
            SELECT 
              table_name,
              table_type
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
          `
        });

      if (rpcError) {
        throw rpcError;
      }

      if (rpcTables && rpcTables.length > 0) {
        console.log('✅ Método 2 exitoso! Todas las tablas encontradas:');
        console.log('─'.repeat(60));
        console.log('Tabla'.padEnd(30) + 'Tipo');
        console.log('─'.repeat(60));

        for (const table of rpcTables) {
          console.log(table.table_name.padEnd(30) + table.table_type);
        }

        console.log('─'.repeat(60));
        console.log(`📊 Total de tablas encontradas: ${rpcTables.length}`);
        return;
      } else {
        console.log('⚠️  No se encontraron tablas con el método 2');
      }
    } catch (error) {
      console.log('❌ Error con método 2:', error.message);
    }

    // Método 3: Consulta raw SQL
    console.log('\n📋 Intentando método 3: Consulta raw SQL...');
    
    try {
      const { data: rawTables, error: rawError } = await supabase
        .from('_sql')
        .select('*')
        .eq('query', `
          SELECT 
            table_name,
            table_type
          FROM information_schema.tables 
          WHERE table_schema = 'public'
          ORDER BY table_name;
        `);

      if (rawError) {
        throw rawError;
      }

      if (rawTables && rawTables.length > 0) {
        console.log('✅ Método 3 exitoso! Todas las tablas encontradas:');
        console.log('─'.repeat(60));
        console.log('Tabla'.padEnd(30) + 'Tipo');
        console.log('─'.repeat(60));

        for (const table of rawTables) {
          console.log(table.table_name.padEnd(30) + table.table_type);
        }

        console.log('─'.repeat(60));
        console.log(`📊 Total de tablas encontradas: ${rawTables.length}`);
        return;
      } else {
        console.log('⚠️  No se encontraron tablas con el método 3');
      }
    } catch (error) {
      console.log('❌ Error con método 3:', error.message);
    }

    // Método 4: Lista extendida de tablas comunes
    console.log('\n📋 Método 4: Verificación de lista extendida de tablas...');
    
    const extendedTables = [
      // Tablas principales del proyecto
      'publications', 'tags', 'location', 'states', 'state_history',
      'rentals', 'pagos', 'ratings', 'amenities', 'publication_amenities', 
      'publication_tags',
      
      // Tablas de Supabase comunes
      'users', 'profiles', 'auth_users', 'user_profiles',
      
      // Tablas de sistema que podrían existir
      'migrations', 'schema_migrations', 'ar_internal_metadata',
      
      // Tablas adicionales que podrían haberse creado
      'contacts', 'images', 'price_history', 'availability',
      'publications_test', 'test_publications',
      
      // Tablas de configuración
      'settings', 'config', 'app_settings',
      
      // Tablas de auditoría
      'audit_logs', 'activity_logs', 'user_activity'
    ];

    console.log('📋 Verificando lista extendida de tablas:');
    console.log('─'.repeat(50));

    let foundTables = 0;
    for (const tableName of extendedTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        if (error) {
          console.log(`❌ ${tableName} - No existe`);
        } else {
          console.log(`✅ ${tableName} - Existe`);
          foundTables++;
        }
      } catch (err) {
        console.log(`❌ ${tableName} - No existe`);
      }
    }

    console.log('─'.repeat(50));
    console.log(`📊 Total de tablas encontradas: ${foundTables}`);

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar el script
listTables();
