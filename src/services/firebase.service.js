const bucket = require("../config/firebase.config");

exports.uploadToFirebase = async (
  fileBuffer,
  fileName,
  mimeType,
  folderName
) => {
  const file = bucket.file(`${folderName}/${fileName}`);

  const stream = file.createWriteStream({
    metadata: {
      contentType: mimeType,
    },
  });

  return new Promise((resolve, reject) => {
    stream.on("error", (err) => {
      reject(err);
    });

    stream.on("finish", async () => {
      try {
        await file.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${folderName}/${fileName}`;
        resolve(publicUrl);
      } catch (error) {
        reject(error);
      }
    });
    stream.end(fileBuffer);
  });
};
