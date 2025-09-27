import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_API_KEY
);

async function testDatabase() {
  console.log('🧪 Probando base de datos...\n');

  try {
    // 1. Ubicaciones
    console.log('📍 UBICACIONES:');
    const { data: locations } = await supabase.from('locations').select('*');
    console.log(`Total: ${locations?.length || 0}`);
    locations?.forEach(loc => {
      console.log(`  - ${loc.direccion} (${loc.latitud}, ${loc.longitud})`);
    });

    // 2. Estados
    console.log('\n📊 ESTADOS:');
    const { data: states } = await supabase.from('states').select('*');
    console.log(`Total: ${states?.length || 0}`);
    states?.forEach(state => {
      console.log(`  - ${state.nombre}: ${state.descripcion}`);
    });

    // 3. Publicaciones básicas
    console.log('\n🏠 PUBLICACIONES:');
    const { data: pubs } = await supabase
      .from('publications')
      .select('*');
    
    console.log(`Total: ${pubs?.length || 0}`);
    pubs?.forEach(pub => {
      console.log(`  - ${pub.titulo}: $${pub.price} - Estado ID: ${pub.current_state_id}`);
    });

    // 4. Publicaciones con relaciones (si es posible)
    console.log('\n🔗 PUBLICACIONES CON RELACIONES:');
    try {
      const { data: pubsWithRelations } = await supabase
        .from('publications')
        .select(`
          *,
          locations(direccion),
          states(nombre)
        `);
      
      console.log(`Total: ${pubsWithRelations?.length || 0}`);
      pubsWithRelations?.forEach(pub => {
        console.log(`  - ${pub.titulo}: $${pub.price} - ${pub.states?.nombre} - ${pub.locations?.direccion}`);
      });

      // 5. Disponibles para checkout
      console.log('\n💳 DISPONIBLES PARA CHECKOUT:');
      const disponibles = pubsWithRelations?.filter(p => p.states?.nombre === 'disponible' && p.is_active) || [];
      console.log(`Total: ${disponibles.length}`);
      
      if (disponibles.length > 0) {
        disponibles.forEach(pub => {
          console.log(`  - http://localhost:5173/checkout?id=${pub.id}`);
        });
      } else {
        console.log('  ⚠️ No hay publicaciones disponibles');
      }
    } catch (relationError) {
      console.log(`  ❌ Error en relaciones: ${relationError.message}`);
      console.log('  💡 Verificando publicaciones básicas para checkout...');
      
      // Fallback: buscar por estado ID
      const estadoDisponible = states?.find(s => s.nombre === 'disponible');
      if (estadoDisponible && pubs) {
        const disponiblesBasicas = pubs.filter(p => p.current_state_id === estadoDisponible.id && p.is_active);
        console.log(`  📋 Publicaciones disponibles (básicas): ${disponiblesBasicas.length}`);
        disponiblesBasicas.forEach(pub => {
          console.log(`  - http://localhost:5173/checkout?id=${pub.id}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDatabase();
