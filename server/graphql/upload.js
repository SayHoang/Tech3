import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const typeDef = `
    scalar File

    extend type Mutation {
      upload(file: File!): String!
    }
`;

export const resolvers = {
  Mutation: {
    upload: async (_, { file }) => {
      try {
        console.log("Upload resolver called with file:", typeof file);

        // Handle different file object structures
        let fileData = file;

        // If file is a promise, await it
        if (file && typeof file.then === "function") {
          fileData = await file;
        }

        console.log("File data structure:", Object.keys(fileData || {}));

        // Try different approaches based on file structure
        if (
          fileData &&
          fileData.createReadStream &&
          typeof fileData.createReadStream === "function"
        ) {
          // Method 1: Use createReadStream (apollo-upload-client)
          const { filename, createReadStream } = fileData;
          const uniqueFilename = uuidv4() + "_" + filename;
          const uploadPath = path.join(__dirname, "../img", uniqueFilename);

          const stream = createReadStream();
          const writeStream = fs.createWriteStream(uploadPath);

          await new Promise((resolve, reject) => {
            stream.pipe(writeStream);
            writeStream.on("finish", resolve);
            writeStream.on("error", reject);
          });

          console.log("File uploaded successfully (method 1):", uniqueFilename);
          return uniqueFilename;
        } else if (fileData && fileData.arrayBuffer) {
          // Method 2: Use arrayBuffer (File API)
          const arrayBuffer = await fileData.arrayBuffer();
          const uniqueFilename = uuidv4() + "_" + fileData.name;
          const uploadPath = path.join(__dirname, "../img", uniqueFilename);

          await fs.promises.writeFile(uploadPath, Buffer.from(arrayBuffer));

          console.log("File uploaded successfully (method 2):", uniqueFilename);
          return uniqueFilename;
        } else if (fileData instanceof Buffer) {
          // Method 3: Direct buffer
          const uniqueFilename = uuidv4() + "_file";
          const uploadPath = path.join(__dirname, "../img", uniqueFilename);

          await fs.promises.writeFile(uploadPath, fileData);

          console.log("File uploaded successfully (method 3):", uniqueFilename);
          return uniqueFilename;
        } else {
          console.error("Unsupported file structure:", fileData);
          throw new Error("Unsupported file format received");
        }
      } catch (e) {
        console.error("Upload error details:", e);
        throw new Error("Upload failed: " + e.message);
      }
    },
  },
};
