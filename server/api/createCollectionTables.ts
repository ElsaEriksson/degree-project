import pool from "../config/db";

const createCollectionsTable = async (connection: any) => {
  await connection.query(`
      CREATE TABLE IF NOT EXISTS Collections (
        collection_id INT AUTO_INCREMENT PRIMARY KEY,
        collection_name VARCHAR(255) NOT NULL UNIQUE,
        description_short VARCHAR(255) NOT NULL,
        description_long VARCHAR(355) NOT NULL
      );
    `);
  console.log("Collections table created successfully!");
};

const insertInitialCollections = async (connection: any) => {
  const collections = [
    [
      "Beigelace",
      "Understated elegance woven with intricate detail.",
      "Beigelace is a symphony of soft neutrals...",
    ],
    [
      "Colorfur",
      "A vivid expression of artistry in motion.",
      "Colorfur bursts with life, offering vibrant hues...",
    ],
    [
      "Howdy",
      "Where timeless Western charm meets couture elegance.",
      "Inspired by the rugged beauty of the frontier...",
    ],
  ];

  for (const collection of collections) {
    try {
      const [existingCollection] = await connection.query(
        `SELECT * FROM Collections WHERE collection_name = ?`,
        [collection[0]]
      );

      if (existingCollection.length > 0) {
        console.log(`Collection ${collection[0]} already exists.`);
      } else {
        const [result] = await connection.query(
          `INSERT INTO Collections (collection_name, description_short, description_long)
           VALUES (?, ?, ?)`,
          collection
        );
        console.log(
          `Collection ${collection[0]} added successfully with ID: ${result.insertId}`
        );
      }
    } catch (error: any) {
      console.error("Error inserting collection:", error.message);
    }
  }
};

const createTablesForCollections = async () => {
  let connection;
  try {
    connection = await pool.getConnection();

    await createCollectionsTable(connection);

    await insertInitialCollections(connection);
  } catch (error) {
    console.error("Error creating tables or inserting collection:", error);
  } finally {
    if (connection) connection.release();
  }
};

export default createTablesForCollections;
