import { Cloudinary } from '@cloudinary/url-gen';

const cloudinaryConfig = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    apiKey: import.meta.env.VITE_CLOUDINARY_CLOUD_API_KEY,
  },
  url: {
    secure: true // force https
  }
});

export default cloudinaryConfig;