import paho.mqtt.client as mqtt
import json
import time
import random
from pymongo import MongoClient

# Configuración de MongoDB
MONGO_URI = "mongodb://adminsami:francodiogoandresomar@34.134.225.157:27017/sami_db"
DATABASE_NAME = "sami_db"
COLLECTION_NAME = "Medidor"

# Configuración del servidor MQTT y credenciales
BROKER = '34.134.225.157'
PORT = 1883
USERNAME = "samii"
PASSWORD = "diogofranco"

# Función de conexión
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Conectado al broker MQTT con éxito")
    else:
        print(f"Error al conectar con el broker MQTT. Código de resultado: {rc}")

# Conectar a MongoDB y obtener los IDs de los medidores
try:
    client_mongo = MongoClient(MONGO_URI)
    db = client_mongo[DATABASE_NAME]
    collection = db[COLLECTION_NAME]

    # Obtener IDs de los medidores desde MongoDB
    medidores = [{"id": str(medidor["_id"]), "lectura": random.uniform(50, 150)} for medidor in collection.find()]
    print("Medidores obtenidos de MongoDB:", medidores)
except Exception as e:
    print("Error al conectar con MongoDB o al obtener los medidores:", e)
    medidores = []

# Configurar cliente MQTT
client = mqtt.Client()
client.username_pw_set(USERNAME, PASSWORD)
client.on_connect = on_connect

# Conectar al broker MQTT
client.connect(BROKER, PORT)
client.loop_start()

try:
    while True:
        for medidor in medidores:
            # Actualizar la lectura aleatoriamente
            medidor["lectura"] += random.uniform(-5, 5)

            # Crear mensaje JSON solo con la lectura
            mensaje = {
                "lectura": medidor["lectura"]
            }

            # Publicar el mensaje en el tema correspondiente al ID del medidor
            topic = f"medidor/{medidor['id']}/lectura"
            client.publish(topic, json.dumps(mensaje))
            print(f"Publicado en {topic}: {mensaje}")

        # Espera de 5 segundos antes de la siguiente publicación para todos los medidores
        time.sleep(5)
except KeyboardInterrupt:
    print("Desconectando del broker MQTT")
finally:
    client.loop_stop()
    client.disconnect()
