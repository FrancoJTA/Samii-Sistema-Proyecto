import paho.mqtt.client as mqtt
import json
import time
import random  # Importar para manejar la probabilidad
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

# Variables para controlar el incremento y decremento de las lecturas
INCREMENTO = 3  # Incremento para medidores unidireccionales
DECREMENTO = 10.0  # Decremento para medidores bidireccionales

# Probabilidades para incrementos y reducciones en bidireccionales
PROBABILIDAD = [0.9, 0.1]  # 90% de incrementar, 10% de reducir

# Función de conexión
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Conectado al broker MQTT con éxito")
    else:
        print(f"Error al conectar con el broker MQTT. Código de resultado: {rc}")

# Conectar a MongoDB
try:
    client_mongo = MongoClient(MONGO_URI)
    db = client_mongo[DATABASE_NAME]
    collection = db[COLLECTION_NAME]
except Exception as e:
    print("Error al conectar con MongoDB:", e)
    exit()

# Configurar cliente MQTT
client = mqtt.Client()
client.username_pw_set(USERNAME, PASSWORD)
client.on_connect = on_connect

# Conectar al broker MQTT
client.connect(BROKER, PORT)
client.loop_start()

try:
    while True:
        # Consultar los medidores activos desde MongoDB en cada iteración
        medidores = [{"id": str(medidor["_id"]), "lectura": float(medidor["lectura"]), "tipo": medidor["tipo"]} 
                     for medidor in collection.find({"activo": True})]

        if not medidores:
            print("No hay medidores activos en este momento.")

        for medidor in medidores:
            # Manejar el tipo de medidor
            if medidor["tipo"] == "Unidireccional":
                medidor["lectura"] += INCREMENTO  # Incrementar para unidireccional
            elif medidor["tipo"] == "Bidireccional":
                # Decidir aleatoriamente si incrementar o reducir
                accion = random.choices(["incrementar", "reducir"], weights=PROBABILIDAD, k=1)[0]
                if accion == "incrementar":
                    medidor["lectura"] += INCREMENTO
                elif accion == "reducir":
                    medidor["lectura"] -= DECREMENTO

            # Si la lectura es menor a 0, establecerla en 0
            if medidor["lectura"] < 0:
                medidor["lectura"] = 0.0

            # Limitar la lectura a un máximo de 3 decimales
            medidor["lectura"] = round(medidor["lectura"], 3)

            # Crear mensaje JSON solo con la lectura
            mensaje = {
                "lectura": medidor["lectura"]
            }

            # Actualizar la lectura en la base de datos
            collection.update_one({"_id": medidor["id"]}, {"$set": {"lectura": medidor["lectura"]}})

            # Publicar el mensaje en el tema correspondiente al ID del medidor
            topic = f"medidor/{medidor['id']}/lectura"
            client.publish(topic, json.dumps(mensaje))
            print(f"Publicado en {topic}: {mensaje}")

        # Espera de 5 segundos antes de la siguiente consulta y publicación
        time.sleep(5)
except KeyboardInterrupt:
    print("Desconectando del broker MQTT")
finally:
    client.loop_stop()
    client.disconnect()
