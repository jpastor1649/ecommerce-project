import json
import pika

class EventPublisher:

    def __init__(self):
        import os

        host = os.getenv("RABBITMQ_HOST", "localhost")

        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=host)
        )
        self.channel = self.connection.channel()

        self.channel.exchange_declare(
            exchange='events',
            exchange_type='fanout'
        )

    def publish(self, event_type: str, data: dict):
        message = {
            "event": event_type,
            "data": data
        }

        self.channel.basic_publish(
            exchange='events',
            routing_key='',
            body=json.dumps(message)
        )
