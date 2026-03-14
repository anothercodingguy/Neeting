def test_register_user(client):
    response = client.post(
        "/auth/register",
        json={"email": "newuser@example.com", "password": "newpassword"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert "id" in data

def test_register_existing_user(client, test_user):
    response = client.post(
        "/auth/register",
        json={"email": "test@example.com", "password": "password123"}
    )
    assert response.status_code == 400

def test_login_success(client, test_user):
    response = client.post(
        "/auth/login",
        data={"username": "test@example.com", "password": "testpassword"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_failure(client, test_user):
    response = client.post(
        "/auth/login",
        data={"username": "test@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401
