const { getDb, run, get, saveDb } = require('./db');
const bcrypt = require('bcryptjs');

const seed = async () => {
  await getDb();

  const hashed = bcrypt.hashSync('123456', 10);
  const existingDemo = get('SELECT id FROM users WHERE email = ?', ['demo@netflit.com']);
  if (!existingDemo) {
    run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', ['demo', 'demo@netflit.com', hashed]);
    run('INSERT OR IGNORE INTO users (username, email, password) VALUES (?, ?, ?)', ['admin', 'admin@netflit.com', hashed]);
  }

  const existingMovie = get('SELECT id FROM movies WHERE title = ?', ['Stranger Things']);
  if (!existingMovie) {
    const movies = [
      ['Stranger Things', 'Cuando un niño desaparece, su madre, un jefe de policía y sus amigos deben enfrentarse a fuerzas sobrenaturales aterradoras.', 2016, 'Sci-Fi', '51m', 8.7, 'https://image.tmdb.org/t/p/w500/49WJfeN0m4b8N6oBYd0V2Z7l4v.jpg', 'https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9DOi6kAIE5WpP.jpg', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 1],
      ['The Crown', 'Sigue las rivalidades políticas y el romance de la Reina Isabel II.', 2016, 'Drama', '58m', 8.6, 'https://image.tmdb.org/t/p/w500/1gr1E1J7q1nwSJz8QxYqP0YzM9.jpg', 'https://image.tmdb.org/t/p/w1280/hqHMhqsYzCW9JNqM7T1P3hM5zL.jpg', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 1],
      ['Money Heist', 'Un grupo inusual de ladrones intenta llevar a cabo el robo más perfecto.', 2017, 'Action', '50m', 8.3, 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg', 'https://image.tmdb.org/t/p/w1280/9s0jZ9U9LZ7A8K6n4x4e5f6g7h.jpg', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 1],
      ['Breaking Bad', 'Un profesor de química con cáncer terminal se dedica a fabricar metanfetamina.', 2008, 'Drama', '49m', 9.5, 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L2y9J0W3Vf4nR1.jpg', 'https://image.tmdb.org/t/p/w1280/ztkUFLFj7s2s6w5sJ5x0yQ5yZ1.jpg', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 0],
      ['The Witcher', 'Geralt de Rivia, un cazador de monstruos solitario, lucha por encontrar su lugar en un mundo donde la gente es más malvada que las bestias.', 2019, 'Fantasy', '60m', 8.2, 'https://image.tmdb.org/t/p/w500/cZ0d3H6G5g5Z5v5w5J5x0yQ5yZ1.jpg', 'https://image.tmdb.org/t/p/w1280/j8JWTrJ1pJ1V1x1b1n1m1l1k1j.jpg', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 0],
      ['Squid Game', 'Cientos de jugadores sin dinero aceptan una extraña invitación a competir en juegos infantiles por un tentador premio.', 2021, 'Thriller', '55m', 8.0, 'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0P0n0b0z0B0a0c0d0.jpg', 'https://image.tmdb.org/t/p/w1280/e1n1p1q1r1s1t1u1v1w1x1y1z1.jpg', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 1],
      ['Black Mirror', 'Una serie antológica que explora un multiverso retorcido y de alta tecnología donde las innovaciones chocan con los instintos más oscuros.', 2011, 'Sci-Fi', '60m', 8.8, 'https://image.tmdb.org/t/p/w500/5Uq2w3z4A5B6C7D8E9F0G1H2I3.jpg', 'https://image.tmdb.org/t/p/w1280/k1l2m3n4o5p6q7r8s9t0u1v2w3.jpg', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', 0],
      ['Narcos', 'Una mirada crónica a las actividades criminales del narcotraficante colombiano Pablo Escobar.', 2015, 'Crime', '49m', 8.8, 'https://image.tmdb.org/t/p/w500/6U2q3w4z5A6B7C8D9E0F1G2H3I4.jpg', 'https://image.tmdb.org/t/p/w1280/l1m2n3o4p5q6r7s8t9u0v1w2x3.jpg', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerSunblaze.mp4', 0],
      ['Dark', 'Una saga familiar con un giro sobrenatural, ambientada en un pueblo alemán donde la desaparición de dos niños expone los secretos de cuatro familias.', 2017, 'Sci-Fi', '56m', 8.7, 'https://image.tmdb.org/t/p/w500/7V2q3w4z5A6B7C8D9E0F1G2H3I5.jpg', 'https://image.tmdb.org/t/p/w1280/m1n2o3p4q5r6s7t8u9v0w1x2y3.jpg', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerSunblaze.mp4', 0],
      ['The Office', 'Un falso documental sobre un grupo de oficinistas, donde el día laboral consiste en choques de egos y comportamiento inapropiado.', 2005, 'Comedy', '22m', 8.9, 'https://image.tmdb.org/t/p/w500/8X2q3w4z5A6B7C8D9E0F1G2H3I6.jpg', 'https://image.tmdb.org/t/p/w1280/n1o2p3q4r5s6t7u8v9w0x1y2z3.jpg', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 0],
      ['The Mandalorian', 'Los viajes de un cazarrecompensas solitario en los confines de la galaxia.', 2019, 'Fantasy', '39m', 8.7, 'https://image.tmdb.org/t/p/w500/9Y2q3w4z5A6B7C8D9E0F1G2H3I7.jpg', 'https://image.tmdb.org/t/p/w1280/o1p2q3r4s5t6u7v8w9x0y1z2a3.jpg', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 0],
      ['Ozark', 'Un asesor financiero arrastra a su familia a los Ozarks para lavar dinero para un narcotraficante.', 2017, 'Drama', '60m', 8.4, 'https://image.tmdb.org/t/p/w500/0Z2q3w4z5A6B7C8D9E0F1G2H3I8.jpg', 'https://image.tmdb.org/t/p/w1280/p1q2r3s4t5u6v7w8x9y0z1a2b3.jpg', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 0],
      ['Lupin', 'Inspirado por las aventuras de Arsène Lupin, el ladrón gentilhombre Assane Diop busca vengar a su padre.', 2021, 'Action', '45m', 7.7, 'https://image.tmdb.org/t/p/w500/1a2q3w4z5A6B7C8D9E0F1G2H3I9.jpg', 'https://image.tmdb.org/t/p/w1280/q1r2s3t4u5v6w7x8y9z0a1b2c3.jpg', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 0],
      ['The Queen\'s Gambit', 'Huérfana a los nueve años, Beth Harmon descubre un talento prodigioso para el ajedrez.', 2020, 'Drama', '60m', 8.6, 'https://image.tmdb.org/t/p/w500/2b3q3w4z5A6B7C8D9E0F1G2H3I0.jpg', 'https://image.tmdb.org/t/p/w1280/r1s2t3u4v5w6x7y8z9a0b1c2d3.jpg', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 0],
      ['Cobra Kai', 'Décadas después de su rivalidad en el instituto, Johnny Lawrence busca redención reabriendo el dojo Cobra Kai.', 2018, 'Action', '30m', 8.3, 'https://image.tmdb.org/t/p/w500/3c4q3w4z5A6B7C8D9E0F1G2H3I1.jpg', 'https://image.tmdb.org/t/p/w1280/s1t2u3v4w5x6y7z8a9b0c1d2e3.jpg', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 0],
      ['The Boys', 'Un grupo de vigilantes se propone derrotar a superhéroes corruptos.', 2019, 'Action', '60m', 8.7, 'https://image.tmdb.org/t/p/w500/4d5q3w4z5A6B7C8D9E0F1G2H3I2.jpg', 'https://image.tmdb.org/t/p/w1280/t1u2v3w4x5y6z7a8b9c0d1e2f3.jpg', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', 0],
      ['Peaky Blinders', 'Una familia de gánsters en Birmingham de 1919, liderada por el feroz Tommy Shelby.', 2013, 'Crime', '60m', 8.8, 'https://image.tmdb.org/t/p/w500/5e6q3w4z5A6B7C8D9E0F1G2H3I3.jpg', 'https://image.tmdb.org/t/p/w1280/u1v2w3x4y5z6a7b8c9d0e1f2g3.jpg', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 0],
      ['Wednesday', 'Inteligente, sarcástica y un poco muerta por dentro, Wednesday Addams investiga una ola de asesinatos.', 2022, 'Comedy', '50m', 8.4, 'https://image.tmdb.org/t/p/w500/6f7q3w4z5A6B7C8D9E0F1G2H3I4.jpg', 'https://image.tmdb.org/t/p/w1280/v1w2x3y4z5a6b7c8d9e0f1g2h3.jpg', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 0],
      ['The Last of Us', 'Tras una pandemia que destruye la civilización, un superviviente endurecido se hace cargo de una niña de 14 años.', 2023, 'Drama', '50m', 8.8, 'https://image.tmdb.org/t/p/w500/7g8q3w4z5A6B7C8D9E0F1G2H3I5.jpg', 'https://image.tmdb.org/t/p/w1280/w1x2y3z4a5b6c7d8e9f0g1h2i3.jpg', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 0],
      ['Arcane', 'Ambientada en la utópica región de Piltover y la oprimida ciudad subterránea de Zaun, la historia sigue los orígenes de dos campeones icónicos.', 2021, 'Fantasy', '40m', 9.0, 'https://image.tmdb.org/t/p/w500/8h9q3w4z5A6B7C8D9E0F1G2H3I6.jpg', 'https://image.tmdb.org/t/p/w1280/x1y2z3a4b5c6d7e8f9g0h1i2j3.jpg', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 1],
    ];
    for (const m of movies) {
      run('INSERT INTO movies (title, description, year, genre, duration, rating, image, banner, video_url, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', m);
    }
  }

  saveDb();
  console.log('Base de datos sembrada correctamente');
  console.log('Usuario demo: demo@netflit.com / 123456');
};

seed();
