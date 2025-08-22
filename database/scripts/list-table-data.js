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

// Configuración de relaciones para cada tabla
const tableRelations = {
  publications: {
    select: `
      *,
      location (
        id,
        direccion,
        latitud,
        longitud
      ),
      states (
        id,
        nombre,
        descripcion
      )
    `,
    orderBy: 'created_at',
    orderDirection: 'desc',
    displayFields: [
      'id', 'titulo', 'price', 'currency', 'capacidad', 'metros_cuadrados',
      'is_active', 'created_at', 'location.direccion', 'states.nombre'
    ],
    title: 'Publicación',
    emoji: '🏠'
  },
  location: {
    select: '*',
    orderBy: 'created_at',
    orderDirection: 'desc',
    displayFields: ['id', 'direccion', 'latitud', 'longitud', 'created_at'],
    title: 'Ubicación',
    emoji: '📍'
  },
  states: {
    select: '*',
    orderBy: 'nombre',
    orderDirection: 'asc',
    displayFields: ['id', 'nombre', 'descripcion', 'es_final', 'created_at'],
    title: 'Estado',
    emoji: '📊'
  },
  tags: {
    select: '*',
    orderBy: 'name',
    orderDirection: 'asc',
    displayFields: ['name', 'created_at'],
    title: 'Tag',
    emoji: '🏷️'
  },
  rentals: {
    select: `
      *,
      publications (
        id,
        titulo
      )
    `,
    orderBy: 'created_at',
    orderDirection: 'desc',
    displayFields: ['id', 'fecha_inicio', 'fecha_fin', 'monto_total', 'currency', 'created_at', 'publications.titulo'],
    title: 'Alquiler',
    emoji: '🏠'
  },
  pagos: {
    select: `
      *,
      rentals (
        id
      )
    `,
    orderBy: 'created_at',
    orderDirection: 'desc',
    displayFields: ['id', 'monto', 'fecha_vencimiento', 'fecha_pago', 'created_at'],
    title: 'Pago',
    emoji: '💳'
  },
  ratings: {
    select: `
      *,
      rentals (
        id
      )
    `,
    orderBy: 'created_at',
    orderDirection: 'desc',
    displayFields: ['id', 'overall_score', 'would_recommend', 'comentario', 'created_at'],
    title: 'Calificación',
    emoji: '⭐'
  },
  amenities: {
    select: '*',
    orderBy: 'nombre',
    orderDirection: 'asc',
    displayFields: ['id', 'nombre', 'created_at'],
    title: 'Amenidad',
    emoji: '🏡'
  },
  publication_amenities: {
    select: `
      *,
      publications (
        id,
        titulo
      ),
      amenities (
        id,
        nombre
      )
    `,
    orderBy: 'created_at',
    orderDirection: 'desc',
    displayFields: ['id', 'publications.titulo', 'amenities.nombre', 'created_at'],
    title: 'Amenidad de Publicación',
    emoji: '🔗'
  },
  publication_tags: {
    select: `
      *,
      publications (
        id,
        titulo
      ),
      tags (
        name
      )
    `,
    orderBy: 'created_at',
    orderDirection: 'desc',
    displayFields: ['id', 'publications.titulo', 'tag_name', 'created_at'],
    title: 'Tag de Publicación',
    emoji: '🏷️'
  },
  price_history: {
    select: `
      *,
      publications (
        id,
        titulo
      )
    `,
    orderBy: 'created_at',
    orderDirection: 'desc',
    displayFields: ['id', 'precio_anterior', 'precio_nuevo', 'motivo_cambio', 'created_at', 'publications.titulo'],
    title: 'Historial de Precio',
    emoji: '💰'
  },
  images: {
    select: `
      *,
      publications (
        id,
        titulo
      )
    `,
    orderBy: 'created_at',
    orderDirection: 'desc',
    displayFields: ['id', 'url_imagen', 'tipo', 'created_at', 'publications.titulo'],
    title: 'Imagen',
    emoji: '🖼️'
  },
  contacts: {
    select: `
      *,
      publications (
        id,
        titulo
      )
    `,
    orderBy: 'created_at',
    orderDirection: 'desc',
    displayFields: ['id', 'contact_type', 'name', 'phone', 'email', 'is_primary', 'created_at', 'publications.titulo'],
    title: 'Contacto',
    emoji: '📞'
  },
  availability: {
    select: `
      *,
      publications (
        id,
        titulo
      )
    `,
    orderBy: 'created_at',
    orderDirection: 'desc',
    displayFields: ['id', 'start_date', 'end_date', 'is_available', 'reason', 'created_at', 'publications.titulo'],
    title: 'Disponibilidad',
    emoji: '📅'
  },
  state_history: {
    select: `
      *,
      publications (
        id,
        titulo
      ),
      states (
        id,
        nombre
      )
    `,
    orderBy: 'created_at',
    orderDirection: 'desc',
    displayFields: ['id', 'motivo_cambio', 'created_at', 'publications.titulo', 'states.nombre'],
    title: 'Historial de Estado',
    emoji: '📈'
  }
};

// Función para obtener el valor de un campo anidado
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Función para formatear valores
function formatValue(value, fieldName) {
  if (value === null || value === undefined) {
    return 'N/A';
  }

  // Formatear fechas
  if (fieldName.includes('_at') || fieldName.includes('date') || fieldName.includes('fecha')) {
    if (typeof value === 'string') {
      return new Date(value).toLocaleString('es-AR');
    }
  }

  // Formatear precios
  if (fieldName.includes('price') || fieldName.includes('monto') || fieldName.includes('precio')) {
    if (typeof value === 'number') {
      return `$${value.toLocaleString('es-AR')}`;
    }
  }

  // Formatear booleanos
  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No';
  }

  // Formatear números
  if (typeof value === 'number') {
    if (fieldName.includes('score')) {
      return `${value}/5`;
    }
    return value.toLocaleString('es-AR');
  }

  return value;
}

async function listTableData(tableName) {
  try {
    console.log(`📋 Listando datos de la tabla: ${tableName}\n`);

    // Verificar si la tabla existe en la configuración
    if (!tableRelations[tableName]) {
      console.log(`❌ Tabla "${tableName}" no está configurada en el script`);
      console.log('📋 Tablas disponibles:');
      Object.keys(tableRelations).forEach(table => {
        console.log(`   - ${table}`);
      });
      return;
    }

    const config = tableRelations[tableName];
    const { emoji, title } = config;

    // Obtener datos de la tabla
    const { data: records, error } = await supabase
      .from(tableName)
      .select(config.select)
      .order(config.orderBy, { ascending: config.orderDirection === 'asc' });

    if (error) {
      throw new Error(`Error al obtener datos de ${tableName}: ${error.message}`);
    }

    if (!records || records.length === 0) {
      console.log(`❌ No hay datos en la tabla ${tableName}`);
      return;
    }

    console.log(`✅ Se encontraron ${records.length} registros en ${tableName}\n`);

    // Mostrar cada registro
    records.forEach((record, index) => {
      console.log('─'.repeat(80));
      console.log(`${emoji} ${title.toUpperCase()} ${index + 1}`);
      console.log('─'.repeat(80));

      config.displayFields.forEach(field => {
        const value = getNestedValue(record, field);
        const formattedValue = formatValue(value, field);
        console.log(`${field}: ${formattedValue}`);
      });
    });

    console.log('─'.repeat(80));
    console.log('📊 RESUMEN');
    console.log('─'.repeat(80));
    console.log(`📊 Total de registros: ${records.length}`);

    // Mostrar estadísticas específicas según la tabla
    if (tableName === 'publications') {
      const totalPrice = records.reduce((sum, record) => sum + (record.price || 0), 0);
      const avgPrice = totalPrice / records.length;
      console.log(`💰 Precio promedio: $${avgPrice.toLocaleString('es-AR', { maximumFractionDigits: 0 })} ARS`);
      
      const estadosCount = {};
      records.forEach(record => {
        const estado = record.states?.nombre || 'Sin estado';
        estadosCount[estado] = (estadosCount[estado] || 0) + 1;
      });
      
      console.log('\n📊 Distribución por estado:');
      Object.entries(estadosCount).forEach(([estado, count]) => {
        console.log(`   ${estado}: ${count} publicaciones`);
      });
    }

    if (tableName === 'location') {
      console.log(`📍 Ubicaciones en diferentes barrios de Córdoba`);
    }

    if (tableName === 'states') {
      const finalStates = records.filter(record => record.es_final);
      const nonFinalStates = records.filter(record => !record.es_final);
      console.log(`📊 Estados finales: ${finalStates.length}`);
      console.log(`📊 Estados no finales: ${nonFinalStates.length}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Función principal para listar todas las tablas
async function listAllTables() {
  console.log('🔍 Obteniendo TODAS las tablas de la base de datos...\n');
  
  try {
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
        
        // Mostrar tablas configuradas en el script
        console.log('\n📋 Tablas configuradas en list-table-data:');
        console.log('─'.repeat(50));
        Object.keys(tableRelations).forEach(table => {
          const emoji = tableRelations[table].emoji;
          const title = tableRelations[table].title;
          console.log(`${emoji} ${table} - ${title}`);
        });
        
        console.log('\n💡 Para ver datos de una tabla específica:');
        console.log('   npm run db:list-table-data <nombre-tabla>');
        console.log('   Ejemplo: npm run db:list-table-data publications');
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
        
        // Mostrar tablas configuradas en el script
        console.log('\n📋 Tablas configuradas en list-table-data:');
        console.log('─'.repeat(50));
        Object.keys(tableRelations).forEach(table => {
          const emoji = tableRelations[table].emoji;
          const title = tableRelations[table].title;
          console.log(`${emoji} ${table} - ${title}`);
        });
        
        console.log('\n💡 Para ver datos de una tabla específica:');
        console.log('   npm run db:list-table-data <nombre-tabla>');
        console.log('   Ejemplo: npm run db:list-table-data publications');
        return;
      } else {
        console.log('⚠️  No se encontraron tablas con el método 2');
      }
    } catch (error) {
      console.log('❌ Error con método 2:', error.message);
    }

    // Método 3: Lista extendida de tablas comunes
    console.log('\n📋 Método 3: Verificación de lista extendida de tablas...');
    
    // Solo tablas del proyecto que sabemos que existen
    const projectTables = [
      'publications', 'tags', 'location', 'states', 'state_history',
      'rentals', 'pagos', 'ratings', 'amenities', 'publication_amenities', 
      'publication_tags', 'contacts', 'images', 'price_history', 'availability'
    ];

    console.log('📋 Verificando tablas del proyecto:');
    console.log('─'.repeat(50));

    let foundTables = 0;
    const existingTables = [];
    
    for (const tableName of projectTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        if (!error) {
          console.log(`✅ ${tableName} - Existe`);
          foundTables++;
          existingTables.push(tableName);
        }
      } catch (err) {
        // Tabla no existe, no mostrar nada
      }
    }

    console.log('─'.repeat(50));
    console.log(`📊 Total de tablas encontradas: ${foundTables}`);
    
    // Mostrar tablas existentes organizadas por categoría
    console.log('\n📋 Tablas del proyecto organizadas:');
    console.log('─'.repeat(50));
    
    const categories = {
      '🏠 Publicaciones': ['publications', 'location', 'states', 'state_history'],
      '🏷️ Tags y Amenidades': ['tags', 'amenities', 'publication_tags', 'publication_amenities'],
      '🏡 Alquileres': ['rentals', 'pagos', 'ratings'],
      '📊 Historial y Datos': ['price_history', 'images', 'contacts', 'availability']
    };
    
    Object.entries(categories).forEach(([category, tables]) => {
      console.log(`\n${category}:`);
      tables.forEach(table => {
        if (existingTables.includes(table)) {
          const config = tableRelations[table];
          if (config) {
            console.log(`   ${config.emoji} ${table} - ${config.title}`);
          } else {
            console.log(`   ✅ ${table}`);
          }
        }
      });
    });
    
    console.log('\n💡 Para ver datos de una tabla específica:');
    console.log('   npm run db:list-table-data <nombre-tabla>');
    console.log('   Ejemplo: npm run db:list-table-data publications');

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Obtener el nombre de la tabla desde los argumentos de línea de comandos
const tableName = process.argv[2];

if (!tableName) {
  // Si no se especifica tabla, listar todas las tablas
  listAllTables();
} else {
  // Ejecutar el script con la tabla específica
  listTableData(tableName);
}
