## VARIABLES DE ENTORNO

---

<br>

Para configurar las variables de entorno de tu aplicación, debes seguir los siguientes pasos:

<br>

1. Copia los datos del archivo .env.example en un archivo .env en la misma ruta de tu proyecto.

2. Completa las variables de entorno con los valores correspondientes. A continuación se describen las variables y consideraciones a tener en cuenta:

   - **MONGODB_URI**: Aquí debes proporcionar la URI de tu base de datos MongoDB.

   - **JWT_SECRET**: Aquí debes proporcionar una cadena aleatoria y segura para ser utilizada como clave secreta para la generación de tokens JWT.

   - **PERSISTENCE**: Aquí debes especificar el tipo de persistencia que deseas utilizar. Puedes elegir entre `"mongo"` o `"memory"`.

   - **NODE_ENV**: Aquí debes especificar el entorno de tu aplicación. Puedes elegir entre `"development"` y `"production"`. Si tu aplicación está en entorno de desarrollo, tambien puedes dejarlo sin completar.

   - **URL_BACKEND**: Si estás en un entorno de producción y tu aplicación consume una API de backend, debes proporcionar la URL de tu servidor backend aquí.

   - **URL_FRONTEND**: Si estás en un entorno de producción y tu aplicación es una aplicación web o móvil, debes proporcionar la URL de tu servidor frontend aquí.

   - **CLOUD_NAME**: Si su aplicación necesita subir imágenes a Cloudinary y estás utilizando MongoDB como persistencia, debes proporcionar el nombre de tu cuenta de Cloudinary aquí.

   - **CLOUD_API_KEY**: Si su aplicación necesita subir imágenes a Cloudinary y estás utilizando MongoDB como persistencia, debes proporcionar tu clave API de Cloudinary aquí.

   - **CLOUD_API_SECRET**: Si su aplicación necesita subir imágenes a Cloudinary y estás utilizando MongoDB como persistencia, debes proporcionar tu clave secreta de Cloudinary aquí.
