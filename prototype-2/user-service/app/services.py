from .models import User, Address

class UserService:

    def __init__(self, db):
        self.db = db

    def create_user(self, data):
        user = User(
            name=data.name,
            email=data.email,
            phone=data.phone,
            role=data.role
        )

        if data.addresses:
            for addr in data.addresses:
                user.addresses.append(Address(**addr.dict()))

        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        return user

    def get_user(self, user_id):
        return self.db.query(User).filter(User.id == user_id).first()
    
    def add_address(self, user_id, address_data):
        address = Address(user_id=user_id, **address_data.dict())

        self.db.add(address)
        self.db.commit()
        self.db.refresh(address)

        return address

    def get_user_addresses(self, user_id):
        user = self.db.query(User).filter(User.id == user_id).first()

        if not user:
            return {"error": "User not found"}

        return user.addresses